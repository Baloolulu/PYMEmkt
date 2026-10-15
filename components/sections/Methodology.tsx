"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { STAGES } from "@/lib/content";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/Reveal";
import { track } from "@/lib/analytics";
import { A3Demo } from "./A3Demo";

const ease = [0.22, 1, 0.36, 1] as const;
const R = 132;
const C = 170;

function point(i: number, n: number, r = R) {
  const a = (i / n) * Math.PI * 2 - Math.PI / 2;
  return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) };
}

function CycleVisual({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  const n = STAGES.length;
  const circumference = 2 * Math.PI * R;
  const frac = (active + 1) / n;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px]">
      <svg viewBox="0 0 340 340" className="h-full w-full" aria-hidden>
        <circle cx={C} cy={C} r={R} fill="none" stroke="rgba(11,15,25,0.08)" strokeWidth="1.5" />
        <circle cx={C} cy={C} r={R - 34} fill="none" stroke="rgba(11,15,25,0.06)" strokeDasharray="2 6" />
        <motion.circle
          cx={C}
          cy={C}
          r={R}
          fill="none"
          stroke="#2563EB"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: circumference * (1 - frac) }}
          transition={{ duration: 0.7, ease }}
          transform={`rotate(-90 ${C} ${C})`}
        />
      </svg>

      {STAGES.map((s, i) => {
        const p = point(i, n);
        const on = i === active;
        const done = i < active;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(i)}
            aria-label={`Etapa ${s.index}: ${s.title}`}
            aria-current={on ? "step" : undefined}
            className={`absolute grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border font-mono text-xs transition-all duration-300 ${
              on
                ? "scale-110 border-electric bg-electric text-white shadow-[0_0_0_6px_rgba(37,99,235,0.15)]"
                : done
                  ? "border-electric/40 bg-white text-electric"
                  : "border-ink/10 bg-white text-ink/45 hover:border-ink/30"
            }`}
            style={{ left: `${(p.x / 340) * 100}%`, top: `${(p.y / 340) * 100}%` }}
          >
            {s.index}
          </button>
        );
      })}

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ink/40">Growth A3</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="display mt-2 max-w-44 text-xl leading-tight text-ink sm:text-2xl sm:leading-8"
          >
            {STAGES[active].title}
          </motion.span>
        </AnimatePresence>
        <span className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-electric">
          {active === STAGES.length - 1 ? "↺ nuevo ciclo" : `etapa ${active + 1} / ${STAGES.length}`}
        </span>
      </div>
    </div>
  );
}

export function Methodology() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(0);

  const select = (i: number) => {
    setActive(i);
    setOpen(i);
    track("method_stage_open", { stage: STAGES[i].id });
  };

  return (
    <section id="metodologia" aria-labelledby="metodologia-title" className="relative overflow-hidden bg-white py-24 sm:py-32">
      <div aria-hidden className="absolute inset-0 bg-grid-light bg-size-[56px_56px] mask-[linear-gradient(to_bottom,black,transparent_60%)]" />
      <div className="container relative">
        <SectionHeader
          id="metodologia-title"
          index="03"
          eyebrow="Metodología Growth A3"
          title={
            <>
              Primero entendemos el problema. <span className="text-ink/35">Después construimos la solución.</span>
            </>
          }
          intro="Growth A3 es nuestra herramienta de análisis estratégico. En una sola hoja se documenta el problema, sus causas, las acciones priorizadas y los indicadores que dirán si funcionaron."
        />

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal>
            <ol className="border-t border-ink/10">
              {STAGES.map((s, i) => {
                const isOpen = open === i;
                return (
                  <li key={s.id} className="border-b border-ink/10">
                    <h3>
                      <button
                        type="button"
                        id={`stage-btn-${s.id}`}
                        aria-expanded={isOpen}
                        aria-controls={`stage-panel-${s.id}`}
                        onClick={() => (isOpen ? setOpen(null) : select(i))}
                        className="group flex w-full items-center gap-5 py-5 text-left sm:gap-7 sm:py-6"
                      >
                        <span
                          className={`font-mono text-sm transition-colors ${active === i ? "text-electric" : "text-ink/35"}`}
                        >
                          {s.index}
                        </span>
                        <span className="flex-1">
                          <span
                            className={`display block text-xl transition-colors sm:text-2xl ${
                              isOpen ? "text-ink" : "text-ink/75 group-hover:text-ink"
                            }`}
                          >
                            {s.title}
                          </span>
                          <span className="mt-1 block text-sm text-ink/50">{s.summary}</span>
                        </span>
                        <span
                          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all ${
                            isOpen ? "border-electric bg-electric text-white" : "border-ink/15 text-ink/50 group-hover:border-ink/40"
                          }`}
                        >
                          {isOpen ? <Minus className="h-4 w-4" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
                        </span>
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`stage-panel-${s.id}`}
                          role="region"
                          aria-labelledby={`stage-btn-${s.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease }}
                          className="overflow-hidden"
                        >
                          <div className="pb-7 pl-9 sm:pl-[3.4rem]">
                            <p className="text-pretty max-w-xl leading-relaxed text-ink/65">{s.detail}</p>
                            <p className="mt-5 font-mono text-[0.64rem] uppercase tracking-[0.16em] text-ink/40">Entregables</p>
                            <ul className="mt-2.5 flex flex-wrap gap-2">
                              {s.outputs.map((o) => (
                                <li key={o} className="rounded-full border border-ink/10 bg-mist px-3 py-1.5 text-[0.82rem] text-ink/75">
                                  {o}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ol>
          </Reveal>

          <Reveal delay={0.1} className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[1.75rem] border border-ink/8 bg-mist/70 p-6 sm:p-10">
              <CycleVisual active={active} onSelect={select} />
              <p className="mx-auto mt-6 max-w-sm text-center text-sm leading-relaxed text-ink/55">
                El ciclo no termina en la optimización: lo aprendido alimenta el siguiente diagnóstico.
              </p>
            </div>
          </Reveal>
        </div>

        <A3Demo active={active} onSelect={setActive} />
      </div>
    </section>
  );
}
