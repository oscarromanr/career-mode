/* ============================================================
   CAREER MODE '26 — Engine Agents Sub-Module
   Agent candidate generation, stats, buyouts & negotiations
   ============================================================ */
(function (root) {
  'use strict';

  const FIRST_NAMES = ['Carlos', 'Jorge', 'Marco', 'Matteo', 'Pierre', 'Hugo', 'Lucas', 'Julian', 'Diego', 'Gabriel', 'Sven', 'Lars', 'Felix', 'Arthur', 'Bruno', 'Gonzalo', 'Alejandro', 'Federico', 'Joao', 'Fabio', 'Enzo', 'Leonardo', 'Massimo', 'Antoine'];
  const LAST_NAMES = ['Mendes', 'Raiola', 'Zahavi', 'Barnett', 'Ramadani', 'Struth', 'Bertolucci', 'Riso', 'Pastorello', 'Gallardo', 'Schneider', 'Vargas', 'Silva', 'D’Alessandro', 'Canales', 'Fonseca', 'Russo', 'Martins', 'Moreira'];

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

  function generateAgentName(usedNames) {
    const fn = root.EngineRng || Math.random;
    const pick = (arr) => arr[Math.floor(fn() * arr.length)];
    let name;
    let attempts = 0;
    do {
      name = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
      attempts++;
    } while (usedNames && usedNames.has(name) && attempts < 60);
    if (usedNames) usedNames.add(name);
    return name;
  }

  function rollAgentMarket(state) {
    const fn = root.EngineRng || Math.random;
    const ri = (min, max) => Math.floor(fn() * (max - min + 1)) + min;
    const pSal = (state.player && state.player.salary) ? state.player.salary : 30000;

    const usedNames = new Set();
    if (state.agent && state.agent.name) {
      const cleanActiveName = state.agent.name.replace(/\s*\((Elite|Veteran)\)$/i, '');
      usedNames.add(cleanActiveName);
    }

    const candidates = [DAD_AGENT];

    // Standard Agent
    const stdPat = ri(40, 75);
    const stdGrd = ri(45, 75);
    const stdNeg = ri(50, 80);
    const stdCalc = Math.round((pSal * 0.25 * (0.85 + fn() * 0.35)) / 5000) * 5000;
    const stdSalary = Math.max(20000, Math.min(stdCalc, pSal * 0.45));
    const stdName = generateAgentName(usedNames);
    candidates.push({
      id: 'agent_std_' + state.season,
      name: stdName,
      type: 'pro',
      patience: stdPat,
      greed: stdGrd,
      negotiation: stdNeg,
      buyoutFee: Math.round(stdSalary * 1.5),
      annualSalary: stdSalary,
    });

    // Elite / Greedy Agent
    const elePat = ri(30, 60);
    const eleGrd = ri(70, 95);
    const eleNeg = ri(75, 98);
    const eleCalc = Math.round((pSal * 0.45 * (0.9 + fn() * 0.3)) / 5000) * 5000;
    const eleSalary = Math.max(45000, Math.min(eleCalc, Math.round(pSal * 0.75)));
    const eleName = generateAgentName(usedNames);
    candidates.push({
      id: 'agent_elite_' + state.season,
      name: eleName + ' (Elite)',
      type: 'elite',
      patience: elePat,
      greed: eleGrd,
      negotiation: eleNeg,
      buyoutFee: Math.round(eleSalary * 2.0),
      annualSalary: eleSalary,
    });

    // Veteran Agent
    const vetPat = ri(70, 95);
    const vetGrd = ri(30, 60);
    const vetNeg = ri(65, 85);
    const vetCalc = Math.round((pSal * 0.30 * (0.8 + fn() * 0.4)) / 5000) * 5000;
    const vetSalary = Math.max(30000, Math.min(vetCalc, Math.round(pSal * 0.55)));
    const vetName = generateAgentName(usedNames);
    candidates.push({
      id: 'agent_vet_' + state.season,
      name: vetName + ' (Veteran)',
      type: 'pro',
      patience: vetPat,
      greed: vetGrd,
      negotiation: vetNeg,
      buyoutFee: Math.round(vetSalary * 1.2),
      annualSalary: vetSalary,
    });

    return candidates;
  }

  root.EngineAgents = {
    DAD_AGENT: DAD_AGENT,
    generateAgentName: generateAgentName,
    rollAgentMarket: rollAgentMarket,
  };
})(typeof window !== 'undefined' ? window : globalThis);
