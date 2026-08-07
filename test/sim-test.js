/* Node test: simulate full careers through the engine and validate invariants. */
'use strict';
const DATA = require('../js/data.js');
global.GAME_DATA = DATA;
require('../js/data-decisions-canonical.js');
const Engine = require('../js/engine.js');
const State = require('../js/state.js');
const App = require('../js/app.js');
const LEGACY_FIXTURE = require('./fixtures/export-test.json');

let failures = 0;
function assert(cond, msg) {
  if (!cond) { failures++; console.error('  FAIL:', msg); }
}
const ri = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

// ---------- static data validation ----------
console.log('Data sanity:');
console.log('  countries:', DATA.COUNTRIES.length, '| clubs:', Engine.ALL_CLUBS.length, '| decisions:', DATA.DECISIONS.length, '| boosters:', DATA.BOOSTERS.length, '| consumables:', DATA.CONSUMABLES.length);
assert(DATA.COUNTRIES.length === 50, '50 countries');
assert(Engine.ALL_CLUBS.length >= 600, `600+ clubs (${Engine.ALL_CLUBS.length})`);
assert(DATA.DECISIONS.length >= 300, `300+ decisions (${DATA.DECISIONS.length})`);

DATA.POSITIONS.forEach((p) => {
  const w = DATA.OVR_WEIGHTS[p.id];
  const sum = Object.values(w).reduce((a, b) => a + b, 0);
  assert(Math.abs(sum - 1) < 0.001, `weights sum to 1 for ${p.id}`);
});
const ids = new Set();
DATA.DECISIONS.forEach((d) => { assert(!ids.has(d.id), `dup decision ${d.id}`); ids.add(d.id); });
DATA.BOOSTERS.forEach((b) => { assert(!ids.has(b.id), `dup booster ${b.id}`); ids.add(b.id); });
DATA.CONSUMABLES.forEach((c) => { assert(!ids.has(c.id), `dup consumable ${c.id}`); ids.add(c.id); });

DATA.DECISIONS.forEach((d) => {
  const normalized = Engine.normalizeDecision(d);
  const optionKeys = ['a', 'b', 'c'].filter((k) => normalized && normalized[k]);
  assert(optionKeys.length >= 2, `${d.id} normalizes to at least two options`);
  optionKeys.forEach((k) => {
    assert(normalized[k].label, `${d.id}.${k} has a renderable label`);
    assert(normalized[k].mini || (normalized[k].fx && typeof normalized[k].fx === 'object'), `${d.id}.${k} has normalized effects`);
  });
  if (Array.isArray(d.options)) {
    d.options.forEach((o) => {
      assert(o.id && o.text, `${d.id}.${o.id} has text`);
      const hasEffects = Array.isArray(o.changes) || (o.fx && typeof o.fx === 'object')
        || (o.mini && o.mini.results && Object.keys(o.mini.results).length > 0);
      assert(hasEffects, `${d.id}.${o.id} has effects (changes, fx, or mini)`);
    });
  }
});

