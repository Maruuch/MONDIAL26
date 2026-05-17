/**
 * generate-designs.mjs
 * Génère les SVG back + sleeve_right + sleeve_left pour chaque pays
 * et les uploade sur Cloudinary.
 *
 * Usage:
 *   node scripts/generate-designs.mjs                # tous les pays
 *   node scripts/generate-designs.mjs --test         # France seulement
 *   node scripts/generate-designs.mjs --skip-existing
 */

import crypto from 'crypto';
import fs     from 'fs/promises';
import path   from 'path';

const CLOUD_NAME = 'dwkwgeift';
const CLD_KEY    = '989425694846972';
const CLD_SECRET = 'hkgSe4zikhZNWeDcUtc5vqHqqCU';

const args          = process.argv.slice(2);
const TEST          = args.includes('--test');
const SKIP_EXISTING = args.includes('--skip-existing');
const URLS_FILE     = path.join('scripts', 'design-urls.json');

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
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function isRTL(str) {
  return /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/.test(str);
}

/**
 * Réduit la taille de police si le texte dépasse maxWidth.
 * charRatio ≈ rapport largeur-caractère / taille-police.
 */
function adaptFontSize(text, maxWidth, baseSize, charRatio = 0.5) {
  const natural = text.length * baseSize * charRatio;
  return natural > maxWidth ? Math.floor(maxWidth / (text.length * charRatio)) : baseSize;
}

/**
 * Coupe le texte en 2 lignes au meilleur point de rupture (espace ou virgule)
 * le plus proche du milieu.
 */
function splitAtBestBreak(text) {
  const mid = Math.floor(text.length / 2);
  let bestIdx = -1, bestDist = Infinity;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ' || text[i] === ',') {
      const dist = Math.abs(i - mid);
      if (dist < bestDist) { bestDist = dist; bestIdx = i; }
    }
  }
  if (bestIdx === -1) return [text];
  return [text.slice(0, bestIdx + 1).trim(), text.slice(bestIdx + 1).trim()];
}

