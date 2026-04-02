import Link from "next/link";
import type { Metadata } from "next";
import { COUNTRIES } from "@/lib/utils/countries";
import { WorldMapClient } from "@/components/WorldMapClient";

export const metadata: Metadata = {
  title: "Football 2026 — Collection Fan-Made Coupe du Monde",
  description:
    "48 nations. 4 designs exclusifs par équipe. La collection fan-made pour la Coupe du Monde 2026 USA · Mexique · Canada.",
};

// 8 équipes vedettes (toutes dans la liste officielle)
const FEATURED_ISOS = ["FRA", "BRA", "ARG", "ESP", "MAR", "JPN", "PRT", "DEU"];

// Stats
const STATS = [
  { value: "48", label: "Nations" },
  { value: "4",  label: "Designs / équipe" },
  { value: "12", label: "Groupes" },
];

// Étapes (sans mention Printful / backend)
const STEPS = [
  {
    icon: "🌍",
    step: "01",
    title: "Choisissez",
    desc: "Trouvez votre nation parmi 48 équipes qualifiées. Sélectionnez votre design.",
  },
  {
    icon: "🛒",
    step: "02",
    title: "Commandez",
    desc: "Paiement sécurisé. Chaque article est fabriqué à la demande, rien en stock.",
  },
  {
    icon: "📦",
    step: "03",
    title: "Recevez",
    desc: "Impression premium. Livraison mondiale en 5 à 10 jours ouvrés.",
  },
];

