# Stage 3: TypeScript and Tooling

## Goal

Add a modern build and type-checking foundation without requiring an immediate UI rewrite. TypeScript should enforce the phase model and domain contracts before React is considered.

## Tooling Target

- Vite for the browser build and local development server.
- TypeScript in strict mode.
- Vitest for fast unit tests.
- ESLint only if it can be introduced without a large unrelated formatting diff.
- GitHub Pages deployment from `dist`.
- `public/CNAME` preserving the existing domain.

## Tasks

1. Add `package.json` with scripts for `dev`, `build`, `preview`, `typecheck`, `test`, and `test:watch`.
2. Add `tsconfig.json` with strict settings and a staged migration configuration.
3. Add Vite entry files while preserving the current `index.html` shell and CSS.
4. Move the state model to `src/domain/state.ts` first.
5. Define types for `CareerState`, `Phase`, `Overlay`, `Player`, `Club`, `Decision`, `ClubOffer`, `SeasonResult`, and `SaveEnvelope`.
6. Convert the domain facade and extracted modules from Stage 2 one module at a time.
7. Use `allowJs` and `checkJs` only as temporary migration aids. Do not leave the final domain typed as `any`.
8. Type the static data pack and add compile-time checks for decision options, positions, stats, and effect keys.
9. Convert the test suite to Vitest or provide a compatibility script while migration is in progress.
10. Update the fixture generator to use imports instead of script-order globals.
11. Configure GitHub Pages output and verify the CNAME is copied into the build.

## Type Rules

- `Phase` must be a discriminated union, not `{ kind: string; [key: string]: any }`.
- Actions must be a discriminated union.
- Save input is `unknown` until runtime validation succeeds.
- Static decision data must use one schema.
- No `any` in domain, state, persistence, or test code.
- DOM escape helpers and external API responses must have explicit types.

## Files

- New: `package.json`, `tsconfig.json`, `vite.config.ts`, `src/**`.
- Transitional: `index.html`, `js/**`, `test/**`.
- Deployment: `public/CNAME`, optional `.github/workflows/pages.yml`.

## Acceptance Criteria

- `npm run typecheck` passes with strict mode.
- `npm run test` passes.
- `npm run build` produces a working static bundle.
- The game loads from `dist` with the same CNAME and asset paths.
- Existing saves import through the typed runtime validator.
- The domain can be imported in Node without browser globals.

## Migration Strategy

Do not rename every file at once. Move state and domain contracts first, then domain modules, then data, then UI. Keep one compatibility entry point until the final cutover.

## Subagent Brief

> Add Vite, TypeScript, and Vitest as a migration foundation. Type the state model and domain interfaces first, preserve the current gameplay and save compatibility, and keep the imperative UI working until the domain is typed. Do not port UI components yet. Prove `typecheck`, tests, and production build all pass.
