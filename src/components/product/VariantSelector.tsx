"use client";

import { useState } from "react";
import type { ShopifyProductVariant, Gender } from "@/types";
import { SIZES } from "@/types";

interface VariantSelectorProps {
  variants: ShopifyProductVariant[];
  onVariantSelect: (variant: ShopifyProductVariant | null, gender: Gender | null) => void;
}

export function VariantSelector({ variants, onVariantSelect }: VariantSelectorProps) {
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ShopifyProductVariant | null>(null);

  const genders: Gender[] = ["MEN", "WOMEN"];
  const genderLabels: Record<Gender, string> = { MEN: "Homme", WOMEN: "Femme" };
  const availableSizes = selectedGender ? SIZES[selectedGender] : [];

  function getVariantForSize(size: string) {
    return variants.find(
      (v) =>
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
      {/* Genre */}
      <div>
        <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: "#94A3B8" }}>
          Genre
        </p>
        <div className="flex gap-2">
          {genders.map((g) => (
            <button
              key={g}
              onClick={() => handleGenderSelect(g)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
              style={
                selectedGender === g
                  ? { background: "#E8C547", color: "#0A0F1E", border: "1px solid #E8C547" }
                  : {
                      background: "transparent",
                      color: "#94A3B8",
                      border: "1px solid rgba(30,45,74,0.8)",
                    }
              }
            >
              {genderLabels[g]}
            </button>
          ))}
        </div>
      </div>

      {/* Taille */}
      {selectedGender && (
        <div>
          <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: "#94A3B8" }}>
            Taille
          </p>
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
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
                  style={
                    isSelected
                      ? { background: "#E8C547", color: "#0A0F1E", border: "1px solid #E8C547" }
                      : isAvailable
                      ? {
                          background: "transparent",
                          color: "#94A3B8",
                          border: "1px solid rgba(30,45,74,0.8)",
                          cursor: "pointer",
                        }
                      : {
                          background: "transparent",
                          color: "#1E2D46",
                          border: "1px solid rgba(30,45,74,0.4)",
                          cursor: "not-allowed",
                          textDecoration: "line-through",
                        }
                  }
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
