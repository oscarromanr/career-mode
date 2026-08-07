/* Generate localStorage fixture loaders for visual QA of late-career screens.
   Each output file sets the save key when eval'd in the page. */
'use strict';
const fs = require('fs');
const path = require('path');
const DATA = require('../js/data.js');
global.GAME_DATA = DATA;
require('../js/data-decisions-canonical.js');
const Engine = require('../js/engine.js');
const State = require('../js/state.js');
const App = require('../js/app.js');

const ri = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

function autoPlay(state, untilAge) {
  while (!state.retired && state.player.age < untilAge) {
    const phase = State.getPhase(state);
    if (phase.kind === 'season-summary') {
      App.dismissSummary(state);
      continue;
    }
    if (phase.kind === 'academy') {
      if (!Array.isArray(State.getPhase(state).options) || !State.getPhase(state).options.length) {
        State.setPhase(state, State.academy(Engine.academyOptions(state)));
      }
      const opts = State.getPhase(state).options;
      App.chooseAcademy(state, opts[ri(0, 2)].cid);
      continue;
    }
    if (State.phaseKind(state) === 'decision') {
      const d = State.getPhase(state).card;
      if (d) {
        const opts = ['a', 'b', 'c'].filter((k) => d[k]);
        const choice = opts[ri(0, opts.length - 1)];
        if (d[choice].mini) {
          App.chooseDecision(state, choice);
          App.resolveMiniResult(state, d, choice, ['good', 'bad'][ri(0, 1)]);
        } else {
          App.chooseDecision(state, choice);
        }
      } else {
        App.enterBooster(state);
      }
      continue;
    }
    if (State.phaseKind(state) === 'booster') {
      if (!Array.isArray(State.getPhase(state).options) || !State.getPhase(state).options.length) App.enterBooster(state);
      const bs = State.getPhase(state).options;
      App.chooseBooster(state, bs[ri(0, 2)].id);
      continue;
    }
    if (State.phaseKind(state) === 'club') {
      const offers = State.getPhase(state).offers;
      const stay = offers.find((o) => o.type === 'stay');
      const move = offers[ri(0, offers.length - 1)];
      App.chooseClub(state, offers.indexOf(Math.random() < 0.45 ? move : (stay || move)));
    }
    if (State.phaseKind(state) === 'simulating') App.completeSeason(state);
  }
  return state;
}

function juice(state, targetOvr) {
  const p = state.player;
  const keys = Engine.statKeys(p.isGK);
  let guard = 500;
  while (Engine.getOvr(p.stats, p.position) < targetOvr && guard-- > 0) {
    const k = keys[ri(0, keys.length - 1)];
    p.stats[k] = Math.min(99, p.stats[k] + 1);
  }
  Engine.recompute(state);
  p.peakOvr = Math.max(p.peakOvr, p.ovr);
  p.peakValue = Math.max(p.peakValue, p.value);
}

function writeFixture(name, state) {
  const payload = `localStorage.setItem('cm26-save-v1', ${JSON.stringify(JSON.stringify(state))});`;
  fs.writeFileSync(path.join(__dirname, 'fixtures', name), payload);
  console.log('wrote', name);
}

fs.mkdirSync(path.join(__dirname, 'fixtures'), { recursive: true });

// 1. Star: 26 y/o ST at high OVR, at club stage (elite offers expected)
{
  const s = Engine.newCareer({ name: 'Lío Fernández', number: 10, position: 'ST', countryId: 'AR' });
  autoPlay(s, 26);
  juice(s, 88);
  State.setPhase(s, State.club(Engine.clubOffers(s)));
  writeFixture('star.js', s);
}

// 2. Veteran: 36 y/o declining, club stage (sunset/homecoming offers)
{
  const s = Engine.newCareer({ name: 'Old Warrior', number: 7, position: 'CM', countryId: 'UY' });
  autoPlay(s, 34);
  juice(s, 86); // he WAS great
  autoPlay(s, 36); // decline kicked in
  State.setPhase(s, State.club(Engine.clubOffers(s)));
  writeFixture('veteran.js', s);
}

// 3. Retired GK career -> summary
{
  const s = Engine.newCareer({ name: 'Wall Becker', number: 1, position: 'GK', countryId: 'DE' });
  autoPlay(s, 40);
  juice(s, 82);
  autoPlay(s, 99);
  writeFixture('retired.js', s);
}

// 4. GK mid-career at decision stage
{
  const s = Engine.newCareer({ name: 'Cat Romano', number: 1, position: 'GK', countryId: 'IT' });
  autoPlay(s, 24);
  juice(s, 78);
  State.setPhase(s, State.decision(Engine.pickDecision(s)));
  writeFixture('gk.js', s);
}

// 5. Star winger on a bad team — forced-out check + elite offers
{
  const s = Engine.newCareer({ name: 'Speedy Diallo', number: 11, position: 'RW', countryId: 'SN' });
  autoPlay(s, 22);
  juice(s, 84);
  State.setPhase(s, State.club(Engine.clubOffers(s)));
  writeFixture('winger.js', s);
}

console.log('done');
