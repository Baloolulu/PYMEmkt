import type { Area } from "./diagnostic";

/* ---------------- Problemas ---------------- */

export type Problem = {
  id: string;
  title: string;
  area: Area;
  question: string;
  explanation: string;
  causes: string[];
};

export const PROBLEMS: Problem[] = [
  {
    id: "prospectos",
    title: "No llegan suficientes prospectos.",
    area: "atraccion",
    question: "¿Sabes cuántas personas nuevas conocen tu empresa cada semana?",
    explanation:
      "Cuando el flujo de prospectos es bajo o irregular, el equipo comercial pasa de la saturación a la espera. El problema rara vez es «falta de redes»: suele ser un mensaje poco claro, el canal equivocado o un público mal definido.",
    causes: ["Público objetivo difuso", "Un solo canal de entrada", "Propuesta de valor genérica"],
  },
  {
    id: "mensajes",
    title: "Recibo mensajes, pero pocas ventas.",
    area: "conversion",
    question: "¿Qué pasa con una conversación después del primer «¿precio?»",
    explanation:
      "Si hay interés pero no hay cierres, la fuga está en el proceso: tiempos de respuesta, calificación de prospectos, guiones de venta o seguimiento. Más tráfico no resuelve una conversión rota; la amplifica.",
    causes: ["Respuestas lentas o inconsistentes", "Prospectos sin calificar", "Sin siguiente paso definido"],
  },
  {
    id: "publicidad",
    title: "Mi publicidad no genera resultados claros.",
    area: "direccion",
    question: "¿Cuánto te cuesta conseguir un cliente con publicidad?",
    explanation:
      "Una campaña puede tener muchos «me gusta» y cero ventas. Sin medición conectada al proceso comercial, la publicidad se evalúa por intuición y el presupuesto se ajusta a ciegas.",
    causes: ["Objetivos de campaña mal elegidos", "Sin rastreo de conversiones", "Métricas de vanidad"],
  },
  {
    id: "recomendaciones",
    title: "Dependo demasiado de recomendaciones.",
    area: "atraccion",
    question: "Si mañana dejaran de recomendarte, ¿de dónde vendría tu próximo cliente?",
    explanation:
      "Las recomendaciones son una señal de calidad, pero no son un sistema. No se pueden acelerar, predecir ni escalar. Crecer exige construir canales propios sin perder lo que ya funciona.",
    causes: ["Sin canales propios de captación", "Presencia digital débil", "Ventas sujetas a ciclos ajenos"],
  },
  {
    id: "cotizaciones",
    title: "Mis cotizaciones no tienen seguimiento.",
    area: "conversion",
    question: "¿Cuántas cotizaciones enviaste el mes pasado que nadie volvió a tocar?",
    explanation:
      "Una cotización sin seguimiento es una venta que se deja en manos del cliente. En muchas empresas, una parte importante de las oportunidades se pierde aquí, no por precio, sino por silencio.",
    causes: ["Sin registro de oportunidades", "Seguimiento según memoria", "Sin fechas de recontacto"],
  },
  {
    id: "acciones",
    title: "No sé qué acciones realmente funcionan.",
    area: "direccion",
    question: "¿Qué decisión comercial tomaste este mes basada en datos?",
    explanation:
      "Sin indicadores, cada acción parece igual de importante y el equipo se dispersa. La dirección comercial empieza por definir qué medir, con qué frecuencia y qué decisión se toma con cada dato.",
    causes: ["Sin indicadores definidos", "Datos en lugares distintos", "Acciones sin hipótesis"],
  },
];

/* ---------------- Metodología Growth A3 ---------------- */

export type Stage = {
  id: string;
  index: string;
  title: string;
  summary: string;
  detail: string;
  outputs: string[];
};

