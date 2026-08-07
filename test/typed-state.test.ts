/* Vitest suite: typed state facade + envelope contract.
   Loads the legacy runtime (js/state.js via CommonJS require)
   through the typed src/domain/state.ts facade. */
import { describe, it, expect, beforeAll } from 'vitest';
import { createRequire } from 'module';
import type { CareerState, SaveEnvelope } from '../src/domain/types.js';
import {
  state,
  migrate,
  getPhase,
  setPhase,
  phaseKind,
  selectOverlay,
  validate,
  validatePhase,
  toEnvelope,
  version,
} from '../src/domain/state.js';

const require = createRequire(import.meta.url);

let runtime: ReturnType<typeof state>;
let fresh: CareerState;

beforeAll(() => {
  const DATA = require('../js/data.js');
  (globalThis as Record<string, unknown>).GAME_DATA = DATA;
  require('../js/data-decisions-canonical.js');
  require('../js/state.js');
  const App = require('../js/app.js');
  runtime = state();
  fresh = App.startCareer({ name: 'Typed Test', number: 10, position: 'ST', countryId: 'AR' }) as CareerState;
});

describe('typed state facade', () => {
  it('exposes the runtime API with types', () => {
    expect(version()).toBe(4);
    expect(runtime.VERSION).toBe(4);
    expect(state().KINDS).toContain('season-summary');
  });

  it('validates phase payloads', () => {
    expect(validatePhase({ kind: 'club', offers: 'nope' })).not.toHaveLength(0);
    expect(validatePhase({ kind: 'simulating' })).toHaveLength(0);
    expect(validatePhase({ kind: 'retired' })).toHaveLength(0);
  });

  it('validates full saves', () => {
    expect(validate(fresh).ok).toBe(true);
    const bad = JSON.parse(JSON.stringify(fresh)) as Record<string, unknown>;
    (bad.player as Record<string, unknown>).stats = undefined;
    expect(validate(bad).ok).toBe(false);
  });

  it('migrates legacy saves to v4 with session', () => {
    const legacy = JSON.parse(JSON.stringify(fresh)) as Record<string, unknown>;
    delete legacy.session;
    legacy.phase = legacy.phase ?? getPhase(fresh as CareerState);
    legacy.version = 3;
    const out = migrate(legacy);
    expect(out.version).toBe(4);
    expect(getPhase(out).kind).toBe('academy');
    expect(validate(out).ok).toBe(true);
  });

  it('builds a typed save envelope', () => {
    const env = toEnvelope(fresh);
    expect(env.schemaVersion).toBe(4);
    expect(env.savedAt).toBeTruthy();
    expect(env.gameVersion).toBe('cm26');
    expect(env.state.player.name).toBe('Typed Test');
    const parsed = JSON.parse(JSON.stringify(env)) as SaveEnvelope;
    expect(parsed.schemaVersion).toBe(4);
  });

  it('tracks phase + overlay through the typed selectors', () => {
    expect(phaseKind(fresh)).toBe('academy');
    setPhase(fresh, { kind: 'decision', card: null });
    expect(phaseKind(fresh)).toBe('decision');
    expect(selectOverlay(fresh)).toBe('none');
    setPhase(fresh, { kind: 'simulating' });
    expect(phaseKind(fresh)).toBe('simulating');
    setPhase(fresh, { kind: 'retired' });
    expect(phaseKind(fresh)).toBe('retired');
  });
});
