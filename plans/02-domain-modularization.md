# Stage 2: Domain Modularization

## Goal

Break the monolithic `js/engine.js` into cohesive domain modules without changing gameplay. Keep a small compatibility facade during the migration so the UI and tests can move incrementally.

## Target Modules

```text
domain/
  model.js              player, club, career and phase types/helpers
  rng.js                random source and seeded operations
  player.js             OVR, tier, value, salary, recompute
  decisions.js          eligibility, normalization, application
  season.js             season simulation, growth, standings, awards
  offers.js             club offers, transfer caps, free agency
  contracts.js          contract lengths, loans, expiry
  agents.js             agents, requests, commissions
  shop.js               consumables and spending
  national-team.js      call-ups, nationalities, cooldowns
  summary.js             retirement and career summary
  effects.js            result/effect types returned to the app layer
  index.js               public domain facade
```

The exact extension can remain `.js` until Stage 3. Do not split files merely by line count. Each module must own one rule family and expose functions with explicit inputs and outputs.

## Tasks

1. Inventory every exported engine function and assign it to one target module.
2. Move shared constants and lookup helpers into `model.js` or `data-access.js`.
3. Move RNG calls behind an injected RNG interface. Do not leave hidden `Math.random` calls in extracted modules.
4. Move decision normalization and eligibility into `decisions.js`.
5. Move season simulation and end-of-season state changes into `season.js`.
6. Move club offer generation and transfer affordability into `offers.js`.
7. Move contract and loan transitions into `contracts.js`.
8. Move agent and shop logic into their own modules.
9. Move national-team and naturalization logic into `national-team.js`.
10. Keep `js/engine.js` as a facade that re-exports the existing public API until all callers use module imports.
11. Remove duplicate function definitions, especially duplicate `setAcademy` implementations.
12. Remove DOM and translation dependencies from domain modules. Domain results should contain message keys and parameters, not translated strings.

## Boundary Rules

- Domain modules cannot query `document`, `localStorage`, `window`, or DOM elements.
- Domain modules cannot call `I18n.T`.
- Domain modules cannot render HTML.
- Offer generation must not happen in UI render functions.
- A domain command must not silently change an unrelated phase.
- Randomness must be passed in or owned by a domain context.

## Files

- Source: `js/engine.js`, `js/engine/*.js`, new `js/domain/*.js`.
- Data: `js/data.js`, `js/data-decisions.js` remain data sources, not domain logic.
- Tests: `test/sim-test.js` and focused domain test files.

## Acceptance Criteria

- Each domain module can be required in Node without a DOM.
- The public engine facade preserves existing callers until they are migrated.
- `node test/sim-test.js` produces the same invariant results before and after extraction.
- A module map documents ownership of every current engine export.
- No module exceeds a reasonable size without a documented reason.
- Domain tests cover decisions, season simulation, contract expiry, offers, agents, shop, and national teams independently.

## Non-Goals

- Do not change the visual design.
- Do not port to React in this stage.
- Do not change save format except where Stage 1 or Stage 4 requires it.

## Subagent Brief

> Modularize the simulation engine by domain boundary. Preserve behavior and the public Engine facade. Extract one coherent rule family at a time, remove DOM/I18n dependencies from domain code, inject randomness, and keep the full career suite passing after each extraction. Do not alter UI behavior or gameplay balance. Return a module ownership map and test evidence.
