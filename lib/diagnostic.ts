/**
 * Evaluación interactiva: preguntas, ponderación y generación del resultado preliminar.
 * El resultado es orientativo; no sustituye un diagnóstico profesional.
 */

export type Area = "atraccion" | "conversion" | "confianza" | "direccion";

export type Option = {
  id: string;
  label: string;
  weights: Partial<Record<Area, number>>;
  /** Señal que se mostrará en el resultado si se elige esta opción. */
  signal?: string;
};

export type Question = {
  id: string;
  title: string;
  helper: string;
  options: Option[];
};

export const AREAS: Record<
  Area,
  { label: string; short: string; headline: string; description: string; focus: string[] }
> = {
  atraccion: {
    label: "Atracción",
    short: "ATRACCIÓN",
    headline: "Atracción de prospectos",
    description:
      "Las señales apuntan a que no entran suficientes oportunidades, o que llegan de forma irregular. Antes de pensar en vender más, conviene asegurar un flujo predecible de personas interesadas.",
    focus: [
      "Qué canales traen prospectos hoy y cuáles podrían escalar",
      "Si el mensaje comercial se dirige al cliente correcto",
      "Qué tan dependiente es el negocio de una sola fuente",
    ],
  },
  conversion: {
    label: "Conversión",
    short: "CONVERSIÓN",
    headline: "Conversión de oportunidades",
    description:
      "Parece que sí hay interés, pero una parte se pierde entre el primer mensaje y el cierre. Es común en procesos que dependen de la memoria de las personas y no de un sistema.",
    focus: [
      "Tiempo de respuesta al primer contacto",
      "Proceso de seguimiento después de cotizar",
      "Puntos exactos donde se enfrían las conversaciones",
    ],
  },
  confianza: {
    label: "Confianza",
    short: "CONFIANZA",
    headline: "Confianza y credibilidad",
    description:
      "Las respuestas sugieren que el prospecto necesita más razones para elegirte. Cuando la presencia digital no respalda lo que la empresa realmente hace, el cliente compara solo por precio.",
    focus: [
      "Qué ve un prospecto cuando busca tu empresa",
      "Evidencia visible: reseñas, casos, procesos",
      "Coherencia entre lo que prometes y lo que muestras",
    ],
  },
  direccion: {
    label: "Dirección",
    short: "DIRECCIÓN",
    headline: "Dirección y medición",
    description:
      "Las decisiones comerciales parecen tomarse sin suficiente información. Sin indicadores claros es difícil saber qué funciona, qué no y dónde invertir el siguiente peso.",
    focus: [
      "Qué indicadores comerciales mirar cada semana",
      "Cómo atribuir ventas a cada canal",
      "Qué priorizar con el presupuesto y equipo actuales",
    ],
  },
};

