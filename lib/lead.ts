/** Validación compartida (cliente y servidor) del formulario de diagnóstico. */

export const CHALLENGES = [
  "No llegan suficientes prospectos",
  "Recibo mensajes, pero pocas ventas",
  "Mi publicidad no genera resultados claros",
  "Dependo demasiado de recomendaciones",
  "Mis cotizaciones no tienen seguimiento",
  "No sé qué acciones realmente funcionan",
  "No sé cuál es el problema",
] as const;

export const CONTACT_PREFS = ["WhatsApp", "Llamada", "Videollamada"] as const;

export type LeadInput = {
  name: string;
  company: string;
  phone: string;
  email: string;
  challenge: string;
  preference: string;
  message: string;
  consent: boolean;
  context?: string;
  diagnosticArea?: string;
  /** honeypot */
  website?: string;
};

export type LeadErrors = Partial<Record<keyof LeadInput, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizePhone(v: string) {
  return v.replace(/[^\d+]/g, "");
}

export function validateLead(d: LeadInput): LeadErrors {
  const e: LeadErrors = {};
  if (!d.name || d.name.trim().length < 2) e.name = "Escribe tu nombre.";
  else if (d.name.length > 80) e.name = "El nombre es demasiado largo.";

  if (!d.company || d.company.trim().length < 2) e.company = "Escribe el nombre de tu empresa.";
  else if (d.company.length > 100) e.company = "El nombre de la empresa es demasiado largo.";

  const digits = normalizePhone(d.phone).replace(/^\+?52/, "").replace(/\D/g, "");
  if (!d.phone) e.phone = "Necesitamos un número para contactarte.";
  else if (digits.length !== 10) e.phone = "Escribe un número de 10 dígitos (puedes incluir +52).";

  if (d.email && !EMAIL.test(d.email.trim())) e.email = "Revisa el formato del correo.";

  if (!d.challenge) e.challenge = "Selecciona la opción más cercana.";
  else if (!(CHALLENGES as readonly string[]).includes(d.challenge)) e.challenge = "Opción no válida.";

  if (!(CONTACT_PREFS as readonly string[]).includes(d.preference)) e.preference = "Elige cómo prefieres continuar.";

  if (d.message && d.message.length > 600) e.message = "Máximo 600 caracteres.";
  else if (d.message && /https?:\/\/|www\./i.test(d.message) && (d.message.match(/https?:\/\//gi)?.length ?? 0) > 2)
    e.message = "Incluye máximo dos enlaces.";

  if (!d.consent) e.consent = "Necesitamos tu autorización para contactarte.";
  return e;
}

export function leadSummary(d: LeadInput) {
  return [
    "Hola, PYMEmkt. Quiero solicitar un diagnóstico.",
    `Nombre: ${d.name}`,
    `Empresa: ${d.company}`,
    `Desafío: ${d.challenge}`,
    d.diagnosticArea ? `Resultado de la evaluación: ${d.diagnosticArea}` : null,
    `Prefiero que me contacten por: ${d.preference}`,
    d.message ? `Comentario: ${d.message}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}
