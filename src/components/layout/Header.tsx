"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export function Header() {
  const { totalQuantity } = useCart();

  return (
    <header className="bg-brand text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tight hover:text-brand-accent transition-colors">
          <span className="text-2xl">⚽</span>
          <span>Football<span className="text-brand-accent"> 2026</span></span>
        </Link>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
          <Link href="/teams" className="hover:text-brand-accent transition-colors">
            Équipes
          </Link>
          <span className="text-white/20">|</span>
          <span className="text-blue-300 text-xs">Fan-made · Non officiel</span>
        </nav>

        {/* Panier */}
        <Link href="#" className="relative flex items-center gap-1.5 bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-lg text-sm font-semibold">
          🛒
          <span className="hidden sm:inline">Panier</span>
          {totalQuantity > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-brand-accent text-brand text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
              {totalQuantity > 9 ? "9+" : totalQuantity}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
