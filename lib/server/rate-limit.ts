import "server-only";

/**
 * Límite de envíos por IP.
 * - Con Upstash Redis (UPSTASH_REDIS_REST_* o KV_REST_API_*, que crea la integración de Vercel)
 *   el contador se comparte entre todas las instancias y regiones.
 * - Sin Redis, cae a un contador en memoria que solo protege a cada instancia.
 * Complemento recomendado: regla de Vercel Firewall sobre /api/lead (ver PUBLICACION.md).
 */

const WINDOW_SECONDS = 10 * 60;
const MAX_PER_WINDOW = 5;

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

export const rateLimitBackend: "redis" | "memory" = url && token ? "redis" : "memory";

const memory = new Map<string, { count: number; resetAt: number }>();

function memoryHit(key: string): number {
  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || now > entry.resetAt) {
    memory.set(key, { count: 1, resetAt: now + WINDOW_SECONDS * 1000 });
    if (memory.size > 5000) {
      for (const [k, v] of memory) if (now > v.resetAt) memory.delete(k);
    }
    return 1;
  }
  entry.count += 1;
  return entry.count;
}

async function redisHit(key: string): Promise<number> {
  const res = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify([
      ["INCR", key],
      ["EXPIRE", key, String(WINDOW_SECONDS), "NX"],
    ]),
    signal: AbortSignal.timeout(2000),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`redis_${res.status}`);
  const json = (await res.json()) as { result?: unknown }[];
  const n = Number(json?.[0]?.result);
  if (!Number.isFinite(n)) throw new Error("redis_bad_response");
  return n;
}

/** Devuelve true si la IP superó el límite. Si Redis falla, usa memoria (nunca bloquea por error propio). */
export async function isRateLimited(ip: string): Promise<boolean> {
  const key = `pymemkt:lead:${ip}`;
  let count: number;
  if (rateLimitBackend === "redis") {
    try {
      count = await redisHit(key);
    } catch {
      count = memoryHit(key);
    }
  } else {
    count = memoryHit(key);
  }
  return count > MAX_PER_WINDOW;
}

/** IP del cliente según la plataforma (Vercel define x-real-ip y x-forwarded-for). */
export function clientIp(req: Request): string {
  return (
    req.headers.get("x-real-ip")?.trim() ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}
