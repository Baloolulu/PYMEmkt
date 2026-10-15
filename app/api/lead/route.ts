import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/config";
import { parseLeadRequest } from "@/lib/server/parse-lead";
import { clientIp, isRateLimited, rateLimitBackend } from "@/lib/server/rate-limit";
import { verifyTurnstile } from "@/lib/server/turnstile";
import { deliverLead } from "@/lib/server/deliver";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Tiempo mínimo razonable para llenar el formulario; envíos más rápidos suelen ser automatizados. */
const MIN_FILL_MS = 2500;

type Outcome =
  | "delivered"
  | "delivery_failed"
  | "not_configured"
  | "rate_limited"
  | "forbidden_origin"
  | "bot_check_failed"
  | "honeypot"
  | "too_fast"
  | string;

/** Registro operativo SIN datos personales: solo identificador, resultado y códigos técnicos. */
function log(requestId: string, outcome: Outcome, extra: Record<string, unknown> = {}) {
  const line = JSON.stringify({ at: "api/lead", requestId, outcome, ...extra });
  if (outcome === "delivered") console.info(line);
  else console.warn(line);
}

function allowedOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // los navegadores siempre la envían en POST; se acepta su ausencia para clientes legítimos sin navegador
  try {
    const host = new URL(origin).host;
    const allowed = new Set<string>([new URL(siteConfig.url).host, req.headers.get("host") ?? ""]);
    for (const v of [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL]) {
      if (v) allowed.add(v);
    }
    if (siteConfig.url.includes("pymemkt.com.mx")) {
      allowed.add("pymemkt.com.mx");
      allowed.add("www.pymemkt.com.mx");
    }
    return allowed.has(host);
  } catch {
    return false;
  }
}

const json = (body: Record<string, unknown>, status: number, requestId: string) =>
  NextResponse.json({ ...body, requestId }, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  const requestId = crypto.randomUUID().slice(0, 8);

  try {
    if (!allowedOrigin(req)) {
      log(requestId, "forbidden_origin");
      return json({ ok: false, code: "forbidden_origin", error: "Origen no permitido." }, 403, requestId);
    }

    const ip = clientIp(req);
    if (await isRateLimited(ip)) {
      log(requestId, "rate_limited", { backend: rateLimitBackend });
      return json(
        { ok: false, code: "rate_limited", error: "Recibimos varias solicitudes desde tu conexión. Intenta de nuevo en unos minutos o escríbenos por WhatsApp." },
        429,
        requestId,
      );
    }

    const parsed = await parseLeadRequest(req);
    if (!parsed.ok) {
      log(requestId, parsed.code, { status: parsed.status, fields: parsed.errors ? Object.keys(parsed.errors) : undefined });
      return json({ ok: false, code: parsed.code, error: parsed.error, errors: parsed.errors }, parsed.status, requestId);
    }
    const data = parsed.data;

    // Honeypot: un campo oculto que solo llenan los bots. No se entrega ni se cuenta como conversión.
    if (data.website) {
      log(requestId, "honeypot");
      return json({ ok: false, code: "rejected", error: "No pudimos procesar la solicitud." }, 400, requestId);
    }
    if (typeof data.elapsedMs === "number" && data.elapsedMs < MIN_FILL_MS) {
      log(requestId, "too_fast");
      return json({ ok: false, code: "too_fast", error: "Revisa tus datos y vuelve a intentarlo en unos segundos." }, 400, requestId);
    }
    if (!(await verifyTurnstile(data.turnstileToken, ip))) {
      log(requestId, "bot_check_failed");
      return json({ ok: false, code: "bot_check_failed", error: "No pudimos verificar que no eres un robot. Intenta de nuevo." }, 400, requestId);
    }

    const result = await deliverLead(data);
    const channels = result.channels.map((c) => `${c.channel}:${c.ok ? "ok" : c.code}`);

    if (!result.configured) {
      log(requestId, "not_configured");
      return json(
        { ok: false, code: "not_configured", error: "El envío en línea no está disponible en este momento." },
        503,
        requestId,
      );
    }
    if (!result.delivered) {
      log(requestId, "delivery_failed", { channels });
      return json(
        { ok: false, code: "delivery_failed", error: "No pudimos entregar tu solicitud en este momento." },
        502,
        requestId,
      );
    }

    log(requestId, "delivered", { channels });
    return json({ ok: true, delivered: true }, 200, requestId);
  } catch (err) {
    log(requestId, "unexpected_error", { error: err instanceof Error ? err.name : "unknown" });
    return json({ ok: false, code: "server_error", error: "Ocurrió un error inesperado." }, 500, requestId);
  }
}

/** Cualquier otro método recibe 405 con el encabezado Allow. */
export function GET() {
  return new NextResponse(null, { status: 405, headers: { Allow: "POST" } });
}
