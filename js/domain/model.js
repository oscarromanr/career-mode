/* ============================================================
   CAREER MODE '26 - domain: model
   Player, club, career and phase type helpers; static lookups.
   No DOM, no I18n.T calls (returns keys + parameters).
   ============================================================ */
(function (root) {
  'use strict';

  const DATA = (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports)
    ? require('../data.js')
    : root.GAME_DATA;
  const STATE = (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports)
    ? require('../state.js')
    : root.GameState;

  // ---- Lookups ----
  const ALL_CLUBS = [];
  DATA.COUNTRIES.forEach((c) => {
    c.clubs.forEach((cl) => {
      ALL_CLUBS.push({
        cid: `${c.id}:${cl.n}`, countryId: c.id, countryName: c.name, confed: c.confed,
        league: c.league, cup: c.cup, n: cl.n, s: cl.s, b: cl.b || cl.n,
      });
    });
  });

  const clubByCid = (cid) => ALL_CLUBS.find((c) => c.cid === cid);
  const countryById = (id) => DATA.COUNTRIES.find((c) => c.id === id);
  const leagueAvg = (countryId) => {
    const c = countryById(countryId);
    return c.clubs.reduce((a, cl) => a + cl.s, 0) / c.clubs.length;
  };

  const statKeys = (isGK) => (isGK ? DATA.GK_STATS : DATA.FIELD_STATS).map((s) => s.k);

  function fmtValue(v) {
    if (v >= 1e6) return '€' + (v / 1e6).toFixed(v >= 1e7 ? 0 : 1) + 'M';
    return '€' + Math.round(v / 1000) + 'K';
  }

  function countryName(c) {
    if (!c) return '';
    const name = c.name || c;
    if (root.I18n && root.I18n.TCountry) return root.I18n.TCountry(name);
    return name;
  }

  function allClubs() {
    return ALL_CLUBS;
  }

  const Model = {
    DATA,
    STATE,
    ALL_CLUBS,
    clubByCid,
    countryById,
    leagueAvg,
    statKeys,
    fmtValue,
    countryName,
    allClubs,
  };

  root.DomainModel = Model;
  if (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = Model;
})(typeof window !== 'undefined' ? window : globalThis);
