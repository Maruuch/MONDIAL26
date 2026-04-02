"use client";

import dynamic from "next/dynamic";

const WorldMapDynamic = dynamic(
  () => import("@/components/WorldMap").then((m) => m.WorldMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full rounded-2xl flex items-center justify-center text-wc-muted text-sm"
        style={{
          minHeight: 360,
          background: "#060D1C",
          border: "1px solid rgba(30,45,74,0.8)",
        }}
      >
        Chargement de la carte…
      </div>
    ),
  }
);

export function WorldMapClient() {
  return <WorldMapDynamic />;
}
