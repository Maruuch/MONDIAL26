"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Cart } from "@/lib/shopify/cart-api";

const CART_ID_STORAGE_KEY = "football2026_cart_id";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CartContextValue {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  updateLine: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
  openCheckout: () => void;
  totalQuantity: number;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans <CartProvider>");
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupère le cartId persisté localement
  function getStoredCartId(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(CART_ID_STORAGE_KEY);
  }

  function persistCartId(id: string): void {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CART_ID_STORAGE_KEY, id);
    }
  }

  // ─ Helpers fetch via Route Handler (server-side Shopify, pas d'exposition de token)
  async function callCartApi<T>(
    action: string,
    body: Record<string, unknown>
  ): Promise<T> {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...body }),
    });
    if (!res.ok) {
      const { error: msg } = await res.json().catch(() => ({ error: "Erreur inconnue" }));
      throw new Error(msg ?? `Cart API error ${res.status}`);
    }
    return res.json() as Promise<T>;
  }

  // ─ Initialisation
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const cartId = getStoredCartId();
        const result = await callCartApi<Cart>("getOrCreate", { cartId });
        setCart(result);
        persistCartId(result.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur panier");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const addToCart = useCallback(async (variantId: string, quantity = 1) => {
    if (!cart) return;
    setLoading(true);
    setError(null);
    try {
      const updated = await callCartApi<Cart>("addLine", {
        cartId: cart.id,
        variantId,
        quantity,
      });
      setCart(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur ajout panier");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cart]);

  const updateLine = useCallback(async (lineId: string, quantity: number) => {
    if (!cart) return;
    setLoading(true);
    setError(null);
    try {
      const updated = await callCartApi<Cart>("updateLine", {
        cartId: cart.id,
        lineId,
        quantity,
      });
      setCart(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur mise à jour panier");
    } finally {
      setLoading(false);
    }
  }, [cart]);

  const removeLine = useCallback(async (lineId: string) => {
    if (!cart) return;
    setLoading(true);
    setError(null);
    try {
      const updated = await callCartApi<Cart>("removeLine", {
        cartId: cart.id,
        lineId,
      });
      setCart(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur suppression panier");
    } finally {
      setLoading(false);
    }
  }, [cart]);

  const openCheckout = useCallback(() => {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    }
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addToCart,
        updateLine,
        removeLine,
        openCheckout,
        totalQuantity: cart?.totalQuantity ?? 0,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
