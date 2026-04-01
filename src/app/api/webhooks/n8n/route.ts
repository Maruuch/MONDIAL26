/**
 * POST /api/webhooks/n8n
 *
 * Reçoit les callbacks de n8n après exécution WF-A ou WF-B.
 * Sécurisé par HMAC-SHA256 (header: x-n8n-signature).
 *
 * Payload WF-A terminé :
 *   { event: "wfa.design_ready", iso, design, cloudinaryUrl }
 *
 * Payload WF-B terminé :
 *   { event: "wfb.product_published", iso, design, shopifyProductId }
 */
import { NextRequest, NextResponse } from "next/server";
import { verifyHMAC } from "@/lib/utils/webhook";
import { upsertProductMetafield } from "@/lib/shopify/admin-api";
import logger from "@/lib/utils/logger";
import { z } from "zod";

// ─── Schemas de validation ─────────────────────────────────────────────────────
const WFAPayloadSchema = z.object({
  event: z.literal("wfa.design_ready"),
  iso: z.string().length(3),
  design: z.enum(["D1", "D2", "D3", "D4"]),
  cloudinaryUrl: z.string().url(),
});

const WFBPayloadSchema = z.object({
  event: z.literal("wfb.product_published"),
  iso: z.string().length(3),
  design: z.enum(["D1", "D2", "D3", "D4"]),
  shopifyProductId: z.string(),
  printfulProductId: z.number(),
});

const AnyPayloadSchema = z.discriminatedUnion("event", [
  WFAPayloadSchema,
  WFBPayloadSchema,
]);

// ─── Handler ──────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest): Promise<NextResponse> {
  const rawBody = await req.arrayBuffer();
  const bodyBuffer = Buffer.from(rawBody);
  const signature = req.headers.get("x-n8n-signature") ?? "";
  const secret = process.env.N8N_SECRET;

  // 1. Vérification HMAC
  if (!secret) {
    logger.error("N8N_SECRET manquant");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const isValid = verifyHMAC(bodyBuffer, signature, secret);
  if (!isValid) {
    logger.warn({ signature }, "Webhook n8n — signature HMAC invalide");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse + validation
  let payload: unknown;
  try {
    payload = JSON.parse(bodyBuffer.toString("utf-8"));
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = AnyPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    logger.warn({ errors: parsed.error.flatten() }, "Webhook n8n — payload invalide");
    return NextResponse.json({ error: "Bad payload", details: parsed.error.flatten() }, { status: 422 });
  }

  const data = parsed.data;
  logger.info({ event: data.event, iso: data.iso }, "Webhook n8n reçu");

  // 3. Dispatch selon l'event
  try {
    if (data.event === "wfa.design_ready") {
      // WF-A terminé : rien à faire côté Next — n8n enchaîne sur WF-B
      logger.info({ iso: data.iso, design: data.design }, "Design prêt, WF-B va démarrer");
    }

    if (data.event === "wfb.product_published") {
      // WF-B terminé : on enregistre l'ID Printful dans les metafields Shopify
      await upsertProductMetafield(
        data.shopifyProductId,
        "football2026",
        "printful_product_id",
        String(data.printfulProductId),
        "number_integer"
      );
      logger.info(
        { shopifyProductId: data.shopifyProductId, printfulProductId: data.printfulProductId },
        "Metafield Printful mis à jour"
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    logger.error({ err, event: data.event }, "Webhook n8n — erreur traitement");
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
