"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { CHALLENGES, CONTACT_PREFS, leadSummary, validateLead, type LeadErrors, type LeadInput } from "@/lib/lead";
import { AREAS } from "@/lib/diagnostic";
import { whatsappLink } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/config";
import { track } from "@/lib/analytics";
import { useDiagnostic } from "./DiagnosticContext";
import { Button, buttonClass } from "./ui/Button";

const AREA_TO_CHALLENGE: Record<string, (typeof CHALLENGES)[number]> = {
  atraccion: "No llegan suficientes prospectos",
  conversion: "Recibo mensajes, pero pocas ventas",
  confianza: "Dependo demasiado de recomendaciones",
  direccion: "No sé qué acciones realmente funcionan",
};

const empty: LeadInput = {
  name: "",
  company: "",
  phone: "",
  email: "",
  challenge: "",
  preference: "WhatsApp",
  message: "",
  consent: false,
  website: "",
};

type Status = "idle" | "sending" | "success" | "error";

function Field({
  id,
  label,
  error,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between text-sm font-medium text-ink">
        {label}
        {optional && <span className="text-xs font-normal text-ink/40">Opcional</span>}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-[0.8rem] text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}

const inputCls = (err?: string) =>
  `block w-full rounded-xl border bg-white px-4 py-3 text-base text-ink sm:text-[0.95rem] placeholder:text-ink/35 transition-[border-color,box-shadow] focus:outline-none focus:ring-4 ${
    err ? "border-red-400 focus:border-red-500 focus:ring-red-500/15" : "border-ink/15 focus:border-electric focus:ring-electric/15"
  }`;

export function ContactForm() {
  const uid = useId();
  const { result, intent } = useDiagnostic();
  const [data, setData] = useState<LeadInput>(empty);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof LeadInput, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMsg, setServerMsg] = useState("");
  const [delivered, setDelivered] = useState(true);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  // Preselección según el resultado del diagnóstico o el problema elegido
  useEffect(() => {
    let pre: string | undefined;
    if (intent && (CHALLENGES as readonly string[]).includes(intent.replace(/\.$/, ""))) pre = intent.replace(/\.$/, "");
    else if (result) pre = AREA_TO_CHALLENGE[result.primary];
    if (pre) setData((d) => ({ ...d, challenge: pre as string }));
  }, [intent, result]);

  const set = <K extends keyof LeadInput>(k: K, v: LeadInput[K]) => {
    const next = { ...data, [k]: v };
    setData(next);
    if (touched[k]) setErrors(validateLead(next));
  };

  const blur = (k: keyof LeadInput) => {
    // No marcar como error un campo vacío solo por pasar por él: evita saltos de diseño
    // justo cuando el usuario va a pulsar "Enviar". La validación completa ocurre al enviar.
    const v = data[k];
    if (typeof v === "string" && v.trim() === "" && !touched[k]) return;
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validateLead(data));
  };

  const ids = {
    name: "lead-name",
    company: `${uid}-company`,
    phone: `${uid}-phone`,
    email: `${uid}-email`,
    challenge: `${uid}-challenge`,
    message: `${uid}-message`,
    consent: `${uid}-consent`,
  };

  const visible = (k: keyof LeadInput) => (touched[k] || status === "error" ? errors[k] : undefined);

  const payload = (): LeadInput => ({
    ...data,
    context: intent ?? undefined,
    diagnosticArea: result ? AREAS[result.primary].label : undefined,
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateLead(data);
    setErrors(errs);
    setTouched({ name: true, company: true, phone: true, email: true, challenge: true, preference: true, message: true, consent: true });
    if (Object.keys(errs).length) {
      setStatus("error");
      setServerMsg("");
      track("form_error", { fields: Object.keys(errs).join(",") });
      window.setTimeout(() => summaryRef.current?.focus(), 30);
      return;
    }
    setStatus("sending");
    setServerMsg("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload()),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; delivered?: boolean; error?: string; errors?: LeadErrors };
      if (!res.ok || !json.ok) {
        if (json.errors) setErrors(json.errors);
        setServerMsg(json.error ?? "No pudimos enviar tu solicitud. Intenta de nuevo.");
        setStatus("error");
        track("form_error", { reason: `http_${res.status}` });
        window.setTimeout(() => summaryRef.current?.focus(), 30);
        return;
      }
      setDelivered(json.delivered !== false);
      setStatus("success");
      track("form_submit", { challenge: data.challenge, preference: data.preference });
      if (data.preference === "Videollamada" || data.preference === "Llamada") {
        track("meeting_request", { type: data.preference });
      }
      window.setTimeout(() => successRef.current?.focus(), 60);
    } catch {
      setServerMsg("Hubo un problema de conexión. Revisa tu internet e intenta de nuevo.");
      setStatus("error");
      track("form_error", { reason: "network" });
      window.setTimeout(() => summaryRef.current?.focus(), 30);
    }
  };

  const wa = whatsappLink(leadSummary(payload()));
  const errorCount = Object.keys(errors).length;

  return (
    <div className="relative rounded-[1.75rem] bg-white p-6 text-ink shadow-[0_40px_120px_-40px_rgba(0,0,0,0.6)] sm:p-9">
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <motion.div
            key="ok"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex min-h-[520px] flex-col justify-center"
            role="status"
          >
            <CheckCircle2 className="h-12 w-12 text-electric" aria-hidden />
            <h3 ref={successRef} tabIndex={-1} className="display mt-6 text-3xl leading-tight outline-none">
              {delivered ? "Recibimos tu solicitud." : "Tu solicitud está casi lista."}
            </h3>
            <p className="mt-4 max-w-md leading-relaxed text-ink/60">
              {delivered
                ? `Revisaremos tu información y te contactaremos por ${data.preference.toLowerCase()} para agendar el diagnóstico.`
                : wa
                  ? "Para asegurarnos de recibirla, envíanosla por WhatsApp. El mensaje ya está redactado."
                  : siteConfig.contact.email
                    ? `Para asegurarnos de recibirla, escríbenos a ${siteConfig.contact.email}.`
                    : "Guardamos tus datos, pero el canal de envío aún no está configurado en este sitio."}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("whatsapp_click", { location: "form_success" })}
                  className={buttonClass(delivered ? "outline" : "primary")}
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  {delivered ? "Adelantar por WhatsApp" : "Enviar por WhatsApp"}
                </a>
              )}
              {!wa && !delivered && siteConfig.contact.email && (
                <a
                  href={`mailto:${siteConfig.contact.email}?subject=${encodeURIComponent("Solicitud de diagnóstico")}&body=${encodeURIComponent(leadSummary(payload()))}`}
                  className={buttonClass("primary")}
                >
                  Enviar por correo
                </a>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  setData(empty);
                  setTouched({});
                  setErrors({});
                  setStatus("idle");
                }}
              >
                Enviar otra solicitud
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.form key="form" noValidate onSubmit={submit} aria-describedby={`${uid}-req`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="display text-2xl leading-tight sm:text-[1.7rem]">Solicitar diagnóstico</h3>
                <p id={`${uid}-req`} className="mt-1.5 text-sm text-ink/50">
                  Toma menos de un minuto. Los campos sin la etiqueta «Opcional» son obligatorios.
                </p>
              </div>
            </div>

            {(intent || result) && (
              <p className="mt-5 inline-flex flex-wrap items-center gap-2 rounded-full bg-electric/[0.07] px-3 py-1.5 text-xs text-electric">
                <span className="font-mono uppercase tracking-[0.12em]">Contexto</span>
                <span className="text-ink/70">
                  {result ? `Evaluación: ${AREAS[result.primary].label}` : intent}
                </span>
              </p>
            )}

            {status === "error" && (errorCount > 0 || serverMsg) && (
              <div
                ref={summaryRef}
                tabIndex={-1}
                role="alert"
                className="mt-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 outline-none"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>
                  {serverMsg ||
                    (errorCount === 1 ? "Revisa el campo marcado para continuar." : `Revisa los ${errorCount} campos marcados para continuar.`)}
                </span>
              </div>
            )}

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field id={ids.name} label="Nombre" error={visible("name")}>
                <input
                  id={ids.name}
                  name="name"
                  autoComplete="name"
                  value={data.name}
                  onChange={(e) => set("name", e.target.value)}
                  onBlur={() => blur("name")}
                  aria-invalid={!!visible("name")}
                  aria-describedby={visible("name") ? `${ids.name}-error` : undefined}
                  className={inputCls(visible("name"))}
                  placeholder="Tu nombre"
                />
              </Field>
              <Field id={ids.company} label="Empresa" error={visible("company")}>
                <input
                  id={ids.company}
                  name="company"
                  autoComplete="organization"
                  value={data.company}
                  onChange={(e) => set("company", e.target.value)}
                  onBlur={() => blur("company")}
                  aria-invalid={!!visible("company")}
                  aria-describedby={visible("company") ? `${ids.company}-error` : undefined}
                  className={inputCls(visible("company"))}
                  placeholder="Nombre de tu empresa"
                />
              </Field>
              <Field id={ids.phone} label="WhatsApp o teléfono" error={visible("phone")}>
                <input
                  id={ids.phone}
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={data.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  onBlur={() => blur("phone")}
                  aria-invalid={!!visible("phone")}
                  aria-describedby={visible("phone") ? `${ids.phone}-error` : undefined}
                  className={inputCls(visible("phone"))}
                  placeholder="10 dígitos"
                />
              </Field>
              <Field id={ids.email} label="Correo" optional error={visible("email")}>
                <input
                  id={ids.email}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={data.email}
                  onChange={(e) => set("email", e.target.value)}
                  onBlur={() => blur("email")}
                  aria-invalid={!!visible("email")}
                  aria-describedby={visible("email") ? `${ids.email}-error` : undefined}
                  className={inputCls(visible("email"))}
                  placeholder="nombre@empresa.com"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field id={ids.challenge} label="¿Qué describe mejor tu situación?" error={visible("challenge")}>
                  <select
                    id={ids.challenge}
                    name="challenge"
                    value={data.challenge}
                    onChange={(e) => set("challenge", e.target.value)}
                    onBlur={() => blur("challenge")}
                    aria-invalid={!!visible("challenge")}
                    aria-describedby={visible("challenge") ? `${ids.challenge}-error` : undefined}
                    className={`${inputCls(visible("challenge"))} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%230B0F19' stroke-width='1.6'%3E%3Cpath d='M2 4l4 4 4-4'/%3E%3C/svg%3E")] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10`}
                  >
                    <option value="" disabled>
                      Selecciona una opción
                    </option>
                    {CHALLENGES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <fieldset className="sm:col-span-2">
                <legend className="text-sm font-medium text-ink">¿Cómo prefieres continuar?</legend>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {CONTACT_PREFS.map((p) => (
                    <label
                      key={p}
                      className={`flex cursor-pointer items-center justify-center rounded-xl border px-2 py-2.5 text-sm transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-electric/20 ${
                        data.preference === p ? "border-electric bg-electric/[0.06] font-medium text-electric" : "border-ink/15 text-ink/70 hover:border-ink/35"
                      }`}
                    >
                      <input
                        type="radio"
                        name="preference"
                        value={p}
                        checked={data.preference === p}
                        onChange={() => set("preference", p)}
                        className="sr-only"
                      />
                      {p}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="sm:col-span-2">
                <Field id={ids.message} label="¿Algo que debamos saber?" optional error={visible("message")}>
                  <textarea
                    id={ids.message}
                    name="message"
                    rows={3}
                    maxLength={600}
                    value={data.message}
                    onChange={(e) => set("message", e.target.value)}
                    onBlur={() => blur("message")}
                    aria-invalid={!!visible("message")}
                    aria-describedby={visible("message") ? `${ids.message}-error` : undefined}
                    className={`${inputCls(visible("message"))} resize-none`}
                    placeholder="Giro, tamaño del equipo, qué has intentado…"
                  />
                </Field>
              </div>

              {/* honeypot */}
              <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                <label>
                  No llenar
                  <input tabIndex={-1} autoComplete="off" value={data.website} onChange={(e) => set("website", e.target.value)} />
                </label>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor={ids.consent} className="flex cursor-pointer items-start gap-3 text-sm text-ink/65">
                  <input
                    id={ids.consent}
                    type="checkbox"
                    checked={data.consent}
                    onChange={(e) => {
                      set("consent", e.target.checked);
                      setTouched((t) => ({ ...t, consent: true }));
                    }}
                    aria-invalid={!!visible("consent")}
                    aria-describedby={visible("consent") ? `${ids.consent}-error` : undefined}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink/30 accent-electric"
                  />
                  Autorizo a PYMEmkt a contactarme para dar seguimiento a esta solicitud.
                </label>
                {visible("consent") && (
                  <p id={`${ids.consent}-error`} className="mt-1.5 flex items-center gap-1.5 text-[0.8rem] text-red-600">
                    <AlertCircle className="h-3.5 w-3.5" aria-hidden />
                    {visible("consent")}
                  </p>
                )}
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" disabled={status === "sending"} className="mt-7 w-full">
              {status === "sending" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Enviando…
                </>
              ) : (
                <>
                  Solicitar diagnóstico
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </>
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
