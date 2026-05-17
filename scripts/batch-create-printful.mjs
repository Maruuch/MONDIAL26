/**
 * batch-create-printful.mjs
 * Crée 47 produits Printful (tous sauf BA déjà existant)
 * Polo SOL'S 11362 — 4 placements DTFilm par pays
 *
 * Usage:
 *   node scripts/batch-create-printful.mjs          # tous les pays
 *   node scripts/batch-create-printful.mjs --test   # France seulement (test)
 *   node scripts/batch-create-printful.mjs --dry    # affiche les payloads sans créer
 */

const API_KEY   = 'L9Hrq6urY7mRUBRDMGl9qPoR3YwuTTBU3iZ4XSaA';
const STORE_ID  = '17987622';   // PRINTFUL_STORE_ID du .env.local (Shopify-linked store)
const GITHUB    = 'https://raw.githubusercontent.com/Maruuch/MONDIAL26/main';

const args = process.argv.slice(2);
const TEST  = args.includes('--test');
const DRY   = args.includes('--dry');

// ── Catalog variant IDs — SOL'S 11362 (Spring II Men's Pique Polo Shirt) ──
const VARIANTS = [
  { size: 'S',   id: 20630, price: '30.50' },
  { size: 'M',   id: 20616, price: '30.50' },
  { size: 'L',   id: 20623, price: '30.50' },
  { size: 'XL',  id: 20637, price: '30.50' },
  { size: '2XL', id: 20644, price: '32.00' },
  { size: '3XL', id: 20651, price: '34.00' },
  { size: '4XL', id: 20658, price: '35.50' },
  { size: '5XL', id: 20665, price: '37.00' },
];

// ── 48 pays — nom EN, slogan local, couleurs primaire/secondaire ───────────
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
  // BA déjà créé — skippé par défaut (voir flag INCLUDE_BA)
  { iso:'BA', name:'Bosnia and Herzegovina', slogan:'Idemo Zmajevi',                      p:'#002395', s:'#FBBC04', skip:true },
  { iso:'HR', name:'Croatia',                slogan:'Idemo Hrvatska',                     p:'#FF0000', s:'#0093DD' },
  { iso:'CZ', name:'Czechia',                slogan:'Do toho, Česko',                     p:'#D7141A', s:'#11457E' },
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

// ── Payload API v1 (fallback) ─────────────────────────────────────────────
// v1 : type = nom du placement, supporte id (fichier existant) ou url
// Manches : réutilise les fichiers du produit BA (id fixe, même design)
//   left sleeve  fileId 989546368 = clipart volleyball
//   right sleeve fileId 989546367 = WORLD/2026/CUP (couleurs BA par défaut)
const SLEEVE_LEFT_FILE_ID  = 989546368;
const SLEEVE_RIGHT_FILE_ID = 989546367;

function buildPayloadV1(country) {
  const emblemUrl = `${GITHUB}/teams/${country.iso}/emblem/emblem_${country.iso}.png`;
  return {
    sync_product: { name: `Premium pique polo shirt ${country.iso}` },
    sync_variants: VARIANTS.map(v => ({
      variant_id:   v.id,
      retail_price: v.price,
      files: [
        { type: 'chest_left_dtf',       url: emblemUrl },
        { type: 'short_sleeve_left_dtf', id: SLEEVE_LEFT_FILE_ID  },
        { type: 'short_sleeve_right_dtf',id: SLEEVE_RIGHT_FILE_ID },
      ],
    })),
  };
}