export const QUESTIONS: Question[] = [
  {
    id: "origen",
    title: "¿Cómo llegan actualmente tus clientes?",
    helper: "Elige la opción que mejor describa tu situación actual.",
    options: [
      {
        id: "recomendaciones",
        label: "Recomendaciones",
        weights: { atraccion: 2, confianza: 1 },
        signal: "La mayoría de tus clientes llega por recomendación: valioso, pero difícil de escalar y de predecir.",
      },
      {
        id: "redes",
        label: "Redes sociales",
        weights: { atraccion: 1, confianza: 1, conversion: 1 },
        signal: "Tus redes generan contactos; la clave está en cuántos se convierten en conversaciones de venta.",
      },
      {
        id: "publicidad",
        label: "Publicidad",
        weights: { conversion: 1, direccion: 1 },
        signal: "Dependes de la publicidad para atraer clientes, así que medir su retorno es crítico.",
      },
      {
        id: "google",
        label: "Google",
        weights: { conversion: 1, confianza: 1 },
        signal: "Te encuentran en Google: lo que vean al llegar define si te contactan o siguen buscando.",
      },
      {
        id: "multicanal",
        label: "Diferentes canales",
        weights: { direccion: 1, conversion: 1 },
        signal: "Trabajas varios canales a la vez; sin atribución clara es difícil saber cuál rinde más.",
      },
      {
        id: "no-claro",
        label: "No lo tengo claro",
        weights: { direccion: 3 },
        signal: "No tienes claro de dónde vienen tus clientes: es la primera pieza que conviene medir.",
      },
    ],
  },
  {
    id: "publicidad",
    title: "¿Actualmente inviertes en publicidad digital?",
    helper: "Considera Meta Ads, Google Ads u otras plataformas.",
    options: [
      { id: "si-medible", label: "Sí, con resultados medibles", weights: {} },
      {
        id: "si-sin-retorno",
        label: "Sí, pero desconozco el retorno",
        weights: { direccion: 3, conversion: 1 },
        signal: "Inviertes en publicidad sin conocer su retorno: cada peso invertido es una apuesta sin datos.",
      },
      {
        id: "no",
        label: "No",
        weights: { atraccion: 2 },
        signal: "No inviertes en publicidad digital, por lo que el crecimiento depende de canales que no controlas del todo.",
      },
      {
        id: "ocasional",
        label: "Ocasionalmente",
        weights: { atraccion: 1, direccion: 1 },
        signal: "Tu inversión publicitaria es ocasional; las campañas intermitentes rara vez acumulan aprendizaje.",
      },
    ],
  },
  {
    id: "respuesta",
    title: "¿Qué sucede cuando alguien solicita información?",
    helper: "Piensa en lo que pasa en la práctica, no en lo ideal.",
    options: [
      { id: "proceso", label: "Tenemos un proceso definido", weights: {} },
      {
        id: "manual",
        label: "Respondemos manualmente",
        weights: { conversion: 1 },
        signal: "Las respuestas son manuales: funciona a bajo volumen, pero se vuelve un cuello de botella al crecer.",
      },
      {
        id: "tardamos",
        label: "A veces tardamos en responder",
        weights: { conversion: 3, confianza: 1 },
        signal: "A veces tardan en responder: el interés de un prospecto se enfría en horas, no en días.",
      },
      {
        id: "sin-seguimiento",
        label: "No existe un seguimiento formal",
        weights: { conversion: 3, direccion: 1 },
        signal: "No hay seguimiento formal: es probable que existan ventas posibles que nadie retomó.",
      },
    ],
  },
  {
    id: "cotizaciones",
    title: "¿Mides cuántas cotizaciones se convierten en clientes?",
    helper: "Una tasa aproximada también cuenta.",
    options: [
      { id: "si", label: "Sí", weights: {} },
      {
        id: "parcial",
        label: "Parcialmente",
        weights: { direccion: 1, conversion: 1 },
        signal: "Mides tus cotizaciones de forma parcial; completar ese dato revela dónde se pierden ventas.",
      },
      {
        id: "no",
        label: "No",
        weights: { direccion: 2, conversion: 1 },
        signal: "No mides la conversión de cotizaciones, así que no es posible saber si el problema está antes o después de cotizar.",
      },
    ],
  },
  {
    id: "desafio",
    title: "¿Cuál es tu principal desafío?",
    helper: "Si dudas entre dos, elige el que más te preocupa hoy.",
    options: [
      { id: "prospectos", label: "Conseguir prospectos", weights: { atraccion: 3 } },
      { id: "convertir", label: "Convertir conversaciones en ventas", weights: { conversion: 3 } },
      { id: "confianza", label: "Generar confianza", weights: { confianza: 4 } },
      { id: "procesos", label: "Mejorar procesos", weights: { direccion: 2, conversion: 1 } },
      {
        id: "no-se",
        label: "No sé cuál es el problema",
        weights: { direccion: 3 },
        signal: "Reconoces que no sabes cuál es el problema; ese es exactamente el punto de partida de un diagnóstico.",
      },
    ],
  },
];

export type Answers = Record<string, string>;

export type DiagnosticResult = {
  primary: Area;
  secondary: Area | null;
  scores: Record<Area, number>;
  /** Porcentaje relativo de señales por área (suma 100). */
  distribution: Record<Area, number>;
  signals: string[];
  challengeLabel: string;
  /** Respuestas que más sumaron al área principal (para explicar el resultado). */
  reasons: { question: string; answer: string; weight: number }[];
  /** Cuántas de las 5 respuestas suman al área principal. */
  supportingAnswers: number;
  /** Resumen de todas las respuestas, en orden. */
  answerSummary: { question: string; answer: string }[];
};

/** Nombre corto de cada pregunta, usado en la explicación y en el mensaje de WhatsApp. */
export const QUESTION_SHORT: Record<string, string> = {
  origen: "Cómo llegan tus clientes",
  publicidad: "Publicidad digital",
  respuesta: "Atención a solicitudes",
  cotizaciones: "Medición de cotizaciones",
  desafio: "Principal desafío",
};

const AREA_ORDER: Area[] = ["atraccion", "conversion", "confianza", "direccion"];

