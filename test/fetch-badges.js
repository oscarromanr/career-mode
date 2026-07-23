/* Build-time tool: resolve club badge URLs via ESPN's public soccer API.
   Output: js/badges.js with a static CID -> logo URL map (hotlinkable, no CORS issues).
   Run: node test/fetch-badges.js */
'use strict';
const DATA = require('../js/data.js');
const fs = require('fs');
const path = require('path');

// Candidate ESPN league codes per country (tried in order)
const LEAGUE_CODES = {
  AR: ['arg.1'], FR: ['fra.1'], ES: ['esp.1'], EN: ['eng.1'], BR: ['bra.1'],
  PT: ['por.1'], NL: ['ned.1'], BE: ['bel.1'], IT: ['ita.1'], DE: ['ger.1'],
  HR: ['cro.1'], MA: ['mar.1'], UY: ['uru.1'], CO: ['col.1'], MX: ['mex.1'],
  US: ['usa.1'], CH: ['sui.1'], JP: ['jpn.1'], SN: ['sen.1'], DK: ['den.1'],
  AT: ['aut.1'], UA: ['ukr.1'], KR: ['kor.1'], EC: ['ecu.1'], AU: ['aus.1'],
  TR: ['tur.1'], SE: ['swe.1'], WA: ['wal.1'], PL: ['pol.1'], RS: ['srb.1'],
  NO: ['nor.1'], EG: ['egy.1'], DZ: ['alg.1'], IR: ['irn.1'], NG: ['nga.1'],
  CI: ['civ.1'], GR: ['gre.1'], TN: ['tun.1'], SC: ['sco.1'], PY: ['par.1'],
  CL: ['chi.1'], PE: ['per.1'], VE: ['ven.1'], CA: ['usa.1', 'can.1'], QA: ['qat.1'],
  SA: ['ksa.1'], ZA: ['rsa.1'], CR: ['crc.1'], CM: ['cmr.1'], ML: ['mli.1'],
};

// Manual aliases: normalized our-name -> normalized ESPN displayName (substring)
const ALIASES = {
  'psv': 'psv eindhoven',
  'chivas': 'guadalajara',
  'hearts': 'heart of midlothian',
  'rapid wien': 'rapid vienna',
  'austria wien': 'austria vienna',
  'inter': 'inter milan',
  'milan': 'ac milan',
  'paris saint-germain': 'paris saint-germain',
  'ulsan hd': 'ulsan hd',
  'jeonbuk': 'jeonbuk hyundai motors',
  'nacional': 'club nacional de football',
  'junior': 'atletico junior',
  'atletico mineiro': 'atletico mg',
  'vitoria guimaraes': 'vitoria de guimaraes',
  'union saint-gilloise': 'union st gilloise',
  'nycfc': 'new york city fc',
  'red bull salzburg': 'rb salzburg',
  'aek': 'aek athens',
  'bodo/glimt': 'bodo/glimt',
};

