# PYMEmkt | Growth Systems — Sitio web

Sitio de una sola página, diseñado como herramienta comercial: su KPI principal son las **solicitudes de diagnóstico**.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Lucide Icons · Geist (fuente auto-hospedada).

---

## Requisitos

- Node.js 18.18 o superior (recomendado 20 LTS)
- npm 9+

## Instalación

```bash
npm install
cp .env.example .env.local   # completa los valores que tengas
npm run dev                  # http://localhost:3000
```

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilación de producción (incluye verificación de tipos y lint) |
| `npm start` | Sirve la compilación de producción |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript sin emitir archivos |

---

## Estructura

```
app/
  layout.tsx            Metadatos SEO, Open Graph, JSON-LD, fuentes, analítica
  page.tsx              Orden de secciones
  api/lead/route.ts     Recepción y reenvío de solicitudes (validación, honeypot, límite por IP)
  opengraph-image.tsx   Imagen OG generada (1200×630)
  sitemap.ts · robots.ts · icon.svg
components/
  sections/             Hero, SystemDiagram, Problems, Diagnostic, Methodology, Solutions, Evidence, FinalCTA
  ui/                   Button, Dialog, Reveal, SectionHeader, Logo
  Header · Footer · FloatingCTA · ContactForm · Analytics · Providers · DiagnosticContext
lib/
  config.ts             Configuración central (lee variables de entorno)
  content.ts            Textos de problemas, metodología, soluciones y casos
  diagnostic.ts         Preguntas, ponderación y resultado de la evaluación
  lead.ts               Validación compartida cliente/servidor del formulario
  analytics.ts          Eventos GA4 + Meta Pixel
  whatsapp.ts           Enlaces de WhatsApp
```

Todo el contenido editable vive en `lib/content.ts` y `lib/diagnostic.ts`; no hace falta tocar componentes para cambiar textos.

---

## Variables de entorno

Ver `.env.example`. Ningún dato de contacto está escrito en el código.

| Variable | Efecto |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL canónica, OG, sitemap y enlace al compartir resultados |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Activa botones de WhatsApp (flotante, CTA final, éxito del formulario). Sin número se ocultan |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Correo en el pie y respaldo del formulario |
| `NEXT_PUBLIC_GA4_ID` | Carga GA4 |
| `NEXT_PUBLIC_META_PIXEL_ID` | Carga Meta Pixel |
| `LEAD_WEBHOOK_URL` | Destino de las solicitudes del formulario (JSON por POST) |
| `LEAD_WEBHOOK_SECRET` | Se envía como `X-Webhook-Secret` |

> ⚠️ **Antes de publicar, configura `LEAD_WEBHOOK_URL` y/o `NEXT_PUBLIC_WHATSAPP_NUMBER`.** Sin webhook, el formulario valida y responde, pero pide al usuario terminar el envío por WhatsApp o correo; si no hay ninguno de los dos configurado, la solicitud no llega a ningún lado.

### Formato del webhook

```json
{
  "source": "pymemkt-web",
  "createdAt": "2026-10-14T21:00:00.000Z",
  "name": "…", "company": "…", "phone": "+525512345678", "email": null,
  "challenge": "Recibo mensajes, pero pocas ventas",
  "preference": "Videollamada",
  "message": null,
  "context": "Evaluación: Conversión",
  "diagnosticArea": "Conversión"
}
```

Funciona directo con un escenario de Make/Zapier/n8n, o con un Google Apps Script que escriba en una hoja de cálculo.

---

## Identidad visual

- **Logotipo oficial** (versión para fondo oscuro) en `public/brand/`:
  - `logo-light.png` — PYMEmkt (encabezado y menú)
  - `lockup-light.png` — PYMEmkt + GROWTH SYSTEMS (pie de página e imagen para compartir)
- **Favicon e íconos** en `app/`: `favicon.ico` (16/32/48), `icon.png` (192), `apple-icon.png` (180). Next.js los publica automáticamente.
- Se usan desde `components/ui/Logo.tsx`. Al recibir los vectoriales (SVG) del diseñador, reemplaza los archivos conservando los nombres, o cambia las rutas en ese componente.
- **Paleta** (guía de identidad): Grafito `#0B0F19`, Azul principal `#2563EB`, Azul luminoso `#60A5FA`, Gris claro `#F5F7FA`, Blanco `#FFFFFF`. Definida en `tailwind.config.ts` (`ink`, `electric`, `mist`).
- **Tipografía del sitio:** Geist (auto-hospedada). Si la guía define otra familia para textos, se cambia en `app/layout.tsx`.

---

## Evaluación interactiva

- 5 preguntas, una por pantalla, con barra de progreso, regreso y avance. En móvil la tarjeta vuelve a la vista en cada pregunta.
- Cada opción suma pesos a cuatro áreas: **Atracción, Conversión, Confianza, Dirección** (`lib/diagnostic.ts`). Empates se resuelven con el desafío declarado en la pregunta 5.
- El resultado muestra el área principal y la secundaria, el peso relativo de las señales, **por qué se obtuvo** (cuántas respuestas apuntan a esa área y cuáles pesaron más), qué se revisaría primero y la aclaración de que es una **evaluación preliminar**.
- **«Solicitar diagnóstico por WhatsApp»** abre WhatsApp con un mensaje que incluye el resultado y las cinco respuestas. Si no hay número configurado, el botón lleva al formulario.
- «Prefiero dejar mis datos» lleva al formulario con el contexto precargado; «Compartir resultado» abre WhatsApp para enviarlo a cualquier contacto.

