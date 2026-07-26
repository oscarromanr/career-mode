/* ============================================================
   CAREER MODE '26 — Engine Contracts Sub-Module
   Contract duration calculation and free agency logic
   ============================================================ */
(function (root) {
  'use strict';

  function ri(min, max) {
    const fn = root.EngineRng || Math.random;
    return Math.floor(fn() * (max - min + 1)) + min;
  }

  function calcContractLength(age) {
    if (age <= 21) return ri(4, 5);
    if (age <= 27) return ri(3, 5);
    if (age <= 32) return ri(2, 3);
    return ri(1, 2);
  }

  root.EngineContracts = {
    calcContractLength: calcContractLength,
  };
})(typeof window !== 'undefined' ? window : globalThis);
