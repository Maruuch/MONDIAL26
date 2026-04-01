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
  const data = await shopifyFetch<ProductByHandleResponse>(
    GET_PRODUCT_BY_HANDLE,
    { handle }
  );
  return data.product;
}

/**
 * Récupère les 4 produits d'un pays (D1-D4)
 */
export async function getProductsByCountry(
  iso: string
): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<ProductsByCountryResponse>(
    GET_PRODUCTS_BY_COUNTRY,
    {
      query: `tag:football2026 AND metafield.football2026.country_iso:${iso}`,
      first: 4,
    }
  );
  return data.products.edges.map((e) => e.node);
}

/**
 * Récupère la liste dédupliquée de tous les pays disponibles
 */
export async function getAllCountries(): Promise<
  Array<{ iso: string; name: string }>
> {
  const data = await shopifyFetch<AllCountriesResponse>(GET_ALL_COUNTRIES);

  const seen = new Set<string>();
  const countries: Array<{ iso: string; name: string }> = [];

  for (const { node } of data.products.edges) {
    const iso = node.country_iso?.value;
    const name = node.country_name?.value;
    if (iso && name && !seen.has(iso)) {
      seen.add(iso);
      countries.push({ iso, name });
    }
  }

  return countries.sort((a, b) => a.name.localeCompare(b.name));
}