// Wikipedia page titles for clubs ESPN doesn't cover (fallback)
const WIKI_TITLES = {
  'EN:West Ham': 'West Ham United F.C.',
  'DE:Wolfsburg': 'VfL Wolfsburg',
  'CL:Unión Española': 'Unión Española',
  'ZA:SuperSport United': 'SuperSport United F.C.',
  'CA:Forge FC': 'Forge FC', 'CA:Cavalry FC': 'Cavalry FC',
  'HR:Dinamo Zagreb': 'GNK Dinamo Zagreb', 'HR:Hajduk Split': 'HNK Hajduk Split', 'HR:Rijeka': 'HNK Rijeka',
  'MA:Wydad': 'Wydad AC', 'MA:Raja': 'Raja CA', 'MA:RS Berkane': 'RS Berkane', 'MA:FUS Rabat': 'FUS Rabat',
  'SN:Génération Foot': 'Génération Foot', 'SN:ASC Jaraaf': 'ASC Jaraaf', 'SN:Teungueth FC': 'Teungueth FC', 'SN:Casa Sports': 'Casa Sports',
  'UA:Shakhtar': 'FC Shakhtar Donetsk', 'UA:Dynamo Kyiv': 'FC Dynamo Kyiv', 'UA:Dnipro-1': 'SC Dnipro-1', 'UA:Zorya': 'FC Zorya Luhansk',
  'KR:Ulsan HD': 'Ulsan HD FC', 'KR:Jeonbuk': 'Jeonbuk Hyundai Motors', 'KR:FC Seoul': 'FC Seoul', 'KR:Pohang Steelers': 'Pohang Steelers',
  'PL:Legia Warsaw': 'Legia Warsaw', 'PL:Raków': 'Raków Częstochowa', 'PL:Lech Poznań': 'Lech Poznań',
  'PL:Jagiellonia': 'Jagiellonia Białystok', 'PL:Wisła Kraków': 'Wisła Kraków',
  'RS:Red Star Belgrade': 'Red Star Belgrade', 'RS:Partizan': 'FK Partizan', 'RS:TSC': 'FK TSC', 'RS:Vojvodina': 'FK Vojvodina',
  'EG:Al Ahly': 'Al Ahly SC', 'EG:Pyramids': 'Pyramids FC', 'EG:Zamalek': 'Zamalek SC', 'EG:Ismaily': 'Ismaily SC',
  'DZ:CR Belouizdad': 'CR Belouizdad', 'DZ:MC Alger': 'MC Alger', 'DZ:USM Alger': 'USM Alger',
  'DZ:JS Kabylie': 'JS Kabylie', 'DZ:ES Sétif': 'ES Sétif',
  'IR:Persepolis': 'Persepolis F.C.', 'IR:Esteghlal': 'Esteghlal F.C.', 'IR:Sepahan': 'Sepahan S.C.', 'IR:Tractor': 'Tractor S.C.',
  'NG:Rivers United': 'Rivers United F.C.', 'NG:Remo Stars': 'Remo Stars F.C.',
  'CI:ASEC Mimosas': 'ASEC Mimosas', 'CI:San Pedro': 'FC San Pédro',
  'CI:Africa Sports': "Africa Sports d'Abidjan", "CI:Stade d'Abidjan": "Stade d'Abidjan",
  'TN:Espérance': 'Espérance Sportive de Tunis', 'TN:Étoile du Sahel': 'Étoile Sportive du Sahel',
  'TN:Club Africain': 'Club Africain', 'TN:CS Sfaxien': 'CS Sfaxien',
  'QA:Al-Sadd': 'Al Sadd SC', 'QA:Al-Duhail': 'Al-Duhail SC', 'QA:Al-Rayyan': 'Al-Rayyan SC', 'QA:Al-Arabi': 'Al-Arabi SC (Qatar)',
  'CM:Coton Sport': 'Coton Sport FC de Garoua', 'CM:Canon Yaoundé': 'Canon Yaoundé',
  'CM:Union Douala': 'Union Douala', 'CM:Fovu Club': 'Fovu Club',
  'ML:Stade Malien': 'Stade Malien', 'ML:Djoliba': 'Djoliba AC', 'ML:Real Bamako': 'AS Real Bamako',
  'WA:Connah\'s Quay': "Connah's Quay Nomads F.C.", 'WA:Penybont': 'Penybont F.C.',
};

const SPECIAL = { 'ø': 'o', 'å': 'a', 'æ': 'ae', 'œ': 'oe', 'ł': 'l', 'đ': 'd', 'ð': 'd', 'ß': 'ss', 'ı': 'i', 'þ': 'th' };
const norm = (s) => s.split('').map((ch) => SPECIAL[ch] || ch).join('')
  .normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/&/g, 'and').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

async function fetchWiki(title, attempt) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'career-mode-26-game/1.0 (badge lookup; contact: dev@example.com)' } });
  if (res.status === 429 && (attempt || 0) < 4) {
    await new Promise((r) => setTimeout(r, 4000 * ((attempt || 0) + 1)));
    return fetchWiki(title, (attempt || 0) + 1);
  }
  if (!res.ok) return null;
  const j = await res.json();
  const src = (j.originalimage && j.originalimage.source) || (j.thumbnail && j.thumbnail.source);
  if (!src) return null;
  if (!/upload\.wikimedia\.org/.test(src)) return null;
  return src;
}

