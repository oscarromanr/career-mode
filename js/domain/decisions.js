/* ============================================================
   CAREER MODE '26 - domain: decisions
   Decision eligibility, normalization, effect application.
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

  const { DATA } = Model;
  const { recompute } = Player;
  const { clamp, chance, pick } = Rng;

  const DECISION_STAT_KEYS = new Set(['PAC', 'PAS', 'DRI', 'SHO', 'PHY', 'MEN', 'REF', 'LEA', 'VIS', 'COM']);
  const DECISION_CHANGE_STATS = { pos: 'MEN', tac: 'MEN', def: 'PHY', kic: 'PAS', att: 'SHO' };
  const DECISION_POSITION_GROUPS = {
    att: ['ST', 'CF', 'LW', 'RW'],
    def: ['CB', 'LB', 'RB'],
    mid: ['CM', 'CAM', 'CDM', 'LM', 'RM'],
  };

  function changesToFx(changes) {
    const fx = {};
    const stats = {};
    (changes || []).forEach((change) => {
      const key = String(change.k || '').toLowerCase();
      const amount = Number(change.d) || 0;
      if (!amount) return;
      if (key === 'sta') fx.stam = (fx.stam || 0) + amount;
      else if (key === 'mor') fx.mor = (fx.mor || 0) + amount;
      else if (key === 'rep') fx.rep = (fx.rep || 0) + amount;
      else if (key === 'loyalty') fx.loyalty = (fx.loyalty || 0) + amount;
      else if (key === 'money') fx.money = (fx.money || 0) + amount;
      else {
        const stat = DECISION_CHANGE_STATS[key] || key.toUpperCase();
        if (DECISION_STAT_KEYS.has(stat)) stats[stat] = (stats[stat] || 0) + amount;
      }
    });
    if (Object.keys(stats).length) fx.stats = stats;
    return fx;
  }

  function normalizeDecision(decision) {
    if (!decision || !Array.isArray(decision.options)) return decision;
    const normalized = Object.assign({}, decision);
    decision.options.forEach((option) => {
      normalized[option.id] = {
        label: option.text || option.label || option.id.toUpperCase(),
        sub: option.sub || '',
        out: option.out || option.text || option.label || '',
        fx: option.fx || changesToFx(option.changes),
        mini: option.mini,
      };
    });
    return normalized;
  }

  function outcomeText(decisionId, key, fallback) {
    if (root.I18n && root.I18n.TD) {
      const translated = root.I18n.TD('decisionOutcomes', decisionId, key);
      if (translated) return translated;
    }
    return fallback;
  }

  function decisionEligible(state, d) {
    const p = state.player;
    if (p.age < d.min || p.age > d.max) return false;
    if (d.pos === 'gk' && !p.isGK) return false;
    if (d.pos === 'field' && p.isGK) return false;
    if (DECISION_POSITION_GROUPS[d.pos] && !DECISION_POSITION_GROUPS[d.pos].includes(p.position)) return false;
    if (Array.isArray(d.pos) && !d.pos.includes(p.position)) return false;
    if (state.usedDecisions.includes(d.id)) return false;
    if (d.id === 'ballon-campaign' && p.ovr < 82) return false;
    if (d.id === 'last-dance' && p.ovr < 76) return false;
    if (d.id === 'semi-pen' && p.ovr < 74) return false;
    if (d.id === 'shootout-hero' && p.ovr < 68) return false;

    // Gating for National Team decisions — only eligible once called up to National Team!
    const isNtDecision = d.requiresNt || ['national-legend-call', 'legend-mentor-session', 'international-fumes', 'gk-number-one-race'].includes(d.id);
    if (isNtDecision && !state.ntCalledUp && (!state.totals || !state.totals.caps)) return false;

    if (d.requiresTournament) {
      const club = Model.clubByCid(state.club && state.club.cid);
      const isWcYear = state.year % 4 === 2;
      const canPlayWc = state.ntCalledUp && isWcYear;
      const isTopClub = club && club.s >= 75;
      if (!isTopClub && !canPlayWc) return false;
    }

    return true;
  }

  function pickDecision(state) {
    const pool = DATA.DECISIONS.filter((d) => decisionEligible(state, d));
    if (!pool.length) return null;
    // position-specific cards get double weight
    const weighted = pool.flatMap((d) => (Array.isArray(d.pos) ? [d, d] : [d]));
    return normalizeDecision(pick(weighted));
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
    const miss = 0.2 + Rng.rnd() * 0.3;
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
    if (fx.rep) {
      const before = p.reputation || 0;
      Player.addReputation(state, fx.rep);
      if (p.reputation !== before) changes.push({ k: 'REP', d: p.reputation - before });
    }
    if (fx.loyalty) {
      const before = p.loyalty || 20;
      const cid = state.club && state.club.cid;
      if (cid) {
        state.clubLoyalty = state.clubLoyalty || {};
        state.clubLoyalty[cid] = clamp((state.clubLoyalty[cid] || before) + fx.loyalty, 0, 100);
        p.loyalty = state.clubLoyalty[cid];
      } else {
        p.loyalty = clamp(before + fx.loyalty, 0, 100);
      }
      if (p.loyalty !== before) changes.push({ k: 'LOYALTY', d: p.loyalty - before });
    }
    if (fx.money) {
      const before = state.earnings - state.spent;
      if (fx.money > 0) state.earnings += fx.money;
      else state.spent += Math.min(-fx.money, Math.max(0, before));
      const after = state.earnings - state.spent;
      if (after !== before) changes.push({ k: 'MONEY', d: after - before });
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
    if (fx.special === 'winTitle' || fx.special === 'winTitlePassive') {
      state.pendingTrophy = true;
    }
    return changes;
  }

  function applyDecision(state, decision, choice) {
    decision = normalizeDecision(decision);
    const opt = decision[choice];
    let fallback = opt.out || '';
    let out = fallback;
    if (root.I18n && root.I18n.TD) {
      const translated = root.I18n.TD('decision', decision, choice + '.out');
      if (translated) out = translated;
    }
    let changes = [];
    if (opt.fx && opt.fx.risk) {
      const r = opt.fx.risk;
      const good = chance(r.p);
      changes = applyFx(state, good ? r.good : r.bad);
      const outs = RISK_OUTCOMES[decision.id];
      const fallbackRisk = outs ? (good ? outs.good : outs.bad) : fallback;
      out = outcomeText(decision.id, good ? 'good' : 'bad', fallbackRisk);
      state.usedDecisions.push(decision.id);
      recompute(state);
      return { out, changes, risk: true, good };
    }
    changes = applyFx(state, opt.fx);

    state.usedDecisions.push(decision.id);
    recompute(state);
    return { out, changes, risk: false };
  }

  // Interactive minigames (penalty zones / timing bar) — result decided by UI skill/luck
  function applyMiniResult(state, decision, optKey, resultKey) {
    decision = normalizeDecision(decision);
    const opt = decision[optKey];
    const mini = opt && opt.mini;
    if (!mini) return { out: '', changes: [] };

    let res = mini.results[resultKey] || mini.results.bad || mini.results.good;
    let fallback = res.out || '';
    let out = outcomeText(decision.id, resultKey, fallback);

    let fxToApply = res.fx || {};

    const changes = applyFx(state, fxToApply);
    state.usedDecisions.push(decision.id);
    recompute(state);
    return { out, changes };
  }

  const Decisions = {
    changesToFx,
    normalizeDecision,
    decisionEligible,
    pickDecision,
    applyDecision,
    applyMiniResult,
    applyFx,
    logStatNote,
    outcomeText,
    DECISION_POSITION_GROUPS,
  };

  root.DomainDecisions = Decisions;
  if (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = Decisions;
})(typeof window !== 'undefined' ? window : globalThis);
