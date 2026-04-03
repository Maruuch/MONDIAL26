/**
 * POST /api/products/create
 *
 * Orchestrateur WF-B : crée le produit sur Printful + Shopify, publie.
 * Appelé par n8n WF-B via webhook interne.
 *
 * Auth : Bearer token — header Authorization: Bearer <N8N_SECRET>
 *
 * Body :
 *   { iso: string, design: "D1"|"D2"|"D3"|"D4", cloudinaryUrl: string,
 *     productName?: string, retailPrice?: string }
 *
 * Response 201 :
 *   { printfulProductId: number, shopifyProductId: string }
 */
import { NextRequest, NextResponse } from "next/server";
import { createPrintfulProduct } from "@/lib/printful/api";
import {
  createDraftProduct,
  publishProduct,
  upsertProductMetafield,
} from "@/lib/shopify/admin-api";
import { buildSKU } from "@/lib/utils/sku";
import { SIZES, DESIGN_MAP } from "@/types";
import type { Gender, DesignCode } from "@/types";
import logger from "@/lib/utils/logger";
import { z } from "zod";
import crypto from "crypto";

// ─── Schema ───────────────────────────────────────────────────────────────────

const BodySchema = z.object({
  iso: z.string().min(2).max(3).toUpperCase(),
  design: z.enum(["D1", "D2", "D3", "D4"]),
  cloudinaryUrl: z.string().url(),
  productName: z.string().optional(),
  retailPrice: z.string().optional(),
});

// ─── Auth ─────────────────────────────────────────────────────────────────────

function verifyBearer(authHeader: string | null, secret: string): boolean {
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);
  try {
    // Comparaison en temps constant
    return crypto.timingSafeEqual(
      Buffer.from(token, "utf-8"),
      Buffer.from(secret, "utf-8")
    );
  } catch {
    return false;
  }
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  const secret = process.env.N8N_SECRET;
  if (!secret) {
    logger.error("N8N_SECRET manquant");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  // 1. Auth
  const isAuthorized = verifyBearer(req.headers.get("authorization"), secret);
  if (!isAuthorized) {
    logger.warn("POST /api/products/create — token invalide");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse + validate
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Bad payload", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const {
    iso,
    design,
    cloudinaryUrl,
    productName,
    retailPrice = "29.99",
  } = parsed.data;

  const title =
    productName ??
    `Maillot ${iso} — ${DESIGN_MAP[design as DesignCode]} (${design})`;

  logger.info({ iso, design }, "POST /api/products/create — début");

  try {
    // 3. Créer produit Printful
    const { id: printfulProductId } = await createPrintfulProduct({
      iso,
      design: design as DesignCode,
      productName: title,
      cloudinaryUrl,
      retailPrice,
    });

    // 4. Construire variantes Shopify : options["Genre", "Taille"] × genre × taille
    const genders: Gender[] = ["MEN", "WOMEN", "KIDS"];
    const shopifyVariants: Array<{ sku: string; price: string; options: string[] }> = [];

    for (const gender of genders) {
      for (const size of SIZES[gender]) {
        shopifyVariants.push({
          sku: buildSKU({ iso, design: design as DesignCode, gender, size }),
          price: retailPrice,
          options: [gender, size],
        });
      }
    }

    // 5. Créer draft Shopify
    const shopifyProductId = await createDraftProduct({
      title,
      descriptionHtml: `<p>Maillot fan-made <strong>${iso}</strong> • Design ${design} • Produit non officiel, non affilié à la FIFA.</p>`,
      vendor: "Mondial26",
      tags: ["football2026", iso.toLowerCase(), design.toLowerCase(), "fan-made"],
      options: ["Genre", "Taille"],
      variants: shopifyVariants,
    });

    // 6. Stocker l'ID Printful comme metafield (avant publication)
    await upsertProductMetafield(
      shopifyProductId,
      "football2026",
      "printful_product_id",
      String(printfulProductId),
      "number_integer"
    );

    // 7. Publier
    await publishProduct(shopifyProductId);

    logger.info(
      { printfulProductId, shopifyProductId, iso, design },
      "Produit créé + publié avec succès"
    );

    return NextResponse.json(
      { printfulProductId, shopifyProductId },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    logger.error({ err: message, iso, design }, "POST /api/products/create — erreur");
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
