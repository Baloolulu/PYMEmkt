"use client";

import { MessageCircle } from "lucide-react";
import { ContactForm } from "../ContactForm";
import { Reveal } from "../ui/Reveal";
import { buttonClass } from "../ui/Button";
import { DEFAULT_WA_MESSAGE, whatsappLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";

const NEXT = [
  { n: "01", t: "Revisamos tu solicitud", d: "Leemos tu contexto antes de hablar contigo." },
  { n: "02", t: "Conversación de diagnóstico", d: "Entendemos tu proceso comercial actual." },
  { n: "03", t: "Prioridades claras", d: "Sabrás qué atacar primero y por qué." },
];

export function FinalCTA() {
  const wa = whatsappLink(DEFAULT_WA_MESSAGE);

  return (
    <section id="contacto" aria-labelledby="contacto-title" className="noise relative isolate overflow-hidden bg-ink py-24 text-white sm:py-32">
      <div aria-hidden className="grid-mask absolute inset-0 -z-10 bg-grid bg-size-[56px_56px]" />
      <div aria-hidden className="absolute -bottom-60 left-1/2 -z-10 h-[700px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(37,99,235,0.35),transparent)]" />

      <div className="container">
        <Reveal className="max-w-5xl">
          <p className="eyebrow text-electric-400">
            <span className="text-white/40">06</span>
            <span aria-hidden className="h-px w-6 bg-white/25" />
            Siguiente paso
          </p>
          <h2 id="contacto-title" className="display mt-6 text-[2.4rem] leading-[1.02] sm:text-6xl lg:text-[4.4rem] sm:leading-none">
            Tu empresa puede seguir improvisando.{" "}
            <span className="text-gradient">O puede empezar a crecer con dirección.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal delay={0.05}>
            <p className="text-pretty text-xl leading-relaxed text-white/65">
              Descubramos qué está frenando tu crecimiento y qué acciones podrían generar mayor impacto.
            </p>

            <ol className="mt-10 space-y-px overflow-hidden rounded-2xl border border-white/8">
              {NEXT.map((s) => (
                <li key={s.n} className="flex gap-5 bg-white/2.5 p-5">
                  <span className="font-mono text-sm text-electric-400">{s.n}</span>
                  <span>
                    <span className="block font-medium">{s.t}</span>
                    <span className="mt-0.5 block text-sm text-white/50">{s.d}</span>
                  </span>
                </li>
              ))}
            </ol>

            {wa && (
              <div className="mt-8">
                <p className="text-sm text-white/45">¿Prefieres escribirnos directamente?</p>
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("whatsapp_click", { location: "final_cta" })}
                  className={buttonClass("glass", "lg", "mt-3")}
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  Hablar por WhatsApp
                </a>
              </div>
            )}

            <p className="mt-12 font-display text-2xl font-semibold uppercase leading-tight tracking-tight text-white/90">
              Menos improvisación.
              <br />
              <span className="text-electric-400">Más crecimiento.</span>
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
