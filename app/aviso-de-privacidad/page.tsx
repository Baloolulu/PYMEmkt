import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileWarning } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Footer } from "@/components/Footer";
import { PRIVACY, PRIVACY_LABELS, privacyIsDraft, privacyPending, type PrivacyData } from "@/lib/privacy";
import { hasAnalytics, siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description: "Aviso de privacidad integral del sitio de PYMEmkt.",
  alternates: { canonical: "/aviso-de-privacidad" },
  robots: privacyIsDraft || !siteConfig.indexable ? { index: false, follow: false } : { index: true, follow: true },
};

/** Muestra el dato real o una marca visible de pendiente. */
function V({ k }: { k: keyof PrivacyData }) {
  const v = PRIVACY[k];
  if (v) return <>{v}</>;
  return (
    <mark className="rounded bg-amber-100 px-1.5 py-0.5 font-medium text-amber-900">[Pendiente: {PRIVACY_LABELS[k].toLowerCase()}]</mark>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-ink/10 py-8">
      <h2 className="flex items-baseline gap-4 font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
        <span className="font-mono text-sm font-normal text-electric">{n}</span>
        {title}
      </h2>
      <div className="mt-4 space-y-3 pl-0 leading-relaxed text-ink/75 sm:pl-10 [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <header className="bg-ink text-white">
        <div className="container flex h-16 items-center justify-between lg:h-18">
          <Link href="/" aria-label="PYMEmkt, ir al inicio" className="py-2.5">
            <Logo height={24} priority />
          </Link>
          <Link href="/#contacto" className="inline-flex min-h-11 items-center gap-2 text-sm text-white/70 hover:text-white">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Volver al sitio
          </Link>
        </div>
      </header>

      <main id="contenido" className="bg-mist">
        <div className="container max-w-3xl! py-14 sm:py-20">
          {privacyIsDraft && (
            <div role="note" className="mb-10 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-950">
              <p className="flex items-center gap-2 font-semibold">
                <FileWarning className="h-4 w-4" aria-hidden />
                Borrador pendiente de completar
              </p>
              <p className="mt-2 text-amber-900/80">
                Este aviso aún no es definitivo. Faltan los datos marcados en amarillo; la versión de producción no se puede
                compilar hasta completarlos en <code>lib/privacy.ts</code>.
              </p>
              <ul className="mt-2 list-disc pl-5 text-amber-900/80">
                {privacyPending.map((k) => (
                  <li key={k}>{PRIVACY_LABELS[k]}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="eyebrow text-electric">Documento legal</p>
          <h1 className="display mt-4 text-4xl leading-tight text-ink sm:text-5xl sm:leading-none">Aviso de privacidad integral</h1>
          <p className="mt-4 text-sm text-ink/55">
            Última actualización: <V k="ultimaActualizacion" />
          </p>
          <p className="mt-6 leading-relaxed text-ink/75">
            Este aviso explica cómo se tratan los datos personales que compartes en el sitio de PYMEmkt, conforme a la Ley Federal
            de Protección de Datos Personales en Posesión de los Particulares.
          </p>

          <div className="mt-10">
            <Section n="01" title="Responsable del tratamiento">
              <p>
                <V k="responsable" />, con domicilio en <V k="domicilio" />, es responsable del tratamiento de tus datos personales.
              </p>
              <p>
                Contacto para temas de privacidad: <V k="correoArco" />.
              </p>
            </Section>

            <Section n="02" title="Datos personales que recabamos">
              <p>A través del formulario «Solicitar diagnóstico» recabamos:</p>
              <ul>
                <li>Nombre y nombre de tu empresa.</li>
                <li>Número de WhatsApp o teléfono.</li>
                <li>Correo electrónico, si decides proporcionarlo.</li>
                <li>La situación comercial que seleccionas, tu medio preferido de contacto y el comentario que escribas.</li>
                <li>Si completaste la evaluación interactiva, el área de oportunidad que obtuviste.</li>
              </ul>
              <p>
                No solicitamos datos personales sensibles. Te pedimos no incluirlos en el campo de comentarios.
              </p>
              <p>
                Las respuestas de la evaluación interactiva se procesan en tu navegador y no se envían a nuestros servidores. Solo
                las compartes con nosotros si eliges enviarlas por WhatsApp; en ese caso, el envío se realiza a través de WhatsApp.
              </p>
            </Section>

            <Section n="03" title="Finalidades del tratamiento">
              <p>Usamos tus datos para estas finalidades necesarias para atender tu solicitud:</p>
              <ul>
                <li>Recibir y dar seguimiento a tu solicitud de diagnóstico.</li>
                <li>Contactarte por el medio que elegiste para acordar fecha y hora de la conversación.</li>
                <li>Preparar el diagnóstico con la información que nos compartiste.</li>
              </ul>
              <p>
                Finalidades secundarias: <V k="finalidadesSecundarias" />.
              </p>
              {PRIVACY.finalidadesSecundarias?.toLowerCase() !== "ninguna" && (
                <p>
                  Si no deseas que tus datos se usen para finalidades secundarias, escríbenos a <V k="correoArco" />. Tu negativa no
                  afecta la atención de tu solicitud.
                </p>
              )}
            </Section>

            <Section n="04" title="Proveedores y transferencias">
              <p>
                Para operar el sitio nos apoyamos en proveedores que tratan datos por cuenta nuestra: el servicio de alojamiento del
                sitio (Vercel Inc.) y el servicio de correo electrónico donde recibimos las solicitudes (Titan Email).
                {hasAnalytics && " Si lo aceptas, también Google (Google Analytics) y Meta (Meta Pixel); consulta la sección 05."}
              </p>
              <p>
                Transferencias a terceros: <V k="transferencias" />.
              </p>
            </Section>

            <Section n="05" title="Cookies y tecnologías de medición">
              <p>
                El sitio no usa cookies de medición ni de publicidad sin tu consentimiento. Si las aceptas, se activan Google
                Analytics 4, para conocer de forma agregada cómo se usa el sitio, y Meta Pixel, para medir el resultado de nuestras
                campañas en Facebook e Instagram.
              </p>
              <p>
                Puedes cambiar tu decisión en cualquier momento desde «Preferencias de cookies», en el pie de página. También puedes
                eliminar las cookies desde la configuración de tu navegador.
              </p>
            </Section>

            <Section n="06" title="Derechos ARCO y revocación del consentimiento">
              <p>
                Puedes acceder a tus datos, rectificarlos, cancelarlos u oponerte a su tratamiento (derechos ARCO), así como revocar
                tu consentimiento o limitar el uso y divulgación de tus datos. Envía tu solicitud a <V k="correoArco" /> con:
              </p>
              <ul>
                <li>Tu nombre y un medio para comunicarte la respuesta.</li>
                <li>Un documento que acredite tu identidad o, en su caso, la de tu representante.</li>
                <li>La descripción clara de los datos y del derecho que deseas ejercer.</li>
              </ul>
              <p>
                Te comunicaremos nuestra determinación en un máximo de 20 días hábiles y, si procede, la haremos efectiva dentro de
                los 15 días hábiles siguientes.
              </p>
            </Section>

            <Section n="07" title="Conservación de los datos">
              <p>
                Conservamos tus datos durante: <V k="conservacion" />. Después los eliminamos de forma segura.
              </p>
            </Section>

            <Section n="08" title="Cambios a este aviso">
              <p>
                Cualquier cambio a este aviso se publicará en esta misma página, con su fecha de actualización.
              </p>
              <p>
                Si consideras que tu derecho a la protección de datos fue vulnerado, puedes acudir a la Secretaría Anticorrupción y
                Buen Gobierno, autoridad competente en la materia.
              </p>
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