export const STAGES: Stage[] = [
  {
    id: "diagnostico",
    index: "01",
    title: "Diagnóstico",
    summary: "Entender cómo funciona hoy tu sistema comercial.",
    detail:
      "Revisamos de dónde vienen tus clientes, cómo se atienden los prospectos, qué se mide y qué no. Escuchamos al equipo y observamos el proceso real, no el ideal.",
    outputs: ["Mapa del proceso comercial actual", "Inventario de canales y herramientas", "Línea base de indicadores disponibles"],
  },
  {
    id: "causas",
    index: "02",
    title: "Identificación de causas",
    summary: "Separar síntomas de causas raíz.",
    detail:
      "«Vendemos poco» es un síntoma. Con Growth A3 descomponemos el problema hasta encontrar las causas que lo originan: un mensaje confuso, un seguimiento inexistente, un canal mal medido.",
    outputs: ["Árbol de problemas y causas", "Hipótesis verificables", "Puntos de fuga identificados"],
  },
  {
    id: "priorizacion",
    index: "03",
    title: "Priorización",
    summary: "Decidir qué atacar primero y qué puede esperar.",
    detail:
      "No todo se resuelve al mismo tiempo. Evaluamos cada causa por impacto esperado, esfuerzo y urgencia para construir una secuencia de trabajo realista con tus recursos.",
    outputs: ["Matriz de impacto y esfuerzo", "Objetivos por etapa", "Plan de acción secuenciado"],
  },
  {
    id: "sprint",
    index: "04",
    title: "Sprint de implementación",
    summary: "Ejecutar en ciclos cortos con entregables concretos.",
    detail:
      "Trabajamos en sprints con alcance definido: una landing, un flujo de WhatsApp, una campaña, un tablero. Cada sprint termina con algo funcionando, no con una presentación.",
    outputs: ["Entregables funcionando", "Responsables y fechas", "Documentación del cambio"],
  },
  {
    id: "medicion",
    index: "05",
    title: "Medición",
    summary: "Comparar lo que pasó contra lo que esperábamos.",
    detail:
      "Medimos contra la línea base del diagnóstico. Los indicadores se eligen antes de implementar, para que el resultado se evalúe con evidencia y no con percepción.",
    outputs: ["Tablero de indicadores", "Lectura de resultados", "Hipótesis confirmadas o descartadas"],
  },
  {
    id: "optimizacion",
    index: "06",
    title: "Optimización",
    summary: "Ajustar, escalar o descartar con base en datos.",
    detail:
      "Lo que funciona se escala, lo que no se corrige o se elimina. El aprendizaje alimenta el siguiente ciclo del A3: el sistema mejora con cada vuelta.",
    outputs: ["Ajustes priorizados", "Siguiente sprint definido", "Registro de aprendizajes"],
  },
];

/* ---------------- Soluciones ---------------- */

export type Solution = {
  name: string;
  /** El problema de negocio que resuelve, en palabras del empresario. */
  problem: string;
  /** Cómo lo resuelve. */
  description: string;
};
export type SolutionCategory = {
  area: Area;
  label: string;
  question: string;
  /** La oportunidad de mejora que atiende la categoría. */
  summary: string;
  items: Solution[];
};

