/* ============================================================
   Public data layer:
   - flagcdn.com for country flags (runtime, hotlinked)
   - js/badges.js: club crest URLs resolved at build time from
     ESPN's public soccer API + Wikipedia (hotlinked, no CORS issues)
   - Monogram fallback for anything missing
   ============================================================ */
(function (root) {
  'use strict';

  const FLAG_BASE = 'https://flagcdn.com';

  function flagUrl(code, w) {
    if (!code) return '';
    const validWidths = [20, 40, 80, 160, 320, 640];
    const target = w || 80;
    const closest = validWidths.find((v) => v >= target) || 640;
    return `${FLAG_BASE}/w${closest}/${code.toLowerCase()}.png`;
  }

  // Returns a Promise<string|null> for the badge URL of a club.
  function getBadge(club) {
    if (!club) return Promise.resolve(null);
    const map = root.CLUB_BADGES || {};
    return Promise.resolve(map[club.cid] || null);
  }

  // Monogram fallback: deterministic color from name
  function monogramColors(name) {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    const hue = h % 360;
    return { bg: `hsl(${hue} 45% 22%)`, fg: `hsl(${hue} 80% 78%)` };
  }

  function monogramInitials(name) {
    const words = name.replace(/[^A-Za-zÀ-ÿ0-9 ]/g, '').split(/\s+/).filter(Boolean);
    if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
    return words.slice(0, 3).map((w) => w[0]).join('').toUpperCase();
  }

  root.GameAPI = { flagUrl, getBadge, monogramColors, monogramInitials };
})(typeof window !== 'undefined' ? window : globalThis);
