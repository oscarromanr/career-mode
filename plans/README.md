# Career Mode Architecture Plans

This directory is the execution plan for turning the current static JavaScript game into a maintainable, testable client application.

The plans are intentionally staged. Each stage has a narrow owner, explicit file boundaries, acceptance criteria, and a copy-ready subagent brief. Do not run multiple plans that edit the same files at the same time.

## Baseline

The current application is a static browser game loaded by script order in `index.html`.

- `js/engine.js` contains the simulation and most domain rules.
- `js/main.js` owns global state, phase transitions, persistence, timers, and callbacks.
- `js/ui.js` renders the DOM and owns modal behavior.
- `js/data.js` contains the original static data pack.
- `js/data-decisions.js` appends the newer decision pack.
- `js/i18n.js`, `js/i18n-es.js`, and `js/i18n-es-decisions.js` contain translation data and lookup logic.
- `test/sim-test.js` is the main Node-based behavior suite.
- `test/make-fixtures.js` generates visual QA save fixtures.
- Saves are stored in `localStorage` under `cm26-save-v1`.

The current worktree already contains the first state-model rework. It must be treated as the starting point for the plans, not discarded or rewritten from scratch.

Completed baseline changes:

- Added `js/state.js` with version 3 phases.
- Replaced runtime `stage` and `current*` reads with canonical `phase` reads.
- Added legacy save migration.
- Persisted season summaries with their next club offers.
- Normalized the alternate decision data schema.
- Added decision and phase invariants to `test/sim-test.js`.
- Fixed the `sim` versus `simulating` renderer mismatch.
- Added the free-agent offer fallback.

## Target

The target architecture is a client-only game with a pure domain core, an explicit state machine, validated persistence, deterministic simulation, and a replaceable UI layer.

```text
                  +-----------------------+
                  |       UI layer        |
                  | DOM now, React later  |
                  +-----------+-----------+
                              |
                       typed actions
                              |
                  +-----------v-----------+
                  |   application layer   |
                  | reducer, effects,     |
                  | selectors, overlays  |
                  +-----------+-----------+
                              |
                    pure commands/results
                              |
                  +-----------v-----------+
                  |      domain core      |
                  | season, offers,       |
                  | decisions, contracts  |
                  +-----------+-----------+
                              |
                  +-----------v-----------+
                  | persistence and data |
                  | migrations, schemas,  |
                  | seeded RNG, content   |
                  +-----------------------+
```

## Stage Order

| Stage | Plan | Status | Depends on |
|---|---|---|---|
| 0 | [Baseline and Guardrails](00-baseline.md) | Done | Current worktree |
| 1 | [State Model Hardening](01-state-model-hardening.md) | Done | Stage 0 |
| 2 | [Domain Modularization](02-domain-modularization.md) | Done | Stage 1 |
| 3 | [TypeScript and Tooling](03-typescript-tooling.md) | Done | Stage 1, can overlap late Stage 2 |
| 4 | [Persistence and Determinism](04-persistence-determinism.md) | Done | Stage 1, Stage 3 recommended |
| 5 | [Testing and Browser QA](05-testing-qa.md) | Done | Stage 1, grows through every stage |
| 6 | [Data and i18n Cleanup](06-data-i18n.md) | Done | Stage 2, Stage 3 recommended |
| 7 | [React and TypeScript UI Migration](07-react-migration.md) | Deferred (ADR-001) | Stages 1 through 6 |
| 8 | [Release, Deployment, and Documentation](08-release-docs.md) | Done | Stages 3 through 7 |

The React migration is optional. The game should be healthy and shippable
after Stage 6 with the existing DOM UI. The final decision record
(`docs/adr/001-react-deferred.md`) documents the explicit deferral per the
Stage 8 checklist.

## Recommended Parallelism

- Stage 0 is single-owner and must finish first.
- Stage 1 is single-owner because it edits `js/state.js`, `js/main.js`, `js/engine.js`, and save tests.
- Stage 2 can be split into domain module tasks only after the state API is stable, but all subagents must use one integration owner.
- Stage 3 can begin after the phase API and test commands are stable. Do not convert UI files while Stage 2 is moving functions.
- Stage 5 can add tests alongside Stages 2 through 6, but test fixture formats must be coordinated with the persistence owner.
- Stage 6 should not edit domain transition code except to fix content validation or translation boundaries.
- Stage 7 must be one owner. Do not run parallel React ports against the same DOM root.

## Global Rules

- Do not use `git reset --hard`, `git checkout --`, or broad restore commands.
- Do not erase the current uncommitted state-model work.
- Preserve the existing save key and import compatibility until a migration plan explicitly replaces them.
- Do not change gameplay probabilities or balance while changing architecture.
- Keep domain code independent of the DOM and browser globals.
- Keep translations out of domain decisions; return keys and parameters where possible.
- Run `node test/sim-test.js` after every logical behavior change.
- Run syntax checks for every changed JavaScript file.
- Add a regression test before fixing a reported state or rendering bug.
- Subagents must report changed files, tests run, remaining concerns, and any behavior changes.

## Definition Of Done

The architecture work is complete when:

- All stable game phases are represented by one typed/discriminated state object.
- Invalid phase/payload combinations fail validation instead of rendering blank screens.
- Old saves and exported saves migrate through tested versions.
- Simulation results and random offers are reproducible from a saved seed.
- Domain modules can run in Node without DOM or translation globals.
- The full career loop, import/export, reload, and modal flows have browser coverage.
- The app builds from one documented command and deploys to GitHub Pages.
- React is either adopted through the gated plan or explicitly rejected in a decision record.
