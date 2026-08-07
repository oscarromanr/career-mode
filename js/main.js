/* ============================================================
   CAREER MODE '26 — controller: state, stages, save/load
   ============================================================ */
(function () {
  'use strict';

  const SAVE_KEY = 'cm26-save-v1';
  let state = null;

  const $ = (id) => document.getElementById(id);
  const T = (key, params) => I18n ? I18n.T(key, params) : key;
  const S = GameState;
  const App = GameApp;

  function showScreen(name) {
    ['screen-setup', 'screen-game', 'screen-summary'].forEach((s) => {
      $(s).classList.toggle('hidden', s !== `screen-${name}`);
    });
    window.scrollTo(0, 0);
  }

  function save() {
    if (!state) return;
    try { localStorage.setItem(SAVE_KEY, App.serialize(state)); } catch (e) { /* ignore */ }
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
      state = App.startCareer(setup);
      save();
      showScreen('game');
      UI.renderGame(state, handlers);
    },
    onContinue() {
      const raw = loadSave();
      if (!raw || !raw.player) return;
      const r = App.loadSave(raw);
      if (!r.ok) {
        UI.showOutcome(T('import.failTitle'), T('import.failText'), [], () => {});
        return;
      }
      state = r.state;
      if (S.phaseKind(state) === 'retired') {
        clearSave();
        showScreen('summary');
        UI.renderSummary($('screen-summary'), state, handlers);
        return;
      }
      repairPhase();
      showScreen('game');
      UI.renderGame(state, handlers);
      resumePhase();
    },
    onAcademy(cid) {
      App.chooseAcademy(state, cid);
      save();
      UI.renderGame(state, handlers);
    },
    onDecision(choice) {
      const d = S.getPhase(state).card;
      const r = App.chooseDecision(state, choice);
      save();
      const after = (res) => UI.showOutcome(I18n.TData('decision', d, 'title') || d.title, res.out, res.changes, () => {
        App.enterBooster(state);
        save();
        UI.renderGame(state, handlers);
      }, state);
      if (r.minigame) {
        // Interactive minigame: penalty zones, gk penalty or timing bar
        const done = (resultKey) => {
          const res = App.resolveMiniResult(state, d, choice, resultKey);
          after(res);
        };
        const mini = r.minigame;
        if (mini.type === 'penalty') UI.showPenaltyMini(mini, done);
        else if (mini.type === 'gk_penalty') UI.showGkPenaltyMini(mini, done);
        else UI.showTimingMini(mini, done);
        return;
      }
      const res = r.result;
      if (res.risk) {
        // Suspense bounce before revealing the outcome
        UI.showRiskReveal(res.good, () => after(res));
      } else {
        after(res);
      }
    },
    onDecisionSkip() {
      App.enterBooster(state);
      save();
      UI.renderGame(state, handlers);
    },
    onBooster(boosterId) {
      const b = S.getPhase(state).options.find((x) => x.id === boosterId);
      const changes = App.chooseBooster(state, boosterId);
      save();
      UI.showOutcome(I18n.TData('booster', b, 'title') || b.title, boosterOutcomeText(b), changes, () => {
        runSim();
      }, state);
    },
    onClub(idx) {
      App.chooseClub(state, idx);
      save();
      UI.renderGame(state, handlers);
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
      const isListed = state.clubSituation === 'listed';
      const res = isListed ? Engine.withdrawTransferRequest(state) : Engine.requestTransfer(state);
      save();
      UI.renderGame(state, handlers);
      if (res.ok) {
        const msg = isListed ? (T('agent.transferWithdrawn') || 'Withdrew transfer request. You are no longer transfer listed.') : T('agent.transferRequested');
        UI.showOutcome(T('agent.requestMove'), msg, res.changes, () => UI.renderGame(state, handlers), state);
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
      App.retire(state);
      clearSave();
      showScreen('summary');
      UI.renderSummary($('screen-summary'), state, handlers);
    },
    onImport(file) {
      const reader = new FileReader();
      reader.onload = () => {
        const r = App.loadSave(String(reader.result));
        if (!r.ok) {
          UI.showOutcome(T('import.failTitle'), T('import.failText'), [], () => {});
          return;
        }
        state = r.state;
        save();
        if (S.phaseKind(state) === 'retired') {
          showScreen('summary');
          UI.renderSummary($('screen-summary'), state, handlers);
          return;
        }
        repairPhase();
        showScreen('game');
        UI.renderGame(state, handlers);
        resumePhase();
      };
      reader.readAsText(file);
    },
  };

  function repairPhase() {
    const phase = S.getPhase(state);
    if (phase.kind === 'simulating') { runSim(); return; }
    if (phase.kind === 'club' && (!Array.isArray(phase.offers) || !phase.offers.length)) {
      phase.offers = Engine.clubOffers(state);
    }
    if (phase.kind === 'decision' && !phase.card) phase.card = Engine.pickDecision(state);
    if (phase.kind === 'booster' && (!Array.isArray(phase.options) || !phase.options.length)) {
      phase.options = Engine.rollBoosters(state);
    }
    if (phase.kind === 'academy' && (!Array.isArray(phase.options) || !phase.options.length)) {
      phase.options = Engine.academyOptions(state);
    }
  }

  function shopOutcomeText(item) {
    return T('shopOut.' + item.name) !== ('shopOut.' + item.name)
      ? T('shopOut.' + item.name)
      : T('shopOut.default');
  }

  function exportSave() {
    if (!state) return;
    const blob = new Blob([App.serialize(state)], { type: 'application/json' });
    const a = document.createElement('a');
    const p = state.player;
    a.href = URL.createObjectURL(blob);
    a.download = `career-${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${state.season}.json`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 300);
  }

  function exportDebug() {
    if (!state) return;
    const blob = new Blob([App.debugExport(state)], { type: 'application/json' });
    const a = document.createElement('a');
    const p = state.player;
    a.href = URL.createObjectURL(blob);
    a.download = `debug-${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${state.season}.json`;
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
    else if (action === 'debug-export') exportDebug();
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

  function enterClub() {
    if (S.phaseKind(state) === 'season-summary') {
      App.dismissSummary(state);
    }
    if (S.phaseKind(state) !== 'club') {
      S.setPhase(state, S.club(Engine.clubOffers(state)));
    } else if (!Array.isArray(S.getPhase(state).offers) || !S.getPhase(state).offers.length) {
      S.getPhase(state).offers = Engine.clubOffers(state);
    }
    save();
    UI.renderGame(state, handlers);
  }

  function runSim() {
    S.setPhase(state, S.simulating());
    UI.renderGame(state, handlers);
    // animated fake progress
    const line = $('sim-line');
    const fill = $('sim-fill');
    const lines = I18n.simLines();
    let i = 0;
    const lineTimer = setInterval(() => {
      if (!line) return;
      line.textContent = lines[i % lines.length];
      line.classList.remove('tick');
      void line.offsetWidth;
      line.classList.add('tick');
      i++;
    }, 320);
    if (fill) {
      fill.style.transition = 'width 2.1s cubic-bezier(.2,.7,.3,1)';
      requestAnimationFrame(() => { fill.style.width = '100%'; });
    }

    setTimeout(() => {
      clearInterval(lineTimer);
      const { result } = App.completeSeason(state);
      save();
      UI.renderGame(state, handlers); // update card + history behind modal
      resumePhase(result);
    }, 2300);
  }

  function resumePhase(result) {
    const phase = S.getPhase(state);
    if (phase.kind !== 'season-summary') return;

    const res = result || phase.result;
    const proceedToSummary = () => {
      UI.showSeasonResult(state, res, () => {
        if (state.retired || S.phaseKind(state) === 'retired') {
          clearSave();
          showScreen('summary');
          UI.renderSummary($('screen-summary'), state, handlers);
        } else {
          enterClub();
        }
      });
    };

    // Drain pending season-end effects (naturalization first, then NT call-up)
    const effect = S.peekEffect(state);
    if (!effect) {
      proceedToSummary();
      return;
    }
    S.takeEffect(state, effect.type);
    if (effect.type === 'naturalization') {
      UI.showNaturalizationModal(state, effect.countryId, () => resumePhase(result));
    } else if (effect.type === 'nt-callup') {
      UI.showNtCallUpModal(state, effect.countryCode, () => resumePhase(result));
    } else {
      proceedToSummary();
    }
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
