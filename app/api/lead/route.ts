import { NextResponse } from "next/server";
import { normalizePhone, validateLead, type LeadInput } from "@/lib/lead";

export const runtime = "nodejs";

/** Límite simple por IP (por instancia). Para producción con alto tráfico, usar un store externo. */
const hits = new Map<string, { count: number; ts: number }>();
const WINDOW = 10 * 60 * 1000;
const MAX = 5;

function limited(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.ts > WINDOW) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  h.count += 1;
  return h.count > MAX;
}

const str = (v: unknown, max = 600) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Solicitud inválida." }, { status: 400 });
  }

  const data: LeadInput = {
    name: str(body.name, 80),
    company: str(body.company, 100),
    phone: str(body.phone, 20),
    email: str(body.email, 120),
    challenge: str(body.challenge, 80),
    preference: str(body.preference, 20),
    message: str(body.message, 600),
    consent: body.consent === true,
    context: str(body.context, 120),
    diagnosticArea: str(body.diagnosticArea, 40),
    website: str(body.website, 100),
  };

  // Honeypot: responder como éxito sin procesar
  if (data.website) return NextResponse.json({ ok: true, delivered: true });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Recibimos varias solicitudes desde tu conexión. Intenta de nuevo en unos minutos." },
      { status: 429 },
    );
  }

  const errors = validateLead(data);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, error: "Revisa los campos marcados.", errors }, { status: 422 });
  }

  const payload = {
    source: "pymemkt-web",
    createdAt: new Date().toISOString(),
    name: data.name,
    company: data.company,
    phone: normalizePhone(data.phone),
    email: data.email || null,
    challenge: data.challenge,
    preference: data.preference,
    message: data.message || null,
    context: data.context || null,
    diagnosticArea: data.diagnosticArea || null,
  };

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (!webhook) {
    console.warn("[lead] LEAD_WEBHOOK_URL no configurado. Solicitud recibida pero no reenviada:", payload.company);
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.LEAD_WEBHOOK_SECRET ? { "X-Webhook-Secret": process.env.LEAD_WEBHOOK_SECRET } : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Webhook ${res.status}`);
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[lead] Error al reenviar:", err);
    return NextResponse.json({ ok: true, delivered: false });
  }
}
