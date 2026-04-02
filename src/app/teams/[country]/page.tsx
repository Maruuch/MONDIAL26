import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCountryBySlug, GROUPS, COUNTRIES } from "@/lib/utils/countries";
import { getProductsByCountry } from "@/lib/shopify/api";
import { ProductCard } from "@/components/product/ProductCard";

interface PageProps {
  params: Promise<{ country: string }>;
}

// ── 4 designs fan-made (pas de codes internes) ──────────────
const DESIGN_PREVIEWS = [
  {
    id: "classic",
    name: "Édition Classic",
    tagline: "L'essentiel du supporter",
    description: "Design intemporel aux couleurs nationales. La référence.",
    icon: "👕",
    badge: "Best-seller",
    price: "29,99 €",
  },
  {
    id: "bold",
    name: "Édition Bold",
    tagline: "Graphisme XXL",
    description: "Typographie impact, couleurs saturées. Pour se faire remarquer.",
    icon: "🔥",
    badge: "Tendance",
    price: "29,99 €",
  },
  {
    id: "heritage",
    name: "Édition Héritage",
    tagline: "Inspiration vintage",
    description: "Esthétique rétro années 80. Un hommage aux grandes heures.",
    icon: "🏆",
    badge: "Exclusif",
    price: "29,99 €",
  },
  {
    id: "night",
    name: "Édition Night",
    tagline: "Premium sombre",
    description: "Fond noir profond, détails lumineux. L'élégance du stade.",
    icon: "🌙",
    badge: "Premium",
    price: "34,99 €",
  },
] as const;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country: slug } = await params;
  const country = getCountryBySlug(slug);
  if (!country) return {};
  return {
    title: `${country.name} — Collection Fan-Made · Football 2026`,
    description: `4 designs exclusifs fan-made pour supporter ${country.name}. Coupe du Monde 2026. Impression premium, livraison mondiale.`,
    openGraph: {
      title: `${country.flag} ${country.name} — Football 2026`,
      type: "website",
    },
    alternates: { canonical: `/teams/${slug}` },
  };
}

