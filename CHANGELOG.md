# Registro de versiones

## 1.1.0 — 2026-10-15 · Versión para pruebas de publicación

### Dependencias

| Paquete | Antes | Ahora | Notas |
| --- | --- | --- | --- |
| Node.js (despliegue) | sin fijar | 24.x | LTS activa, predeterminada en Vercel |
| next | 14.2.30 | 16.4.1 | Corrige la alerta crítica y las altas de Next.js |
| react / react-dom | 18.3.1 | 19.3.1 | Requerido por Next 16 |
| tailwindcss | 3.4.x | 4.3.3 | Migración con la herramienta oficial y revisión manual |
| @tailwindcss/postcss | — | 4.3.3 | Sustituye a autoprefixer |
| postcss | 8.4.x | 8.5.30 | Corrige 4 alertas de PostCSS |
| framer-motion | 11.x | 14.3.0 | Sin cambios de API usados por el sitio |
| lucide-react | 0.460 | 1.57.0 | Algunos íconos tienen trazos actualizados |
| typescript | 5.6 | 5.9.3 | Última 5.x; TypeScript 7 aún no lo soporta Next.js |
| eslint | 8.57 | 9.39.5 | Configuración plana (`eslint.config.mjs`) |
| eslint-config-next | 14.2.30 | 16.4.1 | |
| nodemailer | — | 10.1.1 | Nuevo: envío del formulario por SMTP |

Decisiones:

- **ESLint se queda en 9.39.5.** ESLint 10 existe, pero los complementos de `eslint-config-next` 16.4.1 (react, import, jsx-a11y) solo declaran compatibilidad hasta la 9. Instalar la 10 obliga a sobreescribir dependencias, y se evitó. Es una herramienta de desarrollo que no se publica con el sitio.
- **5 alertas altas restantes, solo en desarrollo.** Todas vienen de `braces`, que llega por `@next/eslint-plugin-next` → `fast-glob` → `micromatch`. El aviso GHSA-vfj7-8cjw-p6xm afecta a todas las versiones publicadas de `braces` y no hay versión corregida. La única "solución" de `npm audit fix --force` es bajar a `eslint-config-next` 14, que es peor. Para explotarla haría falta controlar los patrones de archivos del linter. No afecta al sitio publicado: `npm audit --omit=dev` reporta 0.

Ajustes por la migración:

- `next lint` se eliminó en Next 16; ahora `npm run lint` usa `eslint .`.
- En Tailwind 4 cambiaron dos detalles de precedencia: el interlineado de tamaños responsivos y `hidden` frente a `inline-flex`. Se corrigieron para conservar el diseño, verificado con capturas comparadas antes y después.
- La preferencia de movimiento reducido se lee con `useSyncExternalStore`. Así se corrigió un error de hidratación cuando el visitante tiene activado «reducir movimiento».

### Funcionalidad

- Datos reales: WhatsApp 525579270123 y correo contacto@pymemkt.com.mx. Modo demostración desactivado y bloqueado en producción.
- Recepción real del formulario por SMTP (Titan Email), Resend o webhook. Solo hay éxito y conversión con entrega confirmada.
- Si el envío falla: aviso claro, datos conservados y alternativa por WhatsApp con la información.
- «Llamada» y «Videollamada» se presentan como preferencia de contacto, no como cita.
- API endurecida: validación de cuerpo, tamaño y tipos; límite por IP con Redis opcional; honeypot; tiempo mínimo; origen; Turnstile opcional; registros sin datos personales.
- Aviso de privacidad en borrador con los datos pendientes marcados, enlazado desde el formulario y el pie.
- Consentimiento de cookies para GA4 y Meta Pixel.
- Entornos de pruebas y producción: indexación, robots, sitemap y URL canónica según el entorno, más la verificación `check-env` antes de compilar.
- Pruebas automatizadas: 12 unitarias y 15 de API.

## 1.0.0 — 2026-10-14

Primera versión: sitio completo, evaluación interactiva, metodología Growth A3 con demostración, soluciones, evidencia, formulario, logotipo oficial e imagen para compartir.
