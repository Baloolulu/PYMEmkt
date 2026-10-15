/**
 * Configuración centralizada del sitio.
 * Los datos de contacto e identificadores externos se leen de variables de entorno
 * (ver `.env.example`, `.env.production` y PUBLICACION.md).
 *
 * Entornos (NEXT_PUBLIC_APP_ENV):
 *  - "production": sitio real en el dominio final. Se indexa en buscadores.
 *  - "staging":    pruebas de publicación (p. ej. la URL *.vercel.app). No se indexa.
 *  - "development": `npm run dev` en tu computadora.
 * Si no se define, cualquier compilación se trata como "staging" (nunca se indexa por accidente).
 */

const clean = (v: string | undefined) => (v && v.trim().length > 0 ? v.trim() : undefined);

export type AppEnv = "production" | "staging" | "development";

function resolveEnv(): AppEnv {
  const v = clean(process.env.NEXT_PUBLIC_APP_ENV);
  if (v === "production" || v === "staging" || v === "development") return v;
  return process.env.NODE_ENV === "development" ? "development" : "staging";
}

export const appEnv: AppEnv = resolveEnv();
export const isProduction = appEnv === "production";

/** Dominio final, usado solo como canónico en producción si no se define NEXT_PUBLIC_SITE_URL. */
export const PRODUCTION_URL = "https://pymemkt.com.mx";

function resolveSiteUrl(): string {
  const explicit = clean(process.env.NEXT_PUBLIC_SITE_URL)?.replace(/\/+$/, "");
  if (explicit) return explicit;
  if (isProduction) return PRODUCTION_URL;
  // En Vercel estas variables se exponen automáticamente para Next.js.
  const vercel =
    clean(process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL) ??
    clean(process.env.NEXT_PUBLIC_VERCEL_URL) ??
    clean(process.env.VERCEL_BRANCH_URL) ??
    clean(process.env.VERCEL_URL);
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const siteConfig = {
  name: "PYMEmkt",
  positioning: "PYMEmkt | Growth Systems",
  slogan: ["Menos improvisación.", "Más crecimiento."],
  description:
    "Diagnóstico comercial, estrategia de crecimiento, marketing digital, inteligencia artificial y automatización para pequeñas y medianas empresas en México.",
  url: resolveSiteUrl(),
  /** Solo producción se indexa en buscadores. */
  indexable: isProduction,
  locale: "es_MX",
  contact: {
    /** Número en formato internacional sin "+" ni espacios. Ej: 525579270123 */
    whatsapp: clean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER)?.replace(/\D/g, ""),
    email: clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  },
  analytics: {
    ga4Id: clean(process.env.NEXT_PUBLIC_GA4_ID)?.replace(/[^A-Za-z0-9-]/g, ""),
    metaPixelId: clean(process.env.NEXT_PUBLIC_META_PIXEL_ID)?.replace(/\D/g, ""),
  },
  /** Protección anti-bots opcional (Cloudflare Turnstile). La clave secreta vive solo en el servidor. */
  turnstileSiteKey: clean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY),
  social: {
    instagram: clean(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
    facebook: clean(process.env.NEXT_PUBLIC_FACEBOOK_URL),
    linkedin: clean(process.env.NEXT_PUBLIC_LINKEDIN_URL),
  },
} as const;

export const hasAnalytics = Boolean(siteConfig.analytics.ga4Id || siteConfig.analytics.metaPixelId);

export const navItems = [
  { label: "Problemas", href: "#problemas" },
  { label: "Diagnóstico", href: "#diagnostico" },
  { label: "Metodología", href: "#metodologia" },
  { label: "Soluciones", href: "#soluciones" },
  { label: "Evidencia", href: "#evidencia" },
] as const;

export type SiteConfig = typeof siteConfig;
