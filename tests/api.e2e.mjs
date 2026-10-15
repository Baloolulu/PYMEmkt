// Pruebas de la API del formulario contra un servidor en ejecución.
//   BASE_URL=http://localhost:3000 npm run test:api
//   BASE_URL=https://<tu-proyecto>.vercel.app npm run test:api
// Por defecto NO envía solicitudes reales. Para comprobar la entrega real al correo:
//   SEND_REAL=1 BASE_URL=... npm run test:api   (llega un correo de prueba a LEAD_EMAIL_TO)
import { test } from "node:test";
import assert from "node:assert/strict";

const BASE = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const url = `${BASE}/api/lead`;
let ipSeq = 10;
const post = (body, { type = "application/json", raw = false, headers = {} } = {}) =>
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": type, "x-real-ip": `203.0.113.${ipSeq++}`, ...headers },
    body: raw ? body : JSON.stringify(body),
  });

const valid = {
  name: "Prueba Automática",
  company: "PYMEmkt QA",
  phone: "5512345678",
  email: "",
  challenge: "No sé cuál es el problema",
  preference: "WhatsApp",
  message: "Solicitud de prueba automática: ignorar.",
  consent: true,
  elapsedMs: 10000,
};

for (const [name, body] of [
  ["null", "null"],
  ["lista", "[1,2,3]"],
  ["texto", '"hola"'],
  ["número", "42"],
  ["JSON inválido", "{nombre:"],
  ["vacío", ""],
]) {
  test(`cuerpo ${name} → 400 controlado`, async () => {
    const r = await post(body, { raw: true });
    assert.equal(r.status, 400);
    const j = await r.json();
    assert.equal(j.ok, false);
    assert.ok(j.code);
  });
}

test("tipos incorrectos → 422 con campos señalados", async () => {
  const r = await post({ ...valid, name: 123, phone: ["55"], consent: "sí" });
  assert.equal(r.status, 422);
  const j = await r.json();
  assert.ok(j.errors.name && j.errors.phone && j.errors.consent);
});

test("campos faltantes → 422", async () => {
  const r = await post({ consent: true });
  assert.equal(r.status, 422);
});

test("Content-Type distinto de JSON → 415", async () => {
  const r = await post("name=a", { type: "application/x-www-form-urlencoded", raw: true });
  assert.equal(r.status, 415);
});

test("cuerpo mayor a 8 KB → 413", async () => {
  const r = await post({ ...valid, message: "x".repeat(9000) });
  assert.equal(r.status, 413);
});

test("honeypot lleno → rechazado, sin entrega", async () => {
  const r = await post({ ...valid, website: "spam.example" });
  assert.equal(r.status, 400);
  assert.notEqual((await r.json()).delivered, true);
});

test("envío demasiado rápido → rechazado", async () => {
  const r = await post({ ...valid, elapsedMs: 300 });
  assert.equal(r.status, 400);
  assert.equal((await r.json()).code, "too_fast");
});

test("origen ajeno → 403", async () => {
  const r = await post(valid, { headers: { Origin: "https://sitio-ajeno.example" } });
  assert.equal(r.status, 403);
});

test("GET → 405", async () => {
  const r = await fetch(url);
  assert.equal(r.status, 405);
});

test("solicitud válida: éxito solo con entrega confirmada", { skip: process.env.SEND_REAL !== "1" && "define SEND_REAL=1 para enviar un correo real de prueba" }, async () => {
  const r = await post(valid);
  const j = await r.json();
  if (r.status === 200) {
    assert.equal(j.ok, true);
    assert.equal(j.delivered, true);
  } else {
    // Sin canal o con fallo: nunca debe responder éxito.
    assert.ok([502, 503].includes(r.status), `estado inesperado ${r.status}`);
    assert.equal(j.ok, false);
    assert.notEqual(j.delivered, true);
  }
});
