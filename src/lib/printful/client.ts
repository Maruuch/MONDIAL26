import logger from "@/lib/utils/logger";

const PRINTFUL_BASE = "https://api.printful.com";
const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY!;
const PRINTFUL_STORE_ID = process.env.PRINTFUL_STORE_ID;

/**
 * Wrapper générique pour l'API Printful v2
 */
export async function printfulFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${PRINTFUL_BASE}${path}`;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${PRINTFUL_API_KEY}`,
    "Content-Type": "application/json",
    ...(PRINTFUL_STORE_ID ? { "X-PF-Store-Id": PRINTFUL_STORE_ID } : {}),
    ...(options.headers as Record<string, string> | undefined),
  };

  logger.debug({ method: options.method ?? "GET", url }, "Printful API call");

  const res = await fetch(url, { ...options, headers, cache: "no-store" });

  if (!res.ok) {
    const body = await res.text();
    logger.error({ status: res.status, body, url }, "Printful API error");
    throw new Error(`Printful API ${res.status}: ${body}`);
  }

  const json = await res.json();
  return json.result ?? json as T;
}
