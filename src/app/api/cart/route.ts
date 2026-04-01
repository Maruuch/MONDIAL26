/**
 * POST /api/cart
 *
 * Proxy server-side pour le Cart API Shopify.
 * Le Storefront Access Token n'est jamais exposé côté client.
 *
 * Actions supportées :
 *   - getOrCreate  : récupère ou crée un panier
 *   - addLine      : ajoute une variante
 *   - updateLine   : met à jour la quantité
 *   - removeLine   : supprime une ligne
 */
import { NextRequest, NextResponse } from "next/server";
import {
  getOrCreateCart,
  addLineToCart,
  updateCartLine,
  removeCartLine,
} from "@/lib/shopify/cart-api";
import { z } from "zod";
import logger from "@/lib/utils/logger";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const GetOrCreateSchema = z.object({
  action: z.literal("getOrCreate"),
  cartId: z.string().nullable().optional(),
});

const AddLineSchema = z.object({
  action: z.literal("addLine"),
  cartId: z.string(),
  variantId: z.string().startsWith("gid://shopify/ProductVariant/"),
  quantity: z.number().int().min(1).max(10).default(1),
});

const UpdateLineSchema = z.object({
  action: z.literal("updateLine"),
  cartId: z.string(),
  lineId: z.string(),
  quantity: z.number().int().min(0).max(10),
});

const RemoveLineSchema = z.object({
  action: z.literal("removeLine"),
  cartId: z.string(),
  lineId: z.string(),
});

const CartRequestSchema = z.discriminatedUnion("action", [
  GetOrCreateSchema,
  AddLineSchema,
  UpdateLineSchema,
  RemoveLineSchema,
]);

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = CartRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Payload invalide", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const data = parsed.data;
  logger.info({ action: data.action }, "Cart API call");

  try {
    switch (data.action) {
      case "getOrCreate": {
        const cart = await getOrCreateCart(data.cartId);
        return NextResponse.json(cart);
      }

      case "addLine": {
        const cart = await addLineToCart(data.cartId, data.variantId, data.quantity);
        return NextResponse.json(cart);
      }

      case "updateLine": {
        const cart = await updateCartLine(data.cartId, data.lineId, data.quantity);
        return NextResponse.json(cart);
      }

      case "removeLine": {
        const cart = await removeCartLine(data.cartId, data.lineId);
        return NextResponse.json(cart);
      }
    }
  } catch (err) {
    logger.error({ err, action: data.action }, "Cart API error");
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur serveur" },
      { status: 500 }
    );
  }
}
