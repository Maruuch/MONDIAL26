/**
 * Configuration des 48 équipes qualifiées FIFA World Cup 2026
 * Codes ISO 3166-1 alpha-2 (2 caractères)
 * Structure git : teams/{ISO}/emblem/emblem_{ISO}.png
 */

const GITHUB_RAW_BASE =
  process.env.GITHUB_RAW_BASE ??
  "https://raw.githubusercontent.com/Maruuch/MONDIAL26/main";

export interface TeamInfo {
  iso: string;
  name: string;
  flag: string;
  confederation: "CONCACAF" | "CONMEBOL" | "UEFA" | "CAF" | "AFC" | "OFC" | "PLAYOFF";
}

export const TEAMS: TeamInfo[] = [
  // CONCACAF — 6 équipes (dont hôtes US, CA, MX)
  { iso: "US", name: "États-Unis",           flag: "🇺🇸", confederation: "CONCACAF" },
  { iso: "CA", name: "Canada",               flag: "🇨🇦", confederation: "CONCACAF" },
  { iso: "MX", name: "Mexique",              flag: "🇲🇽", confederation: "CONCACAF" },
  { iso: "PA", name: "Panama",               flag: "🇵🇦", confederation: "CONCACAF" },
  { iso: "CW", name: "Curaçao",              flag: "🇨🇼", confederation: "CONCACAF" },
  { iso: "HT", name: "Haïti",               flag: "🇭🇹", confederation: "CONCACAF" },

  // CONMEBOL — 6 équipes
  { iso: "AR", name: "Argentine",            flag: "🇦🇷", confederation: "CONMEBOL" },
  { iso: "BR", name: "Brésil",               flag: "🇧🇷", confederation: "CONMEBOL" },
  { iso: "CO", name: "Colombie",             flag: "🇨🇴", confederation: "CONMEBOL" },
  { iso: "UY", name: "Uruguay",              flag: "🇺🇾", confederation: "CONMEBOL" },
  { iso: "EC", name: "Équateur",             flag: "🇪🇨", confederation: "CONMEBOL" },
  { iso: "PY", name: "Paraguay",             flag: "🇵🇾", confederation: "CONMEBOL" },

  // UEFA — 16 équipes
  { iso: "FR", name: "France",               flag: "🇫🇷", confederation: "UEFA" },
  { iso: "ES", name: "Espagne",              flag: "🇪🇸", confederation: "UEFA" },
  { iso: "EN", name: "Angleterre",           flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", confederation: "UEFA" },
  { iso: "DE", name: "Allemagne",            flag: "🇩🇪", confederation: "UEFA" },
  { iso: "PT", name: "Portugal",             flag: "🇵🇹", confederation: "UEFA" },
  { iso: "NL", name: "Pays-Bas",             flag: "🇳🇱", confederation: "UEFA" },
  { iso: "BE", name: "Belgique",             flag: "🇧🇪", confederation: "UEFA" },
  { iso: "HR", name: "Croatie",              flag: "🇭🇷", confederation: "UEFA" },
  { iso: "CH", name: "Suisse",               flag: "🇨🇭", confederation: "UEFA" },
  { iso: "AT", name: "Autriche",             flag: "🇦🇹", confederation: "UEFA" },
  { iso: "TR", name: "Turquie",              flag: "🇹🇷", confederation: "UEFA" },
  { iso: "SE", name: "Suède",               flag: "🇸🇪", confederation: "UEFA" },
  { iso: "NO", name: "Norvège",              flag: "🇳🇴", confederation: "UEFA" },
  { iso: "SC", name: "Écosse",              flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", confederation: "UEFA" },
  { iso: "BA", name: "Bosnie-Herzégovine",   flag: "🇧🇦", confederation: "UEFA" },
  { iso: "CZ", name: "Tchéquie",             flag: "🇨🇿", confederation: "UEFA" },

  // CAF — 9 équipes
  { iso: "MA", name: "Maroc",               flag: "🇲🇦", confederation: "CAF" },
  { iso: "SN", name: "Sénégal",             flag: "🇸🇳", confederation: "CAF" },
  { iso: "EG", name: "Égypte",              flag: "🇪🇬", confederation: "CAF" },
  { iso: "GH", name: "Ghana",               flag: "🇬🇭", confederation: "CAF" },
  { iso: "CI", name: "Côte d'Ivoire",       flag: "🇨🇮", confederation: "CAF" },
  { iso: "TN", name: "Tunisie",             flag: "🇹🇳", confederation: "CAF" },
  { iso: "DZ", name: "Algérie",             flag: "🇩🇿", confederation: "CAF" },
  { iso: "CV", name: "Cap-Vert",            flag: "🇨🇻", confederation: "CAF" },
  { iso: "ZA", name: "Afrique du Sud",      flag: "🇿🇦", confederation: "CAF" },

  // AFC — 8 équipes
  { iso: "JP", name: "Japon",               flag: "🇯🇵", confederation: "AFC" },
  { iso: "KR", name: "Corée du Sud",        flag: "🇰🇷", confederation: "AFC" },
  { iso: "IR", name: "Iran",                flag: "🇮🇷", confederation: "AFC" },
  { iso: "AU", name: "Australie",           flag: "🇦🇺", confederation: "AFC" },
  { iso: "SA", name: "Arabie Saoudite",     flag: "🇸🇦", confederation: "AFC" },
  { iso: "JO", name: "Jordanie",            flag: "🇯🇴", confederation: "AFC" },
  { iso: "UZ", name: "Ouzbékistan",         flag: "🇺🇿", confederation: "AFC" },
  { iso: "QA", name: "Qatar",               flag: "🇶🇦", confederation: "AFC" },

  // Playoffs intercontinentaux — 2 équipes
  { iso: "IQ", name: "Irak",                flag: "🇮🇶", confederation: "PLAYOFF" },
  { iso: "CD", name: "RD Congo",            flag: "🇨🇩", confederation: "PLAYOFF" },

  // OFC — 1 équipe
  { iso: "NZ", name: "Nouvelle-Zélande",    flag: "🇳🇿", confederation: "OFC" },
];

export const TEAMS_BY_ISO: Record<string, TeamInfo> = Object.fromEntries(
  TEAMS.map((t) => [t.iso, t])
);

export const TEAM_ISOS = TEAMS.map((t) => t.iso);

/** URL GitHub brute de l'emblème : teams/{ISO}/emblem/emblem_{ISO}.png */
export function getTeamEmblemUrl(iso: string): string {
  const code = iso.toUpperCase();
  return `${GITHUB_RAW_BASE}/teams/${code}/emblem/emblem_${code}.png`;
}
