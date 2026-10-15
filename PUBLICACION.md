# Estado de publicación — PYMEmkt 1.1.0

**Estado: lista para pruebas de publicación. Todavía NO está lista para recibir prospectos.**

Para estarlo faltan tres comprobaciones con servicios reales (detalle en «Pruebas pendientes»):

1. Enviar una solicitud real por el SMTP de Titan y verla llegar a contacto@pymemkt.com.mx.
2. Abrir los enlaces de WhatsApp en un teléfono y confirmar que llegan al número 525579270123.
3. Completar y revisar el aviso de privacidad.

No se publicó nada ni se tocaron DNS, dominio ni alojamiento. El sitio actual de pymemkt.com.mx sigue igual.

---

## 1. Resultados de verificación (15 de octubre de 2026, Node 24.22.0, npm 10.9.4)

| Comando | Resultado |
| --- | --- |
| `npm ci` | Instalación limpia desde el `package-lock.json` |
| `npm run typecheck` | Sin errores |
| `npm run lint` | Sin errores ni advertencias |
| `npm test` | 12 de 12 pruebas unitarias aprobadas |
| `npm run build` | Compilación exitosa con Next.js 16.4.1. La configuración de pruebas da 3 avisos esperados: sin SMTP, sin Upstash y aviso de privacidad incompleto |
| `npm run test:api` | 15 de 15 pruebas aprobadas contra un servidor SMTP local con autenticación |
| `npm audit --omit=dev` | **0 vulnerabilidades** en lo que se publica |
| `npm audit` (completo) | 5 altas, solo en herramientas de desarrollo, por `braces`, que no tiene versión corregida. Ver CHANGELOG.md |
| Compilación de producción sin aviso de privacidad | **Se detiene a propósito** con «Aviso de privacidad incompleto» |

---

## 2. Variables por entorno

Durante las pruebas el proyecto de Vercel no tendrá dominio propio: usará la URL `*.vercel.app` y el sitio actual no se ve afectado.

| Variable | Pruebas | Producción | Dónde | Estado |
| --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_APP_ENV` | `staging` | `production` | Vercel (todos los entornos durante pruebas) | Definir |
| `NEXT_PUBLIC_SITE_URL` | *(vacía)* | `https://pymemkt.com.mx` | Vercel | Definir al lanzar |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `525579270123` | igual | `.env.production` | ✔ Configurada |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `contacto@pymemkt.com.mx` | igual | `.env.production` | ✔ Configurada |
| `NEXT_PUBLIC_DEMO_MODE` | `false` | `false` | `.env.production` | ✔ Desactivado (bloqueado en producción) |
| `LEAD_EMAIL_TO` | `contacto@pymemkt.com.mx` | igual | Vercel | Definir |
| `LEAD_EMAIL_FROM` | `PYMEmkt Web <contacto@pymemkt.com.mx>` | igual | Vercel | Definir |
| `SMTP_HOST` | `smtp.titan.email` | igual | Vercel | Definir |
| `SMTP_PORT` | `465` | igual | Vercel | Definir |
| `SMTP_SECURE` | `true` | igual | Vercel | Definir |
| `SMTP_USER` | `contacto@pymemkt.com.mx` | igual | Vercel | Definir |
| `SMTP_PASS` | contraseña del buzón | igual | Vercel (**secreta**) | **Pendiente: la capturas tú** |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | opcional | recomendada | Vercel (integración Upstash) | Pendiente |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | opcional | opcional | Vercel | Pendiente, si llegan envíos automatizados |
| `NEXT_PUBLIC_GA4_ID` | vacía | `G-…` | Vercel | Pendiente |
| `NEXT_PUBLIC_META_PIXEL_ID` | vacía | número | Vercel | Pendiente |
| `LEAD_WEBHOOK_URL` / `_SECRET` | opcional | opcional | Vercel | Solo si quieres copia en Sheets o CRM |

Reglas:

- Las contraseñas y claves **nunca** llevan prefijo `NEXT_PUBLIC_`. La compilación falla si alguna lo tiene.
- No compartas la contraseña del correo por chat: captúrala directamente en Vercel.
- Cada cambio de variables requiere volver a desplegar (*Redeploy*).

---

## 3. Accesos y datos pendientes

