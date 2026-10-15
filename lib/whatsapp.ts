import { siteConfig } from "./config";

/**
 * Modo demostración (solo para vistas previas): si no hay número configurado,
 * los botones de WhatsApp abren WhatsApp con el mensaje redactado para que se
 * pueda revisar el texto, sin enviarlo a ningún número real.
 * En producción deja NEXT_PUBLIC_DEMO_MODE vacío.
 */
const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export const hasWhatsApp = Boolean(siteConfig.contact.whatsapp) || demoMode;
export const isWhatsAppDemo = !siteConfig.contact.whatsapp && demoMode;

/** Enlace wa.me con mensaje prellenado, o null si no hay número configurado. */
export function whatsappLink(message: string): string | null {
  const n = siteConfig.contact.whatsapp;
  if (n) return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;
  if (demoMode) return whatsappShareLink(message);
  return null;
}

/** Enlace para compartir un texto por WhatsApp a cualquier contacto (sin destinatario). */
export function whatsappShareLink(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export const DEFAULT_WA_MESSAGE =
  "Hola, PYMEmkt. Me interesa un diagnóstico comercial para mi empresa. ¿Podemos platicar?";
