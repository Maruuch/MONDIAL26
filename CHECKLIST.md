# ✅ Checklist Finale — Football 2026

## 1. Setup & Infrastructure

- [ ] Repository GitHub créé et pushé
- [ ] Branches : `main` (prod), `develop` (staging)
- [ ] `.env.local` rempli avec les vraies valeurs
- [ ] `npm install` exécuté sans erreur
- [ ] `npm run type-check` → 0 erreur TypeScript
- [ ] `npm run lint` → 0 erreur ESLint
- [ ] `npm run build` → build réussi

## 2. Shopify

- [ ] App Shopify créée (Custom App ou Partner App)
- [ ] Storefront API token configuré (scope : `unauthenticated_read_product_listings`)
- [ ] Admin API key configurée (scope : `write_products`, `read_products`)
- [ ] Metafields `football2026` créés dans Shopify Admin → Settings → Custom Data :
  - [ ] `non_official` (boolean)
  - [ ] `country_iso` (single_line_text_field)
  - [ ] `country_name` (single_line_text_field)
  - [ ] `design_code` (single_line_text_field)
  - [ ] `cloudinary_url` (url)
  - [ ] `printful_product_id` (number_integer)
- [ ] Metafields visibles via Storefront API activés
- [ ] Options produit configurées : `Gender` et `Size`
- [ ] Test : GET `/product/[handle]` retourne les metafields

## 3. Printful

- [ ] Compte Printful connecté à la boutique Shopify
- [ ] `PRINTFUL_API_KEY` valide
- [ ] `PRINTFUL_STORE_ID` correct
- [ ] Vérifier les IDs variantes catalogue (`PRINTFUL_VARIANT_IDS` dans `src/lib/printful/api.ts`)
  > ⚠️ Les IDs hardcodés sont des placeholders — à récupérer via `GET /products/{id}/variants`
- [ ] Test création produit Printful (mode sandbox si disponible)
- [ ] Webhook Printful pointant vers `/api/webhooks/printful` configuré

## 4. Cloudinary

- [ ] `CLOUDINARY_URL` valide
- [ ] Dossier `football2026/` créé
- [ ] Upload test réussi
- [ ] Transformations URL (resize, format auto) vérifiées

## 5. n8n

- [ ] Instance n8n accessible (self-hosted ou cloud)
- [ ] `N8N_SECRET` identique dans n8n et `.env.local`
- [ ] WF-A importé (`n8n/WF-A_generate_design.json`) et actif
- [ ] WF-B importé (`n8n/WF-B_draft_approve_publish.json`) et actif
- [ ] Variables d'environnement n8n configurées :
  - `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_ADMIN_API_KEY`
  - `PRINTFUL_API_KEY`, `PRINTFUL_STORE_ID`
  - `CLOUDINARY_CLOUD_NAME`
  - `N8N_SECRET`
  - `NEXT_APP_URL`
  - `APPROVAL_EMAIL`
- [ ] Test WF-A : appel manuel → design uploadé sur Cloudinary
- [ ] Test WF-B : email d'approbation reçu → clic → produit publié Shopify

## 6. Webhooks & Sécurité

- [ ] `POST /api/webhooks/n8n` → 401 si signature invalide
- [ ] `POST /api/webhooks/printful` → 401 si signature invalide
- [ ] HMAC testé avec une vraie signature valide → 200
- [ ] Headers de sécurité présents (`X-Content-Type-Options`, `X-Frame-Options`)
- [ ] Aucune clé API exposée côté client (vérifier bundle)

## 7. Frontend & SEO

- [ ] `/teams` : grille de pays affichée
- [ ] `/teams/[country]` : 4 produits max par pays
- [ ] `/product/[handle]` : sélecteur Genre → Taille en 2 étapes ✓
- [ ] JSON-LD `Product` et `ItemList` validé (Google Rich Results Test)
- [ ] `<meta>` title/description unique sur chaque page
- [ ] Images Next.js optimisées (`next/image` + sizes)
- [ ] Disclaimer "fan-made non officiel" visible sur chaque page produit
- [ ] Core Web Vitals : LCP < 2.5s, CLS < 0.1, FID < 100ms (Lighthouse)

## 8. Vercel & CI/CD

- [ ] Projet Vercel lié au repo GitHub
- [ ] Secrets Vercel configurés (tous les `@nom-secret`)
- [ ] `VERCEL_TOKEN` ajouté aux secrets GitHub
- [ ] Preview deploy sur chaque PR → URL de preview reçue
- [ ] Production deploy sur merge `main` → URL prod fonctionnelle
- [ ] GitHub Actions CI → `type-check` + `lint` passent au vert

## 9. Points en attente (à vérifier selon contexte)

> Ces points nécessitent des informations non disponibles dans le CONTEXT_FOR_CLAUDE.md initial.

- [ ] **IDs Printful catalogue** : confirmer via `GET https://api.printful.com/products` quel produit de base utiliser (T-shirt Bella+Canvas 3001 vs autre)
- [ ] **Email d'approbation** : définir `APPROVAL_EMAIL` (qui approuve les designs ?)
- [ ] **Prix retail Printful** : confirmer le prix de vente cible (placeholder : 29.99€)
- [ ] **Template design** : WF-A suppose une `designTemplateUrl` — définir la source (Figma export ? Génération IA ?)
- [ ] **Shopify Publication ID** : l'ID `online-store` dans `admin-api.ts` est à remplacer par le vrai GID de la publication
- [ ] **Cart API** : `AddToCartButton.tsx` a un TODO — implémenter Shopify Cart API (cartCreate + cartLinesAdd)
- [ ] **Pays qualifiés 2026** : confirmer la liste complète des 48 équipes et mettre à jour `countries.ts`
