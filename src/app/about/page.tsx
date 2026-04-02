import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos — Football 2026",
  description:
    "Découvrez le projet Football 2026 : une collection fan-made non officielle de designs pour la Coupe du Monde 2026. 48 équipes, 4 designs chacune.",
};

const FAQ = [
  {
    q: "C'est quoi Football 2026 ?",
    a: "Une collection de designs fan-made créés par des passionnés pour la Coupe du Monde 2026 (USA · Mexique · Canada). 48 nations, 4 designs exclusifs par équipe, imprimés à la commande.",
  },
  {
    q: "Les produits sont-ils officiels ?",
    a: "Non. Ce sont des créations indépendantes et non affiliées à la FIFA, aux fédérations nationales ou aux équipes officielles. C'est clairement indiqué sur chaque produit.",
  },
  {
    q: "Comment sont fabriqués les produits ?",
    a: "Chaque article est imprimé à la demande (Print-on-Demand). Il n'y a pas de stock : votre commande est produite spécifiquement pour vous à la réception, garantissant une qualité maximale.",
  },
  {
    q: "Quels délais de livraison ?",
    a: "Comptez 3 à 5 jours ouvrés de production, puis 2 à 5 jours de livraison selon votre destination. Total estimé : 5 à 10 jours ouvrés.",
  },
  {
    q: "Livrez-vous partout dans le monde ?",
    a: "Oui, la livraison est mondiale. Les frais sont calculés automatiquement au moment du paiement selon votre adresse.",
  },
  {
    q: "Puis-je retourner ou échanger un article ?",
    a: "Les produits étant fabriqués à la commande, les retours sont acceptés uniquement en cas de défaut de fabrication avéré. Contactez-nous dans les 14 jours suivant la réception.",
  },
  {
    q: "Comment choisir ma taille ?",
    a: "Chaque page produit indique les tailles disponibles (XS à XXL pour adultes, 0-1 an à 13-14 ans pour enfants). En cas de doute, nous recommandons de prendre une taille au-dessus.",
  },
  {
    q: "Mon équipe n'est pas disponible, que faire ?",
    a: "Toutes les 48 nations qualifiées pour la CdM 2026 sont représentées. Si vous ne trouvez pas votre équipe, consultez la page 'Les 48 équipes' — elle y est forcément.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: "#0A0F1E" }}>

      {/* ── Hero ── */}
      <section
        className="py-20 text-center relative overflow-hidden"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(232,197,71,0.08) 0%, #0A0F1E 65%)",
          borderBottom: "1px solid rgba(30,45,74,0.6)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(30,45,74,0.6) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="container mx-auto px-4 relative z-10 max-w-2xl">
          <div className="section-label mx-auto w-fit mb-6">
            <span>⚽</span>
            <span>Le projet</span>
          </div>
          <h1
            className="font-black text-wc-text mb-5"
            style={{ fontFamily: "var(--font-barlow)", fontSize: "clamp(3rem, 7vw, 5rem)" }}
          >
            À PROPOS
          </h1>
          <p className="text-wc-muted text-lg leading-relaxed">
            Football 2026 est une initiative de fans pour les fans.
            Des designs créatifs, une impression premium, pour vivre la Coupe du Monde 2026 à votre façon.
          </p>
        </div>
      </section>

      {/* ── Concept ── */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: "🎨",
                title: "48 nations",
                desc: "Toutes les équipes qualifiées pour la Coupe du Monde 2026 ont droit à leur collection.",
              },
              {
                icon: "✨",
                title: "4 designs / équipe",
                desc: "Classic, Bold, Héritage, Night — chaque nation a 4 designs exclusifs qui lui ressemblent.",
              },
              {
                icon: "⚡",
                title: "Impression à la demande",
                desc: "Fabriqué spécialement pour vous. Qualité premium, aucun stock, zéro gaspillage.",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="p-6 rounded-2xl text-center"
                style={{ background: "#141F35", border: "1px solid rgba(30,45,74,0.6)" }}
              >
                <div className="text-4xl mb-4">{icon}</div>
                <h3
                  className="font-black text-wc-text text-lg mb-2"
                  style={{ fontFamily: "var(--font-barlow)" }}
                >
                  {title}
                </h3>
                <p className="text-wc-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* ── FAQ ── */}
          <div className="text-center mb-10">
            <h2
              className="font-black text-wc-text text-4xl"
              style={{ fontFamily: "var(--font-barlow)" }}
            >
              QUESTIONS FRÉQUENTES
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ.map(({ q, a }) => (
              <div
                key={q}
                className="p-5 rounded-2xl"
                style={{ background: "#0F1829", border: "1px solid rgba(30,45,74,0.6)" }}
              >
                <h3 className="font-bold text-wc-text text-sm mb-2 flex items-start gap-2">
                  <span style={{ color: "#E8C547" }}>Q.</span>
                  {q}
                </h3>
                <p className="text-wc-muted text-sm leading-relaxed pl-5">{a}</p>
              </div>
            ))}
          </div>

          {/* ── Avertissement légal ── */}
          <div
            className="mt-10 p-6 rounded-2xl text-center"
            style={{
              background: "rgba(232,197,71,0.05)",
              border: "1px solid rgba(232,197,71,0.2)",
            }}
          >
            <p className="text-sm" style={{ color: "#E8C547" }}>
              ⚠️ Produits fan-made non officiels · Non affilié à la FIFA, aux fédérations ou aux équipes nationales
            </p>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/teams"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-sm transition-all"
              style={{
                background: "linear-gradient(135deg, #E8C547 0%, #D4A843 100%)",
                color: "#0A0F1E",
                fontFamily: "var(--font-barlow)",
                boxShadow: "0 4px 20px rgba(232,197,71,0.25)",
              }}
            >
              Voir les 48 équipes →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
