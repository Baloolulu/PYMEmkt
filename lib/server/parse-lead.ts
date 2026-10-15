import "server-only";
import { validateLead, type LeadErrors, type LeadInput } from "@/lib/lead";

/** Tamaño máximo aceptado para el cuerpo de la solicitud (bytes). */
export const MAX_BODY_BYTES = 8 * 1024;

const STRING_FIELDS = {
  name: 80,
  company: 100,
  phone: 20,
  email: 120,
  challenge: 80,
  preference: 20,
  message: 600,
  context: 120,
  diagnosticArea: 40,
  website: 100,
  turnstileToken: 2048,
} as const;

type StringField = keyof typeof STRING_FIELDS;

export type ParsedLead = LeadInput & { turnstileToken?: string; elapsedMs?: number };

export type ParseResult =
  | { ok: true; data: ParsedLead }
  | { ok: false; status: number; code: string; error: string; errors?: LeadErrors };

/** Lee y valida el cuerpo sin lanzar excepciones: cualquier entrada inesperada termina en un error controlado. */
export async function parseLeadRequest(req: Request): Promise<ParseResult> {
  const type = req.headers.get("content-type") ?? "";
  if (!type.toLowerCase().startsWith("application/json")) {
    return { ok: false, status: 415, code: "unsupported_media_type", error: "La solicitud debe enviarse como JSON." };
  }

  const declared = Number(req.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return { ok: false, status: 413, code: "payload_too_large", error: "La solicitud es demasiado grande." };
  }

  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return { ok: false, status: 400, code: "unreadable_body", error: "No pudimos leer la solicitud." };
  }
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
    return { ok: false, status: 413, code: "payload_too_large", error: "La solicitud es demasiado grande." };
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return { ok: false, status: 400, code: "invalid_json", error: "La solicitud no tiene un formato válido." };
  }

  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, status: 400, code: "invalid_shape", error: "La solicitud no tiene un formato válido." };
  }

  const obj = body as Record<string, unknown>;
  const typeErrors: LeadErrors = {};
  const out: Partial<Record<StringField, string>> = {};

  for (const [key, max] of Object.entries(STRING_FIELDS) as [StringField, number][]) {
    const v = obj[key];
    if (v === undefined || v === null) {
      out[key] = "";
      continue;
    }
    if (typeof v !== "string") {
      if (key !== "turnstileToken") (typeErrors as Record<string, string>)[key] = "Formato no válido.";
      out[key] = "";
      continue;
    }
    out[key] = v.trim().slice(0, max);
  }

  const consentRaw = obj.consent;
  if (consentRaw !== undefined && typeof consentRaw !== "boolean") {
    (typeErrors as Record<string, string>).consent = "Formato no válido.";
  }

  const elapsedRaw = obj.elapsedMs;
  const elapsedMs = typeof elapsedRaw === "number" && Number.isFinite(elapsedRaw) ? elapsedRaw : undefined;

  const data: ParsedLead = {
    name: out.name ?? "",
    company: out.company ?? "",
    phone: out.phone ?? "",
    email: out.email ?? "",
    challenge: out.challenge ?? "",
    preference: out.preference ?? "",
    message: out.message ?? "",
    consent: consentRaw === true,
    context: out.context ?? "",
    diagnosticArea: out.diagnosticArea ?? "",
    website: out.website ?? "",
    turnstileToken: out.turnstileToken || undefined,
    elapsedMs,
  };

  const errors = { ...validateLead(data), ...typeErrors };
  if (Object.keys(errors).length) {
    return { ok: false, status: 422, code: "validation_failed", error: "Revisa los campos marcados.", errors };
  }
  return { ok: true, data };
}
