import { GraphQLClient } from "graphql-request";
import logger from "@/lib/utils/logger";

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// Avertissement au démarrage si token manquant (ne bloque pas le build)
if (!SHOPIFY_DOMAIN) {
  console.warn("[Shopify] SHOPIFY_STORE_DOMAIN manquant");
}
if (!SHOPIFY_TOKEN) {
  console.warn(
    "[Shopify] SHOPIFY_STOREFRONT_ACCESS_TOKEN manquant. " +
    "Générez-le via : shopify app dev (CLI) ou canal Headless dans Shopify Admin."
  );
}

const STOREFRONT_API_VERSION = "2024-10";

function getClient(): GraphQLClient {
  if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) {
    throw new Error(
      "Variables d'environnement manquantes : SHOPIFY_STORE_DOMAIN ou SHOPIFY_STOREFRONT_ACCESS_TOKEN. " +
      "Consultez .env.example pour les instructions."
    );
  }
  const endpoint = `https://${SHOPIFY_DOMAIN}/api/${STOREFRONT_API_VERSION}/graphql.json`;
  return new GraphQLClient(endpoint, {
    headers: {
      "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
      "Content-Type": "application/json",
    },
  });
}

// Export du client (lazy — initialisé à l'appel, pas au démarrage)
export const shopifyClient = new Proxy({} as GraphQLClient, {
  get(_target, prop) {
    return getClient()[prop as keyof GraphQLClient];
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
    const client = getClient();
    const data = await client.request<T>(query, variables);
    return data;
  } catch (err) {
    logger.error({ err, variables }, "Shopify GraphQL error");
    throw err;
  }
}
