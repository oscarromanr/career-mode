# Stage 1: State Model Hardening

## Goal

Finish the state-model refactor so every UI and domain transition has one canonical representation. The current `js/state.js` phase model is the foundation, but transient overlays, validation, and transition ownership still need to be made explicit.

## Current Problems

- Persistent career data and transient UI state are still mixed in one object.
- Nationalization, national-team call-up, outcome, and season-summary modals use ad hoc flags and callbacks.
- `phase` payloads can still be `null` until `main.js` repairs them.
- `Engine` and `main.js` both participate in transitions.
- Save migration has a heuristic for old post-season `decision` saves and needs explicit tests for every legacy shape.

## Target Model

Use a stable career state plus a session state.

```text
CareerState
  player, club, contract, history, finances, progression, seed, saveVersion

SessionState
  phase: academy | decision | booster | club | simulating | season-summary | retired
  overlay: none | outcome | naturalization | national-team | agent | shop | minigame
  phasePayload
  pendingEffects
```

The phase must be a discriminated union. A phase must carry the payload it needs. A club phase always has an offer array. A decision phase either has a decision card or explicitly represents a quiet week. A season summary stores its result and its already-generated continuation.

## Tasks

1. Define the persistent and transient boundaries in `js/state.js` or its TypeScript successor.
2. Add constructors and validators for every phase payload.
3. Replace modal flags such as `triggerNaturalizationModal` and `triggerNtCallUpModal` with an explicit overlay/effect representation, while preserving migration from old flags.
4. Add transition functions for `startCareer`, `chooseAcademy`, `chooseDecision`, `chooseBooster`, `chooseClub`, `completeSeason`, `dismissSeasonSummary`, and `retire`.
5. Make one layer own transitions. Prefer an application reducer/store; domain functions return results and effects instead of changing UI phases directly.
6. Ensure all phase payloads are generated once and serialized. Rendering must never call a random generator.
7. Add runtime validation for imported JSON and localStorage data. Invalid saves should produce a recoverable error, not a blank screen.
8. Add a new save version only if the phase or overlay shape changes. Keep migrations one-way and test each version.
9. Remove all runtime references to `stage`, `currentOffers`, `currentDecision`, `currentBoosters`, `currentAcademies`, and `isViewingSummary` outside migration code.

## Recommended API

```text
loadSave(raw) -> Result<CareerState, SaveError>
dispatch(state, action, rng) -> { state, effects }
selectPhase(state) -> Phase
selectOverlay(state) -> Overlay
serialize(state) -> SaveEnvelope
```

## Files

- Primary: `js/state.js`, `js/main.js`, `js/engine.js`.
- Tests: `test/sim-test.js`, new `test/state-test.js` if the suite becomes too large.
- Fixtures: `test/fixtures/*.js`, `test/fixtures/export-test.json`.

## Acceptance Criteria

- No runtime code uses the old stage/current-field model.
- A phase with missing payload cannot reach the renderer without validation or repair.
- Reload during simulation, summary, nationalization, and national-team prompts resumes the correct flow.
- Dismissing a summary reveals the exact offers generated before the summary. It never rerolls them.
- Every transition has a unit test for success, invalid action, and reload behavior.
- Versioned old saves continue to load.

## Non-Goals

- Do not introduce React in this stage.
- Do not split all domain files yet.
- Do not rebalance decisions, transfers, salaries, or simulation outcomes.

## Subagent Brief

> Harden the existing phase model. Keep the current gameplay behavior unchanged. Separate persistent career data from transient overlays, add explicit phase payload validation, centralize transitions behind typed or clearly structured actions, migrate all old stage/current fields, and add reload tests for every phase. Do not introduce React or rewrite the simulation rules. Report the final state shape, migration versions, changed files, and tests.
