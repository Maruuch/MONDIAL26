import { shopifyFetch } from "./client";
import {
  GET_PRODUCT_BY_HANDLE,
  GET_PRODUCTS_BY_COUNTRY,
  GET_ALL_COUNTRIES,
} from "./queries";
import type { ShopifyProduct } from "@/types";

// ─── Types de réponse GraphQL ─────────────────────────────────────────────────
interface ProductByHandleResponse {
  product: ShopifyProduct | null;
}

interface ProductsByCountryResponse {
  products: {
    edges: Array<{ node: ShopifyProduct }>;
  };
}

interface AllCountriesResponse {
  products: {
    edges: Array<{
      node: {
        country_iso: { value: string } | null;
        country_name: { value: string } | null;
      };
    }>;
  };
}

// ─── API helpers ──────────────────────────────────────────────────────────────

/**
 * Récupère un produit par son handle Shopify
 */
export async function getProductByHandle(
  handle: string
): Promise<ShopifyProduct | null> {
  try {
    const data = await shopifyFetch<ProductByHandleResponse>(
      GET_PRODUCT_BY_HANDLE,
      { handle }
    );
    return data?.product ?? null;
  } catch (err) {
    console.warn("[Shopify] getProductByHandle failed:", err);
    return null;
  }
}

/**
 * Récupère les 4 produits d'un pays (D1-D4)
 * Compatible Storefront API et Admin API :
 *   - Storefront : filtre metafield dans la query
 *   - Admin API  : fetch par tag + filtre JS (metafield syntax différente)
 */
export async function getProductsByCountry(
  iso: string
): Promise<ShopifyProduct[]> {
  try {
    // Tentative avec filtre metafield natif (Storefront API)
    const data = await shopifyFetch<ProductsByCountryResponse>(
      GET_PRODUCTS_BY_COUNTRY,
      {
        query: `tag:football2026 metafield.football2026.country_iso:${iso}`,
        first: 4,
      }
    );
    const results = data?.products?.edges?.map((e) => e.node) ?? [];
    // Fallback JS si la query metafield n'est pas supportée (résultats trop larges)
    if (results.length === 0 || results.every((p) => !(p as unknown as Record<string, { value?: string }>)["country_iso"])) {
      return results
        .filter((p) => ((p as unknown as Record<string, { value?: string }>)["country_iso"])?.value === iso)
        .slice(0, 4);
    }
    return results;
  } catch {
    // Admin API : fetch all tagged + filtre JS
    const data = await shopifyFetch<ProductsByCountryResponse>(
      GET_PRODUCTS_BY_COUNTRY,
      { query: `tag:football2026 status:active`, first: 250 }
    );
    return (data?.products?.edges?.map((e) => e.node) ?? [])
      .filter((p) => ((p as unknown as Record<string, { value?: string }>)["country_iso"])?.value === iso)
      .slice(0, 4);
  }
}

/**
 * Récupère la liste dédupliquée de tous les pays disponibles
 */
export async function getAllCountries(): Promise<
  Array<{ iso: string; name: string }>
> {
  try {
    const data = await shopifyFetch<AllCountriesResponse>(GET_ALL_COUNTRIES);

    const seen = new Set<string>();
    const countries: Array<{ iso: string; name: string }> = [];

    for (const { node } of data?.products?.edges ?? []) {
      const iso = node.country_iso?.value;
      const name = node.country_name?.value;
      if (iso && name && !seen.has(iso)) {
        seen.add(iso);
        countries.push({ iso, name });
      }
    }

    return countries.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    // Retourne tableau vide si API non disponible (pas encore de produits)
    console.warn("[Shopify] getAllCountries failed:", err);
    return [];
  }
}
