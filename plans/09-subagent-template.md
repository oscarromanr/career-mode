# Subagent Execution Template

## Before Editing

1. Read `plans/README.md` and the assigned stage plan.
2. Run `git status --short` and inspect existing diffs.
3. Identify files owned by other active plans.
4. Read the relevant source and tests before proposing a change.
5. State the exact scope in the first progress update.

## While Editing

- Keep the assigned stage narrow.
- Use `apply_patch` for manual edits.
- Do not reset or overwrite unrelated work.
- Add a regression test before or with each behavior fix.
- Preserve save compatibility unless the plan explicitly changes the schema.
- Do not hide failures with broad catches or fallback rendering.
- Do not change random balance numbers during architecture work.

## Required Final Report

```text
PLAN: [plan filename]
STATUS: DONE | DONE_WITH_CONCERNS | BLOCKED
GOAL: [one sentence]
CHANGED: [files and purpose]
BEHAVIOR: [user-visible behavior changed, or "none"]
TESTS: [exact commands and results]
MIGRATION: [save/data compatibility impact]
RISKS: [remaining concerns]
FOLLOW-UP: [next plan or explicit none]
```

## Ownership Boundaries

| Area | Default owner |
|---|---|
| `js/state.js`, save phases, transitions | Stage 1 |
| `js/engine.js`, `js/domain/**` | Stage 2 |
| `package.json`, `tsconfig`, Vite, typed contracts | Stage 3 |
| save envelope, migrations, RNG | Stage 4 |
| tests, Playwright, fixtures | Stage 5 |
| data packs and translations | Stage 6 |
| React components and UI store | Stage 7 |
| CI, deployment, README, release docs | Stage 8 |

If a task crosses two ownership areas, stop and report the boundary instead of silently editing both. The integration owner should sequence the work.

## Suggested Spawn Sequence

1. Spawn Stage 0 for baseline only.
2. Spawn Stage 1 for state hardening.
3. Spawn Stage 5 for transition and reload tests once Stage 1 has a stable API.
4. Spawn Stage 2 for domain extraction.
5. Spawn Stage 3 for TypeScript and Vite.
6. Spawn Stage 4 for deterministic persistence.
7. Spawn Stage 6 for canonical content and translations.
8. Decide whether Stage 7 is justified. If yes, spawn one UI migration owner.
9. Spawn Stage 8 for final CI, deployment, and documentation.

## Do Not Parallelize

- State model changes and controller rewrites against the same files.
- Domain extraction and a simultaneous rename of every engine export.
- Data schema conversion and translation-key conversion without a shared schema decision.
- React port and legacy UI edits against the same DOM root.
- Save migrations and fixture regeneration without one owner for the new envelope.
