/**
 * DEMOSTRACIÓN GROWTH A3 — CASO HIPOTÉTICO
 * ---------------------------------------------------------------
 * Empresa, cifras y decisiones son FICTICIAS y sirven solo para ilustrar
 * cómo funciona la metodología. No representan a ningún cliente real ni
 * muestran resultados obtenidos: solo línea base inventada y metas.
 */

export const DEMO_COMPANY = {
  name: "Distribuidora Norte",
  profile: "Empresa ficticia · venta de equipo para restaurantes · 12 personas",
  symptom: "«Nos escriben mucho por WhatsApp, pero las ventas no crecen.»",
};

export type StageNote = { focus: string; question: string; note: string };

/** Lo que pasa en cada etapa, para el caso hipotético (mismo orden que STAGES). */
export const DEMO_NOTES: StageNote[] = [
  {
    focus: "Medimos cómo funciona hoy el proceso, antes de proponer nada.",
    question: "¿Qué está pasando realmente?",
    note: "En la demostración, de 40 mensajes por semana solo 15 llegan a cotización y 3 a venta. La primera respuesta tarda horas.",
  },
  {
    focus: "Separamos el síntoma («vendemos poco») de lo que lo provoca.",
    question: "¿Por qué se pierden las oportunidades?",
    note: "Dos causas raíz explican la mayor parte de la fuga: nadie da seguimiento a las cotizaciones y la respuesta inicial es lenta.",
  },
  {
    focus: "Ordenamos las acciones por impacto esperado y esfuerzo.",
    question: "¿Qué hacemos primero?",
    note: "Primero lo de alto impacto y bajo esfuerzo. La campaña de publicidad espera: traer más mensajes no sirve si se siguen perdiendo.",
  },
  {
    focus: "Implementamos en un ciclo corto, con responsables y fechas.",
    question: "¿Qué queda funcionando en dos semanas?",
    note: "El sprint termina con respuestas guía activas, una hoja de seguimiento en uso y las cotizaciones abiertas recontactadas.",
  },
  {
    focus: "Comparamos contra la línea base con indicadores definidos antes de empezar.",
    question: "¿Cómo sabremos si funcionó?",
    note: "En una demostración no hay resultados: solo la línea base ficticia y las metas que se medirían.",
  },
  {
    focus: "Con los datos, decidimos qué escalar, corregir o descartar.",
    question: "¿Qué sigue?",
    note: "Las reglas de decisión se acuerdan antes de ver los números, para no interpretar a conveniencia.",
  },
];

/** 01 · Diagnóstico: línea base ficticia del embudo semanal. */
export const DEMO_FUNNEL = [
  { label: "Mensajes recibidos", value: 40 },
  { label: "Cotizaciones enviadas", value: 15 },
  { label: "Ventas cerradas", value: 3 },
];

export const DEMO_BASELINE_FACTS = [
  { label: "Primera respuesta", value: "≈ 6 horas" },
  { label: "Seguimiento a cotizaciones", value: "Sin registro" },
];

/** 02 · Causas */
export const DEMO_CAUSES = [
  { title: "Cotizaciones sin seguimiento", evidence: "Nadie recontacta después de enviar el precio.", root: true },
  { title: "Respuesta inicial lenta", evidence: "Una sola persona atiende WhatsApp entre otras tareas.", root: true },
  { title: "Prospectos sin calificar", evidence: "Se cotiza a todos, incluso a quien solo compara precios.", root: false },
  { title: "Catálogo poco claro", evidence: "Las mismas preguntas se responden una y otra vez.", root: false },
];

/** 03 · Priorización: impacto (0-100, arriba = más) y esfuerzo (0-100, derecha = más). */
export const DEMO_ACTIONS = [
  { id: "A", label: "Respuestas guía en WhatsApp", impact: 82, effort: 18 },
  { id: "B", label: "Hoja de seguimiento de cotizaciones", impact: 74, effort: 30 },
  { id: "C", label: "Página de catálogo para cotizar", impact: 68, effort: 72 },
  { id: "D", label: "Campaña de Meta Ads", impact: 40, effort: 62 },
  { id: "E", label: "Cambiar de CRM", impact: 24, effort: 86 },
];

/** 04 · Sprint de 10 días hábiles. */
export const DEMO_SPRINT = [
  { task: "Redactar respuestas guía", from: 1, to: 3, owner: "Ventas" },
  { task: "Etiquetas en WhatsApp Business", from: 2, to: 4, owner: "Ventas" },
  { task: "Hoja de seguimiento", from: 3, to: 5, owner: "Dirección" },
  { task: "Capacitar al equipo", from: 6, to: 6, owner: "PYMEmkt" },
  { task: "Recontactar cotizaciones abiertas", from: 6, to: 10, owner: "Ventas" },
];

/** 05 · Medición: línea base ficticia y metas (no resultados). */
export const DEMO_INDICATORS = [
  { name: "Tiempo de primera respuesta", baseline: "≈ 6 h", target: "Menos de 1 h", cadence: "Diario" },
  { name: "Cotizaciones con fecha de recontacto", baseline: "Sin registro", target: "Todas", cadence: "Semanal" },
  { name: "Cotizaciones que se vuelven venta", baseline: "3 de 15", target: "Medir 4 semanas", cadence: "Mensual" },
];

/** 06 · Optimización: reglas de decisión acordadas antes de medir. */
export const DEMO_RULES = [
  { if: "Baja el tiempo de respuesta, pero no suben las ventas", then: "Revisar calificación de prospectos y cómo se presenta el precio." },
  { if: "Las cotizaciones con seguimiento cierran más", then: "Automatizar los recordatorios de recontacto." },
  { if: "Las acciones A y B ya son rutina", then: "Abrir un nuevo ciclo A3 con la página de catálogo (acción C)." },
];
