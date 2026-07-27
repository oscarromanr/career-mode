/* ============================================================
   CAREER MODE '26 — Engine Legends Sub-Module
   Position-matched living legend icon selection and mentorship
   ============================================================ */
(function (root) {
  'use strict';

  function getLegendForPlayer(state, decisionId) {
    const DATA = root.GAME_DATA;
    const p = state.player;
    if (!p) return null;

    const isGK = p.isGK;
    const isDef = ['CB', 'LB', 'RB'].includes(p.position);
    const isMid = ['CM', 'CAM', 'CDM', 'LM', 'RM'].includes(p.position);
    const targetPos = isGK ? 'gk' : (isDef ? 'def' : (isMid ? 'mid' : 'st'));

    const isNatDecision = decisionId === 'national-legend-call' || decisionId === 'legend-mentor-session';
    const ntCode = state.ntCountryId || p.countryId;

    // 1. National Team Decision -> Use Real Living Legends of represented National Team
    if (isNatDecision && DATA && DATA.NAT_LEGENDS) {
      const natList = DATA.NAT_LEGENDS[ntCode] || DATA.NAT_LEGENDS[p.countryId] || DATA.NAT_LEGENDS['MX'];
      if (natList && natList.length) {
        const match = natList.find((l) => l.pos === targetPos) || natList[0];
        return {
          name: match.name,
          pos: match.pos,
          title: `${match.title} • Selección Nacional`,
          isNat: true
        };
      }
    }

    // 2. Club Decision -> ALWAYS pull directly from DATA.CLUB_LEGENDS for that EXACT club!
    if (!isNatDecision && state.club && root.Engine && root.Engine.clubByCid) {
      const clubObj = root.Engine.clubByCid(state.club.cid);
      if (clubObj && DATA && DATA.CLUB_LEGENDS) {
        const clubName = clubObj.n;
        let clubList = DATA.CLUB_LEGENDS[clubName];
        if (!clubList) {
          const key = Object.keys(DATA.CLUB_LEGENDS).find((k) =>
            clubName.toLowerCase() === k.toLowerCase()
          );
          if (key) clubList = DATA.CLUB_LEGENDS[key];
        }
        if (clubList && clubList.length) {
          const match = clubList.find((l) => l.pos === targetPos) || clubList[0];
          return {
            name: match.name,
            pos: match.pos,
            title: match.title,
            isNat: false
          };
        }
      }
    }

    // 3. Fallback (Free Agent / Unattached) -> Living National Legend
    if (DATA && DATA.NAT_LEGENDS) {
      const natList = DATA.NAT_LEGENDS[ntCode] || DATA.NAT_LEGENDS[p.countryId] || DATA.NAT_LEGENDS['MX'];
      if (natList && natList.length) {
        const match = natList.find((l) => l.pos === targetPos) || natList[0];
        return {
          name: match.name,
          pos: match.pos,
          title: `${match.title} • Selección Nacional`,
          isNat: true
        };
      }
    }

    return { name: 'Hugo Sánchez', pos: targetPos, title: 'Pentapichi • Selección Nacional', isNat: true };
  }

  root.EngineLegends = {
    getLegendForPlayer: getLegendForPlayer,
  };
})(typeof window !== 'undefined' ? window : globalThis);
