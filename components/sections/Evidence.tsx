import { FileSearch, GitBranch, LineChart, Lightbulb, Wrench } from "lucide-react";
import { CASES, type CaseStudy } from "@/lib/content";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/Reveal";

const ANATOMY = [
  {
    Icon: FileSearch,
    label: "Problema detectado",
    text: "El síntoma que reportó la empresa y lo que encontramos al revisarlo.",
    field: "Situación inicial",
  },
  {
    Icon: GitBranch,
    label: "Causas",
    text: "Las causas raíz identificadas con Growth A3, no solo los síntomas.",
    field: "Causa raíz",
  },
  {
    Icon: Wrench,
    label: "Solución aplicada",
    text: "Qué se implementó, en qué orden y en cuánto tiempo.",
    field: "Sprint de implementación",
  },
  {
    Icon: LineChart,
    label: "Indicadores",
    text: "Métricas con línea base: antes y después, con su periodo de medición.",
    field: "Antes → Después",
  },
  {
    Icon: Lightbulb,
    label: "Aprendizajes",
    text: "Lo que funcionó, lo que no y lo que haríamos distinto.",
    field: "Siguiente ciclo",
  },
];

const PRINCIPLES = [
  "Sin testimonios inventados",
  "Indicadores con línea base y periodo",
  "Publicados con autorización del cliente",
  "También documentamos lo que no funcionó",
];

function CaseCard({ c }: { c: CaseStudy }) {
  return (
    <article className="rounded-3xl border border-ink/8 bg-white p-6 sm:p-9">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="display text-2xl text-ink">{c.client}</h3>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink/45">
          {c.industry}
          {c.period ? ` · ${c.period}` : ""}
        </p>
      </header>
      <dl className="mt-8 grid gap-6 md:grid-cols-2">
        <div>
          <dt className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-electric">Problema detectado</dt>
          <dd className="mt-2 text-ink/75">{c.problem}</dd>
        </div>
        <div>
          <dt className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-electric">Causas</dt>
          <dd className="mt-2">
            <ul className="space-y-1 text-ink/75">
              {c.causes.map((x) => (
                <li key={x}>— {x}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-electric">Solución aplicada</dt>
          <dd className="mt-2">
            <ul className="space-y-1 text-ink/75">
              {c.solution.map((x) => (
                <li key={x}>— {x}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-electric">Indicadores</dt>
          <dd className="mt-2 space-y-2">
            {c.indicators.map((i) => (
              <div key={i.label} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink/6 pb-2 text-sm">
                <span className="text-ink/70">{i.label}</span>
                <span className="font-mono text-ink">
                  {i.before ?? "—"} → {i.after ?? "—"}
                </span>
                {i.note && <span className="w-full text-xs text-ink/45">{i.note}</span>}
              </div>
            ))}
          </dd>
        </div>
      </dl>
      <div className="mt-8 rounded-2xl bg-mist p-5">
        <p className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-ink/45">Aprendizajes</p>
        <p className="mt-2 text-ink/75">{c.learnings}</p>
      </div>
    </article>
  );
}

export function Evidence() {
  const hasCases = CASES.length > 0;

  return (
    <section id="evidencia" aria-labelledby="evidencia-title" className="relative bg-mist py-24 sm:py-32">
      <div className="container">
        <SectionHeader
          id="evidencia-title"
          index="05"
          eyebrow="Evidencia"
          title={
            <>
              Las decisiones se respaldan <span className="text-ink/35">con evidencia.</span>
            </>
          }
          intro={
            hasCases
              ? "Casos de implementación documentados con el mismo formato: problema, causas, solución, indicadores y aprendizajes."
              : "Cada implementación se documenta con la misma estructura. Así se ve un caso PYMEmkt: sin adjetivos, con datos."
          }
        />

        {hasCases ? (
          <div className="mt-14 grid gap-6">
            {CASES.map((c) => (
              <Reveal key={c.id}>
                <CaseCard c={c} />
              </Reveal>
            ))}
          </div>
        ) : (
          <>
            <Reveal className="mt-14 lg:mt-16">
              <div className="overflow-hidden rounded-[1.75rem] border border-ink/8 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/8 px-6 py-4 sm:px-8">
                  <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-ink/45">
                    Formato de caso · Growth A3
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-mist px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink/55">
                    <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-amber-500" aria-hidden />
                    Casos en documentación
                  </span>
                </div>
                <ol className="grid divide-y divide-ink/8 md:grid-cols-5 md:divide-x md:divide-y-0">
                  {ANATOMY.map(({ Icon, label, text, field }, i) => (
                    <li key={label} className="group relative p-6 transition-colors hover:bg-mist/60 sm:p-7">
                      <div className="flex items-center justify-between">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-electric/8 text-electric transition-colors group-hover:bg-electric group-hover:text-white">
                          <Icon className="h-[1.1rem] w-[1.1rem]" aria-hidden />
                        </span>
                        <span className="font-mono text-xs text-ink/30">0{i + 1}</span>
                      </div>
                      <h3 className="mt-6 font-medium text-ink">{label}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink/55">{text}</p>
                      <div className="mt-6 rounded-lg border border-dashed border-ink/15 px-3 py-2.5" aria-hidden>
                        <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink/35">{field}</span>
                        <span className="mt-2 block h-1.5 w-3/4 rounded-full bg-ink/6" />
                        <span className="mt-1.5 block h-1.5 w-1/2 rounded-full bg-ink/6" />
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
              <div className="rounded-[1.75rem] bg-ink p-7 text-white sm:p-9">
                <p className="display text-2xl leading-snug sm:text-[1.7rem]">
                  Estamos documentando casos de implementación con autorización de cada empresa.
                </p>
                <p className="mt-4 text-white/55">
                  Preferimos mostrar menos casos, pero reales y verificables. Se publicarán aquí conforme cada cliente lo
                  autorice.
                </p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {PRINCIPLES.map((p) => (
                  <li key={p} className="flex items-center rounded-2xl border border-ink/8 bg-white p-5 text-[0.95rem] font-medium text-ink">
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}
