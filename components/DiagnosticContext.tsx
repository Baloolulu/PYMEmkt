"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { DiagnosticResult } from "@/lib/diagnostic";

type Ctx = {
  result: DiagnosticResult | null;
  setResult: (r: DiagnosticResult | null) => void;
  /** Área o problema preseleccionado para el formulario de contacto. */
  intent: string | null;
  requestDiagnostic: (intent?: string) => void;
};

const DiagnosticContext = createContext<Ctx | null>(null);

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

export function DiagnosticProvider({ children }: { children: React.ReactNode }) {
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [intent, setIntent] = useState<string | null>(null);

  const requestDiagnostic = useCallback((i?: string) => {
    if (i) setIntent(i);
    scrollToId("contacto");
    window.setTimeout(() => {
      document.getElementById("lead-name")?.focus({ preventScroll: true });
    }, 650);
  }, []);

  const value = useMemo(
    () => ({ result, setResult, intent, requestDiagnostic }),
    [result, intent, requestDiagnostic],
  );
  return <DiagnosticContext.Provider value={value}>{children}</DiagnosticContext.Provider>;
}

export function useDiagnostic() {
  const ctx = useContext(DiagnosticContext);
  if (!ctx) throw new Error("useDiagnostic debe usarse dentro de DiagnosticProvider");
  return ctx;
}