// decision stat keys valid per position gate
const FIELD_ONLY = ['SHO', 'DRI', 'PHY', 'MEN'];
const GK_ONLY = ['REF', 'LEA', 'VIS', 'COM'];
function checkFxStats(d, optKey, stats) {
  const isGkCard = d.pos === 'gk' || (Array.isArray(d.pos) && d.pos.includes('GK'));
  const isFieldCard = d.pos === 'field' || (Array.isArray(d.pos) && !d.pos.includes('GK'));
  Object.keys(stats || {}).forEach((k) => {
    if (isGkCard && !isFieldCard) assert(!FIELD_ONLY.includes(k), `${d.id}.${optKey}: field stat ${k} on gk card`);
    if (isFieldCard) assert(!GK_ONLY.includes(k), `${d.id}.${optKey}: gk stat ${k} on field card`);
    assert(FIELD_ONLY.includes(k) || GK_ONLY.includes(k) || k === 'PAC' || k === 'PAS', `${d.id}.${optKey}: unknown stat ${k}`);
  });
}
DATA.DECISIONS.forEach((d) => {
  const normalized = Engine.normalizeDecision(d);
  ['a', 'b', 'c'].forEach((k) => {
    const o = normalized[k];
    if (!o) return;
    assert(o.label && o.label.length > 0, `${d.id}.${k} has label`);
    const fx = o.fx || {};
    if (Array.isArray(d.options)) return;
    checkFxStats(d, k, fx.stats);
    if (fx.risk) {
      assert(fx.risk.p > 0 && fx.risk.p < 1, `${d.id}.${k} risk p valid`);
      checkFxStats(d, k + '.good', fx.risk.good && fx.risk.good.stats);
      checkFxStats(d, k + '.bad', fx.risk.bad && fx.risk.bad.stats);
    }
    if (o.mini) {
      assert(['penalty', 'timing'].includes(o.mini.type), `${d.id}.${k} mini type valid`);
      assert(o.mini.results && o.mini.results.good && o.mini.results.bad, `${d.id}.${k} mini has good+bad results`);
      Object.entries(o.mini.results).forEach(([rk, r]) => {
        assert(typeof r.out === 'string' && r.out.length > 3, `${d.id}.${k} mini.${rk} outcome text`);
        checkFxStats(d, k + '.' + rk, r.fx && r.fx.stats);
      });
      if (o.mini.type === 'penalty') {
        assert(o.mini.zones >= 3 && o.mini.goodZones >= 1 && o.mini.goodZones < o.mini.zones, `${d.id}.${k} penalty zones sane`);
      }
    }
  });
  assert(normalized.a && normalized.b, `${d.id} has at least two options`);
  assert(d.min >= 14 && d.max <= 40 && d.min <= d.max, `${d.id} age range valid`);
});

// booster rarity structure
const RARITY_TOTALS = { bronze: 1, silver: 2, gold: 3, diamond: 5 };
DATA.BOOSTERS.forEach((b) => {
  assert(RARITY_TOTALS[b.rarity] !== undefined, `${b.id} rarity valid`);
  const total = Object.values(b.fx).reduce((a, v) => a + v, 0);
  assert(total <= RARITY_TOTALS[b.rarity], `${b.id} total ${total} <= ${RARITY_TOTALS[b.rarity]} for ${b.rarity}`);
  assert(total > 0, `${b.id} has effects`);
});
assert(Math.abs(DATA.RARITY_ROLL.reduce((a, r) => a + r.p, 0) - 94) < 0.01, 'rarity weights 80/10/3/1 of 94');

// tier threshold
assert(Engine.getTier(87) === 'diamond', 'diamond at 87');
assert(Engine.getTier(86) === 'gold', 'gold at 86');
assert(Engine.getTier(75) === 'gold' && Engine.getTier(65) === 'silver' && Engine.getTier(64) === 'bronze', 'tier ladder');

// ---------- phase state and save migration ----------
{
  const migrated = App.loadSave(JSON.parse(JSON.stringify(LEGACY_FIXTURE)));
  assert(migrated.ok, 'legacy save loads');
  const m = migrated.state;
  assert(m.version === 4, `save migrated to version 4 (got ${m.version})`);
  assert(State.phaseKind(m) === 'club', 'legacy club stage migrated to club phase');
  assert(Array.isArray(State.getPhase(m).offers) && State.getPhase(m).offers.length > 0, 'legacy offers moved into phase');
  assert(!Object.prototype.hasOwnProperty.call(m, 'stage'), 'legacy stage removed after migration');
  assert(!Object.prototype.hasOwnProperty.call(m, 'phase'), 'v4 keeps phase in session only');
  assert(m.session && m.session.phase && m.session.phase.kind === 'club', 'session owns the phase');

  const postSeason = JSON.parse(JSON.stringify(LEGACY_FIXTURE));
  postSeason.stage = 'decision';
  delete postSeason.currentOffers;
  delete postSeason.currentDecision;
  const summary = App.loadSave(postSeason).state;
  assert(State.phaseKind(summary) === 'season-summary', 'legacy post-season save resumes at summary');
  assert(summary.session.phase.next.kind === 'club', 'post-season summary has club continuation');

  const fresh = App.startCareer({ name: 'Phase Test', number: 10, position: 'ST', countryId: 'AR' });
  App.chooseAcademy(fresh, State.getPhase(fresh).options[0].cid);
  State.setPhase(fresh, State.simulating());
  const { result } = App.completeSeason(fresh);
  const roundTrip = App.loadSave(App.serialize(fresh)).state;
  assert(State.phaseKind(roundTrip) === 'season-summary', 'season completion persists summary phase');
  assert(roundTrip.session.phase.result.year === result.year, 'summary result survives save round-trip');
  assert(roundTrip.session.phase.next.offers.length >= 1, 'summary stores next club offers');
  App.dismissSummary(roundTrip);
  assert(State.phaseKind(roundTrip) === 'club', 'summary continuation enters club phase');
  console.log('Phase model and migration OK');
}