| # | Qué | Quién | Para qué |
| --- | --- | --- | --- |
| 1 | Activar el acceso de aplicaciones de terceros en el buzón contacto@pymemkt.com.mx (Titan). Con verificación en dos pasos, crear una contraseña de aplicación | PYMEmkt | Que el sitio pueda enviar por SMTP ([guía de Titan](https://support.titan.email/hc/en-us/articles/4405162224665-Configuring-Titan-on-Email-Scripts)) |
| 2 | Capturar `SMTP_PASS` en Vercel | PYMEmkt | Recepción del formulario |
| 3 | Repositorio privado en GitHub y proyecto en Vercel (plan Pro, por uso comercial) | PYMEmkt | Despliegue de pruebas |
| 4 | Datos del aviso de privacidad: responsable (nombre o razón social), domicilio, correo para solicitudes ARCO, finalidades secundarias o «Ninguna», transferencias o «Ninguna», plazo de conservación y fecha | PYMEmkt | Completar `lib/privacy.ts`. Sin ellos no compila producción |
| 5 | Revisión legal del aviso de privacidad | Especialista | El texto es un borrador técnico, no asesoría legal |
| 6 | Regla de Vercel Firewall (ver abajo) | PYMEmkt | Límite de envíos real entre instancias |
| 7 | Upstash Redis desde Vercel → Storage / Marketplace (opcional, recomendado) | PYMEmkt | Límite por IP compartido |
| 8 | IDs de GA4 y Meta Pixel | PYMEmkt | Medición, cuando quieras activarla |
| 9 | Correo de pruebas distinto a contacto@ (opcional) | PYMEmkt | Probar sin mezclar con prospectos reales |

### Regla recomendada en Vercel Firewall

Firewall → Configure → New Rule ([documentación](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting)):

- **If** Request Path *equals* `/api/lead` **and** Method *equals* `POST`
- **Then** Rate Limit · Fixed Window · **60 s** · **5 solicitudes** · clave: **IP** · acción: **429**
- Review Changes → Publish. Está disponible en todos los planes: Hobby permite 1 regla de este tipo y Pro hasta 40.

El código ya trae su propio límite: 5 envíos cada 10 minutos por IP, compartido si configuras Upstash. La regla del firewall detiene el abuso antes de que llegue a la función.

---

## 4. Funciones probadas en esta entrega

Probadas aquí con Chromium automatizado a 1440 px y 390 px, más 390 px con movimiento reducido:

- **Navegación:** menú, anclas, pie, enlace al aviso y regreso al sitio.
- **Evaluación:**
  - Cinco preguntas, regresar, repetir y resultado con explicación.
  - Las 1,440 combinaciones de respuestas producen un área válida (prueba unitaria).
- **WhatsApp:**
  - Todos los enlaces directos apuntan a `wa.me/525579270123`: hero, evaluación, botón flotante, barra móvil, cierre y alternativa del formulario.
  - El mensaje del resultado incluye el área y las cinco respuestas.
- **Formulario:**
  - Con entrega confirmada: muestra «Recibimos tu solicitud», registra 1 solo `form_submit` y 1 `Lead`, y llega el correo al servidor SMTP de prueba con autenticación.
  - Llamada o videollamada: el texto dice «Todavía no hay una cita agendada». Ya no existe el evento `Schedule`.
  - Sin canal configurado (503), con contraseña incorrecta (502) o con el SMTP caído (502): muestra «No pudimos enviar tu solicitud… No se registró ningún envío», conserva los datos, ofrece WhatsApp con nombre, empresa, teléfono y situación, y no registra conversión.
- **API:**
  - Responde con error controlado ante JSON nulo, listas, texto, números, JSON inválido, cuerpo vacío, tipos incorrectos, campos faltantes, Content-Type incorrecto, cuerpo de más de 8 KB, honeypot, envío demasiado rápido, origen ajeno y método GET.
  - Límite por IP: el 6.º envío recibe 429.
  - Los registros no contienen datos personales.
- **Consentimiento:**
  - Antes de decidir no carga ningún script de medición, y al rechazar tampoco.
  - Al aceptar se cargan GA4 y Meta Pixel.
  - «Preferencias de cookies» reabre el aviso.
- **Entornos:**
  - Pruebas: `noindex`, robots `Disallow: /`, sitemap vacío y URL canónica de Vercel.
  - Producción: `index`, robots con sitemap y canónica `https://pymemkt.com.mx`.
  - Ningún «localhost» ni dominio de ejemplo en el HTML.
- **Recursos:** logotipos, favicon, ícono de Apple, imagen para compartir, robots y sitemap responden 200.
- **Diseño:**
  - Comparación de capturas antes y después de la actualización. Las diferencias restantes son de 1 a 3 px y trazos de íconos de Lucide 1.x.
  - Sin desbordamiento horizontal. Botones y enlaces de navegación con área táctil de al menos 44 px (los enlaces dentro de un párrafo, como el del aviso, quedan como texto).

## 5. Pruebas pendientes con servicios reales

| Prueba | Cómo | Bloquea recibir prospectos |
| --- | --- | --- |
| Envío real por SMTP de Titan | Con las variables en Vercel: llenar el formulario en la URL de pruebas, o `SEND_REAL=1 BASE_URL=https://<proyecto>.vercel.app npm run test:api`. Confirmar que llega a contacto@pymemkt.com.mx y no a spam | **Sí** |
| WhatsApp en teléfono real | Desde un celular, tocar cada botón y confirmar que abre el chat de 525579270123 con el mensaje | **Sí** |
| Aviso de privacidad | Completar `lib/privacy.ts` y revisarlo legalmente | **Sí** (producción no compila sin él) |
| Despliegue en Vercel con Node 24 | Primer despliegue de pruebas | Sí |
| Safari en iPhone y Chrome en Android | Recorrido completo en dispositivos reales (aquí solo se emuló con Chromium) | Recomendado |
| Límite distribuido y regla de Firewall | Tras configurar Upstash y la regla, enviar 6 solicitudes seguidas | Recomendado |
| GA4 y Meta Pixel | Con los IDs: aceptar cookies y ver los eventos en GA4 Tiempo real y en el Administrador de eventos de Meta | No |
| Imagen al compartir | Probar la URL de pruebas en el [Depurador de compartir de Meta](https://developers.facebook.com/tools/debug/) | No |
| Turnstile | Solo si se activa | No |

## 6. Pasos para las pruebas de publicación

1. Subir el proyecto a un repositorio privado de GitHub. `.env.local` y `node_modules` ya están excluidos.
2. En Vercel: Add New → Project → importar el repositorio. Vercel detecta Next.js y usa Node 24 por `engines`.
3. Capturar las variables de la columna «Pruebas» de la sección 2.
4. Desplegar. **No agregar dominio.**
5. Hacer las pruebas de la sección 5.
6. Para lanzar: completar el aviso, cambiar a `NEXT_PUBLIC_APP_ENV=production`, definir `NEXT_PUBLIC_SITE_URL=https://pymemkt.com.mx`, volver a desplegar y, solo entonces, conectar el dominio. Ese paso cambia los DNS y reemplaza el sitio actual.
