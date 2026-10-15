# PYMEmkt | Growth Systems — Sitio web

Sitio de una sola página diseñado como herramienta comercial. Su indicador principal son las **solicitudes de diagnóstico**.

| Pieza | Versión |
| --- | --- |
| Node.js | 24.x (LTS) — fijado en `package.json` → `engines` y `.nvmrc` |
| Next.js | 16.4.1 (App Router) |
| React | 19.3.1 |
| TypeScript | 5.9.3 |
| Tailwind CSS | 4.3.3 |
| Framer Motion | 14.3.0 |
| Lucide | 1.57.0 |
| Nodemailer | 10.1.1 (envío del formulario por SMTP) |

Historial de versiones y cambios: [CHANGELOG.md](CHANGELOG.md). Estado de publicación, variables y pendientes: [PUBLICACION.md](PUBLICACION.md).

---

## Instalación

```bash
nvm use            # usa Node 24 (lee .nvmrc)
npm ci             # instala exactamente las versiones del package-lock.json
cp .env.example .env.local   # solo si vas a probar el envío del formulario en local
npm run dev        # http://localhost:3000
```

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Verifica la configuración (`scripts/check-env.mjs`) y compila para producción |
| `npm start` | Sirve la compilación |
| `npm run typecheck` | Revisión de tipos de TypeScript |
| `npm run lint` | ESLint (configuración oficial de Next.js) |
| `npm test` | Pruebas unitarias: validación del formulario y evaluación |
| `npm run test:api` | Pruebas de la API contra un servidor en marcha (`BASE_URL=...`) |
| `npm run check` | Tipos + lint + pruebas + compilación |

---

## Entornos

| Entorno | `NEXT_PUBLIC_APP_ENV` | Indexación | URL usada en enlaces y metadatos |
| --- | --- | --- | --- |
| Pruebas | `staging` (o sin definir) | Bloqueada (`noindex`, robots `Disallow: /`, sitemap vacío) | La URL de Vercel del despliegue |
| Producción | `production` | Permitida | `NEXT_PUBLIC_SITE_URL` (`https://pymemkt.com.mx`) |

`npm run build` revisa la configuración antes de compilar. En pruebas solo muestra avisos. En **producción detiene la compilación** si falta la URL, el WhatsApp, el correo, un canal de recepción del formulario o los datos del aviso de privacidad, o si alguna credencial lleva el prefijo `NEXT_PUBLIC_`.

Archivos de entorno:

- `.env.production` y `.env.development`: valores **públicos** compartidos (WhatsApp, correo). Se suben al repositorio.
- Variables por entorno y **secretas**: en Vercel → *Settings → Environment Variables*. Nunca en el repositorio.
- `.env.example`: referencia completa comentada.

---

## Recepción del formulario

La ruta `app/api/lead/route.ts` valida la solicitud y la entrega por uno de estos canales (`lib/server/deliver.ts`):

1. **SMTP** (recomendado): el buzón contacto@pymemkt.com.mx en Titan Email se envía a sí mismo cada solicitud. No requiere cambios de DNS.
2. **Resend**: alternativa por API; requiere verificar el dominio con registros DNS.
3. **Webhook** opcional: copia a Google Sheets, Make, Zapier o un CRM.

Reglas:

- El servidor responde `delivered: true` **solo** si un canal confirma la entrega (el servidor SMTP acepta el destinatario o la API o el webhook responden 2xx).
- Sin canal configurado responde 503; si el canal falla, 502. En ambos casos el formulario muestra «No pudimos enviar tu solicitud», conserva los datos y ofrece enviarlos por WhatsApp con la información ya escrita.
- La conversión (`form_submit` → `Lead`) se registra solo con entrega confirmada. Un fallo registra `form_delivery_failed`.
- Elegir «Llamada» o «Videollamada» es una **preferencia de contacto**, no una cita. El formulario y el correo lo dicen explícitamente.

Protección:

