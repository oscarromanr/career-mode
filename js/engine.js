/* ============================================================
   CAREER MODE '26 - engine facade
   ============================================================
   Compatibility facade. All domain logic lives in js/domain/*.
   This file preserves the historical public Engine API for the
   UI and legacy callers. New code should import from
   js/domain/index.js (root.Domain) directly.
   ============================================================ */
(function (root) {
  'use strict';

  // Node: load domain modules in dependency order.
  if (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports) {
    require('./domain/rng.js');
    require('./domain/model.js');
    require('./domain/player.js');
    require('./domain/decisions.js');
    require('./domain/agents.js');
    require('./domain/career.js');
    require('./domain/contracts.js');
    require('./domain/offers.js');
    require('./domain/boosters-shop.js');
    require('./domain/season.js');
    require('./domain/national-team.js');
    require('./domain/summary.js');
    require('./domain/index.js');
    try { require('./engine/legends.js'); } catch (e) {}
  }

  const D = root.Domain;

  const Rng = D.rng;
  const Model = D.model;
  const Player = D.player;
  const Decisions = D.decisions;
  const Agents = D.agents;
  const Career = D.career;
  const Contracts = D.contracts;
  const Offers = D.offers;
  const BoostersShop = D.boostersShop;
  const Season = D.season;
  const NationalTeam = D.nationalTeam;
  const Summary = D.summary;
  const STATE = Model.STATE;

  // ---- Legacy migrate: engine-level defaults beyond STATE.migrate ----
  function migrate(state) {
    STATE.migrate(state);
    const p = state.player;
    if (p.stamina === undefined) p.stamina = 85;
    if (p.morale === undefined) p.morale = 70;
    if (state.earnings === undefined) state.earnings = 0;
    if (state.spent === undefined) state.spent = 0;
    if (state.shopSeason === undefined) state.shopSeason = 0;
    if (state.injuryMiss === undefined) state.injuryMiss = 0;
    if (state.injuryShield === undefined) state.injuryShield = false;
    if (state.superAgent === undefined) state.superAgent = false;
    if (state.standings === undefined) state.standings = null;
    if (state.retireType === undefined) state.retireType = null;
    if (state.recentOffers === undefined) state.recentOffers = [];
    if (state.awards === undefined) state.awards = [];
    if (!state.agent) state.agent = Agents.DAD_AGENT;
    if (!state.agentMarket || state.agentMarketSeason !== state.season) {
      state.agentMarket = Agents.rollAgentMarket(state);
      state.agentMarketSeason = state.season;
    }
    if (!state.agentActionsThisSeason) {
      state.agentActionsThisSeason = { transferReq: false, raiseReq: false, commReq: false };
    }
    if (state.transferCommissionPct === undefined) state.transferCommissionPct = 5;
    if (state.totals && state.totals.ntCleanSheets === undefined) {
      // Retroactively estimate ntCleanSheets for GK saves from history
      if (p.isGK && state.totals.caps > 0 && state.history) {
        let estCS = 0;
        state.history.forEach(r => {
          if (r.caps > 0) {
            estCS += Math.min(r.caps, Math.max(0, Math.round(r.caps * 0.4)));
          }
        });
        state.totals.ntCleanSheets = Math.min(state.totals.caps, estCS);
      } else {
        state.totals.ntCleanSheets = 0;
      }
    }
    const hasCaps = (state.totals && state.totals.caps > 0) || (state.history && state.history.some(r => r.caps > 0));
    if (hasCaps) {
      state.ntCalledUp = true;
      if (!state.ntFirstYear && state.history) {
        const firstCapSeason = state.history.find(r => r.caps > 0);
        if (firstCapSeason) state.ntFirstYear = firstCapSeason.year;
      }
    }
    Player.recompute(state);
    return state;
  }

  function continueSeasonSummary(state) {
    const phase = STATE.getPhase(state);
    if (phase.kind !== 'season-summary') return false;
    STATE.setPhase(state, phase.next || STATE.club(null));
    return true;
  }

  const Engine = {
    setRng: Rng.setRng,
    newCareer: Career.newCareer,
    migrate,
    academyOptions: Career.academyOptions,
    setAcademy: Contracts.setAcademy,
    pickDecision: Decisions.pickDecision,
    applyDecision: Decisions.applyDecision,
    applyMiniResult: Decisions.applyMiniResult,
    rollBoosters: BoostersShop.rollBoosters,
    applyBooster: BoostersShop.applyBooster,
    boosterFx: BoostersShop.boosterFx,
    shopItems: BoostersShop.shopItems,
    buyConsumable: BoostersShop.buyConsumable,
    consumableCost: BoostersShop.consumableCost,
    maxShopPurchases: BoostersShop.maxShopPurchases,
    rerollShop: BoostersShop.rerollShop,
    clubOffers: Offers.clubOffers,
    applyClubOffer: Contracts.applyClubOffer,
    simLeague: Season.simLeague,
    simulateSeason: Season.simulateSeason,
    continueSeasonSummary,
    retire: Summary.retire,
    retireType: Summary.retireType,
    careerSummary: Summary.careerSummary,
    computeSeasonAwards: Season.computeSeasonAwards,
    getOvr: Player.getOvr,
    getTier: Player.getTier,
    marketValue: Player.marketValue,
    annualSalary: Player.annualSalary,
    fmtValue: Model.fmtValue,
    recompute: Player.recompute,
    clubByCid: Model.clubByCid,
    countryById: Model.countryById,
    countryName: Model.countryName,
    ALL_CLUBS: Model.ALL_CLUBS,
    allClubs: Model.allClubs,
    statKeys: Model.statKeys,
    normalizeDecision: Decisions.normalizeDecision,
    hireAgent: Agents.hireAgent,
    rollAgentMarket: Agents.rollAgentMarket,
    requestTransfer: Agents.requestTransfer,
    withdrawTransferRequest: Agents.withdrawTransferRequest,
    demandSalaryRaise: Agents.demandSalaryRaise,
    negotiateCommission: Agents.negotiateCommission,
    DAD_AGENT: Agents.DAD_AGENT,
    addReputation: Player.addReputation,
    getLegendForPlayer: NationalTeam.getLegendForPlayer,
    calcContractLength: Contracts.calcContractLength,
    acceptNtCallUp: NationalTeam.acceptNtCallUp,
    declineNtCallUp: NationalTeam.declineNtCallUpTemp,
    declineNtCallUpTemp: NationalTeam.declineNtCallUpTemp,
    rejectNtCallUpPerm: NationalTeam.rejectNtCallUpPerm,
    naturalizeAndSwitchNt: NationalTeam.naturalizeAndSwitchNt,
    domain: D,
  };

  root.Engine = Engine;
  if (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = Engine;
})(typeof window !== 'undefined' ? window : globalThis);