/** Mapea el desafío declarado a un área para desempatar. */
const CHALLENGE_AREA: Record<string, Area> = {
  prospectos: "atraccion",
  convertir: "conversion",
  confianza: "confianza",
  procesos: "direccion",
  "no-se": "direccion",
};

export function computeResult(answers: Answers): DiagnosticResult {
  const scores: Record<Area, number> = { atraccion: 0, conversion: 0, confianza: 0, direccion: 0 };
  const signals: string[] = [];

  for (const q of QUESTIONS) {
    const opt = q.options.find((o) => o.id === answers[q.id]);
    if (!opt) continue;
    for (const [area, w] of Object.entries(opt.weights) as [Area, number][]) scores[area] += w;
    if (opt.signal) signals.push(opt.signal);
  }

  const tieBreaker = CHALLENGE_AREA[answers.desafio] ?? "direccion";
  const ranked = [...AREA_ORDER].sort((a, b) => {
    const diff = scores[b] - scores[a];
    if (diff !== 0) return diff;
    if (a === tieBreaker) return -1;
    if (b === tieBreaker) return 1;
    return AREA_ORDER.indexOf(a) - AREA_ORDER.indexOf(b);
  });

  const total = Object.values(scores).reduce((s, v) => s + v, 0);
  const distribution = AREA_ORDER.reduce(
    (acc, a) => ({ ...acc, [a]: total === 0 ? 25 : Math.round((scores[a] / total) * 100) }),
    {} as Record<Area, number>,
  );

  const primary = total === 0 ? tieBreaker : ranked[0];
  const secondCandidate = ranked.find((a) => a !== primary) ?? null;
  const secondary = secondCandidate && scores[secondCandidate] > 0 ? secondCandidate : null;

  const challenge = QUESTIONS[4].options.find((o) => o.id === answers.desafio);

  const answerSummary: { question: string; answer: string }[] = [];
  const reasonsAll: { question: string; answer: string; weight: number }[] = [];
  for (const q of QUESTIONS) {
    const opt = q.options.find((o) => o.id === answers[q.id]);
    if (!opt) continue;
    answerSummary.push({ question: QUESTION_SHORT[q.id], answer: opt.label });
    const w = opt.weights[primary] ?? 0;
    if (w > 0) reasonsAll.push({ question: QUESTION_SHORT[q.id], answer: opt.label, weight: w });
  }
  const reasons = [...reasonsAll].sort((a, b) => b.weight - a.weight).slice(0, 3);

  return {
    reasons,
    supportingAnswers: reasonsAll.length,
    answerSummary,
    primary,
    secondary,
    scores,
    distribution,
    signals: signals.slice(0, 4),
    challengeLabel: challenge?.label ?? "",
  };
}

export function resultShareText(r: DiagnosticResult, siteUrl: string): string {
  const p = AREAS[r.primary];
  const s = r.secondary ? ` y, en segundo lugar, ${AREAS[r.secondary].label.toLowerCase()}` : "";
  return `Hice la evaluación de PYMEmkt: mi principal área de oportunidad podría ser ${p.label.toUpperCase()}${s}. Es un resultado preliminar; puedes hacer la tuya aquí: ${siteUrl}/#diagnostico`;
}

/** Mensaje prellenado para solicitar el diagnóstico por WhatsApp con el resultado del visitante. */
export function resultRequestText(r: DiagnosticResult): string {
  const p = AREAS[r.primary];
  const lines = [
    "Hola, PYMEmkt. Hice la evaluación en su sitio y me interesa un diagnóstico personalizado.",
    "",
    `Resultado preliminar: ${p.label.toUpperCase()}${r.secondary ? ` (seguido de ${AREAS[r.secondary].label})` : ""}`,
    "",
    "Mis respuestas:",
    ...r.answerSummary.map((a) => `• ${a.question}: ${a.answer}`),
  ];
  return lines.join("\n");
}

/** Explicación breve, en una frase, de por qué se obtuvo el resultado. */
export function resultWhy(r: DiagnosticResult): string {
  const area = AREAS[r.primary].label.toLowerCase();
  if (r.supportingAnswers === 0) {
    return `Tus respuestas no muestran señales fuertes en ningún área; por tu desafío declarado, el punto de partida sería ${area}.`;
  }
  const n = r.supportingAnswers;
  return `${n} de tus 5 respuestas ${n === 1 ? "suma" : "suman"} señales hacia ${area}; es el área que concentra más peso en tu evaluación.`;
}
