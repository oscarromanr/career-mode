/* ============================================================
   CAREER MODE '26 - domain: boosters and shop
   Training boosters, consumables and spending.
   ============================================================ */
(function (root) {
  'use strict';

  const Model = (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports)
    ? require('./model.js')
    : root.DomainModel;
  const Player = (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports)
    ? require('./player.js')
    : root.DomainPlayer;
  const Rng = (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports)
    ? require('./rng.js')
    : root.DomainRng;
  const Decisions = (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports)
    ? require('./decisions.js')
    : root.DomainDecisions;

  const { DATA, clubByCid } = Model;
  const { recompute } = Player;
  const { clamp, rnd, pick, shuffle } = Rng;
  const { applyFx } = Decisions;

  const T = (key, params) => root.I18n ? root.I18n.T(key, params) : key;

  // ---- Boosters ----
  function rollRarity(state) {
    let probs = DATA.RARITY_ROLL.map(r => ({ ...r }));
    const p = state.player;
    const club = state.club ? clubByCid(state.club.cid) : null;
    if (club && club.s > p.ovr) {
      const diff = club.s - p.ovr;
      const boost = clamp(0.05 + (diff / 20) * 0.10, 0.05, 0.15);
      const total = probs.reduce((a, r) => a + r.p, 0);
      const shift = total * boost;
      
      const bronze = probs.find(r => r.rarity === 'bronze');
      const silver = probs.find(r => r.rarity === 'silver');
      const gold = probs.find(r => r.rarity === 'gold');
      
      if (bronze && silver && gold) {
        bronze.p -= shift;
        silver.p += shift * 0.7;
        gold.p += shift * 0.3;
      }
    }

    const total = probs.reduce((a, r) => a + r.p, 0);
    let roll = rnd() * total;
    for (const r of probs) { if (roll < r.p) return r.rarity; roll -= r.p; }
    return 'bronze';
  }

  function boosterForPlayer(state, b) {
    const isGK = state.player.isGK;
    if (b.pos === 'any') return true;
    if (b.pos === 'gk') return isGK;
    return !isGK;
  }

  function rollBoosters(state) {
    const pool = DATA.BOOSTERS.filter((b) => boosterForPlayer(state, b));
    const out = [];
    const usedIds = new Set();
    const forceRare = state.boostPity >= 2;
    for (let i = 0; i < 3; i++) {
      let rarity = rollRarity(state);
      if (forceRare && i === 0 && rarity === 'bronze') {
        const r2 = rnd();
        rarity = r2 < 0.75 ? 'silver' : r2 < 0.95 ? 'gold' : 'diamond';
      }
      let candidates = pool.filter((b) => b.rarity === rarity && !usedIds.has(b.id));
      if (!candidates.length) candidates = pool.filter((b) => !usedIds.has(b.id));
      const b = pick(candidates);
      usedIds.add(b.id);
      out.push(b);
    }
    if (out.some((b) => b.rarity !== 'bronze')) state.boostPity = 0; else state.boostPity++;
    return out;
  }

  function boosterFx(state, b) {
    return (state.player.isGK && b.fxGk) ? b.fxGk : b.fx;
  }

  function applyBooster(state, booster) {
    const fx = boosterFx(state, booster);
    const changes = applyFx(state, { stats: fx });
    recompute(state);
    return { changes };
  }

  // ---- Consumables shop (tiered purchases per season & rerolls) ----
  function maxShopPurchases(state) {
    const t = state.player.tier;
    if (t === 'diamond') return 4;
    if (t === 'gold') return 3;
    if (t === 'silver') return 2;
    return 1;
  }

  function consumableCost(state, item) {
    const mult = 1 + Math.max(0, (state.player.ovr - 50) / 40);
    return Math.round(item.price * mult / 1000) * 1000;
  }

  function shopItems(state) {
    const balance = state.earnings - state.spent;
    if (!state.shopOffers || state.shopOffersSeason !== state.season) {
      const pool = shuffle(DATA.CONSUMABLES);
      state.shopOffers = pool.slice(0, 6).map((c) => c.id);
      state.shopOffersSeason = state.season;
    }
    const available = DATA.CONSUMABLES.filter((c) => state.shopOffers.includes(c.id));
    return available.map((c) => {
      const cost = consumableCost(state, c);
      return Object.assign({}, c, { cost, affordable: balance >= cost });
    });
  }

  function rerollShop(state) {
    const cost = 50000;
    const balance = state.earnings - state.spent;
    if (state.shopRerolledSeason === state.season) return { ok: false, reason: T('shop.errAlreadyRerolled') || 'Already rerolled shop this season' };
    if (balance < cost) return { ok: false, reason: T('shop.errNoFunds') || 'Not enough career earnings to reroll' };
    state.spent += cost;
    state.shopRerolledSeason = state.season;
    const current = state.shopOffers || [];
    const pool = DATA.CONSUMABLES.filter((c) => !current.includes(c.id));
    state.shopOffers = shuffle(pool).slice(0, 6).map((c) => c.id);
    state.shopOffersSeason = state.season;
    return { ok: true };
  }

  function buyConsumable(state, id) {
    const maxP = maxShopPurchases(state);
    const countThisSeason = (state.shopPurchasesSeason === state.season) ? (state.shopPurchasesCount || 0) : 0;
    if (countThisSeason >= maxP) {
      return { ok: false, reason: T('shop.errMaxPurchases', { max: maxP, tier: state.player.tier.toUpperCase() }) || `Max shop purchases reached (${maxP} for ${state.player.tier.toUpperCase()} tier)` };
    }
    const purchasedIds = (state.shopPurchasesSeason === state.season) ? (state.shopPurchasedIds || []) : [];
    if (purchasedIds.includes(id)) {
      return { ok: false, reason: 'Already purchased this item this season' };
    }
    const item = shopItems(state).find((i) => i.id === id);
    if (!item) return { ok: false, reason: T('shop.errUnknownItem') || 'Unknown item' };
    if (!item.affordable) return { ok: false, reason: T('shop.errNoFunds') || 'Not enough career earnings' };
    state.spent += item.cost;
    // Track season shop spending for annual expenses display
    if (state.shopSpentSeason !== state.season) {
      state.shopSpentSeason = state.season;
      state.shopSpentThisSeason = item.cost;
    } else {
      state.shopSpentThisSeason = (state.shopSpentThisSeason || 0) + item.cost;
    }
    if (state.shopPurchasesSeason !== state.season) {
      state.shopPurchasesSeason = state.season;
      state.shopPurchasesCount = 1;
      state.shopPurchasedIds = [id];
    } else {
      state.shopPurchasesCount += 1;
      state.shopPurchasedIds.push(id);
    }
    state.shopSeason = state.season;
    const fx = (state.player.isGK && item.fxGk) ? item.fxGk : item.fx;
    const changes = applyFx(state, fx);
    if (id === 'super_agent') {
      changes.push({ k: 'AGENT_NEG', d: 25 }, { k: 'AGENT_PAT', d: 20 });
    }
    recompute(state);
    return { ok: true, changes, item };
  }

  const BoostersShop = {
    rollRarity,
    boosterForPlayer,
    rollBoosters,
    boosterFx,
    applyBooster,
    maxShopPurchases,
    consumableCost,
    shopItems,
    rerollShop,
    buyConsumable,
  };

  root.DomainBoostersShop = BoostersShop;
  if (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = BoostersShop;
})(typeof window !== 'undefined' ? window : globalThis);
