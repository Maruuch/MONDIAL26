import type { Metadata } from "next";
import Link from "next/link";
import { COUNTRIES } from "@/lib/utils/countries";

export const metadata: Metadata = {
  title: "Toutes les Équipes — Football 2026",
  description:
    "Découvrez notre collection fan-made pour toutes les équipes nationales de la Coupe du Monde 2026. Maillots, t-shirts et accessoires.",
  openGraph: {
    title: "Équipes Coupe du Monde 2026 — Fan-Made",
    description: "Collection fan-made pour 24 équipes nationales.",
  },
};

export default function TeamsPage() {
  const countries = Object.entries(COUNTRIES).sort(([, a], [, b]) =>
    a.name.localeCompare(b.name, "fr")
  );

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <span className="badge-disclaimer mb-4 inline-block">
          Produits fan-made non officiels
        </span>
        <h1 className="text-4xl font-bold text-brand mb-3">
          Équipes Coupe du Monde 2026
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Choisissez votre équipe et découvrez les 4 designs exclusifs disponibles.
        </p>
      </div>

      {/* Grille équipes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {countries.map(([iso, { name, slug, flag }]) => (
          <Link
            key={iso}
            href={`/teams/${slug}`}
            className="group flex flex-col items-center p-4 rounded-xl border border-gray-200 hover:border-brand hover:shadow-md transition-all duration-200 bg-white"
          >
            <span className="text-4xl mb-2" role="img" aria-label={name}>
              {flag}
            </span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-brand text-center">
              {name}
            </span>
            <span className="text-xs text-gray-400 mt-0.5">{iso}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
