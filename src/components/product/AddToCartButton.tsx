"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { ShopifyProductVariant, DesignCode, Gender } from "@/types";

interface AddToCartButtonProps {
  variant: ShopifyProductVariant | null;
  selectedDesign: DesignCode | null;
  selectedGender: Gender | null;
}

export function AddToCartButton({ variant, selectedDesign, selectedGender }: AddToCartButtonProps) {
  const { addToCart, loading } = useCart();
  const [added, setAdded] = useState(false);

  const missingStep = !selectedDesign
    ? "Sélectionnez un design"
    : !selectedGender
    ? "Sélectionnez un genre"
    : !variant
    ? "Sélectionnez une taille"
    : null;

  const isOutOfStock = variant && !variant.availableForSale;
  const isDisabled = !!missingStep || !!isOutOfStock || loading || added;

  async function handleClick() {
    if (!variant || isDisabled) return;
    try {
      await addToCart(variant.id);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch { /* géré dans CartContext */ }
  }

  let label: string;
  if (isOutOfStock) label = "Rupture de stock";
  else if (missingStep) label = missingStep;
  else if (loading) label = "Ajout en cours…";
  else if (added) label = "✓ Ajouté au panier !";
  else label = "Ajouter au panier";

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className="w-full py-4 rounded-xl font-black text-base tracking-wide transition-all duration-200"
      style={{
        fontFamily: "var(--font-barlow)",
        background: isDisabled
          ? "rgba(30,45,74,0.4)"
          : added
          ? "#22C55E"
          : "linear-gradient(135deg, #E8C547 0%, #D4A843 100%)",
        color: isDisabled ? "#2D3F5A" : "#0A0F1E",
        border: "none",
        cursor: isDisabled ? "not-allowed" : "pointer",
        boxShadow: isDisabled ? "none" : "0 4px 20px rgba(232,197,71,0.3)",
      }}
    >
      {label}
    </button>
  );
}
