/* ============================================================
   CAREER MODE '26 - state model and phase transitions (v4)
   ============================================================
   CareerState  : persistent career data (player, club, history,
                  finances, progression). Serialized with the save.
   SessionState : transient flow state (phase, overlay, pending
                  effects). Also serialized so reloads resume the
                  exact flow without regenerating content.

   Phase is a discriminated union: { kind, payload }. Every kind
   has an explicit payload shape and a validator. The application
   layer owns transitions; domain modules return results/effects.
   ============================================================ */
(function (root) {
  'use strict';

  const VERSION = 4;
  const KINDS = ['academy', 'decision', 'booster', 'club', 'simulating', 'season-summary', 'retired'];
  const OVERLAYS = ['none', 'naturalization', 'national-team'];
  const EFFECT_TYPES = ['naturalization', 'nt-callup'];

  function make(kind, data) {
    return Object.assign({ kind }, data || {});
  }

  // ---- Phase constructors (payloads are explicit; null = pending/quiet) ----
  function academy(options) {
    return make('academy', { options: Array.isArray(options) ? options : null });
  }

  function decision(card) {
    return make('decision', { card: card || null });
  }

  function booster(options) {
    return make('booster', { options: Array.isArray(options) ? options : null });
  }

  function club(offers) {
    return make('club', { offers: Array.isArray(offers) ? offers : null });
  }

  function simulating() {
    return make('simulating');
  }

  function seasonSummary(result, next) {
    return make('season-summary', {
      result: result || null,
      next: next || club(null),
    });
  }

  function retired() {
    return make('retired');
  }

  function validKind(kind) {
    return KINDS.includes(kind);
  }

  function validOverlay(o) {
    return OVERLAYS.includes(o);
  }

  // ---- Session (transient flow state, serialized for reload) ----
  function session(phase, overlay, pendingEffects) {
    return {
      phase: phase && validKind(phase.kind) ? phase : academy(null),
      overlay: validOverlay(overlay) ? overlay : 'none',
      pendingEffects: Array.isArray(pendingEffects) ? pendingEffects : [],
    };
  }

  function getSession(state) {
    if (!state.session || typeof state.session !== 'object') state.session = session();
    return state.session;
  }

  // ---- Effect queue (season-end overlays: naturalization, NT call-up) ----
  function pushEffect(state, effect) {
    if (!effect || !EFFECT_TYPES.includes(effect.type)) return null;
    getSession(state).pendingEffects.push(effect);
    return effect;
  }

  function peekEffect(state, type) {
    const list = getSession(state).pendingEffects;
    if (type) return list.find((e) => e.type === type) || null;
    return list.length ? list[0] : null;
  }

  function takeEffect(state, type) {
    const s = getSession(state);
    const idx = type ? s.pendingEffects.findIndex((e) => e.type === type) : 0;
    if (idx === -1) return null;
    return s.pendingEffects.splice(idx, 1)[0];
  }

  // ---- Legacy phase reconstruction (v1/v2 saves: stage + current* fields) ----
  function phaseFromLegacy(state) {
    if (state.retired || state.stage === 'retired') return retired();

    switch (state.stage) {
      case 'academy': return academy(state.currentAcademies);
      case 'decision':
        // Saves made immediately after a season used decision as a temporary stage
        // before the result modal moved the player to the club market.
        if (!state.currentDecision && state.history && state.history.length
          && state.season === state.history[0].year + 1) {
          return seasonSummary(state.history[0], club(null));
        }
        return decision(state.currentDecision);
      case 'booster': return booster(state.currentBoosters);
      case 'club': return club(state.currentOffers);
      case 'sim': return simulating();
      default: return academy(state.currentAcademies);
    }
  }

  function normalizeNext(next) {
    if (!next || !validKind(next.kind)) return club(null);
    if (next.kind === 'club') return club(next.offers);
    if (next.kind === 'retired') return retired();
    return club(null);
  }

  function normalizePhase(phase) {
    if (!phase || !validKind(phase.kind)) return academy(null);
    switch (phase.kind) {
      case 'academy': return academy(phase.options);
      case 'decision': return decision(phase.card);
      case 'booster': return booster(phase.options);
      case 'club': return club(phase.offers);
      case 'simulating': return simulating();
      case 'season-summary': return seasonSummary(phase.result, normalizeNext(phase.next));
      case 'retired': return retired();
      default: return academy(null);
    }
  }

  // ---- Migration (one-way, each version tested) ----
  // v1/v2: stage + current* fields. v3: top-level phase + modal flags.
  // v4: session { phase, overlay, pendingEffects }.
  function migrate(state) {
    if (!state || typeof state !== 'object') throw new Error('Invalid career state');
    const v = typeof state.version === 'number' ? state.version : 1;

    if (v >= VERSION && state.session && validKind(state.session.phase && state.session.phase.kind)) {
      state.session = session(normalizePhase(state.session.phase), state.session.overlay, state.session.pendingEffects);
      return state;
    }

    const phase = (state.phase && validKind(state.phase.kind))
      ? normalizePhase(state.phase)
      : phaseFromLegacy(state);

    const effects = [];
    if (typeof state.triggerNaturalizationModal === 'string') {
      effects.push({ type: 'naturalization', countryId: state.triggerNaturalizationModal });
      delete state.triggerNaturalizationModal;
    }
    if (typeof state.triggerNtCallUpModal === 'string') {
      effects.push({ type: 'nt-callup', countryCode: state.triggerNtCallUpModal });
      delete state.triggerNtCallUpModal;
    }

    delete state.phase;
    delete state.stage;
    delete state.currentAcademies;
    delete state.currentDecision;
    delete state.currentBoosters;
    delete state.currentOffers;
    delete state.isViewingSummary;

    state.session = session(phase, 'none', effects);
    state.version = VERSION;
    return state;
  }

  // ---- Phase payload validation ----
  function validatePhase(phase) {
    const errors = [];
    if (!phase || typeof phase !== 'object') { errors.push('phase: missing'); return errors; }
    if (!validKind(phase.kind)) { errors.push('phase: invalid kind "' + phase.kind + '"'); return errors; }
    switch (phase.kind) {
      case 'academy':
        if (phase.options !== null && !Array.isArray(phase.options)) errors.push('academy: options must be an array or null');
        break;
      case 'decision':
        if (phase.card !== null && (!phase.card || typeof phase.card !== 'object')) errors.push('decision: card must be a card or null (quiet week)');
        break;
      case 'booster':
        if (phase.options !== null && !Array.isArray(phase.options)) errors.push('booster: options must be an array or null');
        break;
      case 'club':
        if (phase.offers !== null && !Array.isArray(phase.offers)) errors.push('club: offers must be an array or null');
        break;
      case 'season-summary':
        if (!phase.result || typeof phase.result !== 'object' || !phase.result.year) errors.push('season-summary: result is required');
        if (!phase.next || !validKind(phase.next.kind)) errors.push('season-summary: next phase is required');
        break;
      case 'simulating':
      case 'retired':
        break;
    }
    return errors;
  }

  // ---- Full runtime validation (imported JSON / localStorage) ----
  function validate(state) {
    const errors = [];
    if (!state || typeof state !== 'object') { errors.push('state: not an object'); return { ok: false, errors }; }
    if (state.version !== VERSION) errors.push('version: expected ' + VERSION + ', got ' + state.version);
    if (!state.player || typeof state.player !== 'object') {
      errors.push('player: missing');
    } else {
      if (typeof state.player.name !== 'string' || !state.player.name.trim()) errors.push('player.name: missing');
      if (typeof state.player.position !== 'string') errors.push('player.position: missing');
      if (typeof state.player.isGK !== 'boolean') errors.push('player.isGK: missing');
      if (typeof state.player.age !== 'number' || state.player.age < 10) errors.push('player.age: invalid');
      if (typeof state.player.ovr !== 'number' || state.player.ovr < 35 || state.player.ovr > 99) errors.push('player.ovr: invalid');
      if (!state.player.stats || typeof state.player.stats !== 'object') errors.push('player.stats: missing');
    }
    if (typeof state.season !== 'number' || state.season < 2026) errors.push('season: invalid');
    if (!Array.isArray(state.history)) errors.push('history: must be an array');
    if (typeof state.earnings !== 'number' || state.earnings < 0) errors.push('earnings: invalid');
    if (typeof state.spent !== 'number' || state.spent < 0) errors.push('spent: invalid');
    if (typeof state.retired !== 'boolean') errors.push('retired: missing');
    if (state.rngSeed !== undefined && (typeof state.rngSeed !== 'number' || state.rngSeed <= 0)) errors.push('rngSeed: invalid');
    if (state.rngCursor !== undefined && (typeof state.rngCursor !== 'number' || state.rngCursor < 0)) errors.push('rngCursor: invalid');
    const s = state.session;
    if (!s || typeof s !== 'object') {
      errors.push('session: missing');
    } else {
      validatePhase(s.phase).forEach((e) => errors.push('session.' + e));
      if (!validOverlay(s.overlay)) errors.push('session.overlay: invalid "' + s.overlay + '"');
      if (!Array.isArray(s.pendingEffects)) errors.push('session.pendingEffects: must be an array');
      else s.pendingEffects.forEach((e, i) => {
        if (!e || !EFFECT_TYPES.includes(e.type)) errors.push('session.pendingEffects[' + i + ']: invalid effect');
      });
    }
    return { ok: errors.length === 0, errors };
  }

  // ---- Phase access (session-owned) ----
  function getPhase(state) {
    const s = getSession(state);
    if (!s.phase || !validKind(s.phase.kind)) s.phase = academy(null);
    return s.phase;
  }

  function phaseKind(state) {
    return getPhase(state).kind;
  }

  function setPhase(state, next) {
    if (!next || !validKind(next.kind)) throw new Error('Invalid career phase');
    getSession(state).phase = next;
    return next;
  }

  function selectPhase(state) {
    return getPhase(state);
  }

  function selectOverlay(state) {
    const e = peekEffect(state);
    if (!e) return 'none';
    return e.type === 'naturalization' ? 'naturalization' : 'national-team';
  }

  const State = {
    VERSION,
    KINDS,
    OVERLAYS,
    EFFECT_TYPES,
    academy,
    decision,
    booster,
    club,
    simulating,
    seasonSummary,
    retired,
    session,
    migrate,
    getPhase,
    setPhase,
    phaseKind,
    selectPhase,
    selectOverlay,
    validate,
    validatePhase,
    pushEffect,
    peekEffect,
    takeEffect,
  };

  root.GameState = State;
  if (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = State;
})(typeof window !== 'undefined' ? window : globalThis);
