import { GraphQLClient } from "graphql-request";
import logger from "@/lib/utils/logger";

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) {
  throw new Error(
    "Variables d'environnement manquantes : SHOPIFY_STORE_DOMAIN ou SHOPIFY_STOREFRONT_ACCESS_TOKEN"
  );
}

const STOREFRONT_API_VERSION = "2024-10";
const endpoint = `https://${SHOPIFY_DOMAIN}/api/${STOREFRONT_API_VERSION}/graphql.json`;

export const shopifyClient = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
    "Content-Type": "application/json",
  },
});

/**
 * Wrapper sécurisé avec logging et gestion d'erreurs
 */
export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  try {
    logger.debug({ variables }, "Shopify GraphQL fetch");
    const data = await shopifyClient.request<T>(query, variables);
    return data;
  } catch (err) {
    logger.error({ err, variables }, "Shopify GraphQL error");
    throw err;
  }
}
