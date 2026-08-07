/* ============================================================
   CAREER MODE '26 - domain: offers
   Club offers, transfer caps, free agency.
   ============================================================ */
(function (root) {
  'use strict';

  const Model = (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports)
    ? require('./model.js')
    : root.DomainModel;
  const Rng = (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports)
    ? require('./rng.js')
    : root.DomainRng;

  const { ALL_CLUBS, clubByCid } = Model;
  const { clamp, chance, rnd, shuffle, weightedSample, pick } = Rng;

  const T = (key, params) => root.I18n ? root.I18n.T(key, params) : key;

  function roleKey(ovr, clubS, state) {
    const diff = ovr - clubS;
    const p = state ? state.player : null;
    const loyalty = (p && p.loyalty) ? p.loyalty : 0;
    if (ovr >= 85) return 'role.star';
    if (ovr >= 80) return (diff >= -6 || loyalty >= 40) ? 'role.star' : 'role.key';
    if (diff >= 4 || loyalty >= 70) return 'role.star';
    if (diff >= -3 || loyalty >= 40) return 'role.key';
    if (diff >= -8 || loyalty >= 20) return 'role.rotation';
    return 'role.prospect';
  }

  function roleText(ovr, clubS, state) {
    const rKey = roleKey(ovr, clubS, state);
    return root.I18n ? root.I18n.T(rKey) : rKey;
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
    const isFreeAgent = !!(state.isFreeAgent || !state.club);
    const cur = state.club ? clubByCid(state.club.cid) : null;
    const veteran = p.age >= 34 || (p.peakOvr - p.ovr >= 3 && p.age >= 32);
    const underage = p.age < 18;
    const teen = p.age <= 19;
    const offers = [];

    // ---- FREE AGENT LOGIC ----
    if (isFreeAgent) {
      const formerCid = state.lastClubCid || (state.history.length && state.history[0].cid);
      const formerClub = formerCid ? clubByCid(formerCid) : null;
      const loanClub = state.lastLoanClubCid ? clubByCid(state.lastLoanClubCid) : null;

      // Option 1: Offer from former club (if willing and not transfer listed)
      if (formerClub && state.clubSituation !== 'listed') {
        offers.push({
          type: 'stay',
          club: formerClub,
          fee: 0,
          roleKey: roleKey(p.ovr, formerClub.s, state),
          role: roleText(p.ovr, formerClub.s, state),
          noteKey: 'offerNote.newContract',
          note: T('offerNote.newContract'),
          isRenewal: true,
        });
      }

      // Option 2: Offer from former loan club (if was on loan)
      if (loanClub && (!formerClub || loanClub.cid !== formerClub.cid)) {
        offers.push({
          type: 'transfer',
          club: loanClub,
          fee: 0,
          roleKey: roleKey(p.ovr, loanClub.s, state),
          role: roleText(p.ovr, loanClub.s, state),
          noteKey: 'offerNote.loanBuyout',
          note: T('offerNote.loanBuyout'),
        });
      }

      // Option 3, 4, 5: Offers from interested clubs on Free Transfer (NO LOANS for free agents)
      const excludeCids = new Set([formerCid, state.lastLoanClubCid].filter(Boolean));
      let candidatePool = ALL_CLUBS.filter((c) => !excludeCids.has(c.cid) && (!underage || c.countryId === p.countryId));
      
      // Tighten the Free Agency rating gap so stars don't drop down too far
      if (veteran) {
        candidatePool = candidatePool.filter(c => c.s >= p.ovr - 10 && c.s <= p.ovr + 4);
      } else {
        candidatePool = candidatePool.filter(c => c.s >= p.ovr - 4 && c.s <= p.ovr + 6);
      }

      // Keep the club stage actionable when no club fits the strict rating window.
      if (!candidatePool.length) {
        let fallbackPool = ALL_CLUBS
          .filter((c) => !excludeCids.has(c.cid) && (!underage || c.countryId === p.countryId));
        if (!fallbackPool.length) fallbackPool = ALL_CLUBS.filter((c) => !excludeCids.has(c.cid));
        candidatePool = fallbackPool
          .sort((a, b) => Math.abs(a.s - p.ovr) - Math.abs(b.s - p.ovr))
          .slice(0, Math.max(1, 3 - offers.length));
      }

      const picked = shuffle(candidatePool).slice(0, Math.max(1, 3 - offers.length));
      picked.forEach((c) => {
        offers.push({
          type: 'transfer',
          club: c,
          fee: 0,
          roleKey: roleKey(p.ovr, c.s, state),
          role: roleText(p.ovr, c.s, state),
          noteKey: 'offerNote.fresh',
          note: T('offerNote.fresh'),
        });
      });

      return offers.slice(0, 3);
    }

    const loyal = (p.loyalty || 0) >= 60;
    const forcedOut = state.clubSituation === 'listed' || (!loyal && !veteran && !teen && p.age >= 21 && (cur.s - p.ovr > 12));
    const parentClub = (state.club && state.club.loan && state.club.parentCid) ? clubByCid(state.club.parentCid) : null;
    
    const currentRole = roleKey(p.ovr, cur.s, state);
    const isBenchwarmer = currentRole === 'role.prospect' || currentRole === 'role.rotation';

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
          roleKey: roleKey(p.ovr, loanClub.s, state),
          role: roleText(p.ovr, loanClub.s, state),
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
          roleKey: roleKey(p.ovr, loanClub.s, state),
          role: roleText(p.ovr, loanClub.s, state),
          noteKey: nk,
          note: T(nk)
        });
      }

      // Option 3: Return to parent club OR Contract Renewal if contract is expiring
      const parentExpiring = state.isFreeAgent || (state.contract && state.contract.yearsLeft <= 1);
      const outgrownParent = p.ovr > parentClub.s + 3;

      if (parentExpiring) {
        // If massively outgrown parent club, they might not renew you and let you leave (50% chance)
        if (!outgrownParent || chance(0.5)) {
          offers.push({
            type: 'stay',
            club: parentClub,
            roleKey: roleKey(p.ovr, parentClub.s, state),
            role: roleText(p.ovr, parentClub.s, state),
            noteKey: 'offerNote.newContract',
            note: T('offerNote.newContract'),
            isRenewal: true,
          });
        }
      } else {
        // Under contract, so returning is technically forced, but we represent it as an offer.
        // If heavily outgrown, we reduce chance of this offer being shown to favor pure transfer options.
        if (!outgrownParent || chance(0.2)) {
          offers.push({
            type: 'return',
            club: parentClub,
            roleKey: roleKey(p.ovr, parentClub.s, state),
            role: roleText(p.ovr, parentClub.s, state),
            noteKey: 'offerNote.return',
            noteParams: { club: parentClub.n },
            note: T('offerNote.return', { club: parentClub.n })
          });
        }
      }

      // Option 4 & 5: Alternative transfer/loan offers from other clubs
      const candidates = ALL_CLUBS.filter((c) => c.cid !== loanClub.cid && c.cid !== parentClub.cid && Math.abs(c.s - p.ovr) <= 10 && (!underage || c.countryId === p.countryId));
      let affordableCandidates = candidates.filter(c => clubTransferCap(c) >= p.value * 0.45);
      if (affordableCandidates.length < 2) affordableCandidates = candidates; // Fallback if no rich clubs
      
      const pickedOthers = shuffle(affordableCandidates).slice(0, 2);
      pickedOthers.forEach((c) => {
        let maxCap = clubTransferCap(c);
        let rawFee = Math.round((p.value * (0.8 + rnd() * 0.4)) / 100000) * 100000;
        let fee = (parentExpiring || underage) ? 0 : Math.min(rawFee, maxCap);
        
        let isLoanOffer = false;
        if (underage) {
          isLoanOffer = true;
        } else if (p.age <= 23 && c.s > p.ovr + 3) {
          isLoanOffer = true;
        }

        offers.push({
          type: isLoanOffer ? 'loan' : 'transfer',
          club: c,
          fee: isLoanOffer ? null : fee,
          roleKey: roleKey(p.ovr, c.s, state),
          role: roleText(p.ovr, c.s, state),
          noteKey: isLoanOffer ? 'offerNote.devLoan' : 'offerNote.fresh',
          note: T(isLoanOffer ? 'offerNote.devLoan' : 'offerNote.fresh')
        });
      });

      return offers.slice(0, 3);
    }

    // ---- NOT ON LOAN: standard logic ----
    if (!forcedOut) {
      const nk = loyal ? 'offerNote.loyal' : (veteran ? 'offerNote.veteran' : 'offerNote.stay');
      offers.push({
        type: 'stay',
        club: cur,
        roleKey: roleKey(p.ovr, cur.s, state),
        role: roleText(p.ovr, cur.s, state),
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

    // NEW AFFORDABILITY FILTER: Filter out clubs that cannot afford the transfer fee if the player is expensive, unless we might loan them
    pool = pool.filter(c => {
      const cap = clubTransferCap(c);
      const canAfford = cap >= p.value * 0.45; // Just needs to be able to bid decently
      const canLoan = (p.age <= 23 || isBenchwarmer) && c.s > p.ovr;
      return canAfford || canLoan;
    });
    if (!pool.length) pool = ALL_CLUBS.filter((c) => c.cid !== cur.cid).slice(0, 3); // Fallback

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
      
      let isLoanOffer = false;
      if (underage) {
        isLoanOffer = true;
      } else if (p.age <= 23 && c.s > p.ovr + 3) {
        isLoanOffer = true;
      } else if (isBenchwarmer && !canAfford) {
        isLoanOffer = true;
      }
      // Guarantee peak stars never get loaned out simply because a club can't afford them.

      let rawFee = Math.round((p.value * (0.9 + rnd() * 0.5)) / 100000) * 100000;
      let fee = Math.min(rawFee, cap);
      let nk;
      if (state.superAgent && !isLoanOffer) {
        fee = Math.round(Math.min(fee * 1.35, cap * 1.1) / 100000) * 100000;
        nk = 'offerNote.superAgent';
      } else if (isLoanOffer) nk = 'offerNote.devLoan';
      else if (veteran && ['US', 'SA', 'QA', 'AU'].includes(c.countryId)) nk = 'offerNote.sunset';
      else if (veteran && c.countryId === p.countryId) nk = 'offerNote.homecoming';
      else if (c.s >= 88) nk = 'offerNote.royalty';
      else if (c.s > cur.s + 4) nk = 'offerNote.stepUp';
      else nk = 'offerNote.fresh';
      
      offers.push({ 
        type: isLoanOffer ? 'loan' : 'transfer', 
        club: c, 
        fee: isLoanOffer ? null : fee, 
        roleKey: roleKey(p.ovr, c.s, state), 
        role: roleText(p.ovr, c.s, state), 
        noteKey: nk, 
        note: T(nk) 
      });
    });

    state.recentOffers = picked.map((c) => c.cid);
    return offers.slice(0, 3);
  }

  const Offers = {
    roleKey,
    roleText,
    clubTransferCap,
    clubOffers,
    RELEASED_REASONS,
  };

  root.DomainOffers = Offers;
  if (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = Offers;
})(typeof window !== 'undefined' ? window : globalThis);
