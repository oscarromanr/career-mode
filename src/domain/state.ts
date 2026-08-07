/* ============================================================
   CAREER MODE '26 - domain: state (typed facade)
   ============================================================
   Typed contracts for the state model. The runtime implementation
   remains in js/state.js (script-order compatible, works in the
   legacy UI). This module exposes the same API with strict types
   so application and domain code can consume it safely.

   Migration path: as js/state.js logic moves here, the facade
   becomes the implementation. See plans/03-typescript-tooling.md.
   ============================================================ */
import type {
  CareerState,
  Overlay,
  PendingEffect,
  Phase,
  SaveEnvelope,
} from './types.js';

export type { CareerState, Overlay, PendingEffect, Phase, SaveEnvelope };
export * from './types.js';

interface StateAPI {
  VERSION: number;
  KINDS: string[];
  OVERLAYS: string[];
  EFFECT_TYPES: string[];
  academy(options?: unknown[] | null): Phase;
  decision(card?: unknown | null): Phase;
  booster(options?: unknown[] | null): Phase;
  club(offers?: unknown[] | null): Phase;
  simulating(): Phase;
  seasonSummary(result: unknown, next?: Phase): Phase;
  retired(): Phase;
  session(phase?: Phase | null, overlay?: Overlay, pendingEffects?: PendingEffect[]): {
    phase: Phase;
    overlay: Overlay;
    pendingEffects: PendingEffect[];
  };
  migrate(state: Record<string, unknown>): CareerState;
  getPhase(state: CareerState): Phase;
  setPhase(state: CareerState, next: Phase): Phase;
  phaseKind(state: CareerState): Phase['kind'];
  selectPhase(state: CareerState): Phase;
  selectOverlay(state: CareerState): Overlay;
  validate(state: unknown): { ok: boolean; errors: string[] };
  validatePhase(phase: unknown): string[];
  pushEffect(state: CareerState, effect: PendingEffect): PendingEffect | null;
  peekEffect(state: CareerState, type?: PendingEffect['type']): PendingEffect | null;
  takeEffect(state: CareerState, type?: PendingEffect['type']): PendingEffect | null;
}

function runtime(): StateAPI {
  const g = globalThis as { GameState?: StateAPI };
  if (!g.GameState) throw new Error('GameState runtime not loaded');
  return g.GameState;
}

/** Returns the runtime state API (throws if js/state.js not loaded). */
export function state(): StateAPI {
  return runtime();
}

/** Runtime version, resolved lazily (js/state.js may load after this module). */
export function version(): number {
  return runtime().VERSION;
}

export function migrate(raw: Record<string, unknown>): CareerState {
  return runtime().migrate(raw);
}

export function getPhase(state: CareerState): Phase {
  return runtime().getPhase(state);
}

export function setPhase(state: CareerState, next: Phase): Phase {
  return runtime().setPhase(state, next);
}

export function phaseKind(state: CareerState): Phase['kind'] {
  return runtime().phaseKind(state);
}

export function selectPhase(state: CareerState): Phase {
  return runtime().selectPhase(state);
}

export function selectOverlay(state: CareerState): Overlay {
  return runtime().selectOverlay(state);
}

export function validate(state: unknown): { ok: boolean; errors: string[] } {
  return runtime().validate(state);
}

export function validatePhase(phase: unknown): string[] {
  return runtime().validatePhase(phase);
}

export function pushEffect(state: CareerState, effect: PendingEffect): PendingEffect | null {
  return runtime().pushEffect(state, effect);
}

export function peekEffect(state: CareerState, type?: PendingEffect['type']): PendingEffect | null {
  return runtime().peekEffect(state, type);
}

export function takeEffect(state: CareerState, type?: PendingEffect['type']): PendingEffect | null {
  return runtime().takeEffect(state, type);
}

export function toEnvelope(state: CareerState, gameVersion = 'cm26'): SaveEnvelope {
  return {
    schemaVersion: version(),
    savedAt: new Date().toISOString(),
    gameVersion,
    state,
  };
}
