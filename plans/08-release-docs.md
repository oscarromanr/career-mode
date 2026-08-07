# Stage 8: Release, Deployment, and Documentation

## Goal

Make the architecture reproducible for future contributors and ensure the static game deploys predictably after the tooling migration.

## Deployment Tasks

1. Add a documented Node and package-manager version.
2. Add `npm ci`, `npm run typecheck`, `npm run test`, and `npm run build` to CI.
3. Deploy Vite `dist` to GitHub Pages.
4. Copy `CNAME` to `public/CNAME` and verify the custom domain after deployment.
5. Preserve relative asset paths and external badge behavior.
6. Add a smoke check against the deployed URL if the deployment environment provides one.
7. Record bundle size, load time, and console error status before and after the migration.
8. Document rollback to the last known-good static build.

## Documentation Tasks

1. Rewrite `README.md` with setup, development, test, build, and deployment commands.
2. Add an architecture overview linking to `plans/` and the final source modules.
3. Document the phase model and save migration policy.
4. Document the decision data schema and content validation command.
5. Document how to create a reproducible bug report with a save envelope and RNG seed.
6. Document the browser QA flow and fixture generation.
7. Add a changelog entry for the phase-model and decision-schema fixes.
8. Remove obsolete references to script-order globals after the final migration.

## Files

- Project docs: `README.md`, `plans/**`, future `ARCHITECTURE.md` and `CHANGELOG.md`.
- Build/deploy: `package.json`, `vite.config.ts`, `public/CNAME`, `.github/workflows/**`.
- QA reports and release artifacts: `test/**`, CI output, and deployment smoke checks.

## Final Review Checklist

- `git diff` contains no generated random fixture churn without a reason.
- No secrets or local paths enter saves, fixtures, or documentation.
- Old saves import.
- New saves export.
- All decision cards render in both languages.
- All phase transitions have tests.
- No console errors occur during a complete career.
- Mobile and desktop layouts are checked.
- GitHub Pages serves the expected build and CNAME.
- The final architecture decision records whether React was adopted or intentionally deferred.

## Acceptance Criteria

- A new contributor can clone the repository and run the game and tests from `README.md`.
- A subagent can identify the correct module and plan without reading the entire repository first.
- Deployment can be repeated from CI without manual file copying.
- The release report lists test, build, browser, visual, and deployed smoke evidence.

## Subagent Brief

> Finish the migration release work. Add reproducible CI/build/deploy commands, preserve GitHub Pages and CNAME behavior, update README and architecture documentation, and produce a final release checklist. Do not change gameplay or silently discard existing worktree changes.
