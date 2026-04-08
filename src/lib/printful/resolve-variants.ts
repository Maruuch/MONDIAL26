/**
 * resolvePrintfulVariants()
 *
 * Résolution dynamique des IDs variantes Printful via l'API catalogue.
 * Stratégie :
 *   1. Lecture du mapping persistant (variant-map.json)
 *   2. Si tous les IDs sont > 0 → retourne le cache
 *   3. Sinon → appel GET /products/{id}/variants pour chaque produit
 *   4. Matching Shopify sizes → Printful sizes via pod_size_map
 *   5. Fail fast si une taille Shopify n'a pas de correspondance
 *   6. Écriture du mapping mis à jour
 *
 * Le mapping persistant sert de cache en production (ne pas rappeler l'API à chaque build).
 * À rafraîchir manuellement si Printful change ses IDs : npm run sync:printful
 */

import fs from "fs/promises";
import path from "path";
import { printfulFetch } from "./client";
import { SIZES, type Gender } from "@/types";
import logger from "@/lib/utils/logger";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VariantMapEntry {
  printful_product_id: number;
  variants: Record<string, number>; // size → printful_variant_id
}

interface VariantMap {
  _meta: {
    last_synced: string | null;
    notes: string;
  };
  MEN: VariantMapEntry;
  WOMEN: VariantMapEntry;
}

interface PrintfulCatalogVariant {
  id: number;
  name: string;             // e.g. "S / White"
  size: string;             // e.g. "S"
  color: string;
  availability_status: string;
}

interface PrintfulProduct {
  id: number;
  title: string;
  variants: PrintfulCatalogVariant[];
}

// ─── Config : IDs des produits Printful catalogue à utiliser ─────────────────
// Ces IDs sont les IDs CATALOGUE (pas store) — stables dans le temps.
// MEN/WOMEN : Bella+Canvas 3001 Unisex (id: 71 sur Printful)
// KIDS : Bella+Canvas 3001Y Youth (id: 74 sur Printful)
// 👉 À confirmer via GET https://api.printful.com/products (liste catalogue)
const PRINTFUL_CATALOG_PRODUCT_IDS: Record<Gender, number> = {
  MEN: 71,     // Bella+Canvas 3001 Unisex T-Shirt
  WOMEN: 71,   // Même base, variantes F différenciées par taille
};

/**
 * Mapping : taille Shopify → label attendu dans le nom de la variante Printful
 * Cas KIDS : Printful utilise des labels "2T", "4T"… différents des nôtres "0-1", "1-2"…
 */
const POD_SIZE_MAP: Record<Gender, Record<string, string>> = {
  MEN: { S: "S", M: "M", L: "L", XL: "XL", XXL: "2XL" },
  WOMEN: { XS: "XS", S: "S", M: "M", L: "L", XL: "XL" },
};

// Fichier source bundlé (lecture initiale, read-only sur Vercel)
const MAP_FILE_BUNDLE = path.join(process.cwd(), "src/lib/printful/variant-map.json");
// Cache runtime dans /tmp — seul répertoire inscriptible sur Vercel lambdas
const MAP_FILE_TMP = "/tmp/printful-variant-map.json";

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function readMap(): Promise<VariantMap> {
  // Priorité : cache /tmp (déjà hydraté dans ce container)
  try {
    const raw = await fs.readFile(MAP_FILE_TMP, "utf-8");
    return JSON.parse(raw) as VariantMap;
  } catch {
    // Première invocation du container → lire le fichier bundlé
    const raw = await fs.readFile(MAP_FILE_BUNDLE, "utf-8");
    return JSON.parse(raw) as VariantMap;
  }
}

async function writeMap(map: VariantMap): Promise<void> {
  // Écriture dans /tmp (inscriptible sur Vercel et en local)
  await fs.writeFile(MAP_FILE_TMP, JSON.stringify(map, null, 2), "utf-8");
}

function isMapHydrated(map: VariantMap): boolean {
  const genders: Gender[] = ["MEN", "WOMEN"];
  for (const gender of genders) {
    const entry = map[gender];
    if (!entry.printful_product_id) return false;
    for (const id of Object.values(entry.variants)) {
      if (!id || id === 0) return false;
    }
  }
  return true;
}

// ─── Core ─────────────────────────────────────────────────────────────────────

/**
 * Résout les variantes Printful pour un genre donné.
 * @throws Error si une taille Shopify n'a pas de correspondance Printful (fail fast)
 */
async function resolveGenderVariants(
  gender: Gender,
  catalogProductId: number
): Promise<VariantMapEntry> {
  logger.info({ gender, catalogProductId }, "Fetching Printful catalog variants");

  const product = await printfulFetch<PrintfulProduct>(
    `/products/${catalogProductId}`
  );

  const entry: VariantMapEntry = {
    printful_product_id: product.id,
    variants: {},
  };

  const shopifySizes = SIZES[gender];
  const sizeMap = POD_SIZE_MAP[gender];

  for (const shopifySize of shopifySizes) {
    const printfulSizeLabel = sizeMap[shopifySize];
    if (!printfulSizeLabel) {
      throw new Error(
        `[Printful] Aucun mapping pod_size_map pour ${gender} / "${shopifySize}"`
      );
    }

    // Cherche la variante Printful dont le nom contient le label attendu
    const match = product.variants.find(
      (v) =>
        v.size === printfulSizeLabel ||
        v.name.toLowerCase().includes(printfulSizeLabel.toLowerCase())
    );

    if (!match) {
      throw new Error(
        `[Printful] FAIL FAST — Variante introuvable pour ${gender} / Shopify:"${shopifySize}" → Printful:"${printfulSizeLabel}" (produit ${catalogProductId})`
      );
    }

    entry.variants[shopifySize] = match.id;
    logger.debug(
      { gender, shopifySize, printfulSizeLabel, printfulVariantId: match.id },
      "Variant mapped"
    );
  }

  return entry;
}

/**
 * Point d'entrée principal.
 * Retourne le mapping complet {gender → {printful_product_id, variants}}.
 * Utilise le cache si déjà hydraté.
 */
export async function resolvePrintfulVariants(
  opts: { forceRefresh?: boolean } = {}
): Promise<VariantMap> {
  const map = await readMap();

  if (!opts.forceRefresh && isMapHydrated(map)) {
    logger.debug("Printful variant map: cache hit");
    return map;
  }

  logger.info("Printful variant map: hydrating from API…");
  const genders: Gender[] = ["MEN", "WOMEN"];

  for (const gender of genders) {
    const catalogId = PRINTFUL_CATALOG_PRODUCT_IDS[gender];
    map[gender] = await resolveGenderVariants(gender, catalogId);
  }

  map._meta.last_synced = new Date().toISOString();
  await writeMap(map);

  logger.info("Printful variant map: hydrated and persisted");
  return map;
}

/**
 * Retourne l'ID variante Printful pour un gender+size donné.
 * @throws Error si non trouvé (fail fast)
 */
export async function getPrintfulVariantId(
  gender: Gender,
  size: string
): Promise<number> {
  const map = await resolvePrintfulVariants();
  const variantId = map[gender]?.variants[size];

  if (!variantId || variantId === 0) {
    throw new Error(
      `[Printful] Variant ID manquant pour ${gender} / ${size} — Exécuter: npm run sync:printful`
    );
  }
  return variantId;
}
