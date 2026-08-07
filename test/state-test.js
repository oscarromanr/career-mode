/* State model hardening tests: phase payloads, validators, transitions,
   invalid actions, save round-trips, and reload behavior per phase. */
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
function expectThrow(fn, msg) {
  try { fn(); console.error('  FAIL: expected throw:', msg); failures++; }
  catch (e) { /* expected */ }
}
function freshCareer(position, countryId) {
  const s = App.startCareer({ name: 'State Test', number: 10, position: position || 'ST', countryId: countryId || 'AR' });
  App.chooseAcademy(s, State.getPhase(s).options[0].cid);
  return s;
}

console.log('State model tests:');

// ---------- phase constructors and payload validation ----------
{
  assert(State.academy(null).kind === 'academy', 'academy constructor');
  assert(State.decision(null).kind === 'decision' && State.decision(null).card === null, 'decision null card = quiet week');
  assert(State.booster(null).options === null, 'booster pending payload explicit');
  assert(State.club(null).offers === null, 'club pending payload explicit');
  assert(State.seasonSummary({ year: 2026 }, State.club([])).next.kind === 'club', 'summary stores continuation');
  assert(State.retired().kind === 'retired', 'retired constructor');
  assert(State.validatePhase({ kind: 'club', offers: 'nope' }).length > 0, 'club rejects non-array offers');
  assert(State.validatePhase({ kind: 'season-summary', result: null, next: State.club([]) }).length > 0, 'summary requires result');
  assert(State.validatePhase({ kind: 'season-summary', result: { year: 2026 }, next: null }).length > 0, 'summary requires next');
  assert(State.validatePhase({ kind: 'decision', card: { title: 'x' } }).length === 0, 'decision accepts card');
  assert(State.validatePhase({ kind: 'simulating' }).length === 0, 'simulating valid');
  assert(State.validatePhase({ kind: 'bogus' }).length > 0, 'unknown kind rejected');
  assert(State.validatePhase(null).length > 0, 'null phase rejected');
  console.log('  constructors + payload validation OK');
}

// ---------- save validation (imported JSON / localStorage) ----------
{
  const good = freshCareer();
  const v = State.validate(good);
  assert(v.ok, 'fresh career validates');
  const bad = JSON.parse(App.serialize(good)).state;
  delete bad.player.stats;
  assert(!State.validate(bad).ok, 'missing stats rejected');
  const bad2 = JSON.parse(App.serialize(good)).state;
  bad2.session.phase = { kind: 'nope' };
  assert(!State.validate(bad2).ok, 'bad phase rejected');
  const bad3 = JSON.parse(App.serialize(good)).state;
  bad3.session.overlay = 'weird';
  assert(!State.validate(bad3).ok, 'bad overlay rejected');
  assert(!App.loadSave('not json {').ok, 'malformed JSON rejected');
  assert(!App.loadSave(null).ok, 'null raw rejected');
  assert(!App.loadSave({ player: {} }).ok, 'player without stats rejected');
  assert(!App.loadSave({ player: { stats: {} } }).ok, 'no version/phase rejected');
  console.log('  save validation OK');
}

// ---------- migrations ----------
{
  const m = App.loadSave(JSON.parse(JSON.stringify(LEGACY_FIXTURE)));
  assert(m.ok, 'legacy fixture loads');
  assert(m.state.version === 4, 'legacy fixture migrated to v4');
  assert(m.state.session && m.state.session.phase, 'legacy fixture gains session');

  // v3 save (phase at top level) migrates to v4 session
  const v3 = freshCareer();
  delete v3.session;
  v3.phase = State.club([{ type: 'stay', club: Engine.clubByCid('AR:River Plate') }]);
  v3.version = 3;
  v3.triggerNaturalizationModal = 'AR';
  v3.triggerNtCallUpModal = 'BR';
  const v4 = App.loadSave(v3).state;
  assert(v4.version === 4, 'v3 -> v4 version bump');
  assert(!('phase' in v4), 'v3 phase moved into session');
  assert(v4.session.phase.kind === 'club', 'v3 phase preserved under session');
  assert(State.peekEffect(v4, 'naturalization') && State.peekEffect(v4, 'naturalization').countryId === 'AR', 'naturalization flag migrated to effect');
  assert(State.peekEffect(v4, 'nt-callup') && State.peekEffect(v4, 'nt-callup').countryCode === 'BR', 'nt flag migrated to effect');
  assert(!('triggerNaturalizationModal' in v4) && !('triggerNtCallUpModal' in v4), 'old flags removed');
  console.log('  migrations OK');
}

