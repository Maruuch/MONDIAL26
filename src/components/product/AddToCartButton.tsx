"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { ShopifyProductVariant, DesignCode, Gender } from "@/types";

interface AddToCartButtonProps {
  variant: ShopifyProductVariant | null;
  selectedDesign: DesignCode | null;
  selectedGender: Gender | null;
}

/**
 * Guard UX strict : le bouton n'est actif que si les 3 conditions sont remplies :
 *   1. design sélectionné
 *   2. genre sélectionné
 *   3. taille sélectionnée (= variant non null)
 *
 * Shopify est source de vérité pour le stock (availableForSale).
 */
export function AddToCartButton({
  variant,
  selectedDesign,
  selectedGender,
}: AddToCartButtonProps) {
  const { addToCart, loading } = useCart();
  const [added, setAdded] = useState(false);

  // ─ Calcul du label bloquant et de l'état du bouton
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
    } catch {
      // L'erreur est gérée dans CartContext
    }
  }

  // Label du bouton
  let label: string;
  if (isOutOfStock) label = "Rupture de stock";
  else if (missingStep) label = missingStep;
  else if (loading) label = "Ajout en cours…";
  else if (added) label = "✓ Ajouté au panier";
  else label = "Ajouter au panier";

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      aria-label={label}
      className={`btn-primary w-full transition-all ${
        isDisabled ? "opacity-40 cursor-not-allowed" : ""
      }`}
    >
      {label}
    </button>
  );
}
