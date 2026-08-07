/* Stage 5 invariant tests (Vitest): every phase renders from a valid payload,
   no empty offer/option sets, bounded values, reload-at-phase recovery. */
import { describe, it, expect, beforeAll } from 'vitest';
import { createRequire } from 'module';
import type { CareerState } from '../src/domain/types.js';

const require = createRequire(import.meta.url);

let App: any, State: any, Engine: any, DATA: any;

beforeAll(() => {
  DATA = require('../js/data.js');
  (globalThis as Record<string, unknown>).GAME_DATA = DATA;
  require('../js/data-decisions-canonical.js');
  Engine = require('../js/engine.js');
  State = require('../js/state.js');
  App = require('../js/app.js');
});

function fresh(): CareerState {
  return App.startCareer({ name: 'Invariant', number: 10, position: 'ST', countryId: 'AR' });
}

describe('phase payload invariants', () => {
  it('every actionable decision has at least two options', () => {
    DATA.DECISIONS.forEach((d: any) => {
      const n = Engine.normalizeDecision(d);
      const opts = ['a', 'b', 'c'].filter((k: string) => n[k]);
      expect(opts.length, `${d.id} has 2+ options`).toBeGreaterThanOrEqual(2);
      opts.forEach((k: string) => {
        expect(n[k].label, `${d.id}.${k} label`).toBeTruthy();
        expect(n[k].mini || n[k].fx, `${d.id}.${k} usable outcome`).toBeTruthy();
      });
    });
  });

  it('every club phase has one to three offers', () => {
    const s = fresh();
    State.setPhase(s, State.club(Engine.clubOffers(s)));
    const offers = State.getPhase(s).offers;
    expect(offers.length).toBeGreaterThanOrEqual(1);
    expect(offers.length).toBeLessThanOrEqual(3);
    offers.forEach((o: any) => expect(o.club && o.club.cid).toBeTruthy());
  });

  it('bounded values across a season', () => {
    const s = fresh();
    App.chooseAcademy(s, State.getPhase(s).options[0].cid);
    const d = State.getPhase(s).card;
    if (d) App.chooseDecision(s, d.a ? 'a' : 'b');
    App.enterBooster(s);
    App.chooseBooster(s, State.getPhase(s).options[0].id);
    App.completeSeason(s);
    const p = s.player;
    expect(p.ovr).toBeGreaterThanOrEqual(35);
    expect(p.ovr).toBeLessThanOrEqual(99);
    expect(p.stamina).toBeGreaterThanOrEqual(5);
    expect(p.stamina).toBeLessThanOrEqual(100);
    expect(p.morale).toBeGreaterThanOrEqual(5);
    expect(p.morale).toBeLessThanOrEqual(100);
    expect(s.earnings).toBeGreaterThanOrEqual(s.spent);
  });
});

describe('reload at every phase', () => {
  const reload = (s: CareerState) => App.loadSave(App.serialize(s)).state;

  it('academy -> decision -> booster -> simulating -> summary -> club survive reload', () => {
    // academy phase
    const s1 = fresh();
    expect(State.phaseKind(reload(s1))).toBe('academy');
    expect(reload(s1).session.phase.options).toHaveLength(3);

    // decision phase
    const s2 = fresh();
    App.chooseAcademy(s2, State.getPhase(s2).options[0].cid);
    const r2 = reload(s2);
    expect(State.phaseKind(r2)).toBe('decision');
    expect(r2.session.phase.card).toBeTruthy();

    // booster phase with rolled payload
    const s3 = fresh();
    App.chooseAcademy(s3, State.getPhase(s3).options[0].cid);
    App.enterBooster(s3);
    const r3 = reload(s3);
    expect(State.phaseKind(r3)).toBe('booster');
    expect(r3.session.phase.options).toHaveLength(3);

    // simulating phase
    const s4 = fresh();
    App.chooseAcademy(s4, State.getPhase(s4).options[0].cid);
    App.enterBooster(s4);
    App.chooseBooster(s4, State.getPhase(s4).options[0].id);
    expect(State.phaseKind(reload(s4))).toBe('simulating');

    // season-summary: offers preserved exactly
    const s5 = fresh();
    App.chooseAcademy(s5, State.getPhase(s5).options[0].cid);
    App.enterBooster(s5);
    App.chooseBooster(s5, State.getPhase(s5).options[0].id);
    App.completeSeason(s5);
    const stored = State.getPhase(s5).next.offers.map((o: any) => o.club.cid).join(',');
    const r5 = reload(s5);
    expect(State.phaseKind(r5)).toBe('season-summary');
    expect(State.getPhase(r5).next.offers.map((o: any) => o.club.cid).join(',')).toBe(stored);

    // club phase
    const s6 = fresh();
    App.chooseAcademy(s6, State.getPhase(s6).options[0].cid);
    App.enterBooster(s6);
    App.chooseBooster(s6, State.getPhase(s6).options[0].id);
    App.completeSeason(s6);
    App.dismissSummary(s6);
    const r6 = reload(s6);
    expect(State.phaseKind(r6)).toBe('club');
    expect(r6.session.phase.offers.length).toBeGreaterThanOrEqual(1);
  });

  it('overlay reload resumes naturalization and national-team prompts', () => {
    const s = fresh();
    State.pushEffect(s, { type: 'naturalization', countryId: 'ZA' });
    State.pushEffect(s, { type: 'nt-callup', countryCode: 'ES' });
    const r = reload(s);
    expect(App.selectOverlay(r)).toBe('naturalization');
    expect(State.peekEffect(r, 'nt-callup')?.countryCode).toBe('ES');
  });
});

describe('decision schema normalization', () => {
  it('legacy a/b and canonical options[] both execute through the engine', () => {
    const legacy = DATA.DECISIONS.find((x: any) => x.id === 'st-poacher');
    const canonical = DATA.DECISIONS.find((x: any) => x.id === 'conflict-teammate-feud');
    expect(Engine.normalizeDecision(legacy).a).toBeTruthy();
    expect(Engine.normalizeDecision(canonical).a).toBeTruthy();
    const s = fresh();
    s.player.age = 20;
    const r1 = Engine.applyDecision(s, legacy, 'a');
    expect(r1.out.length).toBeGreaterThan(3);
    const r2 = Engine.applyDecision(s, canonical, 'a');
    expect(r2.out.length).toBeGreaterThan(3);
  });
});
