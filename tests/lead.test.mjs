// Pruebas de la validación compartida del formulario (cliente y servidor).
// Ejecuta: npm test  (Node 24 ejecuta TypeScript sin compilar).
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateLead, leadSummary, normalizePhone } from "../lib/lead.ts";

const valid = {
  name: "Ana Ruiz",
  company: "Taller Ruiz",
  phone: "+52 55 1234 5678",
  email: "",
  challenge: "No sé cuál es el problema",
  preference: "Llamada",
  message: "",
  consent: true,
};

test("acepta una solicitud completa", () => {
  assert.deepEqual(validateLead(valid), {});
});

test("exige nombre, empresa, teléfono, situación y autorización", () => {
  const e = validateLead({ ...valid, name: "", company: " ", phone: "", challenge: "", consent: false });
  assert.deepEqual(Object.keys(e).sort(), ["challenge", "company", "consent", "name", "phone"]);
});

test("teléfono: 10 dígitos con o sin +52", () => {
  assert.equal(validateLead({ ...valid, phone: "5512345678" }).phone, undefined);
  assert.equal(validateLead({ ...valid, phone: "+52 (55) 1234-5678" }).phone, undefined);
  assert.ok(validateLead({ ...valid, phone: "12345" }).phone);
  assert.ok(validateLead({ ...valid, phone: "55123456789012" }).phone);
});

test("correo opcional, pero con formato válido si se escribe", () => {
  assert.equal(validateLead({ ...valid, email: "ana@empresa.mx" }).email, undefined);
  assert.ok(validateLead({ ...valid, email: "ana@" }).email);
});

test("rechaza opciones que no existen en el formulario", () => {
  assert.ok(validateLead({ ...valid, challenge: "Otra cosa" }).challenge);
  assert.ok(validateLead({ ...valid, preference: "Fax" }).preference);
});

test("limita comentarios largos o con muchos enlaces", () => {
  assert.ok(validateLead({ ...valid, message: "a".repeat(601) }).message);
  assert.ok(validateLead({ ...valid, message: "https://a.com https://b.com https://c.com" }).message);
});

test("el resumen para WhatsApp incluye los datos y la preferencia", () => {
  const s = leadSummary({ ...valid, diagnosticArea: "Conversión" });
  assert.match(s, /Ana Ruiz/);
  assert.match(s, /Taller Ruiz/);
  assert.match(s, /Resultado de la evaluación: Conversión/);
  assert.match(s, /Prefiero que me contacten por: Llamada/);
  assert.match(s, /Teléfono: \+52 55 1234 5678/);
  assert.equal(normalizePhone("+52 (55) 1234-5678"), "+525512345678");
});
