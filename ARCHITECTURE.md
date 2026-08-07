# Architecture Overview

Career Mode '26 is a static, client-only browser game. This document describes
the layered architecture, the module boundaries, and the rules every layer
must follow.

## Layers

```text
UI layer          js/ui.js (DOM rendering), js/main.js (bootstrap/handlers)
                  Reads globals: GameState, GameApp, Engine, I18n, GameAPI.
                  Must never mutate domain state directly for transitions.

Application       js/app.js — the ONLY owner of phase transitions.
layer             loadSave / serialize / debugExport, RNG binding, actions log.

Domain core       js/domain/*.js — pure rules, no DOM, no I18n calls for
                  decisions (returns keys/params), randomness via
                  js/domain/rng.js only.

Persistence       js/state.js — v4 save model: phase discriminated union,
and data          session { phase, overlay, pendingEffects }, migrations,
                  runtime validation. Content in js/data*.js and js/i18n*.

Typed contracts   src/domain/types.ts (types), src/domain/state.ts (typed
                  facade over the runtime state API).
```

## Phase Model

`CareerState` holds persistent career data plus a `session` with:

- `phase`: `academy | decision | booster | club | simulating | season-summary | retired`
- `overlay`: `none | naturalization | national-team`
- `pendingEffects`: ordered queue of season-end effects (naturalization first,
  then national-team call-up), consumed by `resumePhase` in js/main.js.

Every phase carries the payload it needs; payloads are generated once and
serialized. Missing payloads are repaired explicitly (`repairPhase`), never by
silent regeneration during render.

## Transitions

Only `js/app.js` may call `GameState.setPhase`. Engine functions return
results/effects; the app layer decides the next phase. Domain modules never
set phases. This keeps the phase machine inspectable and testable
(`test/state-test.js`, `test/invariants.test.ts`).

## Determinism

- `js/domain/rng.js` implements a seeded PRNG (mulberry32).
- Every career stores `rngSeed` + `rngCursor`; `App` binds the RNG to the state
  before every transition, advancing the cursor on each draw.
- Rendering and persistence never call the RNG.
- Same seed + same actions = same career (`test/persistence-test.js`).

## Save Envelope

```ts
{ schemaVersion: 4, savedAt: string, gameVersion: 'cm26',
  state: CareerState, rng: { seed: number, cursor: number } }
```

Exports use the envelope; imports accept the envelope or the bare v4 state.
Migrations are one-way and tested per version (`js/state.js::migrate`).

## Data Rules

- One canonical decision schema (`options[]`, see README).
- `npm run validate:data` gates CI: unique IDs, valid age ranges, 2+ options,
  known effect keys, known stats, valid positions, ES fallback sanity.
- Translations: nested `I18N_ES.decisions[id] = { title, desc, a: {...} }`.
  Missing Spanish falls back to English; internal keys never reach the UI.

## Testing Pyramid

| Layer | Where | Command |
|---|---|---|
| Domain unit | `test/domain-test.js` | `npm run test:legacy` |
| State transitions | `test/state-test.js` | `npm run test:legacy` |
| Invariants + reload | `test/invariants.test.ts` | `npx vitest run` |
| Persistence/replay | `test/persistence-test.js` | `npm run test:legacy` |
| Data/content | `test/data-validation.js` | `npm run validate:data` |
| Browser smoke | `test/browser/career-loop.spec.mts` | `npm run test:browser` |
| Visual | `test/browser/visual.spec.mts` | `npm run test:visual` |

## Migration History

The `plans/` directory documents the staged migration (baseline -> state
hardening -> domain modularization -> tooling -> persistence -> QA -> data ->
React decision -> release). The React decision is `docs/adr/001-react-deferred.md`.
