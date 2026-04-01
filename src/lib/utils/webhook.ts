import crypto from "crypto";
import logger from "./logger";

/**
 * Vérifie la signature HMAC-SHA256 d'un webhook entrant
 * @param rawBody   - Corps brut de la requête (Buffer ou string)
 * @param signature - Header de signature (ex: x-hub-signature-256 ou x-n8n-signature)
 * @param secret    - Secret partagé
 * @param prefix    - Préfixe éventuel (ex: "sha256=")
 */
export function verifyHMAC(
  rawBody: Buffer | string,
  signature: string,
  secret: string,
  prefix = ""
): boolean {
  try {
    const body = typeof rawBody === "string" ? Buffer.from(rawBody) : rawBody;
    const expected = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    const provided = signature.startsWith(prefix)
      ? signature.slice(prefix.length)
      : signature;

    // Comparaison en temps constant — anti timing attack
    return crypto.timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(provided, "hex")
    );
  } catch (err) {
    logger.error({ err }, "HMAC verification error");
    return false;
  }
}

/**
 * Génère une signature HMAC-SHA256 (pour les appels sortants vers n8n)
 */
export function signPayload(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}
