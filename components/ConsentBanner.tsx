"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig, hasAnalytics } from "@/lib/config";
import { CONSENT_OPEN_EVENT, saveConsent, useConsent } from "@/lib/consent";
import { Button } from "./ui/Button";

/** Aviso de cookies. Solo aparece si hay GA4 o Meta Pixel configurados. */
export function ConsentBanner() {
  const consent = useConsent();
  const [forced, setForced] = useState(false);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  useEffect(() => {
    const open = () => {
      setForced(true);
      setCustom(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, open);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, open);
  }, []);

  if (!hasAnalytics || consent === undefined) return null;
  const visible = consent === null || forced;

  const decide = (a: boolean, m: boolean) => {
    saveConsent(a, m);
    setForced(false);
    setCustom(false);
    if (consent && ((consent.analytics && !a) || (consent.marketing && !m))) {
      // Para dejar de medir en esta misma visita, recargamos sin los scripts.
      window.location.reload();
    }
  };

  const { ga4Id, metaPixelId } = siteConfig.analytics;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-labelledby="consent-title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-x-0 bottom-0 z-[70] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-6"
        >
          <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-ink/95 p-5 text-white shadow-2xl backdrop-blur-xl sm:p-6">
            <p id="consent-title" className="font-medium">Cookies de medición</p>
            <p className="mt-1.5 text-sm leading-relaxed text-white/65">
              Con tu permiso usamos cookies para entender cómo se usa el sitio y medir nuestras campañas. Sin tu permiso no se
              activan.{" "}
              <Link href="/aviso-de-privacidad" className="text-electric-300 underline underline-offset-2">
                Aviso de privacidad
              </Link>
            </p>

            {custom && (
              <fieldset className="mt-4 space-y-2">
                <legend className="sr-only">Elige qué cookies aceptas</legend>
                {ga4Id && (
                  <label className="flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-xl border border-white/10 px-4">
                    <span className="text-sm">
                      Analítica <span className="text-white/45">· Google Analytics</span>
                    </span>
                    <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="h-5 w-5 accent-electric" />
                  </label>
                )}
                {metaPixelId && (
                  <label className="flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-xl border border-white/10 px-4">
                    <span className="text-sm">
                      Publicidad <span className="text-white/45">· Meta Pixel</span>
                    </span>
                    <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="h-5 w-5 accent-electric" />
                  </label>
                )}
              </fieldset>
            )}

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
              {custom ? (
                <Button variant="primary" onClick={() => decide(analytics && Boolean(ga4Id), marketing && Boolean(metaPixelId))}>
                  Guardar preferencias
                </Button>
              ) : (
                <>
                  <Button variant="glass" onClick={() => setCustom(true)}>
                    Configurar
                  </Button>
                  <Button variant="glass" onClick={() => decide(false, false)}>
                    Rechazar
                  </Button>
                  <Button variant="primary" onClick={() => decide(Boolean(ga4Id), Boolean(metaPixelId))}>
                    Aceptar
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
