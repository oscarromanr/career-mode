/* Domain module tests: each module runs independently in Node,
   covering decisions, season simulation, contract expiry, offers,
   agents, shop, national teams, boosters, summary. */
'use strict';
const DATA = require('../js/data.js');
global.GAME_DATA = DATA;
require('../js/data-decisions-canonical.js');
const Engine = require('../js/engine.js');
const State = require('../js/state.js');
const App = require('../js/app.js');

// Focused direct module imports (prove no DOM/global dependency).
const Rng = require('../js/domain/rng.js');
const Model = require('../js/domain/model.js');
const Player = require('../js/domain/player.js');
const Decisions = require('../js/domain/decisions.js');
const Agents = require('../js/domain/agents.js');
const Career = require('../js/domain/career.js');
const Contracts = require('../js/domain/contracts.js');
const Offers = require('../js/domain/offers.js');
const BoostersShop = require('../js/domain/boosters-shop.js');
const Season = require('../js/domain/season.js');
const NationalTeam = require('../js/domain/national-team.js');
const Summary = require('../js/domain/summary.js');

let failures = 0;
function assert(cond, msg) {
  if (!cond) { failures++; console.error('  FAIL:', msg); }
}
const ri = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
function newState(position, countryId) {
  return Career.newCareer({ name: 'Domain Test', number: 10, position: position || 'ST', countryId: countryId || 'AR' });
}

console.log('Domain module tests:');

// ---- RNG ----
{
  Rng.setRng(() => 0.5);
  assert(Rng.ri(1, 1) === 1, 'ri deterministic with fixed rng');
  assert(Rng.clamp(5, 0, 3) === 3 && Rng.clamp(-1, 0, 3) === 0, 'clamp bounds');
  assert(Rng.pick(['x']) === 'x', 'pick single');
  assert(Rng.shuffle(['a', 'b']).length === 2, 'shuffle returns copy');
  assert(Rng.chance(1) === true && Rng.chance(0) === false, 'chance edges');
  Rng.setRng(Math.random);
  console.log('  rng OK');
}

// ---- Model / Player ----
{
  assert(Model.ALL_CLUBS.length === Engine.ALL_CLUBS.length, 'model club registry matches engine');
  assert(Player.getOvr({ PAC: 80, DRI: 80, SHO: 80, MEN: 80, PAS: 80, PHY: 80 }, 'ST') === 80, 'flat stats give flat ovr');
  assert(Player.getTier(90) === 'diamond' && Player.getTier(40) === 'bronze', 'tier ladder');
  const s = newState('GK', 'DE');
  assert(s.player.isGK && s.player.age === 14, 'career creates GK at 14');
  assert(Career.academyOptions(s).length === 3, 'academy options 3');
  const mv = Player.marketValue({ ovr: 80, age: 22, potential: 90, hype: 0 });
  assert(mv >= 25000 && mv < 100000000, `market value sane (${mv})`);
  console.log('  model + player OK');
}

// ---- Decisions ----
{
  const s = newState('ST', 'BR');
  s.player.age = 20;
  const card = DATA.DECISIONS.find((x) => x.id === 'st-poacher');
  const normalized = Decisions.normalizeDecision(card);
  assert(normalized.a && normalized.b, 'normalized decision has a/b');
  assert(Decisions.decisionEligible(s, card), 'st-poacher eligible for ST at 20');
  const res = Decisions.applyDecision(s, card, 'a');
  assert(typeof res.out === 'string' && res.out.length > 3, 'decision applies with outcome');
  assert(s.usedDecisions.includes(card.id), 'decision marked used');
  const miniCard = DATA.DECISIONS.find((x) => x.id === 'shootout-hero');
  const mini = Decisions.applyMiniResult(s, miniCard, 'a', 'good');
  assert(mini.out.length > 3, 'minigame result applies');
  console.log('  decisions OK');
}

