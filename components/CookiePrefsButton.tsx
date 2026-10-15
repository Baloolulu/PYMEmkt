"use client";

import { hasAnalytics } from "@/lib/config";
import { openConsentPreferences } from "@/lib/consent";

export function CookiePrefsButton({ className = "" }: { className?: string }) {
  if (!hasAnalytics) return null;
  return (
    <button type="button" onClick={openConsentPreferences} className={className}>
      Preferencias de cookies
    </button>
  );
}
