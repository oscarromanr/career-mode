/* ============================================================
   CAREER MODE '26 - domain: contracts
   Contract lengths, loans, expiry, academy and club transitions.
   ============================================================ */
(function (root) {
  'use strict';

  const Model = (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports)
    ? require('./model.js')
    : root.DomainModel;
  const Player = (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports)
    ? require('./player.js')
    : root.DomainPlayer;
  const Rng = (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports)
    ? require('./rng.js')
    : root.DomainRng;
  const Decisions = (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports)
    ? require('./decisions.js')
    : root.DomainDecisions;

  const { ALL_CLUBS, clubByCid, fmtValue } = Model;
  const { recompute } = Player;
  const { ri } = Rng;
  const { logStatNote } = Decisions;

  const T = (key, params) => root.I18n ? root.I18n.T(key, params) : key;

  function calcContractLength(age) {
    if (age <= 21) return ri(3, 5);
    if (age <= 31) return ri(3, 5);
    if (age <= 35) return ri(2, 3);
    return ri(1, 2);
  }

  function setAcademy(state, clubCid) {
    let club = clubCid ? clubByCid(clubCid) : null;
    if (!club) {
      // Lazy access avoids a load-order cycle with career.js.
      const career = root.DomainCareer || (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports ? require('./career.js') : null);
      const opts = career ? career.academyOptions(state) : null;
      club = opts && opts[0] ? opts[0].club : ALL_CLUBS[0];
    }
    state.club = { cid: club.cid, loan: false, parentCid: null };
    const len = calcContractLength(state.player.age);
    state.contract = { yearsLeft: len, totalYears: len, annualSalary: state.player.salary, isLoan: false };
    const stint = state.clubStints[club.cid] || (state.clubStints[club.cid] = {
      cid: club.cid, seasons: 0, apps: 0, goals: 0, assists: 0, saves: 0, conceded: 0, cleanSheets: 0,
      firstYear: state.season, lastYear: state.season, trophies: [], salaries: [],
    });
    stint.salaries = stint.salaries || [];
    stint.salaries.push(state.player.salary);
    recompute(state);
  }

  function applyClubOffer(state, offer) {
    const p = state.player;
    state.clubLoyalty = state.clubLoyalty || {};
    const oldCid = state.club ? state.club.cid : null;

    if (offer.type === 'return') {
      state.loanSeasons = 0;
      state.requestedLoanPermanentMove = false;
      state.club = { cid: offer.club.cid, loan: false, parentCid: null };
      if (state.isFreeAgent || !state.contract || state.contract.yearsLeft === 0) {
        state.isFreeAgent = false;
        const len = offer.contractYears || calcContractLength(p.age);
        state.contract = { yearsLeft: len, totalYears: len, annualSalary: p.salary, isLoan: false };
      }
      if (offer.club.cid && state.clubLoyalty[offer.club.cid]) {
        state.clubLoyalty[offer.club.cid] = Math.max(10, state.clubLoyalty[offer.club.cid] - 5);
      }
      logStatNote(state, T('note.returned', { club: offer.club.n }));
    } else if (offer.type === 'loan') {
      const parentCid = (state.club && state.club.loan && state.club.parentCid) ? state.club.parentCid : state.club.cid;
      if (state.club && state.club.cid === offer.club.cid) {
        state.loanSeasons = (state.loanSeasons || 0) + 1;
      } else {
        state.loanSeasons = 1;
      }
      if (parentCid && state.clubLoyalty[parentCid]) {
        state.clubLoyalty[parentCid] = Math.max(10, state.clubLoyalty[parentCid] - 5);
      }
      state.club = { cid: offer.club.cid, loan: true, parentCid };
      state.contract = { yearsLeft: 1, totalYears: 1, annualSalary: p.salary, isLoan: true };
      state.clubSituation = 'stable';
      logStatNote(state, T('note.loanMove', { club: offer.club.n }));
    } else if (offer.type === 'transfer' || offer.type === 'stay') {
      state.loanSeasons = 0;
      state.requestedLoanPermanentMove = false;
      state.isFreeAgent = false;

      if (offer.type === 'transfer' && oldCid && oldCid !== offer.club.cid) {
        if (state.clubLoyalty[oldCid]) {
          state.clubLoyalty[oldCid] = Math.max(10, state.clubLoyalty[oldCid] - 20);
        }
        if (state.clubLoyalty[offer.club.cid] === undefined) {
          state.clubLoyalty[offer.club.cid] = 20;
        }
      }

      state.club = { cid: offer.club.cid, loan: false, parentCid: null };
      if (offer.type === 'transfer' || !state.contract || state.contract.yearsLeft === 0) {
        const len = offer.contractYears || calcContractLength(p.age);
        state.contract = { yearsLeft: len, totalYears: len, annualSalary: p.salary, isLoan: false };
      }
      if (offer.type === 'transfer') {
        state.clubSituation = 'stable';
      }
      logStatNote(state, T('note.signedFor', { club: offer.club.n }));

      if (offer.type === 'transfer' && offer.fee) {
        const commPct = (state.transferCommissionPct !== undefined ? state.transferCommissionPct : 5) / 100;
        const bonus = Math.round(offer.fee * commPct);
        if (bonus > 0) {
          state.earnings += bonus;
          logStatNote(state, T('note.transferCut', { amount: fmtValue(bonus), pct: Math.round(commPct * 100) }));
        }
      }
    }
    recompute(state);
  }

  const Contracts = {
    calcContractLength,
    setAcademy,
    applyClubOffer,
  };

  root.DomainContracts = Contracts;
  if (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = Contracts;
})(typeof window !== 'undefined' ? window : globalThis);
