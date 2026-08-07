# Domain Module Ownership Map

Every engine export and its owning domain module. The public facade is
`js/engine.js` (browser `root.Engine`, Node `require('./js/engine.js')`),
backed by `js/domain/index.js` (browser `root.Domain`).

| Export (Engine facade) | Module | File |
|---|---|---|
| `setRng` | rng | `js/domain/rng.js` |
| `newCareer` | career | `js/domain/career.js` |
| `academyOptions` | career | `js/domain/career.js` |
| `setAcademy` | contracts | `js/domain/contracts.js` |
| `applyClubOffer` | contracts | `js/domain/contracts.js` |
| `calcContractLength` | contracts | `js/domain/contracts.js` |
| `migrate` | facade (engine-level defaults) | `js/engine.js` |
| `continueSeasonSummary` | facade (app layer owns real transition) | `js/engine.js` |
| `pickDecision` | decisions | `js/domain/decisions.js` |
| `applyDecision` | decisions | `js/domain/decisions.js` |
| `applyMiniResult` | decisions | `js/domain/decisions.js` |
| `normalizeDecision` | decisions | `js/domain/decisions.js` |
| `rollBoosters` | boosters-shop | `js/domain/boosters-shop.js` |
| `applyBooster` | boosters-shop | `js/domain/boosters-shop.js` |
| `boosterFx` | boosters-shop | `js/domain/boosters-shop.js` |
| `shopItems` | boosters-shop | `js/domain/boosters-shop.js` |
| `buyConsumable` | boosters-shop | `js/domain/boosters-shop.js` |
| `consumableCost` | boosters-shop | `js/domain/boosters-shop.js` |
| `maxShopPurchases` | boosters-shop | `js/domain/boosters-shop.js` |
| `rerollShop` | boosters-shop | `js/domain/boosters-shop.js` |
| `clubOffers` | offers | `js/domain/offers.js` |
| `simLeague` | season | `js/domain/season.js` |
| `simulateSeason` | season | `js/domain/season.js` |
| `computeSeasonAwards` | season | `js/domain/season.js` |
| `retire` | summary | `js/domain/summary.js` |
| `retireType` | summary | `js/domain/summary.js` |
| `careerSummary` | summary | `js/domain/summary.js` |
| `getOvr` | player | `js/domain/player.js` |
| `getTier` | player | `js/domain/player.js` |
| `marketValue` | player | `js/domain/player.js` |
| `annualSalary` | player | `js/domain/player.js` |
| `recompute` | player | `js/domain/player.js` |
| `addReputation` | player | `js/domain/player.js` |
| `clubByCid` | model | `js/domain/model.js` |
| `countryById` | model | `js/domain/model.js` |
| `countryName` | model | `js/domain/model.js` |
| `fmtValue` | model | `js/domain/model.js` |
| `statKeys` | model | `js/domain/model.js` |
| `ALL_CLUBS` / `allClubs` | model | `js/domain/model.js` |
| `hireAgent` | agents | `js/domain/agents.js` |
| `rollAgentMarket` | agents | `js/domain/agents.js` |
| `requestTransfer` | agents | `js/domain/agents.js` |
| `withdrawTransferRequest` | agents | `js/domain/agents.js` |
| `demandSalaryRaise` | agents | `js/domain/agents.js` |
| `negotiateCommission` | agents | `js/domain/agents.js` |
| `DAD_AGENT` | agents | `js/domain/agents.js` |
| `acceptNtCallUp` | national-team | `js/domain/national-team.js` |
| `declineNtCallUpTemp` / `declineNtCallUp` | national-team | `js/domain/national-team.js` |
| `rejectNtCallUpPerm` | national-team | `js/domain/national-team.js` |
| `naturalizeAndSwitchNt` | national-team | `js/domain/national-team.js` |
| `getLegendForPlayer` | national-team (falls back to `js/engine/legends.js`) | `js/domain/national-team.js` |

## Load Order

Browser (`index.html`) and Node (`js/engine.js`) load domain modules in the same
dependency order: rng → model → player → decisions → agents → career →
contracts → offers → boosters-shop → season → national-team → summary → index.

## Boundary Rules

- No domain module touches `document`, `localStorage`, `window` layout, or DOM.
- No domain module calls `I18n.T` for decision outcomes; results carry keys and
  parameters (the `root.I18n` lookup happens only inside facade functions that
  existed for compatibility, e.g. offer notes, which return keys/params).
- Randomness flows through `js/domain/rng.js` only (injectable via `setRng`).
- Phase transitions live in `js/app.js`, not in domain modules.
