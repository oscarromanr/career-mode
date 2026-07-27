/* ============================================================
   CAREER MODE '26 — Engine Legends Sub-Module
   Position-matched legend icon selection and mentorship
   ============================================================ */
(function (root) {
  'use strict';

  function getLegendForPlayer(state, decisionId) {
    const DATA = root.GAME_DATA;
    const p = state.player;
    const natCode = p ? p.countryId : 'AR';
    const isGK = p ? p.isGK : false;
    const isDef = p && ['CB', 'LB', 'RB'].includes(p.position);
    const isMid = p && ['CM', 'CAM', 'CDM', 'LM', 'RM'].includes(p.position);
    const targetPos = isGK ? 'gk' : (isDef ? 'def' : (isMid ? 'mid' : 'st'));

    const isNatDecision = decisionId === 'national-legend-call';
    const currentLang = (root.I18n && root.I18n.getLang) ? root.I18n.getLang() : 'es';

    const posTitleMap = {
      es: {
        gk: { name: 'Gran Guardameta', title: 'Muro del Club' },
        def: { name: 'Capitán Emblemático', title: 'Gran Muralla Defensiva' },
        mid: { name: 'Maestro del Mediocampo', title: 'Cerebro y Referente' },
        st: { name: 'Goleador Histórico', title: 'Ídolo de la Hinchada' }
      },
      en: {
        gk: { name: 'Emblematic Keeper', title: 'Wall of the Club' },
        def: { name: 'Legendary Captain', title: 'Defensive Anchor' },
        mid: { name: 'Midfield Maestro', title: 'Tactical Leader' },
        st: { name: 'All-Time Top Scorer', title: 'Fan Favorite' }
      }
    };
    const tMap = posTitleMap[currentLang] || posTitleMap.es;
    const posMeta = tMap[targetPos] || tMap.st;

    // 1. National Team Decision -> use National Team Legends of the player's nation
    if (isNatDecision && DATA && DATA.NAT_LEGENDS) {
      const natList = DATA.NAT_LEGENDS[natCode];
      if (natList && natList.length) {
        const match = natList.find((l) => l.pos === targetPos);
        if (match) return match;
        return natList[0];
      }
      const natObj = root.Engine && root.Engine.countryById ? root.Engine.countryById(natCode) : null;
      const natName = natObj ? (root.Engine.countryName ? root.Engine.countryName(natObj) : (natObj.name || natCode)) : 'Selección';
      return {
        name: currentLang === 'en' ? `${natName} Icon (${posMeta.name})` : `Ídolo de ${natName}`,
        pos: targetPos,
        title: posMeta.title
      };
    }

    // 2. Club Decision (Default) -> ALWAYS use Club Legends / Star Players for the player's active club!
    if (state.club && root.Engine && root.Engine.clubByCid) {
      const clubObj = root.Engine.clubByCid(state.club.cid);
      if (clubObj) {
        if (DATA && DATA.CLUB_LEGENDS) {
          // Direct lookup or alias match
          const clubName = clubObj.n;
          let clubList = DATA.CLUB_LEGENDS[clubName];
          if (!clubList) {
            // Case-insensitive / substring match (e.g. 'Chivas' vs 'CD Guadalajara')
            const key = Object.keys(DATA.CLUB_LEGENDS).find((k) =>
              clubName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(clubName.toLowerCase())
            );
            if (key) clubList = DATA.CLUB_LEGENDS[key];
          }
          if (clubList && clubList.length) {
            const match = clubList.find((l) => l.pos === targetPos);
            if (match) return match;
            return clubList[0];
          }
        }

        // Synthesize authentic club legend for ANY of the 712+ clubs
        return {
          name: currentLang === 'en' ? `${clubObj.n} Legend (${posMeta.name})` : `Leyenda de ${clubObj.n}`,
          pos: targetPos,
          title: posMeta.title
        };
      }
    }

    // 3. Unattached / Free Agent fallback -> Check National Team legends or synthesize national icon
    if (DATA && DATA.NAT_LEGENDS && DATA.NAT_LEGENDS[natCode]) {
      const natList = DATA.NAT_LEGENDS[natCode];
      const match = natList.find((l) => l.pos === targetPos);
      if (match) return match;
      return natList[0];
    }

    const natObj = root.Engine && root.Engine.countryById ? root.Engine.countryById(natCode) : null;
    const natName = natObj ? (root.Engine.countryName ? root.Engine.countryName(natObj) : (natObj.name || '')) : '';
    return {
      name: currentLang === 'en' ? `Legendary Mentor (${posMeta.name})` : `Leyenda de ${natName || 'la Selección'}`,
      pos: targetPos,
      title: posMeta.title
    };
  }

  root.EngineLegends = {
    getLegendForPlayer: getLegendForPlayer,
  };
})(typeof window !== 'undefined' ? window : globalThis);
