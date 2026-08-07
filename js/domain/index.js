/* ============================================================
   CAREER MODE '26 - domain: index (public domain facade)
   Re-exports every domain module as one namespace so the
   application layer and legacy callers have one entry point.
   Load order: rng, model, player, decisions, agents, career,
   contracts, offers, boosters-shop, season, national-team,
   summary.
   ============================================================ */
(function (root) {
  'use strict';

  function ns() {
    const r = root.Domain || {};
    r.rng = root.DomainRng || {};
    r.model = root.DomainModel || {};
    r.player = root.DomainPlayer || {};
    r.decisions = root.DomainDecisions || {};
    r.agents = root.DomainAgents || {};
    r.career = root.DomainCareer || {};
    r.contracts = root.DomainContracts || {};
    r.offers = root.DomainOffers || {};
    r.boostersShop = root.DomainBoostersShop || {};
    r.season = root.DomainSeason || {};
    r.nationalTeam = root.DomainNationalTeam || {};
    r.summary = root.DomainSummary || {};
    root.Domain = r;
    return r;
  }

  root.Domain = ns();
  const D = root.Domain;

  if (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = D;
})(typeof window !== 'undefined' ? window : globalThis);
