/**
 * generate-designs.mjs
 * Génère les SVG back + sleeve_right + sleeve_left pour chaque pays
 * et les uploade sur Cloudinary.
 *
 * Référence visuelle : produit BA (433424285) dans le designer Printful.
 *
 * DOS — layout validé sur BA :
 *   • Nom du pays  : Aladin, ~260px, ARC (courbe vers le haut), fill=p, stroke=s
 *   • Slogan       : Caveat Brush, ~520px adaptatif, DROIT, fill=s, stroke=p
 *   • Pas de bandes couleur — design épuré sur fond blanc
 *
 * MANCHE DROITE : WORLD/2026/CUP
 *   • WORLD, CUP   : Aladin small, fill=s, stroke=p
 *   • 2026         : Caveat Brush large, fill=p, stroke=s
 *   • Pas de bandes
 *
 * MANCHE GAUCHE : ballon de volleyball
 *   • Cercle + 3 coutures courbes, double trait (s=extérieur, p=intérieur)
 *   • Fond blanc, pas de texte
 *
 * Usage:
 *   node scripts/generate-designs.mjs
 *   node scripts/generate-designs.mjs --test          # France uniquement
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

// ── Pays ──────────────────────────────────────────────────────────────────
const COUNTRIES = [
  { iso:'US', name:'United States',          slogan:'USA! USA',                           p:'#B22234', s:'#3C3B6E' },
  { iso:'CA', name:'Canada',                 slogan:'Go Canada Go',                       p:'#FF0000', s:'#D4AF37' },
  { iso:'MX', name:'Mexico',                 slogan:'¡Vamos México',                      p:'#006847', s:'#CE1126' },
  { iso:'PA', name:'Panama',                 slogan:'¡Vamos Panamá',                      p:'#DA121A', s:'#1C4B9D' },
  { iso:'HT', name:'Haiti',                  slogan:'Ann ale Ayiti',                      p:'#00209F', s:'#D21034' },
  { iso:'CW', name:'Curaçao',               slogan:'Kòrsou, laga nos bai',               p:'#002B7F', s:'#F1B02A' },
  { iso:'AR', name:'Argentina',              slogan:'¡Vamos Argentina',                   p:'#74ACDF', s:'#F6B40E' },
  { iso:'BR', name:'Brazil',                 slogan:'Vai Brasil',                         p:'#009C3B', s:'#FFDF00' },
  { iso:'CO', name:'Colombia',               slogan:'¡Vamos Colombia',                    p:'#FCD116', s:'#CE1126' },
  { iso:'EC', name:'Ecuador',                slogan:'¡Vamos Ecuador',                     p:'#FFD100', s:'#003DA5' },
  { iso:'PY', name:'Paraguay',               slogan:'¡Vamos Paraguay',                    p:'#D52B1E', s:'#0038A8' },
  { iso:'UY', name:'Uruguay',                slogan:'¡Vamos Uruguay',                     p:'#0038A8', s:'#F6B40E' },
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
  { iso:'JP', name:'Japan',                  slogan:'日本、行こう',                         p:'#BC002D', s:'#000000' },
  { iso:'IR', name:'Iran',                   slogan:'ایران، ایران',                        p:'#239F40', s:'#DA0000' },
  { iso:'UZ', name:'Uzbekistan',             slogan:'Olgʻa, Oʻzbekiston',                 p:'#009AD6', s:'#1EB53A' },
  { iso:'KR', name:'South Korea',            slogan:'대한민국',                             p:'#CD2E3A', s:'#003478' },
  { iso:'JO', name:'Jordan',                 slogan:'يلا الأردن',                         p:'#CE1126', s:'#007A3D' },
  { iso:'AU', name:'Australia',              slogan:'Aussie Aussie Aussie, Oi Oi Oi',     p:'#00843D', s:'#FFD100' },
  { iso:'SA', name:'Saudi Arabia',           slogan:'يلا السعودية',                       p:'#006C35', s:'#C8941A' },
  { iso:'QA', name:'Qatar',                  slogan:'يلا قطر',                            p:'#8D1B3D', s:'#C8941A' },
  { iso:'IQ', name:'Iraq',                   slogan:'يلا العراق',                         p:'#CE1126', s:'#007A3D' },
  { iso:'NZ', name:'New Zealand',            slogan:'Go New Zealand',                     p:'#00247D', s:'#CC142B' },
];

// ── Helpers ───────────────────────────────────────────────────────────────
function escXML(str) {
  return str
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function isRTL(str) {
  return /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/.test(str);
}

// Réduit la taille de police si le texte estimé dépasse maxWidth
function adaptFontSize(text, maxWidth, baseSize, charRatio = 0.5) {
  const natural = text.length * baseSize * charRatio;
  return natural > maxWidth ? Math.floor(maxWidth / (text.length * charRatio)) : baseSize;
}

// Coupe en 2 lignes au meilleur point de rupture (espace ou virgule près du milieu)
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

// ── SVG : DOS ─────────────────────────────────────────────────────────────
// 3600 × 4800 px (12" × 16" @ 300 dpi) — fond transparent
//
// Layout conforme au produit BA de référence :
//   - Nom du pays  : Aladin ~260px, ARC vers le haut, fill=p, stroke=s
//   - Slogan       : Caveat Brush ~520px adaptatif, DROIT, fill=s, stroke=p
//   - Pas de bandes/décorations — texte pur sur fond blanc
function backSVG({ name, slogan, p, s }) {
  const W = 3600;
  const USABLE = 3100; // largeur utile (marge 250 de chaque côté)

  // ── Nom du pays (arc) ────────────────────────────────────────────────────
  // Aladin, ratio caractère ≈ 0.44
  // Base 260px — tous les noms tiennent dans l'arc (aucun ne dépasse 22 chars)
  const nameSize = adaptFontSize(name, USABLE, 260, 0.44);

  // Arc SVG : courbe douce vers le haut (+80px au centre)
  // Endpoints y=620, contrôle y=540  → arc "sourire"
  const arcY = 620;
  const arcPeak = 540;

  // ── Slogan (droit) ────────────────────────────────────────────────────────
  // Caveat Brush, ratio ≈ 0.48
  const MAX_SLOGAN  = 520;
  const MIN_SINGLE  = 240; // < 240px → 2 lignes
  const rtl = isRTL(slogan) ? 'direction="rtl" unicode-bidi="embed"' : '';

  let sloganLines = [slogan];
  let sloganSize  = adaptFontSize(slogan, USABLE, MAX_SLOGAN, 0.48);
  if (sloganSize < MIN_SINGLE) {
    sloganLines = splitAtBestBreak(slogan);
    sloganSize  = adaptFontSize(sloganLines[0], USABLE, MAX_SLOGAN, 0.48);
  }

  // Baseline slogan : juste sous la fin de l'arc + gap confortable
  const GAP       = 110;
  const slogan1Y  = arcY + GAP + sloganSize;
  const slogan2Y  = slogan1Y + Math.round(sloganSize * 1.15);

  let sloganSVG;
  if (sloganLines.length === 1) {
    sloganSVG = `
  <text x="${W / 2}" y="${slogan1Y}"
        font-family="'Caveat Brush', cursive" font-size="${sloganSize}"
        fill="${s}" text-anchor="middle"
        paint-order="stroke" stroke="${p}" stroke-width="22" ${rtl}>
    ${escXML(slogan)}
  </text>`;
  } else {
    sloganSVG = `
  <text x="${W / 2}" y="${slogan1Y}"
        font-family="'Caveat Brush', cursive" font-size="${sloganSize}"
        fill="${s}" text-anchor="middle"
        paint-order="stroke" stroke="${p}" stroke-width="20" ${rtl}>
    ${escXML(sloganLines[0])}
  </text>
  <text x="${W / 2}" y="${slogan2Y}"
        font-family="'Caveat Brush', cursive" font-size="${sloganSize}"
        fill="${s}" text-anchor="middle"
        paint-order="stroke" stroke="${p}" stroke-width="20" ${rtl}>
    ${escXML(sloganLines[1])}
  </text>`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${W}" height="4800" viewBox="0 0 ${W} 4800">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Aladin&amp;family=Caveat+Brush&amp;display=swap');
    </style>
    <!-- Arc pour le nom du pays : courbe douce vers le haut -->
    <path id="nameArc"
          d="M 250,${arcY} Q 1800,${arcPeak} 3350,${arcY}"/>
  </defs>

  <!-- Nom du pays — arc, fill=primaire, stroke=secondaire (conforme BA) -->
  <text font-family="'Aladin', serif" font-size="${nameSize}"
        fill="${p}" paint-order="stroke" stroke="${s}" stroke-width="16">
    <textPath href="#nameArc" xlink:href="#nameArc"
              startOffset="50%" text-anchor="middle">
      ${escXML(name)}
    </textPath>
  </text>

  <!-- Slogan — droit, fill=secondaire, stroke=primaire (conforme BA) -->
  ${sloganSVG}
</svg>`;
}

// ── SVG : MANCHE DROITE — WORLD / 2026 / CUP ─────────────────────────────
// 510 × 630 px (1.7" × 2.1" @ 300 dpi)
// Conforme BA : WORLD+CUP fill=secondaire, 2026 fill=primaire, pas de bandes
function sleeveRightSVG({ p, s }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="510" height="630" viewBox="0 0 510 630">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Aladin&amp;family=Caveat+Brush&amp;display=swap');
    </style>
  </defs>

  <!-- WORLD — petit, fill=secondaire -->
  <text x="255" y="118"
        font-family="'Aladin','serif'" font-size="88"
        fill="${s}" text-anchor="middle"
        paint-order="stroke" stroke="${p}" stroke-width="6">WORLD</text>

  <!-- 2026 — grand, fill=primaire -->
  <text x="255" y="340"
        font-family="'Caveat Brush','cursive'" font-size="205"
        fill="${p}" text-anchor="middle"
        paint-order="stroke" stroke="${s}" stroke-width="9">2026</text>

  <!-- CUP — petit, fill=secondaire -->
  <text x="255" y="480"
        font-family="'Aladin','serif'" font-size="88"
        fill="${s}" text-anchor="middle"
        paint-order="stroke" stroke="${p}" stroke-width="6">CUP</text>
</svg>`;
}

// ── SVG : MANCHE GAUCHE — Ballon de volleyball ────────────────────────────
// 510 × 630 px (1.7" × 2.1" @ 300 dpi)
// Conforme BA : cercle + 3 coutures courbes, double trait (s=ext, p=int)
// Fond blanc, pas de texte
function sleeveLeftSVG({ p, s }) {
  // Ballon centré : cx=255, cy=285, r=180
  // Les extrémités des coutures sont sur le cercle (distance r du centre)
  const cx = 255, cy = 285, r = 180;

  // Points cardinaux sur le cercle :
  // Gauche   : (75, 285)      θ=180°
  // Droite   : (435, 285)     θ=0°
  // Haut-gauche: ≈(165, 129)  θ=≈-130°  (cx+r·cos(130°), cy+r·sin(-40°))
  // Bas-gauche : ≈(165, 441)  θ=≈130°
  // Haut-droit : ≈(345, 129)  θ=≈-50°
  // Bas-droit  : ≈(345, 441)  θ=≈50°

  // Trait épais = secondaire (extérieur), trait fin = primaire (intérieur)
  const SW_OUTER = 14;
  const SW_INNER = 7;

  const seam = (d) => `
    <path d="${d}" fill="none" stroke="${s}" stroke-width="${SW_OUTER}" stroke-linecap="round"/>
    <path d="${d}" fill="none" stroke="${p}" stroke-width="${SW_INNER}" stroke-linecap="round"/>`;

  // Couture 1 : horizontale ondulée (gauche → droite, S-courbe en passant par le centre)
  const seam1 = seam(`M 75,285 C 135,210 180,225 255,285 C 330,345 375,360 435,285`);

  // Couture 2 : diagonale gauche (haut-gauche → bas-gauche, passe par la gauche du centre)
  const seam2 = seam(`M 165,129 C 95,170 77,225 76,285 C 77,345 95,400 165,441`);

  // Couture 3 : diagonale droite (haut-droit → bas-droit, passe par la droite du centre)
  const seam3 = seam(`M 345,129 C 415,170 433,225 434,285 C 433,345 415,400 345,441`);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="510" height="630" viewBox="0 0 510 630">
  <defs>
    <!-- Clip : les coutures restent à l'intérieur du ballon -->
    <clipPath id="ballClip">
      <circle cx="${cx}" cy="${cy}" r="${r}"/>
    </clipPath>
  </defs>

  <!-- Surface blanche du ballon -->
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="white"/>

  <!-- Coutures intérieures (clippées) -->
  <g clip-path="url(#ballClip)">
    ${seam1}
    ${seam2}
    ${seam3}
  </g>

  <!-- Contour du ballon — double trait (s ext, p int) -->
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${s}" stroke-width="16"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${p}" stroke-width="8"/>
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

  return data.secure_url.replace(/\/upload\//, '/upload/f_png,q_100/');
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  let existing = {};
  try {
    existing = JSON.parse(await fs.readFile(URLS_FILE, 'utf8'));
  } catch {}

  const toProcess = TEST
    ? COUNTRIES.filter(c => c.iso === 'FR')
    : COUNTRIES.filter(c => !c.skip);

  console.log(`\n🎨 Génération designs pour ${toProcess.length} pays...\n`);
  const results = { ...existing };

  for (const country of toProcess) {
    const already = existing[country.iso] || {};
    if (SKIP_EXISTING && already.back && already.sleeveRight && already.sleeveLeft) {
      console.log(`  ${country.iso} — skipped`);
      continue;
    }

    process.stdout.write(`  ${country.iso} — ${country.name}... `);
    try {
      const [backUrl, sleeveRightUrl, sleeveLeftUrl] = await Promise.all([
        uploadSVG(backSVG(country),        `mondial26/back/${country.iso}`),
        uploadSVG(sleeveRightSVG(country), `mondial26/sleeve_right/${country.iso}`),
        uploadSVG(sleeveLeftSVG(country),  `mondial26/sleeve_left/${country.iso}`),
      ]);
      results[country.iso] = { back: backUrl, sleeveRight: sleeveRightUrl, sleeveLeft: sleeveLeftUrl };
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
