// ─── Fragments réutilisables ──────────────────────────────────────────────────
export const PRODUCT_METAFIELDS_FRAGMENT = /* GraphQL */ `
  fragment ProductMetafields on Product {
    non_official: metafield(namespace: "football2026", key: "non_official") {
      value
      type
    }
    country_iso: metafield(namespace: "football2026", key: "country_iso") {
      value
      type
    }
    design_code: metafield(namespace: "football2026", key: "design_code") {
      value
      type
    }
    country_name: metafield(namespace: "football2026", key: "country_name") {
      value
      type
    }
    cloudinary_url: metafield(namespace: "football2026", key: "cloudinary_url") {
      value
      type
    }
  }
`;

export const VARIANT_FRAGMENT = /* GraphQL */ `
  fragment VariantFields on ProductVariant {
    id
    title
    sku
    availableForSale
    price {
      amount
      currencyCode
    }
    selectedOptions {
      name
      value
    }
  }
`;

// ─── Query : produit par handle ───────────────────────────────────────────────
export const GET_PRODUCT_BY_HANDLE = /* GraphQL */ `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      seo {
        title
        description
      }
      priceRange {
        minVariantPrice { amount currencyCode }
        maxVariantPrice { amount currencyCode }
      }
      images(first: 6) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 100) {
        edges {
          node {
            ...VariantFields
          }
        }
      }
      non_official: metafield(namespace: "football2026", key: "non_official") { value type }
      country_iso: metafield(namespace: "football2026", key: "country_iso") { value type }
      design_code: metafield(namespace: "football2026", key: "design_code") { value type }
      country_name: metafield(namespace: "football2026", key: "country_name") { value type }
      cloudinary_url: metafield(namespace: "football2026", key: "cloudinary_url") { value type }
    }
  }
  ${VARIANT_FRAGMENT}
`;

// ─── Query : produits par tag pays ───────────────────────────────────────────
export const GET_PRODUCTS_BY_COUNTRY = /* GraphQL */ `
  query GetProductsByCountry($query: String!, $first: Int!) {
    products(query: $query, first: $first, sortKey: TITLE) {
      edges {
        node {
          id
          handle
          title
          priceRange {
            minVariantPrice { amount currencyCode }
          }
          images(first: 1) {
            edges {
              node { url altText width height }
            }
          }
          non_official: metafield(namespace: "football2026", key: "non_official") { value type }
          design_code: metafield(namespace: "football2026", key: "design_code") { value type }
          country_iso: metafield(namespace: "football2026", key: "country_iso") { value type }
        }
      }
    }
  }
`;

// ─── Query : tous les pays distincts ─────────────────────────────────────────
export const GET_ALL_COUNTRIES = /* GraphQL */ `
  query GetAllCountries {
    products(first: 250, query: "tag:football2026") {
      edges {
        node {
          country_iso: metafield(namespace: "football2026", key: "country_iso") { value }
          country_name: metafield(namespace: "football2026", key: "country_name") { value }
        }
      }
    }
  }
`;
