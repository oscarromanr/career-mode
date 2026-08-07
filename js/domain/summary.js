/* ============================================================
   CAREER MODE '26 - domain: summary
   Retirement and career summary.
   ============================================================ */
(function (root) {
  'use strict';

  const Model = (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports)
    ? require('./model.js')
    : root.DomainModel;
  const Rng = (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports)
    ? require('./rng.js')
    : root.DomainRng;

  const { DATA, clubByCid } = Model;
  const { pick } = Rng;

  // ---- Manual retirement ----
  function retireType(state) {
    const p = state.player;
    const stints = Object.keys(state.clubStints).length;
    const trophies = state.history.reduce((a, h) => a + h.trophies.length, 0);
    if (p.age <= 21 && p.peakOvr >= 70) return 'wonderkid';
    if (p.peakOvr >= 86 && trophies >= 10) return 'legend';
    if (stints >= 8) return 'journeyman';
    if (p.peakOvr >= 80) return 'star';
    if (p.peakOvr >= 72) return 'pro';
    return 'quiet';
  }

  function retire(state) {
    state.retired = true;
    if (!state.retireType) state.retireType = retireType(state);
  }

  // ---- Summary ----
  function careerSummary(state) {
    const p = state.player;
    const counts = { League: 0, Cup: 0, Continental: 0, Country: 0 };
    state.history.forEach((h) => h.trophies.forEach((tr) => {
      counts[tr.type] = (counts[tr.type] || 0) + 1;
    }));
    const stints = Object.values(state.clubStints).sort((a, b) => a.firstYear - b.firstYear).map((s) => {
      const club = clubByCid(s.cid);
      return Object.assign({}, s, { clubName: club.n, countryId: club.countryId, league: club.league });
    });
    const legacy = Math.round(state.totals.goals * 3 + state.totals.assists * 2 + state.totals.apps * 0.2
      + (counts.League * 25 + counts.Cup * 15 + counts.Continental * 40 + counts.Country * 60)
      + p.peakOvr * 2 + (p.isGK ? state.totals.cleanSheets * 1.5 : 0)
      + state.awards.filter((a) => a.id === 'ballon-dor').length * 50
      + state.awards.filter((a) => a.id === 'the-best').length * 30);
    const awardCounts = {};
    state.awards.forEach((a) => {
      if (!awardCounts[a.id]) awardCounts[a.id] = { name: a.name, icon: a.icon, count: 0, years: [] };
      awardCounts[a.id].count += 1;
      awardCounts[a.id].years.push(a.year);
    });
    return {
      name: p.name, number: p.number, position: p.position, countryId: p.countryId, isGK: p.isGK,
      peakOvr: p.peakOvr, peakOvrYear: p.peakOvrYear, peakValue: p.peakValue, peakValueYear: p.peakValueYear,
      totals: state.totals, counts, stints, ntTrophies: state.ntTrophies, seasons: state.history.length,
      legacy, quote: pick(DATA.RETIREMENT_QUOTES),
      earnings: state.earnings, spent: state.spent,
      awards: Object.values(awardCounts),
      retireType: state.retireType || 'full', earlyAge: p.age,
    };
  }

  const Summary = {
    retireType,
    retire,
    careerSummary,
  };

  root.DomainSummary = Summary;
  if (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = Summary;
})(typeof window !== 'undefined' ? window : globalThis);
