/* ============================================================
   CAREER MODE '26 — Engine Agents Sub-Module
   Agent candidate generation, stats, buyouts & negotiations
   ============================================================ */
(function (root) {
  'use strict';

  const FIRST_NAMES = ['Carlos', 'Jorge', 'Marco', 'Matteo', 'Pierre', 'Hugo', 'Lucas', 'Julian', 'Diego', 'Gabriel', 'Sven', 'Lars', 'Felix', 'Arthur', 'Bruno'];
  const LAST_NAMES = ['Mendes', 'Raiola', 'Zahavi', 'Barnett', 'Ramadani', 'Struth', 'Bertolucci', 'Riso', 'Pastorello', 'Gallardo', 'Schneider', 'Vargas', 'Silva'];

  const DAD_AGENT = {
    id: 'dad',
    name: 'Family Agent (Dad)',
    type: 'dad',
    patience: 95,
    greed: 25,
    negotiation: 55,
    buyoutFee: 0,
    annualSalary: 0,
  };

  function generateAgentName() {
    const fn = root.EngineRng || Math.random;
    const pick = (arr) => arr[Math.floor(fn() * arr.length)];
    return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
  }

  function rollAgentMarket(state) {
    const fn = root.EngineRng || Math.random;
    const ri = (min, max) => Math.floor(fn() * (max - min + 1)) + min;
    const val = state.player.value || 1000000;
    const isPro = val >= 10000000;

    const candidates = [DAD_AGENT];

    // Standard Agent
    const stdPat = ri(40, 75);
    const stdGrd = ri(45, 75);
    const stdNeg = ri(50, 80);
    const stdSalary = Math.round((val * 0.02 * (0.8 + fn() * 0.4)) / 10000) * 10000;
    candidates.push({
      id: 'agent_std_' + state.season,
      name: generateAgentName(),
      type: 'pro',
      patience: stdPat,
      greed: stdGrd,
      negotiation: stdNeg,
      buyoutFee: Math.round(stdSalary * 1.5),
      annualSalary: Math.max(20000, stdSalary),
    });

    // Elite / Greedy Agent
    const elePat = ri(30, 60);
    const eleGrd = ri(70, 95);
    const eleNeg = ri(75, 98);
    const eleSalary = Math.round((val * 0.04 * (0.9 + fn() * 0.3)) / 10000) * 10000;
    candidates.push({
      id: 'agent_elite_' + state.season,
      name: generateAgentName() + ' (Elite)',
      type: 'elite',
      patience: elePat,
      greed: eleGrd,
      negotiation: eleNeg,
      buyoutFee: Math.round(eleSalary * 2.0),
      annualSalary: Math.max(50000, eleSalary),
    });

    // Veteran Agent
    const vetPat = ri(70, 95);
    const vetGrd = ri(30, 60);
    const vetNeg = ri(65, 85);
    const vetSalary = Math.round((val * 0.025 * (0.8 + fn() * 0.4)) / 10000) * 10000;
    candidates.push({
      id: 'agent_vet_' + state.season,
      name: generateAgentName() + ' (Veteran)',
      type: 'pro',
      patience: vetPat,
      greed: vetGrd,
      negotiation: vetNeg,
      buyoutFee: Math.round(vetSalary * 1.2),
      annualSalary: Math.max(30000, vetSalary),
    });

    return candidates;
  }

  root.EngineAgents = {
    DAD_AGENT: DAD_AGENT,
    generateAgentName: generateAgentName,
    rollAgentMarket: rollAgentMarket,
  };
})(typeof window !== 'undefined' ? window : globalThis);