// ---- Agents ----
{
  const s = newState('CM', 'EN');
  Contracts.setAcademy(s, Career.academyOptions(s)[0].cid);
  s.player.age = 22;
  // Juice to a decent OVR so salary exceeds agent fees. Phase must be
  // simulating for recompute to refresh the market value.
  const keys = Model.statKeys(false);
  keys.forEach((k) => { s.player.stats[k] = 85; });
  State.setPhase(s, State.simulating());
  Player.recompute(s);
  assert(s.player.salary > 100000, `salary computed with club (${s.player.salary})`);
  const market = Agents.rollAgentMarket(s);
  assert(market.length === 4 && market[0].id === 'dad', 'agent market 4 with dad');
  // Boost earnings so an agent salary is affordable.
  s.earnings = 5000000;
  const hire = Agents.hireAgent(s, market[1].id);
  assert(hire.ok, 'hire agent works');
  const hireAgain = Agents.hireAgent(s, market[1].id);
  assert(!hireAgain.ok, 'cannot rehire active agent');
  const req = Agents.requestTransfer(s);
  assert(req.ok && s.clubSituation === 'listed', 'transfer request lists player');
  const raise = Agents.demandSalaryRaise(s);
  assert(raise.ok, 'raise demand accepted action');
  const comm = Agents.negotiateCommission(s, 5);
  assert(comm.accepted && comm.pct === 5, 'commission floor accepted');
  console.log('  agents OK');
}

// ---- Contracts ----
{
  const s = newState('LB', 'AR');
  const academies = Career.academyOptions(s);
  Contracts.setAcademy(s, academies[0].cid);
  assert(s.club && s.contract.yearsLeft >= 1, 'academy sets club + contract');
  const age = s.player.age;
  const len = Contracts.calcContractLength(age);
  assert(len >= 1 && len <= 5, `contract length in range (${len})`);
  // transfer offer signs a fresh contract
  const other = Model.ALL_CLUBS.find((c) => c.cid !== s.club.cid);
  const transfer = { type: 'transfer', club: other, fee: 1000000, contractYears: 2 };
  Contracts.applyClubOffer(s, transfer);
  assert(s.contract.yearsLeft === 2 && s.club.cid === other.cid, 'transfer signs 2-year contract');
  s.contract.yearsLeft = 1;
  const res = Season.simulateSeason(s);
  assert(s.contract.yearsLeft === 0 && s.isFreeAgent, 'contract expiry enters free agency');
  console.log('  contracts OK');
}

// ---- Offers ----
{
  const s = newState('RW', 'SN');
  Contracts.setAcademy(s, Career.academyOptions(s)[0].cid);
  s.player.age = 20;
  Player.recompute(s);
  const offers = Offers.clubOffers(s);
  assert(offers.length >= 1 && offers.length <= 3, `1-3 offers (${offers.length})`);
  assert(offers.every((o) => o.club && o.club.cid), 'every offer has a club');
  assert(offers.every((o) => o.roleKey && o.noteKey), 'every offer has role + note keys');
  console.log('  offers OK');
}

// ---- Boosters + Shop ----
{
  const s = newState('CAM', 'ES');
  Contracts.setAcademy(s, Career.academyOptions(s)[0].cid);
  s.player.age = 20;
  Player.recompute(s);
  s.earnings = 5000000;
  const boosters = BoostersShop.rollBoosters(s);
  assert(boosters.length === 3, '3 boosters');
  assert(boosters.every((b) => b.rarity), 'boosters have rarity');
  const applied = BoostersShop.applyBooster(s, boosters[0]);
  assert(Array.isArray(applied.changes), 'booster applies');
  const items = BoostersShop.shopItems(s);
  assert(items.length === 6, '6 shop items');
  const buy = BoostersShop.buyConsumable(s, items[0].id);
  assert(buy.ok, 'consumable purchase works');
  const buyAgain = BoostersShop.buyConsumable(s, items[0].id);
  assert(!buyAgain.ok, 'cannot rebuy same item');
  console.log('  boosters + shop OK');
}

