/**
 * Capa de analítica unificada (GA4 + Meta Pixel).
 * Si los IDs no están configurados, las llamadas son no-op seguras.
 */

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Eventos del sitio y su equivalente estándar en Meta Pixel (si existe). */
export const EVENTS = {
  diagnostic_start: { meta: "custom" },
  diagnostic_step: { meta: "custom" },
  diagnostic_complete: { meta: "CompleteRegistration" },
  diagnostic_request: { meta: "custom" },
  whatsapp_click: { meta: "Contact" },
  form_submit: { meta: "Lead" },
  form_error: { meta: "custom" },
  meeting_request: { meta: "Schedule" },
  cta_click: { meta: "custom" },
  problem_open: { meta: "custom" },
  method_stage_open: { meta: "custom" },
  solution_category: { meta: "custom" },
  a3_demo_step: { meta: "custom" },
} as const;

export type EventName = keyof typeof EVENTS;

export function track(event: EventName, params: Params = {}) {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", event, params);
    const meta = EVENTS[event].meta;
    if (window.fbq) {
      if (meta === "custom") window.fbq("trackCustom", event, params);
      else window.fbq("track", meta, { ...params, content_name: event });
    }
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.debug("[analytics]", event, params);
    }
  } catch {
    /* la analítica nunca debe romper la experiencia */
  }
}
