# Stage 0: Baseline and Guardrails

## Goal

Establish a behavior baseline before more agents change architecture. This stage prevents subagents from mistaking existing uncommitted work or generated fixture churn for regressions.

## Current State

The worktree is expected to contain the phase-model implementation and decision-schema fixes. Inspect `git status` before touching files. Do not reset the worktree.

## Tasks

1. Record the current branch, `git status --short`, and `git diff --stat`.
2. Run `node test/sim-test.js` and save the result in the subagent report.
3. Run syntax checks for `js/*.js`, `js/engine/*.js`, and `test/*.js`.
4. Verify the combined decision dataset count and that every decision normalizes to at least two options.
5. Verify old `test/fixtures/export-test.json` migrates to version 3.
6. Record whether live browser tooling is available. If it is unavailable, do not install it as part of this stage.
7. Create a short baseline report in the subagent output, not a new source file.

## Files

- Read: `index.html`, `js/state.js`, `js/engine.js`, `js/main.js`, `js/ui.js`, `test/sim-test.js`.
- Do not modify application files in this stage.

## Acceptance Criteria

- The current test suite passes before Stage 1 starts.
- The current dirty worktree is understood and preserved.
- The baseline report names the exact commands and outputs.
- No generated fixture or save file is changed only for baseline collection.

## Risks

- Random simulation output varies between runs. Use pass/fail and invariants as the baseline, not exact career numbers.
- The current test suite may not exercise browser-only behavior. Mark that gap explicitly rather than treating Node tests as browser proof.

## Subagent Brief

> Inspect the repository without changing code. Establish the baseline for the architecture migration. Run the existing engine suite and syntax checks, inspect the current uncommitted state-model changes, confirm the combined decision count and legacy save migration, and report exact commands, results, risks, and files that later stages must not overwrite.
