"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, FlaskConical, RotateCcw } from "lucide-react";
import { STAGES } from "@/lib/content";
import {
  DEMO_ACTIONS,
  DEMO_BASELINE_FACTS,
  DEMO_CAUSES,
  DEMO_COMPANY,
  DEMO_FUNNEL,
  DEMO_INDICATORS,
  DEMO_NOTES,
  DEMO_RULES,
  DEMO_SPRINT,
} from "@/lib/a3demo";
import { buttonClass } from "../ui/Button";
import { useDiagnostic } from "../DiagnosticContext";
import { track } from "@/lib/analytics";

const ease = [0.22, 1, 0.36, 1] as const;
const label = "font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink/45";

/* ---------- Visuales por etapa ---------- */

function FunnelVisual() {
  const max = DEMO_FUNNEL[0].value;
  return (
    <div>
      <p className="display text-xl leading-snug text-ink sm:text-2xl">{DEMO_COMPANY.symptom}</p>
      <p className={`${label} mt-6`}>Línea base semanal · ficticia</p>
      <div className="mt-3 space-y-2.5">
        {DEMO_FUNNEL.map((f, i) => (
          <div key={f.label} className="grid grid-cols-[minmax(0,9.5rem)_1fr] items-center gap-3 sm:grid-cols-[11rem_1fr]">
            <span className="text-sm text-ink/70">{f.label}</span>
            <span className="relative h-8 overflow-hidden rounded-lg bg-ink/[0.04]">
              <motion.span
                className={`absolute inset-y-0 left-0 rounded-lg ${i === DEMO_FUNNEL.length - 1 ? "bg-electric" : "bg-electric/25"}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.max((f.value / max) * 100, 8)}%` }}
                transition={{ duration: 0.7, delay: 0.1 * i, ease }}
              />
              <span className="absolute inset-y-0 left-3 flex items-center font-mono text-sm font-medium tabular-nums text-ink">
                {f.value}
              </span>
            </span>
          </div>
        ))}
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-3">
        {DEMO_BASELINE_FACTS.map((f) => (
          <div key={f.label} className="rounded-xl border border-ink/[0.08] bg-white p-3">
            <dt className="text-xs text-ink/50">{f.label}</dt>
            <dd className="mt-1 font-medium text-ink">{f.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function CausesVisual() {
  return (
    <div>
      <div className="mx-auto max-w-sm rounded-xl bg-ink px-4 py-3 text-center text-sm text-white">
        <span className="block font-mono text-[0.58rem] uppercase tracking-[0.16em] text-white/45">Síntoma</span>
        Las ventas no crecen aunque llegan mensajes
      </div>
      <div aria-hidden className="mx-auto h-5 w-px bg-ink/20" />
      <div aria-hidden className="mx-auto hidden h-px w-3/4 bg-ink/20 sm:block" />
      <ul className="mt-0 grid gap-2.5 sm:mt-4 sm:grid-cols-2">
        {DEMO_CAUSES.map((c, i) => (
          <motion.li
            key={c.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 * i, ease }}
            className={`rounded-xl border p-3.5 ${c.root ? "border-electric/40 bg-electric/[0.06]" : "border-ink/[0.08] bg-white"}`}
          >
            <span className="flex items-start justify-between gap-2">
              <span className="text-[0.92rem] font-medium text-ink">{c.title}</span>
              {c.root && (
                <span className="shrink-0 rounded-full bg-electric px-2 py-0.5 font-mono text-[0.56rem] uppercase tracking-[0.1em] text-white">
                  Causa raíz
                </span>
              )}
            </span>
            <span className="mt-1 block text-[0.82rem] leading-relaxed text-ink/55">{c.evidence}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function PriorityVisual() {
  return (
    <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] sm:items-center">
      <figure aria-label="Matriz de impacto y esfuerzo con cinco acciones del caso ficticio">
        <div className="relative ml-6 aspect-square w-[calc(100%-1.5rem)] max-w-[320px] rounded-xl border border-ink/10 bg-white">
          <div aria-hidden className="absolute inset-0 grid grid-cols-2 grid-rows-2">
            <span className="flex items-start p-2 font-mono text-[0.55rem] uppercase tracking-[0.1em] text-electric bg-electric/[0.06] rounded-tl-xl">Hacer primero</span>
            <span className="flex items-start justify-end border-l border-ink/10 p-2 font-mono text-[0.55rem] uppercase tracking-[0.1em] text-ink/40">Planear</span>
            <span className="flex items-end border-t border-ink/10 p-2 font-mono text-[0.55rem] uppercase tracking-[0.1em] text-ink/40">Si sobra tiempo</span>
            <span className="flex items-end justify-end border-l border-t border-ink/10 p-2 font-mono text-[0.55rem] uppercase tracking-[0.1em] text-ink/40">Descartar por ahora</span>
          </div>
          {DEMO_ACTIONS.map((a, i) => (
            <motion.span
              key={a.id}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.08 * i, ease }}
              className={`absolute grid h-8 w-8 place-items-center rounded-full font-mono text-xs font-semibold shadow-sm ${
                a.impact >= 60 && a.effort < 50 ? "bg-electric text-white" : "border border-ink/15 bg-white text-ink"
              }`}
              style={{ left: `calc(${a.effort}% - 1rem)`, top: `calc(${100 - a.impact}% - 1rem)` }}
            >
              {a.id}
            </motion.span>
          ))}
          <span aria-hidden className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap font-mono text-[0.55rem] uppercase tracking-[0.14em] text-ink/45">
            Impacto →
          </span>
        </div>
        <figcaption className="ml-5 mt-2 text-right font-mono text-[0.55rem] uppercase tracking-[0.14em] text-ink/45">Esfuerzo →</figcaption>
      </figure>
      <ol className="space-y-1.5">
        {DEMO_ACTIONS.map((a) => (
          <li key={a.id} className="flex items-center gap-3 text-sm text-ink/75">
            <span
              className={`grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-[0.68rem] font-semibold ${
                a.impact >= 60 && a.effort < 50 ? "bg-electric text-white" : "border border-ink/15 text-ink"
              }`}
            >
              {a.id}
            </span>
            {a.label}
          </li>
        ))}
      </ol>
    </div>
  );
}

function SprintVisual() {
  const days = Array.from({ length: 10 }, (_, i) => i + 1);
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[300px]">
        <div className="grid grid-cols-[minmax(0,8.5rem)_1fr] gap-3 sm:grid-cols-[13rem_1fr]">
          <span className={label}>Tarea · responsable</span>
          <div className="grid grid-cols-10">
            {days.map((d) => (
              <span key={d} className="text-center font-mono text-[0.58rem] tabular-nums text-ink/40">
                {d}
              </span>
            ))}
          </div>
        </div>
        <ul className="mt-2 space-y-2">
          {DEMO_SPRINT.map((t, i) => (
            <li key={t.task} className="grid grid-cols-[minmax(0,8.5rem)_1fr] items-center gap-3 sm:grid-cols-[13rem_1fr]">
              <span className="min-w-0">
                <span className="block text-[0.82rem] leading-tight text-ink sm:text-sm">{t.task}</span>
                <span className="block text-[0.7rem] text-ink/45">{t.owner}</span>
              </span>
              <span className="relative grid h-7 grid-cols-10 rounded-md bg-ink/[0.035]">
                {days.slice(1).map((d) => (
                  <span key={d} aria-hidden className="absolute inset-y-0 border-l border-ink/[0.06]" style={{ left: `${(d - 1) * 10}%` }} />
                ))}
                <span
                  className="absolute inset-y-1 px-0.5"
                  style={{ left: `${(t.from - 1) * 10}%`, width: `${(t.to - t.from + 1) * 10}%` }}
                >
                  <motion.span
                    className="block h-full rounded bg-electric"
                    style={{ originX: 0 }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: 0.08 * i, ease }}
                  />
                </span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-right font-mono text-[0.58rem] uppercase tracking-[0.14em] text-ink/40">Días hábiles del sprint</p>
      </div>
    </div>
  );
}

function MeasureVisual() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-0 text-left text-sm">
        <thead>
          <tr>
            {["Indicador", "Línea base (ficticia)", "Meta", "Frecuencia"].map((h, i) => (
              <th key={h} scope="col" className={`${label} border-b border-ink/10 pb-2 pr-3 font-normal ${i === 3 ? "hidden sm:table-cell" : ""}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DEMO_INDICATORS.map((r) => (
            <tr key={r.name}>
              <th scope="row" className="border-b border-ink/[0.06] py-3 pr-3 font-medium text-ink">
                {r.name}
              </th>
              <td className="border-b border-ink/[0.06] py-3 pr-3 tabular-nums text-ink/60">{r.baseline}</td>
              <td className="border-b border-ink/[0.06] py-3 pr-3 font-medium text-electric">{r.target}</td>
              <td className="hidden border-b border-ink/[0.06] py-3 text-ink/60 sm:table-cell">{r.cadence}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OptimizeVisual({ onRestart }: { onRestart: () => void }) {
  return (
    <div>
      <ul className="space-y-2.5">
        {DEMO_RULES.map((r, i) => (
          <motion.li
            key={r.if}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.08 * i, ease }}
            className="grid gap-1 rounded-xl border border-ink/[0.08] bg-white p-3.5 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center sm:gap-3"
          >
            <span className="text-sm text-ink/70">
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-ink/40">Si </span>
              {r.if}
            </span>
            <ArrowRight className="hidden h-4 w-4 text-electric sm:block" aria-hidden />
            <span className="text-sm font-medium text-ink">
              <span className="font-mono text-[0.6rem] font-normal uppercase tracking-[0.12em] text-electric sm:hidden">Entonces </span>
              {r.then}
            </span>
          </motion.li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onRestart}
        className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-electric hover:underline"
      >
        <RotateCcw className="h-4 w-4" aria-hidden />
        El aprendizaje inicia un nuevo ciclo: volver a 01
      </button>
    </div>
  );
}

/* ---------- Componente ---------- */

export function A3Demo({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const tablist = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const fromNav = useRef(false);
  const { requestDiagnostic } = useDiagnostic();

  // Mantiene visible la pestaña activa (móvil) y, si se avanzó con los botones,
  // regresa al inicio de la hoja cuando quedó arriba de la pantalla.
  useEffect(() => {
    const list = tablist.current;
    const tab = tabs.current[active];
    if (list && tab) {
      const left = tab.offsetLeft - list.clientWidth / 2 + tab.clientWidth / 2;
      list.scrollTo({ left: Math.max(left, 0), behavior: "smooth" });
    }
    if (fromNav.current && sheet.current) {
      fromNav.current = false;
      const top = sheet.current.getBoundingClientRect().top;
      if (top < 0) {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: window.scrollY + top - 80, behavior: reduce ? "auto" : "smooth" });
      }
    }
  }, [active]);
  const stage = STAGES[active];
  const note = DEMO_NOTES[active];
  const last = active === STAGES.length - 1;

  const go = (i: number, source: string) => {
    if (source === "next" || source === "prev" || source === "restart") fromNav.current = true;
    onSelect(i);
    track("a3_demo_step", { stage: STAGES[i].id, source });
  };

  const onKey = (e: React.KeyboardEvent) => {
    const n = STAGES.length;
    let next = -1;
    if (e.key === "ArrowRight") next = (active + 1) % n;
    if (e.key === "ArrowLeft") next = (active - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next >= 0) {
      e.preventDefault();
      go(next, "keyboard");
      tabs.current[next]?.focus();
    }
  };

  const visuals = [
    <FunnelVisual key="f" />,
    <CausesVisual key="c" />,
    <PriorityVisual key="p" />,
    <SprintVisual key="s" />,
    <MeasureVisual key="m" />,
    <OptimizeVisual key="o" onRestart={() => go(0, "restart")} />,
  ];

  return (
    <div className="mt-16 lg:mt-24" aria-labelledby="a3demo-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-50 px-3 py-1 font-mono text-[0.62rem] font-medium uppercase tracking-[0.14em] text-amber-800">
            <FlaskConical className="h-3.5 w-3.5" aria-hidden />
            Demostración · caso hipotético
          </p>
          <h3 id="a3demo-title" className="display mt-4 text-3xl leading-tight text-ink sm:text-[2.4rem]">
            Así se ve Growth A3 aplicado a una empresa.
          </h3>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-ink/55">
          Empresa, cifras y decisiones son ficticias, creadas para mostrar el método. No es un cliente ni un resultado real.
        </p>
      </div>

      <div ref={sheet} className="mt-8 overflow-hidden rounded-[1.75rem] border border-ink/[0.1] bg-mist/80 shadow-[0_30px_80px_-50px_rgba(11,15,25,0.35)]">
        {/* encabezado de la hoja */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/[0.08] bg-white px-5 py-3.5 sm:px-7">
          <span className="font-medium text-ink">
            Hoja A3 · {DEMO_COMPANY.name}
            <span className="block text-sm font-normal text-ink/45 sm:ml-2 sm:inline">{DEMO_COMPANY.profile}</span>
          </span>
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink/40">Datos ficticios</span>
        </div>

        {/* etapas */}
        <div
          ref={tablist}
          role="tablist"
          aria-label="Etapas de la demostración"
          onKeyDown={onKey}
          className="flex snap-x gap-1.5 overflow-x-auto border-b border-ink/[0.08] bg-white/60 px-3 py-2.5 [scrollbar-width:none] sm:px-5"
        >
          {STAGES.map((s, i) => {
            const on = i === active;
            return (
              <button
                key={s.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`a3tab-${s.id}`}
                aria-selected={on}
                aria-controls="a3demo-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => go(i, "tab")}
                className={`flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-full px-3.5 text-sm transition-colors ${
                  on
                    ? "bg-ink text-white"
                    : i < active
                      ? "text-electric hover:bg-electric/[0.06]"
                      : "text-ink/55 hover:bg-ink/[0.05] hover:text-ink"
                }`}
              >
                <span className="font-mono text-[0.68rem]">{s.index}</span>
                {s.title}
              </button>
            );
          })}
        </div>

        <div id="a3demo-panel" role="tabpanel" aria-labelledby={`a3tab-${stage.id}`} className="p-5 sm:p-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease }}
              className="grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.85fr)] lg:gap-12"
            >
              <div className="min-w-0">{visuals[active]}</div>
              <aside className="min-w-0 lg:border-l lg:border-ink/[0.08] lg:pl-10">
                <p className={label}>Etapa {stage.index} · {stage.title}</p>
                <p className="display mt-3 text-2xl leading-tight text-ink">{note.question}</p>
                <p className="mt-3 leading-relaxed text-ink/65">{note.focus}</p>
                <p className="mt-4 border-l-2 border-electric pl-4 text-[0.92rem] leading-relaxed text-ink/70">{note.note}</p>
              </aside>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* navegación */}
        <div className="flex items-center justify-between gap-3 border-t border-ink/[0.08] bg-white px-4 py-4 sm:px-8">
          <button
            type="button"
            onClick={() => go(Math.max(active - 1, 0), "prev")}
            disabled={active === 0}
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm text-ink/60 transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            <span className="sr-only sm:not-sr-only">Anterior</span>
          </button>
          <span className="font-mono text-xs tabular-nums text-ink/40" aria-live="polite">
            {active + 1} / {STAGES.length}
          </span>
          {last ? (
            <button
              type="button"
              onClick={() => {
                track("cta_click", { location: "a3_demo_end" });
                requestDiagnostic("Interés: Growth A3");
              }}
              className={buttonClass("primary", "md")}
            >
              Quiero esto para mi empresa
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => go(active + 1, "next")}
              className={buttonClass("dark", "md")}
            >
              Siguiente etapa
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
