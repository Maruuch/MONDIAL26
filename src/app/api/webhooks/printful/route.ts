/**
 * POST /api/webhooks/printful
 *
 * Reçoit les événements Printful (order, product, stock…).
 * Sécurisé par HMAC-SHA256 (header: x-printful-signature).
 *
 * Ref: https://developers.printful.com/docs/#tag/Webhooks
 */
import { NextRequest, NextResponse } from "next/server";
import { verifyHMAC } from "@/lib/utils/webhook";
import logger from "@/lib/utils/logger";
import { z } from "zod";

const PrintfulEventSchema = z.object({
  type: z.string(),
  created: z.number(),
  store: z.number(),
  data: z.record(z.unknown()),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  const rawBody = await req.arrayBuffer();
  const bodyBuffer = Buffer.from(rawBody);
  const signature = req.headers.get("x-printful-signature") ?? "";
  const secret = process.env.PRINTFUL_API_KEY;

  if (!secret) {
    logger.error("PRINTFUL_API_KEY manquant");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  // Printful utilise le format sha256=<hex>
  const isValid = verifyHMAC(bodyBuffer, signature, secret, "sha256=");
  if (!isValid) {
    logger.warn({ signature }, "Webhook Printful — signature invalide");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(bodyBuffer.toString("utf-8"));
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = PrintfulEventSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Bad payload" }, { status: 422 });
  }

  const { type, data } = parsed.data;
  logger.info({ type }, "Webhook Printful reçu");

  // Dispatch événements Printful
  switch (type) {
    case "package_shipped":
      logger.info({ data }, "Printful: colis expédié");
      // TODO: Notifier le client via Shopify order fulfillment
      break;

    case "order_failed":
      logger.error({ data }, "Printful: commande échouée");
      // TODO: Alerter l'équipe ops
      break;

    case "product_synced":
      logger.info({ data }, "Printful: produit synchronisé");
      break;

    default:
      logger.debug({ type }, "Printful: événement non géré");
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
