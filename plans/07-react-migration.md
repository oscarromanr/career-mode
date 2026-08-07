# Stage 7: Optional React and TypeScript UI Migration

## Gate

Do this stage only if the game will receive frequent UI work, multiple new screens, richer overlays, or a team of contributors. The game is not required to adopt React after Stage 6.

## Goal

Replace the imperative DOM renderer with a declarative React UI while keeping the domain and state APIs stable.

## Preconditions

- State phases and overlays are explicit and validated.
- Domain modules have no DOM or translation-global dependencies.
- TypeScript and Vite are working.
- Persistence and migration tests pass.
- Browser smoke tests cover the existing UI.
- A visual baseline exists for the current design.

## Target UI

```text
App
  GameStoreProvider
    GameShell
      PlayerPanel
      StagePanel
        AcademyStage
        DecisionStage
        BoosterStage
        ClubStage
        SimulationStage
      HistoryPanel
      OverlayHost
        OutcomeModal
        SeasonSummaryModal
        NaturalizationModal
        NationalTeamModal
        AgentModal
        ShopModal
```

Use a typed reducer or application store. Do not put the whole career engine into React component state. Do not add Redux, Zustand, and XState together. A reducer plus selectors is the default.

## Tasks

1. Create a React root that owns the full game screen. Do not let legacy code and React mutate the same DOM subtree.
2. Port `playerCard`, `stageHeader`, and `renderHistory` into components.
3. Port each phase as a component that consumes its typed phase payload.
4. Port the modal system into one `OverlayHost` controlled by state/effects.
5. Move action handlers to typed dispatch actions.
6. Keep the existing CSS and class names during the first port to isolate behavior from visual redesign.
7. Port setup and retirement summary screens.
8. Replace global `UI`, `Engine`, `I18n`, and `GameAPI` references with imports or injected services.
9. Add React Testing Library tests for each stage and overlay.
10. Compare desktop and mobile screenshots against the visual baseline.
11. Remove legacy `ui.js` and `main.js` only after the browser suite passes with the React root.

## Files

- New UI: `src/ui/App.tsx`, `src/ui/components/**`, `src/ui/stages/**`, `src/ui/modals/**`.
- New application state: `src/app/store.ts`, `src/app/reducer.ts`, `src/app/selectors.ts`.
- Transitional UI: `js/ui.js`, `js/main.js`, `index.html`, `css/style.css`.
- Tests: `src/ui/**/*.test.tsx`, `test/browser/**`, and visual baselines.

## Non-Goals

- Do not use Next.js or server rendering. This is a static client game.
- Do not redesign the visual system in the same migration.
- Do not change domain rules while porting components.
- Do not add a router unless multiple URL-addressable screens become a real requirement.

## Acceptance Criteria

- Every phase renders from its payload without null repair logic in components.
- Modals cannot leave stale callbacks or duplicate transitions.
- Responsive behavior matches or improves the current UI.
- Browser tests pass against the React build.
- Bundle size and startup time remain acceptable for GitHub Pages.
- Old saves render correctly through the new UI.

## Rollback

Keep the DOM UI available behind a temporary build flag until the React browser suite and visual review pass. Remove the flag only after one release has shipped successfully.

## Subagent Brief

> Port the stable game UI to React and TypeScript incrementally. Preserve the existing CSS, domain API, save compatibility, and gameplay. Use one typed reducer/store and one React-owned game root. Port stages and overlays separately, add component/browser tests, and do not introduce a framework rewrite or visual redesign.
