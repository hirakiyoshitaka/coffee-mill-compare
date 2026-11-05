export type Fetcher = (input: string, init?: RequestInit) => Promise<Response>;

/** Official Ichiba Item Search API. Version 20260701. Do not call any other Rakuten URL. */
export const RAKUTEN_ICHIBA_SEARCH_ENDPOINT = "https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701";

export const RAKUTEN_MIN_INTERVAL_MS = 1000;

const ITEM_HOST = "item.rakuten.co.jp";
const SEGMENT = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;

export type RakutenSecrets = {
  applicationId?: string;
  accessKey?: string;
};

export type RakutenStock = "in_stock" | "out_of_stock" | "missing" | "unknown";

export type RakutenPacer = {
  wait: () => Promise<void>;
};

export function rakutenSecretsReady(secrets: RakutenSecrets | undefined): secrets is { applicationId: string; accessKey: string } {
  return Boolean(secrets?.applicationId?.trim() && secrets?.accessKey?.trim());
}

function itemCodeFromItemUrl(href: string): string | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  if (url.hostname.toLowerCase() !== ITEM_HOST) return null;
  const parts = url.pathname.split("/").filter(Boolean);
  const shop = parts[0] ?? "";
  const item = parts[1] ?? "";
  if (!SEGMENT.test(shop) || !SEGMENT.test(item)) return null;
  return `${shop}:${item}`;
}

/** Reads a shop:item code from an item page URL, or from the pc/m value of an affiliate URL. Does not fetch. */
export function rakutenItemCodeFromUrl(href: string): string | null {
  const candidates: string[] = [];
  try {
    const url = new URL(href);
    candidates.push(href);
    for (const key of ["pc", "m"]) {
      const value = url.searchParams.get(key);
      if (!value) continue;
      candidates.push(value);
      try {
        const decoded = decodeURIComponent(value);
        if (decoded !== value) candidates.push(decoded);
      } catch {
        // searchParams already decoded the value once.
      }
    }
  } catch {
    return null;
  }
  for (const candidate of candidates) {
    const code = itemCodeFromItemUrl(candidate);
    if (code) return code;
  }
  return null;
}

