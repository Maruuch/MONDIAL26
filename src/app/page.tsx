import Link from "next/link";
import type { Metadata } from "next";
import { COUNTRIES } from "@/lib/utils/countries";

export const metadata: Metadata = {
  title: "Football 2026 — Maillots Fan-Made Coupe du Monde",
  description: "Collection fan-made premium pour la Coupe du Monde 2026. Maillots, t-shirts et accessoires pour supporter votre équipe.",
};

const FEATURED = ["FRA", "BRA", "ARG", "ESP", "MAR", "JPN", "PRT", "DEU"];
const DESIGNS = [
  { code: "D1", label: "Slogan",   desc: "Le cri du supporter",  emoji: "📣" },
  { code: "D2", label: "Emblème",  desc: "Armoiries & fierté",   emoji: "🛡️" },
  { code: "D3", label: "Fantaisie",desc: "Art & couleurs",        emoji: "🎨" },
  { code: "D4", label: "Basic",    desc: "Minimaliste & classe",  emoji: "✨" },
];

export default function HomePage() {
  const featured = FEATURED.map((iso) => ({ iso, ...COUNTRIES[iso] })).filter(Boolean);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-brand text-white">
        <div aria-hidden="true" className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10 text-center">
          <span className="inline-block bg-brand-accent text-brand text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-6">
            Fan-made · Non officiel · Coupe du Monde 2026
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
            Supportez votre équipe<br />
            <span className="text-brand-accent">avec style.</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-200 max-w-2xl mx-auto mb-10">
            4 designs exclusifs par équipe. Qualité premium. Livraison mondiale via Printful.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/teams"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-accent text-brand font-bold rounded-xl text-lg hover:bg-yellow-400 transition-colors shadow-lg">
              🌍 Explorer les 24 équipes
            </Link>
            <Link href="/teams/france"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl text-lg hover:bg-white/20 transition-colors border border-white/20">
              🇫🇷 Voir la France
            </Link>
          </div>
        </div>
      </section>

      {/* ÉQUIPES VEDETTES */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-brand text-center mb-2">Équipes populaires</h2>
          <p className="text-gray-500 text-center mb-10">Cliquez sur une équipe pour voir ses designs</p>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {featured.map(({ iso, name, slug, flag }) => (
              <Link key={iso} href={`/teams/${slug}`}
                className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-gray-200 hover:border-brand hover:shadow-lg transition-all">
                <span className="text-4xl md:text-5xl">{flag}</span>
                <span className="text-xs font-semibold text-gray-600 group-hover:text-brand text-center">{name}</span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/teams" className="inline-flex items-center gap-2 text-brand font-semibold hover:underline">
              Voir les 24 équipes →
            </Link>
          </div>
        </div>
      </section>

      {/* 4 DESIGNS */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-brand text-center mb-2">4 designs par équipe</h2>
          <p className="text-gray-500 text-center mb-10">Une collection complète pour chaque pays</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {DESIGNS.map(({ code, label, desc, emoji }) => (
              <div key={code}
                className="flex flex-col items-center p-6 rounded-2xl border-2 border-gray-100 hover:border-brand hover:shadow-lg transition-all bg-gradient-to-b from-white to-gray-50">
                <span className="text-5xl mb-4">{emoji}</span>
                <span className="inline-block bg-brand text-white text-xs font-bold px-2 py-0.5 rounded mb-2">{code}</span>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{label}</h3>
                <p className="text-sm text-gray-500 text-center">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="py-16 bg-brand text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step:"01", title:"Choisissez", desc:"Sélectionnez votre équipe et votre design parmi 96 combinaisons.", icon:"🎯" },
              { step:"02", title:"Commandez",  desc:"Paiement sécurisé. Chaque produit est fabriqué à la demande.",   icon:"🛒" },
              { step:"03", title:"Recevez",    desc:"Impression premium via Printful. Livraison mondiale en 5-10 jours.", icon:"📦" },
            ].map(({ step, title, desc, icon }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="text-4xl mb-3">{icon}</div>
                <span className="text-brand-accent text-sm font-bold mb-1">ÉTAPE {step}</span>
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-blue-200 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50 text-center">
        <div className="container mx-auto px-4">
          <p className="text-5xl mb-4">⚽</p>
          <h2 className="text-3xl font-bold text-brand mb-4">Prêt à supporter votre équipe ?</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">24 nations. 4 designs. Votre équipe vous attend.</p>
          <Link href="/teams"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-brand text-white font-bold rounded-xl text-lg hover:bg-brand-light transition-colors shadow-lg">
            🌍 Choisir mon équipe
          </Link>
        </div>
      </section>
    </>
  );
}