async function fetchLeague(code) {
  const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${code}/teams`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const j = await res.json();
  const teams = j.sports && j.sports[0] && j.sports[0].leagues[0] && j.sports[0].leagues[0].teams;
  if (!teams) return null;
  return teams.map((x) => ({
    name: x.team.displayName,
    nickname: x.team.nickname || '',
    slug: x.team.slug || '',
    logo: (x.team.logos && x.team.logos[0] && x.team.logos[0].href) || null,
  })).filter((t) => t.logo);
}

function matchClub(clubName, espnTeams) {
  const target = norm(ALIASES[norm(clubName)] || clubName);
  let best = null, bestScore = 0;
  for (const t of espnTeams) {
    const cands = [norm(t.name), norm(t.nickname), norm(t.slug)];
    for (const c of cands) {
      if (!c) continue;
      let score = 0;
      if (c === target) score = 100;
      else if (target.length >= 3 && c.includes(target)) score = 80 + target.length / c.length;
      else if (c.length >= 3 && target.includes(c)) score = 70 + c.length / target.length;
      if (score > bestScore) { bestScore = score; best = t; }
    }
  }
  return bestScore >= 60 ? best : null;
}

(async () => {
  // Seed from previous run so re-runs only resolve misses
  const out = {};
  try {
    const prev = require('../js/badges.js');
    Object.assign(out, prev);
    console.log(`Seeded ${Object.keys(prev).length} badges from previous run.`);
  } catch (e) { /* first run */ }
  const misses = [];
  const leagueCache = {};
  for (const c of DATA.COUNTRIES) {
    const codes = LEAGUE_CODES[c.id] || [];
    let teams = null, usedCode = null;
    for (const code of codes) {
      if (!(code in leagueCache)) {
        leagueCache[code] = await fetchLeague(code).catch(() => null);
        await new Promise((r) => setTimeout(r, 150));
      }
      if (leagueCache[code] && leagueCache[code].length) { teams = leagueCache[code]; usedCode = code; break; }
    }
    let hits = 0;
    for (const cl of c.clubs) {
      const cid = `${c.id}:${cl.n}`;
      if (out[cid]) { hits++; continue; } // already resolved
      const m = teams ? matchClub(cl.n, teams) : null;
      if (m) { out[cid] = m.logo; hits++; continue; }
      // Wikipedia fallback (polite: 1s between calls), try title variants
      const variants = [WIKI_TITLES[cid], cl.n, `${cl.n} F.C.`, `${cl.n} FC`, `${cl.n} S.C.`].filter(Boolean);
      let wiki = null;
      for (const title of variants) {
        wiki = await fetchWiki(title).catch(() => null);
        if (wiki) break;
        await new Promise((r) => setTimeout(r, 1000));
      }
      if (wiki) { out[cid] = wiki; hits++; }
      else misses.push(cid);
      await new Promise((r) => setTimeout(r, 1000));
    }
    const tag = teams ? usedCode : 'wiki';
    console.log(`${hits === c.clubs.length ? 'OK' : '~~'} ${c.id} ${c.name.padEnd(16)} [${tag}] ${hits}/${c.clubs.length}`);
  }

  const file = `/* Auto-generated by test/fetch-badges.js — club badge URLs (ESPN CDN, hotlink-safe) */\n` +
    `(function (root) { root.CLUB_BADGES = ${JSON.stringify(out, null, 0)}; ` +
    `if (typeof module !== 'undefined' && module.exports) module.exports = root.CLUB_BADGES; })(typeof window !== 'undefined' ? window : globalThis);\n`;
  fs.writeFileSync(path.join(__dirname, '..', 'js', 'badges.js'), file);
  console.log(`\nWrote js/badges.js with ${Object.keys(out).length} badges.`);
  console.log(`Misses (${misses.length}): ${misses.join(', ') || 'none'}`);
})();
