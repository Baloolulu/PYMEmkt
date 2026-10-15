"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}

/**
 * Widget de Cloudflare Turnstile (verificación anti-bots sin captchas de imágenes).
 * Solo se monta si NEXT_PUBLIC_TURNSTILE_SITE_KEY está configurada.
 */
export function Turnstile({
  siteKey,
  onToken,
  resetSignal,
}: {
  siteKey: string;
  onToken: (token: string) => void;
  resetSignal: number;
}) {
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const cb = useRef(onToken);
  useEffect(() => {
    cb.current = onToken;
  }, [onToken]);

  const mount = () => {
    if (!box.current || !window.turnstile || widget.current) return;
    widget.current = window.turnstile.render(box.current, {
      sitekey: siteKey,
      language: "es",
      theme: "light",
      callback: (t: string) => cb.current(t),
      "expired-callback": () => cb.current(""),
      "error-callback": () => cb.current(""),
    });
  };

  useEffect(() => {
    mount();
    return () => {
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (resetSignal > 0 && widget.current) {
      window.turnstile?.reset(widget.current);
      cb.current("");
    }
  }, [resetSignal]);

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={mount} />
      <div ref={box} className="min-h-[65px]" />
    </>
  );
}
