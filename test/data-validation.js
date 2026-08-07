/* Data validation: canonical decision schema, unique IDs, valid effects.
   Runs standalone (node test/data-validation.js) and as part of npm test
   via npm run validate:data. This is the Stage 6 content gate. */
'use strict';
const DATA = require('../js/data.js');
global.GAME_DATA = DATA;
require('../js/data-decisions-canonical.js');
const Engine = require('../js/engine.js');

let failures = 0;
const fail = (msg) => { failures++; console.error('  FAIL:', msg); };
const ids = new Set();

console.log('Data validation:');

// ---- unique IDs across every pack ----
function checkUnique(pack, label) {
  pack.forEach((item) => {
    if (ids.has(item.id)) fail(`duplicate id ${item.id} in ${label}`);
    ids.add(item.id);
  });
}
checkUnique(DATA.DECISIONS, 'decisions');
checkUnique(DATA.BOOSTERS, 'boosters');
checkUnique(DATA.CONSUMABLES, 'consumables');

// ---- every decision: canonical options or legacy a/b, 2+ options ----
const EFFECT_KEYS = new Set(['stats', 'form', 'hype', 'stam', 'mor', 'rep', 'loyalty', 'money', 'injury', 'special', 'risk']);
const STAT_KEYS = new Set(['PAC', 'PAS', 'DRI', 'SHO', 'PHY', 'MEN', 'REF', 'LEA', 'VIS', 'COM']);
const POSITIONS = new Set(['any', 'gk', 'field', 'att', 'mid', 'def', 'ST', 'CF', 'LW', 'RW', 'CAM', 'CM', 'CDM', 'LM', 'RM', 'CB', 'LB', 'RB', 'GK']);

function checkEffect(effect, where) {
  if (!effect || typeof effect !== 'object') return;
  Object.keys(effect).forEach((k) => {
    if (!EFFECT_KEYS.has(k)) fail(`unknown effect key "${k}" in ${where}`);
  });
  if (effect.stats) {
    Object.keys(effect.stats).forEach((sk) => {
      if (!STAT_KEYS.has(sk)) fail(`unknown stat "${sk}" in ${where}`);
      if (typeof effect.stats[sk] !== 'number') fail(`stat value not numeric in ${where}`);
    });
  }
  if (effect.risk) {
    checkEffect(effect.risk.good, `${where}.risk.good`);
    checkEffect(effect.risk.bad, `${where}.risk.bad`);
  }
}

DATA.DECISIONS.forEach((d) => {
  if (typeof d.min !== 'number' || typeof d.max !== 'number' || d.min > d.max) fail(`${d.id}: invalid age range`);
  if (d.pos !== undefined && !POSITIONS.has(d.pos) && !(Array.isArray(d.pos) && d.pos.every((p) => POSITIONS.has(p)))) {
    fail(`${d.id}: unsupported position gate "${d.pos}"`);
  }
  const normalized = Engine.normalizeDecision(d);
  const opts = ['a', 'b', 'c'].filter((k) => normalized[k]);
  if (opts.length < 2) fail(`${d.id}: fewer than two options`);
  opts.forEach((k) => {
    const o = normalized[k];
    if (!o.label) fail(`${d.id}.${k}: missing label`);
    // Risk decisions carry outcome text in the RISK_OUTCOMES table, so out may
    // be empty when fx.risk is present.
    if (!o.out && !o.mini && !(o.fx && o.fx.risk)) fail(`${d.id}.${k}: missing outcome text`);
    checkEffect(o.fx, `${d.id}.${k}`);
    if (o.mini) {
      if (!o.mini.results || Object.keys(o.mini.results).length < 2) fail(`${d.id}.${k}: minigame needs good+bad results`);
      Object.entries(o.mini.results || {}).forEach(([rk, r]) => {
        if (!r.out) fail(`${d.id}.${k}.mini.${rk}: missing outcome`);
        checkEffect(r.fx, `${d.id}.${k}.mini.${rk}`);
      });
    }
  });
  // canonical options[] schema: each option needs id, text, and effects
  if (Array.isArray(d.options)) {
    d.options.forEach((o) => {
      if (!o.id || !o.text) fail(`${d.id}: options[] entry missing id/text`);
      const hasEffects = Array.isArray(o.changes) || (o.fx && typeof o.fx === 'object')
        || (o.mini && o.mini.results && Object.keys(o.mini.results).length > 0);
      if (!hasEffects) fail(`${d.id}.${o.id}: options[] entry missing effects (changes, fx, or mini)`);
      checkEffect(o.fx, `${d.id}.${o.id}`);
      if (o.changes) o.changes.forEach((c) => {
        if (!c.k || typeof c.d !== 'number') fail(`${d.id}.${o.id}: invalid change entry`);
      });
    });
  }
});

