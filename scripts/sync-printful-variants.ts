#!/usr/bin/env tsx
/**
 * npm run sync:printful
 *
 * Hydrate le fichier src/lib/printful/variant-map.json
 * en appelant l'API Printful catalogue.
 *
 * À exécuter :
 *   - une première fois avant le premier déploiement
 *   - si Printful change ses IDs de variantes
 *   - avec --force pour forcer le refresh même si le cache est valide
 *
 * Usage :
 *   npm run sync:printful
 *   npm run sync:printful -- --force
 */

import "dotenv/config";
import { resolvePrintfulVariants } from "../src/lib/printful/resolve-variants";

async function main() {
  const forceRefresh = process.argv.includes("--force");
  console.log(`🔄 Syncing Printful variants (force=${forceRefresh})…\n`);

  try {
    const map = await resolvePrintfulVariants({ forceRefresh });
    console.log("✅ Variant map hydrated successfully:\n");

    for (const gender of ["MEN", "WOMEN"] as const) {
      const entry = map[gender];
      console.log(`📦 ${gender} (Printful product #${entry.printful_product_id})`);
      for (const [size, id] of Object.entries(entry.variants)) {
        console.log(`   ${size.padEnd(6)} → variant_id: ${id}`);
      }
      console.log();
    }

    console.log(`🕐 Last synced: ${map._meta.last_synced}`);
    console.log("📁 Written to: src/lib/printful/variant-map.json");
  } catch (err) {
    console.error("❌ FAIL FAST:", err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

main();
