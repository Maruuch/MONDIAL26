/**
 * Configuration des 48 équipes qualifiées FIFA World Cup 2026
 *
 * Chaque équipe dispose d'un dossier `teams/{ISO}/` dans le repo Git.
 * Les images d'emblèmes sont accessibles via GitHub raw URLs.
 *
 * Usage : getTeamEmblemUrl("FRA") → URL publique utilisable par Printful
 */

const GITHUB_RAW_BASE =
  process.env.GITHUB_RAW_BASE ??
  "https://raw.githubusercontent.com/your-org/football-2026/main";

// Extension par défaut des emblèmes (PNG recommandé)
const EMBLEM_EXT = process.env.EMBLEM_EXT ?? "png";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TeamInfo {
  iso: string;           // ISO 3166-1 alpha-3
  name: string;          // Nom affiché
  flag: string;          // Emoji drapeau
  confederation: "CONCACAF" | "CONMEBOL" | "UEFA" | "CAF" | "AFC" | "OFC";
}

// ─── Données équipes ──────────────────────────────────────────────────────────

export const TEAMS: TeamInfo[] = [
  // CONCACAF — 8 équipes (dont 3 hôtes USA, CAN, MEX)
  { iso: "USA", name: "États-Unis",     flag: "🇺🇸", confederation: "CONCACAF" },
  { iso: "CAN", name: "Canada",         flag: "🇨🇦", confederation: "CONCACAF" },
  { iso: "MEX", name: "Mexique",        flag: "🇲🇽", confederation: "CONCACAF" },
  { iso: "PAN", name: "Panama",         flag: "🇵🇦", confederation: "CONCACAF" },
  { iso: "JAM", name: "Jamaïque",       flag: "🇯🇲", confederation: "CONCACAF" },
  { iso: "HND", name: "Honduras",       flag: "🇭🇳", confederation: "CONCACAF" },
  { iso: "SLV", name: "El Salvador",    flag: "🇸🇻", confederation: "CONCACAF" },
  { iso: "CRC", name: "Costa Rica",     flag: "🇨🇷", confederation: "CONCACAF" },

  // CONMEBOL — 6 équipes
  { iso: "ARG", name: "Argentine",      flag: "🇦🇷", confederation: "CONMEBOL" },
  { iso: "BRA", name: "Brésil",         flag: "🇧🇷", confederation: "CONMEBOL" },
  { iso: "COL", name: "Colombie",       flag: "🇨🇴", confederation: "CONMEBOL" },
  { iso: "URU", name: "Uruguay",        flag: "🇺🇾", confederation: "CONMEBOL" },
  { iso: "ECU", name: "Équateur",       flag: "🇪🇨", confederation: "CONMEBOL" },
  { iso: "VEN", name: "Venezuela",      flag: "🇻🇪", confederation: "CONMEBOL" },

  // UEFA — 16 équipes
  { iso: "FRA", name: "France",         flag: "🇫🇷", confederation: "UEFA" },
  { iso: "ESP", name: "Espagne",        flag: "🇪🇸", confederation: "UEFA" },
  { iso: "ENG", name: "Angleterre",     flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", confederation: "UEFA" },
  { iso: "DEU", name: "Allemagne",      flag: "🇩🇪", confederation: "UEFA" },
  { iso: "PRT", name: "Portugal",       flag: "🇵🇹", confederation: "UEFA" },
  { iso: "ITA", name: "Italie",         flag: "🇮🇹", confederation: "UEFA" },
  { iso: "NLD", name: "Pays-Bas",       flag: "🇳🇱", confederation: "UEFA" },
  { iso: "BEL", name: "Belgique",       flag: "🇧🇪", confederation: "UEFA" },
  { iso: "HRV", name: "Croatie",        flag: "🇭🇷", confederation: "UEFA" },
  { iso: "CHE", name: "Suisse",         flag: "🇨🇭", confederation: "UEFA" },
  { iso: "AUT", name: "Autriche",       flag: "🇦🇹", confederation: "UEFA" },
  { iso: "TUR", name: "Turquie",        flag: "🇹🇷", confederation: "UEFA" },
  { iso: "SRB", name: "Serbie",         flag: "🇷🇸", confederation: "UEFA" },
  { iso: "POL", name: "Pologne",        flag: "🇵🇱", confederation: "UEFA" },
  { iso: "DNK", name: "Danemark",       flag: "🇩🇰", confederation: "UEFA" },
  { iso: "HUN", name: "Hongrie",        flag: "🇭🇺", confederation: "UEFA" },

  // CAF — 9 équipes
  { iso: "MAR", name: "Maroc",          flag: "🇲🇦", confederation: "CAF" },
  { iso: "SEN", name: "Sénégal",        flag: "🇸🇳", confederation: "CAF" },
  { iso: "EGY", name: "Égypte",         flag: "🇪🇬", confederation: "CAF" },
  { iso: "NGA", name: "Nigeria",        flag: "🇳🇬", confederation: "CAF" },
  { iso: "CMR", name: "Cameroun",       flag: "🇨🇲", confederation: "CAF" },
  { iso: "CIV", name: "Côte d'Ivoire",  flag: "🇨🇮", confederation: "CAF" },
  { iso: "GHA", name: "Ghana",          flag: "🇬🇭", confederation: "CAF" },
  { iso: "TUN", name: "Tunisie",        flag: "🇹🇳", confederation: "CAF" },
  { iso: "ALG", name: "Algérie",        flag: "🇩🇿", confederation: "CAF" },

  // AFC — 8 équipes
  { iso: "JPN", name: "Japon",          flag: "🇯🇵", confederation: "AFC" },
  { iso: "KOR", name: "Corée du Sud",   flag: "🇰🇷", confederation: "AFC" },
  { iso: "IRN", name: "Iran",           flag: "🇮🇷", confederation: "AFC" },
  { iso: "AUS", name: "Australie",      flag: "🇦🇺", confederation: "AFC" },
  { iso: "SAU", name: "Arabie Saoudite",flag: "🇸🇦", confederation: "AFC" },
  { iso: "IRQ", name: "Irak",           flag: "🇮🇶", confederation: "AFC" },
  { iso: "JOR", name: "Jordanie",       flag: "🇯🇴", confederation: "AFC" },
  { iso: "UZB", name: "Ouzbékistan",    flag: "🇺🇿", confederation: "AFC" },

  // OFC — 1 équipe
  { iso: "NZL", name: "Nouvelle-Zélande", flag: "🇳🇿", confederation: "OFC" },
];

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export const TEAMS_BY_ISO: Record<string, TeamInfo> = Object.fromEntries(
  TEAMS.map((t) => [t.iso, t])
);

/**
 * Retourne l'URL GitHub raw de l'emblème pour un pays donné.
 * Utilisée pour passer l'image à Printful lors de la création produit.
 *
 * @example getTeamEmblemUrl("FRA") → "https://raw.githubusercontent.com/.../teams/FRA/emblem.png"
 */
export function getTeamEmblemUrl(iso: string): string {
  return `${GITHUB_RAW_BASE}/teams/${iso.toUpperCase()}/emblem.${EMBLEM_EXT}`;
}

/**
 * Retourne l'URL d'un fichier de design pour un pays donné.
 * @param iso   Code ISO 3166-1 alpha-3
 * @param file  Nom du fichier : "emblem" | "file2" | "file3" | "file4"
 */
export function getTeamFileUrl(
  iso: string,
  file: "emblem" | "file2" | "file3" | "file4"
): string {
  const ext = file === "emblem" ? EMBLEM_EXT : EMBLEM_EXT;
  return `${GITHUB_RAW_BASE}/teams/${iso.toUpperCase()}/${file}.${ext}`;
}

export const TEAM_ISOS = TEAMS.map((t) => t.iso);
