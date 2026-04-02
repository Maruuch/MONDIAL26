import Link from "next/link";

export function Footer() {
  const disclaimer =
    process.env.NEXT_PUBLIC_DISCLAIMER ??
    "Produits fan-made non officiels. Non affilié à la FIFA ou aux fédérations nationales.";

  return (
    <footer style={{ background: "#060D1C", borderTop: "1px solid rgba(30,45,74,0.6)" }}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">⚽</span>
              <span
                className="font-black text-xl tracking-tight"
                style={{ fontFamily: "var(--font-barlow)", color: "#E8C547" }}
              >
                FOOTBALL <span style={{ color: "#FFFFFF" }}>2026</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "#4A6080" }}>
              Collection fan-made non officielle pour la Coupe du Monde 2026.
              USA · Mexique · Canada.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-black tracking-widest uppercase mb-4" style={{ color: "#E8C547" }}>
              Navigation
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Accueil" },
                { href: "/teams", label: "Les 48 équipes" },
                { href: "/about", label: "À propos" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm hover:opacity-100 transition-opacity"
                    style={{ color: "#4A6080", opacity: 0.8 }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h4 className="text-xs font-black tracking-widest uppercase mb-4" style={{ color: "#E8C547" }}>
              Avertissement
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: "#4A6080" }}>
              {disclaimer}
            </p>
          </div>
        </div>

        <div
          className="flex flex-col md:flex-row items-center justify-between gap-3 pt-6 text-xs"
          style={{ borderTop: "1px solid rgba(30,45,74,0.4)", color: "#2D3F5A" }}
        >
          <span>© {new Date().getFullYear()} Football 2026. Tous droits réservés.</span>
          <span style={{ color: "#1E2D46" }}>Fan-made · Non officiel · Non affilié FIFA</span>
        </div>
      </div>
    </footer>
  );
}
