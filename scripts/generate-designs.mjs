/**
 * generate-designs.mjs
 * VALEURS EXTRAITES PIXEL PAR PIXEL du designer Printful (produit BA 433424285)
 * Échelle : 1 Printful unit = 300 px SVG
 *
 * DOS (Imprimé arrière) :
 *   Nom pays  → Aladin 1.25u=375px, courbure 20 (lift=90px),  fill=s, stroke=p
 *   Slogan    → Caveat Brush 2.00u=600px, courbure 20 (lift=131px), fill=p, stroke=s
 *   Dimensions: 3600×2400 px
 *
 * MANCHE DROITE :
 *   WORLD/CUP → Open Sans Bold 0.30u=90px, courbure 2 (≈plat), fill=s, stroke=p
 *   2026      → Dela Gothic One 0.43u=129px, courbure 46 (lift=103px), fill=p, stroke=s
 *   Dimensions: 600×750 px
 *
 * MANCHE GAUCHE :
 *   Ballon volleyball — cercle r=180 + 3 coutures double-trait (s ext / p int)
 *   Dimensions: 510×630 px
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
  return /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/.test(str);
}

// Réduit la police si le texte estimé dépasse maxWidth
// charRatio = largeur moyenne d'un caractère / taille de police
function adaptFontSize(text, maxWidth, baseSize, charRatio) {
  const estimated = text.length * baseSize * charRatio;
  return estimated > maxWidth
    ? Math.max(180, Math.floor(maxWidth / (text.length * charRatio)))
    : baseSize;
}

// Coupe au meilleur point de rupture pour les slogans très longs
function splitAtBestBreak(text) {
  const mid = Math.floor(text.length / 2);
  let bestIdx = -1, bestDist = Infinity;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ' || text[i] === ',') {
      const dist = Math.abs(i - mid);
      if (dist < bestDist) { bestDist = dist; bestIdx = i; }
    }
  }
  return bestIdx === -1 ? [text] : [text.slice(0, bestIdx + 1).trim(), text.slice(bestIdx + 1).trim()];
}

// ── SVG : DOS ─────────────────────────────────────────────────────────────
// Canvas 3600×2400 px (12u × 8u @ 300 dpi)
//
// Valeurs mesurées sur BA :
//   Nom pays  : Aladin 1.25u→375px, boîte 9.56u×1.50u, courbure 20 → lift=90px
//   Slogan    : Caveat Brush 2.00u→600px, boîte 11.02u×2.18u, courbure 20 → lift=131px
//   fill nom  = s (secondaire)   fill slogan = p (primaire)
function backSVG({ name, slogan, p, s }) {
  const W = 3600, H = 2400, CX = W / 2;

  // ── Nom du pays ──────────────────────────────────────────────────────────
  // charRatio Aladin mesuré : 2868/(22×375) = 0.347
  const nomSz     = adaptFontSize(name, 2868, 375, 0.347);
  // Poids contour mesuré sur BA = 0.20u × 300px/u = 60px (fixe, identique pour nom et slogan)
  const nomStroke = 60;

  // Arc nom : centre x=1800, largeur 9.56u=2868px, lift=90px
  const NOM_XL   = CX - 1434;   // 366
  const NOM_XR   = CX + 1434;   // 3234
  const NOM_BASE = 1050;         // y baseline aux extrémités
  const NOM_PEAK = NOM_BASE - 90; // y au sommet (lift=90)

  // ── Slogan ───────────────────────────────────────────────────────────────
  // charRatio Caveat Brush mesuré : 3306/(13×600) = 0.424
  let slogSz    = adaptFontSize(slogan, 3306, 600, 0.424);
  let slogLines = [slogan];
  if (slogSz < 280) {
    // Slogan trop long → 2 lignes
    slogLines = splitAtBestBreak(slogan);
    slogSz    = adaptFontSize(slogLines[0], 3306, 600, 0.424);
  }
  const slogStroke = 60; // poids 0.20u × 300px/u = 60px (mesuré sur BA)

  // Arc slogan : largeur 11.02u=3306px, lift=131px
  const SLG_XL = CX - 1653;   // 147
  const SLG_XR = CX + 1653;   // 3453

  // Position Y du slogan : sous le nom + gap de 100px
  // Contenu nom : sommet ≈ NOM_PEAK − nomSz×0.73
  // Fond nom    : NOM_BASE + nomSz×0.12 (descenders)
  const nomBottom  = NOM_BASE + Math.round(nomSz * 0.12);
  const SLG_BASE   = nomBottom + 100 + 131 + Math.round(slogSz * 0.73);
  const SLG_PEAK   = SLG_BASE - 131;
  const SLG2_BASE  = SLG_BASE + Math.round(slogSz * 1.15);
  const SLG2_PEAK  = SLG2_BASE - 131;

  const rtl = isRTL(slogan) ? ' direction="rtl"' : '';

  // Construire les blocs textPath pour 1 ou 2 lignes
  const sloganBlocks = slogLines.map((line, i) => {
    const base = i === 0 ? SLG_BASE : SLG2_BASE;
    const peak = i === 0 ? SLG_PEAK : SLG2_PEAK;
    const id   = `arcSlg${i}`;
    return { line, base, peak, id };
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <style>@import url('https://fonts.googleapis.com/css2?family=Aladin&amp;family=Caveat+Brush&amp;display=swap');</style>
    <!-- Arc nom : 9.56u large, courbure 20, lift=90px -->
    <path id="arcNom" d="M ${NOM_XL},${NOM_BASE} Q ${CX},${NOM_PEAK} ${NOM_XR},${NOM_BASE}"/>
    <!-- Arc(s) slogan : 11.02u large, courbure 20, lift=131px -->
    ${sloganBlocks.map(({ id, base, peak }) =>
      `<path id="${id}" d="M ${SLG_XL},${base} Q ${CX},${peak} ${SLG_XR},${base}"/>`
    ).join('\n    ')}
  </defs>

  <!-- NOM DU PAYS : Aladin, fill=s, stroke=p, courbure 20 -->
  <text font-family="'Aladin', serif" font-size="${nomSz}"
        fill="${s}" paint-order="stroke" stroke="${p}" stroke-width="${nomStroke}"
        text-anchor="middle">
    <textPath href="#arcNom" xlink:href="#arcNom" startOffset="50%">${escXML(name)}</textPath>
  </text>

  <!-- SLOGAN : Caveat Brush, fill=p, stroke=s, courbure 20 -->
  ${sloganBlocks.map(({ line, id }) => `
  <text font-family="'Caveat Brush', cursive" font-size="${slogSz}"
        fill="${p}" paint-order="stroke" stroke="${s}" stroke-width="${slogStroke}"
        text-anchor="middle"${rtl}>
    <textPath href="#${id}" xlink:href="#${id}" startOffset="50%">${escXML(line)}</textPath>
  </text>`).join('')}
</svg>`;
}

// ── SVG : MANCHE DROITE — WORLD / 2026 / CUP ─────────────────────────────
// Canvas 600×750 px (2u × 2.5u @ 300 dpi)
//
// Valeurs mesurées sur BA :
//   WORLD/CUP : Open Sans Bold 0.30u→90px, 1.14u×0.25u, courbure 2 (lift≈1.5px ≈ plat)
//   2026      : Dela Gothic One 0.43u→129px, 1.67u×0.75u, courbure 46 → lift=103px
//   fill WORLD/CUP = s   fill 2026 = p
function sleeveRightSVG({ p, s }) {
  // WORLD : y baseline=208, quasi-plat (lift=1.5px)
  // x entre 129 et 471 (1.14u×300 = 342px centré sur 300)
  const WL = 300 - 171, WR = 300 + 171;  // 129, 471
  const WY = 208;

  // 2026  : arc base=483, peak=380 (lift=103px)
  // x entre 49.5 et 550.5 (1.67u×300 = 501px centré sur 300)
  const AL = 300 - 250.5, AR = 300 + 250.5;  // 49.5, 550.5
  const A_BASE = 483, A_PEAK = 380;

  // CUP   : y baseline=594, quasi-plat (idem WORLD)
  const CY = 594;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="600" height="750" viewBox="0 0 600 750">
  <defs>
    <style>@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&amp;family=Dela+Gothic+One&amp;display=swap');</style>
    <!-- WORLD/CUP : courbure 2, lift=1.5px → quasi-plat -->
    <path id="arcW" d="M ${WL},${WY}   Q 300,${WY - 1.5} ${WR},${WY}"/>
    <!-- 2026 : courbure 46, lift=103px -->
    <path id="arc2026" d="M ${AL},${A_BASE} Q 300,${A_PEAK} ${AR},${A_BASE}"/>
    <path id="arcC" d="M ${WL},${CY}   Q 300,${CY - 1.5} ${WR},${CY}"/>
  </defs>

  <!-- WORLD : Open Sans Bold 90px, courbure 2, fill=s -->
  <text font-family="'Open Sans', sans-serif" font-weight="700" font-size="90"
        fill="${s}" paint-order="stroke" stroke="${p}" stroke-width="5"
        text-anchor="middle">
    <textPath href="#arcW" xlink:href="#arcW" startOffset="50%">WORLD</textPath>
  </text>

  <!-- 2026 : Dela Gothic One 129px, courbure 46, fill=p -->
  <text font-family="'Dela Gothic One', cursive" font-size="129"
        fill="${p}" paint-order="stroke" stroke="${s}" stroke-width="7"
        text-anchor="middle">
    <textPath href="#arc2026" xlink:href="#arc2026" startOffset="50%">2026</textPath>
  </text>

  <!-- CUP : Open Sans Bold 90px, courbure 2, fill=s -->
  <text font-family="'Open Sans', sans-serif" font-weight="700" font-size="90"
        fill="${s}" paint-order="stroke" stroke="${p}" stroke-width="5"
        text-anchor="middle">
    <textPath href="#arcC" xlink:href="#arcC" startOffset="50%">CUP</textPath>
  </text>
</svg>`;
}

// ── SVG : MANCHE GAUCHE — Ballon de volleyball ────────────────────────────
// Canvas 510×630 px
// Cercle r=180 + 3 coutures bezier double-trait (s extérieur / p intérieur)
// Fond blanc, pas de texte
function sleeveLeftSVG({ p, s }) {
  const cx = 255, cy = 285, r = 180;
  const SO = 14, SI = 7;  // stroke outer / inner

  const seam = (d) =>
    `<path d="${d}" fill="none" stroke="${s}" stroke-width="${SO}" stroke-linecap="round"/>
    <path d="${d}" fill="none" stroke="${p}" stroke-width="${SI}" stroke-linecap="round"/>`;

  // Couture 1 : S-curve horizontale
  const s1 = seam(`M 75,285 C 135,210 180,225 255,285 C 330,345 375,360 435,285`);
  // Couture 2 : arc gauche
  const s2 = seam(`M 165,129 C 95,170 77,225 76,285 C 77,345 95,400 165,441`);
  // Couture 3 : arc droit
  const s3 = seam(`M 345,129 C 415,170 433,225 434,285 C 433,345 415,400 345,441`);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="510" height="630" viewBox="0 0 510 630">
  <defs>
    <clipPath id="ballClip"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>
  </defs>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="white"/>
  <g clip-path="url(#ballClip)">
    ${s1}
    ${s2}
    ${s3}
  </g>
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

  // Livraison en PNG haute qualité
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
      console.log(`  ${country.iso} — skipped (déjà généré)`);
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
      console.log(`❌ ${err.message.slice(0, 150)}`);
    }
    await new Promise(r => setTimeout(r, 350));
  }

  await fs.writeFile(URLS_FILE, JSON.stringify(results, null, 2));
  console.log(`\n✅ URLs sauvegardées dans ${URLS_FILE}\n`);
}

main().catch(console.error);
