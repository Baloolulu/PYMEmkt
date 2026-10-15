"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Clock, Info, ListChecks, MessageCircle, RotateCcw, Share2, ShieldCheck } from "lucide-react";
import {
  AREAS,
  QUESTIONS,
  computeResult,
  resultRequestText,
  resultShareText,
  resultWhy,
  type Answers,
  type Area,
  type DiagnosticResult,
} from "@/lib/diagnostic";
import { siteConfig } from "@/lib/config";
import { DEFAULT_WA_MESSAGE, isWhatsAppDemo, whatsappLink, whatsappShareLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/Reveal";
import { Button, buttonClass } from "../ui/Button";
import { useDiagnostic } from "../DiagnosticContext";

type Phase = "intro" | "questions" | "result";
const ease = [0.22, 1, 0.36, 1] as const;
const AREA_KEYS: Area[] = ["atraccion", "conversion", "confianza", "direccion"];

export function Diagnostic() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setLocalResult] = useState<DiagnosticResult | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const { setResult, requestDiagnostic } = useDiagnostic();

  const q = QUESTIONS[step];
  const progress = phase === "result" ? 100 : phase === "intro" ? 0 : (step / QUESTIONS.length) * 100;

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // En móvil, si el inicio de la tarjeta quedó fuera de la pantalla, la traemos a la vista.
    const card = cardRef.current;
    if (card) {
      const top = card.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight * 0.6) {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: window.scrollY + top - 80, behavior: reduce ? "auto" : "smooth" });
      }
    }
    const t = window.setTimeout(() => headingRef.current?.focus({ preventScroll: true }), 120);
    return () => window.clearTimeout(t);
  }, [phase, step]);

  const start = () => {
    setPhase("questions");
    setStep(0);
    setDir(1);
    track("diagnostic_start");
  };

  const finish = (a: Answers) => {
    const r = computeResult(a);
    setLocalResult(r);
    setResult(r);
    setPhase("result");
    track("diagnostic_complete", { area: r.primary, secondary: r.secondary ?? "ninguna" });
  };

  const advancing = useRef(false);

  const choose = (optionId: string) => {
    if (advancing.current) return;
    advancing.current = true;
    const next = { ...answers, [q.id]: optionId };
    setAnswers(next);
    track("diagnostic_step", { question: q.id, answer: optionId, step: step + 1 });
    window.setTimeout(() => {
      advancing.current = false;
      setDir(1);
      if (step < QUESTIONS.length - 1) setStep(step + 1);
      else finish(next);
    }, 260);
  };

  const back = () => {
    setDir(-1);
    if (phase === "result") {
      setPhase("questions");
      setStep(QUESTIONS.length - 1);
    } else if (step > 0) setStep(step - 1);
    else setPhase("intro");
  };

  const forward = () => {
    if (!answers[q.id]) return;
    setDir(1);
    if (step < QUESTIONS.length - 1) setStep(step + 1);
    else finish(answers);
  };

  const reset = () => {
    setAnswers({});
    setLocalResult(null);
    setResult(null);
    setStep(0);
    setDir(-1);
    setPhase("intro");
  };

  const shareHref = useMemo(
    () => (result ? whatsappShareLink(resultShareText(result, siteConfig.url)) : "#"),
    [result],
  );
  const requestHref = useMemo(() => (result ? whatsappLink(resultRequestText(result)) : null), [result]);
  const directHref = whatsappLink(DEFAULT_WA_MESSAGE);

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 36 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d * -36 }),
  };

  return (
    <section id="diagnostico" aria-labelledby="diagnostico-title" className="noise relative isolate overflow-hidden bg-ink py-24 text-white sm:py-32">
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-60 bg-size-[56px_56px] mask-[radial-gradient(ellipse_at_70%_50%,black,transparent_70%)]" />
      <div aria-hidden className="absolute right-[-10%] top-1/3 -z-10 hidden h-[520px] w-[520px] rounded-full bg-electric/20 blur-[120px] sm:block" />

      <div className="container grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader
            id="diagnostico-title"
            tone="dark"
            index="02"
            eyebrow="Evaluación interactiva"
            title="Descubre dónde podría estar frenándose el crecimiento de tu empresa."
            intro="Cinco preguntas para identificar, de forma preliminar, el área donde podría estar tu mayor oportunidad."
          />
          <Reveal delay={0.1} className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              { Icon: ListChecks, t: "5 preguntas", d: "Una por pantalla" },
              { Icon: Clock, t: "Aprox. 1 minuto", d: "Sin registro previo" },
              { Icon: ShieldCheck, t: "Orientativa", d: "No es un diagnóstico final" },
            ].map(({ Icon, t, d }) => (
              <div key={t} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/3 p-4">
                <Icon className="h-5 w-5 shrink-0 text-electric-400" aria-hidden />
                <div>
                  <p className="text-sm font-medium text-white">{t}</p>
                  <p className="text-xs text-white/45">{d}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal delay={0.05}>
          <div ref={cardRef} className="glass relative overflow-hidden rounded-[1.75rem] shadow-[0_40px_120px_-50px_rgba(37,99,235,0.6)]">
            {/* progreso */}
            <div className="border-b border-white/8 px-5 py-4 sm:px-8">
              <div className="flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-[0.16em] text-white/45">
                <span aria-live="polite">
                  {phase === "intro" && "Listo para comenzar"}
                  {phase === "questions" && `Pregunta ${step + 1} de ${QUESTIONS.length}`}
                  {phase === "result" && "Resultado preliminar"}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div
                className="mt-3 h-1 overflow-hidden rounded-full bg-white/8"
                role="progressbar"
                aria-label="Avance de la evaluación"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
              >
                <motion.div
                  className="h-full rounded-full bg-linear-to-r from-electric to-electric-400"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease }}
                />
              </div>
            </div>

            <div className="relative min-h-[520px] px-5 py-8 sm:min-h-[540px] sm:px-8 sm:py-10">
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                {phase === "intro" && (
                  <motion.div
                    key="intro"
                    custom={dir}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease }}
                    className="flex h-full flex-col"
                  >
                    <h3 ref={headingRef} tabIndex={-1} className="display text-3xl leading-tight outline-hidden sm:text-4xl sm:leading-10">
                      ¿Qué está frenando tu crecimiento?
                    </h3>
                    <p className="text-pretty mt-4 max-w-md leading-relaxed text-white/60">
                      Al final verás cuál de estas cuatro áreas concentra más señales en tu caso, y qué revisaríamos
                      primero.
                    </p>
                    <ul className="mt-8 grid grid-cols-2 gap-3">
                      {AREA_KEYS.map((a, i) => (
                        <li key={a} className="rounded-2xl border border-white/8 bg-white/3 p-4">
                          <span className="font-mono text-[0.62rem] text-white/35">0{i + 1}</span>
                          <p className="mt-1 font-mono text-[0.78rem] font-medium tracking-[0.14em] text-white">
                            {AREAS[a].short}
                          </p>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-10">
                      <Button variant="primary" size="lg" onClick={start} className="w-full sm:w-auto">
                        Comenzar evaluación
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </Button>
                    </div>
                    {directHref ? (
                      <a
                        href={directHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => track("whatsapp_click", { location: "diagnostic_intro_direct" })}
                        className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline"
                      >
                        <MessageCircle className="h-4 w-4 text-[#25D366]" aria-hidden />
                        ¿Prefieres hablar directo? Escríbenos por WhatsApp
                      </a>
                    ) : (
                      <a
                        href="#contacto"
                        onClick={() => track("cta_click", { location: "diagnostic_intro_direct" })}
                        className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline"
                      >
                        ¿Prefieres hablar directo? Solicita tu diagnóstico sin cuestionario
                      </a>
                    )}
                  </motion.div>
                )}

                {phase === "questions" && (
                  <motion.fieldset
                    key={q.id}
                    aria-labelledby="q-title"
                    custom={dir}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease }}
                  >
                    <h3 id="q-title" ref={headingRef} tabIndex={-1} className="display text-[1.7rem] leading-tight outline-hidden sm:text-[2.1rem]">
                      {q.title}
                    </h3>
                    <p className="mt-3 text-sm text-white/45">{q.helper}</p>

                    <div className="mt-7 grid gap-2.5">
                      {q.options.map((o, i) => {
                        const sel = answers[q.id] === o.id;
                        return (
                          <button
                            key={o.id}
                            type="button"
                            aria-pressed={sel}
                            onClick={() => choose(o.id)}
                            className={`group flex min-h-14 w-full items-center gap-4 rounded-2xl border px-4 py-3 text-left transition-all duration-200 sm:px-5 ${
                              sel
                                ? "border-electric-400 bg-electric/20 text-white"
                                : "border-white/10 bg-white/2.5 text-white/85 hover:border-white/25 hover:bg-white/6"
                            }`}
                          >
                            <span
                              className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border font-mono text-[0.7rem] transition-colors ${
                                sel ? "border-electric-400 bg-electric text-white" : "border-white/15 text-white/45 group-hover:border-white/30"
                              }`}
                            >
                              {sel ? <Check className="h-3.5 w-3.5" aria-hidden /> : String.fromCharCode(65 + i)}
                            </span>
                            <span className="text-[0.98rem]">{o.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={back}
                        className="-ml-3 inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm text-white/60 transition-colors hover:text-white"
                      >
                        <ArrowLeft className="h-4 w-4" aria-hidden />
                        Regresar
                      </button>
                      {answers[q.id] && (
                        <button
                          type="button"
                          onClick={forward}
                          className="-mr-3 inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm text-electric-300 transition-colors hover:text-white"
                        >
                          Siguiente
                          <ArrowRight className="h-4 w-4" aria-hidden />
                        </button>
                      )}
                    </div>
                  </motion.fieldset>
                )}

                {phase === "result" && result && (
                  <motion.div
                    key="result"
                    custom={dir}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4, ease }}
                  >
                    <p className="text-sm text-white/55">Tu principal área de oportunidad podría ser…</p>
                    <h3
                      ref={headingRef}
                      tabIndex={-1}
                      className="display text-gradient mt-2 text-5xl leading-none outline-hidden sm:text-6xl sm:leading-none"
                    >
                      {AREAS[result.primary].label}
                    </h3>
                    {result.secondary && (
                      <p className="mt-3 text-sm text-white/55">
                        Seguida de <span className="text-white">{AREAS[result.secondary].label.toLowerCase()}</span>.
                      </p>
                    )}
                    <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/8 px-3 py-1.5 text-xs text-amber-100/90">
                      <Info className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      Evaluación preliminar, no un diagnóstico definitivo
                    </p>

                    {/* distribución de señales */}
                    <div className="mt-7 space-y-2.5" aria-label="Distribución de señales por área">
                      {AREA_KEYS.map((a, i) => (
                        <div key={a} className="grid grid-cols-[6.5rem_1fr_2.5rem] items-center gap-3">
                          <span className={`font-mono text-[0.66rem] tracking-[0.12em] ${a === result.primary ? "text-white" : "text-white/45"}`}>
                            {AREAS[a].short}
                          </span>
                          <span className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                            <motion.span
                              className={`block h-full rounded-full ${a === result.primary ? "bg-linear-to-r from-electric to-electric-400" : "bg-white/25"}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${result.distribution[a]}%` }}
                              transition={{ duration: 0.9, delay: 0.15 + i * 0.08, ease }}
                            />
                          </span>
                          <span className="text-right font-mono text-[0.7rem] text-white/45">{result.distribution[a]}%</span>
                        </div>
                      ))}
                      <p className="pt-1 text-[0.72rem] text-white/35">Peso relativo de las señales según tus respuestas.</p>
                    </div>

                    <p className="text-pretty mt-7 leading-relaxed text-white/75">{AREAS[result.primary].description}</p>

                    <div className="mt-7">
                      <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-white/40">Por qué obtuviste este resultado</p>
                      <p className="mt-3 text-[0.95rem] leading-relaxed text-white/80">{resultWhy(result)}</p>
                      {result.reasons.length > 0 && (
                        <ul className="mt-4 grid gap-2">
                          {result.reasons.map((r) => (
                            <li
                              key={r.question}
                              className="flex flex-col gap-0.5 rounded-xl border border-white/8 bg-white/2.5 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                            >
                              <span className="font-mono text-[0.64rem] uppercase tracking-[0.12em] text-white/45">{r.question}</span>
                              <span className="text-[0.92rem] text-white">{r.answer}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {result.signals.length > 0 && (
                        <ul className="mt-4 space-y-2">
                          {result.signals.slice(0, 3).map((sig) => (
                            <li key={sig} className="flex gap-3 text-[0.9rem] leading-relaxed text-white/65">
                              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-electric-400" />
                              {sig}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="mt-6 rounded-2xl border border-white/8 bg-white/3 p-5">
                      <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-white/40">Qué revisaríamos primero</p>
                      <ul className="mt-3 space-y-1.5">
                        {AREAS[result.primary].focus.map((f) => (
                          <li key={f} className="flex gap-2.5 text-[0.92rem] text-white/80">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-electric-400" aria-hidden />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <p className="mt-5 text-xs leading-relaxed text-white/40">
                      Este es un resultado preliminar basado en cinco respuestas. No sustituye un diagnóstico: para
                      confirmarlo necesitamos conocer tu proceso, tus datos y tu equipo.
                    </p>

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      {requestHref ? (
                        <a
                          href={requestHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            track("diagnostic_request", { area: result.primary, channel: "whatsapp" });
                            track("whatsapp_click", { location: "diagnostic_result", area: result.primary });
                          }}
                          className={buttonClass("primary", "lg")}
                        >
                          <MessageCircle className="h-4 w-4" aria-hidden />
                          Solicitar diagnóstico por WhatsApp
                        </a>
                      ) : (
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={() => {
                            track("diagnostic_request", { area: result.primary, channel: "form" });
                            requestDiagnostic(`Evaluación: ${AREAS[result.primary].label}`);
                          }}
                        >
                          Solicitar diagnóstico personalizado
                          <ArrowRight className="h-4 w-4" aria-hidden />
                        </Button>
                      )}
                      {requestHref && (
                        <Button
                          variant="glass"
                          size="lg"
                          onClick={() => {
                            track("diagnostic_request", { area: result.primary, channel: "form" });
                            requestDiagnostic(`Evaluación: ${AREAS[result.primary].label}`);
                          }}
                        >
                          Prefiero dejar mis datos
                        </Button>
                      )}
                    </div>
                    {requestHref && (
                      <p className="mt-3 text-xs text-white/40">
                        {isWhatsAppDemo
                          ? "Vista previa: el mensaje se abre en WhatsApp para revisarlo; en el sitio publicado llegará al número de PYMEmkt."
                          : "Se abre WhatsApp con tu resultado ya escrito; solo tienes que enviarlo."}
                      </p>
                    )}
                    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1">
                      <a
                        href={shareHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => track("whatsapp_click", { location: "diagnostic_share", area: result.primary })}
                        className="inline-flex min-h-11 items-center gap-2 text-sm text-white/50 hover:text-white"
                      >
                        <Share2 className="h-4 w-4" aria-hidden /> Compartir resultado
                      </a>
                      <button type="button" onClick={back} className="inline-flex min-h-11 items-center gap-2 text-sm text-white/50 hover:text-white">
                        <ArrowLeft className="h-4 w-4" aria-hidden /> Cambiar respuestas
                      </button>
                      <button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 text-sm text-white/50 hover:text-white">
                        <RotateCcw className="h-4 w-4" aria-hidden /> Repetir
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
