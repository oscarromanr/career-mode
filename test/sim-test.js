/* Node test: simulate full careers through the engine and validate invariants. */
'use strict';
const Engine = require('../js/engine.js');
const DATA = require('../js/data.js');

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
assert(DATA.DECISIONS.length >= 140, `140+ decisions (${DATA.DECISIONS.length})`);

DATA.POSITIONS.forEach((p) => {
  const w = DATA.OVR_WEIGHTS[p.id];
  const sum = Object.values(w).reduce((a, b) => a + b, 0);
  assert(Math.abs(sum - 1) < 0.001, `weights sum to 1 for ${p.id}`);
});
const ids = new Set();
DATA.DECISIONS.forEach((d) => { assert(!ids.has(d.id), `dup decision ${d.id}`); ids.add(d.id); });
DATA.BOOSTERS.forEach((b) => { assert(!ids.has(b.id), `dup booster ${b.id}`); ids.add(b.id); });
DATA.CONSUMABLES.forEach((c) => { assert(!ids.has(c.id), `dup consumable ${c.id}`); ids.add(c.id); });

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
  ['a', 'b', 'c'].forEach((k) => {
    const o = d[k];
    if (!o) return;
    assert(o.label && o.label.length > 0, `${d.id}.${k} has label`);
    const fx = o.fx || {};
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
  assert(d.a && d.b, `${d.id} has at least two options`);
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

// ---------- career simulation ----------
function playCareer(position, countryId, verbose) {
  const state = Engine.newCareer({ name: 'Test Player', number: 10, position, countryId });
  assert(state.player.age === 14, 'starts at 14');
  assert(state.player.stamina > 0 && state.player.morale > 0, 'stamina/morale init');
  const academies = Engine.academyOptions(state);
  assert(academies.length === 3, '3 academy options');
  Engine.setAcademy(state, academies[ri(0, 2)].cid);
  assert(state.player.salary > 0, 'salary computed');

  let seasons = 0;
  while (!state.retired) {
    const age = state.player.age;
    if (state.stage === 'decision') {
      const d = Engine.pickDecision(state);
      if (d) {
        const opts = ['a', 'b', 'c'].filter((k) => d[k]);
        const choice = opts[ri(0, opts.length - 1)];
        const opt = d[choice];
        const r = opt.mini
          ? Engine.applyMiniResult(state, d, choice, ['good', 'bad'][ri(0, 1)])
          : Engine.applyDecision(state, d, choice);
        assert(typeof r.out === 'string' && r.out.length > 3, `decision outcome text (${d.id})`);
      }
    }
    if (state.stage === 'booster') {
      const boosters = Engine.rollBoosters(state);
      assert(boosters.length === 3, '3 boosters');
      Engine.applyBooster(state, boosters[ri(0, 2)]);
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
    }
    if (state.stage !== 'sim') {
      const offers = Engine.clubOffers(state);
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
      Engine.applyClubOffer(state, (seasons === 0 && stay) ? stay : offers[ri(0, offers.length - 1)]);
    }
    const res = Engine.simulateSeason(state);
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
  const s = Engine.newCareer({ name: 'Early Bird', number: 9, position: 'ST', countryId: 'BR' });
  Engine.setAcademy(s, Engine.academyOptions(s)[0].cid);
  Engine.simulateSeason(s);
  Engine.retire(s);
  assert(s.retired && s.stage === 'retired', 'manual retire works');
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
    s.player.ovr = 72;
    Engine.simulateSeason(s);
    assert(s.player.earnedNationalities && s.player.earnedNationalities.includes('ZA'), 'earned ZA nationality');
    assert(s.triggerNaturalizationModal === 'ZA', 'triggered naturalization modal');
    assert(s.triggerNtCallUpModal === 'ZA', 'triggered secondary NT call-up for ZA');
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
