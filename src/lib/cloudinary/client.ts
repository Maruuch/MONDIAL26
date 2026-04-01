/**
 * Cloudinary — Upload et gestion des assets design
 *
 * Convention URL :
 *   https://res.cloudinary.com/<cloud>/image/upload/football2026/<ISO>/<ISO>-<design>-2026-master.png
 *
 * Règles :
 *   - 1 master artwork par design family
 *   - PNG transparent, 300 DPI minimum
 *   - assetChecksum (SHA-256 du fichier source) pour idempotence
 *   - Overwrite uniquement si checksum différent
 */

import crypto from "crypto";
import logger from "@/lib/utils/logger";

const CLOUDINARY_CLOUD = process.env.CLOUDINARY_CLOUD_NAME!;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY!;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET!;
const CLOUDINARY_BASE = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}`;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UploadResult {
  public_id: string;
  secure_url: string;
  asset_id: string;
  format: string;
  width: number;
  height: number;
  checksum: string;           // SHA-256 du fichier source (stocké en tag)
  already_existed: boolean;   // true si idempotent (même checksum, pas re-uploadé)
}

interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  asset_id: string;
  format: string;
  width: number;
  height: number;
  tags: string[];
}

// ─── URL convention ───────────────────────────────────────────────────────────

/**
 * Génère le public_id Cloudinary selon la convention Football 2026
 * Exemple : football2026/FRA/FRA-D1-2026-master
 */
export function buildCloudinaryPublicId(iso: string, design: string): string {
  return `football2026/${iso.toUpperCase()}/${iso.toUpperCase()}-${design}-2026-master`;
}

/**
 * Génère l'URL publique Cloudinary à partir du public_id
 */
export function buildCloudinaryUrl(iso: string, design: string): string {
  const publicId = buildCloudinaryPublicId(iso, design);
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/${publicId}.png`;
}

// ─── Checksum ─────────────────────────────────────────────────────────────────

/**
 * Calcule le SHA-256 d'un buffer
 */
export function computeChecksum(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

/**
 * Récupère le checksum stocké dans les tags d'un asset Cloudinary existant
 * Format tag : "checksum_<sha256hex>"
 */
async function getExistingChecksum(publicId: string): Promise<string | null> {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const toSign = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
    const signature = crypto.createHash("sha1").update(toSign).digest("hex");

    const url = new URL(`${CLOUDINARY_BASE}/resources/image/upload`);
    url.searchParams.set("public_ids[]", publicId);

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Basic ${Buffer.from(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`).toString("base64")}`,
      },
    });

    if (!res.ok) return null;
    const data = await res.json() as { resources?: Array<{ tags?: string[] }> };
    const resource = data.resources?.[0];
    if (!resource) return null;

    const checksumTag = resource.tags?.find((t) => t.startsWith("checksum_"));
    return checksumTag ? checksumTag.replace("checksum_", "") : null;
  } catch {
    return null;
  }
}

// ─── Upload principal ─────────────────────────────────────────────────────────

/**
 * Upload idempotent d'un design sur Cloudinary.
 *
 * @param sourceUrl  URL Figma export ou chemin local
 * @param iso        Code ISO 3 lettres
 * @param design     Code design (D1-D4)
 * @param fileBuffer Buffer du fichier source (pour calcul checksum)
 */
export async function uploadDesignToCloudinary(params: {
  sourceUrl: string;
  iso: string;
  design: string;
  fileBuffer: Buffer;
}): Promise<UploadResult> {
  const { sourceUrl, iso, design, fileBuffer } = params;
  const publicId = buildCloudinaryPublicId(iso, design);
  const checksum = computeChecksum(fileBuffer);

  // ─ Idempotence : vérifier si l'asset existe avec le même checksum
  const existingChecksum = await getExistingChecksum(publicId);
  if (existingChecksum === checksum) {
    logger.info({ publicId, checksum }, "Cloudinary: asset identique, skip upload");
    return {
      public_id: publicId,
      secure_url: buildCloudinaryUrl(iso, design),
      asset_id: "",
      format: "png",
      width: 0,
      height: 0,
      checksum,
      already_existed: true,
    };
  }

  // ─ Upload
  const timestamp = Math.floor(Date.now() / 1000);
  const tags = [
    "football2026",
    "fan-made",
    iso.toUpperCase(),
    design,
    `checksum_${checksum}`,   // Stockage du checksum pour idempotence future
  ].join(",");

  const toSign = [
    `folder=football2026/${iso.toUpperCase()}`,
    `overwrite=true`,
    `public_id=${publicId}`,
    `tags=${tags}`,
    `timestamp=${timestamp}`,
  ].join("&") + CLOUDINARY_API_SECRET;

  const signature = crypto.createHash("sha1").update(toSign).digest("hex");

  const formData = new FormData();
  formData.append("file", sourceUrl);
  formData.append("public_id", publicId);
  formData.append("folder", `football2026/${iso.toUpperCase()}`);
  formData.append("overwrite", "true");
  formData.append("tags", tags);
  formData.append("timestamp", String(timestamp));
  formData.append("api_key", CLOUDINARY_API_KEY);
  formData.append("signature", signature);
  // Assurer PNG transparent haute résolution
  formData.append("format", "png");
  formData.append("quality", "100");

  logger.info({ publicId, checksum }, "Cloudinary: uploading design");

  const res = await fetch(`${CLOUDINARY_BASE}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    logger.error({ status: res.status, err, publicId }, "Cloudinary upload failed");
    throw new Error(`Cloudinary upload failed: ${err}`);
  }

  const data = await res.json() as CloudinaryUploadResponse;

  logger.info(
    { publicId: data.public_id, url: data.secure_url },
    "Cloudinary: upload successful"
  );

  return {
    public_id: data.public_id,
    secure_url: data.secure_url,
    asset_id: data.asset_id,
    format: data.format,
    width: data.width,
    height: data.height,
    checksum,
    already_existed: false,
  };
}