// ---- boosters ----
const RARITY_TOTALS = { bronze: 1, silver: 2, gold: 3, diamond: 5 };
DATA.BOOSTERS.forEach((b) => {
  if (!RARITY_TOTALS[b.rarity]) fail(`${b.id}: invalid rarity`);
  const fx = b.fx || {};
  const total = Object.values(fx).reduce((a, v) => a + v, 0);
  if (total <= 0 || total > RARITY_TOTALS[b.rarity]) fail(`${b.id}: booster budget ${total} out of range`);
  Object.keys(fx).forEach((k) => { if (!STAT_KEYS.has(k)) fail(`${b.id}: unknown booster stat ${k}`); });
});

// ---- consumables ----
DATA.CONSUMABLES.forEach((c) => {
  if (typeof c.price !== 'number' || c.price <= 0) fail(`${c.id}: invalid price`);
  checkEffect(c.fx, `${c.id}.fx`);
  if (c.fxGk) checkEffect(c.fxGk, `${c.id}.fxGk`);
});

// ---- countries / clubs ----
const clubIds = new Set();
DATA.COUNTRIES.forEach((c) => {
  if (!c.id || !c.name) fail(`country missing id/name`);
  (c.clubs || []).forEach((cl) => {
    const cid = `${c.id}:${cl.n}`;
    if (clubIds.has(cid)) fail(`duplicate club ${cid}`);
    clubIds.add(cid);
    if (typeof cl.s !== 'number') fail(`club ${cid}: missing strength`);
  });
});

// ---- i18n completeness: Spanish falls back to English, never to internal keys ----
// The i18n runtime (I18n.TData) already falls back to the English content when
// an ES entry is missing. The structural guarantee is: a rendered string must
// never be an internal key or empty. Missing ES entries are reported as a
// coverage gap (warning), not a release blocker.
require('../js/i18n-es.js');
require('../js/i18n-es-decisions.js');
const ES = globalThis.I18N_ES;
const esDecisions = (ES && ES.decisions) || {};
let missingEs = 0;
DATA.DECISIONS.forEach((d) => {
  if (!esDecisions[d.id]) {
    missingEs++;
    // Report a sample, then summarize.
    if (missingEs <= 3) console.log(`  WARN: decision ${d.id}: no Spanish translation (falls back to English)`);
  }
});
if (missingEs > 3) console.log(`  WARN: ${missingEs - 3} more decisions lack Spanish translations (English fallback)`);

// Spanish entries that exist must not render internal keys.
Object.entries(esDecisions).forEach(([id, es]) => {
  ['title', 'desc'].forEach((f) => {
    const v = es[f];
    if (typeof v === 'string' && (v === id || /^[a-z-]+(\.[a-z-]+)+$/.test(v) && v.length < 60)) {
      fail(`decision ${id}: Spanish ${f} looks like an internal key: "${v}"`);
    }
  });
});

console.log(failures === 0
  ? `  OK: ${DATA.DECISIONS.length} decisions, ${DATA.BOOSTERS.length} boosters, ${DATA.CONSUMABLES.length} consumables, ${clubIds.size} clubs validated (${missingEs} ES fallbacks)`
  : `  ${failures} data failures`);
process.exit(failures === 0 ? 0 : 1);
