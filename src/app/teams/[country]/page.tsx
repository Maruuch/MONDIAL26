export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCountryBySlug } from "@/lib/utils/countries";
import { getProductsByCountry } from "@/lib/shopify/api";
import { ProductCard } from "@/components/product/ProductCard";
import { DESIGN_MAP, type DesignCode } from "@/types";

interface PageProps {
  params: Promise<{ country: string }>;
}

const MOCK_DESIGNS = [
  { code: "D1", label: "Slogan",    emoji: "📣", bg: "from-blue-50 to-blue-100",   accent: "bg-blue-600" },
  { code: "D2", label: "Emblème",   emoji: "🛡️", bg: "from-red-50 to-red-100",    accent: "bg-red-600"  },
  { code: "D3", label: "Fantaisie", emoji: "🎨", bg: "from-purple-50 to-purple-100", accent: "bg-purple-600" },
  { code: "D4", label: "Basic",     emoji: "✨", bg: "from-gray-50 to-gray-100",   accent: "bg-gray-700" },
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country: slug } = await params;
  const country = getCountryBySlug(slug);
  if (!country) return {};
  return {
    title: `Maillot ${country.name} Fan-Made — Football 2026`,
    description: `4 designs exclusifs fan-made pour l'équipe de ${country.name}. Coupe du Monde 2026.`,
    openGraph: { title: `${country.flag} ${country.name} — Football 2026`, type: "website" },
    alternates: { canonical: `/teams/${slug}` },
  };
}

export default async function CountryPage({ params }: PageProps) {
  const { country: slug } = await params;
  const country = getCountryBySlug(slug);
  if (!country) notFound();

  let products: Awaited<ReturnType<typeof getProductsByCountry>> = [];
  try {
    products = await getProductsByCountry(country.iso);
  } catch {
    // Shopify pas encore branché — on affiche les mocks
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER PAYS */}
      <div className="bg-brand text-white py-14 text-center relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative z-10">
          <Link href="/teams" className="inline-flex items-center gap-1 text-blue-300 hover:text-white text-sm mb-6 transition-colors">
            ← Toutes les équipes
          </Link>
          <div className="text-7xl md:text-8xl mb-4">{country.flag}</div>
          <h1 className="text-4xl md:text-5xl font-black mb-2">{country.name}</h1>
          <p className="text-blue-200 text-sm">
            {products.length > 0
              ? `${products.length} design${products.length > 1 ? "s" : ""} disponible${products.length > 1 ? "s" : ""}`
              : "4 designs · Bientôt disponibles"}
          </p>
        </div>
      </div>

      {/* GRILLE PRODUITS */}
      <div className="container mx-auto px-4 py-12">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const designCode = (product as unknown as { design_code: { value: string } | null }).design_code?.value as DesignCode | undefined;
              return <ProductCard key={product.id} product={product} designLabel={designCode ? DESIGN_MAP[designCode] : undefined} />;
            })}
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <span className="inline-block bg-yellow-100 text-yellow-800 border border-yellow-300 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                Aperçu des designs — disponibles prochainement
              </span>
              <h2 className="text-2xl font-bold text-brand">4 designs {country.name}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {MOCK_DESIGNS.map(({ code, label, emoji, bg, accent }) => (
                <div key={code}
                  className={`group rounded-2xl overflow-hidden border-2 border-transparent hover:border-brand hover:shadow-xl transition-all duration-200 bg-gradient-to-b ${bg} flex flex-col`}>
                  {/* Zone image mock */}
                  <div className="relative aspect-square flex flex-col items-center justify-center gap-3 bg-white/60">
                    <span className="text-7xl">{country.flag}</span>
                    <span className="text-4xl -mt-2 opacity-60">{emoji}</span>
                    <span className={`absolute top-3 left-3 ${accent} text-white text-xs font-bold px-2 py-0.5 rounded`}>
                      {code}
                    </span>
                  </div>
                  {/* Infos */}
                  <div className="p-4 flex flex-col gap-2">
                    <h3 className="font-bold text-gray-900">{country.name} — {label}</h3>
                    <p className="text-xs text-gray-500">Design fan-made · Impression POD Printful</p>
                    <div className="mt-auto pt-2 flex items-center justify-between">
                      <span className="text-brand font-bold text-lg">~29,99 €</span>
                      <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded font-medium">Bientôt</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-400 text-sm mt-10">
              La boutique ouvre dès que le store Shopify est activé.{" "}
              <Link href="/teams" className="text-brand hover:underline">Explorer d&apos;autres équipes</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
