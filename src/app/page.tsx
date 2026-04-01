import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Football 2026 — Maillots Fan-Made Coupe du Monde",
  description:
    "Collection fan-made premium pour la Coupe du Monde 2026. Maillots, t-shirts et accessoires pour supporter votre équipe.",
};

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <span className="badge-disclaimer mb-6 inline-block">
        Produits fan-made non officiels
      </span>
      <h1 className="text-5xl font-bold text-brand mb-4">
        Football 2026
      </h1>
      <p className="text-xl text-gray-600 mb-10 max-w-xl mx-auto">
        Supportez votre équipe avec style. Collection fan-made premium pour la Coupe du Monde 2026.
      </p>
      <Link href="/teams" className="btn-primary text-lg">
        Explorer les équipes →
      </Link>
    </div>
  );
}