export function buildRakutenSearchRequest(
  itemCode: string,
  applicationId: string,
  accessKey: string,
  origin?: string,
): { url: string; headers: Record<string, string> } {
  const appId = applicationId.trim();
  const key = accessKey.trim();
  if (!appId || !key) throw new Error("Rakuten API secrets are empty");
  const url = new URL(RAKUTEN_ICHIBA_SEARCH_ENDPOINT);
  url.searchParams.set("applicationId", appId);
  url.searchParams.set("itemCode", itemCode);
  url.searchParams.set("format", "json");
  url.searchParams.set("formatVersion", "2");
  url.searchParams.set("availability", "0");
  url.searchParams.set("hits", "1");
  if (url.searchParams.has("affiliateId") || url.searchParams.has("accessKey")) {
    throw new Error("refusing to send affiliateId or accessKey on the URL");
  }
  const href = url.toString();
  if (href.includes(key)) throw new Error("refusing to put the access key in the URL");
  const headers: Record<string, string> = {
    accept: "application/json",
    accessKey: key,
  };
  if (origin) {
    try {
      const site = new URL(origin);
      if (site.protocol === "https:" || site.protocol === "http:") {
        headers.origin = site.origin;
        headers.referer = `${site.origin}/`;
      }
    } catch {
      // A bad origin is ignored. The API still needs the two secrets.
    }
  }
  return { url: href, headers };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function availabilityValue(value: unknown): RakutenStock | null {
  if (value === 1 || value === "1") return "in_stock";
  if (value === 0 || value === "0") return "out_of_stock";
  return null;
}

export function readRakutenStock(body: unknown): RakutenStock {
  if (!isRecord(body)) return "unknown";
  if (typeof body.error === "string") return "unknown";
  const items = Array.isArray(body.Items) ? body.Items : Array.isArray(body.items) ? body.items : [];
  const count = typeof body.count === "number" ? body.count : items.length;
  if (count === 0 || items.length === 0) return "missing";
  const entry = items[0];
  const item = isRecord(entry) && isRecord(entry.Item) ? entry.Item : isRecord(entry) && isRecord(entry.item) ? entry.item : entry;
  if (!isRecord(item)) return "unknown";
  return availabilityValue(item.availability) ?? "unknown";
}

export function createRakutenPacer(options?: {
  now?: () => number;
  sleep?: (ms: number) => Promise<void>;
  intervalMs?: number;
}): RakutenPacer {
  const now = options?.now ?? (() => Date.now());
  const sleep = options?.sleep ?? ((ms: number) => new Promise((resolve) => setTimeout(resolve, ms)));
  const intervalMs = Math.max(RAKUTEN_MIN_INTERVAL_MS, options?.intervalMs ?? RAKUTEN_MIN_INTERVAL_MS);
  let lastAt = Number.NEGATIVE_INFINITY;
  let tail: Promise<void> = Promise.resolve();

  return {
    wait() {
      const run = tail.then(async () => {
        const delay = lastAt - now() + intervalMs;
        if (delay > 0) await sleep(delay);
        lastAt = now();
      });
      tail = run.then(
        () => undefined,
        () => undefined,
      );
      return run;
    },
  };
}

export async function checkRakutenStock(input: {
  itemCode: string;
  applicationId: string;
  accessKey: string;
  origin?: string;
  fetchImpl: Fetcher;
  timeoutMs: number;
  pacer: RakutenPacer;
}): Promise<{ ok: true } | { ok: false; kind: "rakuten_unavailable" | "rakuten_api_error" | "blocked"; status?: number; detail: string }> {
  let request: { url: string; headers: Record<string, string> };
  try {
    request = buildRakutenSearchRequest(input.itemCode, input.applicationId, input.accessKey, input.origin);
  } catch {
    return { ok: false, kind: "rakuten_api_error", detail: "Rakuten API request was not sent" };
  }

  const endpoint = new URL(request.url);
  if (endpoint.protocol !== "https:" || endpoint.hostname !== "openapi.rakuten.co.jp") {
    return { ok: false, kind: "rakuten_api_error", detail: "Rakuten API request was not sent" };
  }
  if (endpoint.pathname !== "/ichibams/api/IchibaItem/Search/20260701") {
    return { ok: false, kind: "rakuten_api_error", detail: "Rakuten API request was not sent" };
  }

  await input.pacer.wait();

  let res: Response;
  try {
    res = await input.fetchImpl(request.url, {
      method: "GET",
      redirect: "manual",
      headers: request.headers,
      signal: AbortSignal.timeout(input.timeoutMs),
    });
  } catch {
    return { ok: false, kind: "rakuten_api_error", detail: "Rakuten API request failed" };
  }

  if (res.status >= 300 && res.status < 400) {
    await res.body?.cancel();
    return { ok: false, kind: "rakuten_api_error", status: res.status, detail: "Rakuten API redirect was not followed" };
  }
  if (res.status === 404) {
    await res.body?.cancel();
    return { ok: false, kind: "rakuten_unavailable", status: 404, detail: "Ichiba search has no item" };
  }
  if (res.status === 429) {
    await res.body?.cancel();
    return { ok: false, kind: "blocked", status: 429, detail: "Rakuten API rate limit" };
  }
  if (!res.ok) {
    await res.body?.cancel();
    return { ok: false, kind: "rakuten_api_error", status: res.status, detail: `Rakuten API HTTP ${res.status}` };
  }

  let stock: RakutenStock = "unknown";
  try {
    const text = (await res.text()).slice(0, 100_000);
    stock = readRakutenStock(JSON.parse(text) as unknown);
  } catch {
    return { ok: false, kind: "rakuten_api_error", status: res.status, detail: "Rakuten API response was not readable" };
  }

  if (stock === "in_stock") return { ok: true };
  if (stock === "out_of_stock") return { ok: false, kind: "rakuten_unavailable", status: res.status, detail: "availability 0" };
  if (stock === "missing") return { ok: false, kind: "rakuten_unavailable", status: res.status, detail: "Ichiba search has no item" };
  return { ok: false, kind: "rakuten_api_error", status: res.status, detail: "availability was missing" };
}
