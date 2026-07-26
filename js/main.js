/* ============================================================
   CAREER MODE '26 — controller: state, stages, save/load
   ============================================================ */
(function () {
  'use strict';

  const SAVE_KEY = 'cm26-save-v1';
  let state = null;

  const $ = (id) => document.getElementById(id);

  function showScreen(name) {
    ['screen-setup', 'screen-game', 'screen-summary'].forEach((s) => {
      $(s).classList.toggle('hidden', s !== `screen-${name}`);
    });
    window.scrollTo(0, 0);
  }

  function save() {
    if (!state) return;
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }
  function loadSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function clearSave() {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ }
  }

  const handlers = {
    onStart(setup) {
      state = Engine.newCareer(setup);
      state.currentAcademies = Engine.academyOptions(state);
      save();
      showScreen('game');
      UI.renderGame(state, handlers);
    },
    onContinue() {
      const s = loadSave();
      if (!s || !s.player) return;
      state = Engine.migrate(s);
      if (state.stage === 'retired') {
        clearSave();
        showScreen('summary');
        UI.renderSummary($('screen-summary'), state, handlers);
        return;
      }
      repairStage();
      showScreen('game');
      UI.renderGame(state, handlers);
    },
    onAcademy(cid) {
      Engine.setAcademy(state, cid);
      delete state.currentAcademies;
      enterBooster();
    },
    onDecision(choice) {
      const d = state.currentDecision;
      const opt = d[choice];
      delete state.currentDecision;
      state.stage = 'booster';
      save();
      const after = (res) => UI.showOutcome(d.title, res.out, res.changes, () => enterBooster());
      if (opt.mini) {
        // Interactive minigame: penalty zones, gk penalty or timing bar
        const done = (resultKey) => after(Engine.applyMiniResult(state, d, choice, resultKey));
        if (opt.mini.type === 'penalty') UI.showPenaltyMini(opt.mini, done);
        else if (opt.mini.type === 'gk_penalty') UI.showGkPenaltyMini(opt.mini, done);
        else UI.showTimingMini(opt.mini, done);
        return;
      }
      const res = Engine.applyDecision(state, d, choice);
      save();
      if (res.risk) {
        // Suspense bounce before revealing the outcome
        UI.showRiskReveal(res.good, () => after(res));
      } else {
        after(res);
      }
    },
    onDecisionSkip() {
      state.stage = 'booster';
      enterBooster();
    },
    onBooster(boosterId) {
      const b = state.currentBoosters.find((x) => x.id === boosterId);
      const res = Engine.applyBooster(state, b);
      delete state.currentBoosters;
      // Season 1: skip club stage (you just joined the academy)
      state.stage = state.history.length === 0 ? 'sim' : 'club';
      save();
      UI.showOutcome(b.title, boosterOutcomeText(b), res.changes, () => {
        if (state.stage === 'sim') runSim();
        else enterClub();
      });
    },
    onClub(idx) {
      const offer = state.currentOffers[idx];
      delete state.currentOffers;
      Engine.applyClubOffer(state, offer);
      save();
      runSim();
    },
    onRestart() {
      clearSave();
      state = null;
      boot();
    },
    onShopBuy(id) {
      const res = Engine.buyConsumable(state, id);
      save();
      UI.renderGame(state, handlers);
      if (res.ok) {
        UI.showOutcome(res.item.name, shopOutcomeText(res.item), res.changes, () => UI.renderGame(state, handlers));
      } else {
        UI.showOutcome('Shop', res.reason, [], () => UI.renderGame(state, handlers));
      }
    },
    onRetireConfirm() {
      Engine.retire(state);
      clearSave();
      showScreen('summary');
      UI.renderSummary($('screen-summary'), state, handlers);
    },
    onImport(file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const s = JSON.parse(String(reader.result));
          if (!s || !s.player || !s.stage || !s.player.stats) throw new Error('bad save');
          state = Engine.migrate(s);
          save();
          if (state.stage === 'retired') {
            showScreen('summary');
            UI.renderSummary($('screen-summary'), state, handlers);
            return;
          }
          repairStage();
          showScreen('game');
          UI.renderGame(state, handlers);
        } catch (e) {
          UI.showOutcome('Import failed', 'That file doesn\'t look like a Career Mode \'26 save. No harm done.', [], () => {});
        }
      };
      reader.readAsText(file);
    },
  };

  function repairStage() {
    if (state.stage === 'sim' && !state.history.length) { runSim(); return; }
    if (state.stage === 'sim') state.stage = 'club';
    if (state.stage === 'decision' && !state.currentDecision) state.currentDecision = Engine.pickDecision(state);
    if (state.stage === 'booster' && !state.currentBoosters) state.currentBoosters = Engine.rollBoosters(state);
    if (state.stage === 'club' && !state.currentOffers) state.currentOffers = Engine.clubOffers(state);
    if (state.stage === 'academy' && !state.currentAcademies) state.currentAcademies = Engine.academyOptions(state);
  }

  function shopOutcomeText(item) {
    const map = {
      'Private Chef': 'Macros on point. The nutritionist cries tears of joy.',
      'Hyperbaric Chamber Sessions': 'You emerge from the tube feeling 18 again. Whatever your age.',
      'Elite Mental Coach': 'Three sessions in, you start visualizing success in 4K.',
      'Personal Video Analyst': 'Every touch reviewed. The weak spots never stood a chance.',
      'Personal Trainer': 'He makes you carry a tire up a hill. The tire now fears YOU.',
      'PR & Brand Team': 'Your name is suddenly everywhere. Even your barber has opinions now.',
      'Physio Insurance Package': 'A world-class physio team now shadows you. Injuries: officially on notice.',
      'Custom Lab Boots': 'They weigh nothing. They touch the ball like it\'s magnetized. Weapons-grade.',
      'Mindfulness Retreat': 'One week of silence. You return unable to hear criticism. Literal peace.',
      'Super-Agent Package': 'Your agent now has a bigger suit and three phones. Offers incoming.',
    };
    return map[item.name] || 'Money well spent. Probably.';
  }

  function exportSave() {
    if (!state) return;
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    const p = state.player;
    a.href = URL.createObjectURL(blob);
    a.download = `career-${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${state.season}.json`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 300);
  }

  // Global action delegation (stage header buttons & menu)
  document.addEventListener('click', (ev) => {
    const btn = ev.target.closest('[data-action]');
    const menu = document.getElementById('game-menu');
    if (!btn) {
      if (menu && !menu.classList.contains('hidden') && !ev.target.closest('.stage-actions')) menu.classList.add('hidden');
      return;
    }
    const action = btn.dataset.action;
    if (!state) return;
    if (action === 'menu') { if (menu) menu.classList.toggle('hidden'); return; }
    if (menu) menu.classList.add('hidden');
    if (action === 'shop') UI.showShop(state, handlers);
    else if (action === 'export') exportSave();
    else if (action === 'retire') UI.showRetireConfirm(state, handlers);
    else if (action === 'restart') {
      UI.showConfirm({
        kicker: 'START OVER?',
        title: 'Delete this career?',
        text: `${state.player.name}, age ${state.player.age}, season ${state.season} — everything goes back to the academy gates.`,
        warn: 'This wipes the saved career permanently. There is no undo.',
        yesLabel: 'Delete & restart', noLabel: 'Keep playing', danger: true,
        onYes: handlers.onRestart,
      });
    }
  });

  function boosterOutcomeText(b) {
    const map = {
      bronze: 'Hard work banked. Nobody claps for training camps — until they watch you play.',
      silver: 'Serious work, serious gains. The coaches noticed something shift in you this summer.',
      gold: 'A career-altering camp. You came back a different player. The squad noticed on day one.',
    };
    return map[b.rarity] || map.bronze;
  }

  function enterBooster() {
    state.stage = 'booster';
    state.currentBoosters = Engine.rollBoosters(state);
    save();
    UI.renderGame(state, handlers);
  }

  function enterClub() {
    state.stage = 'club';
    state.currentOffers = Engine.clubOffers(state);
    save();
    UI.renderGame(state, handlers);
  }

  function enterDecision() {
    state.stage = 'decision';
    state.currentDecision = Engine.pickDecision(state);
    save();
    UI.renderGame(state, handlers);
  }

  function runSim() {
    state.stage = 'sim';
    UI.renderGame(state, handlers);
    // animated fake progress
    const line = $('sim-line');
    const fill = $('sim-fill');
    const lines = GAME_DATA.SIM_LINES;
    let i = 0;
    const lineTimer = setInterval(() => {
      line.textContent = lines[i % lines.length];
      line.classList.remove('tick');
      void line.offsetWidth;
      line.classList.add('tick');
      i++;
    }, 320);
    fill.style.transition = 'width 2.1s cubic-bezier(.2,.7,.3,1)';
    requestAnimationFrame(() => { fill.style.width = '100%'; });

    setTimeout(() => {
      clearInterval(lineTimer);
      const res = Engine.simulateSeason(state);
      save();
      UI.renderGame(state, handlers); // update card + history behind modal

      const proceedToSummary = () => {
        UI.showSeasonResult(state, res, () => {
          if (state.retired) {
            clearSave();
            showScreen('summary');
            UI.renderSummary($('screen-summary'), state, handlers);
          } else {
            enterDecision();
          }
        });
      };

      if (state.triggerNtCallUpModal) {
        state.triggerNtCallUpModal = false;
        UI.showNtCallUpModal(state, proceedToSummary);
      } else {
        proceedToSummary();
      }
    }, 2300);
  }

  function boot() {
    const saved = loadSave();
    showScreen('setup');
    UI.renderSetup($('screen-setup'), {
      hasSave: !!(saved && saved.player),
      onStart: handlers.onStart,
      onContinue: handlers.onContinue,
      onImport: handlers.onImport,
    });
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
