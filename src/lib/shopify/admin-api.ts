/**
 * Shopify Admin API — utilisé par les webhooks et l'automatisation n8n
 * (NON exposé côté client — server-side uniquement)
 */
import logger from "@/lib/utils/logger";

// ─── Cache en mémoire pour le Publication GID ─────────────────────────────────
let _cachedPublicationId: string | null = null;

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_ADMIN_KEY = process.env.SHOPIFY_ADMIN_API_KEY!;
const ADMIN_API_VERSION = "2024-10";

const adminEndpoint = `https://${SHOPIFY_DOMAIN}/admin/api/${ADMIN_API_VERSION}/graphql.json`;

async function adminFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(adminEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": SHOPIFY_ADMIN_KEY,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    logger.error({ status: res.status, text }, "Shopify Admin API error");
    throw new Error(`Shopify Admin API: ${res.status}`);
  }

  const { data, errors } = await res.json();
  if (errors?.length) {
    logger.error({ errors }, "Shopify Admin GraphQL errors");
    throw new Error(errors[0].message);
  }
  return data as T;
}

// ─── Publication GID ──────────────────────────────────────────────────────────

/**
 * Résout dynamiquement le GID de la publication "Online Store" via Admin API.
 *
 * Stratégie :
 *   1. Vérifie le cache mémoire (évite les appels répétés)
 *   2. Vérifie la variable d'env SHOPIFY_ONLINE_STORE_PUBLICATION_ID (fallback)
 *   3. Appel Admin API → liste des publications → filtre "Online Store"
 *   4. Fail bloquant si non trouvé
 */
export async function getOnlineStorePublicationId(): Promise<string> {
  // 1. Cache mémoire
  if (_cachedPublicationId) return _cachedPublicationId;

  // 2. Fallback env var
  const envGid = process.env.SHOPIFY_ONLINE_STORE_PUBLICATION_ID;
  if (envGid) {
    logger.info({ gid: envGid }, "Publication GID: using env var");
    _cachedPublicationId = envGid;
    return envGid;
  }

  // 3. Résolution dynamique
  const query = /* GraphQL */ `
    query GetPublications {
      publications(first: 10) {
        edges {
          node {
            id
            name
            catalog {
              ... on OnlineStoreCatalog { id }
            }
          }
        }
      }
    }
  `;

  const data = await adminFetch<{
    publications: {
      edges: Array<{
        node: {
          id: string;
          name: string;
          catalog?: { id?: string };
        };
      }>;
    };
  }>(query);

  const onlineStore = data.publications.edges.find(
    ({ node }) =>
      node.name.toLowerCase().includes("online store") ||
      node.name.toLowerCase().includes("boutique en ligne") ||
      node.catalog?.id !== undefined
  );

  if (!onlineStore) {
    throw new Error(
      "[Shopify] Publication 'Online Store' introuvable. " +
      "Définir SHOPIFY_ONLINE_STORE_PUBLICATION_ID dans les variables d'environnement."
    );
  }

  _cachedPublicationId = onlineStore.node.id;
  logger.info(
    { gid: _cachedPublicationId, name: onlineStore.node.name },
    "Publication GID: resolved from API"
  );
  return _cachedPublicationId;
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/**
 * Publie un produit draft sur Shopify.
 * Le Publication GID est résolu dynamiquement — aucun hardcode.
 */
export async function publishProduct(productId: string): Promise<void> {
  // Résolution dynamique du GID — erreur bloquante si non trouvé
  const publicationId = await getOnlineStorePublicationId();

  const mutation = /* GraphQL */ `
    mutation PublishProduct($id: ID!, $publicationId: ID!) {
      publishablePublish(id: $id, input: { publicationId: $publicationId }) {
        publishable {
          ... on Product { id status }
        }
        userErrors { field message }
      }
    }
  `;

  const data = await adminFetch<{
    publishablePublish: {
      publishable: { id: string; status: string } | null;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>(mutation, { id: productId, publicationId });

  const { userErrors } = data.publishablePublish;
  if (userErrors.length > 0) {
    const msg = userErrors.map((e) => e.message).join(", ");
    throw new Error(`[Shopify] publishProduct userErrors: ${msg}`);
  }

  logger.info({ productId, publicationId }, "Product published on Shopify");
}

/**
 * Met à jour un metafield produit
 */
export async function upsertProductMetafield(
  productId: string,
  namespace: string,
  key: string,
  value: string,
  type: string
): Promise<void> {
  const mutation = /* GraphQL */ `
    mutation UpsertMetafield($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields { id key value }
        userErrors { field message }
      }
    }
  `;
  await adminFetch(mutation, {
    metafields: [{ ownerId: productId, namespace, key, value, type }],
  });
}

/**
 * Crée un produit draft avec ses variantes
 */
export async function createDraftProduct(input: {
  title: string;
  descriptionHtml: string;
  vendor: string;
  tags: string[];
  options?: string[];
  variants: Array<{
    sku: string;
    price: string;
    options: string[];
  }>;
}): Promise<string> {
  const mutation = /* GraphQL */ `
    mutation CreateProduct($input: ProductInput!) {
      productCreate(input: $input) {
        product { id handle }
        userErrors { field message }
      }
    }
  `;
  const data = await adminFetch<{
    productCreate: { product: { id: string } };
  }>(mutation, { input: { ...input, status: "DRAFT" } });

  return data.productCreate.product.id;
}
