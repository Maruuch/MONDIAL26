/**
 * Printful API — Création et gestion des produits synchronisés
 * Utilise resolvePrintfulVariants() pour une résolution dynamique des IDs
 */
import { printfulFetch } from "./client";
import { buildSKU } from "@/lib/utils/sku";
import { resolvePrintfulVariants } from "./resolve-variants";
import type {
  Gender,
  DesignCode,
  PrintfulSyncProduct,
  PrintfulSyncVariant,
} from "@/types";
import { SIZES } from "@/types";
import logger from "@/lib/utils/logger";

// ─── Types Printful internes ──────────────────────────────────────────────────

interface PrintfulVariantInput {
  variant_id: number;
  retail_price: string;
  sku: string;
  files: Array<{
    placement: "front" | "back";
    url: string;
  }>;
}

// ─── Génération variantes (dynamique) ─────────────────────────────────────────

/**
 * Construit les variantes Printful en résolvant les IDs dynamiquement.
 * Fail fast si une taille Shopify n'a pas de correspondance.
 */
async function buildPrintfulVariants(
  iso: string,
  design: DesignCode,
  cloudinaryUrl: string,
  retailPrice = "29.99"
): Promise<PrintfulVariantInput[]> {
  const variantMap = await resolvePrintfulVariants();
  const variants: PrintfulVariantInput[] = [];
  const genders: Gender[] = ["MEN", "WOMEN", "KIDS"];

  for (const gender of genders) {
    for (const size of SIZES[gender]) {
      const variantId = variantMap[gender]?.variants[size];

      if (!variantId || variantId === 0) {
        throw new Error(
          `[Printful] Variant ID manquant pour ${gender}/${size}. Exécuter: npm run sync:printful`
        );
      }

      const sku = buildSKU({ iso, design, gender, size });
      variants.push({
        variant_id: variantId,
        retail_price: retailPrice,
        sku,
        files: [{ placement: "front", url: cloudinaryUrl }],
      });
    }
  }

  logger.info(
    { iso, design, count: variants.length },
    "Printful variants built"
  );
  return variants;
}

// ─── API Calls ────────────────────────────────────────────────────────────────

/**
 * Crée un produit synchronisé sur Printful.
 * Idempotent : vérifie d'abord si le produit externe existe déjà.
 */
export async function createPrintfulProduct(params: {
  iso: string;
  design: DesignCode;
  productName: string;
  cloudinaryUrl: string;
  retailPrice?: string;
}): Promise<{ id: number; external_id: string }> {
  const { iso, design, productName, cloudinaryUrl, retailPrice = "29.99" } = params;
  const externalId = `football2026-${iso}-${design}`.toLowerCase();

  // Idempotence : si déjà existant → retourne l'existant
  const existing = await getPrintfulProductByExternalId(externalId);
  if (existing) {
    logger.info({ externalId, id: existing.id }, "Printful product already exists, skipping");
    return { id: existing.id, external_id: externalId };
  }

  const variants = await buildPrintfulVariants(iso, design, cloudinaryUrl, retailPrice);

  const body = {
    sync_product: {
      external_id: externalId,
      name: productName,
      thumbnail: cloudinaryUrl,
    },
    variants,
  };

  logger.info({ externalId, iso, design, variantCount: variants.length }, "Creating Printful product");

  const result = await printfulFetch<{ id: number; external_id: string }>(
    "/store/products",
    { method: "POST", body: JSON.stringify(body) }
  );

  logger.info({ printfulId: result.id, externalId }, "Printful product created");
  return result;
}

/**
 * Récupère un produit Printful par ID externe
 */
export async function getPrintfulProductByExternalId(
  externalId: string
): Promise<PrintfulSyncProduct | null> {
  try {
    return await printfulFetch<PrintfulSyncProduct>(`/store/products/@${externalId}`);
  } catch {
    return null;
  }
}

/**
 * Liste les variantes d'un produit Printful
 */
export async function getPrintfulVariants(
  productId: number
): Promise<PrintfulSyncVariant[]> {
  const data = await printfulFetch<{ sync_variants: PrintfulSyncVariant[] }>(
    `/store/products/${productId}`
  );
  return data.sync_variants;
}