// alternate decision schema: options must execute through the normal engine path
{
  const s = Engine.newCareer({ name: 'Decision Schema', number: 10, position: 'CM', countryId: 'AR' });
  Engine.setAcademy(s, Engine.academyOptions(s)[0].cid);
  s.player.age = 20;
  const d = DATA.DECISIONS.find((x) => x.id === 'conflict-teammate-feud');
  const result = Engine.applyDecision(s, d, 'a');
  assert(result.out.length > 0, 'alternate decision schema produces an outcome');
  assert(result.changes.some((x) => x.k === 'LOYALTY' || x.k === 'PHY'), 'alternate decision effects apply');
  console.log('Alternate decision schema OK');
}

// ---------- career simulation ----------
function playCareer(position, countryId, verbose) {
  const state = App.startCareer({ name: 'Test Player', number: 10, position, countryId });
  assert(state.player.age === 14, 'starts at 14');
  assert(state.player.stamina > 0 && state.player.morale > 0, 'stamina/morale init');
  const academies = State.getPhase(state).options;
  assert(academies.length === 3, '3 academy options');
  App.chooseAcademy(state, academies[ri(0, 2)].cid);
  assert(state.player.salary > 0, 'salary computed');

  let seasons = 0;
  while (!state.retired) {
    const age = state.player.age;
    const phase = State.getPhase(state);

    if (phase.kind === 'season-summary') {
      App.dismissSummary(state);
      continue;
    }

    if (phase.kind === 'decision') {
      const d = phase.card;
      if (d) {
        const opts = ['a', 'b', 'c'].filter((k) => d[k]);
        const choice = opts[ri(0, opts.length - 1)];
        const opt = d[choice];
        let r;
        if (opt.mini) {
          App.chooseDecision(state, choice); // moves to booster(null), returns minigame
          r = App.resolveMiniResult(state, d, choice, ['good', 'bad'][ri(0, 1)]);
        } else {
          r = App.chooseDecision(state, choice).result;
        }
        assert(typeof r.out === 'string' && r.out.length > 3, `decision outcome text (${d.id})`);
      } else {
        State.setPhase(state, State.booster(null));
      }
      continue;
    }

    if (phase.kind === 'booster') {
      if (!Array.isArray(phase.options) || !phase.options.length) App.enterBooster(state);
      const boosters = State.getPhase(state).options;
      assert(boosters.length === 3, '3 boosters');
      App.chooseBooster(state, boosters[ri(0, 2)].id);
      // shop: buy something affordable in even seasons
      if (seasons % 2 === 0) {
        const items = Engine.shopItems(state).filter((i) => i.affordable);
        if (items.length) {
          const buy = Engine.buyConsumable(state, items[0].id);
          assert(buy.ok, 'consumable purchase works');
          const again = Engine.buyConsumable(state, items[0].id);
          assert(!again.ok, 'one consumable per season enforced');
        }
      }
      continue;
    }

    if (phase.kind === 'club') {
      const offers = phase.offers;
      assert(offers.length >= 1 && offers.length <= 3, `1-3 club offers (${offers.length})`);
      if (age < 18 && !state.isFreeAgent) {
        offers.forEach((o) => {
          if (o.type === 'stay' || o.type === 'released' || o.type === 'return') return;
          assert(o.type === 'loan', `U18 only loans (got ${o.type} to ${o.club.n})`);
          const curCountry = state.club ? Engine.clubByCid(state.club.cid).countryId : state.player.countryId;
          assert(o.club.countryId === state.player.countryId || o.club.countryId === curCountry || o.club.countryId === undefined, `U18 stays domestic (${o.club.n} in ${o.club.countryName})`);
        });
      }
      const stay = offers.find((o) => o.type === 'stay');
      const pick = (seasons === 0 && stay) ? stay : offers[ri(0, offers.length - 1)];
      App.chooseClub(state, offers.indexOf(pick));
      continue;
    }

    assert(State.phaseKind(state) === 'simulating', `career phase is simulating (${State.phaseKind(state)})`);
    const { result: res } = App.completeSeason(state);
    seasons++;
    assert(res.apps >= 0 && res.apps <= 46, `apps in range (${res.apps})`);
    assert(res.rating >= 5.9 && res.rating <= 9.9, `rating in range (${res.rating})`);
    assert(state.player.ovr >= 35 && state.player.ovr <= 99, `ovr in range (${state.player.ovr})`);
    assert(state.player.stamina >= 5 && state.player.stamina <= 100, `stamina in range (${state.player.stamina})`);
    assert(state.player.morale >= 5 && state.player.morale <= 100, `morale in range (${state.player.morale})`);
    assert(state.earnings >= 0 && state.earnings >= state.spent, `earnings/spent sane (${state.earnings}/${state.spent})`);
    // standings
    assert(state.standings, 'standings exist');
    if (state.club) {
      const c = Engine.countryById(Engine.clubByCid(state.club.cid).countryId);
      assert(state.standings.length === c.clubs.length, `standings covers league (${state.standings.length}/${c.clubs.length})`);
    }
    for (let i = 1; i < state.standings.length; i++) {
      assert(state.standings[i - 1].pts >= state.standings[i].pts, 'standings sorted');
    }
    if (verbose && seasons % 6 === 0) {
      console.log(`  ${res.year} age ${res.age}: ${res.clubName} — ${res.apps} apps, ${res.goals}g ${res.assists}a, ovr ${res.ovrBefore}->${res.ovrAfter}, sta ${res.stamina}, mor ${res.morale}, ${Engine.fmtValue(res.salary)}/yr`);
    }
  }
  assert(seasons === 27, `career is 27 seasons (got ${seasons})`);
  const sum = Engine.careerSummary(state);
  assert(sum.stints.length >= 1, 'summary stints');
  assert(sum.totals.apps === state.history.reduce((a, h) => a + h.apps, 0), 'totals match');
  assert(sum.earnings > 0, 'career earnings tracked');
  assert(sum.retireType === 'full', 'full career type');
  return { state, sum };
}

