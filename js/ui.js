/* ============================================================
   CAREER MODE '26 — UI rendering (Apple-style dark theme)
   ============================================================ */
(function (root) {
  'use strict';

  const D = () => root.GAME_DATA;
  const E = () => root.Engine;

  function h(tag, cls, html) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (html !== undefined && html !== null) el.innerHTML = html;
    return el;
  }
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

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
      if (c.k === 'INJ') return `<span class="chip chip-inj">🤕 Injured</span>`;
      if (c.k === 'SHIELD') return `<span class="chip chip-shield">🛡 Physio shield active</span>`;
      if (c.k === 'SUPER') return `<span class="chip chip-hype">🤝 Super-Agent hired</span>`;
      if (c.k === 'HYPE') return `<span class="chip chip-hype">${c.d > 0 ? '+' : ''}${c.d} HYPE</span>`;
      if (c.k === 'STA') return `<span class="chip ${c.d > 0 ? 'chip-sta' : 'chip-down'}">${c.d > 0 ? '+' : ''}${c.d} STA</span>`;
      if (c.k === 'MOR') return `<span class="chip ${c.d > 0 ? 'chip-mor' : 'chip-down'}">${c.d > 0 ? '+' : ''}${c.d} MOR</span>`;
      return `<span class="chip ${c.d > 0 ? 'chip-up' : 'chip-down'}">${c.d > 0 ? '+' : ''}${c.d} ${c.k}</span>`;
    }).join('');
    return `<div class="stat-chips">${html}</div>`;
  }

  const TIER_LABEL = { bronze: 'BRONZE', silver: 'SILVER', gold: 'GOLD', diamond: 'ICON' };

  /* ================= SETUP SCREEN ================= */
  function renderSetup(rootEl, opts) {
    const data = D();
    rootEl.innerHTML = '';
    const wrap = h('div', 'setup-wrap');

    const hero = h('div', 'setup-hero');
    hero.innerHTML = `
      <h1 class="hero-title">CAREER MODE <span>'26</span></h1>
      <p class="hero-sub">Age 14 to 40. From academy nobody to football immortality.
      Every season: one dilemma, one training camp, one career-defining club call.</p>`;
    wrap.appendChild(hero);

    const grid = h('div', 'setup-grid');

    // LEFT PANEL: Name, Shirt #, Position Pitch
    const leftCol = h('div', 'setup-col glass');
    const row1 = h('div', 'setup-row');
    row1.innerHTML = `
      <label class="field grow"><span>Player name</span>
        <input id="inp-name" type="text" maxlength="24" placeholder="e.g. Lío Fernández" autocomplete="off">
      </label>
      <label class="field num"><span>Shirt №</span>
        <input id="inp-number" type="number" min="1" max="99" value="10">
      </label>`;
    leftCol.appendChild(row1);

    const PITCH_COORDS = {
      GK: [50, 90], LB: [13, 71], CB: [50, 75], RB: [87, 71],
      LM: [13, 49], CM: [50, 51], RM: [87, 49],
      CAM: [50, 37], LW: [17, 23], RW: [83, 23], ST: [50, 13],
    };
    const posWrap = h('div', 'field');
    posWrap.innerHTML = `<span>Position <em class="field-note">tap a spot on the pitch</em></span>`;
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
      b.title = p.label;
      b.style.left = x + '%';
      b.style.top = y + '%';
      pitch.appendChild(b);
    });
    const posLabel = h('div', 'pitch-label', 'Select your position');
    posWrap.appendChild(pitch);
    posWrap.appendChild(posLabel);
    leftCol.appendChild(posWrap);
    grid.appendChild(leftCol);

    // RIGHT PANEL: Nationality search & grid, Action buttons
    const rightCol = h('div', 'setup-col glass');
    const cWrap = h('div', 'field country-field');
    cWrap.innerHTML = `<span>Nationality</span>`;
    const search = h('input', 'country-search');
    search.type = 'text'; search.placeholder = 'Search country…';
    const cGrid = h('div', 'country-grid');
    data.COUNTRIES.forEach((c) => {
      const b = h('button', 'country-btn');
      b.type = 'button';
      b.dataset.country = c.id;
      b.dataset.name = c.name.toLowerCase();
      const f = flagEl(c.code, 80);
      b.appendChild(f);
      b.appendChild(h('i', '', esc(c.name)));
      b.appendChild(h('em', '', `#${c.rank}`));
      cGrid.appendChild(b);
    });
    cWrap.appendChild(search);
    cWrap.appendChild(cGrid);
    rightCol.appendChild(cWrap);

    const actions = h('div', 'setup-actions');
    const start = h('button', 'start-btn', 'Start Career');
    start.disabled = true;
    actions.appendChild(start);

    if (opts.hasSave) {
      const cont = h('button', 'continue-btn', '▶ Continue saved career');
      cont.type = 'button';
      cont.onclick = () => opts.onContinue();
      actions.appendChild(cont);
    }

    const importLabel = h('label', 'continue-btn import-btn', '📂 Import save file (.json)');
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
      posLabel.textContent = `${def.id} — ${def.label}${def.gk ? ' · keeper stats: REF / LEA / VIS / COM' : ''}`;
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
    flagBox.appendChild(h('em', '', esc(nat.name)));
    top.appendChild(flagBox);
    card.appendChild(top);

    card.appendChild(h('div', 'pcard-tier-label', TIER_LABEL[p.tier]));

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
      clubRow.appendChild(h('span', 'pcard-club-name', `<em>Unattached · choosing academy</em>`));
    }
    card.appendChild(clubRow);

    card.appendChild(h('div', 'pcard-value', `<b>${E().fmtValue(p.value)}</b><span>market value</span>`));

    const sg = h('div', 'pcard-stats');
    stats.forEach((s) => {
      const v = p.stats[s.k];
      const row = h('div', 'pstat');
      row.innerHTML = `<span class="pstat-name">${s.name}</span>
        <span class="pstat-bar"><i style="width:${v}%"></i></span>
        <span class="pstat-val">${v}</span>`;
      sg.appendChild(row);
    });
    card.appendChild(sg);

    // Condition bars: stamina, morale, loyalty & hype
    const cond = h('div', 'pcard-cond');
    [
      ['Stamina', p.stamina, 'sta', 100],
      ['Morale', p.morale, 'mor', 100],
      ['Loyalty', p.loyalty || 20, 'loyalty', 100],
      ['Hype', p.hype || 0, 'hype', 100]
    ].forEach(([label, v, cls, maxVal]) => {
      const pct = Math.min(100, Math.round((v / maxVal) * 100));
      const row = h('div', 'cond-row');
      row.innerHTML = `<span class="cond-name">${label}</span>
        <span class="cond-bar"><i class="${cls}" style="width:${pct}%"></i></span>
        <span class="cond-val">${v}</span>`;
      cond.appendChild(row);
    });
    if (state.superAgent) {
      cond.appendChild(h('div', 'pcard-sa-badge', '🤝 Super-Agent Active'));
    }
    card.appendChild(cond);

    // Money block
    const money = h('div', 'pcard-money');
    money.innerHTML = `<span class="money-item">💰 <b>${E().fmtValue(p.salary)}</b>/yr</span>
      <span class="money-item">🏦 <b>${E().fmtValue(state.earnings - state.spent)}</b> banked</span>`;
    card.appendChild(money);

    const caps = state.totals.caps;
    card.appendChild(h('div', 'pcard-meta',
      `<span>Age <b>${p.age}</b></span><span>Season <b>${state.season}</b></span>` +
      (caps ? `<span>Caps <b>${caps}</b></span>` : '')));
    return card;
  }

  /* ================= STAGE AREA ================= */
  function stageHeader(state, active) {
    const club = state.club ? E().clubByCid(state.club.cid) : null;
    const head = h('div', 'stage-head');
    const left = h('div', 'stage-title');
    left.innerHTML = `<div class="stage-season">Season ${state.season}</div>
      <div class="stage-sub">Age ${state.player.age}${club ? ' · ' + esc(club.n) : ''}</div>`;
    head.appendChild(left);
    const right = h('div', 'stage-right');
    const steps = h('div', 'stage-steps');
    ['decision', 'booster', 'club'].forEach((s) => {
      const labels = { decision: 'Decision', booster: 'Training', club: 'Club' };
      const cls = 'step' + (s === active ? ' active' : '') +
        (['decision', 'booster', 'club'].indexOf(s) < ['decision', 'booster', 'club'].indexOf(active) ? ' done' : '');
      steps.appendChild(h('span', cls, labels[s]));
    });
    right.appendChild(steps);
    if (state.club) {
      const actions = h('div', 'stage-actions');
      const shopped = state.shopSeason === state.season;
      actions.innerHTML = `
        <button class="icon-btn" data-action="shop" title="Club shop (1 per season)">🛒${shopped ? '' : '<i class="dot"></i>'}</button>
        <button class="icon-btn" data-action="menu" title="Game menu">⚙</button>
        <div class="menu-pop hidden" id="game-menu">
          <button data-action="export">💾 Export save</button>
          <button data-action="retire">👟 Retire now</button>
          <button data-action="restart" class="menu-danger">↺ New game</button>
        </div>`;
      right.appendChild(actions);
    }
    head.appendChild(right);
    return head;
  }

  function clubCard(club, opts) {
    const card = h('button', 'pick-card club-pick');
    card.type = 'button';
    const topRow = h('div', 'club-pick-top');
    topRow.appendChild(badgeEl(club, 44));
    const nm = h('div', 'club-pick-name');
    nm.innerHTML = `<b>${esc(club.n)}</b><i>${esc(club.league)} · ${esc(club.countryName || '')}</i>`;
    topRow.appendChild(nm);
    if (opts.chip) topRow.appendChild(h('span', `type-chip ${opts.chipCls || ''}`, opts.chip));
    card.appendChild(topRow);
    const meter = h('div', 'strength');
    meter.innerHTML = `<span>Club level</span><div class="strength-bar"><i style="width:${club.s}%"></i></div><b>${club.s}</b>`;
    card.appendChild(meter);
    if (opts.role) card.appendChild(h('div', 'pick-role', esc(opts.role)));
    if (opts.note) card.appendChild(h('div', 'pick-note', esc(opts.note)));
    if (opts.fee) card.appendChild(h('div', 'pick-fee', `Fee: <b>${E().fmtValue(opts.fee)}</b>`));
    return card;
  }

  function renderStage(rootEl, state, handlers) {
    rootEl.innerHTML = '';
    const stage = state.stage;

    if (stage === 'academy') {
      rootEl.appendChild(stageHeader(state, 'decision'));
      const box = h('div', 'stage-body');
      box.appendChild(h('div', 'stage-intro',
        `<h2>Choose your academy</h2><p>You're 14. Scouts from three ${esc(E().countryById(state.player.countryId).league)} clubs
        are at your door. This choice shapes your development — elite facilities or early minutes.</p>`));
      const grid = h('div', 'pick-grid');
      state.currentAcademies.forEach((a) => {
        const card = clubCard(a.club, { role: a.role, note: a.note, chip: 'ACADEMY', chipCls: 'chip-academy' });
        card.onclick = () => handlers.onAcademy(a.cid);
        grid.appendChild(card);
      });
      box.appendChild(grid);
      rootEl.appendChild(box);
      return;
    }

    if (stage === 'decision') {
      rootEl.appendChild(stageHeader(state, 'decision'));
      const box = h('div', 'stage-body');
      const d = state.currentDecision;
      if (!d) {
        box.appendChild(h('div', 'stage-intro', `<h2>Quiet week</h2><p>No drama this season. The media is busy with someone else's scandal.</p>`));
        const btn = h('button', 'primary-btn', 'Continue');
        btn.onclick = handlers.onDecisionSkip;
        box.appendChild(btn);
      } else {
        box.appendChild(h('div', 'situation glass', `
          <div class="sit-kicker">${esc(d.kicker || 'DRESSING ROOM TALK')}</div>
          <h2>${esc(d.title)}</h2>
          <p>${esc(d.desc)}</p>`));
        const optKeys = ['a', 'b', 'c'].filter((k) => d[k]);
        const grid = h('div', `pick-grid ${optKeys.length === 2 ? 'two' : ''}`);
        optKeys.forEach((k) => {
          const o = d[k];
          const card = h('button', `pick-card option-${k}`);
          card.type = 'button';
          let odds = '';
          if (o.fx && o.fx.risk) {
            odds = `<span class="odds-chip risk-5050">🎲 50/50 COIN ROLL · ${Math.round(o.fx.risk.p * 100)}% UPSIDE</span>`;
          } else if (o.mini) {
            const mType = o.mini.type === 'penalty' ? '⚽ PENALTY KICK' : o.mini.type === 'gk_penalty' ? '🧤 PENALTY SAVE' : '⚡ TIMING MINIGAME';
            odds = `<span class="odds-chip mini-badge">${mType}</span>`;
          }
          card.innerHTML = `<div class="option-letter">${k.toUpperCase()}</div>
            <b>${esc(o.label)}</b><i>${esc(o.sub || '')}</i>${odds}`;
          card.onclick = () => handlers.onDecision(k);
          grid.appendChild(card);
        });
        box.appendChild(grid);
      }
      rootEl.appendChild(box);
      return;
    }

    if (stage === 'booster') {
      rootEl.appendChild(stageHeader(state, 'booster'));
      const box = h('div', 'stage-body');
      box.appendChild(h('div', 'stage-intro',
        `<h2>Off-season training</h2><p>Pick one program. Rarer camps give bigger boosts — gold can transform multiple stats.</p>`));
      const grid = h('div', 'pick-grid');
      state.currentBoosters.forEach((b) => {
        const fx = E().boosterFx(state, b);
        const chips = Object.entries(fx).map(([k, v]) => `<span class="chip chip-up">+${v} ${k}</span>`).join('');
        const card = h('button', `pick-card rarity-${b.rarity}`);
        card.type = 'button';
        card.innerHTML = `<div class="rarity-tag">${b.rarity.toUpperCase()}</div>
          <b>${esc(b.title)}</b><i>${esc(b.desc)}</i><div class="stat-chips">${chips}</div>`;
        card.onclick = () => handlers.onBooster(b.id);
        grid.appendChild(card);
      });
      box.appendChild(grid);
      rootEl.appendChild(box);
      return;
    }

    if (stage === 'club') {
      rootEl.appendChild(stageHeader(state, 'club'));
      const box = h('div', 'stage-body');
      box.appendChild(h('div', 'stage-intro',
        `<h2>The club decision</h2><p>Your agent lays the offers on the table. Where does season ${state.season} happen?</p>`));
      const grid = h('div', 'pick-grid');
      state.currentOffers.forEach((o, idx) => {
        const chipMap = { stay: 'STAY', transfer: 'TRANSFER', loan: 'LOAN', released: 'RELEASED', return: 'RETURN' };
        const card = clubCard(o.club, {
          role: o.role, note: o.note, fee: o.type === 'transfer' ? o.fee : null,
          chip: chipMap[o.type] || o.type.toUpperCase(), chipCls: `chip-${o.type === 'return' ? 'stay' : o.type}`,
        });
        card.onclick = () => handlers.onClub(idx);
        grid.appendChild(card);
      });
      box.appendChild(grid);
      rootEl.appendChild(box);
      return;
    }

    if (stage === 'sim') {
      rootEl.appendChild(stageHeader(state, 'club'));
      const box = h('div', 'stage-body sim-body');
      box.innerHTML = `
        <h2>Simulating season ${state.season}…</h2>
        <div class="sim-line" id="sim-line">Warming up…</div>
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
    head.appendChild(h('span', 'hrow-age', `${r.age} y/o`));
    head.appendChild(badgeEl(club, 24));
    const nameBox = h('div', 'hrow-club');
    nameBox.innerHTML = `<b>${esc(r.clubName)}</b><i>${esc(r.league)}${r.loan ? ' · loan' : ''}</i>`;
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
      rootEl.appendChild(h('div', 'history-empty', 'Join a club to see the league.'));
      return;
    }
    const country = E().countryById(club.countryId);
    const head2 = h('div', 'league-head');
    head2.innerHTML = `<b>${esc(country.league)}</b><i>${state.standings ? 'Final table ' + (state.season - 1) : 'Pre-season — by squad strength'}</i>`;
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
      rootEl.appendChild(h('div', 'history-empty', 'No seasons played yet.<br>The story starts now.'));
      return;
    }

    const box = h('div', 'summary-tab-container');
    const stints = Object.values(state.clubStints || {});
    stints.forEach((stint) => {
      const club = E().clubByCid(stint.cid);
      if (!club) return;
      const card = h('div', 'summary-stint-card glass');

      const clubSeasons = state.history.filter((r) => r.cid === stint.cid);
      const avgRating = clubSeasons.length
        ? (clubSeasons.reduce((acc, r) => acc + r.rating, 0) / clubSeasons.length).toFixed(1)
        : '—';

      const trophyCounts = {};
      (stint.trophies || []).forEach((t) => {
        trophyCounts[t.name] = (trophyCounts[t.name] || 0) + 1;
      });
      const trophyChips = Object.entries(trophyCounts).map(([name, count]) => `${count}x ${name}`);

      const yearRange = stint.firstYear === stint.lastYear
        ? `${stint.firstYear} (${stint.seasons} ${stint.seasons === 1 ? 'season' : 'seasons'})`
        : `${stint.firstYear} – ${stint.lastYear} (${stint.seasons} seasons)`;

      const statLine = state.player.isGK
        ? `<span><b>${stint.apps}</b> Apps</span><span><b>${stint.saves}</b> Saves</span><span><b>${stint.conceded}</b> GC</span><span><b>${stint.cleanSheets}</b> CS</span>`
        : `<span><b>${stint.apps}</b> Apps</span><span><b>${stint.goals}</b> Goals</span><span><b>${stint.assists}</b> Assists</span>`;

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

      if (trophyChips.length) {
        const trDiv = h('div', 'stint-trophies', trophyChips.map(t => `<span class="tr-chip tr-big">🏆 ${esc(t)}</span>`).join(''));
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

      const ntStatLine = state.player.isGK
        ? `<span><b>${t.caps}</b> Caps</span><span><b>${t.cleanSheets}</b> Clean Sheets</span>`
        : `<span><b>${t.caps}</b> Caps</span><span><b>${t.ntGoals}</b> Goals</span>`;

      const stintHead = h('div', 'stint-head');
      stintHead.appendChild(flagEl(nat.code, 40));

      const stintInfo = h('div', 'stint-info');
      const debutText = state.ntFirstYear ? `Debut: ${state.ntFirstYear}` : 'National Duty';
      stintInfo.innerHTML = `<b class="stint-club-name">${esc(nat.name)} National Team</b>
        <span class="stint-years">${debutText} · FIFA Rank #${nat.rank}</span>`;
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

  function renderHistory(rootEl, state) {
    rootEl.innerHTML = '';
    const tabs = h('div', 'hist-tabs');
    [['summary', 'Summary'], ['career', 'Career History'], ['league', 'League Table']].forEach(([id, label]) => {
      const t = h('button', 'hist-tab' + (histTab === id ? ' active' : ''), label);
      t.type = 'button';
      t.onclick = () => { histTab = id; renderHistory(rootEl, state); };
      tabs.appendChild(t);
    });
    rootEl.appendChild(tabs);

    if (histTab === 'summary') {
      renderSummaryTab(rootEl, state);
      return;
    }
    if (histTab === 'league') {
      renderStandings(rootEl, state);
      return;
    }
    if (!state.history.length) {
      rootEl.appendChild(h('div', 'history-empty', 'No seasons played yet.<br>The story starts now.'));
      return;
    }
    const list = h('div', 'history-list');
    state.history.forEach((r) => list.appendChild(historyRow(r)));
    rootEl.appendChild(list);
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
    xBtn.title = 'Close';
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

  function showOutcome(title, text, changes, onDone) {
    let doneCalled = false;
    const finish = () => {
      if (!doneCalled) {
        doneCalled = true;
        onDone();
      }
    };
    const c = h('div', 'outcome');
    c.innerHTML = `<div class="outcome-kicker">THE OUTCOME</div><h3>${esc(title)}</h3><p>${esc(text)}</p>`;
    c.innerHTML += statChips(changes);
    const btn = h('button', 'primary-btn', 'Continue');
    c.appendChild(btn);
    const m = modal(c, { onClose: finish });
    btn.onclick = () => { m.close(); };
  }

  function headlineFor(res) {
    const H = D().HEADLINES;
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
      <div class="sr-kicker">SEASON ${res.year} COMPLETE</div>
      <h3 class="sr-headline">${esc(headline)}</h3>
      <div class="sr-clubline">${esc(res.clubName)} · Age ${res.age}</div>
      <div class="sr-grid">
        <div class="sr-stat"><b>${res.apps}</b><span>Apps</span></div>
        ${gk
          ? `<div class="sr-stat"><b>${res.saves}</b><span>Saves</span></div>
             <div class="sr-stat"><b>${res.conceded}</b><span>Conceded</span></div>
             <div class="sr-stat"><b>${res.cleanSheets}</b><span>Clean sheets</span></div>`
          : `<div class="sr-stat"><b>${res.goals}</b><span>Goals</span></div>
             <div class="sr-stat"><b>${res.assists}</b><span>Assists</span></div>
             <div class="sr-stat"><b>★ ${res.rating.toFixed(1)}</b><span>Avg rating</span></div>`}
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
      c.appendChild(h('div', 'sr-caps', `🌍 ${res.caps} international caps${res.ntGoals ? ` · ${res.ntGoals} goals for ${esc(E().countryById(p.countryId).name)}` : ''}`));
    }

    // Player Card Stat Bars with +/- offsets & Condition bars
    const statsBox = h('div', 'sr-player-stats');
    statsBox.innerHTML = `<div class="sr-stats-title">PLAYER STATS & SEASON EVOLUTION</div>`;
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
        <span class="sr-pstat-name">${esc(s.name)}</span>
        <div class="sr-pstat-bar-track">${barHtml}</div>
        <span class="sr-pstat-val">${valHtml}</span>`;
      rows.appendChild(row);
    });

    // Divider & Condition Bars (Stamina & Morale)
    rows.appendChild(h('div', 'sr-cond-divider'));

    const staRow = h('div', 'sr-pstat-row');
    staRow.innerHTML = `
      <span class="sr-pstat-name">Stamina</span>
      <div class="sr-pstat-bar-track"><i class="sr-bar-base sr-bar-sta" style="width:${p.stamina}%"></i></div>
      <span class="sr-pstat-val">${p.stamina}</span>`;
    rows.appendChild(staRow);

    const morRow = h('div', 'sr-pstat-row');
    morRow.innerHTML = `
      <span class="sr-pstat-name">Morale</span>
      <div class="sr-pstat-bar-track"><i class="sr-bar-base sr-bar-mor" style="width:${p.morale}%"></i></div>
      <span class="sr-pstat-val">${p.morale}</span>`;
    rows.appendChild(morRow);

    const loyRow = h('div', 'sr-pstat-row');
    loyRow.innerHTML = `
      <span class="sr-pstat-name">Loyalty</span>
      <div class="sr-pstat-bar-track"><i class="sr-bar-base sr-bar-loyalty" style="width:${p.loyalty || 20}%"></i></div>
      <span class="sr-pstat-val">${p.loyalty || 20}</span>`;
    rows.appendChild(loyRow);

    statsBox.appendChild(rows);
    c.appendChild(statsBox);

    if (res.notes.length) {
      c.appendChild(h('div', 'sr-notes', res.notes.map((n) => `📰 ${esc(n)}`).join('<br>')));
    }

    const ovrDelta = res.ovrAfter - res.ovrBefore;
    c.appendChild(h('div', 'sr-ovr',
      `<span>OVR <b>${res.ovrBefore}</b> → <b class="${ovrDelta > 0 ? 'up' : ovrDelta < 0 ? 'down' : ''}">${res.ovrAfter}</b></span>
       <span>Value <b>${E().fmtValue(res.valueAfter)}</b></span>`));

    const btn = h('button', 'primary-btn', state.retired ? 'See your legacy' : `Start season ${state.season}`);
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
        <div class="risk-panel good" id="rp-good">✨<span>GOOD</span></div>
        <div class="risk-panel bad" id="rp-bad">💀<span>BAD</span></div>
      </div>
      <div class="risk-hint">Fate is deciding…</div>`;
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
        c.querySelector('.risk-hint').textContent = good ? 'Fortune smiles.' : 'Ouch.';
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
    c.innerHTML = `<div class="outcome-kicker">THE PENALTY</div>
      <h3>Pick your spot</h3>
      <p class="mini-sub">${mini.goodZones || 2} of ${zonesN} zones beat the keeper</p>`;
    const goal = h('div', 'goal');
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
    const verdict = h('div', 'mini-verdict', '');
    c.appendChild(goal);
    c.appendChild(verdict);
    const m = modal(c);

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
        verdict.textContent = scored ? 'GOOOAL!' : 'SAVED!';
        verdict.className = 'mini-verdict show ' + (scored ? 'v-good' : 'v-bad');
        if (scored) confetti();
        setTimeout(() => { m.close(); onResult(scored ? 'good' : 'bad'); }, 1200);
      }, 550);
    });
  }

  // Timing: stop the pointer in the sweet spot
  function showTimingMini(mini, onResult) {
    const c = h('div', 'mini timing-mini');
    c.innerHTML = `<div class="outcome-kicker">TIMING IS EVERYTHING</div>
      <h3>Stop the pointer in the green</h3>
      <p class="mini-sub">Click the bar (or press STRIKE) at the perfect moment</p>`;
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
    const strike = h('button', 'primary-btn', 'STRIKE');
    c.appendChild(bar);
    c.appendChild(verdict);
    c.appendChild(strike);
    const m = modal(c);

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
      if (dist <= sweetW / 2) { key = 'good'; label = 'PERFECT!'; cls = 'v-good'; }
      else if (dist <= sweetW * 1.4 && mini.results.mid) { key = 'mid'; label = 'Close...'; cls = 'v-mid'; }
      else { key = mini.results.mid ? 'bad' : (dist <= sweetW * 1.4 ? 'good' : 'bad'); label = dist <= sweetW * 1.4 ? 'Just about!' : 'Miles off.'; cls = dist <= sweetW * 1.4 ? 'v-mid' : 'v-bad'; }
      sweet.classList.add(key === 'good' ? 'hit' : 'miss');
      verdict.textContent = label;
      verdict.className = 'mini-verdict show ' + cls;
      if (key === 'good') confetti();
      setTimeout(() => { m.close(); onResult(key); }, 1100);
    };
    bar.addEventListener('click', finish);
    strike.addEventListener('click', finish);
  }

  // Goalkeeper Penalty Save Minigame
  function showGkPenaltyMini(mini, onResult) {
    const c = h('div', 'mini gk-penalty-mini');
    c.innerHTML = `<div class="outcome-kicker">PENALTY SAVE</div>
      <h3>Choose your dive direction</h3>
      <p class="mini-sub">Predict where the striker is placing the ball!</p>`;

    const goal = h('div', 'gk-goal');
    const striker = h('div', 'mini-striker', '⚽ 🏃');
    const ball = h('div', 'mini-ball', '⚽');
    goal.appendChild(striker);
    goal.appendChild(ball);

    const btnRow = h('div', 'gk-dive-btns');
    const directions = [
      { id: 'left', label: '⬅️ DIVE LEFT' },
      { id: 'center', label: '🧍 STAND CENTER' },
      { id: 'right', label: '➡️ DIVE RIGHT' }
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
    const m = modal(c);

    btnRow.addEventListener('click', (ev) => {
      const btn = ev.target.closest('.dive-btn');
      if (!btn || goal.classList.contains('done')) return;
      goal.classList.add('done');
      const playerChoice = btn.dataset.dir;
      const strikerChoice = ['left', 'center', 'right'][Math.floor(Math.random() * 3)];
      const saved = playerChoice === strikerChoice;

      verdict.textContent = saved ? '🧤 GREAT SAVE!' : '⚽ GOAL! Wrong direction.';
      verdict.className = 'mini-verdict show ' + (saved ? 'v-good' : 'v-bad');
      if (saved) confetti();
      setTimeout(() => { m.close(); onResult(saved ? 'good' : 'bad'); }, 1200);
    });
  }

  function showNtCallUpModal(state, onDone) {
    const p = state.player;
    const nat = E().countryById(p.countryId);
    const c = h('div', 'nt-callup-modal outcome');
    c.innerHTML = `
      <div class="outcome-kicker">🌍 INTERNATIONAL SELECTION</div>
      <div class="nt-flag-header"><span class="flag-icon-huge">${nat.flag}</span></div>
      <h3>Called up for ${esc(nat.name)}!</h3>
      <p>Your stellar form has earned you a call-up to represent your country on the international stage! (FIFA Rank #${nat.rank})</p>
      <div class="nt-badge-chips">
        <span class="chip tr-country">🌍 National Team Debut</span>
        <span class="chip chip-hype">🔥 International Exposure</span>
      </div>`;
    const btn = h('button', 'primary-btn', 'Represent Your Nation');
    c.appendChild(btn);
    const m = modal(c, { onClose: onDone });
    btn.onclick = () => { m.close(); };
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
    const tierName = (state.player.tier || E().getTier(state.player.ovr) || 'bronze').toUpperCase();

    const c = h('div', 'shop');
    c.innerHTML = `<div class="outcome-kicker">CLUB SHOP · ${tierName} TIER (${countThisSeason}/${maxP} PURCHASES USED)</div>
      <h3>Consumables</h3>
      <div class="shop-balance">Career earnings banked: <b>${E().fmtValue(balance)}</b> · ${maxP - countThisSeason} purchase${(maxP - countThisSeason) === 1 ? '' : 's'} remaining</div>`;

    if (canReroll) {
      const rerollRow = h('div', 'shop-reroll-row');
      const rerollBtn = h('button', 'primary-btn ghost reroll-btn', '🎲 Reroll Shop Options (€50K)');
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
      const fx = (state.player.isGK && it.fxGk) ? it.fxGk : it.fx;
      const chips = [];
      if (fx.stats) Object.entries(fx.stats).forEach(([k, v]) => chips.push(`<span class="chip chip-up">+${v} ${k}</span>`));
      if (fx.stam) chips.push(`<span class="chip chip-sta">+${fx.stam} STA</span>`);
      if (fx.mor) chips.push(`<span class="chip chip-mor">+${fx.mor} MOR</span>`);
      if (fx.hype) chips.push(`<span class="chip chip-hype">+${fx.hype * 5} HYPE</span>`);
      if (fx.special === 'injuryShield') chips.push(`<span class="chip chip-shield">🛡 injury shield</span>`);
      if (fx.special === 'superAgent') chips.push(`<span class="chip chip-hype">🤝 super-agent</span>`);

      const isAlreadyBought = state.shopPurchasedIds && state.shopPurchasesSeason === state.season && state.shopPurchasedIds.includes(it.id);
      const cardDisabled = !canBuy || !it.affordable || isAlreadyBought;
      const btnText = isAlreadyBought ? 'PURCHASED' : E().fmtValue(it.cost);
      const card = h('div', 'shop-item' + (cardDisabled ? ' disabled' : ''));
      card.innerHTML = `<b>${esc(it.name)}</b><i>${esc(it.desc)}</i>
        <div class="stat-chips">${chips.join('')}</div>
        <button class="shop-buy" ${cardDisabled ? 'disabled' : ''}>${btnText}</button>`;
      if (canBuy && it.affordable && !isAlreadyBought) {
        card.querySelector('.shop-buy').onclick = () => { if (m) m.close(); handlers.onShopBuy(it.id); };
      }
      grid.appendChild(card);
    });
    c.appendChild(grid);
    const close = h('button', 'primary-btn ghost', 'Close');
    c.appendChild(close);
    m = modal(c, { wide: true });
    close.onclick = () => m.close();
  }

  const RETIRE_BLURBS = {
    full: 'A complete career. Age 40, nothing left in the tank. Immortal.',
    legend: 'A legend walking away at the summit. Statues incoming.',
    star: 'A star who lit up every stadium they touched.',
    pro: 'A respected professional. Graft, sweat, honor — in that order.',
    journeyman: 'The ultimate journeyman. A shirt in every color, a story in every city.',
    wonderkid: 'The great what-if. Gone before the world saw the full show.',
    quiet: 'A quiet career — but every kid who watched believed a little more.',
  };

  function showConfirm(opts) {
    const c = h('div', 'outcome');
    c.innerHTML = `<div class="outcome-kicker">${esc(opts.kicker)}</div>
      <h3>${esc(opts.title)}</h3><p>${esc(opts.text)}</p>` +
      (opts.warn ? `<p class="retire-warn">${esc(opts.warn)}</p>` : '');
    const row = h('div', 'btn-row');
    const yes = h('button', 'primary-btn' + (opts.danger ? ' danger' : ''), opts.yesLabel || 'Confirm');
    const no = h('button', 'primary-btn ghost', opts.noLabel || 'Cancel');
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
      kicker: 'HANG UP THE BOOTS?',
      title: `Retire at ${state.player.age}?`,
      text: RETIRE_BLURBS[type] || RETIRE_BLURBS.quiet,
      warn: 'This ends the career immediately. There is no undo.',
      yesLabel: 'Retire for good', noLabel: 'Keep playing', danger: true,
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
    const blurb = RETIRE_BLURBS[sum.retireType] || RETIRE_BLURBS.full;
    hero.innerHTML = `
      <div class="sr-kicker">CAREER COMPLETE · ${sum.seasons} SEASON${sum.seasons === 1 ? '' : 'S'}</div>
      <h1>${esc(sum.name)} <span class="sum-num">#${sum.number}</span></h1>
      <div class="sum-blurb">${esc(blurb)}</div>
      <div class="sum-quote">“${esc(sum.quote)}”</div>`;
    const heroFlag = h('div', 'sum-hero-flag');
    heroFlag.appendChild(flagEl(nat.code, 160));
    hero.appendChild(heroFlag);
    wrap.appendChild(hero);

    const grid = h('div', 'sum-grid');
    const statBox = (label, val, sub) =>
      `<div class="sum-box glass"><span>${label}</span><b>${val}</b><i>${sub || ''}</i></div>`;
    grid.innerHTML =
      statBox('Peak overall', sum.peakOvr, `reached in ${sum.peakOvrYear}`) +
      statBox('Peak market value', E().fmtValue(sum.peakValue), `in ${sum.peakValueYear}`) +
      (sum.isGK
        ? statBox('Saves', sum.totals.saves, `${sum.totals.cleanSheets} clean sheets`) +
          statBox('Goals conceded', sum.totals.conceded, `${sum.totals.apps} apps`)
          : statBox('Goals', sum.totals.goals, `${sum.totals.apps} apps`) +
          statBox('Assists', sum.totals.assists, 'all competitions')) +
      statBox('Career earnings', E().fmtValue(sum.earnings), sum.spent ? `${E().fmtValue(sum.spent)} on consumables` : 'every cent saved') +
      statBox('Legacy score', sum.legacy, 'hall of fame metric');
    wrap.appendChild(grid);

    // Trophy shelf
    const totalTr = Object.values(sum.counts).reduce((a, b) => a + b, 0);
    const shelf = h('div', 'sum-shelf glass');
    shelf.innerHTML = `<h2>Trophy Cabinet <em>${totalTr} trophies</em></h2>`;
    const chipsRow = h('div', 'shelf-chips');
    [['League', '🏆'], ['Cup', '🥈'], ['Continental', '🌟'], ['Country', '🌍']].forEach(([k, emo]) => {
      if (sum.counts[k]) chipsRow.appendChild(h('span', 'tr-chip tr-big', `${emo} ${k} × ${sum.counts[k]}`));
    });
    if (!totalTr) chipsRow.appendChild(h('span', 'shelf-empty', 'Bare shelves. The memories were the real trophies. (The fans disagree.)'));
    shelf.appendChild(chipsRow);
    wrap.appendChild(shelf);

    // Individual awards
    if (sum.awards && sum.awards.length) {
      const awBox = h('div', 'sum-shelf glass');
      awBox.innerHTML = `<h2>Individual Awards</h2>`;
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
    cc.innerHTML = `<h2>International career</h2>`;
    const ccRow = h('div', 'sum-country-row');
    ccRow.appendChild(flagEl(nat.code, 160));
    const ccInfo = h('div', 'sum-country-info');
    ccInfo.innerHTML = `<b>${esc(nat.name)}</b>
      <span>${sum.totals.caps} caps${sum.isGK ? '' : ` · ${sum.totals.ntGoals} goals`}</span>`;
    if (sum.ntTrophies.length) {
      const tt = h('div', 'hrow-trophies');
      sum.ntTrophies.forEach((t) => tt.appendChild(h('span', 'tr-chip tr-country', `🏆 ${esc(t.name)} ${t.year}`)));
      ccInfo.appendChild(tt);
    } else {
      ccInfo.innerHTML += `<i>No international trophies — the quarterfinal curse was real.</i>`;
    }
    ccRow.appendChild(ccInfo);
    cc.appendChild(ccRow);
    wrap.appendChild(cc);

    // Clubs
    const clubsBox = h('div', 'sum-clubs');
    clubsBox.appendChild(h('h2', '', 'Club career'));
    sum.stints.forEach((s) => {
      const club = E().clubByCid(s.cid);
      const card = h('div', 'sum-club glass');
      const head2 = h('div', 'sum-club-head');
      head2.appendChild(badgeEl(club, 40));
      const ttl = h('div', 'sum-club-title');
      ttl.innerHTML = `<b>${esc(s.clubName)}</b><i>${s.firstYear} — ${s.lastYear} · ${s.seasons} season${s.seasons > 1 ? 's' : ''} · ${esc(s.league)}</i>`;
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

    const again = h('button', 'start-btn', 'Start New Career');
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
    renderHistory(right, state);
  }

  root.UI = {
    renderSetup, renderGame, renderSummary,
    showOutcome, showSeasonResult, showShop, showRetireConfirm, showConfirm,
    showRiskReveal, showPenaltyMini, showTimingMini, showGkPenaltyMini, showNtCallUpModal, confetti,
    h, esc,
  };
})(typeof window !== 'undefined' ? window : globalThis);