// ── SVG : DOS du polo ─────────────────────────────────────────────────────
// 3600 × 4800 px (12" × 16" @ 300 dpi) — fond transparent
//
// Layout vertical :
//   0..310     bande primaire haute  + "WORLD CUP 2026"
//   310..352   accent secondaire (42 px)
//   ~1280      nom du pays (Aladin, hero, secondary fill / primary stroke)
//   ~1340      ligne décorative secondaire
//   ~2060      slogan en arc (textPath) ou 2 lignes droites si trop long
//   4448..4490 accent secondaire bas
//   4490..4800 bande primaire basse
function backSVG({ name, slogan, p, s }) {
  const W = 3600, H = 4800;
  const USABLE = 3300; // largeur utile (padding 150 de chaque côté)

  // ── Nom du pays ────────────────────────────────────────────────────────
  const nameSize = adaptFontSize(name, USABLE, 500, 0.44);
  const nameY    = 1280;

  // ── Slogan ─────────────────────────────────────────────────────────────
  const MAX_SLOGAN = 590;
  const MIN_SINGLE = 260; // en dessous on préfère 2 lignes
  const rtl        = isRTL(slogan) ? 'direction="rtl" unicode-bidi="embed"' : '';

  let sloganLines = [slogan];
  let sloganSize  = adaptFontSize(slogan, USABLE, MAX_SLOGAN, 0.48);
  if (sloganSize < MIN_SINGLE) {
    sloganLines = splitAtBestBreak(slogan);
    sloganSize  = adaptFontSize(sloganLines[0], USABLE, MAX_SLOGAN, 0.48);
  }

  // ── Rendu slogan ───────────────────────────────────────────────────────
  const ARC_BASE = 2060;
  const ARC_PEAK = ARC_BASE - 95; // courbure vers le haut

  let sloganSVG;
  if (sloganLines.length === 1) {
    // Slogan en arc (effet jersey authentique)
    sloganSVG = `
  <defs>
    <path id="sloganArc"
          d="M 150,${ARC_BASE} Q 1800,${ARC_PEAK} 3450,${ARC_BASE}"/>
  </defs>
  <text font-family="'Caveat Brush', cursive" font-size="${sloganSize}"
        fill="${p}" paint-order="stroke" stroke="${s}" stroke-width="20" ${rtl}>
    <textPath href="#sloganArc" xlink:href="#sloganArc"
              startOffset="50%" text-anchor="middle">
      ${escXML(slogan)}
    </textPath>
  </text>`;
  } else {
    // 2 lignes droites (slogans très longs, ex. Australie)
    const line1Y = ARC_BASE - Math.round(sloganSize * 0.6);
    const line2Y = line1Y + Math.round(sloganSize * 1.15);
    sloganSVG = `
  <text x="1800" y="${line1Y}"
        font-family="'Caveat Brush', cursive" font-size="${sloganSize}"
        fill="${p}" text-anchor="middle"
        paint-order="stroke" stroke="${s}" stroke-width="18" ${rtl}>
    ${escXML(sloganLines[0])}
  </text>
  <text x="1800" y="${line2Y}"
        font-family="'Caveat Brush', cursive" font-size="${sloganSize}"
        fill="${p}" text-anchor="middle"
        paint-order="stroke" stroke="${s}" stroke-width="18" ${rtl}>
    ${escXML(sloganLines[1])}
  </text>`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Aladin&amp;family=Caveat+Brush&amp;display=swap');
    </style>
  </defs>

  <!-- Bande supérieure primaire -->
  <rect x="0" y="0" width="${W}" height="310" fill="${p}"/>
  <text x="${W / 2}" y="212"
        font-family="'Aladin', serif" font-size="142"
        fill="${s}" text-anchor="middle"
        paint-order="stroke" stroke="${p}" stroke-width="8">WORLD CUP 2026</text>
  <!-- Accent secondaire -->
  <rect x="0" y="310" width="${W}" height="42" fill="${s}"/>

  <!-- Nom du pays — texte hero -->
  <text x="${W / 2}" y="${nameY}"
        font-family="'Aladin', serif" font-size="${nameSize}"
        fill="${s}" text-anchor="middle"
        paint-order="stroke" stroke="${p}" stroke-width="28">
    ${escXML(name)}
  </text>

  <!-- Ligne décorative sous le nom -->
  <rect x="600" y="${nameY + 42}" width="2400" height="14" fill="${s}" rx="7"/>

  <!-- Slogan -->
  ${sloganSVG}

  <!-- Bande inférieure -->
  <rect x="0" y="${H - 352}" width="${W}" height="42" fill="${s}"/>
  <rect x="0" y="${H - 310}" width="${W}" height="310" fill="${p}"/>
</svg>`;
}

// ── SVG : MANCHE DROITE — WORLD / 2026 / CUP ────────────────────────────
// 510 × 630 px (1.7" × 2.1" @ 300 dpi)
function sleeveRightSVG({ p, s }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="510" height="630" viewBox="0 0 510 630">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Aladin&amp;family=Caveat+Brush&amp;display=swap');
    </style>
  </defs>

  <!-- Accent haut -->
  <rect x="0" y="0"  width="510" height="28" fill="${p}"/>
  <rect x="0" y="28" width="510" height="9"  fill="${s}"/>

  <text x="255" y="130"
        font-family="'Aladin','serif'" font-size="92"
        fill="${s}" text-anchor="middle"
        paint-order="stroke" stroke="${p}" stroke-width="6">WORLD</text>

  <text x="255" y="348"
        font-family="'Caveat Brush','cursive'" font-size="210"
        fill="${p}" text-anchor="middle"
        paint-order="stroke" stroke="${s}" stroke-width="9">2026</text>

  <text x="255" y="500"
        font-family="'Aladin','serif'" font-size="92"
        fill="${s}" text-anchor="middle"
        paint-order="stroke" stroke="${p}" stroke-width="6">CUP</text>

  <!-- Accent bas -->
  <rect x="0" y="593" width="510" height="9"  fill="${s}"/>
  <rect x="0" y="602" width="510" height="28" fill="${p}"/>
</svg>`;
}

// ── SVG : MANCHE GAUCHE — MUNDIAL 26 ─────────────────────────────────────
// 510 × 630 px (1.7" × 2.1" @ 300 dpi)
// Design symétrique à la manche droite (même famille typo, même logique couleurs)
function sleeveLeftSVG({ p, s }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="510" height="630" viewBox="0 0 510 630">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Aladin&amp;family=Caveat+Brush&amp;display=swap');
    </style>
  </defs>

  <!-- Accent haut -->
  <rect x="0" y="0"  width="510" height="28" fill="${p}"/>
  <rect x="0" y="28" width="510" height="9"  fill="${s}"/>

  <text x="255" y="135"
        font-family="'Aladin','serif'" font-size="88"
        fill="${s}" text-anchor="middle"
        paint-order="stroke" stroke="${p}" stroke-width="6">MUNDIAL</text>

  <text x="255" y="440"
        font-family="'Caveat Brush','cursive'" font-size="330"
        fill="${p}" text-anchor="middle"
        paint-order="stroke" stroke="${s}" stroke-width="14">26</text>

  <!-- Accent bas -->
  <rect x="0" y="593" width="510" height="9"  fill="${s}"/>
  <rect x="0" y="602" width="510" height="28" fill="${p}"/>
</svg>`;
}

// ── Upload Cloudinary ─────────────────────────────────────────────────────
async function uploadSVG(svgContent, publicId) {
  const timestamp = Math.round(Date.now() / 1000);
  const sigString = `public_id=${publicId}&timestamp=${timestamp}${CLD_SECRET}`;
  const signature = crypto.createHash('sha1').update(sigString).digest('hex');

  const b64     = Buffer.from(svgContent).toString('base64');
  const dataUrl = `data:image/svg+xml;base64,${b64}`;

  const body = new URLSearchParams({
    file:      dataUrl,
    api_key:   CLD_KEY,
    timestamp: String(timestamp),
    signature,
    public_id: publicId,
  });

  const resp = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body }
  );
  const data = await resp.json();
  if (!resp.ok) throw new Error(JSON.stringify(data));

  // URL de livraison PNG (Cloudinary rasterise le SVG à la volée)
  return data.secure_url.replace(/\/upload\//, '/upload/f_png,q_100/');
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
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
    const already = existing[country.iso] || {};
    if (
      SKIP_EXISTING &&
      already.back && already.sleeveRight && already.sleeveLeft
    ) {
      console.log(`  ${country.iso} — skipped (déjà uploadé)`);
      continue;
    }

    process.stdout.write(`  ${country.iso} — ${country.name}... `);
    try {
      const [backUrl, sleeveRightUrl, sleeveLeftUrl] = await Promise.all([
        uploadSVG(backSVG(country),        `mondial26/back/${country.iso}`),
        uploadSVG(sleeveRightSVG(country), `mondial26/sleeve_right/${country.iso}`),
        uploadSVG(sleeveLeftSVG(country),  `mondial26/sleeve_left/${country.iso}`),
      ]);
      results[country.iso] = {
        back:        backUrl,
        sleeveRight: sleeveRightUrl,
        sleeveLeft:  sleeveLeftUrl,
      };
      console.log('✅');
    } catch (err) {
      console.log(`❌ ${err.message.slice(0, 120)}`);
    }

    await new Promise(r => setTimeout(r, 350));
  }

  await fs.writeFile(URLS_FILE, JSON.stringify(results, null, 2));
  console.log(`\n✅ URLs sauvegardées dans ${URLS_FILE}\n`);
}

main().catch(console.error);