// ---------- transitions: success + invalid action ----------
{
  const s = freshCareer();
  assert(State.phaseKind(s) === 'decision', 'academy choice enters decision');

  expectThrow(() => App.chooseClub(s, 0), 'chooseClub from decision phase throws');
  expectThrow(() => App.chooseBooster(s, 'x'), 'chooseBooster from decision phase throws');
  expectThrow(() => App.dismissSummary(s), 'dismissSummary without summary throws');
  expectThrow(() => App.completeSeason(s), 'completeSeason from decision phase throws');

  // decision -> booster (quiet week path via skip)
  App.enterBooster(s);
  assert(State.phaseKind(s) === 'booster', 'enterBooster works');
  assert(State.getPhase(s).options.length === 3, 'boosters rolled once into payload');

  // booster -> simulating
  App.chooseBooster(s, State.getPhase(s).options[0].id);
  assert(State.phaseKind(s) === 'simulating', 'booster choice enters simulating');

  // simulating -> season-summary
  const { result } = App.completeSeason(s);
  assert(State.phaseKind(s) === 'season-summary', 'season completes into summary');
  assert(State.getPhase(s).result.year === result.year, 'summary carries result');
  assert(State.getPhase(s).next.offers.length >= 1, 'summary carries pre-generated offers');

  // summary -> club (exact offers, no reroll)
  const storedOffers = State.getPhase(s).next.offers.map((o) => o.club.cid);
  App.dismissSummary(s);
  assert(State.phaseKind(s) === 'club', 'dismiss summary enters club');
  const shownOffers = State.getPhase(s).offers.map((o) => o.club.cid);
  assert(JSON.stringify(storedOffers) === JSON.stringify(shownOffers), 'summary offers preserved exactly, never rerolled');

  // club -> decision
  App.chooseClub(s, 0);
  assert(State.phaseKind(s) === 'decision', 'club choice enters decision');

  // decision with minigame returns minigame descriptor
  State.setPhase(s, State.decision(DATA.DECISIONS.find((x) => x.id === 'shootout-hero')));
  const d = State.getPhase(s).card;
  const r = App.chooseDecision(s, 'a');
  assert(r.minigame && r.minigame.type === 'penalty', 'minigame option returns descriptor');
  const res = App.resolveMiniResult(s, d, 'a', 'good');
  assert(res.out.length > 3, 'minigame result resolves');
  assert(State.phaseKind(s) === 'booster', 'minigame resolution leaves booster pending phase');
  console.log('  transitions OK');
}

// ---------- reload behavior per phase ----------
{
  const s = freshCareer();
  const serialized = App.serialize(s);
  const loaded = App.loadSave(serialized).state;
  assert(State.phaseKind(loaded) === State.phaseKind(s), 'reload preserves decision phase');

  App.enterBooster(s);
  const rel2 = App.loadSave(App.serialize(s)).state;
  assert(State.getPhase(rel2).options.length === State.getPhase(s).options.length, 'reload preserves booster payload');

  App.chooseBooster(s, State.getPhase(s).options[0].id);
  App.completeSeason(s);
  const rel3 = App.loadSave(App.serialize(s)).state;
  assert(State.phaseKind(rel3) === 'season-summary', 'reload resumes season-summary');
  assert(State.getPhase(rel3).next.offers.length === State.getPhase(s).next.offers.length, 'reload preserves stored offers');

  App.dismissSummary(s);
  const rel4 = App.loadSave(App.serialize(s)).state;
  assert(State.phaseKind(rel4) === 'club', 'reload resumes club phase');

  // overlay survives reload
  s.session.pendingEffects.push({ type: 'nt-callup', countryCode: 'ES' });
  s.session.overlay = 'national-team';
  const rel5 = App.loadSave(App.serialize(s)).state;
  assert(App.selectOverlay(rel5) === 'national-team', 'reload resumes national-team overlay');
  assert(State.peekEffect(rel5, 'nt-callup').countryCode === 'ES', 'reload preserves pending effect');
  console.log('  reload behavior OK');
}

console.log(failures === 0 ? '\nSTATE TESTS PASSED' : `\n${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
