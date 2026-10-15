/**
 * Configuración centralizada del sitio.
 * Todos los identificadores externos y datos de contacto se leen de variables de entorno.
 * Ver `.env.example`. Ningún dato de contacto está escrito en el código.
 */

const clean = (v: string | undefined) => (v && v.trim().length > 0 ? v.trim() : undefined);

export const siteConfig = {
  name: "PYMEmkt",
  positioning: "PYMEmkt | Growth Systems",
  slogan: ["Menos improvisación.", "Más crecimiento."],
  description:
    "Diagnóstico comercial, estrategia de crecimiento, marketing digital, inteligencia artificial y automatización para pequeñas y medianas empresas en México.",
  url: clean(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000",
  locale: "es_MX",
  contact: {
    /** Número en formato internacional sin "+" ni espacios. Ej: 525512345678 */
    whatsapp: clean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER)?.replace(/\D/g, ""),
    email: clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  },
  analytics: {
    ga4Id: clean(process.env.NEXT_PUBLIC_GA4_ID)?.replace(/[^A-Za-z0-9-]/g, ""),
    metaPixelId: clean(process.env.NEXT_PUBLIC_META_PIXEL_ID)?.replace(/\D/g, ""),
  },
  social: {
    instagram: clean(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
    facebook: clean(process.env.NEXT_PUBLIC_FACEBOOK_URL),
    linkedin: clean(process.env.NEXT_PUBLIC_LINKEDIN_URL),
  },
} as const;

export const navItems = [
  { label: "Problemas", href: "#problemas" },
  { label: "Diagnóstico", href: "#diagnostico" },
  { label: "Metodología", href: "#metodologia" },
  { label: "Soluciones", href: "#soluciones" },
  { label: "Evidencia", href: "#evidencia" },
] as const;

export type SiteConfig = typeof siteConfig;