console.log('\nCareer 1: ST from Argentina (verbose):');
const c1 = playCareer('ST', 'AR', true);
console.log('  totals:', JSON.stringify(c1.sum.totals));
console.log('  peak ovr:', c1.sum.peakOvr, '| peak value:', Engine.fmtValue(c1.sum.peakValue), '| earnings:', Engine.fmtValue(c1.sum.earnings), '| legacy:', c1.sum.legacy);

console.log('\nCareer 2: GK from Germany:');
const c2 = playCareer('GK', 'DE', false);
console.log('  totals:', JSON.stringify(c2.sum.totals));
assert(c2.sum.totals.goals === 0, 'GK no goals');
assert(c2.sum.totals.saves > 0, 'GK has saves');

console.log('\nCareer 3: CM from Japan:');
const c3 = playCareer('CM', 'JP', false);
console.log('  peak ovr:', c3.sum.peakOvr, '| caps:', c3.sum.totals.caps);

console.log('\nCareer 4: RW from Senegal:');
const c4 = playCareer('RW', 'SN', false);
console.log('  peak ovr:', c4.sum.peakOvr, '| stints:', c4.sum.stints.length);

// manual retirement
{
  const s = App.startCareer({ name: 'Early Bird', number: 9, position: 'ST', countryId: 'BR' });
  App.chooseAcademy(s, State.getPhase(s).options[0].cid);
  State.setPhase(s, State.simulating());
  App.completeSeason(s);
  App.retire(s);
  assert(s.retired && State.phaseKind(s) === 'retired', 'manual retire works');
  assert(['wonderkid', 'quiet', 'pro', 'star', 'legend', 'journeyman'].includes(s.retireType), `retire type valid (${s.retireType})`);
  const sum = Engine.careerSummary(s);
  assert(sum.retireType === s.retireType, 'summary carries retire type');
  console.log('\nManual retire at 15 OK, type:', s.retireType);
}

