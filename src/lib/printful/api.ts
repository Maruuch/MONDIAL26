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
    type: "front" | "back";
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
  const genders: Gender[] = ["MEN", "WOMEN"];

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
        files: [{ type: "front", url: cloudinaryUrl }],
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
    sync_variants: variants,
  };

  logger.info({ externalId, iso, design, variantCount: variants.length }, "Creating Printful product");

  // Printful v1: POST /store/products peut retourner { sync_product, sync_variants }
  // OU directement { id, external_id, ... } selon la version de l'API
  const result = await printfulFetch<Record<string, unknown>>(
    "/store/products",
    { method: "POST", body: JSON.stringify(body) }
  );

  logger.info({ resultKeys: Object.keys(result) }, "Printful createProduct raw result keys");

  // Normalisation : gère les deux structures possibles
  const syncProduct = (result.sync_product as { id: number; external_id: string } | undefined)
    ?? (result as unknown as { id: number; external_id: string });

  if (!syncProduct?.id) {
    logger.error({ result }, "Printful createProduct: impossible de trouver l'ID produit");
    throw new Error(`[Printful] createProduct: ID introuvable dans la réponse — clés: ${Object.keys(result).join(", ")}`);
  }

  logger.info({ printfulId: syncProduct.id, externalId }, "Printful product created");
  return { id: syncProduct.id, external_id: syncProduct.external_id ?? externalId };
}

/**
 * Récupère un produit Printful par ID externe
 */
export async function getPrintfulProductByExternalId(
  externalId: string
): Promise<PrintfulSyncProduct | null> {
  try {
    // Printful v2 : GET /store/products/@id retourne { sync_product: {...}, sync_variants: [...] }
    const data = await printfulFetch<{ sync_product: PrintfulSyncProduct }>(
      `/store/products/@${externalId}`
    );
    return data.sync_product ?? null;
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
