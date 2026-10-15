"use client";

import { MotionConfig } from "framer-motion";
import { DiagnosticProvider } from "./DiagnosticContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <DiagnosticProvider>{children}</DiagnosticProvider>
    </MotionConfig>
  );
}
