"use client";

import { useState } from "react";
import { VariantSelector } from "./VariantSelector";
import { AddToCartButton } from "./AddToCartButton";
import type { ShopifyProductVariant, DesignCode, Gender } from "@/types";

interface ProductPageClientProps {
  variants: ShopifyProductVariant[];
  designCode: DesignCode | null;
}

export function ProductPageClient({ variants, designCode }: ProductPageClientProps) {
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ShopifyProductVariant | null>(null);

  function handleVariantSelect(variant: ShopifyProductVariant | null, gender: Gender | null) {
    setSelectedVariant(variant);
    setSelectedGender(gender);
  }

  return (
    <div className="space-y-6">
      <VariantSelector
        variants={variants}
        onVariantSelect={handleVariantSelect}
      />
      <AddToCartButton
        variant={selectedVariant}
        selectedDesign={designCode}
        selectedGender={selectedGender}
      />
    </div>
  );
}
