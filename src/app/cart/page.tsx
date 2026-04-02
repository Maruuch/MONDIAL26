"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, loading, updateLine, removeLine, openCheckout } = useCart();

  const lines = cart?.lines.edges.map((e) => e.node) ?? [];
  const total = cart?.cost.totalAmount;
  const formattedTotal = total
    ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: total.currencyCode }).format(
        parseFloat(total.amount)
      )
    : "—";

  return (
    <div className="min-h-screen" style={{ background: "#0A0F1E" }}>
      <section
        className="py-16 relative overflow-hidden"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(232,197,71,0.06) 0%, #0A0F1E 60%)",
          borderBottom: "1px solid rgba(30,45,74,0.5)",
        }}
      >
        <div className="container mx-auto px-4">
          <Link href="/teams" className="text-wc-muted hover:text-wc-accent text-sm mb-6 inline-block transition-colors">
            ← Continuer mes achats
          </Link>
          <h1
            className="font-black text-wc-text"
            style={{ fontFamily: "var(--font-barlow)", fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
          >
            MON PANIER
          </h1>
          <p className="text-wc-muted mt-1">
            {lines.length === 0 ? "Votre panier est vide" : `${lines.length} article${lines.length > 1 ? "s" : ""}`}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {lines.length === 0 ? (
          /* Panier vide */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-7xl mb-6 opacity-20">🛒</div>
            <h2
              className="text-3xl font-black text-wc-text mb-3"
              style={{ fontFamily: "var(--font-barlow)" }}
            >
              PANIER VIDE
            </h2>
            <p className="text-wc-muted mb-8">
              Choisissez votre équipe et commandez votre design fan-made.
            </p>
            <Link
              href="/teams"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all"
              style={{
                background: "linear-gradient(135deg, #E8C547 0%, #D4A843 100%)",
                color: "#0A0F1E",
                fontFamily: "var(--font-barlow)",
              }}
            >
              Voir les 48 équipes →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Lignes panier */}
            <div className="lg:col-span-2 space-y-4">
              {lines.map((line) => {
                const img = line.merchandise.product.images.edges[0]?.node;
                const lineTotal = new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: line.cost.totalAmount.currencyCode,
                }).format(parseFloat(line.cost.totalAmount.amount));

                return (
                  <div
                    key={line.id}
                    className="flex gap-4 p-4 rounded-2xl"
                    style={{ background: "#141F35", border: "1px solid rgba(30,45,74,0.6)" }}
                  >
                    {/* Image */}
                    <div
                      className="relative flex-shrink-0 rounded-xl overflow-hidden"
                      style={{ width: 88, height: 88, background: "#0A0F1E" }}
                    >
                      {img ? (
                        <Image src={img.url} alt={img.altText ?? ""} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl opacity-20">👕</div>
                      )}
                    </div>

                    {/* Infos */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-wc-text truncate">
                        {line.merchandise.product.title}
                      </h3>
                      <p className="text-xs text-wc-muted mt-0.5">
                        {line.merchandise.title !== "Default Title" ? line.merchandise.title : ""}
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        {/* Quantité */}
                        <div className="flex items-center gap-1 rounded-lg overflow-hidden" style={{ border: "1px solid rgba(30,45,74,0.7)" }}>
                          <button
                            onClick={() => line.quantity > 1 ? updateLine(line.id, line.quantity - 1) : removeLine(line.id)}
                            disabled={loading}
                            className="w-7 h-7 flex items-center justify-center text-wc-muted hover:text-wc-text transition-colors text-sm"
                          >
                            −
                          </button>
                          <span className="px-2 text-sm font-semibold text-wc-text">
                            {line.quantity}
                          </span>
                          <button
                            onClick={() => updateLine(line.id, line.quantity + 1)}
                            disabled={loading}
                            className="w-7 h-7 flex items-center justify-center text-wc-muted hover:text-wc-text transition-colors text-sm"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeLine(line.id)}
                          disabled={loading}
                          className="text-xs text-wc-muted hover:text-red-400 transition-colors"
                        >
                          Retirer
                        </button>
                      </div>
                    </div>

                    {/* Prix */}
                    <div className="text-right flex-shrink-0">
                      <span
                        className="font-black"
                        style={{ fontFamily: "var(--font-barlow)", color: "#E8C547" }}
                      >
                        {lineTotal}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Récap commande */}
            <div className="lg:col-span-1">
              <div
                className="rounded-2xl p-6 sticky top-24"
                style={{ background: "#141F35", border: "1px solid rgba(30,45,74,0.6)" }}
              >
                <h2
                  className="font-black text-wc-text text-xl mb-6"
                  style={{ fontFamily: "var(--font-barlow)" }}
                >
                  RÉCAPITULATIF
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-wc-muted">Sous-total</span>
                    <span className="text-wc-text font-semibold">{formattedTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-wc-muted">Livraison</span>
                    <span className="text-wc-muted">Calculée à l&apos;étape suivante</span>
                  </div>
                  <div
                    className="flex justify-between font-bold pt-3"
                    style={{ borderTop: "1px solid rgba(30,45,74,0.5)" }}
                  >
                    <span className="text-wc-text">Total</span>
                    <span style={{ color: "#E8C547", fontFamily: "var(--font-barlow)", fontSize: "1.25rem" }}>
                      {formattedTotal}
                    </span>
                  </div>
                </div>

                <button
                  onClick={openCheckout}
                  disabled={loading || lines.length === 0}
                  className="w-full py-4 rounded-xl font-black text-base tracking-wide transition-all"
                  style={{
                    fontFamily: "var(--font-barlow)",
                    background: "linear-gradient(135deg, #E8C547 0%, #D4A843 100%)",
                    color: "#0A0F1E",
                    boxShadow: "0 4px 20px rgba(232,197,71,0.3)",
                    opacity: loading ? 0.6 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Chargement…" : "Passer la commande →"}
                </button>

                <p className="text-xs text-wc-muted text-center mt-4 opacity-60">
                  Paiement sécurisé via Shopify Checkout
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
