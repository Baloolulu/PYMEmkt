"use client";

import Script from "next/script";
import { siteConfig } from "@/lib/config";
import { useConsent } from "@/lib/consent";

/**
 * Carga GA4 y Meta Pixel SOLO si:
 *  1) su identificador está configurado, y
 *  2) el visitante aceptó esa categoría en el aviso de cookies.
 * Si después retira el consentimiento, se dejan de enviar datos desde la siguiente carga de página.
 */
export function Analytics() {
  const consent = useConsent();
  const { ga4Id, metaPixelId } = siteConfig.analytics;
  if (!consent) return null;

  return (
    <>
      {ga4Id && consent.analytics && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${ga4Id}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {metaPixelId && consent.marketing && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}
