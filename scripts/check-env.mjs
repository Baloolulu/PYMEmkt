/**
 * Verificación de configuración antes de compilar (se ejecuta con `npm run build`).
 * - En producción (NEXT_PUBLIC_APP_ENV=production) los problemas DETIENEN la compilación.
 * - En pruebas (staging) solo se muestran como advertencias.
 * No imprime valores secretos.
 */
import { readFileSync } from "node:fs";
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd(), false, { info: () => {}, error: console.error });

const env = process.env;
const appEnv = env.NEXT_PUBLIC_APP_ENV || "staging";
const isProd = appEnv === "production";
const errors = [];
const warnings = [];
const problem = (msg) => (isProd ? errors : warnings).push(msg);

if (!["production", "staging", "development"].includes(appEnv)) {
  errors.push(`NEXT_PUBLIC_APP_ENV="${appEnv}" no es válido (production | staging | development).`);
}

// URL pública
const siteUrl = (env.NEXT_PUBLIC_SITE_URL || "").trim();
const badHost = /localhost|127\.0\.0\.1|tudominio|example\.|ejemplo/i;
if (isProd) {
  if (!siteUrl) errors.push("Falta NEXT_PUBLIC_SITE_URL (p. ej. https://pymemkt.com.mx).");
  else if (!siteUrl.startsWith("https://")) errors.push("NEXT_PUBLIC_SITE_URL debe empezar con https://.");
  else if (badHost.test(siteUrl) || /vercel\.app/.test(siteUrl)) errors.push(`NEXT_PUBLIC_SITE_URL apunta a un dominio de prueba: ${siteUrl}`);
} else if (siteUrl && badHost.test(siteUrl)) {
  warnings.push(`NEXT_PUBLIC_SITE_URL apunta a un dominio de ejemplo o local: ${siteUrl}`);
}

// WhatsApp y correo
const wa = (env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
if (!wa) problem("Falta NEXT_PUBLIC_WHATSAPP_NUMBER.");
else if (!/^52\d{10}$/.test(wa)) problem(`NEXT_PUBLIC_WHATSAPP_NUMBER debe ser 52 + 10 dígitos (recibido: ${wa.length} dígitos).`);
if (env.NEXT_PUBLIC_DEMO_MODE === "true") problem("NEXT_PUBLIC_DEMO_MODE está activo; debe quedar vacío o en false.");
const email = (env.NEXT_PUBLIC_CONTACT_EMAIL || "").trim();
if (!email) problem("Falta NEXT_PUBLIC_CONTACT_EMAIL.");
else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) problem("NEXT_PUBLIC_CONTACT_EMAIL no tiene formato de correo.");

// Recepción de solicitudes
const smtp = env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS;
const resend = env.RESEND_API_KEY && env.LEAD_EMAIL_FROM;
const webhook = env.LEAD_WEBHOOK_URL;
if (!smtp && !resend && !webhook) {
  problem("No hay canal de recepción del formulario (SMTP_*, RESEND_API_KEY + LEAD_EMAIL_FROM o LEAD_WEBHOOK_URL). Las solicitudes no se podrían entregar.");
}
if ((smtp || resend) && !env.LEAD_EMAIL_TO) problem("Falta LEAD_EMAIL_TO (correo que recibe las solicitudes).");
for (const k of Object.keys(env)) {
  if (k.startsWith("NEXT_PUBLIC_") && /SECRET|PASS|TOKEN|API_KEY/i.test(k)) {
    errors.push(`${k} parece una credencial y quedaría expuesta en el navegador. Quita el prefijo NEXT_PUBLIC_.`);
  }
}

// Protección distribuida contra abuso
const redis = (env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL) && (env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN);
if (!redis) warnings.push("Sin Upstash/KV: el límite de envíos por IP es por instancia. Configura también la regla de Vercel Firewall (ver PUBLICACION.md).");
if (Boolean(env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) !== Boolean(env.TURNSTILE_SECRET_KEY)) {
  problem("Turnstile necesita ambas claves: NEXT_PUBLIC_TURNSTILE_SITE_KEY y TURNSTILE_SECRET_KEY.");
}

// Aviso de privacidad
const privacySrc = readFileSync(new URL("../lib/privacy.ts", import.meta.url), "utf8");
const block = privacySrc.slice(privacySrc.indexOf("export const PRIVACY: PrivacyData"));
const pending = [...block.slice(0, block.indexOf("};")).matchAll(/^\s+(\w+):\s*null,/gm)].map((m) => m[1]);
if (pending.length) problem(`Aviso de privacidad incompleto (lib/privacy.ts): ${pending.join(", ")}.`);

const tag = `[check-env:${appEnv}]`;
for (const w of warnings) console.warn(`${tag} AVISO: ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`${tag} ERROR: ${e}`);
  console.error(`${tag} Compilación detenida: corrige la configuración de producción.`);
  process.exit(1);
}
console.log(`${tag} OK${warnings.length ? ` con ${warnings.length} aviso(s)` : ""}.`);
