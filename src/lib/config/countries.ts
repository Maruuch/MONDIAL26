/**
 * Données complètes des 48 équipes qualifiées FIFA World Cup 2026
 * - Nom anglais officiel
 * - Slogan en langue locale (sans ! final)
 * - Couleur primaire + secondaire (hex)
 */

export interface CountryData {
  iso: string;
  name: string;          // Nom en anglais
  slogan: string;        // Slogan langue locale
  primary: string;       // Couleur primaire (hex)
  secondary: string;     // Couleur secondaire (hex)
}

export const COUNTRIES: CountryData[] = [
  // ── CONCACAF ──────────────────────────────────────────────────────────────
  { iso: "US", name: "United States",          slogan: "USA! USA",                            primary: "#B22234", secondary: "#3C3B6E" },
  { iso: "CA", name: "Canada",                 slogan: "Go Canada Go",                        primary: "#FF0000", secondary: "#D4AF37" },
  { iso: "MX", name: "Mexico",                 slogan: "¡Vamos México",                       primary: "#006847", secondary: "#CE1126" },
  { iso: "PA", name: "Panama",                 slogan: "¡Vamos Panamá",                       primary: "#DA121A", secondary: "#1C4B9D" },
  { iso: "HT", name: "Haiti",                  slogan: "Ann ale Ayiti",                       primary: "#00209F", secondary: "#D21034" },
  { iso: "CW", name: "Curaçao",               slogan: "Kòrsou, laga nos bai",                primary: "#002B7F", secondary: "#F1B02A" },

  // ── CONMEBOL ──────────────────────────────────────────────────────────────
  { iso: "AR", name: "Argentina",              slogan: "¡Vamos Argentina",                    primary: "#74ACDF", secondary: "#F6B40E" },
  { iso: "BR", name: "Brazil",                 slogan: "Vai Brasil",                          primary: "#009C3B", secondary: "#FFDF00" },
  { iso: "CO", name: "Colombia",               slogan: "¡Vamos Colombia",                     primary: "#FCD116", secondary: "#CE1126" },
  { iso: "EC", name: "Ecuador",                slogan: "¡Vamos Ecuador",                      primary: "#FFD100", secondary: "#003DA5" },
  { iso: "PY", name: "Paraguay",               slogan: "¡Vamos Paraguay",                     primary: "#D52B1E", secondary: "#0038A8" },
  { iso: "UY", name: "Uruguay",                slogan: "¡Vamos Uruguay",                      primary: "#0038A8", secondary: "#F6B40E" },

  // ── UEFA ──────────────────────────────────────────────────────────────────
  { iso: "AT", name: "Austria",                slogan: "Auf geht's Österreich",               primary: "#ED2939", secondary: "#C8941A" },
  { iso: "BE", name: "Belgium",                slogan: "Allez les Diables",                   primary: "#EF3340", secondary: "#FAE042" },
  { iso: "BA", name: "Bosnia and Herzegovina", slogan: "Idemo Zmajevi",                       primary: "#002395", secondary: "#FBBC04" },
  { iso: "HR", name: "Croatia",                slogan: "Idemo Hrvatska",                      primary: "#FF0000", secondary: "#0093DD" },
  { iso: "CZ", name: "Czechia",                slogan: "Do toho, Česko",                      primary: "#D7141A", secondary: "#11457E" },
  { iso: "EN", name: "England",                slogan: "Come on England",                     primary: "#CF091A", secondary: "#012169" },
  { iso: "FR", name: "France",                 slogan: "Allez les Bleus",                     primary: "#002395", secondary: "#ED2939" },
  { iso: "DE", name: "Germany",                slogan: "Auf geht's Deutschland",              primary: "#DD0000", secondary: "#FFCC00" },
  { iso: "NL", name: "Netherlands",            slogan: "Hup Holland Hup",                     primary: "#FF6600", secondary: "#003087" },
  { iso: "NO", name: "Norway",                 slogan: "Heia Norge",                          primary: "#EF2B2D", secondary: "#002868" },
  { iso: "PT", name: "Portugal",               slogan: "Força Portugal",                      primary: "#006600", secondary: "#FF0000" },
  { iso: "SC", name: "Scotland",               slogan: "Come on Scotland",                    primary: "#003DA5", secondary: "#FFD700" },
  { iso: "ES", name: "Spain",                  slogan: "¡Vamos España",                       primary: "#AA151B", secondary: "#F1BF00" },
  { iso: "SE", name: "Sweden",                 slogan: "Heja Sverige",                        primary: "#006AA7", secondary: "#FECC02" },
  { iso: "CH", name: "Switzerland",            slogan: "Hopp Schwiiz",                        primary: "#FF0000", secondary: "#C8941A" },
  { iso: "TR", name: "Türkiye",                slogan: "Haydi Türkiye",                       primary: "#E30A17", secondary: "#C8941A" },

  // ── CAF ───────────────────────────────────────────────────────────────────
  { iso: "DZ", name: "Algeria",                slogan: "ديما الخضرا",                         primary: "#006233", secondary: "#D21034" },
  { iso: "ZA", name: "South Africa",           slogan: "Bafana Bafana",                       primary: "#007A4D", secondary: "#FFB81C" },
  { iso: "CV", name: "Cape Verde",             slogan: "Força Cabo Verde",                    primary: "#003893", secondary: "#CF2027" },
  { iso: "CI", name: "Ivory Coast",            slogan: "Allez les Éléphants",                 primary: "#F77F00", secondary: "#009A00" },
  { iso: "EG", name: "Egypt",                  slogan: "تحيا مصر",                           primary: "#CE1126", secondary: "#C8941A" },
  { iso: "GH", name: "Ghana",                  slogan: "Go Black Stars",                      primary: "#FCD116", secondary: "#006B3F" },
  { iso: "MA", name: "Morocco",                slogan: "ديما مغرب",                           primary: "#C1272D", secondary: "#006233" },
  { iso: "CD", name: "DR Congo",               slogan: "Allez les Léopards",                  primary: "#007FFF", secondary: "#CE1126" },
  { iso: "SN", name: "Senegal",                slogan: "Allez Sénégal",                       primary: "#00853F", secondary: "#FDEF42" },
  { iso: "TN", name: "Tunisia",                slogan: "يلا تونس",                            primary: "#E70013", secondary: "#C8941A" },

  // ── AFC ───────────────────────────────────────────────────────────────────
  { iso: "JP", name: "Japan",                  slogan: "日本、行こう",                           primary: "#BC002D", secondary: "#000000" },
  { iso: "IR", name: "Iran",                   slogan: "ایران، ایران",                         primary: "#239F40", secondary: "#DA0000" },
  { iso: "UZ", name: "Uzbekistan",             slogan: "Olgʻa, Oʻzbekiston",                  primary: "#009AD6", secondary: "#1EB53A" },
  { iso: "KR", name: "South Korea",            slogan: "대한민국",                              primary: "#CD2E3A", secondary: "#003478" },
  { iso: "JO", name: "Jordan",                 slogan: "يلا الأردن",                          primary: "#CE1126", secondary: "#007A3D" },
  { iso: "AU", name: "Australia",              slogan: "Aussie Aussie Aussie, Oi Oi Oi",      primary: "#00843D", secondary: "#FFD100" },
  { iso: "SA", name: "Saudi Arabia",           slogan: "يلا السعودية",                        primary: "#006C35", secondary: "#C8941A" },
  { iso: "QA", name: "Qatar",                  slogan: "يلا قطر",                             primary: "#8D1B3D", secondary: "#C8941A" },

  // ── PLAYOFFS ──────────────────────────────────────────────────────────────
  { iso: "IQ", name: "Iraq",                   slogan: "يلا العراق",                          primary: "#CE1126", secondary: "#007A3D" },

  // ── OFC ───────────────────────────────────────────────────────────────────
  { iso: "NZ", name: "New Zealand",            slogan: "Go New Zealand",                      primary: "#00247D", secondary: "#CC142B" },
];

export const COUNTRIES_BY_ISO: Record<string, CountryData> = Object.fromEntries(
  COUNTRIES.map((c) => [c.iso, c])
);
