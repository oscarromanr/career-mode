# Stage 6: Data and i18n Cleanup

## Goal

Make content data and translations use one schema. The current decision packs were authored in two incompatible formats, which caused the blank option bug and left several effect keys without a clear engine owner.

## Target Decision Schema

```ts
type DecisionDefinition = {
  id: string;
  min: number;
  max: number;
  position?: 'any' | 'gk' | 'def' | 'mid' | 'att';
  rarity: Rarity;
  titleKey: string;
  descriptionKey: string;
  options: [DecisionOption, DecisionOption, ...DecisionOption[]];
};

type DecisionOption = {
  id: string;
  labelKey: string;
  subKey?: string;
  outcomeKey: string;
  effects: Effect[];
};
```

Do not keep both `a/b/c` and `options[]` as long-term schemas. The current normalizer is a compatibility bridge, not the final content format.

## Tasks

1. Convert the original `a/b/c` decisions into the canonical `options[]` schema.
2. Convert `data-decisions.js` into the same canonical schema.
3. Add a content validation script that detects duplicate IDs, invalid age ranges, unsupported positions, missing options, empty labels, and unknown effects.
4. Replace generated one-line decision data with a reproducible generation pipeline or readable source files.
5. Decide ownership for every effect key: stats, stamina, morale, reputation, loyalty, money, form, injury, special, or remove it.
6. Add explicit mapping for position, tactical, defensive, and kicking effects instead of silently mapping unknown keys.
7. Move translations into nested `I18N_ES.decisions[id]` entries with `title`, `desc`, `a`, `b`, and `c` or the new option list.
8. Remove flat-key compatibility lookup after all content is migrated and tests confirm no flat keys remain.
9. Add English and Spanish completeness checks. A missing Spanish translation must fall back to English content, never to an internal key in the player-facing UI.
10. Validate the static data in CI before building.

## Files

- Data sources: `js/data.js`, `js/data-decisions.js`, future `src/data/**`.
- Translation sources: `js/i18n.js`, `js/i18n-es.js`, `js/i18n-es-decisions.js`, future `src/i18n/**`.
- Validation: new `test/data-validation.js` or `src/data/validate.ts`.
- Generated content: `test/fixtures/**` and any future content-generation scripts.

## Content Rules

- IDs are unique across every data pack.
- Every decision has two or more options.
- Every option has a label, outcome, and valid effect list.
- Position gates use one documented vocabulary.
- Effects use uppercase stat keys only where a real player stat exists.
- Content generators use a seed when randomness is intentional.

## Acceptance Criteria

- The application no longer needs runtime schema normalization for shipped data.
- `data.js` and `data-decisions.js` cannot silently append duplicate cards.
- Every card renders in English and Spanish.
- Every effect either applies to state or is rejected by validation before release.
- Content validation runs as part of `npm test` or `npm run validate:data`.

## Subagent Brief

> Consolidate all decision and translation data into one validated schema. Preserve text and intended gameplay effects, resolve unsupported effect keys explicitly, remove duplicate IDs, and add English/Spanish completeness checks. Keep the runtime compatibility normalizer until all callers and fixtures use the canonical format.
