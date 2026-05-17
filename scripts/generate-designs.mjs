/**
 * generate-designs.mjs
 * Génère les SVG dos + manche droite pour chaque pays et les upload sur Cloudinary.
 * À exécuter UNE FOIS avant le batch Printful.
 *
 * Usage:
 *   node scripts/generate-designs.mjs          # tous les pays
 *   node scripts/generate-designs.mjs --test   # France seulement
 *   node scripts/generate-designs.mjs --skip-existing  # ne réupload pas si URL déjà dans le JSON
 */

import crypto  from 'crypto';
import fs      from 'fs/promises';
import path    from 'path';

// ── Cloudinary credentials (du .env.local) ────────────────────────────────
const CLOUD_NAME = 'dwkwgeift';
const CLD_KEY    = '989425694846972';
const CLD_SECRET = 'hkgSe4zikhZNWeDcUtc5vqHqqCU';

const args           = process.argv.slice(2);
const TEST           = args.includes('--test');
const SKIP_EXISTING  = args.includes('--skip-existing');
const URLS_FILE      = path.join('scripts', 'design-urls.json');

// ── Pays (identique au batch script) ─────────────────────────────────────
const COUNTRIES = [
  // CONCACAF
  { iso:'US', name:'United States',          slogan:'USA! USA',                           p:'#B22234', s:'#3C3B6E' },
  { iso:'CA', name:'Canada',                 slogan:'Go Canada Go',                       p:'#FF0000', s:'#D4AF37' },
  { iso:'MX', name:'Mexico',                 slogan:'¡Vamos México',                      p:'#006847', s:'#CE1126' },
  { iso:'PA', name:'Panama',                 slogan:'¡Vamos Panamá',                      p:'#DA121A', s:'#1C4B9D' },
  { iso:'HT', name:'Haiti',                  slogan:'Ann ale Ayiti',                      p:'#00209F', s:'#D21034' },
  { iso:'CW', name:'Curaçao',               slogan:'Kòrsou, laga nos bai',               p:'#002B7F', s:'#F1B02A' },
  // CONMEBOL
  { iso:'AR', name:'Argentina',              slogan:'¡Vamos Argentina',                   p:'#74ACDF', s:'#F6B40E' },
  { iso:'BR', name:'Brazil',                 slogan:'Vai Brasil',                         p:'#009C3B', s:'#FFDF00' },
  { iso:'CO', name:'Colombia',               slogan:'¡Vamos Colombia',                    p:'#FCD116', s:'#CE1126' },
  { iso:'EC', name:'Ecuador',                slogan:'¡Vamos Ecuador',                     p:'#FFD100', s:'#003DA5' },
  { iso:'PY', name:'Paraguay',               slogan:'¡Vamos Paraguay',                    p:'#D52B1E', s:'#0038A8' },
  { iso:'UY', name:'Uruguay',                slogan:'¡Vamos Uruguay',                     p:'#0038A8', s:'#F6B40E' },
  // UEFA
  { iso:'AT', name:'Austria',                slogan:'Auf geht\'s Österreich',             p:'#ED2939', s:'#C8941A' },
  { iso:'BA', name:'Bosnia and Herzegovina', slogan:'Idemo Zmajevi',                      p:'#002395', s:'#FBBC04', skip:true },
  { iso:'HR', name:'Croatia',                slogan:'Idemo Hrvatska',                     p:'#FF0000', s:'#0093DD' },
  { iso:'CZ', name:'Czechia',               slogan:'Do toho, Česko',                     p:'#D7141A', s:'#11457E' },
  { iso:'EN', name:'England',                slogan:'Come on England',                    p:'#CF091A', s:'#012169' },
  { iso:'FR', name:'France',                 slogan:'Allez les Bleus',                    p:'#002395', s:'#ED2939' },
  { iso:'DE', name:'Germany',                slogan:'Auf geht\'s Deutschland',            p:'#DD0000', s:'#FFCC00' },
  { iso:'BE', name:'Belgium',                slogan:'Allez les Diables',                  p:'#EF3340', s:'#FAE042' },
  { iso:'NL', name:'Netherlands',            slogan:'Hup Holland Hup',                    p:'#FF6600', s:'#003087' },
  { iso:'NO', name:'Norway',                 slogan:'Heia Norge',                         p:'#EF2B2D', s:'#002868' },
  { iso:'PT', name:'Portugal',               slogan:'Força Portugal',                     p:'#006600', s:'#FF0000' },
  { iso:'SC', name:'Scotland',               slogan:'Come on Scotland',                   p:'#003DA5', s:'#FFD700' },
  { iso:'ES', name:'Spain',                  slogan:'¡Vamos España',                      p:'#AA151B', s:'#F1BF00' },
  { iso:'SE', name:'Sweden',                 slogan:'Heja Sverige',                       p:'#006AA7', s:'#FECC02' },
  { iso:'CH', name:'Switzerland',            slogan:'Hopp Schwiiz',                       p:'#FF0000', s:'#C8941A' },
  { iso:'TR', name:'Türkiye',                slogan:'Haydi Türkiye',                      p:'#E30A17', s:'#C8941A' },
  // CAF
  { iso:'DZ', name:'Algeria',                slogan:'ديما الخضرا',                        p:'#006233', s:'#D21034' },
  { iso:'ZA', name:'South Africa',           slogan:'Bafana Bafana',                      p:'#007A4D', s:'#FFB81C' },
  { iso:'CV', name:'Cape Verde',             slogan:'Força Cabo Verde',                   p:'#003893', s:'#CF2027' },
  { iso:'CI', name:'Ivory Coast',            slogan:'Allez les Éléphants',                p:'#F77F00', s:'#009A00' },
  { iso:'EG', name:'Egypt',                  slogan:'تحيا مصر',                          p:'#CE1126', s:'#C8941A' },
  { iso:'GH', name:'Ghana',                  slogan:'Go Black Stars',                     p:'#FCD116', s:'#006B3F' },
  { iso:'MA', name:'Morocco',                slogan:'ديما مغرب',                          p:'#C1272D', s:'#006233' },
  { iso:'CD', name:'DR Congo',               slogan:'Allez les Léopards',                 p:'#007FFF', s:'#CE1126' },
  { iso:'SN', name:'Senegal',                slogan:'Allez Sénégal',                      p:'#00853F', s:'#FDEF42' },
  { iso:'TN', name:'Tunisia',                slogan:'يلا تونس',                           p:'#E70013', s:'#C8941A' },
  // AFC
  { iso:'JP', name:'Japan',                  slogan:'日本、行こう',                         p:'#BC002D', s:'#000000' },
  { iso:'IR', name:'Iran',                   slogan:'ایران، ایران',                        p:'#239F40', s:'#DA0000' },
  { iso:'UZ', name:'Uzbekistan',             slogan:'Olgʻa, Oʻzbekiston',                 p:'#009AD6', s:'#1EB53A' },
  { iso:'KR', name:'South Korea',            slogan:'대한민국',                             p:'#CD2E3A', s:'#003478' },
  { iso:'JO', name:'Jordan',                 slogan:'يلا الأردن',                         p:'#CE1126', s:'#007A3D' },
  { iso:'AU', name:'Australia',              slogan:'Aussie Aussie Aussie, Oi Oi Oi',     p:'#00843D', s:'#FFD100' },
  { iso:'SA', name:'Saudi Arabia',           slogan:'يلا السعودية',                       p:'#006C35', s:'#C8941A' },
  { iso:'QA', name:'Qatar',                  slogan:'يلا قطر',                            p:'#8D1B3D', s:'#C8941A' },
  // Playoffs
  { iso:'IQ', name:'Iraq',                   slogan:'يلا العراق',                         p:'#CE1126', s:'#007A3D' },
  // OFC
  { iso:'NZ', name:'New Zealand',            slogan:'Go New Zealand',                     p:'#00247D', s:'#CC142B' },
];

