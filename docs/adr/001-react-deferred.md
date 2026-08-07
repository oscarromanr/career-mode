# ADR-001: React UI Migration Deferred

Status: Accepted (2026-08-07)

## Context

Plans/07-react-migration.md defines an optional gate: adopt React only if the
game "will receive frequent UI work, multiple new screens, richer overlays, or a
team of contributors." The game is not required to adopt React after Stage 6.

## Decision

React is **explicitly deferred**. The game ships as a typed DOM application with
a validated state model, modular domain core, deterministic persistence, and
browser QA coverage. The imperative DOM renderer (`js/ui.js`) stays.

Rationale:

- The current UI is stable and fully covered by Playwright smoke + visual tests.
- A React port would rewrite ~90KB of `js/ui.js` with no gameplay benefit.
- The architecture keeps React viable: phases are typed, transitions are
  centralized in `js/app.js`, and the UI consumes `GameState`/`GameApp` through
  globals that a React root could replace wholesale.
- The legacy UI must stay available until the React browser suite passes
  (rollback path), which is an ongoing cost the project does not need today.

## Consequences

- `js/ui.js` and `js/main.js` remain the UI layer; no React dependency.
- Stage 7 remains documented in `plans/07-react-migration.md` for a future
  decision. Reopening it requires: a real UI workload driver, browser+visual
  baselines already in place (they are), and one owner for the port.
- Stage 8 ships the architecture as-is.
