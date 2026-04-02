export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductByHandle } from "@/lib/shopify/api";
import { VariantSelector } from "@/components/product/VariantSelector";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductPageClient } from "@/components/product/ProductPageClient";
import { DESIGN_MAP, type DesignCode } from "@/types";

interface PageProps {
  params: Promise<{ handle: string }>;
}

// ─── Metadata SEO + JSON-LD ───────────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) return {};

  const image = product.images.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;

  return {
    title: product.seo.title ?? `${product.title} — Football 2026`,
    description:
      product.seo.description ??
      `${product.description.slice(0, 155)}…`,
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 200),
      images: image ? [{ url: image.url, width: image.width, height: image.height }] : [],
      type: "website",
    },
    other: {
      "product:price:amount": price.amount,
      "product:price:currency": price.currencyCode,
    },
    alternates: {
      canonical: `/product/${handle}`,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ProductPage({ params }: PageProps) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) notFound();

  const image = product.images.edges[0]?.node;
  const variants = product.variants.edges.map((e) => e.node);
  const price = product.priceRange.minVariantPrice;

  const designCode = (
    product as unknown as { design_code: { value: string } | null }
  ).design_code?.value as DesignCode | undefined;
  const designLabel = designCode ? DESIGN_MAP[designCode] : null;
  const countryName = (
    product as unknown as { country_name: { value: string } | null }
  ).country_name?.value;
  const countryIso = (
    product as unknown as { country_iso: { value: string } | null }
  ).country_iso?.value;

  const formattedPrice = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: price.currencyCode,
  }).format(parseFloat(price.amount));

  // JSON-LD Product (Schema.org)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: image?.url,
    brand: {
      "@type": "Brand",
      name: "Football 2026 Fan-Made",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: price.currencyCode,
      lowPrice: product.priceRange.minVariantPrice.amount,
      highPrice: product.priceRange.maxVariantPrice.amount,
      availability: "https://schema.org/InStock",
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "non_official", value: "true" },
      ...(countryIso
        ? [{ "@type": "PropertyValue", name: "country_iso", value: countryIso }]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image produit */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50">
            {image ? (
              <Image
                src={image.url}
                alt={image.altText ?? product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-200 text-8xl">
                👕
              </div>
            )}
          </div>

          {/* Infos + sélecteurs */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="badge-disclaimer mb-3 inline-block">
                Fan-made non officiel
              </span>
              {(designLabel || countryName) && (
                <p className="text-sm font-medium text-brand-light mb-1">
                  {countryName} {designLabel ? `— ${designLabel}` : ""}
                </p>
              )}
              <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
              <p className="text-2xl font-bold text-brand mt-3">{formattedPrice}</p>
            </div>

            {product.description && (
              <p className="text-gray-600 text-sm leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Client component pour interactivité */}
            <ProductPageClient variants={variants} designCode={designCode ?? null} />
          </div>
        </div>
      </div>
    </>
  );
}
