/**
 * SOURCE DE VÉRITÉ : 48 équipes officielles Coupe du Monde 2026
 * Groupes A–L · 4 équipes par groupe
 * NE PAS MODIFIER SANS METTRE À JOUR LES GROUPES
 */

export type CountryData = {
  name: string;
  slug: string;
  flag: string;
  group: string; // 'A' à 'L'
  colors: { primary: string; secondary: string };
  mapId: number | number[] | null; // ISO numérique pour D3
};

export const COUNTRIES: Record<string, CountryData> = {
  // ── Groupe A ─────────────────────────────────────────────
  MEX: { name: "Mexique",             slug: "mexique",             flag: "🇲🇽", group: "A", colors: { primary: "#006847", secondary: "#CE1126" }, mapId: 484 },
  ZAF: { name: "Afrique du Sud",      slug: "afrique-du-sud",      flag: "🇿🇦", group: "A", colors: { primary: "#007A4D", secondary: "#FFB81C" }, mapId: 710 },
  KOR: { name: "Corée du Sud",        slug: "coree-du-sud",        flag: "🇰🇷", group: "A", colors: { primary: "#CD2E3A", secondary: "#003478" }, mapId: 410 },
  CZE: { name: "Rép. tchèque",        slug: "republique-tcheque",  flag: "🇨🇿", group: "A", colors: { primary: "#D7141A", secondary: "#11457E" }, mapId: 203 },

  // ── Groupe B ─────────────────────────────────────────────
  CAN: { name: "Canada",              slug: "canada",              flag: "🇨🇦", group: "B", colors: { primary: "#FF0000", secondary: "#FFFFFF" }, mapId: 124 },
  QAT: { name: "Qatar",               slug: "qatar",               flag: "🇶🇦", group: "B", colors: { primary: "#8D1B3D", secondary: "#FFFFFF" }, mapId: 634 },
  CHE: { name: "Suisse",              slug: "suisse",              flag: "🇨🇭", group: "B", colors: { primary: "#FF0000", secondary: "#FFFFFF" }, mapId: 756 },
  BIH: { name: "Bosnie-Herzégovine",  slug: "bosnie-herzegovine",  flag: "🇧🇦", group: "B", colors: { primary: "#002395", secondary: "#FFCD00" }, mapId: 70  },

  // ── Groupe C ─────────────────────────────────────────────
  BRA: { name: "Brésil",              slug: "bresil",              flag: "🇧🇷", group: "C", colors: { primary: "#009C3B", secondary: "#FFDF00" }, mapId: 76  },
  MAR: { name: "Maroc",               slug: "maroc",               flag: "🇲🇦", group: "C", colors: { primary: "#C1272D", secondary: "#006233" }, mapId: [504, 732] }, // incl. Sahara occidental
  HTI: { name: "Haïti",               slug: "haiti",               flag: "🇭🇹", group: "C", colors: { primary: "#00209F", secondary: "#D21034" }, mapId: 332 },
  SCO: { name: "Écosse",              slug: "ecosse",              flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", group: "C", colors: { primary: "#003DA5", secondary: "#FFFFFF" }, mapId: null }, // Pas de code ISO séparé

  // ── Groupe D ─────────────────────────────────────────────
  USA: { name: "États-Unis",          slug: "etats-unis",          flag: "🇺🇸", group: "D", colors: { primary: "#3C3B6E", secondary: "#B22234" }, mapId: 840 },
  PRY: { name: "Paraguay",            slug: "paraguay",            flag: "🇵🇾", group: "D", colors: { primary: "#D52B1E", secondary: "#0038A8" }, mapId: 600 },
  AUS: { name: "Australie",           slug: "australie",           flag: "🇦🇺", group: "D", colors: { primary: "#00008B", secondary: "#FF0000" }, mapId: 36  },
  TUR: { name: "Turquie",             slug: "turquie",             flag: "🇹🇷", group: "D", colors: { primary: "#E30A17", secondary: "#FFFFFF" }, mapId: 792 },

  // ── Groupe E ─────────────────────────────────────────────
  DEU: { name: "Allemagne",           slug: "allemagne",           flag: "🇩🇪", group: "E", colors: { primary: "#DD0000", secondary: "#FFCE00" }, mapId: 276 },
  CUW: { name: "Curaçao",             slug: "curacao",             flag: "🇨🇼", group: "E", colors: { primary: "#003DA5", secondary: "#F9E814" }, mapId: null }, // Absence dataset 110m
  CIV: { name: "Côte d'Ivoire",       slug: "cote-divoire",        flag: "🇨🇮", group: "E", colors: { primary: "#F07B16", secondary: "#009A44" }, mapId: 384 },
  ECU: { name: "Équateur",            slug: "equateur",            flag: "🇪🇨", group: "E", colors: { primary: "#FFD100", secondary: "#003893" }, mapId: 218 },

  // ── Groupe F ─────────────────────────────────────────────
  NLD: { name: "Pays-Bas",            slug: "pays-bas",            flag: "🇳🇱", group: "F", colors: { primary: "#AE1C28", secondary: "#21468B" }, mapId: 528 },
  JPN: { name: "Japon",               slug: "japon",               flag: "🇯🇵", group: "F", colors: { primary: "#BC002D", secondary: "#FFFFFF" }, mapId: 392 },
  TUN: { name: "Tunisie",             slug: "tunisie",             flag: "🇹🇳", group: "F", colors: { primary: "#E70013", secondary: "#FFFFFF" }, mapId: 788 },
  SWE: { name: "Suède",               slug: "suede",               flag: "🇸🇪", group: "F", colors: { primary: "#006AA7", secondary: "#FECC02" }, mapId: 752 },

  // ── Groupe G ─────────────────────────────────────────────
  BEL: { name: "Belgique",            slug: "belgique",            flag: "🇧🇪", group: "G", colors: { primary: "#EF3340", secondary: "#FAE042" }, mapId: 56  },
  EGY: { name: "Égypte",              slug: "egypte",              flag: "🇪🇬", group: "G", colors: { primary: "#CE1126", secondary: "#FFFFFF" }, mapId: 818 },
  IRN: { name: "Iran",                slug: "iran",                flag: "🇮🇷", group: "G", colors: { primary: "#239F40", secondary: "#DA0000" }, mapId: 364 },
  NZL: { name: "Nouvelle-Zélande",    slug: "nouvelle-zelande",    flag: "🇳🇿", group: "G", colors: { primary: "#003DA5", secondary: "#CC142B" }, mapId: 554 },

  // ── Groupe H ─────────────────────────────────────────────
  ESP: { name: "Espagne",             slug: "espagne",             flag: "🇪🇸", group: "H", colors: { primary: "#AA151B", secondary: "#F1BF00" }, mapId: 724 },
  CPV: { name: "Cap-Vert",            slug: "cap-vert",            flag: "🇨🇻", group: "H", colors: { primary: "#003893", secondary: "#F7D116" }, mapId: 132 },
  SAU: { name: "Arabie saoudite",     slug: "arabie-saoudite",     flag: "🇸🇦", group: "H", colors: { primary: "#006C35", secondary: "#FFFFFF" }, mapId: 682 },
  URY: { name: "Uruguay",             slug: "uruguay",             flag: "🇺🇾", group: "H", colors: { primary: "#5EB6E4", secondary: "#FFFFFF" }, mapId: 858 },

  // ── Groupe I ─────────────────────────────────────────────
  FRA: { name: "France",              slug: "france",              flag: "🇫🇷", group: "I", colors: { primary: "#002395", secondary: "#ED2939" }, mapId: 250 },
  IRQ: { name: "Irak",                slug: "irak",                flag: "🇮🇶", group: "I", colors: { primary: "#CE1126", secondary: "#007A3D" }, mapId: 368 },
  SEN: { name: "Sénégal",             slug: "senegal",             flag: "🇸🇳", group: "I", colors: { primary: "#00853F", secondary: "#E31B23" }, mapId: 686 },
  NOR: { name: "Norvège",             slug: "norvege",             flag: "🇳🇴", group: "I", colors: { primary: "#EF2B2D", secondary: "#002868" }, mapId: 578 },

  // ── Groupe J ─────────────────────────────────────────────
  ARG: { name: "Argentine",           slug: "argentine",           flag: "🇦🇷", group: "J", colors: { primary: "#74ACDF", secondary: "#FFFFFF" }, mapId: 32  },
  DZA: { name: "Algérie",             slug: "algerie",             flag: "🇩🇿", group: "J", colors: { primary: "#006233", secondary: "#D21034" }, mapId: 12  },
  AUT: { name: "Autriche",            slug: "autriche",            flag: "🇦🇹", group: "J", colors: { primary: "#ED2939", secondary: "#FFFFFF" }, mapId: 40  },
  JOR: { name: "Jordanie",            slug: "jordanie",            flag: "🇯🇴", group: "J", colors: { primary: "#007A3D", secondary: "#CE1126" }, mapId: 400 },

  // ── Groupe K ─────────────────────────────────────────────
  COD: { name: "RD Congo",            slug: "rd-congo",            flag: "🇨🇩", group: "K", colors: { primary: "#007FFF", secondary: "#CE1126" }, mapId: 180 },
  PRT: { name: "Portugal",            slug: "portugal",            flag: "🇵🇹", group: "K", colors: { primary: "#009460", secondary: "#FF0000" }, mapId: 620 },
  UZB: { name: "Ouzbékistan",         slug: "ouzbekistan",         flag: "🇺🇿", group: "K", colors: { primary: "#1EB53A", secondary: "#CE1126" }, mapId: 860 },
  COL: { name: "Colombie",            slug: "colombie",            flag: "🇨🇴", group: "K", colors: { primary: "#FCD116", secondary: "#003580" }, mapId: 170 },

  // ── Groupe L ─────────────────────────────────────────────
  ENG: { name: "Angleterre",          slug: "angleterre",          flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", group: "L", colors: { primary: "#CF142B", secondary: "#FFFFFF" }, mapId: 826 }, // représenté via UK
  HRV: { name: "Croatie",             slug: "croatie",             flag: "🇭🇷", group: "L", colors: { primary: "#FF0000", secondary: "#171796" }, mapId: 191 },
  GHA: { name: "Ghana",               slug: "ghana",               flag: "🇬🇭", group: "L", colors: { primary: "#006B3F", secondary: "#FCD116" }, mapId: 288 },
  PAN: { name: "Panama",              slug: "panama",              flag: "🇵🇦", group: "L", colors: { primary: "#DA121A", secondary: "#003580" }, mapId: 591 },
};

/** 12 groupes officiels A–L */
export const GROUPS: Record<string, string[]> = {
  A: ["MEX", "ZAF", "KOR", "CZE"],
  B: ["CAN", "QAT", "CHE", "BIH"],
  C: ["BRA", "MAR", "HTI", "SCO"],
  D: ["USA", "PRY", "AUS", "TUR"],
  E: ["DEU", "CUW", "CIV", "ECU"],
  F: ["NLD", "JPN", "TUN", "SWE"],
  G: ["BEL", "EGY", "IRN", "NZL"],
  H: ["ESP", "CPV", "SAU", "URY"],
  I: ["FRA", "IRQ", "SEN", "NOR"],
  J: ["ARG", "DZA", "AUT", "JOR"],
  K: ["COD", "PRT", "UZB", "COL"],
  L: ["ENG", "HRV", "GHA", "PAN"],
};

/** Lookup par slug URL */
export function getCountryBySlug(slug: string): ({ iso: string } & CountryData) | null {
  for (const [iso, data] of Object.entries(COUNTRIES)) {
    if (data.slug === slug) return { iso, ...data };
  }
  return null;
}

/** Tous les slugs (pour generateStaticParams si besoin) */
export function getAllCountrySlugs(): string[] {
  return Object.values(COUNTRIES).map((c) => c.slug);
}

/** Lookup par ID numérique ISO (pour la carte D3) */
export function getTeamByMapId(mapId: number): ({ iso: string } & CountryData) | null {
  for (const [iso, data] of Object.entries(COUNTRIES)) {
    if (data.mapId === null) continue;
    if (Array.isArray(data.mapId)) {
      if (data.mapId.includes(mapId)) return { iso, ...data };
    } else if (data.mapId === mapId) {
      return { iso, ...data };
    }
  }
  return null;
}
