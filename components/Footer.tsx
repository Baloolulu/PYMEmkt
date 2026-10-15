import { navItems, siteConfig } from "@/lib/config";
import { Logo } from "./ui/Logo";

export function Footer() {
  const { email } = siteConfig.contact;
  const socials = [
    { label: "Instagram", href: siteConfig.social.instagram },
    { label: "Facebook", href: siteConfig.social.facebook },
    { label: "LinkedIn", href: siteConfig.social.linkedin },
  ].filter((s): s is { label: string; href: string } => Boolean(s.href));

  return (
    <footer className="border-t border-white/[0.08] bg-ink text-white">
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
                <a href={n.href} className="inline-flex min-h-11 items-center text-white/65 transition-colors hover:text-white">
                  {n.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#contacto" className="inline-flex min-h-11 items-center text-white/65 transition-colors hover:text-white">
                Solicitar diagnóstico
              </a>
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
                <a href="#contacto" className="inline-flex min-h-11 items-center text-white/65 transition-colors hover:text-white">
                  Formulario de diagnóstico
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="container flex flex-col justify-between gap-2 pb-28 pt-6 text-xs text-white/35 sm:flex-row sm:pb-6">
          <p>© {new Date().getFullYear()} PYMEmkt. Todos los derechos reservados.</p>
          <p>Menos improvisación. Más crecimiento.</p>
        </div>
      </div>
    </footer>
  );
}
