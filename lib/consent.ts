"use client";

import { useSyncExternalStore } from "react";

/**
 * Preferencias de cookies del visitante.
 * - analytics: Google Analytics 4
 * - marketing: Meta Pixel
 * Nada se carga hasta que el visitante elige. La elección se guarda en este navegador.
 */
export type Consent = { analytics: boolean; marketing: boolean; decidedAt: string };

const KEY = "pymemkt-consent-v1";
const OPEN_EVENT = "pymemkt:open-consent";
const listeners = new Set<() => void>();
let cache: Consent | null | undefined;

function read(): Consent | null {
  if (cache !== undefined) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    const v = raw ? (JSON.parse(raw) as Partial<Consent>) : null;
    cache =
      v && typeof v.analytics === "boolean" && typeof v.marketing === "boolean"
        ? { analytics: v.analytics, marketing: v.marketing, decidedAt: String(v.decidedAt ?? "") }
        : null;
  } catch {
    cache = null;
  }
  return cache;
}

export function saveConsent(analytics: boolean, marketing: boolean) {
  cache = { analytics, marketing, decidedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* sin almacenamiento: la elección vale para esta visita */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** undefined en el servidor y durante la hidratación; null si aún no decide. */
export function useConsent(): Consent | null | undefined {
  return useSyncExternalStore(subscribe, read, () => undefined);
}

export function openConsentPreferences() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export const CONSENT_OPEN_EVENT = OPEN_EVENT;
