"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, MessageCircle } from "lucide-react";
import { buttonClass } from "../ui/Button";
import { SystemDiagram } from "./SystemDiagram";
import { track } from "@/lib/analytics";
import { DEFAULT_WA_MESSAGE, whatsappLink } from "@/lib/whatsapp";

const ease = [0.22, 1, 0.36, 1] as const;
const CHAIN = ["Diagnosticar", "Priorizar", "Implementar", "Medir", "Optimizar"];

export function Hero() {
  const wa = whatsappLink(DEFAULT_WA_MESSAGE);
  return (
    <section id="inicio" aria-labelledby="hero-title" className="noise relative isolate overflow-hidden bg-ink pb-20 pt-28 text-white sm:pt-32 lg:pb-28 lg:pt-40">
      {/* fondo */}
      <div aria-hidden className="grid-mask absolute inset-0 -z-10 bg-grid [background-size:56px_56px]" />
      <div aria-hidden className="absolute -top-40 left-1/2 -z-10 h-[620px] w-[980px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(37,99,235,0.32),transparent)]" />
      <div aria-hidden className="absolute bottom-0 left-0 right-0 -z-10 h-px hairline" />

      <div className="container grid items-center gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="eyebrow rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-white/70"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-electric-400" aria-hidden />
            PYMEmkt <span className="text-white/30">|</span> Growth Systems
          </motion.p>

          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease }}
            className="display mt-7 text-[2.5rem] leading-[1] sm:text-[3.4rem] lg:text-[3.7rem] xl:text-[4.3rem]"
          >
            Tu empresa no necesita más acciones aisladas.
            <span className="text-gradient mt-4 block pb-1 text-[0.72em] leading-[1.06]">Necesita un sistema que genere oportunidades.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="text-pretty mt-7 max-w-xl text-lg leading-relaxed text-white/60 sm:text-xl"
          >
            Diagnosticamos los problemas que frenan tu crecimiento y construimos estrategias comerciales para
            convertir oportunidades en resultados medibles.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="#diagnostico"
              onClick={() => track("cta_click", { location: "hero_primary" })}
              className={buttonClass("primary", "lg")}
            >
              Descubre qué frena tu crecimiento
              <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#metodologia"
              onClick={() => track("cta_click", { location: "hero_secondary" })}
              className={buttonClass("glass", "lg")}
            >
              Conoce nuestra metodología
              <ArrowDown aria-hidden className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </a>
          </motion.div>

          {wa && (
            <motion.a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              onClick={() => track("whatsapp_click", { location: "hero_direct" })}
              className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm text-white/55 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" aria-hidden />
              O escríbenos directo por WhatsApp, sin cuestionario
            </motion.a>
          )}

          <motion.ol
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.55 }}
            aria-label="Nuestro enfoque"
            className="mt-14 flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-white/40"
          >
            {CHAIN.map((step, i) => (
              <li key={step} className="flex items-center gap-2">
                <span className={i === 0 ? "text-electric-300" : ""}>{step}</span>
                {i < CHAIN.length - 1 && <span aria-hidden className="text-white/20">→</span>}
              </li>
            ))}
          </motion.ol>
        </div>

        <SystemDiagram />
      </div>
    </section>
  );
}
