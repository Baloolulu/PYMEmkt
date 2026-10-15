import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { siteConfig } from "@/lib/config";
import { Analytics } from "@/components/Analytics";
import { Providers } from "@/components/Providers";
import { ConsentBanner } from "@/components/ConsentBanner";

const title = "PYMEmkt | Growth Systems — Diagnóstico y estrategia comercial para PYMEs";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: title, template: "%s | PYMEmkt" },
  description: siteConfig.description,
  applicationName: "PYMEmkt",
  keywords: [
    "diagnóstico comercial",
    "estrategia de crecimiento",
    "marketing para PYMEs",
    "consultoría comercial México",
    "automatización comercial",
    "Meta Ads",
    "Google Ads",
    "WhatsApp Business",
    "Growth A3",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/",
    siteName: "PYMEmkt",
    title,
    description:
      "Tu empresa no necesita más acciones aisladas. Necesita un sistema que genere oportunidades.",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description:
      "Tu empresa no necesita más acciones aisladas. Necesita un sistema que genere oportunidades.",
  },
  robots: siteConfig.indexable ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0B0F19",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "PYMEmkt",
  slogan: "Menos improvisación. Más crecimiento.",
  description: siteConfig.description,
  url: siteConfig.url,
  areaServed: { "@type": "Country", name: "México" },
  knowsAbout: [
    "Diagnóstico comercial",
    "Estrategia de crecimiento",
    "Marketing digital",
    "Inteligencia artificial",
    "Automatización comercial",
  ],
  ...(siteConfig.contact.email ? { email: siteConfig.contact.email } : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es-MX"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-ink"
        >
          Saltar al contenido
        </a>
        <Providers>{children}</Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Analytics />
        <ConsentBanner />
      </body>
    </html>
  );
}
