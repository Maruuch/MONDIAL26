"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export function Header() {
  const { totalQuantity } = useCart();

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "rgba(10, 15, 30, 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(30, 45, 74, 0.8)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-black text-xl tracking-tight transition-all duration-200 hover:opacity-90"
          style={{ fontFamily: "var(--font-barlow)" }}
        >
          <span className="text-2xl" style={{ filter: "drop-shadow(0 0 8px rgba(232,197,71,0.6))" }}>
            ⚽
          </span>
          <span className="text-wc-text">
            FOOTBALL<span style={{ color: "#E8C547" }}> 2026</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/teams"
            className="text-wc-muted hover:text-wc-accent transition-colors duration-200"
          >
            48 équipes
          </Link>
          <span style={{ color: "rgba(100,116,139,0.4)" }}>|</span>
          <span className="text-wc-muted text-xs opacity-60">
            Fan-made · Non officiel
          </span>
        </nav>

        {/* Panier */}
        <Link
          href="#"
          className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold text-wc-text transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
          }}
        >
          🛒
          <span className="hidden sm:inline">Panier</span>
          {totalQuantity > 0 && (
            <span
              className="absolute -top-1.5 -right-1.5 text-black text-xs font-black w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: "#E8C547", boxShadow: "0 0 10px rgba(232,197,71,0.5)" }}
            >
              {totalQuantity > 9 ? "9+" : totalQuantity}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
