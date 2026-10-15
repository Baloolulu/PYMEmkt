"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Compass, Magnet, MessagesSquare } from "lucide-react";
import { SOLUTION_CATEGORIES } from "@/lib/content";
import type { Area } from "@/lib/diagnostic";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/Reveal";
import { buttonClass } from "../ui/Button";
import { useDiagnostic } from "../DiagnosticContext";
import { track } from "@/lib/analytics";

const ease = [0.22, 1, 0.36, 1] as const;

const ICONS: Record<Area, typeof Magnet> = {
  atraccion: Magnet,
  conversion: MessagesSquare,
  confianza: BadgeCheck,
  direccion: Compass,
};

/** Posiciones en un lienzo 400x400 */
const POS: Record<Area, { x: number; y: number }> = {
  atraccion: { x: 92, y: 92 },
  conversion: { x: 308, y: 92 },
  confianza: { x: 92, y: 308 },
  direccion: { x: 308, y: 308 },
};

export function Solutions() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const { requestDiagnostic } = useDiagnostic();
  const cat = SOLUTION_CATEGORIES[active];

  const select = (i: number) => {
    setActive(i);
    track("solution_category", { category: SOLUTION_CATEGORIES[i].area });
  };

  const onKey = (e: React.KeyboardEvent) => {
    const n = SOLUTION_CATEGORIES.length;
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (active + 1) % n;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (active - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next >= 0) {
      e.preventDefault();
      select(next);
      tabs.current[next]?.focus();
    }
  };

  return (
    <section id="soluciones" aria-labelledby="soluciones-title" className="noise relative isolate overflow-hidden bg-ink py-24 text-white sm:py-32">
      <div aria-hidden className="absolute left-[-10%] top-1/4 -z-10 hidden h-[520px] w-[520px] rounded-full bg-electric/15 blur-[120px] sm:block" />
      <div className="container">
        <SectionHeader
          id="soluciones-title"
          tone="dark"
          index="04"
          eyebrow="Soluciones"
          title={
            <>
              No necesitas todas las herramientas. <span className="text-white/40">Necesitas las correctas.</span>
            </>
          }
          intro="Cada solución empieza por un problema concreto de tu negocio. Elige un área para ver qué problemas resuelve; el diagnóstico define cuáles necesitas y en qué orden."
        />

        <div className="mt-14 grid items-center gap-10 lg:mt-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* ecosistema */}
          <Reveal>
            <div className="relative mx-auto aspect-square w-full max-w-[440px]">
              <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden>
                <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,255,255,0.06)" />
                <circle cx="200" cy="200" r="96" fill="none" stroke="rgba(255,255,255,0.05)" strokeDasharray="2 6" />
                {SOLUTION_CATEGORIES.map((c, i) => {
                  const p = POS[c.area];
                  const on = i === active;
                  return (
                    <g key={c.area}>
                      <line x1="200" y1="200" x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" />
                      {on && (
                        <motion.line
                          x1="200"
                          y1="200"
                          x2={p.x}
                          y2={p.y}
                          stroke="#60A5FA"
                          strokeWidth="2"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, ease }}
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* núcleo */}
              <div className="absolute left-1/2 top-1/2 grid h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-ink-800 text-center shadow-[0_0_80px_-10px_rgba(37,99,235,0.6)]">
                <span className="px-2">
                  <span className="block font-mono text-[0.55rem] uppercase tracking-[0.18em] text-white/40 sm:text-[0.6rem]">Tu</span>
                  <span className="block text-[0.72rem] font-medium leading-tight sm:text-sm sm:leading-5">sistema comercial</span>
                </span>
              </div>

              <div role="tablist" aria-label="Categorías de soluciones" aria-orientation="horizontal" onKeyDown={onKey}>
                {SOLUTION_CATEGORIES.map((c, i) => {
                  const p = POS[c.area];
                  const on = i === active;
                  const Icon = ICONS[c.area];
                  return (
                    <button
                      key={c.area}
                      ref={(el) => {
                        tabs.current[i] = el;
                      }}
                      role="tab"
                      id={`tab-${c.area}`}
                      aria-selected={on}
                      aria-controls="solutions-panel"
                      tabIndex={on ? 0 : -1}
                      onClick={() => select(i)}
                      className={`absolute flex w-[34%] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 rounded-2xl border px-2 py-3 transition-all duration-300 sm:py-4 ${
                        on
                          ? "border-electric-400/70 bg-[#13234a] shadow-[0_0_0_4px_rgba(37,99,235,0.15),0_20px_50px_-15px_rgba(37,99,235,0.7)]"
                          : "border-white/10 bg-ink-800/90 hover:border-white/25"
                      }`}
                      style={{ left: `${(p.x / 400) * 100}%`, top: `${(p.y / 400) * 100}%` }}
                    >
                      <span
                        className={`grid h-9 w-9 place-items-center rounded-xl transition-colors ${
                          on ? "bg-electric text-white" : "bg-white/6 text-electric-300"
                        }`}
                      >
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <span className="font-mono text-[0.62rem] font-medium uppercase tracking-[0.14em] sm:text-[0.7rem]">
                        {c.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* panel */}
          <div id="solutions-panel" role="tabpanel" aria-labelledby={`tab-${cat.area}`} className="min-h-[460px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={cat.area}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease }}
              >
                <p className="eyebrow text-electric-400">{cat.label}</p>
                <h3 className="display mt-3 text-3xl leading-tight sm:text-4xl sm:leading-10">{cat.question}</h3>
                <p className="text-pretty mt-3 max-w-xl leading-relaxed text-white/60">{cat.summary}</p>

                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {cat.items.map((item, i) => (
                    <motion.li
                      key={item.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.06 * i + 0.1, ease }}
                      className="group rounded-2xl border border-white/8 bg-white/3 p-5 transition-colors hover:border-white/20 hover:bg-white/5"
                    >
                      <span className="flex items-center justify-between">
                        <span className="font-medium text-white">{item.name}</span>
                        <span className="font-mono text-[0.62rem] text-white/30">0{i + 1}</span>
                      </span>
                      <p className="mt-3 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-electric-300/80">Problema que resuelve</p>
                      <p className="mt-1 text-[0.92rem] leading-snug text-white/90">{item.problem}</p>
                      <p className="mt-2.5 text-sm leading-relaxed text-white/50">{item.description}</p>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-dashed border-white/15 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-white/60">¿No sabes si este es tu punto de partida?</p>
                  <button
                    type="button"
                    onClick={() => {
                      track("cta_click", { location: "solutions", category: cat.area });
                      requestDiagnostic(`Interés: ${cat.label}`);
                    }}
                    className={buttonClass("light", "md", "shrink-0")}
                  >
                    Diagnosticar primero
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
