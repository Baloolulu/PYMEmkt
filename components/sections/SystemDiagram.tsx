"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FileText, MessagesSquare, Radar, Repeat2, UserCheck } from "lucide-react";

const W = 400;
const H = 520;

const NODES = [
  { id: "atraccion", label: "Atracción", status: "canales activos", x: 132, y: 62, Icon: Radar },
  { id: "conversaciones", label: "Conversaciones", status: "respuesta guiada", x: 296, y: 162, Icon: MessagesSquare },
  { id: "cotizaciones", label: "Cotizaciones", status: "registradas", x: 132, y: 262, Icon: FileText },
  { id: "seguimiento", label: "Seguimiento", status: "automatizado", x: 296, y: 362, Icon: Repeat2 },
  { id: "clientes", label: "Clientes", status: "medidos", x: 200, y: 462, Icon: UserCheck },
] as const;

function curve(a: { x: number; y: number }, b: { x: number; y: number }) {
  const my = (a.y + b.y) / 2;
  return `M ${a.x} ${a.y} C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
}

const PATHS = NODES.slice(0, -1).map((n, i) => curve(n, NODES[i + 1]));
const LOOP = `M 200 462 C 20 470, 8 300, 14 200 C 20 110, 50 64, 132 62`;

/** Señales dispersas que entran al sistema por "Atracción". */
const SIGNALS = [
  { x: 22, y: 18, d: 0 },
  { x: 196, y: 14, d: 1.1 },
  { x: 250, y: 46, d: 2.3 },
  { x: 8, y: 96, d: 0.6 },
  { x: 168, y: 92, d: 1.8 },
];

export function SystemDiagram() {
  // Se lee después de montar para que el HTML del servidor y del cliente coincidan.
  const prefersReduced = useReducedMotion();
  const [reduce, setReduce] = useState(false);
  useEffect(() => setReduce(Boolean(prefersReduced)), [prefersReduced]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = window.setInterval(() => setActive((a) => (a + 1) % NODES.length), 1700);
    return () => window.clearInterval(t);
  }, [reduce]);

  return (
    <figure
      aria-label="Diagrama de un sistema comercial conectado: atracción, conversaciones, cotizaciones, seguimiento y clientes, con un ciclo de medición y optimización."
      className="relative mx-auto w-full max-w-[460px]"
    >
      {/* halo */}
      <div aria-hidden className="absolute -inset-10 rounded-[3rem] bg-electric/20 blur-3xl" />

      <div className="glass noise relative overflow-hidden rounded-[1.75rem] shadow-[0_40px_120px_-40px_rgba(37,99,235,0.55)]">
        {/* barra superior */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-3.5">
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-white/45">
            sistema_comercial
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-emerald-300">
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-emerald-400" />
            conectado
          </span>
        </div>

        <div className="relative px-3 pb-4 pt-3 sm:px-5">
          <div className="relative" style={{ aspectRatio: `${W} / ${H}` }}>
            <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
              <defs>
                <linearGradient id="flow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.9" />
                </linearGradient>
                <radialGradient id="pulse">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="45%" stopColor="#93C5FD" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                </radialGradient>
                <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.07)" />
                </pattern>
              </defs>

              <rect width={W} height={H} fill="url(#dots)" />

              {/* ciclo de retroalimentación */}
              <motion.path
                d={LOOP}
                fill="none"
                stroke="rgba(96,165,250,0.35)"
                strokeWidth="1.2"
                strokeDasharray="3 6"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.6, delay: 1.6, ease: "easeInOut" }}
              />

              {/* conexiones base */}
              {PATHS.map((d, i) => (
                <path key={`base-${i}`} d={d} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" strokeLinecap="round" />
              ))}
              {PATHS.map((d, i) => (
                <motion.path
                  key={`line-${i}`}
                  d={d}
                  fill="none"
                  stroke="url(#flow)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, delay: 0.3 + i * 0.28, ease: "easeInOut" }}
                />
              ))}

              {/* pulsos que recorren el sistema */}
              {!reduce &&
                PATHS.map((d, i) => (
                  <circle key={`pulse-${i}`} r="5" fill="url(#pulse)" opacity="0">
                    <animate attributeName="opacity" values="0;1;1;0" dur="2.4s" begin={`${1.8 + i * 0.48}s`} repeatCount="indefinite" />
                    <animateMotion dur="2.4s" begin={`${1.8 + i * 0.48}s`} repeatCount="indefinite" path={d} />
                  </circle>
                ))}
              {!reduce && (
                <circle r="3.5" fill="#93C5FD" opacity="0">
                  <animate attributeName="opacity" values="0;0.8;0.8;0" dur="5s" begin="3.4s" repeatCount="indefinite" />
                  <animateMotion dur="5s" begin="3.4s" repeatCount="indefinite" path={LOOP} />
                </circle>
              )}

              {/* señales dispersas entrando */}
              {!reduce &&
                SIGNALS.map((s, i) => (
                  <circle key={`sig-${i}`} r="2" fill="#60A5FA" opacity="0">
                    <animate attributeName="opacity" values="0;0.9;0" dur="2.6s" begin={`${s.d}s`} repeatCount="indefinite" />
                    <animateMotion
                      dur="2.6s"
                      begin={`${s.d}s`}
                      repeatCount="indefinite"
                      path={`M ${s.x} ${s.y} L 132 62`}
                    />
                  </circle>
                ))}
            </svg>

            {/* etiqueta del ciclo */}
            <span
              className="absolute -rotate-90 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-electric-300/70"
              style={{ left: "-3.5%", top: "44%", transformOrigin: "center" }}
              aria-hidden
            >
              medir · optimizar
            </span>

            {/* nodos */}
            {NODES.map((n, i) => {
              const on = reduce ? true : active === i;
              const Icon = n.Icon;
              return (
                <div
                  key={n.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${(n.x / W) * 100}%`, top: `${(n.y / H) * 100}%` }}
                >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div
                    className={`flex items-center gap-2.5 rounded-2xl border py-2 pl-2 pr-3.5 backdrop-blur-md transition-all duration-500 sm:gap-3 sm:py-2.5 sm:pl-2.5 sm:pr-4 ${
                      on
                        ? "border-electric-400/60 bg-ink-800/95 shadow-[0_0_0_4px_rgba(37,99,235,0.15),0_12px_40px_-8px_rgba(37,99,235,0.7)]"
                        : "border-white/10 bg-ink-800/90"
                    }`}
                  >
                    <span
                      className={`grid h-7 w-7 place-items-center rounded-xl transition-colors duration-500 sm:h-8 sm:w-8 ${
                        on ? "bg-electric text-white" : "bg-white/[0.06] text-electric-300"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
                    </span>
                    <span className="flex flex-col">
                      <span className="whitespace-nowrap text-[0.74rem] font-medium leading-tight text-white sm:text-[0.86rem]">
                        {n.label}
                      </span>
                      <span className="whitespace-nowrap font-mono text-[0.56rem] uppercase tracking-[0.1em] text-white/40 sm:text-[0.6rem]">
                        {n.status}
                      </span>
                    </span>
                  </div>
                </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </figure>
  );
}
