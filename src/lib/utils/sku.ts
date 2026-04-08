import type { SKUParts, DesignCode, Gender } from "@/types";

/**
 * Génère un SKU selon la convention : ISO-D#-GENDER-SIZE-2026
 * Exemple : FRA-D1-MEN-L-2026
 */
export function buildSKU({ iso, design, gender, size }: SKUParts): string {
  if (!iso || iso.length !== 3) throw new Error(`ISO invalide : "${iso}"`);
  return `${iso.toUpperCase()}-${design}-${gender}-${size}-2026`;
}

/**
 * Décompose un SKU en ses parties
 * Exemple : "FRA-D1-MEN-L-2026" → { iso: "FRA", design: "D1", gender: "MEN", size: "L" }
 */
export function parseSKU(sku: string): SKUParts {
  const parts = sku.split("-");
  if (parts.length < 5) throw new Error(`SKU invalide : "${sku}"`);

  const iso = parts[0];
  const design = parts[1] as DesignCode;
  const gender = parts[2] as Gender;
  const size = parts.slice(3, -1).join("-");

  return { iso, design, gender, size };
}

/**
 * Génère tous les SKUs pour un pays+design donné
 */
export function generateAllSKUs(
  iso: string,
  design: DesignCode
): string[] {
  const { SIZES } = require("@/types");
  const skus: string[] = [];
  const genders: Gender[] = ["MEN", "WOMEN"];
  for (const gender of genders) {
    for (const size of SIZES[gender]) {
      skus.push(buildSKU({ iso, design, gender, size }));
    }
  }
  return skus;
}
