/**
 * Configuration des 48 équipes qualifiées FIFA World Cup 2026
 *
 * Codes ISO 3166-1 alpha-2 (2 caractères : FR, DE, BR…)
 * Structure git : teams/{ISO}/emblem/emblem_{ISO}.png
 *
 * @example getTeamEmblemUrl("FR")
 * → "https://raw.githubusercontent.com/Maruuch/MONDIAL26/main/teams/FR/emblem/emblem_FR.png"
 */

const GITHUB_RAW_BASE =
  process.env.GITHUB_RAW_BASE ??
  "https://raw.githubusercontent.com/Maruuch/MONDIAL26/main";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TeamInfo {
  iso: string;         // ISO 3166-1 alpha-2 (2 chars)
  name: string;        // Nom affiché
  flag: string;        // Emoji drapeau
  confederation: "CONCACAF" | "CONMEBOL" | "UEFA" | "CAF" | "AFC" | "OFC";
}

// ─── Données équipes ──────────────────────────────────────────────────────────

export const TEAMS: TeamInfo[] = [
  // CONCACAF — 8 équipes (dont hôtes US, CA, MX)
  { iso: "US", name: "États-Unis",      flag: "🇺🇸", confederation: "CONCACAF" },
  { iso: "CA", name: "Canada",          flag: "🇨🇦", confederation: "CONCACAF" },
  { iso: "MX", name: "Mexique",         flag: "🇲🇽", confederation: "CONCACAF" },
  { iso: "PA", name: "Panama",          flag: "🇵🇦", confederation: "CONCACAF" },
  { iso: "JM", name: "Jamaïque",        flag: "🇯🇲", confederation: "CONCACAF" },
  { iso: "HN", name: "Honduras",        flag: "🇭🇳", confederation: "CONCACAF" },
  { iso: "SV", name: "El Salvador",     flag: "🇸🇻", confederation: "CONCACAF" },
  { iso: "CR", name: "Costa Rica",      flag: "🇨🇷", confederation: "CONCACAF" },

  // CONMEBOL — 6 équipes
  { iso: "AR", name: "Argentine",       flag: "🇦🇷", confederation: "CONMEBOL" },
  { iso: "BR", name: "Brésil",          flag: "🇧🇷", confederation: "CONMEBOL" },
  { iso: "CO", name: "Colombie",        flag: "🇨🇴", confederation: "CONMEBOL" },
  { iso: "UY", name: "Uruguay",         flag: "🇺🇾", confederation: "CONMEBOL" },
  { iso: "EC", name: "Équateur",        flag: "🇪🇨", confederation: "CONMEBOL" },
  { iso: "VE", name: "Venezuela",       flag: "🇻🇪", confederation: "CONMEBOL" },

  // UEFA — 16 équipes
  { iso: "FR", name: "France",          flag: "🇫🇷", confederation: "UEFA" },
  { iso: "ES", name: "Espagne",         flag: "🇪🇸", confederation: "UEFA" },
  { iso: "EN", name: "Angleterre",      flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", confederation: "UEFA" },
  { iso: "DE", name: "Allemagne",       flag: "🇩🇪", confederation: "UEFA" },
  { iso: "PT", name: "Portugal",        flag: "🇵🇹", confederation: "UEFA" },
  { iso: "IT", name: "Italie",          flag: "🇮🇹", confederation: "UEFA" },
  { iso: "NL", name: "Pays-Bas",        flag: "🇳🇱", confederation: "UEFA" },
  { iso: "BE", name: "Belgique",        flag: "🇧🇪", confederation: "UEFA" },
  { iso: "HR", name: "Croatie",         flag: "🇭🇷", confederation: "UEFA" },
  { iso: "CH", name: "Suisse",          flag: "🇨🇭", confederation: "UEFA" },
  { iso: "AT", name: "Autriche",        flag: "🇦🇹", confederation: "UEFA" },
  { iso: "TR", name: "Turquie",         flag: "🇹🇷", confederation: "UEFA" },
  { iso: "RS", name: "Serbie",          flag: "🇷🇸", confederation: "UEFA" },
  { iso: "PL", name: "Pologne",         flag: "🇵🇱", confederation: "UEFA" },
  { iso: "DK", name: "Danemark",        flag: "🇩🇰", confederation: "UEFA" },
  { iso: "HU", name: "Hongrie",         flag: "🇭🇺", confederation: "UEFA" },

  // CAF — 9 équipes
  { iso: "MA", name: "Maroc",           flag: "🇲🇦", confederation: "CAF" },
  { iso: "SN", name: "Sénégal",         flag: "🇸🇳", confederation: "CAF" },
  { iso: "EG", name: "Égypte",          flag: "🇪🇬", confederation: "CAF" },
  { iso: "NG", name: "Nigeria",         flag: "🇳🇬", confederation: "CAF" },
  { iso: "CM", name: "Cameroun",        flag: "🇨🇲", confederation: "CAF" },
  { iso: "CI", name: "Côte d'Ivoire",   flag: "🇨🇮", confederation: "CAF" },
  { iso: "GH", name: "Ghana",           flag: "🇬🇭", confederation: "CAF" },
  { iso: "TN", name: "Tunisie",         flag: "🇹🇳", confederation: "CAF" },
  { iso: "DZ", name: "Algérie",         flag: "🇩🇿", confederation: "CAF" },

  // AFC — 8 équipes
  { iso: "JP", name: "Japon",           flag: "🇯🇵", confederation: "AFC" },
  { iso: "KR", name: "Corée du Sud",    flag: "🇰🇷", confederation: "AFC" },
  { iso: "IR", name: "Iran",            flag: "🇮🇷", confederation: "AFC" },
  { iso: "AU", name: "Australie",       flag: "🇦🇺", confederation: "AFC" },
  { iso: "SA", name: "Arabie Saoudite", flag: "🇸🇦", confederation: "AFC" },
  { iso: "IQ", name: "Irak",            flag: "🇮🇶", confederation: "AFC" },
  { iso: "JO", name: "Jordanie",        flag: "🇯🇴", confederation: "AFC" },
  { iso: "UZ", name: "Ouzbékistan",     flag: "🇺🇿", confederation: "AFC" },

  // OFC — 1 équipe
  { iso: "NZ", name: "Nouvelle-Zélande", flag: "🇳🇿", confederation: "OFC" },
];

// ─── Lookups ──────────────────────────────────────────────────────────────────

export const TEAMS_BY_ISO: Record<string, TeamInfo> = Object.fromEntries(
  TEAMS.map((t) => [t.iso, t])
);

export const TEAM_ISOS = TEAMS.map((t) => t.iso);

// ─── URL helpers ──────────────────────────────────────────────────────────────

/**
 * URL GitHub brute de l'emblème pour un pays.
 * Le fichier doit être déposé sous : teams/{ISO}/emblem/emblem_{ISO}.png
 */
export function getTeamEmblemUrl(iso: string): string {
  const code = iso.toUpperCase();
  return `${GITHUB_RAW_BASE}/teams/${code}/emblem/emblem_${code}.png`;
}

/**
 * URL GitHub brute d'un fichier de design pour un pays.
 * @param iso   Code ISO alpha-2 (ex: "FR")
 * @param slot  "emblem" | "file2" | "file3" | "file4"
 * @param filename  Nom du fichier sans chemin (ex: "emblem_FR.png")
 */
export function getTeamFileUrl(
  iso: string,
  slot: "emblem" | "file2" | "file3" | "file4",
  filename: string
): string {
  return `${GITHUB_RAW_BASE}/teams/${iso.toUpperCase()}/${slot}/${filename}`;
}
