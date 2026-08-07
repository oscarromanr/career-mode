/* ============================================================
   CAREER MODE '26 - application layer
   ============================================================
   Single owner of phase transitions. Domain modules (Engine)
   return results/effects; this layer decides the next phase and
   validates every transition. Also owns save load/validate and
   RNG binding for deterministic simulation.
   ============================================================ */
(function (root) {
  'use strict';

  const STATE = (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports)
    ? require('./state.js')
    : root.GameState;
  const ENGINE = (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports)
    ? require('./engine.js')
    : root.Engine;
  const RNG = (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports)
    ? require('./domain/rng.js')
    : root.DomainRng;

  const VERSION = STATE.VERSION;
  const GAME_VERSION = 'cm26';

  // ---- Persistence ----
  // loadSave(raw) -> { ok:true, state } | { ok:false, error, errors?, message? }
  function loadSave(raw) {
    let data = raw;
    if (typeof raw === 'string') {
      try { data = JSON.parse(raw); } catch (e) { return { ok: false, error: 'parse', message: 'Save is not valid JSON' }; }
    }
    if (!data || typeof data !== 'object' || Array.isArray(data)) return { ok: false, error: 'shape' };

    // Accept the save envelope ({ schemaVersion, savedAt, state }) or the
    // bare career state.
    const inner = (data.schemaVersion !== undefined && data.state && typeof data.state === 'object')
      ? data.state
      : data;

    if (!inner.player || typeof inner.player !== 'object' || !inner.player.stats) return { ok: false, error: 'player' };
    let state;
    try {
      state = ENGINE.migrate(inner);
    } catch (e) {
      return { ok: false, error: 'migrate', message: e && e.message ? e.message : 'Migration failed' };
    }
    const v = STATE.validate(state);
    if (!v.ok) return { ok: false, error: 'invalid', errors: v.errors };
    RNG.bind(state);
    return { ok: true, state };
  }

  // Save envelope: schemaVersion, savedAt, gameVersion, state, rng seed info.
  function serialize(state) {
    const env = {
      schemaVersion: VERSION,
      savedAt: new Date().toISOString(),
      gameVersion: GAME_VERSION,
      state,
      rng: RNG.seedInfo() || { seed: state.rngSeed || null, cursor: state.rngCursor || 0 },
    };
    return JSON.stringify(env);
  }

  // Debug export: envelope + rng + recent actions + phase, for bug reports.
  function debugExport(state) {
    return JSON.stringify({
      schemaVersion: VERSION,
      savedAt: new Date().toISOString(),
      gameVersion: GAME_VERSION,
      state,
      rng: RNG.seedInfo() || { seed: state.rngSeed || null, cursor: state.rngCursor || 0 },
      phase: STATE.getPhase(state),
      overlay: STATE.selectOverlay(state),
      recentActions: (state.recentActions || []).slice(-20),
    }, null, 2);
  }

  function recordAction(state, action) {
    if (!state.recentActions) state.recentActions = [];
    state.recentActions.push({ action, at: new Date().toISOString() });
    if (state.recentActions.length > 50) state.recentActions = state.recentActions.slice(-50);
  }

  // ---- Phase selectors ----
  function selectPhase(state) {
    return STATE.selectPhase(state);
  }

  function selectOverlay(state) {
    return STATE.selectOverlay(state);
  }

  // ---- Transition guard ----
  function requirePhase(state, kind) {
    const current = STATE.phaseKind(state);
    if (current !== kind) {
      throw new Error('Invalid action for phase "' + current + '" (expected "' + kind + '")');
    }
  }

  // ---- Transitions (the ONLY layer that calls STATE.setPhase) ----
  function startCareer(setup, seed) {
    const state = ENGINE.newCareer(setup, seed);
    RNG.bind(state);
    STATE.setPhase(state, STATE.academy(ENGINE.academyOptions(state)));
    return state;
  }

  function chooseAcademy(state, cid) {
    requirePhase(state, 'academy');
    RNG.bind(state);
    ENGINE.setAcademy(state, cid);
    STATE.setPhase(state, STATE.decision(ENGINE.pickDecision(state)));
    recordAction(state, { type: 'choose-academy', cid });
  }

  // Returns { result } or { minigame: opt.mini }. Phase moves to booster(null)
  // before the outcome is shown so a mid-outcome reload repairs to boosters.
  function chooseDecision(state, choice) {
    requirePhase(state, 'decision');
    RNG.bind(state);
    const rawCard = STATE.getPhase(state).card;
    if (!rawCard) throw new Error('No decision card to choose');
    // Cards stored in the phase may be legacy a/b/c or canonical options[];
    // normalize so choice lookup works for both.
    const d = ENGINE.normalizeDecision(rawCard);
    const opt = d[choice];
    if (!opt) throw new Error('Invalid decision choice "' + choice + '"');
    STATE.setPhase(state, STATE.booster(null));
    if (opt.mini) return { minigame: opt.mini };
    recordAction(state, { type: 'choose-decision', decision: d.id, choice });
    return { result: ENGINE.applyDecision(state, d, choice) };
  }

  function resolveMiniResult(state, decision, choice, resultKey) {
    requirePhase(state, 'booster');
    RNG.bind(state);
    recordAction(state, { type: 'resolve-minigame', decision: decision.id, choice, resultKey });
    return ENGINE.applyMiniResult(state, decision, choice, resultKey);
  }

  function enterBooster(state) {
    const kind = STATE.phaseKind(state);
    if (kind !== 'decision' && kind !== 'booster') throw new Error('Cannot enter booster from phase "' + kind + '"');
    RNG.bind(state);
    STATE.setPhase(state, STATE.booster(ENGINE.rollBoosters(state)));
  }

  function chooseBooster(state, id) {
    requirePhase(state, 'booster');
    RNG.bind(state);
    const options = STATE.getPhase(state).options || [];
    const b = options.find((x) => x.id === id);
    if (!b) throw new Error('Unknown booster "' + id + '"');
    recordAction(state, { type: 'choose-booster', id });
    const changes = ENGINE.applyBooster(state, b);
    STATE.setPhase(state, STATE.simulating());
    return changes;
  }

  function chooseClub(state, idx) {
    requirePhase(state, 'club');
    RNG.bind(state);
    const offers = STATE.getPhase(state).offers || [];
    const offer = offers[idx];
    if (!offer) throw new Error('Invalid club offer index ' + idx);
    recordAction(state, { type: 'choose-club', idx, cid: offer.club.cid });
    ENGINE.applyClubOffer(state, offer);
    STATE.setPhase(state, STATE.decision(ENGINE.pickDecision(state)));
  }

  // Simulates the season; domain returns the result, this layer builds the
  // season-summary phase with the pre-generated next offers.
  function completeSeason(state) {
    requirePhase(state, 'simulating');
    RNG.bind(state);
    const res = ENGINE.simulateSeason(state);
    if (state.retired) {
      STATE.setPhase(state, STATE.retired());
    } else {
      STATE.setPhase(state, STATE.seasonSummary(res, STATE.club(res.nextOffers || [])));
    }
    recordAction(state, { type: 'complete-season', year: res.year });
    return { result: res };
  }

  // Reveals the exact offers stored in the summary. Never rerolls.
  function dismissSummary(state) {
    requirePhase(state, 'season-summary');
    RNG.bind(state);
    const phase = STATE.getPhase(state);
    STATE.setPhase(state, phase.next || STATE.club(null));
  }

  function retire(state) {
    RNG.bind(state);
    ENGINE.retire(state);
    STATE.setPhase(state, STATE.retired());
  }

  const App = {
    VERSION,
    GAME_VERSION,
    loadSave,
    serialize,
    debugExport,
    selectPhase,
    selectOverlay,
    startCareer,
    chooseAcademy,
    chooseDecision,
    resolveMiniResult,
    enterBooster,
    chooseBooster,
    chooseClub,
    completeSeason,
    dismissSummary,
    retire,
  };

  root.GameApp = App;
  if (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = App;
})(typeof window !== 'undefined' ? window : globalThis);
