import logger from "@/lib/utils/logger";

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_API_KEY;
const API_VERSION = "2024-10";

if (!SHOPIFY_DOMAIN) {
  console.warn("[Shopify] SHOPIFY_STORE_DOMAIN manquant");
}
if (!STOREFRONT_TOKEN && !ADMIN_TOKEN) {
  console.warn("[Shopify] Aucun token API disponible. Le site affichera des pages vides.");
} else if (!STOREFRONT_TOKEN) {
  console.info("[Shopify] Mode Admin API — produits via token Admin (Storefront non configuré).");
}

type ApiMode = "storefront" | "admin" | "none";

function getMode(): ApiMode {
  if (STOREFRONT_TOKEN) return "storefront";
  if (ADMIN_TOKEN) return "admin";
  return "none";
}

/**
 * Fetch GraphQL Shopify — dual mode :
 *   - Storefront API si SHOPIFY_STOREFRONT_ACCESS_TOKEN défini (produits + cart)
 *   - Admin API en fallback si SHOPIFY_ADMIN_API_KEY défini (produits seulement)
 */
export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const mode = getMode();

  if (mode === "none" || !SHOPIFY_DOMAIN) {
    logger.warn("[Shopify] Aucun token — données vides retournées");
    return {} as T;
  }

  const endpoint =
    mode === "storefront"
      ? `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`
      : `https://${SHOPIFY_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (mode === "storefront") {
    headers["X-Shopify-Storefront-Access-Token"] = STOREFRONT_TOKEN!;
  } else {
    headers["X-Shopify-Access-Token"] = ADMIN_TOKEN!;
  }

  try {
    logger.debug({ mode, variables }, "Shopify GraphQL fetch");
    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      logger.error({ status: res.status, text }, "Shopify HTTP error");
      throw new Error(`Shopify API: HTTP ${res.status}`);
    }

    const json = await res.json();
    if (json.errors?.length) {
      logger.error({ errors: json.errors, variables }, "Shopify GraphQL errors");
      throw new Error(json.errors[0].message);
    }
    return json.data as T;
  } catch (err) {
    logger.error({ err, variables }, "Shopify fetch error");
    throw err;
  }
}

/**
 * Fetch Storefront API uniquement — utilisé pour les opérations cart.
 * Lève une erreur si le token Storefront n'est pas configuré.
 */
export async function storefrontFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  if (!STOREFRONT_TOKEN || !SHOPIFY_DOMAIN) {
    throw new Error(
      "SHOPIFY_STOREFRONT_ACCESS_TOKEN requis pour les opérations panier. " +
      "Configurez ce token dans les variables d'environnement Vercel."
    );
  }
  const endpoint = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;
  try {
    logger.debug({ variables }, "Shopify Storefront fetch");
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      logger.error({ status: res.status, text }, "Storefront HTTP error");
      throw new Error(`Storefront API: HTTP ${res.status}`);
    }

    const json = await res.json();
    if (json.errors?.length) {
      logger.error({ errors: json.errors }, "Storefront GraphQL errors");
      throw new Error(json.errors[0].message);
    }
    return json.data as T;
  } catch (err) {
    logger.error({ err, variables }, "Storefront fetch error");
    throw err;
  }
}