## WhatsApp

- Número en `NEXT_PUBLIC_WHATSAPP_NUMBER` (52 + 10 dígitos). Con él se activan: enlace directo en el hero y en la evaluación («sin cuestionario»), botón del resultado, botón flotante, barra móvil, CTA final y continuación del formulario.
- Mensajes prellenados: `lib/whatsapp.ts` (contacto directo) y `resultRequestText` en `lib/diagnostic.ts` (resultado).
- `NEXT_PUBLIC_DEMO_MODE=true` es solo para vistas previas sin número: los botones abren WhatsApp con el mensaje para revisarlo, sin destinatario. En producción déjalo vacío.

## Demostración Growth A3

`components/sections/A3Demo.tsx` (datos en `lib/a3demo.ts`), dentro de la sección Metodología. Recorre las 6 etapas con un **caso hipotético** («Distribuidora Norte», empresa ficticia): línea base, árbol de causas, matriz impacto/esfuerzo, sprint de 10 días, indicadores con línea base y meta (sin resultados) y reglas de decisión. Está marcada como demostración y con datos ficticios en tres lugares.

## Analítica

`lib/analytics.ts` envía cada evento a GA4 (`gtag('event', …)`) y a Meta Pixel (evento estándar cuando aplica, `trackCustom` en los demás).

| Evento | Meta Pixel |
| --- | --- |
| `diagnostic_start`, `diagnostic_step` | custom |
| `diagnostic_complete` | `CompleteRegistration` |
| `form_submit` | `Lead` |
| `diagnostic_request` (botón del resultado; parámetro `channel`: whatsapp o form) | custom |
| `whatsapp_click` | `Contact` |
| `meeting_request` (llamada o videollamada) | `Schedule` |
| `form_error`, `cta_click`, `problem_open`, `method_stage_open`, `solution_category`, `a3_demo_step` | custom |

`whatsapp_click` lleva el parámetro `location` (hero_direct, diagnostic_intro_direct, diagnostic_result, diagnostic_share, floating, mobile_bar, final_cta, form_success) para saber desde dónde se contacta.

En GA4, marca `form_submit` como **evento clave** (es la solicitud real).

## Agregar casos de implementación

La sección **Evidencia** muestra el formato de caso mientras `CASES` (en `lib/content.ts`) esté vacío. Al agregar un caso real, la sección cambia automáticamente a tarjetas con problema, causas, solución, indicadores (antes → después) y aprendizajes. Publica solo datos verificables y con autorización del cliente.

```ts
export const CASES: CaseStudy[] = [
  {
    id: "empresa-x",
    client: "Empresa X",
    industry: "Servicios industriales",
    period: "Ene–Mar 2027",
    problem: "…",
    causes: ["…"],
    solution: ["…"],
    indicators: [{ label: "Tiempo de primera respuesta", before: "…", after: "…", note: "Medido en WhatsApp Business" }],
    learnings: "…",
  },
];
```

---

## Accesibilidad y rendimiento

- Estructura semántica, enlace «Saltar al contenido», foco visible, `aria-expanded` / `aria-pressed` / roles de pestañas y diálogo con trampa de foco y cierre con Escape.
- Contraste AA en textos funcionales sobre fondos oscuros y claros.
- `prefers-reduced-motion`: Framer Motion usa `reducedMotion="user"`, el diagrama del hero detiene pulsos y ciclos, y el CSS anula animaciones y scroll suave.
- Fuentes auto-hospedadas (sin solicitudes a Google Fonts), página estática, ~152 kB de JS en la primera carga.
- Los scripts de analítica solo se cargan si sus IDs existen, con `afterInteractive`.

## Despliegue en Vercel

1. Sube el proyecto a un repositorio de GitHub.
2. En Vercel: **Add New → Project**, importa el repositorio (detecta Next.js automáticamente).
3. En **Settings → Environment Variables** agrega las variables de `.env.example` (al menos `NEXT_PUBLIC_SITE_URL` y `LEAD_WEBHOOK_URL` o `NEXT_PUBLIC_WHATSAPP_NUMBER`).
4. **Deploy**. Después conecta tu dominio en **Settings → Domains** y actualiza `NEXT_PUBLIC_SITE_URL` con él (redeploy).

Con la CLI: `npm i -g vercel && vercel` y luego `vercel --prod`.

## Pendientes antes de publicar

- [ ] Archivos vectoriales (SVG) del logo e ícono, para máxima nitidez.
- [ ] Número de WhatsApp, correo y webhook de solicitudes.
- [ ] IDs de GA4 y Meta Pixel.
- [ ] Aviso de privacidad (requerido por la LFPDPPP al recabar datos personales) y su enlace junto a la casilla de autorización del formulario.
- [ ] Casos reales en `lib/content.ts` cuando estén autorizados.
