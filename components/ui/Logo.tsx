import Image from "next/image";

/**
 * LOGOTIPO OFICIAL — PYMEmkt
 * ---------------------------------------------------------------
 * Versiones para fondo oscuro extraídas de la guía de identidad.
 *  - "wordmark": PYMEmkt (encabezado, menú)
 *  - "lockup":   PYMEmkt + GROWTH SYSTEMS (pie de página)
 * No modificar proporciones, colores ni tipografía del logo.
 * Cuando el diseñador entregue los archivos vectoriales (SVG), reemplaza
 * los PNG de /public/brand/ conservando los nombres o actualiza las rutas aquí.
 */

const ASSETS = {
  wordmark: { src: "/brand/logo-light.png", width: 820, height: 134 },
  lockup: { src: "/brand/lockup-light.png", width: 820, height: 194 },
} as const;

type Props = {
  variant?: keyof typeof ASSETS;
  /** Altura en píxeles con la que se muestra. */
  height?: number;
  className?: string;
  priority?: boolean;
};

export function Logo({ variant = "wordmark", height = 24, className = "", priority = false }: Props) {
  const a = ASSETS[variant];
  const width = Math.round((a.width / a.height) * height);
  return (
    <Image
      src={a.src}
      alt="PYMEmkt"
      width={width}
      height={height}
      priority={priority}
      sizes={`${width}px`}
      className={`block h-auto select-none ${className}`}
      style={{ width, height: "auto" }}
      draggable={false}
    />
  );
}
