"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { DEFAULT_WA_MESSAGE, whatsappLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";

/**
 * Acceso persistente a la conversión:
 * - Escritorio: botón flotante de WhatsApp (si hay número configurado).
 * - Móvil: barra inferior con "Solicitar diagnóstico" + WhatsApp.
 * Se oculta en el hero y cuando la sección de contacto está visible.
 */
export function FloatingCTA() {
  const [show, setShow] = useState(false);
  const wa = whatsappLink(DEFAULT_WA_MESSAGE);

  useEffect(() => {
    const contact = document.getElementById("contacto");
    let contactVisible = false;
    const io = new IntersectionObserver(([e]) => {
      contactVisible = e.isIntersecting;
      update();
    });
    if (contact) io.observe(contact);
    function update() {
      setShow(window.scrollY > window.innerHeight * 0.85 && !contactVisible);
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-none fixed inset-x-0 bottom-0 z-40 p-3 sm:p-6"
        >
          {/* móvil */}
          <div className="pointer-events-auto flex gap-2 rounded-2xl border border-white/10 bg-ink/90 p-2 shadow-2xl backdrop-blur-xl sm:hidden">
            <a
              href="#contacto"
              onClick={() => track("cta_click", { location: "mobile_bar" })}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-electric text-[0.95rem] font-medium text-white"
            >
              Solicitar diagnóstico
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Escribir por WhatsApp"
                onClick={() => track("whatsapp_click", { location: "mobile_bar" })}
                className="grid h-12 w-12 place-items-center rounded-xl bg-[#25D366] text-ink"
              >
                <MessageCircle className="h-5 w-5" aria-hidden />
              </a>
            )}
          </div>

          {/* escritorio */}
          {wa && (
            <div className="pointer-events-auto hidden justify-end sm:flex">
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("whatsapp_click", { location: "floating" })}
                className="group flex h-14 items-center gap-2 rounded-full bg-[#25D366] pl-4 pr-5 font-medium text-ink shadow-[0_20px_50px_-15px_rgba(37,211,102,0.6)] transition-transform hover:-translate-y-0.5"
              >
                <MessageCircle className="h-5 w-5" aria-hidden />
                WhatsApp
              </a>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
