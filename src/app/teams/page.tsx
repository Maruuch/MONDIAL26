import type { Metadata } from "next";
import Link from "next/link";
import { COUNTRIES } from "@/lib/utils/countries";

export const metadata: Metadata = {
  title: "Toutes les Équipes — Football 2026",
  description: "Découvrez notre collection fan-made pour toutes les équipes nationales de la Coupe du Monde 2026.",
};

const GROUPS = {
  "🌍 Europe":   ["FRA","ESP","DEU","ENG","PRT","NLD","BEL","ITA","CHE","HRV","DNK"],
  "🌎 Amériques": ["BRA","ARG","USA","MEX","CAN","COL","URY"],
  "🌍 Afrique":  ["MAR","SEN","NGA"],
  "🌏 Asie & Océanie": ["JPN","KOR","AUS"],
};

export default function TeamsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-brand text-white py-14 text-center relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative z-10">
          <span className="inline-block bg-brand-accent text-brand text-xs font-bold px-3 py-1 rounded-full mb-4">
            Coupe du Monde 2026 · 24 équipes
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-3">Choisissez votre équipe</h1>
          <p className="text-blue-200 max-w-md mx-auto">4 designs exclusifs fan-made par pays. Trouvez le vôtre.</p>
        </div>
      </div>

      {/* Grilles par groupe */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        {Object.entries(GROUPS).map(([groupName, isos]) => (
          <div key={groupName}>
            <h2 className="text-xl font-bold text-brand mb-5 flex items-center gap-2">
              {groupName}
              <span className="text-xs text-gray-400 font-normal">{isos.length} équipes</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {isos.map((iso) => {
                const c = COUNTRIES[iso];
                if (!c) return null;
                return (
                  <Link key={iso} href={`/teams/${c.slug}`}
                    className="group flex flex-col items-center p-5 rounded-2xl bg-white border-2 border-gray-100 hover:border-brand hover:shadow-xl transition-all duration-200">
                    <span className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-200">
                      {c.flag}
                    </span>
                    <span className="text-sm font-bold text-gray-800 group-hover:text-brand text-center leading-tight mb-1">
                      {c.name}
                    </span>
                    <span className="text-xs text-gray-400">{iso}</span>
                    <span className="mt-2 text-xs text-brand-accent font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Voir →
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