// ── Construit le payload Printful v2 pour un pays ─────────────────────────
function buildPayload(country) {
  const emblemUrl = `${GITHUB}/teams/${country.iso}/emblem/emblem_${country.iso}.png`;
  const { name, slogan, p: primary, s: secondary, iso } = country;

  const syncVariants = VARIANTS.map(v => ({
    catalog_variant_id: v.id,
    retail_price: v.price,
    source: emblemUrl,   // champ requis par l'API v2
    placements: [
      // Face avant — emblème poitrine gauche
      {
        placement: 'chest_left_dtf',
        technique:  'dtfilm',
        layers: [{
          type: 'file',
          position: { width: 2.4, height: 3, top: 0, left: 0.3 },
          url: emblemUrl,
        }],
      },
      // Face arrière — nom du pays + slogan
      {
        placement: 'back_dtf',
        technique:  'dtfilm',
        layers: [
          {
            type: 'textbox',
            position: { width: 9.5625, height: 1.5, top: 1.325, left: 1.2188 },
            layer_options: [
              { id: 'text',         value: name },
              { id: 'font_family',  value: 'Aladin' },
              { id: 'font_size',    value: 1.0 },
              { id: 'text_align',   value: 'center' },
              { id: 'text_color',   value: secondary },
              { id: 'stroke_color', value: primary },
              { id: 'stroke_width', value: 0.2 },
            ],
          },
          {
            type: 'textbox',
            position: { width: 11.5, height: 2.16, top: 3.246, left: 0.25 },
            layer_options: [
              { id: 'text',         value: slogan },
              { id: 'font_family',  value: 'Caveat Brush' },
              { id: 'font_size',    value: 2.0 },
              { id: 'text_align',   value: 'center' },
              { id: 'text_color',   value: primary },
              { id: 'stroke_color', value: secondary },
              { id: 'stroke_width', value: 0.2 },
            ],
          },
        ],
      },
      // Manche gauche — volleyball clipart (même pour tous les pays)
      {
        placement: 'short_sleeve_left_dtf',
        technique:  'dtfilm',
        layers: [{ type: 'file', id: SLEEVE_LEFT_FILE_ID }],
      },
      // Manche droite — WORLD / 2026 / CUP aux couleurs du pays
      {
        placement: 'short_sleeve_right_dtf',
        technique:  'dtfilm',
        layers: [
          {
            type: 'textbox',
            position: { width: 1.14, height: 0.3, top: 0.1, left: 0.28 },
            layer_options: [
              { id: 'text',         value: 'WORLD' },
              { id: 'font_family',  value: 'Aladin' },
              { id: 'font_size',    value: 0.25 },
              { id: 'text_align',   value: 'center' },
              { id: 'text_color',   value: secondary },
              { id: 'stroke_color', value: primary },
              { id: 'stroke_width', value: 0.04 },
            ],
          },
          {
            type: 'textbox',
            position: { width: 1.67, height: 0.55, top: 0.45, left: 0.015 },
            layer_options: [
              { id: 'text',         value: '2026' },
              { id: 'font_family',  value: 'Caveat Brush' },
              { id: 'font_size',    value: 0.50 },
              { id: 'text_align',   value: 'center' },
              { id: 'text_color',   value: primary },
              { id: 'stroke_color', value: secondary },
              { id: 'stroke_width', value: 0.04 },
            ],
          },
          {
            type: 'textbox',
            position: { width: 0.71, height: 0.3, top: 1.05, left: 0.495 },
            layer_options: [
              { id: 'text',         value: 'CUP' },
              { id: 'font_family',  value: 'Aladin' },
              { id: 'font_size',    value: 0.25 },
              { id: 'text_align',   value: 'center' },
              { id: 'text_color',   value: secondary },
              { id: 'stroke_color', value: primary },
              { id: 'stroke_width', value: 0.04 },
            ],
          },
        ],
      },
    ],
  }));

  return {
    sync_product: { name: `Premium pique polo shirt ${iso}` },
    sync_variants: syncVariants,
  };
}

// ── Appel API Printful ────────────────────────────────────────────────────
async function createProduct(country) {
  const payload = buildPayload(country);

  if (DRY) {
    console.log(`[DRY] ${country.iso}:`, JSON.stringify(payload, null, 2).slice(0, 400), '\n...');
    return { ok: true, dry: true };
  }

  // Essai 1 : API v2 avec header X-PF-Store-Id
  let resp = await fetch('https://api.printful.com/v2/sync-products', {
    method:  'POST',
    headers: {
      'Authorization':  `Bearer ${API_KEY}`,
      'Content-Type':   'application/json',
      'X-PF-Store-Id':  STORE_ID,
    },
    body: JSON.stringify(payload),
  });

  // Essai 2 : API v1 si v2 échoue
  if (!resp.ok) {
    const v2Body = await resp.text().catch(() => '');
    console.error(`\n  [v2 fail ${resp.status}] ${v2Body.slice(0, 300)}`);

    const v1Payload = buildPayloadV1(country);
    resp = await fetch('https://api.printful.com/store/products', {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type':  'application/json',
        'X-PF-Store-Id': STORE_ID,
      },
      body: JSON.stringify(v1Payload),
    });
  }

  const data = await resp.json();
  if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${JSON.stringify(data)}`);
  return data;
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  const toProcess = TEST
    ? COUNTRIES.filter(c => c.iso === 'FR')
    : COUNTRIES.filter(c => !c.skip);

  console.log(`\n🚀 Création de ${toProcess.length} produits Printful${DRY ? ' (DRY RUN)' : ''}...\n`);

  const results = { ok: [], err: [] };

  for (const country of toProcess) {
    try {
      process.stdout.write(`  ${country.iso} — ${country.name}... `);
      const result = await createProduct(country);
      const id = result?.data?.id || '?';
      console.log(`✅  (id: ${id})`);
      results.ok.push({ iso: country.iso, id });

      // Pause 500ms entre chaque appel pour éviter le rate limit
      if (!DRY) await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      console.log(`❌  ${err.message}`);
      results.err.push({ iso: country.iso, error: err.message });
    }
  }

  console.log('\n──────────────────────────────────────────');
  console.log(`✅ OK  : ${results.ok.length}`);
  console.log(`❌ ERR : ${results.err.length}`);
  if (results.err.length) {
    console.log('\nÉchecs:');
    results.err.forEach(e => console.log(`  ${e.iso}: ${e.error}`));
  }
}

main().catch(console.error);
