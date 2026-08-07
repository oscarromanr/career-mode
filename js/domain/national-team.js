/* ============================================================
   CAREER MODE '26 - domain: national team
   Call-ups, nationalities, cooldowns.
   ============================================================ */
(function (root) {
  'use strict';

  const Model = (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports)
    ? require('./model.js')
    : root.DomainModel;
  const Decisions = (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports)
    ? require('./decisions.js')
    : root.DomainDecisions;

  const { DATA, countryById, countryName } = Model;
  const { logStatNote } = Decisions;

  function pendingNtCode(state) {
    const e = state.session && state.session.pendingEffects
      ? state.session.pendingEffects.find((x) => x.type === 'nt-callup')
      : null;
    return e ? e.countryCode : null;
  }

  function acceptNtCallUp(state, cCode) {
    const targetNatCode = cCode || pendingNtCode(state) || state.player.countryId;
    if (state.session && state.session.pendingEffects) {
      state.session.pendingEffects = state.session.pendingEffects.filter((x) => x.type !== 'nt-callup');
    }
    state.ntCalledUp = true;
    state.ntCountryId = targetNatCode;
    state.ntStatus = 'active';
    state.player.countryId = targetNatCode;
    const nat = countryById(targetNatCode);
    const T = (k, p) => root.I18n ? root.I18n.T(k, p) : k;
    logStatNote(state, T('note.ntAccepted', { country: countryName(nat) }));
  }

  function declineNtCallUpTemp(state, cCode) {
    const targetNatCode = cCode || pendingNtCode(state) || state.player.countryId;
    if (state.session && state.session.pendingEffects) {
      state.session.pendingEffects = state.session.pendingEffects.filter((x) => x.type !== 'nt-callup');
    }
    state.ntCalledUp = false;
    state.ntStatus = 'declined_temp';
    state.ntDeclinedThisYear = true;

    state.ntDeclinedCounts = state.ntDeclinedCounts || {};
    state.ntDeclinedCounts[targetNatCode] = (state.ntDeclinedCounts[targetNatCode] || 0) + 1;

    state.ntDeclinedCooldowns = state.ntDeclinedCooldowns || {};

    const nat = countryById(targetNatCode);
    const T = (k, p) => root.I18n ? root.I18n.T(k, p) : k;

    if (state.ntDeclinedCounts[targetNatCode] >= 3) {
      state.ntRejectedPerm = state.ntRejectedPerm || {};
      state.ntRejectedPerm[targetNatCode] = true;
      logStatNote(state, T('note.ntRejectedPerm3', { country: countryName(nat) }));
    } else {
      state.ntDeclinedCooldowns[targetNatCode] = 2;
      logStatNote(state, T('note.ntDeclinedTemp', { country: countryName(nat) }));
    }
  }

  function rejectNtCallUpPerm(state, cCode) {
    const targetNatCode = cCode || pendingNtCode(state) || state.player.countryId;
    if (state.session && state.session.pendingEffects) {
      state.session.pendingEffects = state.session.pendingEffects.filter((x) => x.type !== 'nt-callup');
    }
    state.ntCalledUp = false;
    state.ntStatus = 'rejected_perm';
    state.ntDeclinedThisYear = true;
    state.ntRejectedPerm = state.ntRejectedPerm || {};
    state.ntRejectedPerm[targetNatCode] = true;
    const nat = countryById(targetNatCode);
    const T = (k, p) => root.I18n ? root.I18n.T(k, p) : k;
    logStatNote(state, T('note.ntRejectedPerm', { country: countryName(nat) }));
  }

  function naturalizeAndSwitchNt(state, hostCountryId) {
    if (!hostCountryId) return;
    const newNat = countryById(hostCountryId);
    state.player.countryId = hostCountryId;
    state.ntCalledUp = true;
    if (state.session && state.session.pendingEffects) {
      state.session.pendingEffects = state.session.pendingEffects.filter((x) => x.type !== 'nt-callup');
    }
    const T = (k, p) => root.I18n ? root.I18n.T(k, p) : k;
    logStatNote(state, T('note.ntSwitched', { country: countryName(newNat) }));
  }

  function getLegendForPlayer(state, decisionId) {
    if (root.EngineLegends && root.EngineLegends.getLegendForPlayer) {
      return root.EngineLegends.getLegendForPlayer(state, decisionId);
    }
    const p = state.player;
    if (!p) return null;
    const natCode = state.ntCountryId || p.countryId;
    const natList = DATA.NAT_LEGENDS ? DATA.NAT_LEGENDS[natCode] : null;
    const isGK = p.isGK;
    const isDef = ['CB', 'LB', 'RB'].includes(p.position);
    const isMid = ['CM', 'CAM', 'CDM', 'LM', 'RM'].includes(p.position);
    const targetPos = isGK ? 'gk' : (isDef ? 'def' : (isMid ? 'mid' : 'st'));

    if (natList && natList.length) {
      const match = natList.find((l) => l.pos === targetPos);
      if (match) return match;
      return natList[0];
    }

    const generic = {
      gk: { name: 'Oliver Kahn', pos: 'gk', title: 'Der Titan' },
      def: { name: 'Franco Baresi', pos: 'def', title: 'Il Capitano' },
      mid: { name: 'Andrea Pirlo', pos: 'mid', title: 'Il Maestro' },
      st: { name: 'Marco van Basten', pos: 'st', title: 'The Swan of Utrecht' }
    };
    return generic[targetPos] || generic.st;
  }

  const NationalTeam = {
    pendingNtCode,
    acceptNtCallUp,
    declineNtCallUpTemp,
    declineNtCallUp: declineNtCallUpTemp,
    rejectNtCallUpPerm,
    naturalizeAndSwitchNt,
    getLegendForPlayer,
  };

  root.DomainNationalTeam = NationalTeam;
  if (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = NationalTeam;
})(typeof window !== 'undefined' ? window : globalThis);
