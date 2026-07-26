/* ============================================================
   CAREER MODE '26 — game engine (pure logic, no DOM)
   Testable in Node via test/sim-test.js
   ============================================================ */
(function (root) {
  'use strict';

  const DATA = (typeof module !== 'undefined' && module.exports)
    ? require('./data.js')
    : root.GAME_DATA;

  // ---- RNG (injectable for tests) ----
  let RNG = Math.random;
  const rnd = () => RNG();
  const ri = (min, max) => min + Math.floor(RNG() * (max - min + 1)); // inclusive
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const chance = (p) => RNG() < p;
  const pick = (arr) => arr[Math.floor(RNG() * arr.length)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(RNG() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

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

  function getOvr(stats, position) {
    const w = DATA.OVR_WEIGHTS[position];
    let sum = 0, wsum = 0;
    Object.keys(w).forEach((k) => { sum += (stats[k] || 40) * w[k]; wsum += w[k]; });
    return clamp(Math.round(sum / wsum), 35, 99);
  }

  function getTier(ovr) {
    if (ovr >= 87) return 'diamond';
    if (ovr >= 75) return 'gold';
    if (ovr >= 65) return 'silver';
    return 'bronze';
  }

  function marketValue(p) {
    const base = Math.pow(Math.max(p.ovr - 50, 1), 3) * 1200;
    const a = p.age;
    let ageF;
    if (a <= 18) ageF = 1.1 + Math.max(0, p.potential - p.ovr) * 0.02;
    else if (a <= 21) ageF = 1.25;
    else if (a <= 24) ageF = 1.35;
    else if (a <= 28) ageF = 1.25;
    else if (a <= 30) ageF = 1.0;
    else if (a <= 32) ageF = 0.7;
    else if (a <= 34) ageF = 0.45;
    else ageF = 0.25;
    const hype = 1 + (p.hype || 0) * 0.004;
    const v = Math.round((base * ageF * hype) / 10000) * 10000;
    return Math.max(v, 25000);
  }

  function annualSalary(p, state) {
    let s = clamp(p.value * 0.11, 15000, 40000000);
    if (p.age < 18) s *= 0.25;
    if (state && state.superAgent) s *= 1.35;
    return Math.round(s / 1000) * 1000;
  }

  function fmtValue(v) {
    if (v >= 1e6) return '€' + (v / 1e6).toFixed(v >= 1e7 ? 0 : 1) + 'M';
    return '€' + Math.round(v / 1000) + 'K';
  }

  // ---- Career creation ----
  function newCareer({ name, number, position, countryId }) {
    const isGK = position === 'GK';
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
      version: 2,
      player: p,
      season: 2026,
      stage: 'academy', // academy -> decision -> booster -> club -> sim
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
    };
    p.reputation = 0;
    state.agentMarket = rollAgentMarket(state);
    state.agentMarketSeason = state.season;
    recompute(state);
    p.peakOvr = p.ovr; p.peakValue = p.value;
    return state;
  }

  function addReputation(state, d) {
    if (!state.player) return;
    const before = state.player.reputation || 0;
    state.player.reputation = clamp(before + d, 0, 100);
  }

  function countryName(c) {
    if (!c) return '';
    const name = c.name || c;
    if (root.I18n && root.I18n.TCountry) return root.I18n.TCountry(name);
    return name;
  }

  function outcomeText(decisionId, key, fallback) {
    if (root.I18n && root.I18n.TD) {
      const translated = root.I18n.TD('decisionOutcomes', decisionId, key);
      if (translated) return translated;
    }
    return fallback;
  }

  // ---- Agent System & Name Generator ----
  const FIRST_NAMES = ['Carlos', 'Jorge', 'Marco', 'Matteo', 'Pierre', 'Hugo', 'Lucas', 'Julian', 'Diego', 'Gabriel', 'Sven', 'Lars', 'Felix', 'Arthur', 'Bruno'];
  const LAST_NAMES = ['Mendes', 'Raiola', 'Zahavi', 'Barnett', 'Ramadani', 'Struth', 'Bertolucci', 'Riso', 'Pastorello', 'Gallardo', 'Schneider', 'Vargas', 'Silva'];

  function generateAgentName() {
    return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
  }

  const DAD_AGENT = {
    id: 'dad',
    name: 'Family Agent (Dad)',
    type: 'dad',
    patience: 90,
    greed: 25,
    negotiation: 45,
    annualSalary: 0,
    buyoutFee: 0,
  };

  function rollAgentMarket(state) {
    const p = state.player;
    const baseSal = Math.round(p.salary * 0.04 / 25000) * 25000;
    const agents = [DAD_AGENT];
    for (let i = 1; i <= 3; i++) {
      const pat = ri(35, 88);
      const greed = ri(35, 90);
      const neg = ri(45, 95);
      const sal = Math.max(50000, Math.round((baseSal * (0.6 + neg * 0.01)) / 25000) * 25000);
      const buyout = sal * ri(2, 4);
      agents.push({
        id: `agent_${state.season}_${i}`,
        name: generateAgentName(),
        type: neg >= 85 ? 'super' : (greed >= 75 ? 'greedy' : 'pro'),
        patience: pat,
        greed,
        negotiation: neg,
        annualSalary: sal,
        buyoutFee: buyout,
      });
    }
    return agents;
  }

  function allClubs() {
    return ALL_CLUBS;
  }

  function hireAgent(state, agentId) {
    const market = state.agentMarket || rollAgentMarket(state);
    const candidate = market.find((a) => a.id === agentId);
    if (!candidate) return { ok: false, reason: 'Agent not found' };

    const current = state.agent || DAD_AGENT;
    if (current.id === candidate.id) return { ok: false, reason: 'Already your active agent' };

    const buyout = (current.type !== 'dad' && current.buyoutFee) ? current.buyoutFee : 0;
    const netBanked = state.earnings - state.spent;
    if (buyout > 0 && netBanked < buyout) {
      const T = (k, p) => root.I18n ? root.I18n.T(k, p) : k;
      return { ok: false, reason: T('agent.cantAffordBuyout', { amount: fmtValue(buyout) }) };
    }

    if (buyout > 0) {
      state.spent += buyout;
      logStatNote(state, `Paid ${fmtValue(buyout)} release buyout clause to fire ${current.name}`);
    }

    state.agent = candidate;
    logStatNote(state, `Hired ${candidate.name} as active agent`);
    return { ok: true, agent: candidate, buyoutPaid: buyout };
  }

  function requestTransfer(state) {
    if (!state.agentActionsThisSeason) state.agentActionsThisSeason = {};
    if (state.agentActionsThisSeason.transferReq) {
      return { ok: false, reason: 'Already requested a transfer this season' };
    }

    state.agentActionsThisSeason.transferReq = true;
    state.player.hype = Math.min(100, (state.player.hype || 0) + 15);
    state.player.morale = Math.max(5, state.player.morale - 10);

    const isLoan = !!(state.club && state.club.loan);
    const changes = [{ k: 'HYPE', d: 15 }, { k: 'MOR', d: -10 }];
    if (!isLoan) {
      state.player.loyalty = Math.max(5, (state.player.loyalty || 20) - 20);
      changes.push({ k: 'LOYALTY', d: -20 });
    } else {
      state.requestedLoanPermanentMove = true;
    }
    state.transferRequestBenched = true;

    return { ok: true, changes };
  }

  function demandSalaryRaise(state) {
    if (!state.agentActionsThisSeason) state.agentActionsThisSeason = {};
    if (state.agentActionsThisSeason.raiseReq) {
      return { ok: false, reason: 'Already demanded a wage raise this season' };
    }

    state.agentActionsThisSeason.raiseReq = true;
    const agent = state.agent || DAD_AGENT;
    const cur = clubByCid(state.club.cid);
    const p = state.player;

    const baseSuccess = p.ovr >= cur.s - 3 ? 0.65 : (p.ovr >= cur.s - 6 ? 0.40 : 0.20);
    const negBonus = (agent.negotiation - 50) * 0.006;
    const prob = clamp(baseSuccess + negBonus, 0.10, 0.90);

    if (chance(prob)) {
      const greedMultiplier = 1 + (agent.greed / 300);
      const newSalary = Math.round(p.salary * greedMultiplier / 50000) * 50000;
      p.salary = Math.max(p.salary + 50000, newSalary);
      logStatNote(state, `Agent ${agent.name} secured wage increase to ${fmtValue(p.salary)}/yr`);
      return { ok: true, success: true, newSalary, changes: [] };
    } else {
      p.morale = Math.max(5, p.morale - 8);
      p.loyalty = Math.max(5, (p.loyalty || 20) - 5);
      return { ok: true, success: false, changes: [{ k: 'MOR', d: -8 }, { k: 'LOYALTY', d: -5 }] };
    }
  }

  function negotiateCommission(state, requestedPct) {
    if (!state.agentActionsThisSeason) state.agentActionsThisSeason = {};
    if (state.agentActionsThisSeason.commReq) {
      return { ok: false, reason: 'Already negotiated transfer cut this season' };
    }

    state.agentActionsThisSeason.commReq = true;
    const agent = state.agent || DAD_AGENT;

    if (requestedPct <= 5) {
      state.transferCommissionPct = 5;
      return { ok: true, pct: 5, accepted: true };
    }

    if (requestedPct === 8) {
      if (agent.greed >= 40 || agent.negotiation >= 55) {
        state.transferCommissionPct = 8;
        return { ok: true, pct: 8, accepted: true };
      }
    } else if (requestedPct >= 12) {
      if (agent.greed >= 70 && agent.negotiation >= 70) {
        state.transferCommissionPct = 12;
        return { ok: true, pct: 12, accepted: true };
      }
    }

    return {
      ok: true,
      pct: state.transferCommissionPct || 5,
      accepted: false,
      reason: `Agent ${agent.name} deemed a ${requestedPct}% cut unrealistic.`
    };
  }

  // Old saves: fill in fields introduced in v2
  function migrate(state) {
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
    if (!state.agent) state.agent = DAD_AGENT;
    if (!state.agentMarket || state.agentMarketSeason !== state.season) {
      state.agentMarket = rollAgentMarket(state);
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
    recompute(state);
    return state;
  }

  // ---- Academy choice (first decision of the career) ----
  function academyOptions(state) {
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

  function setAcademy(state, cid) {
    state.club = { cid, loan: false };
    state.stage = 'booster';
    recompute(state);
    const T = (k, params) => root.I18n ? root.I18n.T(k, params) : k;
    logStatNote(state, T('note.joinedAcademy', { club: clubByCid(cid).n }));
  }

  // ---- Decision cards ----
  function decisionEligible(state, d) {
    const p = state.player;
    if (p.age < d.min || p.age > d.max) return false;
    if (d.pos === 'gk' && !p.isGK) return false;
    if (d.pos === 'field' && p.isGK) return false;
    if (Array.isArray(d.pos) && !d.pos.includes(p.position)) return false;
    if (state.usedDecisions.includes(d.id)) return false;
    if (d.id === 'ballon-campaign' && p.ovr < 82) return false;
    if (d.id === 'last-dance' && p.ovr < 76) return false;
    if (d.id === 'semi-pen' && p.ovr < 74) return false;
    if (d.id === 'shootout-hero' && p.ovr < 68) return false;

    // Gating for National Team decisions — only eligible once called up to National Team!
    const isNtDecision = d.requiresNt || ['national-legend-call', 'legend-mentor-session', 'international-fumes', 'gk-number-one-race'].includes(d.id);
    if (isNtDecision && !state.ntCalledUp && (!state.totals || !state.totals.caps)) return false;

    return true;
  }

  function pickDecision(state) {
    const pool = DATA.DECISIONS.filter((d) => decisionEligible(state, d));
    if (!pool.length) return null;
    // position-specific cards get double weight
    const weighted = pool.flatMap((d) => (Array.isArray(d.pos) ? [d, d] : [d]));
    return pick(weighted);
  }

  const RISK_OUTCOMES = {
    'injury-scare': {
      good: 'You score in the showcase. The scout\'s notebook reads: "warrior mentality". Three clubs call your agent.',
      bad: 'Twenty minutes in, the hamstring pings. Weeks of physio. The scout\'s note just says "fragile?"',
    },
    'semi-pen': {
      good: 'The Panenka floats in slow motion. The keeper is already on the floor. The stadium absolutely loses its mind.',
      bad: 'The Panenka floats... straight into the keeper\'s chest. He doesn\'t even celebrate. That\'s worse.',
    },
    'pen-practice': {
      good: 'Top corner, crossbar, top corner again. Penalty duties: secured. The regular taker applauds through gritted teeth.',
      bad: 'You blaze the decider over the bar. The keeper does a small dance. Duties: not secured.',
    },
    'first-red': {
      good: 'Appeal WON. Red card rescinded. The referee gets a "performance review". Vindication is sweet.',
      bad: 'Appeal rejected — and extended for a "frivolous claim". The system is rigged. Probably.',
    },
    'broken-promise': {
      good: 'He listens. Really listens. You start Sunday and score. Trust rebuilt brick by brick.',
      bad: '"My door is always open," he says, while closing it. You train in silent rage for a month.',
    },
    'bungee': {
      good: 'You swan-dive off a bridge, screaming. The squad loses its mind. Fear: conquered.',
      bad: 'You clip the platform edge on the rebound. Nothing broken, everything bruised. The physio\'s tears were justified.',
    },
    'karting-gp': {
      good: 'P1! The curse is broken! Victory lap with the trophy. The physio staff demands a VAR review.',
      bad: 'P7. A mechanic beat you. The drought enters year four. The group chat is merciless.',
    },
    'record-pen': {
      good: 'He hands you the ball. Top corner. The record is YOURS. The announcer loses his voice.',
      bad: 'Saved. The keeper stands over you. The record waits. Your negotiation attempt goes viral for the wrong reasons.',
    },
    'chess-club': {
      good: 'Checkmate in 19 moves. The humming stops. Champion of two sports.',
      bad: 'He sacrifices a rook and it WORKS. The humming intensifies. Rematch demanded. Weekly.',
    },
    'contract-three-way': {
      good: 'You bet on yourself and ball out. Next summer: double the money, triple the suitors.',
      bad: 'A quiet year at the worst possible time. The renewal offer drops 30%. Betting on yourself is still betting.',
    },
    'farewell-speech': {
      good: 'You hold it for four minutes, then crack at the away-bus anecdote. Standing ovation. Beautiful.',
      bad: 'You last eleven seconds before sobbing. The clip is beloved. You are now "the crier". Forever.',
    },
    'five-a-side': {
      good: 'You score six and nobody gets hurt. The boys win the grudge match. A decade of bragging rights.',
      bad: 'A horror tackle from accountant Dave. Ankle balloons. The club finds out via Instagram. Awkward meeting.',
    },
    'tattoo': {
      good: 'It\'s perfect. Clean lines, perfect numerals. Mom finds out via Instagram and... likes it?',
      bad: 'The artist misreads XIX as XXI. The wrong date is now on your neck. Laser appointments booked.',
    },
    'startup-pitch': {
      good: 'The app gets acquired by a real tech company. Your €200K becomes €1.4M. Accidental business genius.',
      bad: 'The app folds in six months. The clip art was the tell. You buy him a consolatory coffee.',
    },
    'driving-test': {
      good: 'PASSED. First time. You drive to training the next day playing your own playlist. Loud.',
      bad: 'Failed on parallel parking. The instructor writes "interesting technique". The group chat finds out.',
    },
    'dad-agent': {
      good: 'Dad negotiates like a man possessed. Solid deal AND a boot bonus. Agent Dad is officially real.',
      bad: 'Dad argues with the sporting director about "respect". Talks freeze for a month. You hire a real agent.',
    },
    'stadium-proposal': {
      good: 'She says YES. 60,000 people erupt. The jumbotron moment of the season. Maybe the decade.',
      bad: 'She says "can we talk about this later?" The stadium goes silent. The clip trends for a week. Brutal.',
    },
    'soundcloud': {
      good: 'The fifth single is... actually good? 2M streams. A real artist asks for a collab.',
      bad: '40K plays, 39K of them teammates laughing. The SoundCloud goes private permanently.',
    },
    'baller-coin': {
      good: '$BALLER moons 40x. You cash out at the top like a psychic. He calls it luck. You call it vision.',
      bad: '$BALLER craters to zero. The moon-with-cleats logo haunts your portfolio. Lesson expensively learned.',
    },
    'shootout-hero': {
      good: 'Bottom corner, keeper rooted. The squad mobs you at the halfway line. HERO OF THE NIGHT.',
      bad: 'Saved. The keeper points to the sky. The walk back is the longest 40 meters in football.',
    },
    'casino-night': {
      good: '21. Twice. You walk away with a ridiculous stack. The captain bans you from future casino nights.',
      bad: 'Bust. Then bust again chasing it. The captain confiscates your chips. Correct decision.',
    },
    'coin-flip-captain': {
      good: 'HEADS. The armband is yours. The veteran shakes your hand: "About time, kid."',
      bad: 'Tails. The veteran gets it — and names you vice-captain anyway. Class act.',
    },
    'mystery-boots': {
      good: 'They\'re ROCKET SHIPS. You feel a step faster. The mystery benefactor remains unknown. You check for a note daily.',
      bad: 'Blisters. Seven of them. The boots go in the bin. Who sends cursed footwear? A mystery for the ages.',
    },
    'international-fumes': {
      good: 'You play 60 solid minutes and come home intact. Country proud, body tolerable.',
      bad: 'Hamstring, minute 23. The national physio says "weeks". Your club\'s doctors use much worse words.',
    },
    'snow-game': {
      good: 'Short sleeves in a blizzard and you boss it. The hardmen nod. You are one of them now.',
      bad: 'You can\'t feel your fingers by halftime. Two days of sniffles. "Worth it," say the hardmen. It was not.',
    },
    'play-through-pain': {
      good: 'You play 85 minutes on one leg and assist the winner. The physio calls you a beautiful idiot.',
      bad: 'It goes at minute 30. A month out. The derby is lost. The physio\'s shrug haunts you.',
    },
    'gk-crossbar-bet': {
      good: 'Crossbar, top bin, crossbar again. The backup keeper buys dinner. The union eats well tonight.',
      bad: 'You hit the post FIVE times. He hits the bar once. Dinner is on you. The union still eats well.',
    },
    'gk-finger-scare': {
      good: 'The pinky holds. Three saves, one spectacular. "Manageable" was accurate for once.',
      bad: 'It buckles on a routine catch. Six weeks of rehab. "Manageable" was a lie.',
    },
    'gk-outfield-cameo': {
      good: 'You nearly score — a bicycle kick that grazes the bar! The stadium ERUPTS. Best day ever.',
      bad: 'You trip over the ball with an open goal. 11M views. Immortalized, but not how you wanted.',
    },
    'gk-pen-taker': {
      good: 'TOP BIN. Keeper vs keeper and you WON. The bench empties. You are a striker now. Officially.',
      bad: 'You sky it into the stands. The other keeper doesn\'t celebrate, which makes it worse. Meme\'d for weeks.',
    },
    'homework-trading': {
      good: 'Straight A\'s AND full training. Mom never knew. The classmate bought boots with your money. Everyone won.',
      bad: 'Caught. Parent-teacher meeting. Mom\'s face. You do your own homework now. So does the classmate, at half price.',
    },
    'captain-scream': {
      good: 'He respects the fire. Next game he assists you twice. Alpha status: shared.',
      bad: 'Cold war for two weeks. The coach mediates like a tired parent. You apologize first. Growth, allegedly.',
    },
    'st-pen-claim': {
      good: 'Sudden death: you bury all five of yours. He blinks on his last one. Penalty duties: YOURS.',
      bad: 'He saves his nerve and wins 5-4. You applaud like a professional while dying inside.',
    },
    'st-big-game-bottler': {
      good: 'Two goals in the derby and a shush to the camera. The pundit "deletes his account for unrelated reasons".',
      bad: 'You hit the post at 1-0 and they equalize in the 94th. The clip gets a sequel. The timeline is unbearable.',
    },
    'def-yellow-record': {
      good: 'Perfectly timed, ball-only, absolutely criminal how clean it was. The striker stays down hoping. No card. Justice.',
      bad: 'Yellow. Of course. The record is yours. The suspension means watching the derby from your couch.',
    },
    'cm-metronome': {
      good: 'A 60-yard diagonal lands on the winger\'s laces. The clip is used in coaching courses. Hollywood: justified.',
      bad: 'The hospital ball gets the fullback injured. The analyst quietly deletes the "flair" column from your report.',
    },
    'cm-captain-clash': {
      good: 'He grants the free role "for one game". You run it. Two assists. The whiteboard now has YOUR diagram.',
      bad: '"My way or the bench." You spend a week in the reserves rethinking your approach. It works. Barely.',
    },
  };

  function logStatNote(state, note) { state.pendingNotes.push(note); }

  function triggerInjury(state, changes) {
    if (state.injuryShield) {
      state.injuryShield = false;
      changes.push({ k: 'SHIELD', d: 0 });
      return;
    }
    const miss = 0.2 + rnd() * 0.3;
    state.injuryMiss = Math.max(state.injuryMiss || 0, miss);
    state.player.stamina = clamp(state.player.stamina - 20, 5, 100);
    changes.push({ k: 'INJ', d: 0 });
  }

  function applyFx(state, fx) {
    const changes = [];
    if (!fx) return changes;
    const p = state.player;
    if (fx.stats) {
      Object.entries(fx.stats).forEach(([k, d]) => {
        let key = k;
        if (p.isGK && k === 'MEN') key = 'COM'; // GK has no Mental stat; map to Composure
        if (!(key in p.stats)) return;
        const before = p.stats[key];
        p.stats[key] = clamp(before + d, 35, 99);
        const real = p.stats[key] - before;
        if (real !== 0) {
          changes.push({ k: key, d: real });
          state.seasonStatLog[key] = (state.seasonStatLog[key] || 0) + real;
        }
      });
    }
    if (fx.form) state.pendingForm += fx.form;
    if (fx.hype) {
      const before = p.hype || 0;
      p.hype = clamp((p.hype || 0) + (fx.hype * 5), 0, 100);
      const real = p.hype - before;
      if (real !== 0) changes.push({ k: 'HYPE', d: real });
    }
    if (fx.stam) {
      const before = p.stamina;
      p.stamina = clamp(Math.round(p.stamina + fx.stam), 5, 100);
      if (p.stamina !== before) changes.push({ k: 'STA', d: p.stamina - before });
    }
    if (fx.mor) {
      const before = p.morale;
      p.morale = clamp(Math.round(p.morale + fx.mor), 5, 100);
      if (p.morale !== before) changes.push({ k: 'MOR', d: p.morale - before });
    }
    if (fx.injury && chance(fx.injury)) triggerInjury(state, changes);
    if (fx.special === 'injuryShield') {
      state.injuryShield = true;
      changes.push({ k: 'SHIELD', d: 1 });
    }
    if (fx.special === 'superAgent') {
      state.superAgent = true;
      changes.push({ k: 'SUPER', d: 1 });
    }
    return changes;
  }

  function applyDecision(state, decision, choice) {
    const opt = decision[choice];
    let out = opt.out || '';
    let changes = [];
    if (opt.fx && opt.fx.risk) {
      const r = opt.fx.risk;
      const good = chance(r.p);
      changes = applyFx(state, good ? r.good : r.bad);
      const outs = RISK_OUTCOMES[decision.id];
      const fallback = outs ? (good ? outs.good : outs.bad) : out;
      out = outcomeText(decision.id, good ? 'good' : 'bad', fallback);
      state.usedDecisions.push(decision.id);
      recompute(state);
      return { out, changes, risk: true, good };
    }
    changes = applyFx(state, opt.fx);
    if (decision.id === 'naturalization-switch') {
      if (choice === 'a' && state.naturalizationEligibleHost) {
        naturalizeAndSwitchNt(state, state.naturalizationEligibleHost);
      } else {
        const birthNat = countryById(state.player.countryId);
        logStatNote(state, `Declined naturalization offer. Remaining loyal to ${countryName(birthNat)}.`);
      }
    }
    state.usedDecisions.push(decision.id);
    recompute(state);
    return { out, changes, risk: false };
  }

  // Interactive minigames (penalty zones / timing bar) — result decided by UI skill/luck
  function applyMiniResult(state, decision, optKey, resultKey) {
    const opt = decision[optKey];
    const mini = opt && opt.mini;
    if (!mini) return { out: '', changes: [] };

    let res = mini.results[resultKey] || mini.results.bad || mini.results.good;
    let fallback = res.out || '';
    let out = outcomeText(decision.id, resultKey, fallback);

    // High-stakes Title-Decider penalty mechanic (25% chance on penalty kicks)
    const isTitleDecider = mini.type === 'penalty' && chance(0.25);
    let fxToApply = res.fx || {};
    if (isTitleDecider) {
      if (resultKey === 'good') {
        addReputation(state, 8);
        fxToApply = Object.assign({}, fxToApply, { hype: (fxToApply.hype || 0) + 2, mor: (fxToApply.mor || 0) + 10 });
        out = `🏆 TITLE-WINNING PENALTY GOAL! You bury the 90+4' penalty in the Cup Final! The stadium erupts as you seal the championship trophy!`;
        if (state.club) {
          const club = clubByCid(state.club.cid);
          state.pendingNotes.push(`Scored 90+4' Title-Winning Penalty in the ${club.cup || 'Cup'} Final!`);
        }
      } else {
        fxToApply = Object.assign({}, fxToApply, { mor: (fxToApply.mor || 0) - 10 });
        out = `💀 SAVED! 90+4' Title-winning penalty saved in the final seconds! Total heartbreak in the Cup Final.`;
      }
    }

    const changes = applyFx(state, fxToApply);
    state.usedDecisions.push(decision.id);
    recompute(state);
    return { out, changes };
  }

  // ---- Boosters ----
  function rollRarity() {
    const total = DATA.RARITY_ROLL.reduce((a, r) => a + r.p, 0);
    let roll = rnd() * total;
    for (const r of DATA.RARITY_ROLL) { if (roll < r.p) return r.rarity; roll -= r.p; }
    return 'bronze';
  }

  function boosterForPlayer(state, b) {
    const isGK = state.player.isGK;
    if (b.pos === 'any') return true;
    if (b.pos === 'gk') return isGK;
    return !isGK;
  }

  function rollBoosters(state) {
    const pool = DATA.BOOSTERS.filter((b) => boosterForPlayer(state, b));
    const out = [];
    const usedIds = new Set();
    const forceRare = state.boostPity >= 2;
    for (let i = 0; i < 3; i++) {
      let rarity = rollRarity();
      if (forceRare && i === 0 && rarity === 'bronze') {
        const r2 = rnd();
        rarity = r2 < 0.75 ? 'silver' : r2 < 0.95 ? 'gold' : 'diamond';
      }
      let candidates = pool.filter((b) => b.rarity === rarity && !usedIds.has(b.id));
      if (!candidates.length) candidates = pool.filter((b) => !usedIds.has(b.id));
      const b = pick(candidates);
      usedIds.add(b.id);
      out.push(b);
    }
    if (out.some((b) => b.rarity !== 'bronze')) state.boostPity = 0; else state.boostPity++;
    return out;
  }

  function boosterFx(state, b) {
    return (state.player.isGK && b.fxGk) ? b.fxGk : b.fx;
  }

  function applyBooster(state, booster) {
    const fx = boosterFx(state, booster);
    const changes = applyFx(state, { stats: fx });
    recompute(state);
    return { changes };
  }

  // ---- Consumables shop (tiered purchases per season & rerolls) ----
  function maxShopPurchases(state) {
    const t = state.player.tier;
    if (t === 'diamond') return 4;
    if (t === 'gold') return 3;
    if (t === 'silver') return 2;
    return 1;
  }

  function consumableCost(state, item) {
    const mult = 1 + Math.max(0, (state.player.ovr - 50) / 40);
    return Math.round(item.price * mult / 1000) * 1000;
  }

  function shopItems(state) {
    const balance = state.earnings - state.spent;
    if (!state.shopOffers || state.shopOffersSeason !== state.season) {
      const pool = DATA.CONSUMABLES.slice().sort(() => Math.random() - 0.5);
      state.shopOffers = pool.slice(0, 6).map((c) => c.id);
      state.shopOffersSeason = state.season;
    }
    const available = DATA.CONSUMABLES.filter((c) => state.shopOffers.includes(c.id));
    return available.map((c) => {
      const cost = consumableCost(state, c);
      return Object.assign({}, c, { cost, affordable: balance >= cost });
    });
  }

  function rerollShop(state) {
    const cost = 50000;
    const balance = state.earnings - state.spent;
    if (state.shopRerolledSeason === state.season) return { ok: false, reason: 'Already rerolled shop this season' };
    if (balance < cost) return { ok: false, reason: 'Not enough career earnings to reroll' };
    state.spent += cost;
    state.shopRerolledSeason = state.season;
    const current = state.shopOffers || [];
    const pool = DATA.CONSUMABLES.filter((c) => !current.includes(c.id)).sort(() => Math.random() - 0.5);
    state.shopOffers = pool.slice(0, 6).map((c) => c.id);
    state.shopOffersSeason = state.season;
    return { ok: true };
  }

  function buyConsumable(state, id) {
    const maxP = maxShopPurchases(state);
    const countThisSeason = (state.shopPurchasesSeason === state.season) ? (state.shopPurchasesCount || 0) : 0;
    if (countThisSeason >= maxP) {
      return { ok: false, reason: `Max shop purchases reached (${maxP} for ${state.player.tier.toUpperCase()} tier)` };
    }
    const purchasedIds = (state.shopPurchasesSeason === state.season) ? (state.shopPurchasedIds || []) : [];
    if (purchasedIds.includes(id)) {
      return { ok: false, reason: 'Already purchased this item this season' };
    }
    const item = shopItems(state).find((i) => i.id === id);
    if (!item) return { ok: false, reason: 'Unknown item' };
    if (!item.affordable) return { ok: false, reason: 'Not enough career earnings' };
    state.spent += item.cost;
    if (state.shopPurchasesSeason !== state.season) {
      state.shopPurchasesSeason = state.season;
      state.shopPurchasesCount = 1;
      state.shopPurchasedIds = [id];
    } else {
      state.shopPurchasesCount += 1;
      state.shopPurchasedIds.push(id);
    }
    state.shopSeason = state.season;
    const fx = (state.player.isGK && item.fxGk) ? item.fxGk : item.fx;
    const changes = applyFx(state, fx);
    recompute(state);
    return { ok: true, changes, item };
  }

  // ---- Club offers ----
  // ---- Club offers ----
  function roleText(ovr, clubS) {
    const diff = ovr - clubS;
    const T = (k) => root.I18n ? root.I18n.T(k) : k;
    if (diff >= 4) return T('role.star');
    if (diff >= -3) return T('role.key');
    if (diff >= -8) return T('role.rotation');
    return T('role.prospect');
  }

  const RELEASED_REASONS = [
    'The new manager has "other profiles" in mind. The phone call lasted 40 seconds.',
    'Wage bill cuts. Your name was circled in red at the board meeting.',
    'The sporting director wants "a full rebuild". Unfortunately, you are the rubble.',
    'The ultras turned after that miss. The board, cowards that they are, listened.',
    'New owner, new project. You are, quote, "not part of the vision".',
    'Your agent asked for a raise. The club responded by listing you. Bold move backfired.',
    'Three managers in one year, and somehow it\'s your fault. Football.',
  ];

  function weightedSample(items, weightFn, n) {
    const pool = items.slice();
    const out = [];
    while (out.length < n && pool.length) {
      const weights = pool.map(weightFn);
      const total = weights.reduce((a, b) => a + b, 0);
      let r = rnd() * total;
      let idx = pool.length - 1;
      for (let i = 0; i < pool.length; i++) { r -= weights[i]; if (r <= 0) { idx = i; break; } }
      out.push(pool.splice(idx, 1)[0]);
    }
    return out;
  }

  // ---- Realistic Financial Budget & Transfer Caps ----
  function clubTransferCap(club) {
    const s = club.s;
    const country = club.countryId;
    const confed = club.confed;

    // South America (CONMEBOL - AR, BR, etc.): River Plate, Boca, Flamengo, Palmeiras, etc.
    if (confed === 'CONMEBOL') {
      if (s >= 82) return 25000000; // max €25M for River, Boca, Flamengo, Palmeiras
      if (s >= 76) return 15000000; // max €15M
      if (s >= 70) return 8000000;  // max €8M
      return 4000000;              // max €4M
    }

    // Saudi Arabia, Qatar, MLS, Australia, etc.
    if (country === 'SA') return Math.min(150000000, Math.round(s * 1500000));
    if (country === 'US') return Math.min(30000000, Math.round(s * 400000));
    if (country === 'QA' || country === 'AU') return 15000000;

    // UEFA (Top 5 leagues: EN, ES, IT, DE, FR)
    const isTop5 = ['EN', 'ES', 'IT', 'DE', 'FR'].includes(country);
    if (isTop5) {
      if (s >= 88) return 220000000; // Real Madrid, Man City, PSG, Bayern
      if (s >= 84) return 90000000;  // Arsenal, Atletico, Inter, Dortmund
      if (s >= 78) return 45000000;  // Mid-upper Top 5
      if (s >= 72) return 20000000;  // Lower Top 5
      return 10000000;
    }

    // Non-Top 5 Europe (PT, NL, TR, BE, SCO, etc.)
    if (confed === 'UEFA') {
      if (s >= 82) return 40000000; // Benfica, Ajax, Porto, Sporting
      if (s >= 75) return 20000000;
      return 10000000;
    }

    // Default for rest of world
    return Math.min(15000000, Math.round(s * 250000));
  }

  function clubOffers(state) {
    const p = state.player;
    const cur = clubByCid(state.club.cid);
    const veteran = p.age >= 34 || (p.peakOvr - p.ovr >= 3 && p.age >= 32);
    const underage = p.age < 18;
    const teen = p.age <= 19;
    const offers = [];
    const T = (k, params) => root.I18n ? root.I18n.T(k, params) : k;

    const loyal = (p.loyalty || 0) >= 60;
    const forcedOut = !loyal && !veteran && !teen && p.age >= 21 && (cur.s - p.ovr > 12);
    const parentClub = (state.club && state.club.loan && state.club.parentCid) ? clubByCid(state.club.parentCid) : null;

    // ---- ON LOAN: special logic ----
    if (state.club && state.club.loan && parentClub) {
      const loanClub = cur;
      const lastSeason = state.history.length ? state.history[state.history.length - 1] : null;
      const avgRating = lastSeason ? lastSeason.avgRating : 6.5;
      const goodSeason = avgRating >= 6.8;
      const greatSeason = avgRating >= 7.2;
      const fitsClub = p.ovr >= loanClub.s - 6;
      const youngDev = p.age <= 23;
      const loanSeasons = state.loanSeasons || 1;
      const requestedPermMove = !!state.requestedLoanPermanentMove;

      // Option 1: Transfer to loan club (permanent) — if performed well, requested move, or max loan reached (age >= 18 only)
      if (!underage && ((goodSeason && fitsClub) || greatSeason || (requestedPermMove && fitsClub) || loanSeasons >= 2)) {
        let maxCap = clubTransferCap(loanClub);
        let rawFee = Math.round((p.value * (0.8 + rnd() * 0.4)) / 100000) * 100000;
        let fee = Math.min(rawFee, maxCap);
        if (state.superAgent) fee = Math.round(Math.min(fee * 1.35, maxCap * 1.1) / 100000) * 100000;
      const nk = 'offerNote.loanBuyout';
        offers.push({
          type: 'transfer',
          club: loanClub,
          fee,
          role: roleText(p.ovr, loanClub.s),
          noteKey: nk,
          note: T(nk),
          isLoanBuyout: true,
        });
      }

      // Option 2: Extend loan — ONLY if loanSeasons < 2 and developing
      if (loanSeasons < 2 && (youngDev || (goodSeason && !greatSeason))) {
        const nk = youngDev ? 'offerNote.loanExtendYoung' : 'offerNote.loanExtendUnfinished';
        offers.push({
          type: 'loan',
          club: loanClub,
          fee: null,
          role: roleText(p.ovr, loanClub.s),
          noteKey: nk,
          note: T(nk)
        });
      }

      // Option 3: Return to parent club (always available)
      offers.push({
        type: 'return',
        club: parentClub,
        role: roleText(p.ovr, parentClub.s),
        noteKey: 'offerNote.return',
        noteParams: { club: parentClub.n },
        note: T('offerNote.return', { club: parentClub.n })
      });

      // Trim to 3 max (transfer, loan, return)
      return offers.slice(0, 3);
    }

    // ---- NOT ON LOAN: standard logic ----
    if (!forcedOut) {
      const nk = loyal ? 'offerNote.loyal' : (veteran ? 'offerNote.veteran' : 'offerNote.stay');
      offers.push({
        type: 'stay',
        club: cur,
        role: roleText(p.ovr, cur.s),
        noteKey: nk,
        note: T(nk)
      });
    } else {
      const reasons = root.I18n ? (root.I18n.releasedReasons() || RELEASED_REASONS) : RELEASED_REASONS;
      offers.push({ type: 'released', club: cur, note: pick(reasons) });
    }

    let pool;
    if (veteran) {
      pool = ALL_CLUBS.filter((c) => c.cid !== cur.cid && c.s <= p.ovr + 1 && c.s >= p.ovr - 22);
    } else if (underage) {
      pool = ALL_CLUBS.filter((c) => c.cid !== cur.cid && c.countryId === cur.countryId
        && c.s <= p.ovr + 8 && c.s >= p.ovr - 18);
    } else if (teen) {
      pool = ALL_CLUBS.filter((c) => c.cid !== cur.cid && c.s <= p.ovr + 8 && c.s >= p.ovr - 18);
    } else {
      pool = ALL_CLUBS.filter((c) => c.cid !== cur.cid && c.s <= p.ovr + 6 && c.s >= p.ovr - 14);
      if (p.ovr >= 78) {
        pool = pool.concat(ALL_CLUBS.filter((c) => c.cid !== cur.cid && c.s >= 87 && c.s <= p.ovr + 12 && !pool.includes(c)));
      }
    }
    if (forcedOut) pool = pool.filter((c) => c.s <= p.ovr - 2);
    if (!pool.length) {
      const domestic = ALL_CLUBS.filter((c) => (underage ? c.countryId === cur.countryId : true) && c.cid !== cur.cid).sort((a, b) => a.s - b.s);
      pool = domestic.length ? domestic.slice(0, 3) : ALL_CLUBS.filter((c) => c.cid !== cur.cid).slice(0, 3);
    }

    // Exclude last season's offered clubs so options always refresh
    const recent = state.recentOffers || [];
    const fresh = pool.filter((c) => !recent.includes(c.cid));
    if (fresh.length >= 4) pool = fresh;

    // Weighted-random sampling: closeness + context, with heavy jitter + Target Club boost
    const eliteHype = {};
    const weightFn = (c) => {
      let w = Math.max(8, 100 - Math.abs(c.s - p.ovr) * 7);

      // +400% weight boost for declared Target Club!
      if (state.targetClubCid && c.cid === state.targetClubCid) {
        w *= 5.0;
      }

      if (underage || teen) {
        if (c.countryId === cur.countryId) w *= 4;
        else if (c.confed === cur.confed) w *= 1.4;
        else w *= 0.4;
      } else if (veteran) {
        if (c.countryId === p.countryId) w *= 2.2;
        if (['US', 'SA', 'QA', 'AU'].includes(c.countryId)) w *= 1.9;
        if (c.s >= 85) w *= 0.5;
      } else {
        if (c.s >= 87) {
          if (eliteHype[c.cid] === undefined) eliteHype[c.cid] = chance(0.5);
          w *= eliteHype[c.cid] ? 2.4 : 0.55;
        }
        if (c.countryId === cur.countryId) w *= 1.5;
        else if (c.confed === cur.confed) w *= 1.15;
      }
      return w * (0.5 + rnd());
    };

    let picked = weightedSample(pool, weightFn, 2);
    if (picked.length === 2 && picked[0].league === picked[1].league) {
      const alt = pool.filter((c) => c.cid !== picked[0].cid && c.cid !== picked[1].cid && c.league !== picked[0].league);
      if (alt.length) picked[1] = weightedSample(alt, weightFn, 1)[0] || picked[1];
    }

    picked.forEach((c) => {
      const cap = clubTransferCap(c);
      const canAfford = cap >= p.value * 0.45;
      const loan = underage || (teen && c.s > p.ovr + 2) || (!canAfford && p.value >= 12000000);
      let rawFee = Math.round((p.value * (0.9 + rnd() * 0.5)) / 100000) * 100000;
      let fee = Math.min(rawFee, cap);
      let nk;
      if (state.superAgent && !loan) {
        fee = Math.round(Math.min(fee * 1.35, cap * 1.1) / 100000) * 100000;
        nk = 'offerNote.superAgent';
      } else if (loan) nk = 'offerNote.devLoan';
      else if (veteran && ['US', 'SA', 'QA', 'AU'].includes(c.countryId)) nk = 'offerNote.sunset';
      else if (veteran && c.countryId === p.countryId) nk = 'offerNote.homecoming';
      else if (c.s >= 88) nk = 'offerNote.royalty';
      else if (c.s > cur.s + 4) nk = 'offerNote.stepUp';
      else nk = 'offerNote.fresh';
      offers.push({ type: loan ? 'loan' : 'transfer', club: c, fee: loan ? null : fee, role: roleText(p.ovr, c.s), noteKey: nk, note: T(nk) });
    });

    state.recentOffers = picked.map((c) => c.cid);
    return offers.slice(0, 3);
  }

  function calcContractLength(age) {
    if (age <= 21) return ri(4, 5);
    if (age <= 27) return ri(3, 5);
    if (age <= 32) return ri(2, 3);
    return ri(1, 2);
  }

  function setAcademy(state, clubCid) {
    let club = clubCid ? clubByCid(clubCid) : null;
    if (!club) {
      const opts = academyOptions(state);
      club = opts[0] ? opts[0].club : ALL_CLUBS[0];
    }
    state.club = { cid: club.cid, loan: false, parentCid: null };
    const len = calcContractLength(state.player.age);
    state.contract = { yearsLeft: len, totalYears: len, annualSalary: state.player.salary, isLoan: false };
    const stint = state.clubStints[club.cid] || (state.clubStints[club.cid] = {
      cid: club.cid, seasons: 0, apps: 0, goals: 0, assists: 0, saves: 0, conceded: 0, cleanSheets: 0,
      firstYear: state.season, lastYear: state.season, trophies: [], salaries: [],
    });
    stint.salaries = stint.salaries || [];
    stint.salaries.push(state.player.salary);
    state.stage = 'sim';
    recompute(state);
  }

  function applyClubOffer(state, offer) {
    const T = (k, p) => root.I18n ? root.I18n.T(k, p) : k;
    const p = state.player;
    if (offer.type === 'return') {
      state.loanSeasons = 0;
      state.requestedLoanPermanentMove = false;
      state.club = { cid: offer.club.cid, loan: false, parentCid: null };
      logStatNote(state, T('note.returned', { club: offer.club.n }));
    } else if (offer.type === 'loan') {
      const parentCid = (state.club && state.club.loan && state.club.parentCid) ? state.club.parentCid : state.club.cid;
      if (state.club && state.club.cid === offer.club.cid) {
        state.loanSeasons = (state.loanSeasons || 0) + 1;
      } else {
        state.loanSeasons = 1;
      }
      state.club = { cid: offer.club.cid, loan: true, parentCid };
      state.contract = { yearsLeft: 1, totalYears: 1, annualSalary: p.salary, isLoan: true };
      logStatNote(state, T('note.loanMove', { club: offer.club.n }));
    } else if (offer.type === 'transfer' || offer.type === 'stay') {
      state.loanSeasons = 0;
      state.requestedLoanPermanentMove = false;
      state.isFreeAgent = false;
      state.club = { cid: offer.club.cid, loan: false, parentCid: null };

      const len = offer.contractYears || calcContractLength(p.age);
      state.contract = { yearsLeft: len, totalYears: len, annualSalary: p.salary, isLoan: false };
      logStatNote(state, T('note.signedFor', { club: offer.club.n }));

      if (offer.type === 'transfer' && offer.fee) {
        const commPct = (state.transferCommissionPct !== undefined ? state.transferCommissionPct : 5) / 100;
        const bonus = Math.round(offer.fee * commPct);
        if (bonus > 0) {
          state.earnings += bonus;
          logStatNote(state, T('note.transferCut', { amount: fmtValue(bonus), pct: Math.round(commPct * 100) }));
        }
      }
    }
    recompute(state);
    state.stage = 'sim';
  }

  // ---- League standings ----
  function simLeague(state, club, playerWon) {
    const country = countryById(club.countryId);
    const games = (country.clubs.length - 1) * 2;
    const rows = country.clubs.map((cl) => {
      const ppg = clamp(0.55 + (cl.s - 55) * 0.045 + (rnd() - 0.4) * 0.55, 0.35, 2.75);
      return { cid: `${country.id}:${cl.n}`, pts: clamp(Math.round(ppg * games), 5, games * 3) };
    });
    rows.sort((a, b) => b.pts - a.pts);
    if (playerWon) {
      const mine = rows.find((r) => r.cid === club.cid);
      const top = rows[0];
      if (mine && mine.cid !== top.cid) {
        mine.pts = top.pts + ri(1, 5);
        rows.sort((a, b) => b.pts - a.pts);
      }
    }
    return rows;
  }

  // ---- Season simulation ----
  function computeApps(ovr, club, age, form) {
    const country = countryById(club.countryId);
    const leagueGames = (country.clubs.length - 1) * 2;
    const cupGames = continentalFor(club) ? 8 : 3;
    const maxApps = leagueGames + cupGames;
    const effS = age <= 19 ? Math.min(club.s, 74) : club.s;
    const fit = ovr - effS;
    let share;
    if (age <= 15) share = 0.12 + fit * 0.012;
    else if (age <= 17) share = 0.30 + fit * 0.02;
    else if (age <= 19) share = 0.48 + fit * 0.024;
    else share = 0.75 + fit * 0.018;
    share *= (0.9 + rnd() * 0.2) * form;
    share = clamp(share, 0.06, 0.97);
    const min = age <= 16 ? 2 : 4;
    return clamp(Math.round(maxApps * share), min, maxApps);
  }

  const TOURNAMENTS = {
    WC: { name: 'FIFA World Cup', years: [2026, 2030, 2034, 2038, 2042, 2046, 2050] },
    UEFA: { name: 'UEFA Euro', years: [2028, 2032, 2036, 2040, 2044, 2048] },
    CONMEBOL: { name: 'Copa América', years: [2028, 2032, 2036, 2040, 2044, 2048] },
    CAF: { name: 'AFCON', years: [2027, 2029, 2031, 2033, 2035, 2037, 2039, 2041, 2043, 2045, 2047, 2049, 2051] },
    CONCACAF: { name: 'CONCACAF Gold Cup', years: [2027, 2029, 2031, 2033, 2035, 2037, 2039, 2041, 2043, 2045, 2047, 2049, 2051] },
    AFC: { name: 'AFC Asian Cup', years: [2027, 2031, 2035, 2039, 2043, 2047, 2051] },
  };

  function continentalFor(club) {
    const s = club.s;
    switch (club.confed) {
      case 'UEFA':
        if (s >= 87) return { name: 'UEFA Champions League', p: 0.05 + (s - 87) * 0.015 };
        if (s >= 76) return { name: 'UEFA Europa League', p: 0.08 };
        return null;
      case 'CONMEBOL':
        if (s >= 78) return { name: 'Copa Libertadores', p: 0.10 };
        if (s >= 72) return { name: 'Copa Sudamericana', p: 0.08 };
        return null;
      case 'CONCACAF': return s >= 74 ? { name: 'CONCACAF Champions Cup', p: 0.10 } : null;
      case 'CAF': return s >= 70 ? { name: 'CAF Champions League', p: 0.09 } : null;
      case 'AFC': return s >= 70 ? { name: 'AFC Champions League', p: 0.09 } : null;
      default: return null;
    }
  }

  function nationalThreshold(rank) {
    if (rank <= 5) return 80;
    if (rank <= 15) return 76;
    if (rank <= 30) return 72;
    return 68;
  }

  function ntWinProb(rank, ovr, isWC) {
    let p = rank <= 3 ? 0.16 : rank <= 8 ? 0.11 : rank <= 15 ? 0.06 : rank <= 25 ? 0.035 : rank <= 40 ? 0.015 : 0.008;
    if (ovr >= 88) p += 0.06; else if (ovr >= 84) p += 0.03;
    return isWC ? p * 0.85 : p;
  }

  function growthDelta(age, key) {
    const brain = ['MEN', 'VIS', 'LEA', 'COM'].includes(key);
    let lo, hi;
    if (age <= 14) [lo, hi] = [2, 4];
    else if (age <= 17) [lo, hi] = [1, 4];
    else if (age <= 20) [lo, hi] = [1, 3];
    else if (age <= 23) [lo, hi] = [1, 3];
    else if (age <= 26) [lo, hi] = [0, 2];
    else if (age <= 29) [lo, hi] = [0, 1];
    else if (age <= 32) [lo, hi] = brain ? [0, 1] : [-1, 0];
    else if (age === 33) [lo, hi] = brain ? [0, 1] : [-2, -1];
    else if (age === 34) [lo, hi] = brain ? [-1, 0] : [-3, -2];
    else if (age <= 37) [lo, hi] = brain ? [-1, 0] : [-4, -2];
    else [lo, hi] = brain ? [-2, -1] : [-4, -3];
    return ri(lo, hi);
  }

  function recompute(state) {
    const p = state.player;
    p.ovr = getOvr(p.stats, p.position);
    p.tier = getTier(p.ovr);
    p.value = marketValue(p);
    p.salary = annualSalary(p, state);
    const seasonsAtClub = (state.club && state.clubStints && state.clubStints[state.club.cid])
      ? state.clubStints[state.club.cid].seasons
      : (state.clubSeasons || 1);
    p.loyalty = clamp(seasonsAtClub * 20, 0, 100);
    if (p.ovr > p.peakOvr) { p.peakOvr = p.ovr; p.peakOvrYear = state.season; }
    if (p.value > p.peakValue) { p.peakValue = p.value; p.peakValueYear = state.season; }
  }

  // ---- Individual awards ----
  function computeSeasonAwards(state, res) {
    const p = state.player;
    const out = [];
    const rating = res.rating;
    const bigTrophy = res.trophies.length > 0;
    // Golden Boy (U21)
    if (p.age <= 21 && p.ovr >= 77 && res.apps >= 22 && rating >= 7.2) {
      if (chance(0.35 + (p.ovr - 77) * 0.04)) out.push({ id: 'golden-boy', name: 'Golden Boy', icon: '🌟' });
    }
    // League Team of the Season (by position)
    if (res.apps >= 22 && rating >= 7.4) {
      if (chance(0.3 + (rating - 7.4) * 0.8)) out.push({ id: 'tots', name: `${res.league} Team of the Season`, icon: '⭐' });
    }
    // FIFA The Best
    if (p.ovr >= 85 && rating >= 7.7) {
      if (chance(0.25 + (p.ovr - 85) * 0.03 + (bigTrophy ? 0.05 : 0))) out.push({ id: 'the-best', name: 'FIFA The Best', icon: '🏅' });
    }
    // Ballon d'Or
    if (p.ovr >= 87 && rating >= 7.8) {
      if (chance(0.18 + (p.ovr - 87) * 0.025 + (bigTrophy ? 0.08 : 0))) out.push({ id: 'ballon-dor', name: "Ballon d'Or", icon: '🥇' });
    }
    // Puskás (rare screamer)
    if (!p.isGK && (p.stats.SHO || 0) >= 85 && chance(0.06)) {
      out.push({ id: 'puskas', name: 'FIFA Puskás Award', icon: '🚀' });
    }
    return out;
  }

  function simulateSeason(state) {
    const p = state.player;
    const club = clubByCid(state.club.cid);
    const nat = countryById(p.countryId);
    const year = state.season;
    const age = p.age;
    const form = clamp(1 + state.pendingForm + (p.morale - 70) / 300, 0.72, 1.28);
    const ovrBefore = p.ovr;

    // Appearances & output (stamina and injuries reduce minutes)
    let apps = computeApps(p.ovr, club, age, form);
    if (state.transferRequestBenched) {
      apps = Math.round(apps * 0.75); // -25% minutes penalty for demanding transfer
    }
    apps = clamp(Math.round(apps * (0.75 + p.stamina / 400)), 0, 38);
    const injured = !!state.injuryMiss;
    if (injured) apps = clamp(Math.round(apps * (1 - state.injuryMiss)), 0, 38);

    const res = {
      year, age, cid: club.cid, clubName: club.n, countryId: club.countryId,
      league: club.league, loan: !!state.club.loan, apps, injured,
      goals: 0, assists: 0, saves: 0, conceded: 0, cleanSheets: 0,
      rating: 6.0, trophies: [], caps: 0, ntGoals: 0, salary: p.salary,
    };

    const weakLeague = 1 + Math.max(0, 78 - club.s) * 0.004;
    if (!p.isGK) {
      const rate = DATA.ATTACK_RATES[p.position];
      const scale = Math.pow(p.ovr / 80, 2.0) * form * weakLeague;
      res.goals = Math.max(0, Math.round(apps * rate.g * scale * (0.7 + rnd() * 0.6)));
      res.assists = Math.max(0, Math.round(apps * rate.a * scale * (0.7 + rnd() * 0.6)));
      const gPerApp = (res.goals + res.assists) / Math.max(apps, 1);
      res.rating = clamp(6.5 + (p.ovr - club.s) * 0.02 + gPerApp * 0.9 + (rnd() - 0.5) * 0.3, 5.9, 9.9);
    } else {
      res.saves = Math.round(apps * Math.max(2.2, 3.2 + (p.ovr - 60) * 0.06) * (0.8 + rnd() * 0.4));
      const concRate = Math.max(0.45, 1.35 - (p.ovr - 60) * 0.008 + (78 - club.s) * 0.01) / form;
      res.conceded = Math.round(apps * concRate * (0.8 + rnd() * 0.4));
      res.cleanSheets = clamp(Math.round(apps * (((p.ovr + club.s) / 2 - 55) * 0.02) * (0.7 + rnd() * 0.6)), 0, Math.round(apps * 0.6));
      res.rating = clamp(6.5 + (p.ovr - club.s) * 0.02 + (res.saves / Math.max(apps, 1)) * 0.18 - (res.conceded / Math.max(apps, 1)) * 0.35 + (res.cleanSheets / Math.max(apps, 1)) * 0.5, 5.9, 9.9);
    }
    res.rating = Math.round(res.rating * 10) / 10;

    // Club trophies
    const lAvg = leagueAvg(club.countryId);
    const starBonus = p.ovr > club.s ? 0.05 : 0;
    const pLeague = clamp(0.10 + (club.s - lAvg) * 0.055 + starBonus, 0.02, 0.55);
    const pCup = clamp(pLeague * 0.75 + 0.04, 0.02, 0.5);
    if (chance(pLeague)) res.trophies.push({ type: 'League', name: club.league });
    if (chance(pCup)) res.trophies.push({ type: 'Cup', name: club.cup });
    const cont = continentalFor(club);
    if (cont) {
      const sb = p.ovr >= 90 ? 0.04 : p.ovr >= 85 ? 0.02 : 0;
      if (chance(cont.p + sb)) res.trophies.push({ type: 'Continental', name: cont.name });
    }

    // Track seasons per country for naturalization (5+ seasons rule)
    state.countrySeasons = state.countrySeasons || {};
    state.countrySeasons[club.countryId] = (state.countrySeasons[club.countryId] || 0) + 1;

    // Check naturalization switch option if not yet committed to a national team
    if (!state.ntCalledUp && (!state.totals || !state.totals.caps)) {
      const hostCountryId = Object.keys(state.countrySeasons).find((c) => c !== p.countryId && state.countrySeasons[c] >= 5);
      if (hostCountryId) {
        state.naturalizationEligibleHost = hostCountryId;
      }
    }

    // National team
    let thr = nationalThreshold(nat.rank);
    if (age <= 19 && p.potential >= 85) thr -= 3;
    if (p.ovr >= thr && age >= 16) {
      if (!state.ntCalledUp && !state.ntDeclinedThisYear) {
        state.triggerNtCallUpModal = true;
      }
      if (state.ntCalledUp) {
        state.ntFirstYear = state.ntFirstYear || year;
        const rate = DATA.ATTACK_RATES[p.position];
        res.caps = clamp(5 + ri(0, 5) + (p.ovr >= 85 ? 2 : 0), 0, 12);
        if (!p.isGK) {
          res.ntGoals = Math.max(0, Math.round(res.caps * rate.g * Math.pow(p.ovr / 82, 2) * 0.8 * (0.6 + rnd() * 0.8)));
          res.ntCleanSheets = 0;
        } else {
          res.ntGoals = 0;
          res.ntCleanSheets = Math.min(res.caps, Math.max(0, Math.round(res.caps * (0.35 + (p.ovr / 100) * 0.25))));
        }
        const confT = TOURNAMENTS[nat.confed];
        if (TOURNAMENTS.WC.years.includes(year)) {
          if (chance(ntWinProb(nat.rank, p.ovr, true))) res.trophies.push({ type: 'Country', name: 'FIFA World Cup' });
        } else if (confT && confT.years.includes(year)) {
          if (chance(ntWinProb(nat.rank, p.ovr, false))) res.trophies.push({ type: 'Country', name: confT.name });
        }
      }
    }

    // ---- End of season growth ----
    const growth = {};
    statKeys(p.isGK).forEach((k) => {
      let d = growthDelta(age, k);
      if (d > 0 && p.ovr >= p.potential) d = Math.round(d * 0.3);
      growth[k] = d;
    });
    const keys = statKeys(p.isGK);
    if (club.s >= 82) { growth[pick(keys)] += 1; growth[pick(keys)] += 1; }
    else if (club.s >= 76) { growth[pick(keys)] += 1; }
    if (apps >= 25 && age <= 23) growth[pick(keys)] += 1;
    if (apps <= 8 && age <= 21) growth[pick(keys)] -= 1;

    Object.entries(growth).forEach(([k, d]) => {
      if (d === 0) return;
      const before = p.stats[k];
      p.stats[k] = clamp(before + d, 35, 99);
      const real = p.stats[k] - before;
      if (real !== 0) state.seasonStatLog[k] = (state.seasonStatLog[k] || 0) + real;
    });

    // Stamina & morale updates
    p.stamina = clamp(Math.round(p.stamina + 14 - apps * 0.6 - (age > 30 ? 5 : 0) - (age > 34 ? 8 : 0) + (injured ? 8 : 0)), 5, 100);
    const morDelta = res.rating >= 7.5 ? 6 : res.rating >= 7.0 ? 3 : res.rating < 6.5 ? -6 : 0;
    p.morale = clamp(Math.round((p.morale + morDelta - 70) * 0.8 + 70), 5, 100);
    res.stamina = p.stamina;
    res.morale = p.morale;

    // Totals & stints
    const t = state.totals;
    t.apps += res.apps; t.goals += res.goals; t.assists += res.assists;
    t.saves += res.saves; t.conceded += res.conceded; t.cleanSheets += res.cleanSheets;
    t.caps += res.caps; t.ntGoals += (res.ntGoals || 0); t.ntCleanSheets = (t.ntCleanSheets || 0) + (res.ntCleanSheets || 0);

    const stint = state.clubStints[club.cid] || (state.clubStints[club.cid] = {
      cid: club.cid, seasons: 0, apps: 0, goals: 0, assists: 0, saves: 0, conceded: 0, cleanSheets: 0,
      firstYear: year, lastYear: year, trophies: [], salaries: [],
    });
    stint.seasons += 1; stint.lastYear = year;
    stint.salaries = stint.salaries || []; stint.salaries.push(p.salary);
    stint.apps += res.apps; stint.goals += res.goals; stint.assists += res.assists;
    stint.saves += res.saves; stint.conceded += res.conceded; stint.cleanSheets += res.cleanSheets;
    res.trophies.forEach((tr) => { if (tr.type !== 'Country') stint.trophies.push(tr); else state.ntTrophies.push({ name: tr.name, year }); });

    // Money & league table
    state.earnings += p.salary;
    if (state.agent && state.agent.annualSalary > 0) {
      state.spent += state.agent.annualSalary;
      logStatNote(state, `Paid ${fmtValue(state.agent.annualSalary)} annual agent fee to ${state.agent.name}`);
    }
    state.injuryMiss = 0;
    state.superAgent = false;
    state.standings = simLeague(state, club, res.trophies.some((tr) => tr.type === 'League'));

    // Contract decrement & Free Agency
    if (state.contract && !state.club.loan) {
      state.contract.yearsLeft = Math.max(0, state.contract.yearsLeft - 1);
      if (state.contract.yearsLeft === 0) {
        state.isFreeAgent = true;
        logStatNote(state, `Contract with ${club.n} expired! Entering Free Agency.`);
      }
    }

    // Seasonal resets for agent actions & benched flags
    state.agentActionsThisSeason = { transferReq: false, raiseReq: false, commReq: false };
    state.transferRequestBenched = false;
    state.agentMarket = rollAgentMarket(state);
    state.agentMarketSeason = state.season;

    // Individual awards
    res.awards = computeSeasonAwards(state, res);
    res.awards.forEach((a) => state.awards.push({ id: a.id, name: a.name, icon: a.icon, year }));

    // Reputation updates
    if (res.rating >= 7.6) addReputation(state, 5);
    res.trophies.forEach((tr) => addReputation(state, tr.type === 'Country' ? 15 : 10));
    res.awards.forEach((a) => addReputation(state, a.id === 'ballon-dor' ? 25 : 15));

    // Finalize player state
    p.hype = Math.max(0, p.hype - 1);
    recompute(state);
    res.ovrBefore = ovrBefore;
    res.ovrAfter = p.ovr;
    res.valueAfter = p.value;
    res.statLog = Object.assign({}, state.seasonStatLog);
    res.notes = state.pendingNotes.slice();

    state.history.unshift(res);
    state.pendingForm = 0;
    state.pendingNotes = [];
    state.seasonStatLog = {};

    // Age up
    p.age += 1;
    state.season += 1;
    if (p.age > 40) { state.retired = true; state.stage = 'retired'; state.retireType = 'full'; }
    else state.stage = 'decision';

    return res;
  }

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
    state.stage = 'retired';
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

  function getLegendForPlayer(state) {
    const p = state.player;
    const natCode = p.countryId;
    const natList = DATA.NAT_LEGENDS[natCode];
    const isGK = p.isGK;
    const isDef = ['CB', 'LB', 'RB'].includes(p.position);
    const isMid = ['CM', 'CAM', 'CDM', 'LM', 'RM'].includes(p.position);
    const targetPos = isGK ? 'gk' : (isDef ? 'def' : (isMid ? 'mid' : 'st'));

    if (natList && natList.length) {
      const match = natList.find((l) => l.pos === targetPos);
      if (match) return match;
      return pick(natList);
    }

    const generic = {
      gk: { name: 'Oliver Kahn', pos: 'gk', title: 'Der Titan' },
      def: { name: 'Franco Baresi', pos: 'def', title: 'Il Capitano' },
      mid: { name: 'Andrea Pirlo', pos: 'mid', title: 'Il Maestro' },
      st: { name: 'Marco van Basten', pos: 'st', title: 'The Swan of Utrecht' }
    };
    return generic[targetPos] || generic.st;
  }

  function acceptNtCallUp(state) {
    state.ntCalledUp = true;
    state.triggerNtCallUpModal = false;
    const nat = countryById(state.player.countryId);
    logStatNote(state, `Accepted national team call-up for ${countryName(nat)}!`);
  }

  function declineNtCallUp(state) {
    state.ntCalledUp = false;
    state.triggerNtCallUpModal = false;
    state.ntDeclinedThisYear = true;
    const nat = countryById(state.player.countryId);
    logStatNote(state, `Declined national team call-up for ${countryName(nat)}. Remaining eligible for future options.`);
  }

  function naturalizeAndSwitchNt(state, hostCountryId) {
    if (!hostCountryId) return;
    const newNat = countryById(hostCountryId);
    state.player.countryId = hostCountryId;
    state.ntCalledUp = true;
    state.triggerNtCallUpModal = false;
    logStatNote(state, `Obtained citizenship in ${countryName(newNat)} after 5+ seasons and accepted their National Team call-up!`);
  }

  const Engine = {
    setRng(fn) { RNG = fn; },
    newCareer, migrate, academyOptions, setAcademy,
    pickDecision, applyDecision, applyMiniResult, rollBoosters, applyBooster, boosterFx,
    shopItems, buyConsumable, consumableCost, maxShopPurchases, rerollShop,
    clubOffers, applyClubOffer, simLeague, simulateSeason, retire, retireType, careerSummary,
    computeSeasonAwards,
    getOvr, getTier, marketValue, annualSalary, fmtValue, recompute,
    clubByCid, countryById, countryName, ALL_CLUBS, allClubs, statKeys,
    hireAgent, rollAgentMarket, requestTransfer, demandSalaryRaise, negotiateCommission, DAD_AGENT, addReputation,
    getLegendForPlayer, calcContractLength, acceptNtCallUp, declineNtCallUp, naturalizeAndSwitchNt,
  };

  root.Engine = Engine;
  if (typeof module !== 'undefined' && module.exports) module.exports = Engine;
})(typeof window !== 'undefined' ? window : globalThis);
