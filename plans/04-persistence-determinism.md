# Stage 4: Persistence and Deterministic Simulation

## Goal

Make saves safe to load, easy to migrate, and reproducible when a player reports a bug. The current global random source and permissive JSON save format make intermittent behavior hard to reproduce.

## Target Save Envelope

```ts
type SaveEnvelope = {
  schemaVersion: number;
  savedAt: string;
  gameVersion: string;
  state: CareerState;
  rng: { seed: number; cursor: number };
};
```

The existing `cm26-save-v1` key remains readable. A new envelope version may use a new key only after the migration path is tested.

## Tasks

1. Define a runtime schema for imported saves and localStorage data.
2. Reject malformed saves with a user-readable error and preserve the current save until replacement succeeds.
3. Keep migrations pure: `migrateV2ToV3`, `migrateV3ToV4`, and so on should return new objects instead of mutating raw input.
4. Replace the global `Math.random` dependency with a seeded RNG owned by the career state or command context.
5. Persist the seed and cursor after every state-changing command.
6. Make offer generation, decision rolls, injuries, trophies, contracts, and agent rolls consume the injected RNG only.
7. Add a debug export containing save envelope, seed, cursor, recent actions, and phase. Do not expose secrets because this game has no server secrets.
8. Add round-trip tests: save, load, continue, and compare phase, offers, player state, and next random result.
9. Add replay tests for the reported transfer-options bug and decision rendering bugs.
10. Add a recovery policy for `simulating` and `season-summary` saves so a reload never reruns a completed season.

## Files

- Current migration surface: `js/state.js`, `js/main.js`, `js/engine.js`.
- Future typed surface: `src/domain/persistence.ts`, `src/domain/rng.ts`, `src/domain/model.ts`.
- Tests and fixtures: `test/sim-test.js`, `test/fixtures/export-test.json`, and new save/replay fixtures.

## Runtime Validation

Validate these areas explicitly:

- Save version and envelope fields.
- Player identity, stats, age, OVR, and position.
- Club IDs and loan parent IDs.
- Phase kind and phase payload.
- History entries and season result shape.
- Offers and decision cards.
- Financial values and non-negative counters.

## Acceptance Criteria

- The same seed and action sequence produce the same career result.
- A bug report can include a save and replay the failing transition.
- Corrupt or unknown JSON does not crash the app.
- Old version 2 saves and old exported fixtures remain loadable.
- Saving during a summary or overlay resumes without duplicate simulation or offer rerolls.
- Randomness is not called from rendering or persistence code.

## Subagent Brief

> Harden persistence and randomness. Add runtime save validation, pure versioned migrations, seeded RNG with a persisted cursor, deterministic replay support, and round-trip tests. Preserve old save imports and current gameplay probabilities. Focus on persistence and RNG boundaries only; do not migrate the UI to React.
