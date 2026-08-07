# Career Mode '26

A client-only football career simulator. Start as a 14-year-old academy
prospect and play every season until retirement at 40: one dilemma, one
training camp, and one career-defining club call per season.

Play it live: <https://romanlab.dev>

## Quick Start

Requirements: Node.js 22+, npm 10+.

```bash
npm ci                 # install dependencies
npm run dev            # local dev server (http://localhost:5173)
npm run typecheck      # strict TypeScript check
npm run test           # full test suite (legacy + vitest + data validation)
npm run build          # production bundle to dist/
npm run preview        # serve the production bundle locally
```

The game is fully client-side: saves live in `localStorage` under
`cm26-save-v1`, and nothing is sent to a server.

## Architecture

```
+-----------------------+
|       UI layer        |
| js/ui.js (DOM),       |
| js/main.js (bootstrap)|
+-----------+-----------+
            |  typed actions
+-----------v-----------+
|   application layer   |
| js/app.js: transitions|
| loadSave/serialize    |
+-----------+-----------+
            |  pure commands/results
+-----------v-----------+
|      domain core      |
| js/domain/* (no DOM,  |
| injected RNG)         |
+-----------+-----------+
            |
+-----------v-----------+
| persistence and data  |
| js/state.js (v4),     |
| js/data*.js, i18n     |
+-----------------------+
```

Key files:

- `js/state.js` — save version 4, phase model (discriminated union),
  session state (phase + overlay + pending effects), migration and runtime
  validation.
- `js/app.js` — the only layer that changes phases. Owns save load/validate,
  the save envelope, RNG binding, and the debug export.
- `js/domain/` — modular domain core: `rng`, `model`, `player`, `decisions`,
  `agents`, `career`, `contracts`, `offers`, `boosters-shop`, `season`,
  `national-team`, `summary`. No DOM, no translation-global calls. See
  `plans/MODULE-MAP.md` for export ownership.
- `src/domain/` — TypeScript contracts (`types.ts`) and the typed state facade
  (`state.ts`) used by tests and future code.
- `js/data.js` + `js/data-decisions-canonical.js` — static content. All 312
  decision cards use one canonical `options[]` schema (see below).
- `js/i18n.js`, `js/i18n-es*.js` — English and Spanish. Spanish falls back to
  English per decision when an entry is missing; it never renders internal keys.

The migration plan lives in `plans/` (stages 0-9). The final decision record
for the deferred React migration is `docs/adr/001-react-deferred.md`.

## Phase Model and Saves

Every save is validated on load. The `session` holds the current phase (one of
`academy | decision | booster | club | simulating | season-summary | retired`),
an overlay, and pending season-end effects (naturalization, national-team
call-up). Reloading during any phase resumes the exact flow; a season is never
re-simulated, and a summary's stored club offers are never re-rolled.

Save versions migrate one-way: legacy v1/v2 (stage + `current*` fields) -> v3
(top-level phase) -> v4 (session). Old exports remain importable.

## Decision Data Schema

All decisions use one canonical schema:

```ts
type DecisionDefinition = {
  id: string;
  min: number;        // min age
  max: number;        // max age
  pos?: 'any' | 'gk' | 'field' | 'att' | 'mid' | 'def' | PositionId[];
  rarity?: string;
  title: string;
  desc: string;
  options: [DecisionOption, DecisionOption, ...DecisionOption[]];
};

type DecisionOption = {
  id: string;         // 'a' | 'b' | 'c' | custom
  text: string;       // label
  sub?: string;
  out?: string;       // English outcome text
  fx?: EffectFx;      // stats/form/hype/stam/mor/rep/loyalty/money/injury/special/risk
  mini?: MiniGame;    // penalty/timing minigame
  changes?: [{ k, d }]; // legacy alternative to fx (converted by normalizer)
};
```

Validate content at any time:

```bash
npm run validate:data
```

The canonical pack is generated from the original sources:

```bash
node scripts/convert-decisions.js       # regenerates data-decisions-canonical.js
node scripts/convert-es-decisions.js    # regenerates nested ES translations
```

## Determinism and Bug Reports

Simulation is seeded: every career stores `rngSeed` and `rngCursor` in the
save, and every domain roll advances the cursor. Same seed + same action
sequence = identical career.

To file a reproducible bug report, use **Menu > Export debug report**. The
JSON includes the save envelope, seed/cursor, current phase, overlay, and the
last 20 actions. Replaying the seed reproduces the failing transition.

## Testing

```bash
npm run test           # sim invariants + state + domain + persistence + data + vitest
npm run typecheck      # strict TS
npm run build          # production build
npm run test:browser   # Playwright smoke tests (career loop, import, reload)
npm run test:visual    # responsive screenshots into test/visual/
```

Browser tests serve `dist/` via `vite preview`, so run `npm run build` before
`npm run test:browser`. Console errors fail the browser suite.

Visual QA fixtures regenerate with a seed:

```bash
node test/make-fixtures.js
```

## Deployment

GitHub Actions builds `dist/` and deploys it to GitHub Pages (see
`.github/workflows/ci.yml`). The custom domain is preserved via
`public/CNAME` (romanlab.dev). Asset paths are relative (`base: './'`), so the
bundle works from any Pages subpath.

Rollback: any previous `main` build can be redeployed via the Pages UI from
the workflow's last-known-good run; `dist/` is a pure static bundle with no
server dependencies.

## Changelog

See `CHANGELOG.md`.

## License

Game content is original to this repository. Club and national team names,
badges, and logos belong to their respective owners.
