# Football 2026 — Boutique Fan-Made

> **Disclaimer** : Produits fan-made non officiels. Non affilié à la FIFA ou aux fédérations nationales.

## Stack

| Couche | Technologie |
|--------|-------------|
| Frontend | Next.js 15 (App Router) + Tailwind CSS |
| Commerce | Shopify Storefront API |
| POD | Printful (AUTO) |
| Storage | Cloudinary |
| Automation | n8n (WF-A + WF-B) |
| Deploy | Vercel (preview + prod) |
| Tracking | GA4 |

## Architecture

```
football-2026/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── teams/              # Hub pays (/teams)
│   │   ├── teams/[country]/    # Page pays SSR
│   │   ├── product/[handle]/   # Page produit SSR
│   │   └── api/                # Route handlers
│   │       ├── webhooks/n8n/   # Webhook n8n (HMAC)
│   │       └── webhooks/printful/
│   ├── lib/
│   │   ├── shopify/            # Storefront API client
│   │   ├── printful/           # Printful API client
│   │   ├── cloudinary/         # Cloudinary helpers
│   │   └── utils/              # SKU builder, HMAC, logger
│   ├── components/             # UI React
│   └── types/                  # TypeScript global types
└── n8n/                        # Exports JSON workflows
```

## Conventions SKU

Format : `ISO-D#-GENDER-SIZE-2026`

Exemples :
- `FRA-D1-MEN-L-2026` → France, Slogan, Homme, L
- `BRA-D3-WOMEN-XS-2026` → Brésil, Fantaisie, Femme, XS
- `ARG-D2-KIDS-3-4-2026` → Argentine, Emblème, Enfant, 3-4 ans

Designs :
- D1 → Slogan
- D2 → Emblème
- D3 → Fantaisie
- D4 → Basic

## Setup local

```bash
# 1. Cloner
git clone https://github.com/Maruuch/MONDIAL26.git
cd MONDIAL26

# 2. Installer
npm install

# 3. Variables d'environnement
cp .env.example .env.local
# → Remplir les valeurs

# 4. Lancer
npm run dev
```

## Déploiement

Le déploiement est automatique via GitHub → Vercel.

- \`main\` → Production
- PR/branches → Preview

## n8n Workflows

| Workflow | Déclencheur | Action |
|----------|------------|--------|
| WF-A | Webhook \`/api/webhooks/n8n\` | Génère le design via Cloudinary |
| WF-B | Fin WF-A | Draft Printful → Email validation → Publish Shopify |

Sécurité : HMAC-SHA256 sur tous les webhooks entrants.
