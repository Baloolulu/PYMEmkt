import "server-only";

/** Verificación de Cloudflare Turnstile. Solo se exige si TURNSTILE_SECRET_KEY está configurada. */
export const turnstileEnabled = Boolean(process.env.TURNSTILE_SECRET_KEY);

export async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  if (!turnstileEnabled) return true;
  if (!token) return false;
  try {
    const form = new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY as string, response: token });
    if (ip && ip !== "unknown") form.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch {
    return false;
  }
}