// club offer variety: star player should see MANY different clubs over seasons
{
  const s = Engine.newCareer({ name: 'Variety Test', number: 10, position: 'ST', countryId: 'MX' });
  Engine.setAcademy(s, Engine.academyOptions(s)[0].cid);
  while (s.player.age < 24) {
    const b = Engine.rollBoosters(s); Engine.applyBooster(s, b[0]);
    const offers = Engine.clubOffers(s);
    Engine.applyClubOffer(s, offers.find((o) => o.type === 'stay') || offers[0]);
    Engine.simulateSeason(s);
  }
  // juice to star level
  const keys = Engine.statKeys(false);
  let guard = 500;
  while (Engine.getOvr(s.player.stats, 'ST') < 84 && guard-- > 0) s.player.stats[keys[guard % keys.length]] = Math.min(99, s.player.stats[keys[guard % keys.length]] + 1);
  Engine.recompute(s);
  const seen = new Set();
  for (let i = 0; i < 8; i++) {
    const offers = Engine.clubOffers(s);
    offers.forEach((o) => { if (o.type !== 'stay') seen.add(o.club.cid); });
  }
  console.log('\nOffer variety: distinct clubs offered over 8 windows:', seen.size);
  assert(seen.size >= 5, `offer variety >= 5 distinct clubs (got ${seen.size})`);
}

// free-agent market: strict rating filters must not leave the club stage empty
{
  const s = Engine.newCareer({ name: 'Free Agent Fallback', number: 10, position: 'ST', countryId: 'AR' });
  s.player.age = 25;
  s.player.ovr = 99;
  s.player.peakOvr = 99;
  s.club = null;
  s.isFreeAgent = true;
  s.clubSituation = 'listed';
  s.lastClubCid = 'ES:Real Madrid';
  s.lastLoanClubCid = null;
  s.history = [];
  const offers = Engine.clubOffers(s);
  assert(offers.length >= 1 && offers.length <= 3, `free-agent fallback offers (${offers.length})`);
  console.log('Free-agent offer fallback OK');
}

// position-gated decisions
{
  const stState = Engine.newCareer({ name: 'P', number: 9, position: 'ST', countryId: 'BR' });
  const gkState = Engine.newCareer({ name: 'G', number: 1, position: 'GK', countryId: 'BR' });
  const stCard = DATA.DECISIONS.find((d) => d.id === 'st-poacher');
  const gkCard = DATA.DECISIONS.find((d) => d.id === 'gk-voice');
  stState.player.age = 20; gkState.player.age = 20;
  const stPool = DATA.DECISIONS.filter((d) => {
    if (stState.player.age < d.min || stState.player.age > d.max) return false;
    if (d.pos === 'gk') return false;
    if (d.pos === 'field') return true;
    if (Array.isArray(d.pos) && !d.pos.includes('ST')) return false;
    return true;
  });
  assert(stPool.includes(stCard), 'st-poacher eligible for ST');
  assert(!stPool.includes(gkCard), 'gk card not eligible for ST');
  console.log('Position gating OK');
}

// minigame result application
{
  const s = Engine.newCareer({ name: 'Mini', number: 9, position: 'ST', countryId: 'AR' });
  Engine.setAcademy(s, Engine.academyOptions(s)[0].cid);
  s.player.age = 25;
  const d = DATA.DECISIONS.find((x) => x.id === 'shootout-hero');
  const before = s.player.stats.MEN;
  const r1 = Engine.applyMiniResult(s, d, 'a', 'good');
  assert(r1.out.length > 3 && s.player.stats.MEN === Math.min(99, before + 3), 'mini good result applies fx');
  assert(s.usedDecisions.includes('shootout-hero'), 'mini marks decision used');
  const d2 = DATA.DECISIONS.find((x) => x.id === 'record-pen');
  const r2 = Engine.applyMiniResult(s, d2, 'a', 'mid');
  assert(typeof r2.out === 'string', 'timing mid result works');
  console.log('Minigame engine OK');
}

