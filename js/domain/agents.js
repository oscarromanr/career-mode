/* ============================================================
   CAREER MODE '26 - domain: agents
   Agents, requests, commissions.
   ============================================================ */
(function (root) {
  'use strict';

  const Model = (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports)
    ? require('./model.js')
    : root.DomainModel;
  const Rng = (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports)
    ? require('./rng.js')
    : root.DomainRng;
  const Decisions = (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports)
    ? require('./decisions.js')
    : root.DomainDecisions;

  const { clubByCid, fmtValue } = Model;
  const { ri, clamp, chance } = Rng;
  const { logStatNote } = Decisions;

  const T = (key, params) => root.I18n ? root.I18n.T(key, params) : key;

  const FIRST_NAMES = ['Carlos', 'Jorge', 'Marco', 'Matteo', 'Pierre', 'Hugo', 'Lucas', 'Julian', 'Diego', 'Gabriel', 'Sven', 'Lars', 'Felix', 'Arthur', 'Bruno'];
  const LAST_NAMES = ['Mendes', 'Raiola', 'Zahavi', 'Barnett', 'Ramadani', 'Struth', 'Bertolucci', 'Riso', 'Pastorello', 'Gallardo', 'Schneider', 'Vargas', 'Silva'];

  function generateAgentName() {
    return `${Rng.pick(FIRST_NAMES)} ${Rng.pick(LAST_NAMES)}`;
  }

  const DAD_AGENT = {
    id: 'dad',
    name: 'Family Agent (Dad)',
    type: 'dad',
    patience: 90,
    greed: 25,
    negotiation: 45,
    annualSalary: 0,
    buyoutFee: 0,
  };

  function rollAgentMarket(state) {
    const p = state.player;
    const baseSal = Math.round(p.salary * 0.04 / 25000) * 25000;
    const agents = [DAD_AGENT];
    for (let i = 1; i <= 3; i++) {
      const pat = ri(35, 88);
      const greed = ri(35, 90);
      const neg = ri(45, 95);
      const sal = Math.max(50000, Math.round((baseSal * (0.6 + neg * 0.01)) / 25000) * 25000);
      const buyout = sal * ri(2, 4);
      agents.push({
        id: `agent_${state.season}_${i}`,
        name: generateAgentName(),
        type: neg >= 85 ? 'super' : (greed >= 75 ? 'greedy' : 'pro'),
        patience: pat,
        greed,
        negotiation: neg,
        annualSalary: sal,
        buyoutFee: buyout,
      });
    }
    return agents;
  }

  function hireAgent(state, agentId) {
    const market = state.agentMarket || rollAgentMarket(state);
    const candidate = market.find((a) => a.id === agentId);
    if (!candidate) return { ok: false, reason: T('agent.errNotFound') || 'Agent not found' };

    const current = state.agent || DAD_AGENT;
    if (current.id === candidate.id) return { ok: false, reason: T('agent.errAlreadyActive') || 'Already your active agent' };

    const pSalary = state.player ? (state.player.salary || 0) : 0;
    if (candidate.annualSalary > 0 && candidate.annualSalary > pSalary) {
      return { ok: false, reason: T('agent.cantAffordSalary', { salary: fmtValue(pSalary), fee: fmtValue(candidate.annualSalary) }) };
    }

    const buyout = (current.type !== 'dad' && current.buyoutFee) ? current.buyoutFee : 0;
    const netBanked = state.earnings - state.spent;
    if (buyout > 0 && netBanked < buyout) {
      return { ok: false, reason: T('agent.cantAffordBuyout', { amount: fmtValue(buyout) }) };
    }

    if (buyout > 0) {
      state.spent += buyout;
      logStatNote(state, `Paid ${fmtValue(buyout)} release buyout clause to fire ${current.name}`);
    }

    state.agent = candidate;
    logStatNote(state, `Hired ${candidate.name} as active agent`);
    return { ok: true, agent: candidate, buyoutPaid: buyout };
  }

  function requestTransfer(state) {
    if (!state.agentActionsThisSeason) state.agentActionsThisSeason = {};
    if (state.agentActionsThisSeason.transferReq) {
      return { ok: false, reason: T('agent.errToggled') || 'Already toggled transfer status this season' };
    }

    state.agentActionsThisSeason.transferReq = true;
    state.player.hype = Math.min(100, (state.player.hype || 0) + 15);
    state.player.morale = Math.max(5, state.player.morale - 10);

    const isLoan = !!(state.club && state.club.loan);
    const changes = [{ k: 'HYPE', d: 15 }, { k: 'MOR', d: -10 }];
    if (!isLoan) {
      state.player.loyalty = Math.max(5, (state.player.loyalty || 20) - 20);
      changes.push({ k: 'LOYALTY', d: -20 });
      state.clubSituation = 'listed';
    } else {
      state.requestedLoanPermanentMove = true;
    }
    state.transferRequestBenched = true;

    return { ok: true, changes };
  }

  function withdrawTransferRequest(state) {
    if (!state.agentActionsThisSeason) state.agentActionsThisSeason = {};
    if (state.agentActionsThisSeason.transferReq) {
      return { ok: false, reason: T('agent.errToggled') || 'Already toggled transfer status this season' };
    }
    if (state.clubSituation !== 'listed') {
      return { ok: false, reason: T('agent.errNotListed') || 'You are not currently transfer listed.' };
    }

    state.agentActionsThisSeason.transferReq = true;
    state.clubSituation = 'stable';
    state.transferRequestBenched = false;

    // Withdrawing costs a bit of agent relationship/player morale as it looks indecisive
    state.player.morale = Math.max(5, state.player.morale - 5);
    
    return { ok: true, changes: [{ k: 'MOR', d: -5 }] };
  }

  function demandSalaryRaise(state) {
    if (!state.agentActionsThisSeason) state.agentActionsThisSeason = {};
    if (state.agentActionsThisSeason.raiseReq) {
      return { ok: false, reason: T('agent.errRaiseDemanded') || 'Already demanded a wage raise this season' };
    }

    state.agentActionsThisSeason.raiseReq = true;
    const agent = state.agent || DAD_AGENT;
    const cur = clubByCid(state.club.cid);
    const p = state.player;

    const baseSuccess = p.ovr >= cur.s - 3 ? 0.65 : (p.ovr >= cur.s - 6 ? 0.40 : 0.20);
    const negBonus = (agent.negotiation - 50) * 0.006;
    const prob = clamp(baseSuccess + negBonus, 0.10, 0.90);

    if (chance(prob)) {
      const greedMultiplier = 1 + (agent.greed / 300);
      const newSalary = Math.round(p.salary * greedMultiplier / 50000) * 50000;
      p.salary = Math.max(p.salary + 50000, newSalary);
      logStatNote(state, `Agent ${agent.name} secured wage increase to ${fmtValue(p.salary)}/yr`);
      return { ok: true, success: true, newSalary, changes: [] };
    } else {
      p.morale = Math.max(5, p.morale - 8);
      p.loyalty = Math.max(5, (p.loyalty || 20) - 5);
      return { ok: true, success: false, changes: [{ k: 'MOR', d: -8 }, { k: 'LOYALTY', d: -5 }] };
    }
  }

  function negotiateCommission(state, requestedPct) {
    if (!state.agentActionsThisSeason) state.agentActionsThisSeason = {};
    if (state.agentActionsThisSeason.commReq) {
      return { ok: false, reason: T('agent.errCutNegotiated') || 'Already negotiated transfer cut this season' };
    }

    state.agentActionsThisSeason.commReq = true;
    const agent = state.agent || DAD_AGENT;

    if (requestedPct <= 5) {
      state.transferCommissionPct = 5;
      return { ok: true, pct: 5, accepted: true };
    }

    if (requestedPct === 8) {
      if (agent.greed >= 40 || agent.negotiation >= 55) {
        state.transferCommissionPct = 8;
        return { ok: true, pct: 8, accepted: true };
      }
    } else if (requestedPct >= 12) {
      if (agent.greed >= 70 && agent.negotiation >= 70) {
        state.transferCommissionPct = 12;
        return { ok: true, pct: 12, accepted: true };
      }
    }

    return {
      ok: true,
      pct: state.transferCommissionPct || 5,
      accepted: false,
      reason: T('agent.errUnrealisticCut', { name: agent.name, pct: requestedPct }) || `Agent ${agent.name} deemed a ${requestedPct}% cut unrealistic.`
    };
  }

  const Agents = {
    FIRST_NAMES,
    LAST_NAMES,
    generateAgentName,
    DAD_AGENT,
    rollAgentMarket,
    hireAgent,
    requestTransfer,
    withdrawTransferRequest,
    demandSalaryRaise,
    negotiateCommission,
  };

  root.DomainAgents = Agents;
  if (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = Agents;
})(typeof window !== 'undefined' ? window : globalThis);
