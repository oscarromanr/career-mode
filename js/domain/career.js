/* ============================================================
   CAREER MODE '26 - domain: career
   Career creation and academy options.
   ============================================================ */
(function (root) {
  'use strict';

  const Model = (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports)
    ? require('./model.js')
    : root.DomainModel;
  const Player = (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports)
    ? require('./player.js')
    : root.DomainPlayer;
  const Rng = (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports)
    ? require('./rng.js')
    : root.DomainRng;
  const Agents = (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports)
    ? require('./agents.js')
    : root.DomainAgents;

  const { DATA, STATE, ALL_CLUBS, statKeys } = Model;
  const { recompute } = Player;
  const { ri, clamp, chance, pick, randomSeed } = Rng;
  const { rollAgentMarket, DAD_AGENT } = Agents;

  function newCareer({ name, number, position, countryId }, seed) {
    const isGK = position === 'GK';
    // Seed the career's random stream BEFORE any draws so every career is
    // reproducible from its saved seed/cursor.
    const rngSeed = (typeof seed === 'number' && seed > 0) ? (seed >>> 0) : Rng.randomSeed();
    let rngCursor = 0;
    Rng.bind({ rngSeed, rngCursor: 0 });
    const stats = {};
    const base = 46 + ri(0, 6);
    statKeys(isGK).forEach((k) => { stats[k] = clamp(base + ri(-4, 6), 38, 58); });
    const potential = 70 + ri(0, 25);
    const p = {
      name: (name || 'New Prodigy').trim().slice(0, 24) || 'New Prodigy',
      number: clamp(parseInt(number, 10) || 10, 1, 99),
      position, countryId, isGK, stats, potential,
      age: 14, ovr: 0, tier: 'bronze', value: 0, salary: 0, hype: 0,
      stamina: 85, morale: 70,
      peakOvr: 0, peakOvrYear: 2026, peakValue: 0, peakValueYear: 2026,
    };
    const state = {
      version: STATE.VERSION,
      player: p,
      season: 2026,
      session: STATE.session(),
      club: null,
      pendingForm: 0,
      pendingNotes: [],
      seasonStatLog: {},
      history: [],
      usedDecisions: [],
      boostPity: 0,
      totals: { apps: 0, goals: 0, assists: 0, saves: 0, conceded: 0, cleanSheets: 0, caps: 0, ntGoals: 0, ntCleanSheets: 0 },
      clubStints: {},
      ntTrophies: [],
      earnings: 0,
      spent: 0,
      shopSeason: 0,
      injuryMiss: 0,
      injuryShield: false,
      superAgent: false,
      standings: null,
      retired: false,
      retireType: null,
      recentOffers: [],
      awards: [],
      ntCalledUp: false,
      ntFirstYear: null,
      agent: DAD_AGENT,
      agentMarket: null,
      agentMarketSeason: 0,
      agentActionsThisSeason: { transferReq: false, raiseReq: false, commReq: false },
      transferCommissionPct: 5,
      rngSeed,
      rngCursor,
    };
    p.reputation = 0;
    Rng.bind(state);
    state.agentMarket = rollAgentMarket(state);
    state.agentMarketSeason = state.season;
    recompute(state);
    p.peakOvr = p.ovr; p.peakValue = p.value;
    return state;
  }

  // ---- Academy choice (first decision of the career) ----
  function academyOptions(state) {
    const countryById = Model.countryById;
    const c = countryById(state.player.countryId);
    const sorted = c.clubs.slice().sort((a, b) => b.s - a.s);
    const opts = [];
    const pushClub = (cl, defaultRole, defaultNote, roleKey, noteKey) => {
      if (cl && !opts.find((o) => o.cid === `${c.id}:${cl.n}`)) {
        opts.push({
          cid: `${c.id}:${cl.n}`,
          club: ALL_CLUBS.find((x) => x.cid === `${c.id}:${cl.n}`),
          role: defaultRole,
          note: defaultNote,
          roleKey,
          noteKey,
          rare: false
        });
      }
    };

    // Randomize choice within top, mid, and lower tier pools
    const topCut = Math.max(1, Math.floor(sorted.length / 3));
    const midCut = Math.max(topCut + 1, Math.floor((2 * sorted.length) / 3));

    const topPool = sorted.slice(0, topCut);
    const topClub = pick(topPool);
    pushClub(topClub, 'Elite academy', 'Best facilities in the region. High pressure, top coaching.', 'academy.role.elite', 'academy.note.elite');

    const midPool = sorted.slice(topCut, midCut).filter((cl) => cl.n !== topClub.n);
    const midClub = pick(midPool.length ? midPool : sorted);
    pushClub(midClub, 'Balanced project', 'Good coaching, realistic path to first team minutes.', 'academy.role.balanced', 'academy.note.balanced');

    const lowPool = sorted.slice(midCut).filter((cl) => !opts.some((o) => o.club.n === cl.n));
    const lowClub = pick(lowPool.length ? lowPool : sorted.filter((cl) => !opts.some((o) => o.club.n === cl.n)));
    pushClub(lowClub, 'Fast track', 'Smaller stage, but early first-team debut opportunities.', 'academy.role.fastTrack', 'academy.note.fastTrack');

    // Rare: European giant academy invitation (~10%)
    if (chance(0.10)) {
      const pool = ALL_CLUBS.filter((x) => x.confed === 'UEFA' && x.s >= 85 && !opts.find((o) => o.cid === x.cid));
      if (pool.length) {
        const x = pick(pool);
        opts[1] = {
          cid: x.cid, club: x,
          role: 'European dream', roleKey: 'academy.role.euro',
          note: 'A once-in-a-lifetime academy offer from a European giant. Extremely rare. Extremely tempting.', noteKey: 'academy.note.euro',
          rare: true,
        };
      }
    }
    return opts;
  }

  const Career = {
    newCareer,
    academyOptions,
  };

  root.DomainCareer = Career;
  if (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = Career;
})(typeof window !== 'undefined' ? window : globalThis);