export default async function CountryPage({ params }: PageProps) {
  const { country: slug } = await params;
  const country = getCountryBySlug(slug);
  if (!country) notFound();

  // Autres équipes du même groupe
  const groupTeams = GROUPS[country.group]
    .filter((iso) => iso !== country.iso)
    .map((iso) => ({ iso, ...COUNTRIES[iso] }));

  // Shopify products (fallback gracieux si non branché)
  let products: Awaited<ReturnType<typeof getProductsByCountry>> = [];
  try {
    products = await getProductsByCountry(country.iso);
  } catch {
    // Shopify non configuré — affichage aperçu designs
  }

  const primary   = country.colors.primary;
  const secondary = country.colors.secondary;

  return (
    <div className="min-h-screen" style={{ background: "#0A0F1E" }}>

      {/* ══════════ HERO PAYS ══════════ */}
      <section
        className="relative py-20 overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at 30% 50%, ${primary}18 0%, transparent 60%),
                       radial-gradient(ellipse at 70% 50%, ${secondary}0A 0%, transparent 60%),
                       #0A0F1E`,
          borderBottom: "1px solid rgba(30,45,74,0.6)",
        }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(30,45,74,0.5) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Code ISO — watermark gauche */}
        <div
          className="absolute left-0 top-0 bottom-0 flex items-center pointer-events-none select-none overflow-hidden"
          style={{
            fontSize: "clamp(8rem, 22vw, 18rem)",
            fontFamily: "var(--font-barlow)",
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            color: "#FFFFFF",
            opacity: 0.03,
            paddingLeft: "2rem",
          }}
          aria-hidden
        >
          {country.iso}
        </div>

        {/* Drapeau — watermark droite avec couleurs visibles */}
        <div
          className="absolute right-0 top-0 bottom-0 flex items-center justify-center pointer-events-none select-none"
          style={{
            fontSize: "clamp(10rem, 28vw, 20rem)",
            lineHeight: 1,
            paddingRight: "2rem",
            opacity: 0.18,
            filter: `drop-shadow(0 0 60px ${primary}80)`,
          }}
          aria-hidden
        >
          {country.flag}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <Link
              href="/teams"
              className="text-wc-muted hover:text-wc-accent text-sm font-medium transition-colors duration-150 flex items-center gap-1.5"
            >
              ← Toutes les équipes
            </Link>
            <span className="text-wc-muted opacity-40">·</span>
            <span
              className="text-xs font-black px-2 py-0.5 rounded-md"
              style={{ background: primary + "25", color: primary, border: `1px solid ${primary}40` }}
            >
              Groupe {country.group}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-8">
            {/* Drapeau + nom */}
            <div className="flex items-center gap-6">
              <span
                className="text-7xl md:text-8xl lg:text-9xl select-none"
                style={{ filter: `drop-shadow(0 0 30px ${primary}60)` }}
              >
                {country.flag}
              </span>
              <div>
                <h1
                  className="font-black text-wc-text leading-none"
                  style={{
                    fontFamily: "var(--font-barlow)",
                    fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                  }}
                >
                  {country.name.toUpperCase()}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-wc-muted text-sm">Groupe {country.group}</span>
                  <span style={{ color: "rgba(100,116,139,0.4)" }}>·</span>
                  <span className="text-wc-muted text-sm">4 designs fan-made</span>
                </div>
                <div className="flex gap-1.5 mt-4">
                  <span className="h-1.5 w-16 rounded-full" style={{ background: primary }} />
                  <span className="h-1.5 w-8 rounded-full opacity-60" style={{ background: secondary }} />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="md:ml-auto flex gap-6 md:gap-10">
              {[
                { value: "4",     label: "Designs" },
                { value: "5–10j", label: "Livraison" },
                { value: "100%",  label: "Fan-made" },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div
                    className="text-2xl font-black"
                    style={{ fontFamily: "var(--font-barlow)", color: primary }}
                  >
                    {value}
                  </div>
                  <div className="text-xs text-wc-muted mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ DESIGNS / PRODUITS ══════════ */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            {products.length === 0 && (
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
                style={{
                  background: "rgba(232,197,71,0.1)",
                  border: "1px solid rgba(232,197,71,0.25)",
                  color: "#E8C547",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: "#E8C547", animation: "pulse 2s infinite" }}
                />
                Aperçu · Boutique bientôt disponible
              </div>
            )}
            <h2
              className="text-4xl md:text-5xl font-black text-wc-text"
              style={{ fontFamily: "var(--font-barlow)" }}
            >
              LA COLLECTION {country.name.toUpperCase()}
            </h2>
            <p className="text-wc-muted mt-3 text-lg">
              4 designs exclusifs pour supporter les vôtres
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {DESIGN_PREVIEWS.map((design) => (
                <div
                  key={design.id}
                  className="design-card rounded-2xl overflow-hidden flex flex-col"
                  style={{
                    background: "#141F35",
                    border: "1px solid rgba(30,45,74,0.8)",
                    ["--design-color" as string]: primary,
                    transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
                  }}
                >
                  {/* Zone visuelle */}
                  <div
                    className="relative aspect-square flex flex-col items-center justify-center gap-2 overflow-hidden"
                    style={{
                      background: `radial-gradient(ellipse at 50% 40%, ${primary}22 0%, #0A0F1E 70%)`,
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-5 pointer-events-none"
                      style={{
                        backgroundImage: `repeating-linear-gradient(-45deg, ${primary} 0, ${primary} 1px, transparent 0, transparent 50%)`,
                        backgroundSize: "12px 12px",
                      }}
                    />
                    <div
                      className="absolute w-32 h-32 rounded-full opacity-15"
                      style={{
                        background: `radial-gradient(circle, ${secondary} 0%, transparent 70%)`,
                        bottom: "-16px",
                        right: "-16px",
                      }}
                    />
                    <span
                      className="text-6xl relative z-10 design-flag"
                      style={{
                        filter: `drop-shadow(0 4px 16px ${primary}50)`,
                        transition: "transform 0.3s ease",
                      }}
                    >
                      {country.flag}
                    </span>
                    <span
                      className="relative z-10 text-xs font-black tracking-wide px-3 py-1 rounded-full"
                      style={{
                        background: primary + "30",
                        color: primary,
                        border: `1px solid ${primary}50`,
                      }}
                    >
                      {design.badge}
                    </span>
                  </div>

                  {/* Infos */}
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <div>
                      <h3
                        className="font-black text-wc-text text-base leading-tight"
                        style={{ fontFamily: "var(--font-barlow)" }}
                      >
                        {design.name}
                      </h3>
                      <p className="text-xs font-semibold mt-0.5" style={{ color: primary }}>
                        {design.tagline}
                      </p>
                    </div>
                    <p className="text-wc-muted text-xs leading-relaxed flex-1">
                      {design.description}
                    </p>
                    <div
                      className="flex items-center justify-between mt-2 pt-3"
                      style={{ borderTop: "1px solid rgba(30,45,74,0.5)" }}
                    >
                      <span
                        className="text-xl font-black"
                        style={{ fontFamily: "var(--font-barlow)", color: "#E8C547" }}
                      >
                        {design.price}
                      </span>
                      <span
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                        style={{
                          background: "rgba(232,197,71,0.1)",
                          color: "#E8C547",
                          border: "1px solid rgba(232,197,71,0.2)",
                        }}
                      >
                        Bientôt
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════ POURQUOI COMMANDER ══════════ */}
      <section
        className="py-14"
        style={{ background: "#0F1829", borderTop: "1px solid rgba(30,45,74,0.5)" }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: "🎨", title: "Design exclusif", desc: "Chaque design est créé spécifiquement pour cette équipe. Unique." },
              { icon: "⚡", title: "Impression premium", desc: "Fabrication à la demande. Qualité supérieure, rien en stock." },
              { icon: "🌍", title: "Livraison mondiale", desc: "Partout dans le monde. Reçu en 5 à 10 jours ouvrés." },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="flex items-start gap-4 p-5 rounded-2xl"
                style={{ background: "#141F35", border: "1px solid rgba(30,45,74,0.6)" }}
              >
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <div>
                  <div className="font-bold text-wc-text text-sm mb-1">{title}</div>
                  <div className="text-wc-muted text-xs leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ AUTRES ÉQUIPES DU GROUPE ══════════ */}
      {groupTeams.length > 0 && (
        <section
          className="py-14"
          style={{ borderTop: "1px solid rgba(30,45,74,0.5)" }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <div className="section-label mx-auto w-fit mb-4">
                Groupe {country.group}
              </div>
              <h3
                className="text-3xl font-black text-wc-text"
                style={{ fontFamily: "var(--font-barlow)" }}
              >
                AUSSI DANS CE GROUPE
              </h3>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {groupTeams.map((team) => (
                <Link
                  key={team.iso}
                  href={`/teams/${team.slug}`}
                  className="group-team flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-200"
                  style={{
                    background: "#141F35",
                    border: "1px solid rgba(30,45,74,0.7)",
                    ["--team-color" as string]: team.colors.primary,
                  }}
                >
                  <span className="text-3xl group-team-flag" style={{ transition: "transform 0.2s ease" }}>
                    {team.flag}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-wc-text">{team.name}</div>
                    <div className="text-xs text-wc-muted">Voir les designs</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════ CTA RETOUR ══════════ */}
      <section
        className="py-12 text-center"
        style={{ borderTop: "1px solid rgba(30,45,74,0.5)" }}
      >
        <Link
          href="/teams"
          className="inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-200 hover:opacity-80"
          style={{ color: "#E8C547" }}
        >
          ← Voir les 48 équipes
        </Link>
      </section>

      {/* CSS hover */}
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

        .design-card:hover {
          border-color: color-mix(in srgb, var(--design-color) 55%, transparent) !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px color-mix(in srgb, var(--design-color) 25%, transparent);
          transform: translateY(-4px);
        }
        .design-card:hover .design-flag {
          transform: scale(1.12);
        }

        .group-team:hover {
          border-color: color-mix(in srgb, var(--team-color) 60%, transparent) !important;
          background: color-mix(in srgb, var(--team-color) 12%, transparent) !important;
        }
        .group-team:hover .group-team-flag {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
