// ─── Design Types ─────────────────────────────────────────────────────────────
export type DesignCode = "D1" | "D2" | "D3" | "D4";
export type DesignLabel = "Slogan" | "Emblème" | "Fantaisie" | "Basic";

export const DESIGN_MAP: Record<DesignCode, DesignLabel> = {
  D1: "Slogan",
  D2: "Emblème",
  D3: "Fantaisie",
  D4: "Basic",
};

// ─── Gender & Sizes ───────────────────────────────────────────────────────────
export type Gender = "MEN" | "WOMEN";

export const SIZES: Record<Gender, string[]> = {
  MEN: ["S", "M", "L", "XL", "XXL"],
  WOMEN: ["XS", "S", "M", "L", "XL"],
};

// ─── SKU ──────────────────────────────────────────────────────────────────────
export interface SKUParts {
  iso: string;      // ISO 3166-1 alpha-3 (e.g. "FRA")
  design: DesignCode;
  gender: Gender;
  size: string;
}

// ─── Shopify Product ──────────────────────────────────────────────────────────
export interface ShopifyProductVariant {
  id: string;
  title: string;
  sku: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
        width: number;
        height: number;
      };
    }>;
  };
  variants: {
    edges: Array<{ node: ShopifyProductVariant }>;
  };
  metafields: Array<ShopifyMetafield | null>;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
    maxVariantPrice: { amount: string; currencyCode: string };
  };
  seo: {
    title: string | null;
    description: string | null;
  };
}

export interface ShopifyMetafield {
  namespace: string;
  key: string;
  value: string;
  type: string;
}

// ─── Country / Team ───────────────────────────────────────────────────────────
export interface TeamPage {
  country: string;       // Nom affiché (e.g. "France")
  iso: string;           // ISO 3166-1 alpha-3 (e.g. "FRA")
  slug: string;          // URL slug (e.g. "france")
  flag: string;          // Emoji drapeau
  products: ShopifyProduct[];
}

// ─── n8n Payload ─────────────────────────────────────────────────────────────
export interface N8nWFAPayload {
  iso: string;
  design: DesignCode;
  countryName: string;
  triggeredAt: string;
}

export interface N8nWFBPayload {
  iso: string;
  design: DesignCode;
  cloudinaryUrl: string;
  productTitle: string;
  variants: Array<{
    gender: Gender;
    size: string;
    sku: string;
    printfulVariantId: number;
  }>;
}

// ─── Printful ─────────────────────────────────────────────────────────────────
export interface PrintfulSyncProduct {
  id: number;
  external_id: string;
  name: string;
  synced: number;
  thumbnail_url: string;
  is_ignored: boolean;
}

export interface PrintfulSyncVariant {
  id: number;
  external_id: string;
  sync_product_id: number;
  name: string;
  synced: boolean;
  variant_id: number;
  sku: string;
  retail_price: string;
}
