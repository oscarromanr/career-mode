/* ============================================================
   CAREER MODE '26 — Engine Legends Sub-Module
   Position-matched legend icon selection and mentorship
   ============================================================ */
(function (root) {
  'use strict';

  function getLegendForPlayer(state, decisionId) {
    const DATA = root.GAME_DATA;
    if (!DATA || !DATA.NAT_LEGENDS) {
      return { name: 'Hugo Sánchez', pos: 'st', title: 'Pentapichi' };
    }
    const p = state.player;
    const natCode = p.countryId;
    const isGK = p.isGK;
    const isDef = ['CB', 'LB', 'RB'].includes(p.position);
    const isMid = ['CM', 'CAM', 'CDM', 'LM', 'RM'].includes(p.position);
    const targetPos = isGK ? 'gk' : (isDef ? 'def' : (isMid ? 'mid' : 'st'));

    const isNatDecision = decisionId === 'national-legend-call' || decisionId === 'legend-mentor-session';

    // 1. If National Team decision OR not attached to club, check National Team Legends first
    if (isNatDecision || !state.club) {
      const natList = DATA.NAT_LEGENDS[natCode];
      if (natList && natList.length) {
        const match = natList.find((l) => l.pos === targetPos);
        if (match) return match;
        return natList[0];
      }
    }

    // 2. Check Club Legends first for Club decisions
    if (state.club && root.Engine && root.Engine.clubByCid) {
      const clubObj = root.Engine.clubByCid(state.club.cid);
      if (clubObj && DATA.CLUB_LEGENDS && DATA.CLUB_LEGENDS[clubObj.n]) {
        const clubList = DATA.CLUB_LEGENDS[clubObj.n];
        const match = clubList.find((l) => l.pos === targetPos);
        if (match) return match;
        if (clubList.length) return clubList[0];
      }
    }

    // 3. Fallback to National Team Legends
    const natList = DATA.NAT_LEGENDS[natCode];
    if (natList && natList.length) {
      const match = natList.find((l) => l.pos === targetPos);
      if (match) return match;
      return natList[0];
    }

    // 4. Position-matched generic legend fallback
    const generic = {
      gk: { name: 'Oliver Kahn', pos: 'gk', title: 'Der Titan' },
      def: { name: 'Franco Baresi', pos: 'def', title: 'Il Capitano' },
      mid: { name: 'Andrea Pirlo', pos: 'mid', title: 'Il Maestro' },
      st: { name: 'Marco van Basten', pos: 'st', title: 'The Swan of Utrecht' }
    };
    return generic[targetPos] || generic.st;
  }

  root.EngineLegends = {
    getLegendForPlayer: getLegendForPlayer,
  };
})(typeof window !== 'undefined' ? window : globalThis);
