import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { normalizePhone } from "@/lib/lead";
import type { ParsedLead } from "./parse-lead";

/**
 * Entrega de solicitudes.
 * Una solicitud se considera ENTREGADA solo si al menos un canal configurado
 * confirma la recepción:
 *  - SMTP: el servidor de correo acepta el destinatario (Titan Email u otro).
 *  - Resend: la API responde 2xx con un id de mensaje.
 *  - Webhook: el destino responde 2xx.
 * Si ningún canal está configurado o todos fallan, la entrega NO se confirma.
 */

export type ChannelResult = { channel: "smtp" | "resend" | "webhook"; ok: boolean; code?: string };
export type DeliveryResult = { delivered: boolean; configured: boolean; channels: ChannelResult[] };

const env = process.env;
const emailTo = env.LEAD_EMAIL_TO?.trim();
const emailFrom = env.LEAD_EMAIL_FROM?.trim() || env.SMTP_USER?.trim();

const smtpConfigured = Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS && emailTo);
const resendConfigured = Boolean(env.RESEND_API_KEY && env.LEAD_EMAIL_FROM && emailTo);
const webhookConfigured = Boolean(env.LEAD_WEBHOOK_URL);

export const deliveryConfigured = smtpConfigured || resendConfigured || webhookConfigured;

const PREF_TEXT: Record<string, string> = {
  WhatsApp: "WhatsApp",
  Llamada: "Llamada telefónica (por acordar; no hay cita agendada)",
  Videollamada: "Videollamada (por acordar; no hay cita agendada)",
};

function rows(d: ParsedLead, receivedAt: string): [string, string][] {
  return [
    ["Nombre", d.name],
    ["Empresa", d.company],
    ["WhatsApp / teléfono", normalizePhone(d.phone)],
    ["Correo", d.email || "—"],
    ["Situación", d.challenge],
    ["Prefiere que lo contacten por", PREF_TEXT[d.preference] ?? d.preference],
    ["Resultado de la evaluación", d.diagnosticArea || "No hizo la evaluación"],
    ["Contexto", d.context || "—"],
    ["Comentario", d.message || "—"],
    ["Recibida", receivedAt],
  ];
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

function buildEmail(d: ParsedLead) {
  const receivedAt = new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City", dateStyle: "long", timeStyle: "short" });
  const r = rows(d, receivedAt);
  const subject = `Nueva solicitud de diagnóstico: ${d.company}`.replace(/[\r\n]+/g, " ").slice(0, 150);
  const text = ["Nueva solicitud de diagnóstico desde el sitio web.", "", ...r.map(([k, v]) => `${k}: ${v}`)].join("\n");
  const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#0B0F19">
<p style="font-size:16px"><strong>Nueva solicitud de diagnóstico</strong> desde el sitio web.</p>
<table cellpadding="8" style="border-collapse:collapse;font-size:14px">
${r.map(([k, v]) => `<tr><td style="color:#555;border-bottom:1px solid #eee;vertical-align:top">${escapeHtml(k)}</td><td style="border-bottom:1px solid #eee">${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`).join("\n")}
</table>
<p style="font-size:12px;color:#777">Responde a este correo para escribirle al prospecto${d.email ? "" : " (no dejó correo: contáctalo por teléfono o WhatsApp)"}.</p>
</body></html>`;
  return { subject, text, html, replyTo: d.email || undefined };
}

let transporter: Transporter | null = null;
function getTransporter() {
  if (!transporter) {
    const port = Number(env.SMTP_PORT || 465);
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port,
      secure: env.SMTP_SECURE ? env.SMTP_SECURE === "true" : port === 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 10000,
    });
  }
  return transporter;
}

async function sendSmtp(d: ParsedLead): Promise<ChannelResult> {
  try {
    const m = buildEmail(d);
    const info = await getTransporter().sendMail({
      from: emailFrom,
      to: emailTo,
      replyTo: m.replyTo,
      subject: m.subject,
      text: m.text,
      html: m.html,
    });
    const accepted = Array.isArray(info.accepted) && info.accepted.length > 0;
    const rejected = Array.isArray(info.rejected) && info.rejected.length > 0;
    return { channel: "smtp", ok: accepted && !rejected, code: accepted ? undefined : "not_accepted" };
  } catch (err) {
    const e = err as { code?: string; responseCode?: number };
    return { channel: "smtp", ok: false, code: e.code ?? (e.responseCode ? `smtp_${e.responseCode}` : "smtp_error") };
  }
}

async function sendResend(d: ParsedLead): Promise<ChannelResult> {
  try {
    const m = buildEmail(d);
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: env.LEAD_EMAIL_FROM, to: [emailTo], reply_to: m.replyTo, subject: m.subject, text: m.text, html: m.html }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    const json = (await res.json().catch(() => ({}))) as { id?: string };
    return { channel: "resend", ok: res.ok && Boolean(json.id), code: res.ok ? undefined : `resend_${res.status}` };
  } catch {
    return { channel: "resend", ok: false, code: "resend_network" };
  }
}

async function sendWebhook(d: ParsedLead): Promise<ChannelResult> {
  try {
    const res = await fetch(env.LEAD_WEBHOOK_URL as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(env.LEAD_WEBHOOK_SECRET ? { "X-Webhook-Secret": env.LEAD_WEBHOOK_SECRET } : {}),
      },
      body: JSON.stringify({
        source: "pymemkt-web",
        createdAt: new Date().toISOString(),
        name: d.name,
        company: d.company,
        phone: normalizePhone(d.phone),
        email: d.email || null,
        challenge: d.challenge,
        preference: d.preference,
        message: d.message || null,
        context: d.context || null,
        diagnosticArea: d.diagnosticArea || null,
      }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    return { channel: "webhook", ok: res.ok, code: res.ok ? undefined : `webhook_${res.status}` };
  } catch {
    return { channel: "webhook", ok: false, code: "webhook_network" };
  }
}

export async function deliverLead(d: ParsedLead): Promise<DeliveryResult> {
  const tasks: Promise<ChannelResult>[] = [];
  if (smtpConfigured) tasks.push(sendSmtp(d));
  else if (resendConfigured) tasks.push(sendResend(d));
  if (webhookConfigured) tasks.push(sendWebhook(d));
  if (!tasks.length) return { delivered: false, configured: false, channels: [] };
  const channels = await Promise.all(tasks);
  return { delivered: channels.some((c) => c.ok), configured: true, channels };
}

/** Verifica las credenciales SMTP sin enviar correo (para el diagnóstico de configuración). */
export async function verifySmtp(): Promise<ChannelResult | null> {
  if (!smtpConfigured) return null;
  try {
    await getTransporter().verify();
    return { channel: "smtp", ok: true };
  } catch (err) {
    const e = err as { code?: string; responseCode?: number };
    return { channel: "smtp", ok: false, code: e.code ?? (e.responseCode ? `smtp_${e.responseCode}` : "smtp_error") };
  }
}
