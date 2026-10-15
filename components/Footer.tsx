import { navItems, siteConfig } from "@/lib/config";
import Link from "next/link";
import { Logo } from "./ui/Logo";
import { CookiePrefsButton } from "./CookiePrefsButton";

export function Footer() {
  const { email } = siteConfig.contact;
  const socials = [
    { label: "Instagram", href: siteConfig.social.instagram },
    { label: "Facebook", href: siteConfig.social.facebook },
    { label: "LinkedIn", href: siteConfig.social.linkedin },
  ].filter((s): s is { label: string; href: string } => Boolean(s.href));

  return (
    <footer className="border-t border-white/8 bg-ink text-white">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Logo variant="lockup" height={50} />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/50">
            Diagnóstico comercial y sistemas de crecimiento para pequeñas y medianas empresas en México.
          </p>
        </div>
        <nav aria-label="Pie de página">
          <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-white/35">Explorar</p>
          <ul className="mt-2 text-sm">
            {navItems.map((n) => (
              <li key={n.href}>
                <Link href={`/${n.href}`} className="inline-flex min-h-11 items-center text-white/65 transition-colors hover:text-white">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/#contacto" className="inline-flex min-h-11 items-center text-white/65 transition-colors hover:text-white">
                Solicitar diagnóstico
              </Link>
            </li>
          </ul>
        </nav>
        <div>
          <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-white/35">Contacto</p>
          <ul className="mt-2 text-sm">
            {email && (
              <li>
                <a href={`mailto:${email}`} className="inline-flex min-h-11 items-center text-white/65 transition-colors hover:text-white">
                  {email}
                </a>
              </li>
            )}
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-white/65 transition-colors hover:text-white">
                  {s.label}
                </a>
              </li>
            ))}
            {!email && socials.length === 0 && (
              <li>
                <Link href="/#contacto" className="inline-flex min-h-11 items-center text-white/65 transition-colors hover:text-white">
                  Formulario de diagnóstico
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/6">
        <div className="container flex flex-col justify-between gap-1 pb-28 pt-3 text-xs text-white/45 sm:flex-row sm:items-center sm:pb-3">
          <p>© {new Date().getFullYear()} PYMEmkt. Todos los derechos reservados.</p>
          <div className="flex flex-wrap items-center gap-x-5">
            <Link href="/aviso-de-privacidad" className="inline-flex min-h-11 items-center hover:text-white">
              Aviso de privacidad
            </Link>
            <CookiePrefsButton className="inline-flex min-h-11 items-center hover:text-white" />
          </div>
        </div>
      </div>
    </footer>
  );
}
