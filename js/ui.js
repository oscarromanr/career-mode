/* ============================================================
   CAREER MODE '26 — UI rendering (Apple-style dark theme)
   Fully i18n'd via I18n.T() / I18n.TData()
   ============================================================ */
(function (root) {
  'use strict';

  const D = () => root.GAME_DATA;
  const E = () => root.Engine;
  const T = (key, params) => root.I18n ? root.I18n.T(key, params) : key;
  const TD = (type, item, field) => root.I18n && root.I18n.TD ? root.I18n.TD(type, item, field) : (field && typeof field === 'string' && field.includes('.') ? field.split('.').reduce((o,k) => o&&o[k], item) : (item && field ? item[field] : ''));

  function h(tag, cls, html) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (html !== undefined && html !== null) el.innerHTML = html;
    return el;
  }
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function tierLabel(tier) { return T('tier.' + tier); }

  // ---- badge with monogram fallback ----
  function badgeEl(club, size) {
    const wrap = h('span', 'club-badge');
    wrap.style.width = wrap.style.height = (size || 28) + 'px';
    const mono = GameAPI.monogramColors(club.n);
    wrap.innerHTML = `<span class="badge-mono" style="background:${mono.bg};color:${mono.fg}">${esc(GameAPI.monogramInitials(club.n))}</span>`;
    GameAPI.getBadge(club).then((url) => {
      if (!url) return;
      const img = new Image();
      img.className = 'badge-img';
      img.alt = esc(club.n);
      img.onload = () => { wrap.innerHTML = ''; wrap.appendChild(img); };
      img.src = url;
    });
    return wrap;
  }

  function flagEl(code, w) {
    const img = h('img', 'flag');
    img.src = GameAPI.flagUrl(code, w || 40);
    img.alt = code;
    img.loading = 'lazy';
    return img;
  }

  function statChips(changes) {
    if (!changes || !changes.length) return '';
    const html = changes.map((c) => {
      if (c.k === 'INJ') return `<span class="chip chip-inj">${T('chip.injured')}</span>`;
      if (c.k === 'SHIELD') return `<span class="chip chip-shield">${T('chip.shield')}</span>`;
      if (c.k === 'SUPER') return `<span class="chip chip-hype">${T('chip.superAgent')}</span>`;
      if (c.k === 'HYPE') return `<span class="chip chip-hype">${c.d > 0 ? '+' : ''}${c.d} HYPE</span>`;
      if (c.k === 'STA') return `<span class="chip ${c.d > 0 ? 'chip-sta' : 'chip-down'}">${c.d > 0 ? '+' : ''}${c.d} STA</span>`;
      if (c.k === 'MOR') return `<span class="chip ${c.d > 0 ? 'chip-mor' : 'chip-down'}">${c.d > 0 ? '+' : ''}${c.d} MOR</span>`;
      return `<span class="chip ${c.d > 0 ? 'chip-up' : 'chip-down'}">${c.d > 0 ? '+' : ''}${c.d} ${c.k}</span>`;
    }).join('');
    return `<div class="stat-chips">${html}</div>`;
  }

  // ---- Language toggle button factory ----
  function langToggle(rerender) {
    const btn = h('button', 'lang-toggle', I18n.getLang() === 'en' ? '🌐 ES' : '🌐 EN');
    btn.type = 'button';
    btn.onclick = (e) => {
      e.stopPropagation();
      I18n.setLang(I18n.getLang() === 'en' ? 'es' : 'en');
      rerender();
    };
    return btn;
  }

  /* ================= SETUP SCREEN ================= */
  function renderSetup(rootEl, opts) {
    const data = D();
    rootEl.innerHTML = '';
    const wrap = h('div', 'setup-wrap');

    const hero = h('div', 'setup-hero');
    hero.innerHTML = `
      <h1 class="hero-title">${T('setup.heroTitle')}</h1>
      <p class="hero-sub">${T('setup.heroSub')}</p>`;
    // Language toggle in hero
    hero.appendChild(langToggle(() => renderSetup(rootEl, opts)));
    wrap.appendChild(hero);

    const grid = h('div', 'setup-grid');

    // LEFT PANEL: Name, Shirt #, Position Pitch
    const leftCol = h('div', 'setup-col glass');
    const row1 = h('div', 'setup-row');
    row1.innerHTML = `
      <label class="field grow"><span>${T('setup.playerName')}</span>
        <input id="inp-name" type="text" maxlength="24" placeholder="${T('setup.namePlaceholder')}" autocomplete="off">
      </label>
      <label class="field num"><span>${T('setup.shirtNo')}</span>
        <input id="inp-number" type="number" min="1" max="99" value="10">
      </label>`;
    leftCol.appendChild(row1);

    const PITCH_COORDS = {
      GK: [50, 90], LB: [13, 71], CB: [50, 75], RB: [87, 71],
      LM: [13, 49], CM: [50, 51], RM: [87, 49],
      CAM: [50, 37], LW: [17, 23], RW: [83, 23], ST: [50, 13],
    };
    const posWrap = h('div', 'field');
    posWrap.innerHTML = `<span>${T('setup.position')} <em class="field-note">${T('setup.posTap')}</em></span>`;
    const pitch = h('div', 'pitch');
    pitch.innerHTML = `
      <div class="pitch-line halfway"></div>
      <div class="pitch-circle"></div>
      <div class="pitch-box top"></div>
      <div class="pitch-box bottom"></div>
      <div class="pitch-6 top"></div>
      <div class="pitch-6 bottom"></div>`;
    data.POSITIONS.forEach((p) => {
      const [x, y] = PITCH_COORDS[p.id];
      const b = h('button', 'pitch-pos' + (p.gk ? ' gk' : ''), `<b>${p.id}</b>`);
      b.type = 'button';
      b.dataset.pos = p.id;
      b.title = T('pos.' + p.id);
      b.style.left = x + '%';
      b.style.top = y + '%';
      pitch.appendChild(b);
    });
    const posLabel = h('div', 'pitch-label', T('setup.posSelect'));
    posWrap.appendChild(pitch);
    posWrap.appendChild(posLabel);
    leftCol.appendChild(posWrap);
    grid.appendChild(leftCol);

    // RIGHT PANEL: Nationality search & grid, Action buttons
    const rightCol = h('div', 'setup-col glass');
    const cWrap = h('div', 'field country-field');
    cWrap.innerHTML = `<span>${T('setup.nationality')}</span>`;
    const search = h('input', 'country-search');
    search.type = 'text'; search.placeholder = T('setup.searchCountry');
    const cGrid = h('div', 'country-grid');
    data.COUNTRIES.forEach((c) => {
      const b = h('button', 'country-btn');
      b.type = 'button';
      b.dataset.country = c.id;
      b.dataset.name = c.name.toLowerCase();
      const f = flagEl(c.code, 80);
      b.appendChild(f);
      b.appendChild(h('i', '', esc(E().countryName(c))));
      b.appendChild(h('em', '', `#${c.rank}`));
      cGrid.appendChild(b);
    });
    cWrap.appendChild(search);
    cWrap.appendChild(cGrid);
    rightCol.appendChild(cWrap);

    const actions = h('div', 'setup-actions');
    const start = h('button', 'start-btn', T('setup.startCareer'));
    start.disabled = true;
    actions.appendChild(start);

    if (opts.hasSave) {
      const cont = h('button', 'continue-btn', T('setup.continue'));
      cont.type = 'button';
      cont.onclick = () => opts.onContinue();
      actions.appendChild(cont);
    }

    const importLabel = h('label', 'continue-btn import-btn', T('setup.import'));
    const importInput = h('input', 'hidden-input');
    importInput.type = 'file';
    importInput.accept = '.json,application/json';
    importInput.addEventListener('change', () => {
      const f = importInput.files && importInput.files[0];
      if (f) opts.onImport(f);
    });
    importLabel.appendChild(importInput);
    actions.appendChild(importLabel);

    rightCol.appendChild(actions);
    grid.appendChild(rightCol);

    wrap.appendChild(grid);
    rootEl.appendChild(wrap);

    // state
    const sel = { pos: null, country: null };
    const validate = () => { start.disabled = !(sel.pos && sel.country); };

    pitch.addEventListener('click', (ev) => {
      const b = ev.target.closest('.pitch-pos'); if (!b) return;
      pitch.querySelectorAll('.pitch-pos').forEach((x) => x.classList.remove('sel'));
      b.classList.add('sel');
      sel.pos = b.dataset.pos;
      const def = data.POSITIONS.find((x) => x.id === sel.pos);
      posLabel.textContent = `${def.id} — ${T('pos.' + def.id)}${def.gk ? T('setup.gkNote') : ''}`;
      posLabel.classList.add('sel');
      validate();
    });
    cGrid.addEventListener('click', (ev) => {
      const b = ev.target.closest('.country-btn'); if (!b) return;
      cGrid.querySelectorAll('.country-btn').forEach((x) => x.classList.remove('sel'));
      b.classList.add('sel'); sel.country = b.dataset.country; validate();
    });
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      cGrid.querySelectorAll('.country-btn').forEach((b) => {
        b.style.display = b.dataset.name.includes(q) ? '' : 'none';
      });
    });
    start.addEventListener('click', () => {
      const name = document.getElementById('inp-name').value;
      const number = document.getElementById('inp-number').value;
      opts.onStart({ name, number, position: sel.pos, countryId: sel.country });
    });
  }

  /* ================= PLAYER CARD ================= */
  function playerCard(state) {
    const p = state.player;
    const club = state.club ? E().clubByCid(state.club.cid) : null;
    const nat = E().countryById(p.countryId);
    const stats = p.isGK ? D().GK_STATS : D().FIELD_STATS;
    const card = h('div', `pcard tier-${p.tier}`);

    const top = h('div', 'pcard-top');
    top.innerHTML = `<div class="pcard-ovr"><span class="ovr-num">${p.ovr}</span><span class="ovr-pos">${p.position}</span></div>`;
    const flagBox = h('div', 'pcard-flag');
    flagBox.appendChild(flagEl(nat.code, 80));
    flagBox.appendChild(h('em', '', esc(E().countryName(nat))));

    // Collect ALL nationalities (Initial Birth Country + Earned Nationalities)
    const allNats = [p.initialCountryId || p.countryId, ...(p.earnedNationalities || [])].filter((c, i, a) => a.indexOf(c) === i);
    const otherNatIds = allNats.filter((cId) => cId !== p.countryId);

    if (otherNatIds.length > 0) {
      const miniFlagsRow = h('div', 'mini-flags-row');
      miniFlagsRow.title = T('nat.multipleNationalitiesTitle') || 'Multiple Nationalities';
      otherNatIds.forEach((cId) => {
        const eNat = E().countryById(cId);
        if (eNat) {
          const miniF = flagEl(eNat.code, 20);
          miniF.title = E().countryName(eNat);
          miniFlagsRow.appendChild(miniF);
        }
      });
      if (miniFlagsRow.children.length > 0) flagBox.appendChild(miniFlagsRow);
    }

    top.appendChild(flagBox);
    card.appendChild(top);

    card.appendChild(h('div', 'pcard-tier-label', tierLabel(p.tier)));

    const av = h('div', 'pcard-avatar');
    av.innerHTML = `
      <svg viewBox="0 0 100 110" class="silhouette" aria-hidden="true">
        <circle cx="50" cy="26" r="16"/>
        <path d="M50 44 C 30 44 20 58 18 78 L 30 80 L 33 66 L 33 108 L 45 108 L 47 82 L 53 82 L 55 108 L 67 108 L 67 66 L 70 80 L 82 78 C 80 58 70 44 50 44 Z"/>
      </svg>
      <span class="pcard-number">${p.number}</span>`;
    card.appendChild(av);

    card.appendChild(h('div', 'pcard-name', esc(p.name)));

    const clubRow = h('div', 'pcard-club');
    if (club) {
      clubRow.appendChild(badgeEl(club, 22));
      clubRow.appendChild(h('span', 'pcard-club-name', `${esc(club.n)} <em>${esc(club.league)}</em>`));
    } else {
      clubRow.appendChild(h('span', 'pcard-club-name', `<em>${T('card.unattached')}</em>`));
    }
    card.appendChild(clubRow);

    card.appendChild(h('div', 'pcard-value', `<b>${E().fmtValue(p.value)}</b><span>${T('card.marketValue')}</span>`));

    const sg = h('div', 'pcard-stats');
    stats.forEach((s) => {
      const v = p.stats[s.k];
      const row = h('div', 'pstat');
      row.innerHTML = `<span class="pstat-name">${T('stat.' + s.k)}</span>
        <span class="pstat-bar"><i style="width:${v}%"></i></span>
        <span class="pstat-val">${v}</span>`;
      sg.appendChild(row);
    });
    card.appendChild(sg);

    // Condition bars: stamina, morale, loyalty, hype & reputation
    const cond = h('div', 'pcard-cond');
    [
      [T('card.stamina'), p.stamina, 'sta', 100],
      [T('card.morale'), p.morale, 'mor', 100],
      [T('card.loyalty'), p.loyalty || 20, 'loyalty', 100],
      [T('card.hype'), p.hype || 0, 'hype', 100],
      [T('card.reputation') || 'Reputation', p.reputation || 0, 'rep', 100]
    ].forEach(([label, v, cls, maxVal]) => {
      const pct = Math.min(100, Math.round((v / maxVal) * 100));
      const row = h('div', 'cond-row');
      row.innerHTML = `<span class="cond-name">${label}</span>
        <span class="cond-bar"><i class="${cls}" style="width:${pct}%"></i></span>
        <span class="cond-val">${v}</span>`;
      cond.appendChild(row);
    });
    if (state.superAgent) {
      cond.appendChild(h('div', 'pcard-sa-badge', T('card.superAgent')));
    }
    card.appendChild(cond);

    const caps = state.totals.caps;
    card.appendChild(h('div', 'pcard-meta',
      `<span>${T('card.age')} <b>${p.age}</b></span><span>${T('card.season')} <b>${state.season}</b></span>` +
      (caps ? `<span>${T('card.caps')} <b>${caps}</b></span>` : '')));
    return card;
  }

  /* ================= BANK & AGENT CARD ================= */
  /* ================= BANK & AGENT CARD ================= */
  function financeBar(salary, expenses) {
    const wrap = h('div', 'finance-bar-wrap');
    const salVal = Math.max(0, salary || 0);
    const expVal = Math.max(0, expenses || 0);

    const perYearStr = T('card.perYear') || '/yr';
    const feeLabel = T('agent.agentFeeLabel') || T('agent.fee') || 'Agent Fee';
    const feeStr = expVal > 0 ? `${feeLabel}: -${E().fmtValue(expVal)}${perYearStr}` : (T('agent.noFee') || 'No Expenses');

    const baseVal = Math.max(1, salVal, expVal);
    const expPct = Math.min(100, Math.round((expVal / baseVal) * 100));
    const netSalPct = Math.max(0, 100 - expPct);

    wrap.innerHTML = `
      <div class="finance-bar-labels">
        <span class="sal">${T('agent.salary')}: ${E().fmtValue(salVal)}${perYearStr}</span>
        <span class="exp">${feeStr}</span>
      </div>
      <div class="fin-bar-track">
        <i class="fin-bar-sal" style="width:${netSalPct}%"></i>
        ${expVal > 0 ? `<i class="fin-bar-exp" style="width:${expPct}%"></i>` : ''}
      </div>`;
    return wrap;
  }

  function bankBar(savings, shopSpent) {
    const wrap = h('div', 'finance-bar-wrap bank-bar-wrap');
    const savVal = Math.max(0, savings || 0);
    const shopVal = Math.max(0, shopSpent || 0);
    const baseVal = Math.max(1, savVal + shopVal);
    const shopPct = Math.min(100, Math.round((shopVal / baseVal) * 100));
    const savPct = Math.max(0, 100 - shopPct);

    wrap.innerHTML = `
      <div class="finance-bar-labels">
        <span class="sal" style="color:var(--cyan);">${T('agent.savingsLabel') || 'Total Savings'}: ${E().fmtValue(savVal)}</span>
        <span class="exp" style="color:var(--pink);">${shopVal > 0 ? `${T('agent.shopSpentLabel') || 'Shop Spent'}: -${E().fmtValue(shopVal)}` : ''}</span>
      </div>
      <div class="fin-bar-track">
        <i class="fin-bar-sav" style="width:${savPct}%;background:linear-gradient(90deg, #64d2ff, #30b0ff);"></i>
        ${shopVal > 0 ? `<i class="fin-bar-shop" style="width:${shopPct}%;background:#ff2d55;"></i>` : ''}
      </div>`;
    return wrap;
  }

  function agentStatsBars(agent) {
    const wrap = h('div', 'agent-stats-bars');
    const stats = [
      { key: 'patience', label: T('agent.patience') || 'Patience', val: agent.patience || 50, cls: 'patience' },
      { key: 'greed', label: T('agent.greed') || 'Greed', val: agent.greed || 50, cls: 'greed' },
      { key: 'negotiation', label: T('agent.negotiation') || 'Negotiation', val: agent.negotiation || 50, cls: 'negotiation' },
    ];

    wrap.innerHTML = stats.map((s) => `
      <div class="agent-stat-bar-row">
        <span class="agent-stat-bar-label">${esc(s.label)}</span>
        <div class="agent-stat-bar-track">
          <i class="agent-stat-bar-fill ${s.cls}" style="width:${s.val}%"></i>
        </div>
        <span class="agent-stat-bar-val">${s.val}</span>
      </div>`).join('');
    return wrap;
  }

  function agentCard(state, handlers) {
    const p = state.player;
    const agent = state.agent || E().DAD_AGENT;
    const card = h('div', 'agent-card glass');
    const title = h('div', 'agent-card-title', `💼 ${T('agent.title')}`);
    card.appendChild(title);

    const isFreeAgent = !!(state.isFreeAgent || !state.contract || state.contract.yearsLeft === 0);
    const isLoan = !isFreeAgent && !!(state.club && state.club.loan && state.club.parentCid);
    const parentClub = isLoan ? E().clubByCid(state.club.parentCid) : null;
    const curClub = (!isFreeAgent && state.club) ? E().clubByCid(state.club.cid) : null;
    const displayClub = parentClub || curClub;

    if (isFreeAgent) {
      const badgeWrap = h('div', 'agent-property-banner free-agent-banner');
      badgeWrap.appendChild(h('span', 'agent-prop-text', `🆓 ${T('agent.freeAgentTitle') || 'Free Agent / Unattached'}`));
      card.appendChild(badgeWrap);
    } else if (displayClub) {
      const propText = isLoan
        ? T('agent.propertyOf', { club: displayClub.n })
        : `${T('agent.currentClub') || 'Current Club'}: ${displayClub.n}`;
      const badgeWrap = h('div', 'agent-property-banner');
      badgeWrap.appendChild(badgeEl(displayClub, 26));
      badgeWrap.appendChild(h('span', 'agent-prop-text', esc(propText)));
      card.appendChild(badgeWrap);
    }

    const targetClub = state.targetClubCid ? E().clubByCid(state.targetClubCid) : null;
    const commPct = state.transferCommissionPct !== undefined ? state.transferCommissionPct : 5;

    const agentNameStr = (agent.id === 'dad' || agent.type === 'dad') ? T('agent.dadName') : agent.name;
    const contractYears = state.contract ? state.contract.yearsLeft : 3;
    const freeAgentLabel = T('agent.freeAgent');
    const seasonLabel = contractYears === 1 ? T('agent.season1') : T('agent.seasonsN');
    const contractStr = state.isFreeAgent || contractYears === 0 ? `📜 ${freeAgentLabel}` : `📜 ${contractYears} ${seasonLabel}`;

    const grid = h('div', 'agent-grid');
    grid.innerHTML = `
      <div class="agent-item">
        <span>${T('agent.name')}</span>
        <b>👤 ${esc(agentNameStr)}</b>
      </div>
      <div class="agent-item">
        <span>${T('agent.targetClub')}</span>
        <b>🎯 ${targetClub ? esc(targetClub.n) : T('agent.none')}</b>
      </div>
      <div class="agent-item">
        <span>${T('agent.contract')}</span>
        <b>${contractStr}</b>
      </div>`;
    card.appendChild(grid);

    const seasonShopSpent = (state.shopSpentSeason === state.season) ? (state.shopSpentThisSeason || 0) : 0;
    card.appendChild(financeBar(p.salary, agent.annualSalary || 0));
    card.appendChild(bankBar(state.earnings - state.spent, seasonShopSpent));

    const btn = h('button', 'agent-talk-btn primary-btn', T('agent.talkBtn'));
    btn.type = 'button';
    btn.onclick = () => showAgentModal(state, handlers);
    card.appendChild(btn);

    return card;
  }

  function showAgentModal(state, handlers) {
    const p = state.player;
    const agent = state.agent || E().DAD_AGENT;
    const c = h('div', 'agent-modal-content');
    const cooldowns = state.agentActionsThisSeason || {};
    const agentNameStr = (agent.id === 'dad' || agent.type === 'dad') ? T('agent.dadName') : agent.name;
    const agentTypeStr = (agent.id === 'dad' || agent.type === 'dad') ? T('agent.dadType') : T('agent.proType');

    c.innerHTML = `
      <h3>👤 ${esc(agentNameStr)}</h3>
      <p style="font-size:12px;color:var(--text-2);margin-bottom:12px;">${esc(agentTypeStr)}</p>`;

    c.appendChild(agentStatsBars(agent));

    const optsList = h('div', 'agent-menu');

    const btnTarget = h('button', 'agent-opt-btn', `<span>${T('agent.setTarget')}</span><i>➔</i>`);
    btnTarget.onclick = () => { m.close(); showTargetClubSearch(state, handlers); };
    optsList.appendChild(btnTarget);

    const commPct = state.transferCommissionPct !== undefined ? state.transferCommissionPct : 5;
    const commDisabled = cooldowns.commReq;
    const btnComm = h('button', `agent-opt-btn ${commDisabled ? 'disabled' : ''}`, `<span>${T('agent.negotiateComm')} (${commPct}%)</span><i>➔</i>`);
    if (commDisabled) btnComm.disabled = true;
    btnComm.onclick = () => {
      if (commDisabled) return;
      m.close();
      showCommissionSelector(state, handlers);
    };
    optsList.appendChild(btnComm);

    const reqDisabled = cooldowns.transferReq;
    const btnReq = h('button', `agent-opt-btn ${reqDisabled ? 'disabled' : ''}`, `<span>${T('agent.requestMove')}</span><i>➔</i>`);
    if (reqDisabled) btnReq.disabled = true;
    btnReq.onclick = () => {
      if (reqDisabled) return;
      m.close();
      handlers.onRequestTransfer();
    };
    optsList.appendChild(btnReq);

    const raiseDisabled = cooldowns.raiseReq;
    const btnRaise = h('button', `agent-opt-btn ${raiseDisabled ? 'disabled' : ''}`, `<span>${T('agent.demandRaise')}</span><i>➔</i>`);
    if (raiseDisabled) btnRaise.disabled = true;
    btnRaise.onclick = () => {
      if (raiseDisabled) return;
      m.close();
      handlers.onDemandRaise();
    };
    optsList.appendChild(btnRaise);

    const btnMarket = h('button', 'agent-opt-btn primary-btn', `<span>${T('agent.openMarket')}</span><i>➔</i>`);
    btnMarket.onclick = () => {
      m.close();
      showAgentMarketModal(state, handlers);
    };
    optsList.appendChild(btnMarket);

    c.appendChild(optsList);
    const m = modal(c);
  }

  function showAgentMarketModal(state, handlers) {
    const c = h('div', 'agent-market-content');
    c.innerHTML = `<h3>🛒 ${T('agent.marketTitle')}</h3><p style="font-size:13px;color:var(--text-2);margin-bottom:12px;">${T('agent.marketDesc')}</p>`;

    const marketList = h('div', 'agent-market-list');
    const market = state.agentMarket || E().rollAgentMarket(state);
    const currentAgent = state.agent || E().DAD_AGENT;
    const currentAgentName = (currentAgent.id === 'dad' || currentAgent.type === 'dad') ? T('agent.dadName') : currentAgent.name;

    market.forEach((candidate) => {
      const isActive = currentAgent.id === candidate.id;
      const card = h('div', `agent-candidate-card ${isActive ? 'active-agent' : ''}`);

      const candidateName = (candidate.id === 'dad' || candidate.type === 'dad') ? T('agent.dadName') : candidate.name;
      const buyoutReq = (currentAgent.type !== 'dad' && currentAgent.buyoutFee && !isActive) ? currentAgent.buyoutFee : 0;
      const perYearStr = T('card.perYear') || '/yr';
      const feeText = candidate.type === 'dad' ? T('agent.free') : `${E().fmtValue(candidate.annualSalary)}${perYearStr}`;

      card.innerHTML = `
        <div class="agent-candidate-head">
          <span class="agent-candidate-name">👤 ${esc(candidateName)}</span>
          <span class="chip ${isActive ? 'chip-sta' : ''}">${isActive ? T('agent.activeChip') : feeText}</span>
        </div>`;

      card.appendChild(agentStatsBars(candidate));

      const feesDiv = h('div', 'agent-candidate-fees', `
        <span>${T('agent.annualFee')}: <b>${candidate.annualSalary ? E().fmtValue(candidate.annualSalary) : '€0'}</b></span>
        <span>${T('agent.buyoutFee')}: <b>${candidate.buyoutFee ? E().fmtValue(candidate.buyoutFee) : '€0'}</b></span>`);
      card.appendChild(feesDiv);

      if (!isActive) {
        const btnLabel = buyoutReq > 0
          ? T('agent.fireAndHireBtn', { name: esc(currentAgentName), buyout: E().fmtValue(buyoutReq) })
          : T('agent.hireBtn');
        const hireBtn = h('button', 'primary-btn', btnLabel);
        hireBtn.onclick = () => {
          m.close();
          handlers.onHireAgent(candidate.id);
        };
        card.appendChild(hireBtn);
      }
      marketList.appendChild(card);
    });

    c.appendChild(marketList);
    const m = modal(c);
  }

  function showTargetClubSearch(state, handlers, opts) {
    const titleKey = (opts && opts.titleKey) ? opts.titleKey : 'agent.setTarget';
    const c = h('div', 'club-search-box');
    c.innerHTML = `<h3>${T(titleKey)}</h3>
      <input type="text" class="club-search-input" id="club-search-inp" placeholder="${T('agent.searchPlaceholder')}" autofocus>
      <div class="club-search-results" id="club-search-res"></div>`;

    const m = modal(c);
    const inp = c.querySelector('#club-search-inp');
    const resDiv = c.querySelector('#club-search-res');

    const renderResults = (query) => {
      resDiv.innerHTML = '';
      const q = (query || '').trim().toLowerCase();
      if (!q) {
        resDiv.innerHTML = `<div style="padding:10px;color:var(--text-3);font-size:12px;">${T('agent.searchPlaceholderClubs')}</div>`;
        return;
      }
      const matches = E().allClubs().filter((cl) => cl.n.toLowerCase().includes(q) || cl.league.toLowerCase().includes(q)).slice(0, 15);
      if (!matches.length) {
        resDiv.innerHTML = `<div style="padding:10px;color:var(--text-3);font-size:12px;">${T('agent.noClubsFound', { query: esc(query) })}</div>`;
        return;
      }
      matches.forEach((cl) => {
        const item = h('div', 'club-search-item');
        item.appendChild(badgeEl(cl, 28));
        item.appendChild(h('div', '', `<b>${esc(cl.n)}</b> <small style="color:var(--text-3);">${esc(cl.league)} (${cl.s})</small>`));
        item.onclick = () => {
          m.close();
          handlers.onSetTargetClub(cl.cid);
        };
        resDiv.appendChild(item);
      });
    };

    inp.addEventListener('input', () => renderResults(inp.value));
    renderResults('');
  }

  function showCommissionSelector(state, handlers) {
    const c = h('div', 'comm-selector');
    c.innerHTML = `<h3>${T('agent.negotiateComm')}</h3>
      <p style="font-size:13px;color:var(--text-2);margin-bottom:12px;">${T('agent.commDesc')}</p>
      <div style="display:flex;gap:10px;margin-bottom:14px;">
        <button class="primary-btn" data-pct="5">5% (${T('agent.commStd')})</button>
        <button class="primary-btn" data-pct="8">8% (${T('agent.commStar')})</button>
        <button class="primary-btn" data-pct="12">12% (${T('agent.commSuper')})</button>
      </div>`;
    const m = modal(c);
    c.querySelectorAll('button').forEach((b) => {
      b.onclick = () => {
        const pct = parseInt(b.dataset.pct, 10);
        m.close();
        handlers.onNegotiateCommission(pct);
      };
    });
  }

  /* ================= STAGE AREA ================= */
  function stageHeader(state, active, handlers) {
    const club = state.club ? E().clubByCid(state.club.cid) : null;
    const head = h('div', 'stage-head');
    const left = h('div', 'stage-title');
    left.innerHTML = `<div class="stage-season">${T('stage.season', { n: state.season })}</div>
      <div class="stage-sub">${T('stage.age', { n: state.player.age })}${club ? ' · ' + esc(club.n) : ''}</div>`;
    head.appendChild(left);
    const right = h('div', 'stage-right');
    const steps = h('div', 'stage-steps');
    ['decision', 'booster', 'club'].forEach((s) => {
      const cls = 'step' + (s === active ? ' active' : '') +
        (['decision', 'booster', 'club'].indexOf(s) < ['decision', 'booster', 'club'].indexOf(active) ? ' done' : '');
      steps.appendChild(h('span', cls, T('step.' + s)));
    });
    right.appendChild(steps);

    const actions = h('div', 'stage-actions');
    const shopped = state.shopSeason === state.season;
    const currentLang = I18n.getLang();
    const langBtnText = currentLang === 'en' ? '🌐 ES' : '🌐 EN';
    const langBtnTitle = currentLang === 'en' ? 'Cambiar a Español' : 'Switch to English';

    actions.innerHTML = `
      <button class="icon-btn lang-header-btn" data-action="lang" title="${langBtnTitle}">${langBtnText}</button>
      ${state.club ? `<button class="icon-btn" data-action="shop" title="${T('stage.shopTitle')}">${shopped ? '🛒' : '🛒<i class="dot"></i>'}</button>` : ''}
      <button class="icon-btn" data-action="menu" title="${T('stage.menuTitle')}">⚙</button>
      <div class="menu-pop hidden" id="game-menu">
        <button data-action="export">${T('menu.export')}</button>
        <button data-action="retire">${T('menu.retire')}</button>
        <button data-action="restart" class="menu-danger">${T('menu.restart')}</button>
      </div>`;

    if (handlers) {
      const shopBtn = actions.querySelector('[data-action="shop"]');
      if (shopBtn && handlers.onShop) {
        shopBtn.onclick = (e) => {
          e.stopPropagation();
          handlers.onShop();
        };
      }
      const langBtn = actions.querySelector('[data-action="lang"]');
      if (langBtn) {
        langBtn.onclick = (e) => {
          e.stopPropagation();
          I18n.setLang(currentLang === 'en' ? 'es' : 'en');
          if (handlers.onLanguageChange) handlers.onLanguageChange();
          else renderGame(state, handlers);
        };
      }
      const menuBtn = actions.querySelector('[data-action="menu"]');
      const menuPop = actions.querySelector('#game-menu');
      if (menuBtn && menuPop) {
        menuBtn.onclick = (e) => {
          e.stopPropagation();
          menuPop.classList.toggle('hidden');
        };
        const exportBtn = menuPop.querySelector('[data-action="export"]');
        if (exportBtn && handlers.onExport) exportBtn.onclick = (e) => { e.stopPropagation(); menuPop.classList.add('hidden'); handlers.onExport(); };
        const retireBtn = menuPop.querySelector('[data-action="retire"]');
        if (retireBtn && handlers.onRetire) retireBtn.onclick = (e) => { e.stopPropagation(); menuPop.classList.add('hidden'); handlers.onRetire(); };
        const restartBtn = menuPop.querySelector('[data-action="restart"]');
        if (restartBtn && handlers.onRestart) restartBtn.onclick = (e) => { e.stopPropagation(); menuPop.classList.add('hidden'); handlers.onRestart(); };
      }
    }

    right.appendChild(actions);
    head.appendChild(right);
    return head;
  }

  function clubCard(club, opts) {
    const card = h('button', 'pick-card club-pick');
    card.type = 'button';
    const topRow = h('div', 'club-pick-top');
    topRow.appendChild(badgeEl(club, 44));
    const countryStr = E().countryName(club.countryName || club.countryId || '');
    const nm = h('div', 'club-pick-name');
    nm.innerHTML = `<b>${esc(club.n)}</b><i>${esc(club.league)} · ${esc(countryStr)}</i>`;
    topRow.appendChild(nm);
    card.appendChild(topRow);

    const meter = h('div', 'strength');
    meter.innerHTML = `<span>${T('club.level')}</span><div class="strength-bar"><i style="width:${club.s}%"></i></div><b>${club.s}</b>`;
    card.appendChild(meter);

    const roleText = opts.roleKey ? T(opts.roleKey) : (opts.role ? T(opts.role) : '');
    const noteText = opts.isLoanBuyout ? (T('offerNote.loanBuyout') || 'PERMANENT BUYOUT OFFER — Sign permanently!') : (opts.noteKey ? T(opts.noteKey, opts.noteParams) : (opts.note ? T(opts.note, opts.noteParams) : ''));

    if (roleText) card.appendChild(h('div', 'pick-role', esc(roleText)));
    if (noteText) card.appendChild(h('div', 'pick-note', esc(noteText)));
    if (opts.fee) card.appendChild(h('div', 'pick-fee', `${T('club.fee')} <b>${E().fmtValue(opts.fee)}</b>`));

    let chipText = opts.chip;
    let chipCls = opts.chipCls || '';
    if (opts.isLoanBuyout) {
      chipText = T('offer.loanBuyout') || 'BUYOUT';
      chipCls = 'chip-academy';
    }
    if (chipText) {
      const footer = h('div', 'club-pick-footer');
      footer.appendChild(h('span', `type-chip ${chipCls}`, chipText));
      card.appendChild(footer);
    }
    return card;
  }

  function renderStage(rootEl, state, handlers) {
    rootEl.innerHTML = '';
    const stage = state.stage;

    if (stage === 'academy') {
      rootEl.appendChild(stageHeader(state, 'decision', handlers));
      const box = h('div', 'stage-body');
      box.appendChild(h('div', 'stage-intro',
        `<h2>${T('academy.title')}</h2><p>${T('academy.desc', { league: esc(E().countryById(state.player.countryId).league) })}</p>`));

      const customBtn = h('button', 'primary-btn custom-academy-btn', T('academy.searchCustom'));
      customBtn.style.margin = '0 auto 16px';
      customBtn.style.display = 'block';
      customBtn.onclick = () => {
        showTargetClubSearch(state, {
          onSetTargetClub: (cid) => handlers.onAcademy(cid)
        }, { titleKey: 'academy.searchTitle' });
      };
      box.appendChild(customBtn);

      const grid = h('div', 'pick-grid');
      state.currentAcademies.forEach((a) => {
        const card = clubCard(a.club, {
          role: a.role,
          roleKey: a.roleKey,
          note: a.note,
          noteKey: a.noteKey,
          chip: T('academy.chip'),
          chipCls: 'chip-academy'
        });
        card.onclick = () => handlers.onAcademy(a.cid);
        grid.appendChild(card);
      });
      box.appendChild(grid);
      rootEl.appendChild(box);
      return;
    }

    if (stage === 'decision') {
      rootEl.appendChild(stageHeader(state, 'decision', handlers));
      const box = h('div', 'stage-body');
      const d = state.currentDecision;
      if (!d) {
        box.appendChild(h('div', 'stage-intro', `<h2>${T('decision.quietTitle')}</h2><p>${T('decision.quietDesc')}</p>`));
        const btn = h('button', 'primary-btn', T('btn.continue'));
        btn.onclick = handlers.onDecisionSkip;
        box.appendChild(btn);
      } else {
        const kicker = d.kicker ? (TD('decision', d, 'kicker') || T(d.kicker)) : T('decision.kicker');
        const legend = (d.id.startsWith('legend-') || d.id === 'national-legend-call') && E().getLegendForPlayer ? E().getLegendForPlayer(state, d.id) : null;
        let legBadge = '';
        if (legend) {
          const icon = legend.isNat ? '🚩' : '⭐';
          const tVal = (state.lang === 'es' && legend.title_es) ? legend.title_es : legend.title;
          legBadge = `<div class="legend-icon-badge" style="margin-bottom:8px;font-size:12px;font-weight:800;color:#ffd60a;display:flex;align-items:center;gap:6px;">${icon} <span>${esc(legend.name)}</span> <i style="font-weight:400;opacity:0.85;">(${esc(tVal || legend.pos.toUpperCase())})</i></div>`;
        }
        box.appendChild(h('div', 'situation glass', `
          <div class="sit-kicker">${esc(kicker)}</div>
          ${legBadge}
          <h2>${esc(TD('decision', d, 'title') || T(d.title))}</h2>
          <p>${esc(TD('decision', d, 'desc') || T(d.desc))}</p>`));
        const optKeys = ['a', 'b', 'c'].filter((k) => d[k]);
        const grid = h('div', `pick-grid ${optKeys.length === 2 ? 'two' : ''}`);
        optKeys.forEach((k) => {
          const o = d[k];
          const card = h('button', `pick-card option-${k}`);
          card.type = 'button';
          let odds = '';
          if (o.fx && o.fx.risk) {
            odds = `<span class="odds-chip risk-5050">${T('decision.coinRoll', { pct: Math.round(o.fx.risk.p * 100) })}</span>`;
          } else if (o.mini) {
            const mType = o.mini.type === 'penalty' ? T('decision.penaltyKick') : o.mini.type === 'gk_penalty' ? T('decision.penaltySave') : T('decision.timingGame');
            odds = `<span class="odds-chip mini-badge">${mType}</span>`;
          }
          const labelText = TD('decision', d, k + '.label') || T(o.label);
          const subText = TD('decision', d, k + '.sub') || (o.sub ? T(o.sub) : '');
          card.innerHTML = `<div class="option-letter">${k.toUpperCase()}</div>
            <b>${esc(labelText)}</b><i>${esc(subText)}</i>${odds}`;
          card.onclick = () => handlers.onDecision(k);
          grid.appendChild(card);
        });
        box.appendChild(grid);
      }
      rootEl.appendChild(box);
      return;
    }

    if (stage === 'booster') {
      rootEl.appendChild(stageHeader(state, 'booster', handlers));
      const box = h('div', 'stage-body');
      box.appendChild(h('div', 'stage-intro',
        `<h2>${T('booster.title')}</h2><p>${T('booster.desc')}</p>`));
      const grid = h('div', 'pick-grid');
      state.currentBoosters.forEach((b) => {
        const fx = E().boosterFx(state, b);
        const chips = Object.entries(fx).map(([k, v]) => `<span class="chip chip-up">+${v} ${T('stat.' + k)}</span>`).join('');
        const card = h('button', `pick-card rarity-${b.rarity}`);
        card.type = 'button';
        card.innerHTML = `<div class="rarity-tag">${tierLabel(b.rarity)}</div>
          <b>${esc(TD('booster', b, 'title') || T(b.title))}</b><i>${esc(TD('booster', b, 'desc') || T(b.desc))}</i><div class="stat-chips">${chips}</div>`;
        card.onclick = () => handlers.onBooster(b.id);
        grid.appendChild(card);
      });
      box.appendChild(grid);
      rootEl.appendChild(box);
      return;
    }

    if (stage === 'club') {
      rootEl.appendChild(stageHeader(state, 'club', handlers));
      const box = h('div', 'stage-body');
      box.appendChild(h('div', 'stage-intro',
        `<h2>${T('club.title')}</h2><p>${T('club.desc', { n: state.season })}</p>`));
      const grid = h('div', 'pick-grid');
      state.currentOffers.forEach((o, idx) => {
        const chipKey = 'offer.' + o.type;
        const card = clubCard(o.club, {
          roleKey: o.roleKey, role: o.role, noteKey: o.noteKey, noteParams: o.noteParams, note: o.note, fee: o.type === 'transfer' ? o.fee : null,
          chip: T(chipKey), chipCls: `chip-${o.type === 'return' ? 'stay' : o.type}`,
          isLoanBuyout: o.isLoanBuyout || o.noteKey === 'offerNote.loanBuyout',
        });
        card.onclick = () => handlers.onClub(idx);
        grid.appendChild(card);
      });
      box.appendChild(grid);
      rootEl.appendChild(box);
      return;
    }

    if (stage === 'sim') {
      rootEl.appendChild(stageHeader(state, 'club', handlers));
      const box = h('div', 'stage-body sim-body');
      box.innerHTML = `
        <h2>${T('sim.title', { n: state.season })}</h2>
        <div class="sim-line" id="sim-line">${T('sim.warmup')}</div>
        <div class="sim-bar"><i id="sim-fill"></i></div>`;
      rootEl.appendChild(box);
      return;
    }
  }

  /* ================= HISTORY ================= */
  function historyRow(r) {
    const row = h('div', 'hrow');
    const club = E().clubByCid(r.cid);
    const head = h('div', 'hrow-head');
    head.appendChild(h('span', 'hrow-year', String(r.year)));
    head.appendChild(h('span', 'hrow-age', `${r.age} ${T('hist.yo')}`));
    head.appendChild(badgeEl(club, 24));
    const nameBox = h('div', 'hrow-club');
    nameBox.innerHTML = `<b>${esc(r.clubName)}</b><i>${esc(r.league)}${r.loan ? ' · ' + T('hist.loan') : ''}</i>`;
    head.appendChild(nameBox);
    head.appendChild(h('span', `hrow-ovr ${r.ovrAfter > r.ovrBefore ? 'up' : r.ovrAfter < r.ovrBefore ? 'down' : ''}`,
      `${r.ovrAfter} ${r.ovrAfter > r.ovrBefore ? '▲' : r.ovrAfter < r.ovrBefore ? '▼' : ''}`));
    row.appendChild(head);

    const statsLine = r.saves || r.conceded || r.cleanSheets
      ? `<span>${r.apps} APP</span><span>${r.saves} SAV</span><span>${r.conceded} GC</span><span>${r.cleanSheets} CS</span>`
      : `<span>${r.apps} APP</span><span>${r.goals} G</span><span>${r.assists} A</span>`;
    const line = h('div', 'hrow-stats', statsLine +
      `<span class="hrow-rating">★ ${r.rating.toFixed(1)}</span>` +
      (r.caps ? `<span class="hrow-caps">${r.caps} caps${r.ntGoals ? ` · ${r.ntGoals} G` : ''}</span>` : ''));
    row.appendChild(line);

    if (r.trophies.length || (r.awards && r.awards.length)) {
      const tr = h('div', 'hrow-trophies');
      r.trophies.forEach((t) => {
        const cls = { League: 'tr-league', Cup: 'tr-cup', Continental: 'tr-cont', Country: 'tr-country' }[t.type];
        tr.appendChild(h('span', `tr-chip ${cls}`, `🏆 ${esc(t.name)}`));
      });
      (r.awards || []).forEach((a) => {
        const chip = h('span', 'award-ic', a.icon);
        chip.title = a.name;
        tr.appendChild(chip);
      });
      row.appendChild(tr);
    }
    return row;
  }

  function renderStandings(rootEl, state) {
    const club = state.club ? E().clubByCid(state.club.cid) : null;
    if (!club) {
      rootEl.appendChild(h('div', 'history-empty', T('hist.joinClub')));
      return;
    }
    const country = E().countryById(club.countryId);
    const head2 = h('div', 'league-head');
    head2.innerHTML = `<b>${esc(country.league)}</b><i>${state.standings ? T('hist.finalTable', { year: state.season - 1 }) : T('hist.preseason')}</i>`;
    rootEl.appendChild(head2);

    const table = h('div', 'league-table');
    if (state.standings) {
      state.standings.forEach((row, idx) => {
        const c = E().clubByCid(row.cid);
        const tr = h('div', 'league-row' + (row.cid === club.cid ? ' mine' : ''));
        tr.appendChild(h('span', 'league-pos', String(idx + 1)));
        tr.appendChild(badgeEl(c, 20));
        tr.appendChild(h('span', 'league-name', esc(c.n)));
        tr.appendChild(h('span', 'league-pts', `${row.pts}`));
        table.appendChild(tr);
      });
    } else {
      const sorted = country.clubs.slice().sort((a, b) => b.s - a.s);
      sorted.forEach((cl, idx) => {
        const c = E().clubByCid(`${country.id}:${cl.n}`);
        const tr = h('div', 'league-row' + (c.cid === club.cid ? ' mine' : ''));
        tr.appendChild(h('span', 'league-pos', String(idx + 1)));
        tr.appendChild(badgeEl(c, 20));
        tr.appendChild(h('span', 'league-name', esc(cl.n)));
        tr.appendChild(h('span', 'league-pts', '—'));
        table.appendChild(tr);
      });
    }
    rootEl.appendChild(table);
  }

  let histTab = 'summary'; // 'summary' | 'career' | 'league'

  function renderSummaryTab(rootEl, state) {
    if (!state.history.length) {
      rootEl.appendChild(h('div', 'history-empty', T('hist.empty')));
      return;
    }

    const box = h('div', 'summary-tab-container');
    const stints = Object.values(state.clubStints || {}).sort((a, b) => b.lastYear - a.lastYear);
    stints.forEach((stint) => {
      const club = E().clubByCid(stint.cid);
      if (!club) return;
      const card = h('div', 'summary-stint-card glass');

      const clubSeasons = state.history.filter((r) => r.cid === stint.cid);
      const avgRating = clubSeasons.length
        ? (clubSeasons.reduce((acc, r) => acc + r.rating, 0) / clubSeasons.length).toFixed(1)
        : '—';

      const stintSalaries = (stint.salaries && stint.salaries.length) ? stint.salaries : clubSeasons.map((r) => r.salary).filter(Boolean);
      const minSal = stintSalaries.length ? Math.min(...stintSalaries) : 0;
      const maxSal = stintSalaries.length ? Math.max(...stintSalaries) : 0;
      const perYearStr = T('card.perYear') || '/yr';
      const salText = minSal > 0 ? (minSal === maxSal ? `${E().fmtValue(minSal)}${perYearStr}` : `${E().fmtValue(minSal)} – ${E().fmtValue(maxSal)}${perYearStr}`) : '';

      const trophyCounts = {};
      (stint.trophies || []).forEach((t) => {
        trophyCounts[t.name] = (trophyCounts[t.name] || 0) + 1;
      });
      const trophyChips = Object.entries(trophyCounts).map(([name, count]) => `${count}x ${name}`);

      const yearRange = stint.firstYear === stint.lastYear
        ? `${stint.firstYear} (${stint.seasons === 1 ? T('sum.season1') : T('sum.seasons', { n: stint.seasons })})`
        : `${stint.firstYear} – ${stint.lastYear} (${T('sum.seasons', { n: stint.seasons })})`;

      const statLine = state.player.isGK
        ? `<span><b>${stint.apps}</b> ${T('sum.apps')}</span><span><b>${stint.saves}</b> ${T('sum.saves')}</span><span><b>${stint.conceded}</b> ${T('sum.gc')}</span><span><b>${stint.cleanSheets}</b> ${T('sum.cs')}</span>`
        : `<span><b>${stint.apps}</b> ${T('sum.apps')}</span><span><b>${stint.goals}</b> ${T('sum.goals')}</span><span><b>${stint.assists}</b> ${T('sum.assists')}</span>`;

      const stintHead = h('div', 'stint-head');
      stintHead.appendChild(badgeEl(club, 32));

      const stintInfo = h('div', 'stint-info');
      stintInfo.innerHTML = `<b class="stint-club-name">${esc(club.n)}</b>
        <span class="stint-years">${yearRange} · ${esc(club.league)}</span>`;
      stintHead.appendChild(stintInfo);
      stintHead.appendChild(h('span', 'stint-rating', `★ ${avgRating}`));
      card.appendChild(stintHead);

      const statsDiv = h('div', 'stint-stats', statLine);
      card.appendChild(statsDiv);

      if (salText) {
        card.appendChild(h('div', 'stint-salary-row', `💰 ${salText}`));
      }

      if (trophyChips.length) {
        const trDiv = h('div', 'stint-trophies', trophyChips.map(t => `<span class="tr-chip">🏆 ${esc(t)}</span>`).join(''));
        card.appendChild(trDiv);
      }

      box.appendChild(card);
    });

    const t = state.totals;
    if (t.caps > 0 || (state.ntTrophies && state.ntTrophies.length)) {
      const nat = E().countryById(state.player.countryId);
      const ntCard = h('div', 'summary-stint-card glass nt-summary-card');
      const ntTrophyCounts = {};
      (state.ntTrophies || []).forEach((tr) => {
        ntTrophyCounts[tr.name] = (ntTrophyCounts[tr.name] || 0) + 1;
      });
      const ntChips = Object.entries(ntTrophyCounts).map(([name, count]) => `${count}x ${name}`);

      const ntCleanSheets = Math.min(t.caps, t.ntCleanSheets || 0);
      const ntStatLine = state.player.isGK
        ? `<span><b>${t.caps}</b> ${T('sum.caps')}</span><span><b>${ntCleanSheets}</b> ${T('sum.cleanSheets')}</span>`
        : `<span><b>${t.caps}</b> ${T('sum.caps')}</span><span><b>${t.ntGoals}</b> ${T('sum.goals')}</span>`;

      const stintHead = h('div', 'stint-head');
      stintHead.appendChild(flagEl(nat.code, 40));

      const stintInfo = h('div', 'stint-info');
      const debutText = state.ntFirstYear ? T('sum.debut', { year: state.ntFirstYear }) : T('sum.ntDuty');
      stintInfo.innerHTML = `<b class="stint-club-name">${T('sum.ntTeam', { country: esc(nat.name) })}</b>
        <span class="stint-years">${debutText} · ${T('sum.fifaRank', { rank: nat.rank })}</span>`;
      stintHead.appendChild(stintInfo);
      ntCard.appendChild(stintHead);

      const statsDiv = h('div', 'stint-stats', ntStatLine);
      ntCard.appendChild(statsDiv);

      if (ntChips.length) {
        const trDiv = h('div', 'stint-trophies', ntChips.map(t => `<span class="tr-chip tr-big tr-country">🏆 ${esc(t)}</span>`).join(''));
        ntCard.appendChild(trDiv);
      }

      box.appendChild(ntCard);
    }

    rootEl.appendChild(box);
  }

  function renderHistory(rootEl, state, handlers) {
    rootEl.innerHTML = '';

    const tabsBox = h('div', 'history-tabs-box');
    const tabs = h('div', 'hist-tabs');
    [['summary', T('hist.summary')], ['career', T('hist.career')], ['league', T('hist.league')]].forEach(([id, label]) => {
      const t = h('button', 'hist-tab' + (histTab === id ? ' active' : ''), label);
      t.type = 'button';
      t.onclick = () => { histTab = id; renderHistory(rootEl, state, handlers); };
      tabs.appendChild(t);
    });
    tabsBox.appendChild(tabs);

    const contentBox = h('div', 'history-tabs-content');
    if (histTab === 'summary') {
      renderSummaryTab(contentBox, state);
    } else if (histTab === 'league') {
      renderStandings(contentBox, state);
    } else if (!state.history.length) {
      contentBox.appendChild(h('div', 'history-empty', T('hist.empty')));
    } else {
      const list = h('div', 'history-list');
      state.history.forEach((r) => list.appendChild(historyRow(r)));
      contentBox.appendChild(list);
    }
    tabsBox.appendChild(contentBox);
    rootEl.appendChild(tabsBox);

    const agentBox = h('div', 'history-agent-box');
    agentBox.appendChild(agentCard(state, handlers));
    rootEl.appendChild(agentBox);
  }

  /* ================= MODALS ================= */
  function modal(contentEl, opts) {
    const rootM = document.getElementById('modal-root');
    rootM.innerHTML = '';
    const back = h('div', 'modal-backdrop');
    const box = h('div', 'modal glass' + (opts && opts.wide ? ' wide' : ''));
    
    // Top-right close 'X' button
    const xBtn = h('button', 'modal-x', '✕');
    xBtn.type = 'button';
    xBtn.title = T('btn.close');
    box.appendChild(xBtn);

    box.appendChild(contentEl);
    back.appendChild(box);
    rootM.appendChild(back);

    box.onclick = (e) => e.stopPropagation();

    const handleClose = () => {
      back.classList.remove('show');
      setTimeout(() => {
        if (back.parentNode) {
          back.parentNode.removeChild(back);
        }
      }, 220);
      if (opts && opts.onClose) opts.onClose();
    };

    xBtn.onclick = handleClose;
    back.onclick = (e) => {
      if (e.target === back) handleClose();
    };

    requestAnimationFrame(() => back.classList.add('show'));
    return {
      close: handleClose,
    };
  }

  function renderOutcomeChanges(changes, state) {
    const wrap = h('div', 'outcome-changes-wrap');
    if (!changes || !changes.length) return wrap;

    const p = state ? state.player : null;
    const statChanges = [];
    const specialChanges = [];

    changes.forEach((c) => {
      if (['INJ', 'SHIELD', 'SUPER'].includes(c.k)) {
        specialChanges.push(c);
      } else {
        statChanges.push(c);
      }
    });

    if (statChanges.length > 0) {
      const statsBox = h('div', 'sr-player-stats outcome-stat-bars');
      statsBox.innerHTML = `<div class="sr-stats-title">${T('sr.statsTitle')}</div>`;
      const rows = h('div', 'sr-stat-rows');

      statChanges.forEach((c) => {
        let currentVal = 50;
        let statName = c.k;
        let barClass = '';

        if (p && p.stats && c.k in p.stats) {
          currentVal = p.stats[c.k];
          statName = T('stat.' + c.k);
        } else if (c.k === 'STA') {
          currentVal = p ? p.stamina : 80;
          statName = T('card.stamina');
          barClass = 'sr-bar-sta';
        } else if (c.k === 'MOR') {
          currentVal = p ? p.morale : 80;
          statName = T('card.morale');
          barClass = 'sr-bar-mor';
        } else if (c.k === 'HYPE') {
          currentVal = p ? (p.hype || 0) : 0;
          statName = T('card.hype');
          barClass = 'sr-bar-hype';
        } else if (c.k === 'LOYALTY') {
          currentVal = p ? (p.loyalty || 20) : 20;
          statName = T('card.loyalty');
          barClass = 'sr-bar-loyalty';
        } else {
          statName = T('stat.' + c.k) || c.k;
        }

        const delta = c.d;
        const maxVal = ['STA', 'MOR', 'HYPE', 'LOYALTY'].includes(c.k) ? 100 : 99;
        const minVal = ['STA', 'MOR', 'HYPE', 'LOYALTY'].includes(c.k) ? 0 : 35;
        const baseVal = Math.min(maxVal, Math.max(minVal, currentVal - delta));
        const absDelta = Math.abs(delta);

        let barHtml = '';
        if (delta > 0) {
          barHtml = `<i class="sr-bar-base ${barClass}" style="width:${baseVal}%"></i><i class="sr-bar-delta up" style="width:${absDelta}%"></i>`;
        } else if (delta < 0) {
          barHtml = `<i class="sr-bar-base ${barClass}" style="width:${currentVal}%"></i><i class="sr-bar-delta down" style="width:${absDelta}%"></i>`;
        } else {
          barHtml = `<i class="sr-bar-base ${barClass}" style="width:${currentVal}%"></i>`;
        }

        let valHtml = `${currentVal}`;
        if (delta > 0) valHtml += `<span class="stat-offset up">+${delta}</span>`;
        else if (delta < 0) valHtml += `<span class="stat-offset down">${delta}</span>`;
        else valHtml += `<span class="stat-offset">+0${currentVal >= maxVal ? ' (MAX)' : ''}</span>`;

        const row = h('div', 'sr-pstat-row');
        row.innerHTML = `
          <span class="sr-pstat-name">${esc(statName)}</span>
          <div class="sr-pstat-bar-track">${barHtml}</div>
          <span class="sr-pstat-val">${valHtml}</span>`;
        rows.appendChild(row);
      });

      statsBox.appendChild(rows);
      wrap.appendChild(statsBox);
    }

    if (specialChanges.length > 0) {
      const chipsHtml = specialChanges.map((c) => {
        if (c.k === 'INJ') return `<span class="chip chip-inj">${T('chip.injured')}</span>`;
        if (c.k === 'SHIELD') return `<span class="chip chip-shield">${T('chip.shield')}</span>`;
        if (c.k === 'SUPER') return `<span class="chip chip-hype">${T('chip.superAgent')}</span>`;
        if (c.k === 'AGENT_NEG') return `<span class="chip chip-up">+${c.d} ${T('agent.negotiation') || 'Negotiation'}</span>`;
        if (c.k === 'AGENT_PAT') return `<span class="chip chip-up">+${c.d} ${T('agent.patience') || 'Patience'}</span>`;
        return '';
      }).join('');
      if (chipsHtml) {
        wrap.appendChild(h('div', 'stat-chips', chipsHtml));
      }
    }

    return wrap;
  }

  function showOutcome(title, text, changes, onDone, state) {
    let doneCalled = false;
    const finish = () => {
      if (!doneCalled) {
        doneCalled = true;
        onDone();
      }
    };
    const c = h('div', 'outcome');
    c.innerHTML = `<div class="outcome-kicker">${T('outcome.kicker')}</div><h3>${esc(title)}</h3><p>${esc(text)}</p>`;
    c.appendChild(renderOutcomeChanges(changes, state));
    const btn = h('button', 'primary-btn', T('btn.continue'));
    c.appendChild(btn);
    const m = modal(c, { onClose: finish });
    btn.onclick = () => { m.close(); };
  }

  function headlineFor(res) {
    const H = I18n.headlines();
    const perf = res.rating;
    if (perf >= 9.0) return H.legend;
    if (perf >= 8.2) return H.great;
    if (perf >= 7.4) return H.good;
    if (perf >= 6.8) return H.quiet;
    return H.bad;
  }

  function showSeasonResult(state, res, onDone) {
    let doneCalled = false;
    const finish = () => {
      if (!doneCalled) {
        doneCalled = true;
        onDone();
      }
    };
    const p = state.player;
    const c = h('div', 'season-result');
    const headline = headlineFor(res)[Math.floor(Math.random() * headlineFor(res).length)];
    const gk = res.saves || res.conceded || res.cleanSheets;

    c.innerHTML = `
      <div class="sr-kicker">${T('sr.kicker', { year: res.year })}</div>
      <h3 class="sr-headline">${esc(headline)}</h3>
      <div class="sr-clubline">${esc(res.clubName)} · ${T('stage.age', { n: res.age })}</div>
      <div class="sr-grid">
        <div class="sr-stat"><b>${res.apps}</b><span>${T('sr.apps')}</span></div>
        ${gk
          ? `<div class="sr-stat"><b>${res.saves}</b><span>${T('sr.saves')}</span></div>
             <div class="sr-stat"><b>${res.conceded}</b><span>${T('sr.conceded')}</span></div>
             <div class="sr-stat"><b>${res.cleanSheets}</b><span>${T('sr.cleanSheets')}</span></div>`
          : `<div class="sr-stat"><b>${res.goals}</b><span>${T('sr.goals')}</span></div>
             <div class="sr-stat"><b>${res.assists}</b><span>${T('sr.assists')}</span></div>
             <div class="sr-stat"><b>★ ${res.rating.toFixed(1)}</b><span>${T('sr.avgRating')}</span></div>`}
      </div>`;

    if (res.trophies.length) {
      const shelf = h('div', 'sr-trophies');
      res.trophies.forEach((t) => shelf.appendChild(h('span', 'tr-chip tr-big', `🏆 ${esc(t.name)}`)));
      c.appendChild(shelf);
    }
    if (res.awards && res.awards.length) {
      const aw = h('div', 'sr-awards');
      res.awards.forEach((a) => aw.appendChild(h('span', 'award-chip', `${a.icon} ${esc(a.name)}`)));
      c.appendChild(aw);
    }
    if (res.caps) {
      const capText = res.ntGoals
        ? T('sr.intCapsGoals', { n: res.caps, g: res.ntGoals, country: esc(E().countryById(p.countryId).name) })
        : T('sr.intCaps', { n: res.caps });
      c.appendChild(h('div', 'sr-caps', capText));
    }

    const seasonShopSpent = res.shopSpent !== undefined ? res.shopSpent : (state.shopSpentThisSeason || 0);
    const netSavings = Math.max(0, state.earnings - state.spent);
    c.appendChild(financeBar(res.salary, state.agent ? state.agent.annualSalary : 0));
    c.appendChild(bankBar(netSavings, seasonShopSpent));

    // Player Card Stat Bars with +/- offsets & Condition bars
    const statsBox = h('div', 'sr-player-stats');
    statsBox.innerHTML = `<div class="sr-stats-title">${T('sr.statsTitle')}</div>`;
    const rows = h('div', 'sr-stat-rows');
    const statDefs = p.isGK ? D().GK_STATS : D().FIELD_STATS;

    statDefs.forEach((s) => {
      const currentVal = p.stats[s.k] || 40;
      const delta = res.statLog ? (res.statLog[s.k] || 0) : 0;
      const baseVal = Math.min(99, Math.max(35, currentVal - delta));
      const row = h('div', 'sr-pstat-row');

      let barHtml = '';
      if (delta > 0) {
        barHtml = `<i class="sr-bar-base" style="width:${baseVal}%"></i><i class="sr-bar-delta up" style="width:${delta}%"></i>`;
      } else if (delta < 0) {
        const absD = Math.abs(delta);
        barHtml = `<i class="sr-bar-base" style="width:${currentVal}%"></i><i class="sr-bar-delta down" style="width:${absD}%"></i>`;
      } else {
        barHtml = `<i class="sr-bar-base" style="width:${currentVal}%"></i>`;
      }

      let valHtml = `${currentVal}`;
      if (delta > 0) valHtml += `<span class="stat-offset up">+${delta}</span>`;
      else if (delta < 0) valHtml += `<span class="stat-offset down">${delta}</span>`;

      row.innerHTML = `
        <span class="sr-pstat-name">${T('stat.' + s.k)}</span>
        <div class="sr-pstat-bar-track">${barHtml}</div>
        <span class="sr-pstat-val">${valHtml}</span>`;
      rows.appendChild(row);
    });

    // Divider & Condition Bars (Stamina & Morale)
    rows.appendChild(h('div', 'sr-cond-divider'));

    const staRow = h('div', 'sr-pstat-row');
    staRow.innerHTML = `
      <span class="sr-pstat-name">${T('card.stamina')}</span>
      <div class="sr-pstat-bar-track"><i class="sr-bar-base sr-bar-sta" style="width:${p.stamina}%"></i></div>
      <span class="sr-pstat-val">${p.stamina}</span>`;
    rows.appendChild(staRow);

    const morRow = h('div', 'sr-pstat-row');
    morRow.innerHTML = `
      <span class="sr-pstat-name">${T('card.morale')}</span>
      <div class="sr-pstat-bar-track"><i class="sr-bar-base sr-bar-mor" style="width:${p.morale}%"></i></div>
      <span class="sr-pstat-val">${p.morale}</span>`;
    rows.appendChild(morRow);

    const loyRow = h('div', 'sr-pstat-row');
    loyRow.innerHTML = `
      <span class="sr-pstat-name">${T('card.loyalty')}</span>
      <div class="sr-pstat-bar-track"><i class="sr-bar-base sr-bar-loyalty" style="width:${p.loyalty || 20}%"></i></div>
      <span class="sr-pstat-val">${p.loyalty || 20}</span>`;
    rows.appendChild(loyRow);

    const hypeVal = p.hype || 0;
    const hypeDelta = res.hypeDelta || 0;
    let hypeValHtml = `${hypeVal}`;
    if (hypeDelta > 0) hypeValHtml += `<span class="stat-offset up">+${hypeDelta}</span>`;
    else if (hypeDelta < 0) hypeValHtml += `<span class="stat-offset down">${hypeDelta}</span>`;

    const hypeRow = h('div', 'sr-pstat-row');
    hypeRow.innerHTML = `
      <span class="sr-pstat-name">${T('card.hype')}</span>
      <div class="sr-pstat-bar-track"><i class="sr-bar-base shop-stat-fill hype" style="width:${hypeVal}%"></i></div>
      <span class="sr-pstat-val">${hypeValHtml}</span>`;
    rows.appendChild(hypeRow);

    const repVal = p.reputation || 0;
    const repDelta = res.repDelta || 0;
    let repValHtml = `${repVal}`;
    if (repDelta > 0) repValHtml += `<span class="stat-offset up">+${repDelta}</span>`;
    else if (repDelta < 0) repValHtml += `<span class="stat-offset down">${repDelta}</span>`;

    const repRow = h('div', 'sr-pstat-row');
    repRow.innerHTML = `
      <span class="sr-pstat-name">${T('card.reputation') || 'Reputation'}</span>
      <div class="sr-pstat-bar-track"><i class="sr-bar-base sr-bar-rep" style="width:${repVal}%"></i></div>
      <span class="sr-pstat-val">${repValHtml}</span>`;
    rows.appendChild(repRow);

    statsBox.appendChild(rows);
    c.appendChild(statsBox);

    if (res.notes.length) {
      c.appendChild(h('div', 'sr-notes', res.notes.map((n) => `📰 ${esc(n)}`).join('<br>')));
    }

    const ovrDelta = res.ovrAfter - res.ovrBefore;
    c.appendChild(h('div', 'sr-ovr',
      `<span>${T('sr.ovr')} <b>${res.ovrBefore}</b> → <b class="${ovrDelta > 0 ? 'up' : ovrDelta < 0 ? 'down' : ''}">${res.ovrAfter}</b></span>
       <span>${T('sr.value')} <b>${E().fmtValue(res.valueAfter)}</b></span>`));

    const btn = h('button', 'primary-btn', state.retired ? T('sr.legacy') : T('sr.startSeason', { n: state.season }));
    c.appendChild(btn);
    const m = modal(c, { wide: true, onClose: finish });
    if (res.trophies.length) confetti();
    btn.onclick = () => { m.close(); };
  }

  function confetti() {
    const rootC = document.getElementById('confetti-root');
    const emojis = ['🏆', '⚽', '🥇', '✨', '🎉'];
    for (let i = 0; i < 26; i++) {
      const s = h('span', 'confetti', emojis[i % emojis.length]);
      s.style.left = Math.random() * 100 + 'vw';
      s.style.animationDelay = (Math.random() * 0.6) + 's';
      s.style.fontSize = (14 + Math.random() * 22) + 'px';
      rootC.appendChild(s);
      setTimeout(() => s.remove(), 2600);
    }
  }

  /* ================= MINIGAMES & RISK REVEAL ================= */
  // Suspense: bounce between GOOD and BAD, land on the actual result
  function showRiskReveal(good, onDone) {
    const c = h('div', 'risk-reveal');
    c.innerHTML = `
      <div class="risk-panels">
        <div class="risk-panel good" id="rp-good">✨<span>${T('risk.good')}</span></div>
        <div class="risk-panel bad" id="rp-bad">💀<span>${T('risk.bad')}</span></div>
      </div>
      <div class="risk-hint">${T('risk.deciding')}</div>`;
    const m = modal(c);
    const g = c.querySelector('#rp-good');
    const b = c.querySelector('#rp-bad');
    const steps = 8;
    let i = 0;
    const tick = () => {
      g.classList.toggle('hot', i % 2 === 0);
      b.classList.toggle('hot', i % 2 === 1);
      i++;
      if (i < steps) {
        setTimeout(tick, 110 + i * 45); // decelerating bounce
      } else {
        g.classList.toggle('hot', false);
        b.classList.toggle('hot', false);
        const win = good ? g : b;
        const lose = good ? b : g;
        win.classList.add('win');
        lose.classList.add('lose');
        c.querySelector('.risk-hint').textContent = good ? T('risk.goodResult') : T('risk.badResult');
        setTimeout(() => { m.close(); onDone(); }, 900);
      }
    };
    setTimeout(tick, 250);
  }

  // Penalty: pick 1 of N goal zones — some are goals, the rest are saved
  function showPenaltyMini(mini, onResult) {
    const zonesN = mini.zones || 5;
    const zoneDefs = [
      { id: 'TL', label: 'Top left', x: 14, y: 20 }, { id: 'TR', label: 'Top right', x: 86, y: 20 },
      { id: 'C', label: 'Center', x: 50, y: 50 },
      { id: 'BL', label: 'Bottom left', x: 14, y: 78 }, { id: 'BR', label: 'Bottom right', x: 86, y: 78 },
    ].slice(0, zonesN);
    const shuffled = zoneDefs.slice().sort(() => Math.random() - 0.5);
    const goodZones = new Set(shuffled.slice(0, mini.goodZones || 2).map((z) => z.id));

    const c = h('div', 'mini penalty-mini');
    c.innerHTML = `<div class="outcome-kicker">${T('pen.kicker')}</div>
      <h3>${T('pen.title')}</h3>
      <p class="mini-sub">${T('pen.sub', { good: mini.goodZones || 2, total: zonesN })}</p>`;
    const goal = h('div', 'goal');
    goal.innerHTML = `
      <div class="penalty-net-grid"></div>
      <div class="mini-gk">🧤</div>
      <div class="mini-penalty-spot"></div>`;
    const ball = h('div', 'mini-ball', '⚽');
    goal.appendChild(ball);
    zoneDefs.forEach((z) => {
      const btn = h('button', 'goal-zone', '');
      btn.type = 'button';
      btn.style.left = z.x + '%';
      btn.style.top = z.y + '%';
      btn.dataset.zone = z.id;
      goal.appendChild(btn);
    });
    let finished = false;
    const m = modal(c, {
      onClose: () => {
        if (!finished) {
          finished = true;
          onResult('good');
        }
      }
    });

    goal.addEventListener('click', (ev) => {
      const btn = ev.target.closest('.goal-zone');
      if (!btn || goal.classList.contains('done')) return;
      goal.classList.add('done');
      const id = btn.dataset.zone;
      const scored = goodZones.has(id);
      // ball flight
      ball.style.left = btn.style.left;
      ball.style.top = btn.style.top;
      ball.classList.add('fly');
      setTimeout(() => {
        btn.classList.add(scored ? 'goal-flash' : 'saved-flash');
        verdict.textContent = scored ? T('pen.goal') : T('pen.saved');
        verdict.className = 'mini-verdict show ' + (scored ? 'v-good' : 'v-bad');
        if (scored) confetti();
        setTimeout(() => {
          if (!finished) {
            finished = true;
            m.close();
            onResult(scored ? 'good' : 'bad');
          }
        }, 1200);
      }, 550);
    });
  }

  // Timing: stop the pointer in the sweet spot
  function showTimingMini(mini, onResult) {
    const c = h('div', 'mini timing-mini');
    c.innerHTML = `<div class="outcome-kicker">${T('timing.kicker')}</div>
      <h3>${T('timing.title')}</h3>
      <p class="mini-sub">${T('timing.sub')}</p>`;
    const bar = h('div', 'timing-bar');
    const sweet = h('div', 'timing-sweet');
    const sweetLeft = 18 + Math.random() * 52; // 18-70%
    const sweetW = 14;
    sweet.style.left = sweetLeft + '%';
    sweet.style.width = sweetW + '%';
    const pointer = h('div', 'timing-pointer');
    bar.appendChild(sweet);
    bar.appendChild(pointer);
    const verdict = h('div', 'mini-verdict', '');
    const strike = h('button', 'primary-btn', T('timing.strike'));
    c.appendChild(bar);
    c.appendChild(verdict);
    c.appendChild(strike);

    let finished = false;
    const m = modal(c, {
      onClose: () => {
        if (!finished) {
          finished = true;
          onResult('good');
        }
      }
    });

    let pos = 0, dir = 1, raf = null, done = false;
    const speed = 1.15; // full cycles per second
    let last = performance.now();
    const step = (t) => {
      const dt = (t - last) / 1000;
      last = t;
      pos += dir * dt * speed * 100;
      if (pos >= 100) { pos = 100; dir = -1; }
      if (pos <= 0) { pos = 0; dir = 1; }
      pointer.style.left = pos + '%';
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    const finish = () => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      const center = sweetLeft + sweetW / 2;
      const dist = Math.abs(pos - center);
      let key, label, cls;
      if (dist <= sweetW / 2) { key = 'good'; label = T('timing.perfect'); cls = 'v-good'; }
      else if (dist <= sweetW * 1.4 && mini.results.mid) { key = 'mid'; label = T('timing.close'); cls = 'v-mid'; }
      else { key = mini.results.mid ? 'bad' : (dist <= sweetW * 1.4 ? 'good' : 'bad'); label = dist <= sweetW * 1.4 ? T('timing.justAbout') : T('timing.milesOff'); cls = dist <= sweetW * 1.4 ? 'v-mid' : 'v-bad'; }
      sweet.classList.add(key === 'good' ? 'hit' : 'miss');
      verdict.textContent = label;
      verdict.className = 'mini-verdict show ' + cls;
      if (key === 'good') confetti();
      setTimeout(() => {
        if (!finished) {
          finished = true;
          m.close();
          onResult(key);
        }
      }, 1100);
    };
    bar.addEventListener('click', finish);
    strike.addEventListener('click', finish);
  }

  // Goalkeeper Penalty Save Minigame
  function showGkPenaltyMini(mini, onResult) {
    const c = h('div', 'mini gk-penalty-mini');
    c.innerHTML = `<div class="outcome-kicker">${T('gk.kicker')}</div>
      <h3>${T('gk.title')}</h3>
      <p class="mini-sub">${T('gk.sub')}</p>`;

    const goal = h('div', 'gk-goal');
    goal.innerHTML = `
      <div class="penalty-net-grid"></div>
      <div class="mini-striker">🏃</div>
      <div class="mini-gk-gloves">🧤</div>
      <div class="mini-penalty-spot"></div>`;

    const ball = h('div', 'mini-ball', '⚽');
    goal.appendChild(ball);

    const btnRow = h('div', 'gk-dive-btns');
    const directions = [
      { id: 'left', label: T('gk.left') },
      { id: 'center', label: T('gk.center') },
      { id: 'right', label: T('gk.right') }
    ];

    directions.forEach((d) => {
      const btn = h('button', 'primary-btn ghost dive-btn', d.label);
      btn.dataset.dir = d.id;
      btnRow.appendChild(btn);
    });

    const verdict = h('div', 'mini-verdict', '');
    c.appendChild(goal);
    c.appendChild(btnRow);
    c.appendChild(verdict);

    let finished = false;
    const m = modal(c, {
      onClose: () => {
        if (!finished) {
          finished = true;
          onResult('good');
        }
      }
    });

    btnRow.addEventListener('click', (ev) => {
      const btn = ev.target.closest('.dive-btn');
      if (!btn || goal.classList.contains('done')) return;
      goal.classList.add('done');
      const playerChoice = btn.dataset.dir;
      const strikerChoice = ['left', 'center', 'right'][Math.floor(Math.random() * 3)];
      const saved = playerChoice === strikerChoice;

      const gloves = goal.querySelector('.mini-gk-gloves');
      if (gloves) gloves.classList.add('dive-' + playerChoice);

      const targetX = strikerChoice === 'left' ? '18%' : (strikerChoice === 'right' ? '82%' : '50%');
      const targetTop = '30%';

      ball.style.left = targetX;
      ball.style.top = targetTop;
      ball.style.bottom = 'auto';
      ball.classList.add('fly');

      setTimeout(() => {
        verdict.textContent = saved ? T('gk.saved') : T('gk.goal');
        verdict.className = 'mini-verdict show ' + (saved ? 'v-good' : 'v-bad');
        if (saved) confetti();
        setTimeout(() => {
          if (!finished) {
            finished = true;
            m.close();
            onResult(saved ? 'good' : 'bad');
          }
        }, 1200);
      }, 550);
    });
  }

  function showNaturalizationModal(state, countryId, onDone) {
    const p = state.player;
    const nat = E().countryById(countryId);
    const countryStr = E().countryName(nat);
    const c = h('div', 'nt-callup-modal outcome');

    const flagHeader = h('div', 'nt-flag-header');
    flagHeader.appendChild(flagEl(nat.code, 80));
    c.appendChild(flagHeader);

    const content = h('div', 'nt-content');
    content.innerHTML = `
      <div class="outcome-kicker">${T('nat.kicker')}</div>
      <h3>${T('nat.title', { country: esc(countryStr) })}</h3>
      <p>${T('nat.desc', { name: esc(p.name), country: esc(countryStr) })}</p>
      <div class="nt-badge-chips">
        <span class="chip tr-country">${T('nat.chip')}</span>
      </div>`;
    c.appendChild(content);

    const btnRow = h('div', 'nt-btn-row');
    const btn = h('button', 'primary-btn', T('nat.btn'));
    btn.onclick = () => { m.close(); };
    btnRow.appendChild(btn);
    c.appendChild(btnRow);

    const m = modal(c, { onClose: onDone });
    confetti();
  }

  function showNtCallUpModal(state, countryCode, onDone) {
    const targetCountry = (typeof countryCode === 'string' ? countryCode : null) || state.triggerNtCallUpModal || state.player.countryId;
    const p = state.player;
    const nat = E().countryById(targetCountry);
    const countryStr = E().countryName(nat);
    const isSecondary = targetCountry !== (p.initialCountryId || p.countryId);
    const c = h('div', 'nt-callup-modal outcome');

    const repBoost = nat.rank <= 5 ? 15 : nat.rank <= 20 ? 10 : 6;
    const repChipText = T('nt.repChip', { rep: repBoost }) || (`🔥 +${repBoost} Reputation Boost`);

    const flagHeader = h('div', 'nt-flag-header');
    flagHeader.appendChild(flagEl(nat.code, 80));
    c.appendChild(flagHeader);

    const content = h('div', 'nt-content');
    const titleText = isSecondary ? T('nt.secondaryTitle', { country: esc(countryStr) }) : T('nt.title', { country: esc(countryStr) });
    const descText = isSecondary ? T('nt.secondaryDesc', { country: esc(countryStr), rank: nat.rank }) : T('nt.desc', { rank: nat.rank });

    const repVal = p.reputation || 0;
    content.innerHTML = `
      <div class="outcome-kicker">${T('nt.kicker')}</div>
      <h3>${titleText}</h3>
      <p>${descText}</p>
      <div class="nt-badge-chips">
        <span class="chip tr-country">${T('nt.debut')}</span>
      </div>`;

    const repRow = h('div', 'sr-pstat-row', `
      <span class="sr-pstat-name">${T('card.reputation')}</span>
      <div class="sr-pstat-bar-track"><i class="sr-bar-base sr-bar-rep" style="width:${repVal}%"></i><i class="sr-bar-delta up" style="left:${repVal}%; width:${repBoost}%"></i></div>
      <span class="sr-pstat-val">${repVal} <span class="stat-offset up">+${repBoost}</span></span>`);
    content.appendChild(repRow);
    c.appendChild(content);

    const btnRow = h('div', 'nt-btn-row');

    const btnAccept = h('button', 'primary-btn', T('nt.btnAccept') || T('nt.btn'));
    btnAccept.onclick = () => {
      if (E().acceptNtCallUp) E().acceptNtCallUp(state, targetCountry);
      if (E().addReputation) E().addReputation(state, repBoost);
      m.close();
    };

    const btnDeclineTemp = h('button', 'primary-btn ghost', T('nt.btnDeclineTemp') || 'Decline For Now');
    btnDeclineTemp.onclick = () => {
      if (E().declineNtCallUpTemp) E().declineNtCallUpTemp(state, targetCountry);
      else if (E().declineNtCallUp) E().declineNtCallUp(state, targetCountry);
      m.close();
    };

    const btnRejectPerm = h('button', 'primary-btn danger-ghost', T('nt.btnRejectPerm') || 'Reject Permanently');
    btnRejectPerm.onclick = () => {
      if (E().rejectNtCallUpPerm) E().rejectNtCallUpPerm(state, targetCountry);
      else if (E().declineNtCallUp) E().declineNtCallUp(state, targetCountry);
      m.close();
    };

    btnRow.appendChild(btnAccept);
    btnRow.appendChild(btnDeclineTemp);
    btnRow.appendChild(btnRejectPerm);
    c.appendChild(btnRow);

    const callbackFn = typeof countryCode === 'function' ? countryCode : onDone;
    const m = modal(c, { onClose: callbackFn });
    confetti();
  }

  /* ================= SHOP & RETIRE ================= */
  function showShop(state, handlers) {
    let m = null;
    const balance = state.earnings - state.spent;
    const items = E().shopItems(state);
    const maxP = E().maxShopPurchases(state);
    const countThisSeason = (state.shopPurchasesSeason === state.season) ? (state.shopPurchasesCount || 0) : 0;
    const canBuy = countThisSeason < maxP;
    const canReroll = state.shopRerolledSeason !== state.season && balance >= 50000;
    const tierName = tierLabel(state.player.tier || E().getTier(state.player.ovr) || 'bronze');

    const c = h('div', 'shop');
    c.innerHTML = `<div class="outcome-kicker">${T('shop.kicker', { tier: tierName, used: countThisSeason, max: maxP })}</div>
      <h3>${T('shop.title')}</h3>
      <div class="shop-balance">${T('shop.balance', { amount: E().fmtValue(balance), n: maxP - countThisSeason, s: (maxP - countThisSeason) === 1 ? '' : 's' })}</div>`;

    if (canReroll) {
      const rerollRow = h('div', 'shop-reroll-row');
      const rerollBtn = h('button', 'primary-btn ghost reroll-btn', T('shop.reroll'));
      rerollBtn.onclick = () => {
        const res = E().rerollShop(state);
        if (res.ok) {
          if (m) m.close();
          showShop(state, handlers);
        }
      };
      rerollRow.appendChild(rerollBtn);
      c.appendChild(rerollRow);
    }

    const grid = h('div', 'shop-grid');
    items.forEach((it) => {
      const fx = it.fx || {};
      const bars = [];
      const p = state.player;
      if (fx.stats) {
        Object.entries(fx.stats).forEach(([k, v]) => {
          const cls = k.toLowerCase();
          const label = T('stat.' + k) || k;
          const curr = Math.min(100, Math.max(0, p.stats ? (p.stats[k] || 50) : 50));
          const gain = Math.min(100 - curr, Math.max(0, v));
          bars.push(`<div class="shop-stat-row"><span class="shop-stat-lbl">${esc(label)}</span><div class="shop-stat-track"><i class="shop-stat-fill ${cls}" style="left:0; width:${curr}%"></i><i class="shop-stat-delta up" style="left:${curr}%; width:${gain}%"></i></div><span class="shop-stat-gain up">+${v}</span></div>`);
        });
      }
      if (fx.stam) {
        const curr = Math.min(100, Math.max(0, p.stamina || 70));
        const gain = Math.min(100 - curr, Math.max(0, fx.stam));
        bars.push(`<div class="shop-stat-row"><span class="shop-stat-lbl">${T('card.stamina')}</span><div class="shop-stat-track"><i class="shop-stat-fill sta" style="left:0; width:${curr}%"></i><i class="shop-stat-delta up" style="left:${curr}%; width:${gain}%"></i></div><span class="shop-stat-gain up">+${fx.stam}</span></div>`);
      }
      if (fx.mor) {
        const curr = Math.min(100, Math.max(0, p.morale || 70));
        const gain = Math.min(100 - curr, Math.max(0, fx.mor));
        bars.push(`<div class="shop-stat-row"><span class="shop-stat-lbl">${T('card.morale')}</span><div class="shop-stat-track"><i class="shop-stat-fill mor" style="left:0; width:${curr}%"></i><i class="shop-stat-delta up" style="left:${curr}%; width:${gain}%"></i></div><span class="shop-stat-gain up">+${fx.mor}</span></div>`);
      }
      if (fx.hype) {
        const curr = Math.min(100, Math.max(0, p.hype || 0));
        const gainVal = fx.hype * 5;
        const gain = Math.min(100 - curr, Math.max(0, gainVal));
        bars.push(`<div class="shop-stat-row"><span class="shop-stat-lbl">${T('card.hype')}</span><div class="shop-stat-track"><i class="shop-stat-fill hype" style="left:0; width:${curr}%"></i><i class="shop-stat-delta up" style="left:${curr}%; width:${gain}%"></i></div><span class="shop-stat-gain up">+${gainVal}</span></div>`);
      }
      if (fx.special === 'superAgent') {
        const curr = 50;
        const gain = 25;
        bars.push(`<div class="shop-stat-row"><span class="shop-stat-lbl">${T('agent.negotiation') || 'Negotiation'}</span><div class="shop-stat-track"><i class="shop-stat-fill super" style="left:0; width:${curr}%"></i><i class="shop-stat-delta up" style="left:${curr}%; width:${gain}%"></i></div><span class="shop-stat-gain up">+25</span></div>`);
      }

      const isAlreadyBought = state.shopPurchasedIds && state.shopPurchasesSeason === state.season && state.shopPurchasedIds.includes(it.id);
      const cardDisabled = !canBuy || !it.affordable || isAlreadyBought;
      const btnText = isAlreadyBought ? T('shop.purchased') : E().fmtValue(it.cost);
      const card = h('div', 'shop-item' + (cardDisabled ? ' disabled' : ''));
      card.innerHTML = `<b>${esc(TD('consumable', it, 'name'))}</b><i>${esc(TD('consumable', it, 'desc'))}</i>
        <div class="shop-stat-preview">${bars.join('')}</div>
        <button class="shop-buy" ${cardDisabled ? 'disabled' : ''}>${btnText}</button>`;
      if (canBuy && it.affordable && !isAlreadyBought) {
        card.querySelector('.shop-buy').onclick = () => { if (m) m.close(); handlers.onShopBuy(it.id); };
      }
      grid.appendChild(card);
    });
    c.appendChild(grid);
    const close = h('button', 'primary-btn ghost', T('shop.close'));
    c.appendChild(close);
    m = modal(c, { wide: true });
    close.onclick = () => m.close();
  }

  function showConfirm(opts) {
    const c = h('div', 'outcome');
    c.innerHTML = `<div class="outcome-kicker">${esc(opts.kicker)}</div>
      <h3>${esc(opts.title)}</h3><p>${esc(opts.text)}</p>` +
      (opts.warn ? `<p class="retire-warn">${esc(opts.warn)}</p>` : '');
    const row = h('div', 'btn-row');
    const yes = h('button', 'primary-btn' + (opts.danger ? ' danger' : ''), opts.yesLabel || T('btn.confirm'));
    const no = h('button', 'primary-btn ghost', opts.noLabel || T('btn.cancel'));
    row.appendChild(yes);
    row.appendChild(no);
    c.appendChild(row);
    const m = modal(c);
    yes.onclick = () => { m.close(); opts.onYes && opts.onYes(); };
    no.onclick = () => m.close();
  }

  function showRetireConfirm(state, handlers) {
    const type = E().retireType(state);
    showConfirm({
      kicker: T('retire.kicker'),
      title: T('retire.title', { age: state.player.age }),
      text: T('blurb.' + type),
      warn: T('retire.warn'),
      yesLabel: T('retire.yes'), noLabel: T('retire.no'), danger: true,
      onYes: handlers.onRetireConfirm,
    });
  }

  /* ================= SUMMARY ================= */
  function renderSummary(rootEl, state, handlers) {
    const sum = E().careerSummary(state);
    const nat = E().countryById(sum.countryId);
    rootEl.innerHTML = '';
    const wrap = h('div', 'summary-wrap');

    const tier = E().getTier(sum.peakOvr);
    const hero = h('div', `summary-hero glass tier-${tier}`);
    const blurb = T('blurb.' + sum.retireType);
    hero.innerHTML = `
      <div class="sr-kicker">${T('summary.kicker', { n: sum.seasons, s: sum.seasons === 1 ? '' : 'S' })}</div>
      <h1>${esc(sum.name)} <span class="sum-num">#${sum.number}</span></h1>
      <div class="sum-blurb">${esc(blurb)}</div>
      <div class="sum-quote">"${esc(sum.quote)}"</div>`;
    const heroFlag = h('div', 'sum-hero-flag');
    heroFlag.appendChild(flagEl(nat.code, 160));
    hero.appendChild(heroFlag);
    // Language toggle in summary hero
    hero.appendChild(langToggle(() => renderSummary(rootEl, state, handlers)));
    wrap.appendChild(hero);

    const grid = h('div', 'sum-grid');
    const statBox = (label, val, sub) =>
      `<div class="sum-box glass"><span>${label}</span><b>${val}</b><i>${sub || ''}</i></div>`;
    grid.innerHTML =
      statBox(T('summary.peakOvr'), sum.peakOvr, T('summary.reachedIn', { year: sum.peakOvrYear })) +
      statBox(T('summary.peakValue'), E().fmtValue(sum.peakValue), T('summary.inYear', { year: sum.peakValueYear })) +
      (sum.isGK
        ? statBox(T('summary.savesLabel'), sum.totals.saves, T('summary.cleanSheetsN', { n: sum.totals.cleanSheets })) +
          statBox(T('summary.goalsConceded'), sum.totals.conceded, T('summary.appsN', { n: sum.totals.apps }))
          : statBox(T('summary.goalsLabel'), sum.totals.goals, T('summary.appsN', { n: sum.totals.apps })) +
          statBox(T('summary.assistsLabel'), sum.totals.assists, T('summary.allComps'))) +
      statBox(T('summary.earnings'), E().fmtValue(sum.earnings), sum.spent ? T('summary.onConsumables', { amount: E().fmtValue(sum.spent) }) : T('summary.everyCent')) +
      statBox(T('summary.legacyScore'), sum.legacy, T('summary.legacyMetric'));
    wrap.appendChild(grid);

    // Trophy shelf
    const totalTr = Object.values(sum.counts).reduce((a, b) => a + b, 0);
    const shelf = h('div', 'sum-shelf glass');
    shelf.innerHTML = `<h2>${T('summary.trophyCabinet')} <em>${T('summary.trophiesN', { n: totalTr })}</em></h2>`;
    const chipsRow = h('div', 'shelf-chips');
    [['League', '🏆', T('summary.trLeague')], ['Cup', '🥈', T('summary.trCup')], ['Continental', '🌟', T('summary.trContinental')], ['Country', '🌍', T('summary.trCountry')]].forEach(([k, emo, label]) => {
      if (sum.counts[k]) chipsRow.appendChild(h('span', 'tr-chip tr-big', `${emo} ${label} × ${sum.counts[k]}`));
    });
    if (!totalTr) chipsRow.appendChild(h('span', 'shelf-empty', T('summary.bareShelves')));
    shelf.appendChild(chipsRow);
    wrap.appendChild(shelf);

    // Individual awards
    if (sum.awards && sum.awards.length) {
      const awBox = h('div', 'sum-shelf glass');
      awBox.innerHTML = `<h2>${T('summary.awards')}</h2>`;
      const awRow = h('div', 'shelf-chips');
      const order = { 'ballon-dor': 0, 'the-best': 1, 'golden-boy': 2, 'puskas': 3, 'tots': 4 };
      sum.awards.sort((a, b) => (order[a.id] ?? 9) - (order[b.id] ?? 9)).forEach((a) => {
        const chip = h('span', 'award-chip', `${a.icon} ${esc(a.name)} × ${a.count}`);
        chip.title = a.years.join(', ');
        awRow.appendChild(chip);
      });
      awBox.appendChild(awRow);
      wrap.appendChild(awBox);
    }

    // Country card
    const cc = h('div', 'sum-country glass');
    cc.innerHTML = `<h2>${T('summary.intCareer')}</h2>`;
    const ccRow = h('div', 'sum-country-row');
    ccRow.appendChild(flagEl(nat.code, 160));
    const ccInfo = h('div', 'sum-country-info');
    ccInfo.innerHTML = `<b>${esc(nat.name)}</b>
      <span>${sum.isGK ? T('summary.capsOnly', { caps: sum.totals.caps }) : T('summary.capsGoals', { caps: sum.totals.caps, goals: sum.totals.ntGoals })}</span>`;
    if (sum.ntTrophies.length) {
      const tt = h('div', 'hrow-trophies');
      sum.ntTrophies.forEach((t) => tt.appendChild(h('span', 'tr-chip tr-country', `🏆 ${esc(t.name)} ${t.year}`)));
      ccInfo.appendChild(tt);
    } else {
      ccInfo.innerHTML += `<i>${T('summary.noIntTrophies')}</i>`;
    }
    ccRow.appendChild(ccInfo);
    cc.appendChild(ccRow);
    wrap.appendChild(cc);

    // Clubs
    const clubsBox = h('div', 'sum-clubs');
    clubsBox.appendChild(h('h2', '', T('summary.clubCareer')));
    sum.stints.forEach((s) => {
      const club = E().clubByCid(s.cid);
      const card = h('div', 'sum-club glass');
      const head2 = h('div', 'sum-club-head');
      head2.appendChild(badgeEl(club, 40));
      const ttl = h('div', 'sum-club-title');
      const seasonText = s.seasons > 1 ? T('sum.seasons', { n: s.seasons }) : T('sum.season1');
      ttl.innerHTML = `<b>${esc(s.clubName)}</b><i>${s.firstYear} — ${s.lastYear} · ${seasonText} · ${esc(s.league)}</i>`;
      head2.appendChild(ttl);
      card.appendChild(head2);
      const line = sum.isGK
        ? `<span>${s.apps} APP</span><span>${s.saves} SAV</span><span>${s.conceded} GC</span><span>${s.cleanSheets} CS</span>`
        : `<span>${s.apps} APP</span><span>${s.goals} G</span><span>${s.assists} A</span>`;
      card.appendChild(h('div', 'hrow-stats', line));
      if (s.trophies.length) {
        const tr = h('div', 'hrow-trophies');
        const grouped = {};
        s.trophies.forEach((t) => { grouped[t.name] = (grouped[t.name] || 0) + 1; });
        Object.entries(grouped).forEach(([n, c2]) => tr.appendChild(h('span', 'tr-chip', `🏆 ${esc(n)}${c2 > 1 ? ' ×' + c2 : ''}`)));
        card.appendChild(tr);
      }
      clubsBox.appendChild(card);
    });
    wrap.appendChild(clubsBox);

    const again = h('button', 'start-btn', T('summary.newCareer'));
    again.onclick = handlers.onRestart;
    wrap.appendChild(again);

    rootEl.appendChild(wrap);
    confetti();
  }

  /* ================= ROOT RENDER ================= */
  function renderGame(state, handlers) {
    const left = document.getElementById('player-panel');
    const center = document.getElementById('stage-panel');
    const right = document.getElementById('history-panel');
    left.innerHTML = '';
    left.appendChild(playerCard(state));
    renderStage(center, state, handlers);
    renderHistory(right, state, handlers);
  }

  root.UI = {
    renderSetup, renderGame, renderSummary,
    showOutcome, showSeasonResult, showShop, showRetireConfirm, showConfirm,
    showRiskReveal, showPenaltyMini, showTimingMini, showGkPenaltyMini, showNtCallUpModal, showNaturalizationModal, confetti,
    h, esc,
  };
})(typeof window !== 'undefined' ? window : globalThis);
