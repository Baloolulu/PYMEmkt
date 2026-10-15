"use client";

import { useCallback, useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { PROBLEMS, type Problem } from "@/lib/content";
import { AREAS } from "@/lib/diagnostic";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/Reveal";
import { Dialog } from "../ui/Dialog";
import { Button, buttonClass } from "../ui/Button";
import { scrollToId, useDiagnostic } from "../DiagnosticContext";
import { track } from "@/lib/analytics";

function ProblemCard({ p, index, onOpen }: { p: Problem; index: number; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-ink/8 bg-white p-6 text-left transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-electric/30 hover:shadow-[0_24px_60px_-30px_rgba(37,99,235,0.45)] sm:p-7"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), rgba(37,99,235,0.08), transparent 70%)",
        }}
      />
      <span className="relative flex items-center justify-between">
        <span className="font-mono text-xs text-ink/35">0{index + 1}</span>
        <span className="rounded-full bg-mist px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink/55">
          {AREAS[p.area].label}
        </span>
      </span>
      <span className="display relative mt-10 text-[1.45rem] leading-[1.15] text-ink sm:text-[1.6rem]">{p.title}</span>
      <span className="text-pretty relative mt-3 text-[0.95rem] leading-relaxed text-ink/50">{p.question}</span>
      <span className="relative mt-auto flex items-center gap-2 pt-8 text-sm font-medium text-electric">
        <span className="grid h-7 w-7 place-items-center rounded-full border border-electric/25 transition-all duration-300 group-hover:rotate-90 group-hover:bg-electric group-hover:text-white">
          <Plus className="h-3.5 w-3.5" aria-hidden />
        </span>
        Entender el problema
      </span>
    </button>
  );
}

export function Problems() {
  const [selected, setSelected] = useState<Problem | null>(null);
  const { requestDiagnostic } = useDiagnostic();
  const close = useCallback(() => setSelected(null), []);

  return (
    <section id="problemas" aria-labelledby="problemas-title" className="relative bg-mist py-24 sm:py-32">
      <div className="container">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeader
            id="problemas-title"
            index="01"
            eyebrow="Síntomas"
            title={
              <>
                Tu negocio puede estar perdiendo oportunidades <span className="text-ink/35">sin que lo sepas.</span>
              </>
            }
          />
          <Reveal delay={0.1} className="max-w-sm text-ink/55 lg:pb-2">
            ¿Te identificas con alguno? Cada síntoma tiene causas distintas. Selecciona uno para entender qué
            suele haber detrás.
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {PROBLEMS.map((p, i) => (
            <Reveal as="li" key={p.id} delay={0.05 * i}>
              <ProblemCard
                p={p}
                index={i}
                onOpen={() => {
                  setSelected(p);
                  track("problem_open", { problem: p.id });
                }}
              />
            </Reveal>
          ))}
        </ul>
      </div>

      <Dialog open={!!selected} onClose={close} labelledBy="problem-dialog-title">
        {selected && (
          <div>
            <p className="eyebrow text-electric">
              Área probable · {AREAS[selected.area].label}
            </p>
            <h3 id="problem-dialog-title" className="display mt-4 pr-8 text-3xl leading-tight text-ink">
              {selected.title}
            </h3>
            <p className="text-pretty mt-5 leading-relaxed text-ink/65">{selected.explanation}</p>

            <div className="mt-7 rounded-2xl bg-mist p-5">
              <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-ink/45">Causas frecuentes</p>
              <ul className="mt-3 space-y-2">
                {selected.causes.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-[0.95rem] text-ink/80">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-electric" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-6 border-l-2 border-electric pl-4 text-[0.95rem] italic text-ink/70">
              {selected.question}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                variant="primary"
                className="w-full sm:w-auto"
                onClick={() => {
                  const title = selected.title;
                  setSelected(null);
                  track("cta_click", { location: "problem_dialog", problem: selected.id });
                  window.setTimeout(() => requestDiagnostic(title), 260);
                }}
              >
                Solicitar diagnóstico
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
              <a
                href="#diagnostico"
                onClick={(e) => {
                  e.preventDefault();
                  setSelected(null);
                  window.setTimeout(() => scrollToId("diagnostico"), 260);
                }}
                className={buttonClass("outline", "md", "w-full sm:w-auto")}
              >
                Hacer la evaluación
              </a>
            </div>
          </div>
        )}
      </Dialog>
    </section>
  );
}
