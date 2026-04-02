export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductByHandle } from "@/lib/shopify/api";
import { ProductPageClient } from "@/components/product/ProductPageClient";
import { COUNTRIES } from "@/lib/utils/countries";

interface PageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) return {};
  const image = product.images.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;
  return {
    title: product.seo.title ?? `${product.title} — Football 2026`,
    description: product.seo.description ?? `${product.description.slice(0, 155)}…`,
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
    alternates: { canonical: `/product/${handle}` },
  };
}

/** Helper flag image URL */
function getFlagUrl(flag: string, iso: string): string {
  if (iso === "SCO") return "https://flagcdn.com/w80/gb-sct.png";
  if (iso === "ENG") return "https://flagcdn.com/w80/gb-eng.png";
  const pts = [...flag].map((c) => c.codePointAt(0) ?? 0);
  if (pts.length >= 2 && pts[0] >= 0x1F1E6 && pts[0] <= 0x1F1FF) {
    const code = pts.slice(0, 2).map((p) => String.fromCharCode(p - 0x1F1E6 + 65)).join("").toLowerCase();
    return `https://flagcdn.com/w80/${code}.png`;
  }
  return `https://flagcdn.com/w80/${iso.slice(0, 2).toLowerCase()}.png`;
}

export default async function ProductPage({ params }: PageProps) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) notFound();

  const image = product.images.edges[0]?.node;
  const images = product.images.edges.map((e) => e.node);
  const variants = product.variants.edges.map((e) => e.node);
  const price = product.priceRange.minVariantPrice;

  const countryIso = (product as unknown as { country_iso: { value: string } | null }).country_iso?.value;
  const countryName = (product as unknown as { country_name: { value: string } | null }).country_name?.value;
  const countryData = countryIso ? COUNTRIES[countryIso] : null;

  const formattedPrice = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: price.currencyCode,
  }).format(parseFloat(price.amount));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: image?.url,
    brand: { "@type": "Brand", name: "Football 2026 Fan-Made" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: price.currencyCode,
      lowPrice: product.priceRange.minVariantPrice.amount,
      highPrice: product.priceRange.maxVariantPrice.amount,
      availability: "https://schema.org/InStock",
    },
  };

  const primary = countryData?.colors.primary ?? "#E8C547";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen" style={{ background: "#0A0F1E" }}>
        <div className="container mx-auto px-4 py-12">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-sm">
            <Link href="/teams" className="text-wc-muted hover:text-wc-accent transition-colors">
              Équipes
            </Link>
            {countryData && (
              <>
                <span className="text-wc-muted opacity-40">›</span>
                <Link
                  href={`/teams/${countryData.slug}`}
                  className="text-wc-muted hover:text-wc-accent transition-colors"
                >
                  {countryData.name}
                </Link>
              </>
            )}
            <span className="text-wc-muted opacity-40">›</span>
            <span className="text-wc-text">{product.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* ── Galerie images ── */}
            <div className="space-y-3">
              <div
                className="relative aspect-square rounded-2xl overflow-hidden"
                style={{ background: "#141F35", border: "1px solid rgba(30,45,74,0.6)" }}
              >
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
                  <div
                    className="w-full h-full flex items-center justify-center text-8xl"
                    style={{ opacity: 0.15 }}
                  >
                    👕
                  </div>
                )}
              </div>
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.slice(1, 5).map((img, i) => (
                    <div
                      key={i}
                      className="relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden"
                      style={{ background: "#141F35", border: "1px solid rgba(30,45,74,0.6)" }}
                    >
                      <Image src={img.url} alt={img.altText ?? ""} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Infos produit ── */}
            <div className="flex flex-col gap-6">

              {/* Badge + pays */}
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className="text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full"
                  style={{
                    background: "rgba(232,197,71,0.12)",
                    color: "#E8C547",
                    border: "1px solid rgba(232,197,71,0.25)",
                  }}
                >
                  Fan-made · Non officiel
                </span>
                {countryData && countryIso && (
                  <Link
                    href={`/teams/${countryData.slug}`}
                    className="flex items-center gap-2 px-3 py-1 rounded-full transition-colors"
                    style={{
                      background: primary + "15",
                      border: `1px solid ${primary}35`,
                      color: primary,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getFlagUrl(countryData.flag, countryIso)}
                      alt={countryData.name}
                      style={{ width: 20, height: 14, objectFit: "cover", borderRadius: 2 }}
                    />
                    <span className="text-xs font-semibold">{countryData.name}</span>
                  </Link>
                )}
              </div>

              {/* Titre */}
              <div>
                {countryName && (
                  <p className="text-sm font-semibold mb-1" style={{ color: primary }}>
                    {countryName}
                  </p>
                )}
                <h1
                  className="font-black text-wc-text leading-tight"
                  style={{ fontFamily: "var(--font-barlow)", fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
                >
                  {product.title}
                </h1>
                <p
                  className="font-black mt-3"
                  style={{ fontFamily: "var(--font-barlow)", fontSize: "2rem", color: "#E8C547" }}
                >
                  {formattedPrice}
                </p>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-wc-muted text-sm leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Sélecteur taille + ajout panier */}
              <div
                className="rounded-2xl p-5"
                style={{ background: "#141F35", border: "1px solid rgba(30,45,74,0.6)" }}
              >
                <ProductPageClient variants={variants} designCode={null} />
              </div>

              {/* Garanties */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: "🎨", label: "Design exclusif" },
                  { icon: "⚡", label: "Impression premium" },
                  { icon: "🌍", label: "Livraison mondiale" },
                ].map(({ icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl text-center"
                    style={{ background: "#0F1829", border: "1px solid rgba(30,45,74,0.5)" }}
                  >
                    <span className="text-lg">{icon}</span>
                    <span className="text-xs text-wc-muted leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
