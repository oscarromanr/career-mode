/* ============================================================
   CAREER MODE '26 — controller: state, stages, save/load
   ============================================================ */
(function () {
  'use strict';

  const SAVE_KEY = 'cm26-save-v1';
  let state = null;

  const $ = (id) => document.getElementById(id);
  const T = (key, params) => I18n ? I18n.T(key, params) : key;

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
      const after = (res) => UI.showOutcome(I18n.TData('decision', d, 'title') || d.title, res.out, res.changes, () => enterBooster(), state);
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
      UI.showOutcome(I18n.TData('booster', b, 'title') || b.title, boosterOutcomeText(b), res.changes, () => {
        if (state.stage === 'sim') runSim();
        else enterClub();
      }, state);
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
        const countThisSeason = (state.shopPurchasesSeason === state.season) ? (state.shopPurchasesCount || 0) : 0;
        const maxP = Engine.maxShopPurchases(state);
        const canBuyMore = countThisSeason < maxP;

        UI.showOutcome(
          I18n.TData('consumable', res.item, 'name') || res.item.name,
          shopOutcomeText(res.item),
          res.changes,
          () => {
            UI.renderGame(state, handlers);
            if (canBuyMore && !state.retired) {
              UI.showShop(state, handlers);
            }
          },
          state
        );
      } else {
        UI.showOutcome(T('shop.title'), res.reason, [], () => UI.renderGame(state, handlers), state);
      }
    },
    onHireAgent(agentId) {
      const res = Engine.hireAgent(state, agentId);
      save();
      UI.renderGame(state, handlers);
      if (res.ok) {
        const msg = res.buyoutPaid > 0
          ? T('agent.hiredWithBuyout', { name: res.agent.name, buyout: Engine.fmtValue(res.buyoutPaid) })
          : T('agent.hired', { name: res.agent.name });
        UI.showOutcome(T('agent.title'), msg, [], () => UI.renderGame(state, handlers), state);
      } else {
        UI.showOutcome(T('agent.title'), res.reason, [], () => UI.renderGame(state, handlers), state);
      }
    },
    onSetTargetClub(cid) {
      state.targetClubCid = cid;
      save();
      const club = Engine.clubByCid(cid);
      UI.renderGame(state, handlers);
      UI.showOutcome(T('agent.targetClub'), T('agent.targetSet', { club: club.n }), [], () => UI.renderGame(state, handlers), state);
    },
    onNegotiateCommission(pct) {
      const res = Engine.negotiateCommission(state, pct);
      save();
      UI.renderGame(state, handlers);
      if (!res.ok) {
        UI.showOutcome(T('agent.commission'), res.reason, [], () => UI.renderGame(state, handlers), state);
      } else if (res.accepted) {
        UI.showOutcome(T('agent.commission'), T('agent.commSet', { pct: res.pct }), [], () => UI.renderGame(state, handlers), state);
      } else {
        UI.showOutcome(T('agent.commission'), res.reason, [], () => UI.renderGame(state, handlers), state);
      }
    },
    onRequestTransfer() {
      const res = Engine.requestTransfer(state);
      save();
      UI.renderGame(state, handlers);
      if (res.ok) {
        UI.showOutcome(T('agent.requestMove'), T('agent.transferRequested'), res.changes, () => UI.renderGame(state, handlers), state);
      } else {
        UI.showOutcome(T('agent.requestMove'), res.reason, [], () => UI.renderGame(state, handlers), state);
      }
    },
    onDemandRaise() {
      const res = Engine.demandSalaryRaise(state);
      save();
      UI.renderGame(state, handlers);
      if (!res.ok) {
        UI.showOutcome(T('agent.demandRaise'), res.reason, [], () => UI.renderGame(state, handlers), state);
      } else if (res.success) {
        UI.showOutcome(T('agent.demandRaise'), T('agent.raiseSecured', { salary: Engine.fmtValue(res.newSalary) }), res.changes, () => UI.renderGame(state, handlers), state);
      } else {
        UI.showOutcome(T('agent.demandRaise'), T('agent.raiseDenied'), res.changes, () => UI.renderGame(state, handlers), state);
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
          UI.showOutcome(T('import.failTitle'), T('import.failText'), [], () => {});
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
    return T('shopOut.' + item.name) !== ('shopOut.' + item.name)
      ? T('shopOut.' + item.name)
      : T('shopOut.default');
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
    if (action === 'lang') {
      const newLang = I18n.getLang() === 'en' ? 'es' : 'en';
      I18n.setLang(newLang);
      if (state) {
        UI.renderGame(state, handlers);
      }
      return;
    }
    if (!state) return;
    if (action === 'menu') { if (menu) menu.classList.toggle('hidden'); return; }
    if (menu) menu.classList.add('hidden');
    if (action === 'shop') UI.showShop(state, handlers);
    else if (action === 'export') exportSave();
    else if (action === 'retire') UI.showRetireConfirm(state, handlers);
    else if (action === 'restart') {
      UI.showConfirm({
        kicker: T('restart.kicker'),
        title: T('restart.title'),
        text: T('restart.text', { name: state.player.name, age: state.player.age, n: state.season }),
        warn: T('restart.warn'),
        yesLabel: T('restart.yes'), noLabel: T('retire.no'), danger: true,
        onYes: handlers.onRestart,
      });
    }
  });

  function boosterOutcomeText(b) {
    return T('boosterOut.' + b.rarity);
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
    const lines = I18n.simLines();
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

      const handleNtCheck = () => {
        if (state.triggerNtCallUpModal) {
          const cCode = state.triggerNtCallUpModal;
          state.triggerNtCallUpModal = false;
          UI.showNtCallUpModal(state, cCode, proceedToSummary);
        } else {
          proceedToSummary();
        }
      };

      if (state.triggerNaturalizationModal) {
        const natCid = state.triggerNaturalizationModal;
        state.triggerNaturalizationModal = false;
        UI.showNaturalizationModal(state, natCid, handleNtCheck);
      } else {
        handleNtCheck();
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
