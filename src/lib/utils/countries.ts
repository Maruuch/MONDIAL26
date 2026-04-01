/**
 * Mapping ISO → { slug, flag, name }
 * Source : équipes qualifiées Coupe du Monde 2026 (48 équipes)
 */
export const COUNTRIES: Record<
  string,
  { name: string; slug: string; flag: string }
> = {
  FRA: { name: "France", slug: "france", flag: "🇫🇷" },
  BRA: { name: "Brésil", slug: "bresil", flag: "🇧🇷" },
  ARG: { name: "Argentine", slug: "argentine", flag: "🇦🇷" },
  ESP: { name: "Espagne", slug: "espagne", flag: "🇪🇸" },
  DEU: { name: "Allemagne", slug: "allemagne", flag: "🇩🇪" },
  ENG: { name: "Angleterre", slug: "angleterre", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  PRT: { name: "Portugal", slug: "portugal", flag: "🇵🇹" },
  NLD: { name: "Pays-Bas", slug: "pays-bas", flag: "🇳🇱" },
  BEL: { name: "Belgique", slug: "belgique", flag: "🇧🇪" },
  ITA: { name: "Italie", slug: "italie", flag: "🇮🇹" },
  USA: { name: "États-Unis", slug: "etats-unis", flag: "🇺🇸" },
  MEX: { name: "Mexique", slug: "mexique", flag: "🇲🇽" },
  CAN: { name: "Canada", slug: "canada", flag: "🇨🇦" },
  MAR: { name: "Maroc", slug: "maroc", flag: "🇲🇦" },
  SEN: { name: "Sénégal", slug: "senegal", flag: "🇸🇳" },
  NGA: { name: "Nigeria", slug: "nigeria", flag: "🇳🇬" },
  JPN: { name: "Japon", slug: "japon", flag: "🇯🇵" },
  KOR: { name: "Corée du Sud", slug: "coree-du-sud", flag: "🇰🇷" },
  AUS: { name: "Australie", slug: "australie", flag: "🇦🇺" },
  COL: { name: "Colombie", slug: "colombie", flag: "🇨🇴" },
  URY: { name: "Uruguay", slug: "uruguay", flag: "🇺🇾" },
  CHE: { name: "Suisse", slug: "suisse", flag: "🇨🇭" },
  HRV: { name: "Croatie", slug: "croatie", flag: "🇭🇷" },
  DNK: { name: "Danemark", slug: "danemark", flag: "🇩🇰" },
};

/**
 * Trouve le pays par son slug URL
 */
export function getCountryBySlug(
  slug: string
): { iso: string; name: string; flag: string } | null {
  for (const [iso, data] of Object.entries(COUNTRIES)) {
    if (data.slug === slug) return { iso, ...data };
  }
  return null;
}

/**
 * Tous les slugs disponibles (pour generateStaticParams)
 */
export function getAllCountrySlugs(): string[] {
  return Object.values(COUNTRIES).map((c) => c.slug);
}