// ---- Season ----
{
  const s = newState('ST', 'IT');
  Contracts.setAcademy(s, Career.academyOptions(s)[0].cid);
  const res = Season.simulateSeason(s);
  assert(res.year === 2026 && res.apps >= 0, 'season result shape');
  assert(res.apps <= 46, `apps capped (${res.apps})`);
  assert(res.rating >= 5.9 && res.rating <= 9.9, `rating in range (${res.rating})`);
  assert(s.history.length === 1 && s.history[0].year === 2026, 'history records season');
  assert(s.player.age === 15, 'player ages up');
  assert(Array.isArray(res.nextOffers) && res.nextOffers.length >= 1, 'next offers pre-generated');
  assert(Season.simLeague(s, Model.clubByCid(s.club.cid), true).length > 0, 'simLeague works');
  const awards = Season.computeSeasonAwards(s, res);
  assert(Array.isArray(awards), 'awards computed');
  console.log('  season OK');
}

// ---- National Team ----
{
  const s = newState('ST', 'ES');
  State.setPhase(s, State.simulating());
  s.player.age = 22;
  s.player.ovr = 85;
  s.totals.caps = 4;
  s.ntCalledUp = true;
  s.ntCountryId = 'ES';
  State.pushEffect(s, { type: 'nt-callup', countryCode: 'ZA' });
  assert(NationalTeam.pendingNtCode(s) === 'ZA', 'pending nt effect readable');
  NationalTeam.acceptNtCallUp(s, 'ZA');
  assert(s.ntCountryId === 'ZA' && s.player.countryId === 'ZA', 'accept switches nationality');
  assert(NationalTeam.pendingNtCode(s) === null, 'accept consumes effect');
  NationalTeam.declineNtCallUpTemp(s, 'BR');
  assert(s.ntDeclinedCooldowns.BR === 2, 'decline sets cooldown');
  const legend = NationalTeam.getLegendForPlayer(s, 'national-legend-call');
  assert(legend && legend.name, 'legend resolves');
  console.log('  national-team OK');
}

// ---- Summary ----
{
  const s = newState('GK', 'DE');
  Contracts.setAcademy(s, Career.academyOptions(s)[0].cid);
  for (let i = 0; i < 3; i++) Season.simulateSeason(s);
  assert(Summary.retireType(s).length > 0, 'retire type computed');
  Summary.retire(s);
  assert(s.retired, 'retire flag set');
  const sum = Summary.careerSummary(s);
  assert(sum.seasons === 3 && sum.totals.apps >= 0, 'summary aggregates history');
  assert(sum.counts.League >= 0, 'summary trophy counts');
  assert(typeof sum.legacy === 'number', 'legacy score computed');
  console.log('  summary OK');
}

// ---- Facade parity: every legacy Engine export resolves ----
{
  const exports = [
    'setRng', 'newCareer', 'migrate', 'academyOptions', 'setAcademy',
    'pickDecision', 'applyDecision', 'applyMiniResult', 'rollBoosters', 'applyBooster', 'boosterFx',
    'shopItems', 'buyConsumable', 'consumableCost', 'maxShopPurchases', 'rerollShop',
    'clubOffers', 'applyClubOffer', 'simLeague', 'simulateSeason', 'continueSeasonSummary', 'retire', 'retireType', 'careerSummary',
    'computeSeasonAwards',
    'getOvr', 'getTier', 'marketValue', 'annualSalary', 'fmtValue', 'recompute',
    'clubByCid', 'countryById', 'countryName', 'ALL_CLUBS', 'allClubs', 'statKeys',
    'normalizeDecision',
    'hireAgent', 'rollAgentMarket', 'requestTransfer', 'withdrawTransferRequest', 'demandSalaryRaise', 'negotiateCommission', 'DAD_AGENT', 'addReputation',
    'getLegendForPlayer', 'calcContractLength', 'acceptNtCallUp', 'declineNtCallUp', 'declineNtCallUpTemp', 'rejectNtCallUpPerm', 'naturalizeAndSwitchNt',
  ];
  exports.forEach((name) => assert(typeof Engine[name] !== 'undefined', `facade exports ${name}`));
  assert(typeof App.startCareer === 'function', 'app layer intact');
  console.log('  facade parity OK');
}

console.log(failures === 0 ? '\nDOMAIN TESTS PASSED' : `\n${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
