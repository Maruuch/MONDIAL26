"use client";

import { useState } from "react";
import type { ShopifyProductVariant, Gender } from "@/types";
import { SIZES } from "@/types";

interface VariantSelectorProps {
  variants: ShopifyProductVariant[];
  onVariantSelect: (variant: ShopifyProductVariant | null, gender: Gender | null) => void;
}

/**
 * Sélecteur en 2 étapes :
 * 1. Choisir le genre (MEN / WOMEN / KIDS)
 * 2. Puis seulement → choisir la taille
 */
export function VariantSelector({ variants, onVariantSelect }: VariantSelectorProps) {
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ShopifyProductVariant | null>(null);

  const genders: Gender[] = ["MEN", "WOMEN", "KIDS"];
  const genderLabels: Record<Gender, string> = {
    MEN: "Homme",
    WOMEN: "Femme",
    KIDS: "Enfant",
  };

  const availableSizes = selectedGender ? SIZES[selectedGender] : [];

  function getVariantForSize(size: string): ShopifyProductVariant | undefined {
    return variants.find((v) =>
      v.selectedOptions.some((o) => o.name === "Gender" && o.value === selectedGender) &&
      v.selectedOptions.some((o) => o.name === "Size" && o.value === size)
    );
  }

  function handleGenderSelect(gender: Gender) {
    setSelectedGender(gender);
    setSelectedVariant(null);
    onVariantSelect(null, gender);
  }

  function handleSizeSelect(size: string) {
    const variant = getVariantForSize(size) ?? null;
    setSelectedVariant(variant);
    onVariantSelect(variant, selectedGender);
  }

  return (
    <div className="space-y-5">
      {/* Étape 1 : Genre */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">Genre</p>
        <div className="flex gap-2">
          {genders.map((g) => (
            <button
              key={g}
              onClick={() => handleGenderSelect(g)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                selectedGender === g
                  ? "bg-brand text-white border-brand"
                  : "border-gray-300 text-gray-700 hover:border-brand hover:text-brand"
              }`}
            >
              {genderLabels[g]}
            </button>
          ))}
        </div>
      </div>

      {/* Étape 2 : Taille — uniquement après sélection genre */}
      {selectedGender && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Taille</p>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => {
              const variant = getVariantForSize(size);
              const isAvailable = variant?.availableForSale ?? false;
              const isSelected = selectedVariant?.selectedOptions.some(
                (o) => o.name === "Size" && o.value === size
              );
              return (
                <button
                  key={size}
                  onClick={() => isAvailable && handleSizeSelect(size)}
                  disabled={!isAvailable}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                    isSelected
                      ? "bg-brand text-white border-brand"
                      : isAvailable
                      ? "border-gray-300 text-gray-700 hover:border-brand hover:text-brand"
                      : "border-gray-200 text-gray-300 cursor-not-allowed line-through"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
