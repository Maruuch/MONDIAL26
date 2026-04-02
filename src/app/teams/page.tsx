import Link from "next/link";
import type { Metadata } from "next";
import { GROUPS, COUNTRIES } from "@/lib/utils/countries";

export const metadata: Metadata = {
  title: "Les 48 équipes — Coupe du Monde 2026",
  description:
    "Tous les groupes de la Coupe du Monde 2026. 48 nations, 12 groupes A–L. Sélectionnez votre équipe et découvrez les designs.",
};

const GROUP_LETTERS = ["A","B","C","D","E","F","G","H","I","J","K","L"] as const;

export default function TeamsPage() {
  return (
    <div className="min-h-screen" style={{ background: "#0A0F1E" }}>

      {/* ══════════ EN-TÊTE ══════════ */}
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
        <div className="container mx-auto px-4 relative z-10">
          <div className="section-label mx-auto w-fit mb-6">
            <span>⚽</span>
            <span>Coupe du Monde 2026</span>
          </div>
          <h1
            className="font-black tracking-tight text-wc-text mb-4"
            style={{ fontFamily: "var(--font-barlow)", fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}
          >
            LES 48 ÉQUIPES
          </h1>
          <p className="text-wc-muted text-lg max-w-lg mx-auto">
            12 groupes · 48 nations · USA · Mexique · Canada
          </p>
          <div className="mt-10 flex justify-center gap-10">
            {[
              { value: "48", label: "Nations" },
              { value: "12", label: "Groupes" },
              { value: "4",  label: "Designs / équipe" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div
                  className="text-3xl font-black"
                  style={{ fontFamily: "var(--font-barlow)", color: "#E8C547" }}
                >
                  {value}
                </div>
                <div className="text-xs text-wc-muted mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ GRILLE 12 GROUPES ══════════ */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {GROUP_LETTERS.map((letter) => {
              const isos = GROUPS[letter];
              const teams = isos.map((iso) => ({ iso, ...COUNTRIES[iso] })).filter(Boolean);
              const accent = teams[0]?.colors.primary ?? "#E8C547";
              return (
                <div
                  key={letter}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: "#0F1829",
                    border: "1px solid rgba(30,45,74,0.8)",
                  }}
                >
                  {/* Header groupe */}
                  <div
                    className="px-5 py-3 flex items-center gap-3"
                    style={{
                      background: `linear-gradient(90deg, ${accent}18 0%, transparent 100%)`,
                      borderBottom: "1px solid rgba(30,45,74,0.6)",
                    }}
                  >
                    <span
                      className="text-xl font-black w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        fontFamily: "var(--font-barlow)",
                        background: accent + "22",
                        color: accent,
                        border: `1px solid ${accent}38`,
                      }}
                    >
                      {letter}
                    </span>
                    <div className="min-w-0">
                      <div
                        className="text-xs font-black tracking-widest uppercase mb-0.5"
                        style={{ color: accent, opacity: 0.75 }}
                      >
                        Groupe {letter}
                      </div>
                      <div className="text-wc-muted text-xs truncate">
                        {teams.map((t) => t.name).join(" · ")}
                      </div>
                    </div>
                  </div>

                  {/* Équipes */}
                  <div>
                    {teams.map((team, idx) => (
                      <Link
                        key={team.iso}
                        href={`/teams/${team.slug}`}
                        className="team-row relative flex items-center gap-3 px-5 py-3 transition-colors duration-150"
                        style={{
                          borderBottom: idx < teams.length - 1 ? "1px solid rgba(30,45,74,0.35)" : "none",
                          // CSS custom properties pour hover
                          ["--team-color" as string]: team.colors.primary,
                        }}
                      >
                        <span className="text-2xl flex-shrink-0 transition-transform duration-200 team-flag">
                          {team.flag}
                        </span>
                        <span className="flex-1 text-sm font-semibold text-wc-text leading-tight">
                          {team.name}
                        </span>
                        <span className="text-xs font-bold team-arrow flex-shrink-0 transition-all duration-200">
                          →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ BAS DE PAGE ══════════ */}
      <section
        className="py-12 text-center"
        style={{ borderTop: "1px solid rgba(30,45,74,0.5)" }}
      >
        <p className="text-wc-muted text-sm">
          Toutes les 48 nations qualifiées pour la Coupe du Monde 2026 sont représentées.
        </p>
      </section>

      {/* CSS hover via classes globales */}
      <style>{`
        .team-row:hover {
          background: color-mix(in srgb, var(--team-color) 10%, transparent);
        }
        .team-row:hover .team-flag {
          transform: scale(1.15);
        }
        .team-row .team-arrow {
          color: transparent;
          opacity: 0;
          transform: translateX(4px);
        }
        .team-row:hover .team-arrow {
          color: var(--team-color);
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>
    </div>
  );
}