// ── Helpers ───────────────────────────────────────────────────────────────
function escXML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function isRTL(str) {
  return /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/.test(str);
}

// strip # from hex
const hex = c => c.replace('#','');

// ── SVG : face arrière ────────────────────────────────────────────────────
// 3600 × 4800 px (12" × 16" @ 300dpi) — fond transparent
function backSVG({ name, slogan, p, s }) {
  const rtlSlogan = isRTL(slogan) ? 'direction="rtl" unicode-bidi="embed"' : '';
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="3600" height="4800" viewBox="0 0 3600 4800">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Aladin&amp;family=Caveat+Brush&amp;display=swap');
    </style>
  </defs>
  <!-- Nom du pays — Aladin, couleur secondaire, stroke primaire -->
  <text
    x="1800" y="680"
    font-family="'Aladin', serif"
    font-size="310"
    fill="${s}"
    text-anchor="middle"
    paint-order="stroke"
    stroke="${p}"
    stroke-width="22"
  >${escXML(name)}</text>
  <!-- Slogan — Caveat Brush, couleur primaire, stroke secondaire -->
  <text
    x="1800" y="1320"
    font-family="'Caveat Brush', cursive"
    font-size="560"
    fill="${p}"
    text-anchor="middle"
    paint-order="stroke"
    stroke="${s}"
    stroke-width="18"
    ${rtlSlogan}
  >${escXML(slogan)}</text>
</svg>`;
}

// ── SVG : manche droite (WORLD / 2026 / CUP) ─────────────────────────────
// 510 × 630 px (1.7" × 2.1" @ 300dpi) — fond transparent
function sleeveSVG({ p, s }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="510" height="630" viewBox="0 0 510 630">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Aladin&amp;family=Caveat+Brush&amp;display=swap');
    </style>
  </defs>
  <text x="255" y="95"  font-family="'Aladin','serif'" font-size="80"  fill="${s}" text-anchor="middle" paint-order="stroke" stroke="${p}" stroke-width="5">WORLD</text>
  <text x="255" y="295" font-family="'Caveat Brush','cursive'" font-size="175" fill="${p}" text-anchor="middle" paint-order="stroke" stroke="${s}" stroke-width="6">2026</text>
  <text x="255" y="420" font-family="'Aladin','serif'" font-size="80"  fill="${s}" text-anchor="middle" paint-order="stroke" stroke="${p}" stroke-width="5">CUP</text>
</svg>`;
}

