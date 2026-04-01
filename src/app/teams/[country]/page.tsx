import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCountryBySlug, getAllCountrySlugs } from "@/lib/utils/countries";
import { getProductsByCountry } from "@/lib/shopify/api";
import { ProductCard } from "@/components/product/ProductCard";
import { DESIGN_MAP, type DesignCode } from "@/types";

interface PageProps {
  params: Promise<{ country: string }>;
}

// ─── SSG : génère les chemins au build ───────────────────────────────────────
export async function generateStaticParams() {
  return getAllCountrySlugs().map((slug) => ({ country: slug }));
}

// ─── Metadata SEO ─────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country: slug } = await params;
  const country = getCountryBySlug(slug);
  if (!country) return {};

  const title = `Maillot ${country.name} Fan-Made — Football 2026`;
  const description = `Découvrez nos designs exclusifs fan-made pour supporter l'équipe de ${country.name} lors de la Coupe du Monde 2026. Slogan, emblème, fantaisie et basic.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    alternates: {
      canonical: `/teams/${slug}`,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function CountryPage({ params }: PageProps) {
  const { country: slug } = await params;
  const country = getCountryBySlug(slug);
  if (!country) notFound();

  const products = await getProductsByCountry(country.iso);

  // Structure JSON-LD ItemList
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Produits Football 2026 — ${country.name}`,
    description: `Collection fan-made pour l'équipe de ${country.name}`,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${p.handle}`,
      name: p.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Header pays */}
        <div className="text-center mb-12">
          <span className="badge-disclaimer mb-4 inline-block">
            Fan-made non officiel
          </span>
          <div className="text-6xl mb-3" role="img" aria-label={country.name}>
            {country.flag}
          </div>
          <h1 className="text-4xl font-bold text-brand mb-2">
            {country.name}
          </h1>
          <p className="text-gray-600">
            {products.length > 0
              ? `${products.length} design${products.length > 1 ? "s" : ""} disponible${products.length > 1 ? "s" : ""}`
              : "Collection bientôt disponible"}
          </p>
        </div>

        {/* Grille 4 designs */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const designCode = (
                product as unknown as {
                  design_code: { value: string } | null;
                }
              ).design_code?.value as DesignCode | undefined;
              const designLabel = designCode ? DESIGN_MAP[designCode] : undefined;
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  designLabel={designLabel}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 text-gray-400">
            <p className="text-lg">Collection en cours de préparation…</p>
            <p className="text-sm mt-2">Revenez bientôt !</p>
          </div>
        )}
      </div>
    </>
  );
}