- Validación estricta del cuerpo: solo JSON (415), máximo 8 KB (413), objeto con tipos correctos (400 o 422). Nunca lanza un error sin controlar.
- Límite de 5 envíos por IP cada 10 minutos. Con Upstash Redis se comparte entre instancias; sin él es por instancia. Complemento recomendado: regla de **Vercel Firewall** (ver PUBLICACION.md).
- Campo trampa (honeypot), tiempo mínimo de llenado, verificación de origen y **Cloudflare Turnstile** opcional.
- Registros sin datos personales: solo identificador de solicitud, resultado y códigos técnicos.

---

## Privacidad y medición

- `/aviso-de-privacidad` se construye con los datos de `lib/privacy.ts`. Mientras falte un dato, la página muestra «Borrador», no se indexa y la compilación de producción se detiene.
- GA4 y Meta Pixel cargan **solo con consentimiento**. Si hay identificadores configurados aparece un aviso de cookies con Aceptar, Rechazar y Configurar. La elección se cambia desde «Preferencias de cookies» en el pie.

### Eventos

| Evento (GA4) | Meta Pixel | Cuándo |
| --- | --- | --- |
| `form_submit` | `Lead` | Solicitud entregada (confirmada por el servidor) |
| `form_delivery_failed` | personalizado | El envío no se pudo entregar |
| `contact_preference` | personalizado | Preferencia declarada: WhatsApp, Llamada o Videollamada |
| `diagnostic_complete` | `CompleteRegistration` | Terminó la evaluación |
| `diagnostic_request` | personalizado | Pidió diagnóstico desde su resultado (`channel`: whatsapp o form) |
| `whatsapp_click` | `Contact` | Abrió WhatsApp (`location` indica el botón) |
| `diagnostic_start`, `diagnostic_step`, `form_error`, `cta_click`, `problem_open`, `method_stage_open`, `solution_category`, `a3_demo_step` | personalizado | Interacción |

Marca `form_submit` como **evento clave** en GA4 y optimiza campañas de Meta por **Lead**.

---

## Estructura

```
app/
  layout.tsx · page.tsx · globals.css (Tailwind 4: tema y utilidades)
  api/lead/route.ts         Recepción de solicitudes
  aviso-de-privacidad/      Aviso de privacidad
  opengraph-image.tsx · sitemap.ts · robots.ts · favicon.ico · icon.png · apple-icon.png
components/
  sections/                 Hero, SystemDiagram, Problems, Diagnostic, Methodology, A3Demo, Solutions, Evidence, FinalCTA
  ContactForm · ConsentBanner · Analytics · Turnstile · Header · Footer · FloatingCTA · ui/
lib/
  config.ts                 Configuración y entornos
  content.ts · diagnostic.ts · a3demo.ts   Contenido editable
  lead.ts                   Validación compartida del formulario
  privacy.ts                Datos del aviso de privacidad (pendientes)
  consent.ts · analytics.ts · whatsapp.ts
  server/                   parse-lead, deliver, rate-limit, turnstile (solo servidor)
scripts/check-env.mjs       Verificación previa a la compilación
tests/                      Pruebas unitarias y de API
public/brand/               Logotipo oficial
```

Todo el texto editable vive en `lib/content.ts`, `lib/diagnostic.ts` y `lib/a3demo.ts`.

## Evaluación, WhatsApp y demostración

- **Evaluación:** 5 preguntas que se clasifican en Atracción, Conversión, Confianza y Dirección. El resultado explica por qué se obtuvo y se presenta como preliminar.
- **WhatsApp:** `NEXT_PUBLIC_WHATSAPP_NUMBER=525579270123`. Hay enlace directo en el hero, en la evaluación, en el botón flotante, en la barra móvil y en el cierre. El resultado abre WhatsApp con el área y las cinco respuestas, y el formulario lo ofrece como alternativa si el envío falla.
- **Growth A3:** demostración con una empresa ficticia, identificada como tal en tres lugares.
- **Casos reales:** agrégalos en `CASES` (`lib/content.ts`) solo con datos verificables y autorización del cliente.

## Accesibilidad y rendimiento

Estructura semántica, foco visible, áreas táctiles de 44 px, diálogos con trampa de foco y `prefers-reduced-motion` respetado: el diagrama del hero se detiene sin errores de hidratación. La página principal es estática, las fuentes son locales y no hay scripts de terceros sin consentimiento.