// ── Upload Cloudinary ─────────────────────────────────────────────────────
async function uploadSVG(svgContent, publicId) {
  const timestamp  = Math.round(Date.now() / 1000);
  const sigString  = `public_id=${publicId}&timestamp=${timestamp}${CLD_SECRET}`;
  const signature  = crypto.createHash('sha1').update(sigString).digest('hex');

  // SVG → base64 data URL
  const b64 = Buffer.from(svgContent).toString('base64');
  const dataUrl = `data:image/svg+xml;base64,${b64}`;

  const body = new URLSearchParams({
    file:       dataUrl,
    api_key:    CLD_KEY,
    timestamp:  String(timestamp),
    signature,
    public_id:  publicId,
  });

  const resp = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body }
  );
  const data = await resp.json();
  if (!resp.ok) throw new Error(JSON.stringify(data));

  // Retourner l'URL PNG (Cloudinary convertit le SVG en PNG à la volée)
  return data.secure_url.replace(/\/upload\//, '/upload/f_png,q_100/');
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  // Charger les URLs existantes si on veut skipper
  let existing = {};
  try {
    const raw = await fs.readFile(URLS_FILE, 'utf8');
    existing = JSON.parse(raw);
  } catch {}

  const toProcess = TEST
    ? COUNTRIES.filter(c => c.iso === 'FR')
    : COUNTRIES.filter(c => !c.skip);

  console.log(`\n🎨 Génération designs pour ${toProcess.length} pays...\n`);
  const results = { ...existing };

  for (const country of toProcess) {
    if (SKIP_EXISTING && existing[country.iso]?.back && existing[country.iso]?.sleeve) {
      console.log(`  ${country.iso} — skipped (déjà uploadé)`);
      continue;
    }
    process.stdout.write(`  ${country.iso} — ${country.name}... `);
    try {
      const [backUrl, sleeveUrl] = await Promise.all([
        uploadSVG(backSVG(country),   `mondial26/back/${country.iso}`),
        uploadSVG(sleeveSVG(country), `mondial26/sleeve_right/${country.iso}`),
      ]);
      results[country.iso] = { back: backUrl, sleeve: sleeveUrl };
      console.log('✅');
    } catch (err) {
      console.log(`❌ ${err.message.slice(0,120)}`);
    }
    await new Promise(r => setTimeout(r, 300));
  }

  await fs.writeFile(URLS_FILE, JSON.stringify(results, null, 2));
  console.log(`\n✅ URLs sauvegardées dans ${URLS_FILE}\n`);
}

main().catch(console.error);