export const SOLUTION_CATEGORIES: SolutionCategory[] = [
  {
    area: "atraccion",
    label: "Atracción",
    question: "¿Llegan las personas correctas?",
    summary:
      "Para empresas que dependen de pocas fuentes de clientes o tienen semanas buenas y semanas vacías. La oportunidad: un flujo constante y predecible de prospectos calificados.",
    items: [
      {
        name: "Meta Ads",
        problem: "Pocas personas nuevas conocen tu negocio cada semana.",
        description: "Campañas en Facebook e Instagram diseñadas para iniciar conversaciones con tu cliente ideal, no para juntar «me gusta».",
      },
      {
        name: "Google Ads",
        problem: "Tus clientes te buscan, pero encuentran primero a tu competencia.",
        description: "Presencia en el momento en que alguien busca lo que vendes, pagando solo por clics con intención.",
      },
      {
        name: "Contenido estratégico",
        problem: "Los prospectos llegan con las mismas dudas y objeciones.",
        description: "Contenido que responde esas preguntas antes de la venta y acorta el tiempo para decidir.",
      },
      {
        name: "Posicionamiento digital",
        problem: "Dependes de pagar publicidad para que te encuentren.",
        description: "Visibilidad orgánica en buscadores y Google Maps para tu zona y tu categoría.",
      },
    ],
  },
  {
    area: "conversion",
    label: "Conversión",
    question: "¿Las conversaciones se vuelven ventas?",
    summary:
      "Para empresas que reciben mensajes y cotizan, pero cierran poco. La oportunidad: que el interés que ya existe no se pierda entre el primer contacto y el cierre.",
    items: [
      {
        name: "WhatsApp",
        problem: "Respondes tarde o distinto cada vez, y el prospecto se enfría.",
        description: "Flujos de atención, respuestas guía y etiquetas en WhatsApp Business para responder rápido y con consistencia.",
      },
      {
        name: "Landing pages",
        problem: "Tu publicidad lleva a páginas que no piden una acción clara.",
        description: "Páginas enfocadas en una sola acción: solicitar, cotizar o agendar.",
      },
      {
        name: "Automatización",
        problem: "El seguimiento depende de que alguien se acuerde.",
        description: "Recordatorios, respuestas y asignaciones automáticas para que ninguna oportunidad quede sin dueño.",
      },
      {
        name: "Seguimiento comercial",
        problem: "Envías cotizaciones y no sabes cuáles siguen vivas.",
        description: "Registro de oportunidades con etapas, fechas de recontacto y responsables.",
      },
    ],
  },
  {
    area: "confianza",
    label: "Confianza",
    question: "¿Por qué te elegirían a ti?",
    summary:
      "Para empresas que compiten solo por precio o pierden ventas frente a competidores que se ven más sólidos. La oportunidad: que lo que muestras respalde lo que realmente haces.",
    items: [
      {
        name: "Sitios web",
        problem: "Cuando te buscan, no encuentran una razón clara para contactarte.",
        description: "Sitios rápidos y claros que explican qué haces, para quién y cuál es el siguiente paso.",
      },
      {
        name: "Identidad digital",
        problem: "Tu negocio se ve distinto en cada canal y transmite improvisación.",
        description: "Coherencia visual y verbal en redes, sitio, WhatsApp y propuestas.",
      },
      {
        name: "Reseñas",
        problem: "Tus clientes están satisfechos, pero nadie más lo sabe.",
        description: "Un sistema para pedir, responder y mostrar opiniones reales de clientes.",
      },
      {
        name: "Casos de éxito",
        problem: "Tus propuestas dicen lo que harías, no lo que ya hiciste.",
        description: "Documentación de proyectos reales con problema, solución y resultado, con autorización del cliente.",
      },
    ],
  },
  {
    area: "direccion",
    label: "Dirección",
    question: "¿Sabes qué está funcionando?",
    summary:
      "Para empresas que invierten en marketing sin saber qué funciona. La oportunidad: decidir con datos dónde poner el siguiente peso y la siguiente hora de trabajo.",
    items: [
      {
        name: "Growth A3",
        problem: "Atiendes síntomas y el problema regresa.",
        description: "Nuestra herramienta de análisis para pasar de síntomas a causas y de causas a acciones priorizadas.",
      },
      {
        name: "Indicadores",
        problem: "Tienes datos en muchos lugares, pero ninguno te dice qué hacer.",
        description: "Un tablero con las pocas métricas que explican tus ventas y se revisan cada semana.",
      },
      {
        name: "Diagnóstico",
        problem: "No sabes por dónde empezar ni qué es urgente.",
        description: "Una evaluación integral del sistema comercial que identifica dónde se pierden oportunidades.",
      },
      {
        name: "Sprints comerciales",
        problem: "Los proyectos de mejora empiezan con fuerza y se quedan a medias.",
        description: "Ciclos cortos de implementación con objetivo, responsables y medición al cierre.",
      },
    ],
  },
];

/* ---------------- Evidencia ---------------- */

export type CaseStudy = {
  id: string;
  client: string;
  industry: string;
  problem: string;
  causes: string[];
  solution: string[];
  indicators: { label: string; before?: string; after?: string; note?: string }[];
  learnings: string;
  period?: string;
};

/**
 * Casos reales documentados. Se muestran solo si este arreglo tiene elementos.
 * Agrega casos con datos verificables y con autorización del cliente.
 * Ver README → "Agregar casos de implementación".
 */
export const CASES: CaseStudy[] = [];
