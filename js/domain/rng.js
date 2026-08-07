/* ============================================================
   CAREER MODE '26 - domain: RNG
   ============================================================
   Injectable, seedable random source. All domain randomness flows
   through this module. When bound to a career state, every draw
   advances the persisted cursor so simulations are reproducible:
   same seed + same action sequence => same result.

   Seeds use mulberry32 (deterministic, no Math.random hidden in
   domain modules). Cosmetic UI randomness (confetti, minigame
   visuals) is not domain state and may use Math.random directly.
   ============================================================ */
(function (root) {
  'use strict';

  // ---- mulberry32: small deterministic PRNG ----
  function createSeededRng(seed) {
    let a = (seed >>> 0) || 1;
    return function () {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function randomSeed() {
    return (Math.floor(Math.random() * 0x7fffffff) + 1) >>> 0;
  }

  // Module-level engine state: either a plain function (legacy) or a bound
  // career state whose seed/cursor are persisted.
  let plainFn = Math.random;
  let bound = null;   // career state carrying rngSeed / rngCursor
  let stream = null;  // live PRNG instance (fast-forwarded to cursor at bind)

  function resetStream() {
    if (!bound) return;
    if (typeof bound.rngSeed !== 'number' || bound.rngSeed <= 0) bound.rngSeed = randomSeed();
    if (typeof bound.rngCursor !== 'number' || bound.rngCursor < 0) bound.rngCursor = 0;
    const prng = createSeededRng(bound.rngSeed);
    for (let i = 0; i < bound.rngCursor; i++) prng();
    stream = prng;
  }

  // Bind randomness to a career state. Every draw advances state.rngCursor.
  function bind(state) {
    bound = state || null;
    stream = null;
    if (bound) {
      if (typeof bound.rngSeed !== 'number' || bound.rngSeed <= 0) bound.rngSeed = randomSeed();
      resetStream();
    }
    root.EngineRng = rnd;
    return bound;
  }

  function unbind() {
    bound = null;
    stream = null;
    root.EngineRng = Math.random;
  }

  function isBound() {
    return !!bound;
  }

  function seedInfo() {
    return bound ? { seed: bound.rngSeed, cursor: bound.rngCursor } : null;
  }

  function setRng(fn) {
    if (bound) {
      // Rebinding the plain function is not allowed while a career owns the
      // stream; fall back to unbinding first (tests rely on this).
      unbind();
    }
    plainFn = typeof fn === 'function' ? fn : Math.random;
    root.EngineRng = plainFn;
    return plainFn;
  }

  const rnd = () => {
    if (bound) {
      const v = stream();
      bound.rngCursor = (bound.rngCursor || 0) + 1;
      return v;
    }
    return plainFn();
  };

  const ri = (min, max) => min + Math.floor(rnd() * (max - min + 1)); // inclusive
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const chance = (p) => rnd() < p;
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  function weightedSample(items, weightFn, n) {
    const pool = items.slice();
    const out = [];
    while (out.length < n && pool.length) {
      const weights = pool.map(weightFn);
      const total = weights.reduce((a, b) => a + b, 0);
      let r = rnd() * total;
      let idx = pool.length - 1;
      for (let i = 0; i < pool.length; i++) {
        r -= weights[i];
        if (r <= 0) { idx = i; break; }
      }
      out.push(pool.splice(idx, 1)[0]);
    }
    return out;
  }

  const Rng = {
    setRng,
    bind,
    unbind,
    isBound,
    seedInfo,
    createSeededRng,
    randomSeed,
    rnd,
    ri,
    clamp,
    chance,
    pick,
    shuffle,
    weightedSample,
  };

  root.DomainRng = Rng;
  if (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = Rng;
})(typeof window !== 'undefined' ? window : globalThis);
