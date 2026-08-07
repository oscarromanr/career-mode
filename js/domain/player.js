/* ============================================================
   CAREER MODE '26 - domain: player
   OVR, tier, value, salary, growth and recompute.
   ============================================================ */
(function (root) {
  'use strict';

  const Model = (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports)
    ? require('./model.js')
    : root.DomainModel;
  const Rng = (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports)
    ? require('./rng.js')
    : root.DomainRng;

  const { DATA, STATE } = Model;
  const { clamp, ri } = Rng;

  function getOvr(stats, position) {
    const w = DATA.OVR_WEIGHTS[position];
    let sum = 0, wsum = 0;
    Object.keys(w).forEach((k) => { sum += (stats[k] || 40) * w[k]; wsum += w[k]; });
    return clamp(Math.round(sum / wsum), 35, 99);
  }

  function getTier(ovr) {
    if (ovr >= 87) return 'diamond';
    if (ovr >= 75) return 'gold';
    if (ovr >= 65) return 'silver';
    return 'bronze';
  }

  function marketValue(p) {
    const base = Math.pow(Math.max(p.ovr - 50, 1), 3) * 1200;
    const a = p.age;
    let ageF;
    if (a <= 18) ageF = 1.1 + Math.max(0, p.potential - p.ovr) * 0.02;
    else if (a <= 21) ageF = 1.25;
    else if (a <= 24) ageF = 1.35;
    else if (a <= 28) ageF = 1.25;
    else if (a <= 30) ageF = 1.0;
    else if (a <= 32) ageF = 0.7;
    else if (a <= 34) ageF = 0.45;
    else ageF = 0.25;
    const hype = 1 + (p.hype || 0) * 0.004;
    const v = Math.round((base * ageF * hype) / 10000) * 10000;
    return Math.max(v, 25000);
  }

  function annualSalary(p, state) {
    let s = clamp(p.value * 0.11, 15000, 40000000);
    if (p.age < 18) s *= 0.25;
    if (state && state.superAgent) s *= 1.35;
    return Math.round(s / 1000) * 1000;
  }

  function growthDelta(age, key) {
    const brain = ['MEN', 'VIS', 'LEA', 'COM'].includes(key);
    let lo, hi;
    if (age <= 14) [lo, hi] = [2, 4];
    else if (age <= 17) [lo, hi] = [1, 4];
    else if (age <= 20) [lo, hi] = [1, 3];
    else if (age <= 23) [lo, hi] = [1, 3];
    else if (age <= 26) [lo, hi] = [0, 2];
    else if (age <= 29) [lo, hi] = [0, 1];
    else if (age <= 32) [lo, hi] = brain ? [0, 1] : [-1, 0];
    else if (age === 33) [lo, hi] = brain ? [0, 1] : [-2, -1];
    else if (age === 34) [lo, hi] = brain ? [-1, 0] : [-3, -2];
    else if (age <= 37) [lo, hi] = brain ? [-1, 0] : [-4, -2];
    else [lo, hi] = brain ? [-2, -1] : [-4, -3];
    return ri(lo, hi);
  }

  function addReputation(state, d) {
    if (!state.player) return;
    const before = state.player.reputation || 0;
    state.player.reputation = clamp(before + d, 0, 100);
  }

  function recompute(state) {
    const p = state.player;
    p.ovr = getOvr(p.stats, p.position);
    p.tier = getTier(p.ovr);
    if (!p.value || STATE.phaseKind(state) === 'simulating') {
      p.value = marketValue(p);
    }
    p.salary = annualSalary(p, state);

    state.clubLoyalty = state.clubLoyalty || {};
    if (state.club && state.club.cid) {
      if (state.clubLoyalty[state.club.cid] === undefined) {
        const seasonsAtClub = (state.clubStints && state.clubStints[state.club.cid]) ? state.clubStints[state.club.cid].seasons : 1;
        state.clubLoyalty[state.club.cid] = clamp(seasonsAtClub * 20, 20, 100);
      }
      p.loyalty = clamp(state.clubLoyalty[state.club.cid], 0, 100);
    } else {
      p.loyalty = 20;
    }

    if (p.ovr > p.peakOvr) { p.peakOvr = p.ovr; p.peakOvrYear = state.season; }
    if (p.value > p.peakValue) { p.peakValue = p.value; p.peakValueYear = state.season; }
  }

  const Player = {
    getOvr,
    getTier,
    marketValue,
    annualSalary,
    growthDelta,
    addReputation,
    recompute,
  };

  root.DomainPlayer = Player;
  if (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = Player;
})(typeof window !== 'undefined' ? window : globalThis);