// Naturalization & dual nationality call-up test
{
  const s = Engine.newCareer({ name: 'Dual Nat', number: 10, position: 'ST', countryId: 'ES' });
  Engine.setAcademy(s, Engine.academyOptions(s)[0].cid);
  const zaClub = Engine.ALL_CLUBS.find((c) => c.countryId === 'ZA');
  if (zaClub) {
    s.club = { cid: zaClub.cid, yearsLeft: 5 };
    s.countrySeasons = { ZA: 4 };
    s.player.age = 18;
    Engine.statKeys(false).forEach((k) => s.player.stats[k] = 80);
    Engine.recompute(s);

    Engine.simulateSeason(s);
    assert(s.player.earnedNationalities && s.player.earnedNationalities.includes('ZA'), 'earned ZA nationality');
    assert(State.peekEffect(s, 'nt-callup') && State.peekEffect(s, 'nt-callup').countryCode === 'ES', 'Spain calls up first as birth nation');
    
    // Decline Spain temporarily
    Engine.declineNtCallUpTemp(s, 'ES');
    assert(s.ntDeclinedCooldowns['ES'] === 2, 'Spain set on 2-season cooldown');
    assert(!State.peekEffect(s, 'nt-callup'), 'declining consumes the pending effect');

    // Next season: Spain is on cooldown, South Africa should call up!
    Engine.simulateSeason(s);
    assert(State.peekEffect(s, 'nt-callup') && State.peekEffect(s, 'nt-callup').countryCode === 'ZA', 'South Africa calls up while Spain is on cooldown');

    // Decline South Africa temporarily
    Engine.declineNtCallUpTemp(s, 'ZA');
    assert(s.ntDeclinedCooldowns['ZA'] === 2, 'ZA set on 2-season cooldown');

    // Next season: Spain off cooldown, Spain calls up again!
    Engine.simulateSeason(s);
    assert(State.peekEffect(s, 'nt-callup') && State.peekEffect(s, 'nt-callup').countryCode === 'ES', 'Spain calls back after cooldown expires');
  }
  console.log('Naturalization & Dual Nationality Call-Up test OK');
}

// peak distribution
console.log('\nDistribution over 40 random careers:');
const peaks = [], values = [], trophyCounts = [], earningsArr = [];
const positions = DATA.POSITIONS.map((p) => p.id);
for (let i = 0; i < 40; i++) {
  const { sum } = playCareer(positions[i % positions.length], DATA.COUNTRIES[i % DATA.COUNTRIES.length].id, false);
  peaks.push(sum.peakOvr);
  values.push(sum.peakValue);
  earningsArr.push(sum.earnings);
  trophyCounts.push(sum.counts.League + sum.counts.Cup + sum.counts.Continental + sum.counts.Country);
}
const avg = (a) => a.reduce((x, y) => x + y, 0) / a.length;
console.log('  peakOvr min/avg/max:', Math.min(...peaks), '/', avg(peaks).toFixed(1), '/', Math.max(...peaks));
console.log('  peakValue min/avg/max:', Engine.fmtValue(Math.min(...values)), '/', Engine.fmtValue(avg(values)), '/', Engine.fmtValue(Math.max(...values)));
console.log('  trophies min/avg/max:', Math.min(...trophyCounts), '/', avg(trophyCounts).toFixed(1), '/', Math.max(...trophyCounts));
console.log('  earnings min/avg/max:', Engine.fmtValue(Math.min(...earningsArr)), '/', Engine.fmtValue(avg(earningsArr)), '/', Engine.fmtValue(Math.max(...earningsArr)));
assert(Math.max(...peaks) >= 80, 'at least one career reaches 80+ peak');
assert(Math.min(...peaks) >= 55, 'every career grows somewhat');

console.log(failures === 0 ? '\nALL TESTS PASSED' : `\n${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
