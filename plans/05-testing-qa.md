# Stage 5: Testing and Browser QA

## Goal

Move confidence from engine-only tests to full user-flow coverage. The current suite catches many simulation invariants but cannot catch a blank decision screen, stale modal, broken reload, or DOM lifecycle error.

## Test Layers

| Layer | Tool | Purpose |
|---|---|---|
| Domain unit | Vitest | Rules, effects, eligibility, migrations |
| Property/invariant | Vitest plus optional fast-check | No empty offer or option sets; bounded values |
| State transition | Vitest | Action-to-phase behavior and invalid actions |
| DOM component | happy-dom or browser runner | Rendered options, phase payloads, modal ownership |
| Browser smoke | Playwright | Real start, career, reload, import/export flows |
| Visual fixtures | Playwright screenshots | Desktop and mobile layout regression |

## Tasks

1. Split the existing Node suite into focused state, domain, data, and persistence tests when file size becomes a maintenance problem.
2. Add invariant tests for every phase and every normalized decision.
3. Add browser smoke coverage for the complete career loop.
4. Add reload tests at every stable phase and overlay.
5. Add malformed-save and old-save migration tests.
6. Add browser console and failed-network-request assertions.
7. Add responsive screenshots for the primary game surfaces.
8. Make fixture generation reproducible with a seed and document how to refresh fixtures.
9. Run all checks in CI and fail the build on test, type, browser, or content-validation errors.

## Files

- Existing tests: `test/sim-test.js`, `test/make-fixtures.js`, `test/fixtures/**`.
- Future unit tests: `src/**/*.test.ts` or `test/domain/**`.
- Future browser tests: `test/browser/**` or `playwright/**`.
- Future visual baselines: `test/visual/**`.

## Required Scenarios

1. Start a new career and render academy options.
2. Choose an academy and render a decision card.
3. Render at least one legacy `a/b` decision.
4. Render every alternate `options[]` decision through normalized options.
5. Click both choices on `Training Ground Scuffle` and confirm an outcome appears.
6. Render a quiet week with a continue button.
7. Complete a booster and verify the simulation progress elements exist.
8. Complete a season and verify the summary appears.
9. Close the summary and verify the exact stored club offers appear.
10. Reload during `simulating`, `season-summary`, `club`, `decision`, and `booster` phases.
11. Trigger naturalization and national-team overlays, then reload each overlay.
12. Import `test/fixtures/export-test.json` and verify migration.
13. Import malformed JSON and verify the current save is not destroyed.
14. Exercise free agency, contract expiry, loans, transfer-listed players, and high-OVR fallback offers.
15. Run desktop, tablet, and mobile screenshots for setup, decision, booster, club, summary, and retirement.

## Invariants

- Every actionable decision has at least two options.
- Every normalized decision has labels, effects, and a usable outcome.
- Every club phase has one to three offers.
- Every simulation phase has a renderable progress view.
- Every non-retired career has a valid next phase.
- OVR, stats, morale, stamina, loyalty, and finances stay within bounds.
- A saved phase can be loaded and rendered without repair creating random new content unless the payload is explicitly missing.

## CI Commands

The final project should expose these commands:

```text
npm run typecheck
npm run test
npm run build
npm run test:browser
npm run test:visual
```

## Acceptance Criteria

- The named decision regression is a browser test, not only a data test.
- The original transfer-options bug has a reload and high-OVR regression case.
- Browser console errors fail the smoke test.
- Screenshots cover responsive breakpoints.
- Tests can run in CI without a developer's local browser profile.

## Subagent Brief

> Expand coverage from the Node simulation suite to state transitions, DOM rendering, reloads, import/export, and browser smoke tests. Start with the reported decision-option and transfer-offer failures. Add invariant tests for all decision records and every phase. Do not change production behavior except for defects proven by a failing test.
