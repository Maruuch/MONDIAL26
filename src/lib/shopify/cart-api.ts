/**
 * Cart API Shopify — Abstraction complète
 *
 * Shopify est la source de vérité du panier.
 * Aucun état local non synchronisé.
 *
 * Flow :
 *   getOrCreateCart() → addLineToCart() → updateCartLine() → removeCartLine() → checkoutUrl
 *
 * Persistance cartId : localStorage côté client (géré dans CartContext)
 */

import { storefrontFetch as shopifyFetch } from "./client";
import {
  CART_CREATE,
  CART_LINES_ADD,
  CART_LINES_UPDATE,
  CART_LINES_REMOVE,
  GET_CART,
} from "./cart-queries";
import logger from "@/lib/utils/logger";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartLine {
  id: string;
  quantity: number;
  cost: { totalAmount: { amount: string; currencyCode: string } };
  merchandise: {
    id: string;
    title: string;
    sku: string;
    price: { amount: string; currencyCode: string };
    selectedOptions: Array<{ name: string; value: string }>;
    product: {
      id: string;
      handle: string;
      title: string;
      images: { edges: Array<{ node: { url: string; altText: string | null } }> };
    };
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
    totalTaxAmount: { amount: string; currencyCode: string } | null;
  };
  lines: { edges: Array<{ node: CartLine }> };
}

interface CartResponse<K extends string> {
  [key: string]: {
    cart: Cart;
    userErrors: Array<{ field: string[]; message: string; code: string }>;
  };
}

// ─── Helper error handler ─────────────────────────────────────────────────────

function assertNoErrors(userErrors: Array<{ message: string }>, operation: string): void {
  if (userErrors.length > 0) {
    const messages = userErrors.map((e) => e.message).join(", ");
    logger.error({ operation, errors: userErrors }, "Shopify Cart userErrors");
    throw new Error(`Cart error [${operation}]: ${messages}`);
  }
}

// ─── API ──────────────────────────────────────────────────────────────────────

/**
 * Récupère un panier existant par ID
 */
export async function getCart(cartId: string): Promise<Cart | null> {
  try {
    const data = await shopifyFetch<{ cart: Cart | null }>(GET_CART, { cartId });
    return data.cart;
  } catch {
    return null;
  }
}

/**
 * Crée un nouveau panier vide
 */
export async function createCart(): Promise<Cart> {
  const data = await shopifyFetch<CartResponse<"cartCreate">>(CART_CREATE, {
    input: {},
  });
  const { cart, userErrors } = data.cartCreate;
  assertNoErrors(userErrors, "cartCreate");
  logger.info({ cartId: cart.id }, "Cart created");
  return cart;
}

/**
 * Récupère ou crée un panier.
 * Si cartId fourni mais invalide (expiré/supprimé) → crée un nouveau panier.
 * Shopify = source de vérité.
 */
export async function getOrCreateCart(cartId?: string | null): Promise<Cart> {
  if (cartId) {
    const existing = await getCart(cartId);
    if (existing) {
      logger.debug({ cartId }, "Cart retrieved from Shopify");
      return existing;
    }
    logger.info({ cartId }, "Cart not found on Shopify, creating new one");
  }
  return createCart();
}

/**
 * Ajoute une ligne au panier
 * @param cartId     ID du panier Shopify
 * @param variantId  GID de la variante (ex: gid://shopify/ProductVariant/12345)
 * @param quantity   Quantité à ajouter (défaut: 1)
 */
export async function addLineToCart(
  cartId: string,
  variantId: string,
  quantity = 1
): Promise<Cart> {
  const data = await shopifyFetch<CartResponse<"cartLinesAdd">>(CART_LINES_ADD, {
    cartId,
    lines: [{ merchandiseId: variantId, quantity }],
  });
  const { cart, userErrors } = data.cartLinesAdd;
  assertNoErrors(userErrors, "cartLinesAdd");
  logger.info({ cartId, variantId, quantity }, "Cart line added");
  return cart;
}

/**
 * Met à jour la quantité d'une ligne existante
 * @param lineId    ID de la ligne (ex: gid://shopify/CartLine/xyz)
 * @param quantity  Nouvelle quantité (0 = suppression)
 */
export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<Cart> {
  if (quantity === 0) {
    return removeCartLine(cartId, lineId);
  }
  const data = await shopifyFetch<CartResponse<"cartLinesUpdate">>(CART_LINES_UPDATE, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });
  const { cart, userErrors } = data.cartLinesUpdate;
  assertNoErrors(userErrors, "cartLinesUpdate");
  logger.info({ cartId, lineId, quantity }, "Cart line updated");
  return cart;
}

/**
 * Supprime une ligne du panier
 */
export async function removeCartLine(
  cartId: string,
  lineId: string
): Promise<Cart> {
  const data = await shopifyFetch<CartResponse<"cartLinesRemove">>(CART_LINES_REMOVE, {
    cartId,
    lineIds: [lineId],
  });
  const { cart, userErrors } = data.cartLinesRemove;
  assertNoErrors(userErrors, "cartLinesRemove");
  logger.info({ cartId, lineId }, "Cart line removed");
  return cart;
}