export default function HomePage() {
  const featured = FEATURED_ISOS
    .map((iso) => ({ iso, ...COUNTRIES[iso] }))
    .filter(Boolean);

  return (
    <>
      {/* ══════════ HERO ══════════ */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden hero-noise"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, rgba(232,197,71,0.07) 0%, transparent 70%), #0A0F1E",
        }}
      >
        {/* Lumières de stade */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4  w-[500px] h-[500px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, rgba(232,197,71,0.12) 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)" }} />
          {/* Dot grid */}
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle, rgba(30,45,74,0.8) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }} />
          {/* Particules */}
          <div className="star-particle w-1 h-1" style={{ top: "20%", left: "15%", animationDelay: "0s"   }} />
          <div className="star-particle w-1.5 h-1.5" style={{ top: "35%", right: "20%", animationDelay: "1.2s" }} />
          <div className="star-particle w-1 h-1" style={{ bottom: "30%", left: "25%", animationDelay: "2.1s" }} />
          <div className="star-particle w-1 h-1" style={{ top: "60%", right: "30%", animationDelay: "0.8s" }} />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center py-24">
          {/* Badge hôtes */}
          <div className="section-label mb-10 mx-auto w-fit">
            <span>⚽</span>
            <span>USA · MEXIQUE · CANADA · 2026</span>
          </div>

          {/* Titre */}
          <h1
            className="font-black tracking-tight leading-none mb-6 text-wc-text"
            style={{ fontFamily: "var(--font-barlow)", fontSize: "clamp(3.5rem, 10vw, 8rem)" }}
          >
            COUPE DU<br />
            <span className="text-glow" style={{ color: "#E8C547" }}>MONDE</span>
            <br />
            <span style={{ fontSize: "0.75em", color: "rgba(240,244,255,0.7)" }}>2026</span>
          </h1>

          {/* Sous-titre */}
          <p className="text-xl text-wc-muted max-w-xl mx-auto mb-12 leading-relaxed">
            48 nations. 4 designs par équipe.<br />
            <span className="text-wc-text/80">Supportez les vôtres avec style.</span>
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/teams" className="btn-gold text-lg px-10 py-4">
              🌍 Explorer les 48 équipes
            </Link>
            <Link href="/teams/france" className="btn-ghost text-lg px-10 py-4">
              🇫🇷 Voir la France
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 flex justify-center gap-10 sm:gap-16">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div
                  className="text-4xl font-black"
                  style={{ fontFamily: "var(--font-barlow)", color: "#E8C547" }}
                >
                  {value}
                </div>
                <div className="text-sm text-wc-muted mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
          <div className="w-0.5 h-8 rounded-full" style={{ background: "linear-gradient(to bottom, transparent, #E8C547)" }} />
        </div>
      </section>

      {/* ══════════ CARTE MONDE ══════════ */}
      <section className="py-20" style={{ background: "#0F1829" }}>
        <div className="container mx-auto px-4">
          {/* En-tête */}
          <div className="text-center mb-12">
            <div className="section-label mx-auto w-fit mb-6">🗺️ Carte interactive</div>
            <h2
              className="text-5xl md:text-6xl font-black text-wc-text mb-4"
              style={{ fontFamily: "var(--font-barlow)" }}
            >
              TROUVEZ VOTRE ÉQUIPE
            </h2>
            <p className="text-wc-muted text-lg">
              Survolez une nation pour la découvrir · Cliquez pour voir les designs
            </p>
          </div>

          <WorldMapClient />

          <p className="text-center text-wc-muted text-sm mt-6">
            48 équipes qualifiées · 12 groupes A–L
          </p>
        </div>
      </section>

      {/* ══════════ ÉQUIPES VEDETTES ══════════ */}
      <section className="py-20" style={{ background: "#0A0F1E" }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="section-label mx-auto w-fit mb-6">⭐ Populaires</div>
            <h2
              className="text-5xl font-black text-wc-text mb-3"
              style={{ fontFamily: "var(--font-barlow)" }}
            >
              LES GRANDES NATIONS
            </h2>
            <p className="text-wc-muted">Cliquez sur une équipe pour voir ses designs</p>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {featured.map(({ iso, name, slug, flag, group, colors }) => (
              <Link
                key={iso}
                href={`/teams/${slug}`}
                className="featured-team group relative flex flex-col items-center gap-2 p-4 rounded-2xl overflow-hidden"
                style={{
                  background: "#141F35",
                  border: "1px solid rgba(30,45,74,0.8)",
                  ["--team-color" as string]: colors.primary,
                  transition: "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                {/* Badge groupe */}
                <span
                  className="absolute top-2 right-2 text-xs font-black rounded-md px-1.5 py-0.5"
                  style={{ background: colors.primary + "30", color: colors.primary, fontSize: "10px" }}
                >
                  {group}
                </span>
                <span className="text-4xl md:text-5xl group-hover:scale-110 transition-transform duration-200">
                  {flag}
                </span>
                <span className="text-xs font-semibold text-wc-text text-center leading-tight">
                  {name}
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/teams"
              className="inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-200 hover:opacity-80"
              style={{ color: "#E8C547" }}
            >
              Voir les 48 équipes →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════ COMMENT ÇA MARCHE ══════════ */}
      <section className="py-20" style={{ background: "#0F1829", borderTop: "1px solid rgba(30,45,74,0.6)" }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2
              className="text-5xl font-black text-wc-text"
              style={{ fontFamily: "var(--font-barlow)" }}
            >
              COMMENT ÇA MARCHE
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {STEPS.map(({ icon, step, title, desc }) => (
              <div
                key={step}
                className="flex flex-col items-center text-center p-8 rounded-2xl"
                style={{ background: "#141F35", border: "1px solid rgba(30,45,74,0.6)" }}
              >
                <div className="text-4xl mb-4">{icon}</div>
                <span
                  className="text-xs font-black tracking-widest mb-2"
                  style={{ color: "rgba(232,197,71,0.6)" }}
                >
                  ÉTAPE {step}
                </span>
                <h3
                  className="text-2xl font-black text-wc-text mb-3"
                  style={{ fontFamily: "var(--font-barlow)" }}
                >
                  {title}
                </h3>
                <p className="text-wc-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA FINAL ══════════ */}
      <section
        className="py-24 text-center relative overflow-hidden"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(232,197,71,0.1) 0%, #0A0F1E 60%)",
          borderTop: "1px solid rgba(30,45,74,0.6)",
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div
            className="text-6xl mb-6 mx-auto"
            style={{ filter: "drop-shadow(0 0 20px rgba(232,197,71,0.5))", animation: "float 3.5s ease-in-out infinite" }}
          >
            🏆
          </div>
          <h2
            className="text-5xl md:text-6xl font-black text-wc-text mb-6"
            style={{ fontFamily: "var(--font-barlow)" }}
          >
            PRÊT À SUPPORTER<br />
            <span style={{ color: "#E8C547" }}>VOTRE ÉQUIPE ?</span>
          </h2>
          <p className="text-wc-muted mb-10 max-w-md mx-auto text-lg">
            48 nations. 4 designs. Votre équipe vous attend.
          </p>
          <Link href="/teams" className="btn-gold text-xl px-12 py-5">
            🌍 Choisir mon équipe
          </Link>
        </div>
      </section>

      {/* CSS hover dynamique */}
      <style>{`
        .featured-team:hover {
          border-color: color-mix(in srgb, var(--team-color) 60%, transparent) !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px color-mix(in srgb, var(--team-color) 30%, transparent);
          transform: translateY(-3px);
        }
      `}</style>
    </>
  );
}
