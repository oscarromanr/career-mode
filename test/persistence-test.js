/* Persistence & determinism tests: seeded RNG replay, save envelope
   round-trips, recovery policy, corrupt-save handling. */
'use strict';
const DATA = require('../js/data.js');
global.GAME_DATA = DATA;
require('../js/data-decisions-canonical.js');
const Engine = require('../js/engine.js');
const State = require('../js/state.js');
const App = require('../js/app.js');
const Rng = require('../js/domain/rng.js');
const LEGACY_FIXTURE = require('./fixtures/export-test.json');

let failures = 0;
function assert(cond, msg) {
  if (!cond) { failures++; console.error('  FAIL:', msg); }
}
function deepEqual(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

console.log('Persistence & determinism tests:');

// ---------- seeded replay: same seed + actions => same career ----------
{
  function play(seed) {
    const s = App.startCareer({ name: 'Replay', number: 10, position: 'ST', countryId: 'AR' }, seed);
    assert(s.rngSeed === seed, 'career seeded from param');
    // Fixed action sequence: academy 0 -> decision a -> booster 0 -> season
    // -> club 0 -> decision -> booster -> season (2 full seasons)
    App.chooseAcademy(s, State.getPhase(s).options[0].cid);
    const d = State.getPhase(s).card;
    if (d) App.chooseDecision(s, d.a ? 'a' : 'b');
    App.enterBooster(s);
    App.chooseBooster(s, State.getPhase(s).options[0].id);
    App.completeSeason(s);
    App.dismissSummary(s);
    App.chooseClub(s, 0);
    App.enterBooster(s);
    App.chooseBooster(s, State.getPhase(s).options[0].id);
    App.completeSeason(s);
    return s;
  }

  const run1 = play(12345);
  const run2 = play(12345);
  const run3 = play(99999);
  assert(deepEqual(run1.player.stats, run2.player.stats), 'same seed reproduces identical stats');
  assert(deepEqual(run1.history, run2.history), 'same seed reproduces identical history');
  assert(run1.rngCursor === run2.rngCursor, 'cursor advances identically');
  assert(!deepEqual(run1.player.stats, run3.player.stats), 'different seed diverges');
  console.log('  seeded replay OK');
}

// ---------- save envelope round-trip ----------
{
  const s = App.startCareer({ name: 'Envelope', number: 7, position: 'GK', countryId: 'DE' });
  App.chooseAcademy(s, State.getPhase(s).options[1].cid);
  const env = JSON.parse(App.serialize(s));
  assert(env.schemaVersion === 4, 'envelope schemaVersion 4');
  assert(typeof env.savedAt === 'string' && env.savedAt.length > 10, 'envelope savedAt');
  assert(env.gameVersion === 'cm26', 'envelope gameVersion');
  assert(typeof env.rng.seed === 'number' && typeof env.rng.cursor === 'number', 'envelope carries rng seed+cursor');
  assert(env.state.player.name === 'Envelope', 'envelope carries state');

  const loaded = App.loadSave(JSON.stringify(env));
  assert(loaded.ok, 'envelope loads');
  assert(State.phaseKind(loaded.state) === 'decision', 'envelope resumes phase');
  assert(deepEqual(loaded.state.player.stats, s.player.stats), 'player state round-trips');

  // bare state (old export format) still loads
  const bare = App.loadSave(JSON.stringify(s));
  assert(bare.ok, 'bare state loads');
  assert(State.phaseKind(bare.state) === 'decision', 'bare state resumes phase');

  // legacy v2 export fixture still loads
  const legacy = App.loadSave(JSON.stringify(LEGACY_FIXTURE));
  assert(legacy.ok, 'legacy v2 fixture loads');
  assert(legacy.state.version === 4, 'legacy fixture migrates to v4');
  console.log('  envelope round-trip OK');
}

// ---------- corrupt / malformed saves ----------
{
  assert(!App.loadSave('garbage{').ok, 'garbage JSON rejected');
  assert(!App.loadSave('{"nope":1}').ok, 'non-save object rejected');
  assert(!App.loadSave('[]').ok, 'array rejected');
  const broken = JSON.parse(App.serialize(App.startCareer({ name: 'X', number: 1, position: 'ST', countryId: 'BR' })));
  broken.state.player.stats = null;
  assert(!App.loadSave(JSON.stringify(broken)).ok, 'null stats rejected');
  broken.state.session.phase = { kind: 'bogus' };
  assert(!App.loadSave(JSON.stringify(broken)).ok, 'bogus phase rejected');
  console.log('  corrupt saves rejected OK');
}

// ---------- recovery policy: never rerun a completed season ----------
{
  const s = App.startCareer({ name: 'Recovery', number: 3, position: 'CM', countryId: 'ES' });
  App.chooseAcademy(s, State.getPhase(s).options[0].cid);
  App.enterBooster(s);
  App.chooseBooster(s, State.getPhase(s).options[0].id);
  App.completeSeason(s);
  assert(State.phaseKind(s) === 'season-summary', 'season completed into summary');
  const historyLen = s.history.length;
  const season = s.season;
  const savedSummary = App.serialize(s);

  // Simulate reload: load the summary save, dismiss, never reroll offers
  const reloaded = App.loadSave(savedSummary).state;
  assert(State.phaseKind(reloaded) === 'season-summary', 'reload resumes at summary');
  assert(reloaded.history.length === historyLen && reloaded.season === season, 'reload does not rerun the season');
  const storedOffers = State.getPhase(reloaded).next.offers.map((o) => o.club.cid);
  App.dismissSummary(reloaded);
  assert(State.getPhase(reloaded).offers.map((o) => o.club.cid).join() === storedOffers.join(), 'exact offers preserved after reload');
  console.log('  recovery policy OK');
}

// ---------- replay of reported transfer-options bug (high-OVR fallback) ----------
{
  const s = App.startCareer({ name: 'Transfer Bug', number: 9, position: 'ST', countryId: 'AR' }, 555);
  s.player.age = 25;
  s.player.ovr = 99;
  s.player.peakOvr = 99;
  s.player.value = 80000000;
  s.club = null;
  s.isFreeAgent = true;
  s.clubSituation = 'listed';
  s.lastClubCid = 'ES:Real Madrid';
  s.history = [];
  s.rngCursor = 0;
  Rng.bind(s);
  const offers1 = Engine.clubOffers(s);
  assert(offers1.length >= 1 && offers1.length <= 3, `fallback offers generated (${offers1.length})`);
  // Same seed, same state: identical offers
  s.rngCursor = 0;
  Rng.bind(s);
  const offers2 = Engine.clubOffers(s);
  assert(deepEqual(offers1, offers2), 'transfer options reproducible from seed');
  console.log('  transfer-options replay OK');
}

console.log(failures === 0 ? '\nPERSISTENCE TESTS PASSED' : `\n${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
