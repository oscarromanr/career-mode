/* ============================================================
   CAREER MODE '26 - domain: season
   Season simulation, growth, standings, awards.
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
  const Decisions = (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports)
    ? require('./decisions.js')
    : root.DomainDecisions;
  const Agents = (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports)
    ? require('./agents.js')
    : root.DomainAgents;

  const { DATA, STATE, clubByCid, countryById, leagueAvg, statKeys, fmtValue, countryName } = Model;
  const { recompute, growthDelta, addReputation } = Player;
  const { clamp, ri, rnd, chance, pick } = Rng;
  const { logStatNote } = Decisions;
  const { rollAgentMarket } = Agents;

  const T = (key, params) => root.I18n ? root.I18n.T(key, params) : key;

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
    const fit = ovr - club.s;
    let share;
    if (age <= 15) share = 0.12 + fit * 0.02;
    else if (age <= 17) share = 0.30 + fit * 0.03;
    else if (age <= 19) share = 0.45 + fit * 0.04;
    else share = 0.75 + fit * 0.05;
    share *= (0.9 + rnd() * 0.2) * form;
    share = clamp(share, 0.02, 0.97);
    const min = age <= 16 ? 1 : 2;
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
        if (s >= 82) return { name: 'UEFA Champions League', p: Math.max(0.01, 0.03 + (s - 85) * 0.02) };
        if (s >= 75) return { name: 'UEFA Europa League', p: Math.max(0.02, 0.05 + (s - 78) * 0.02) };
        if (s >= 70) return { name: 'UEFA Conference League', p: Math.max(0.02, 0.05 + (s - 72) * 0.02) };
        return null;
      case 'CONMEBOL':
        if (s >= 75) return { name: 'Copa Libertadores', p: Math.max(0.03, 0.05 + (s - 76) * 0.03) };
        if (s >= 70) return { name: 'Copa Sudamericana', p: Math.max(0.02, 0.04 + (s - 72) * 0.03) };
        return null;
      case 'CONCACAF': return s >= 70 ? { name: 'CONCACAF Champions Cup', p: Math.max(0.02, 0.05 + (s - 72) * 0.03) } : null;
      case 'CAF': return s >= 68 ? { name: 'CAF Champions League', p: Math.max(0.02, 0.05 + (s - 70) * 0.03) } : null;
      case 'AFC': return s >= 68 ? { name: 'AFC Champions League', p: Math.max(0.02, 0.05 + (s - 70) * 0.03) } : null;
      default: return null;
    }
  }

  function nationalThreshold(rank, age, potential) {
    let base;
    if (rank <= 5) base = 76;
    else if (rank <= 15) base = 72;
    else if (rank <= 30) base = 68;
    else base = 63;

    if (age !== undefined && age <= 19 && potential >= 80) base -= 3;
    return base;
  }

  function ntWinProb(rank, ovr, isWC) {
    let p = rank <= 3 ? 0.16 : rank <= 8 ? 0.11 : rank <= 15 ? 0.06 : rank <= 25 ? 0.035 : rank <= 40 ? 0.015 : 0.008;
    if (ovr >= 88) p += 0.06; else if (ovr >= 84) p += 0.03;
    return isWC ? p * 0.85 : p;
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
    state.ntDeclinedThisYear = false;
    const p = state.player;
    const club = clubByCid(state.club.cid);
    const nat = countryById(p.countryId);
    const year = state.season;
    const age = p.age;
    const form = clamp(1 + state.pendingForm + (p.morale - 70) / 300, 0.72, 1.28);
    const ovrBefore = p.ovr;
    const hypeBefore = p.hype || 0;
    const repBefore = p.reputation || 0;

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
      hypeBefore, repBefore,
    };

    const lAvg = leagueAvg(club.countryId);
    const leagueDominance = 1 + Math.max(0, p.ovr - lAvg) * 0.03; 

    if (!p.isGK) {
      const rate = DATA.ATTACK_RATES[p.position];
      const scale = Math.pow(p.ovr / 80, 2.0) * form * leagueDominance;
      res.goals = Math.max(0, Math.round(apps * rate.g * scale * (0.7 + rnd() * 0.6)));
      res.assists = Math.max(0, Math.round(apps * rate.a * scale * (0.7 + rnd() * 0.6)));
      const gPerApp = (res.goals + res.assists) / Math.max(apps, 1);
      res.rating = clamp(6.5 + (p.ovr - club.s) * 0.02 + gPerApp * 0.9 + (rnd() - 0.5) * 0.3, 5.9, 9.9);
    } else {
      res.saves = Math.round(apps * Math.max(2.2, 3.2 + (p.ovr - 60) * 0.06) * (0.8 + rnd() * 0.4));
      const defAdv = Math.max(0, club.s - lAvg) + Math.max(0, p.ovr - lAvg) * 0.5;
      const concRate = Math.max(0.40, 1.45 - (p.ovr - 60) * 0.008 - defAdv * 0.025) / form;
      res.conceded = Math.round(apps * concRate * (0.8 + rnd() * 0.4));
      res.cleanSheets = clamp(Math.round(apps * (((p.ovr + club.s) / 2 - 55) * 0.02) * (0.7 + rnd() * 0.6)), 0, Math.round(apps * 0.6));
      res.rating = clamp(6.5 + (p.ovr - club.s) * 0.02 + (res.saves / Math.max(apps, 1)) * 0.18 - (res.conceded / Math.max(apps, 1)) * 0.35 + (res.cleanSheets / Math.max(apps, 1)) * 0.5, 5.9, 9.9);
    }
    res.rating = Math.round(res.rating * 10) / 10;

    // Club trophies
    let pendingTrophyConsumed = false;
    let pendingWcConsumed = false;

    if (state.pendingTrophy) {
      if ((year % 4 === 2) && state.ntCalledUp && chance(0.25)) {
        res.trophies.push({ type: 'Country', name: 'FIFA World Cup' });
        pendingWcConsumed = true;
      } else {
        const cont = continentalFor(club);
        if (cont && chance(0.5)) {
          res.trophies.push({ type: 'Continental', name: cont.name });
          pendingTrophyConsumed = 'Continental';
        } else {
          res.trophies.push({ type: 'Cup', name: club.cup });
          pendingTrophyConsumed = 'Cup';
        }
      }
    }

    const starBonus = Math.max(0, p.ovr - club.s) * 0.02; // +2% win chance for every OVR above club average
    const pLeague = clamp(0.10 + (club.s - lAvg) * 0.055 + starBonus, 0.02, 0.85);
    const pCup = clamp(pLeague * 0.75 + 0.04, 0.02, 0.70);
    if (chance(pLeague)) res.trophies.push({ type: 'League', name: club.league });
    if (pendingTrophyConsumed !== 'Cup' && chance(pCup)) res.trophies.push({ type: 'Cup', name: club.cup });
    const cont = continentalFor(club);
    if (cont) {
      const sb = p.ovr >= 90 ? 0.04 : p.ovr >= 85 ? 0.02 : 0;
      if (pendingTrophyConsumed !== 'Continental' && chance(cont.p + sb)) res.trophies.push({ type: 'Continental', name: cont.name });
    }

    // Track seasons per country for naturalization (5+ seasons rule)
    p.initialCountryId = p.initialCountryId || p.countryId;
    p.earnedNationalities = p.earnedNationalities || [];
    state.countrySeasons = state.countrySeasons || {};
    state.countrySeasons[club.countryId] = (state.countrySeasons[club.countryId] || 0) + 1;

    // Tick down active national team declined cooldowns
    if (state.ntDeclinedCooldowns) {
      for (const k in state.ntDeclinedCooldowns) {
        if (state.ntDeclinedCooldowns[k] > 0) state.ntDeclinedCooldowns[k]--;
      }
    }

    if (club.countryId !== p.initialCountryId && state.countrySeasons[club.countryId] >= 5 && !p.earnedNationalities.includes(club.countryId)) {
      p.earnedNationalities.push(club.countryId);
      STATE.pushEffect(state, { type: 'naturalization', countryId: club.countryId });
      const newNat = countryById(club.countryId);
      logStatNote(state, T('note.naturalizationEarned', { country: countryName(newNat) }));
    }

    // National team evaluation across all eligible nationalities (Birth + Earned)
    const candidateNats = [p.initialCountryId || p.countryId, ...(p.earnedNationalities || [])].filter((c, i, a) => a.indexOf(c) === i);
    for (const cCode of candidateNats) {
      if (state.ntRejectedPerm && state.ntRejectedPerm[cCode]) continue;
      if (state.ntDeclinedCooldowns && state.ntDeclinedCooldowns[cCode] > 0) continue;
      if (state.ntCalledUp && p.countryId !== cCode) continue;

      const cNat = countryById(cCode);
      if (!cNat) continue;
      const thr = nationalThreshold(cNat.rank, age, p.potential);

      if (p.ovr >= thr && age >= 16) {
        if (state.ntCalledUp && (state.ntCountryId === cCode || p.countryId === cCode)) {
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
          const confT = TOURNAMENTS[cNat.confed];
          if (TOURNAMENTS.WC.years.includes(year)) {
            if (!pendingWcConsumed && chance(ntWinProb(cNat.rank, p.ovr, true))) res.trophies.push({ type: 'Country', name: 'FIFA World Cup' });
          } else if (confT && confT.years.includes(year)) {
            if (chance(ntWinProb(cNat.rank, p.ovr, false))) res.trophies.push({ type: 'Country', name: confT.name });
          }
          break;
        } else if (!state.ntCalledUp && !state.ntDeclinedThisYear) {
          STATE.pushEffect(state, { type: 'nt-callup', countryCode: cCode });
          break;
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
    res.hypeAfter = p.hype || 0;
    res.hypeDelta = res.hypeAfter - res.hypeBefore;

    delete state.pendingTrophy;
    res.repAfter = p.reputation || 0;
    res.repDelta = res.repAfter - res.repBefore;

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
    state.clubLoyalty = state.clubLoyalty || {};
    state.clubLoyalty[club.cid] = clamp((state.clubLoyalty[club.cid] || 20) + 15, 0, 100);
    stint.salaries = stint.salaries || []; stint.salaries.push(p.salary);
    stint.apps += res.apps; stint.goals += res.goals; stint.assists += res.assists;
    stint.saves += res.saves; stint.conceded += res.conceded; stint.cleanSheets += res.cleanSheets;
    res.trophies.forEach((tr) => { if (tr.type !== 'Country') stint.trophies.push(tr); else state.ntTrophies.push({ name: tr.name, year }); });

    // Historical season expenses tracking
    res.agentSpent = (state.agent && state.agent.annualSalary > 0) ? state.agent.annualSalary : 0;
    res.shopSpent = (state.shopSpentSeason === year) ? (state.shopSpentThisSeason || 0) : 0;

    // Money & league table
    state.earnings += p.salary;
    if (state.agent && state.agent.annualSalary > 0) {
      state.spent += state.agent.annualSalary;
      logStatNote(state, T('note.paidAgentFee', { amount: fmtValue(state.agent.annualSalary), name: state.agent.name }));
    }
    state.injuryMiss = 0;
    state.superAgent = false;
    state.standings = simLeague(state, club, res.trophies.some((tr) => tr.type === 'League'));
    state.standingsCountryId = club.countryId;

    // Contract decrement & Free Agency (Parent contract ticks down EVERY season even while on loan!)
    if (state.contract) {
      state.contract.yearsLeft = Math.max(0, state.contract.yearsLeft - 1);
      if (state.contract.yearsLeft === 0) {
        state.isFreeAgent = true;
        const parentName = (state.club && state.club.loan && state.club.parentCid) ? clubByCid(state.club.parentCid).n : (club ? club.n : 'Club');
        state.lastClubCid = (state.club && state.club.loan && state.club.parentCid) ? state.club.parentCid : (state.club ? state.club.cid : null);
        state.lastLoanClubCid = (state.club && state.club.loan) ? state.club.cid : null;
        state.club = null;
        logStatNote(state, T('note.contractExpired', { club: parentName }) || `Contract with ${parentName} expired! Entering Free Agency.`);
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
    if (p.age > 40) {
      state.retired = true;
      state.retireType = 'full';
      res.retired = true;
    } else {
      // Generate the next market before the summary is shown so reloads preserve it.
      // The application layer builds the season-summary phase from these offers.
      res.nextOffers = (root.DomainOffers || (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports ? require('./offers.js') : null)).clubOffers(state);
    }

    return res;
  }

  const Season = {
    simLeague,
    computeApps,
    TOURNAMENTS,
    continentalFor,
    nationalThreshold,
    ntWinProb,
    computeSeasonAwards,
    simulateSeason,
  };

  root.DomainSeason = Season;
  if (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = Season;
})(typeof window !== 'undefined' ? window : globalThis);
