// Pruebas de la evaluación interactiva y del mensaje de WhatsApp con el resultado.
import { test } from "node:test";
import assert from "node:assert/strict";
import { QUESTIONS, computeResult, resultRequestText, resultWhy } from "../lib/diagnostic.ts";

const answers = {
  origen: "no-claro",
  publicidad: "si-sin-retorno",
  respuesta: "manual",
  cotizaciones: "parcial",
  desafio: "no-se",
};

test("hay cinco preguntas y cada una tiene opciones", () => {
  assert.equal(QUESTIONS.length, 5);
  for (const q of QUESTIONS) assert.ok(q.options.length >= 3);
});

test("clasifica en una de las cuatro áreas", () => {
  const r = computeResult(answers);
  assert.equal(r.primary, "direccion");
  assert.ok(["atraccion", "conversion", "confianza", "direccion"].includes(r.primary));
});

test("explica por qué obtuvo el resultado", () => {
  const r = computeResult(answers);
  assert.equal(r.supportingAnswers, 4);
  assert.match(resultWhy(r), /4 de tus 5 respuestas suman señales hacia dirección/);
  assert.ok(r.reasons.length > 0 && r.reasons.length <= 3);
});

test("el mensaje de WhatsApp incluye el área y las cinco respuestas", () => {
  const r = computeResult(answers);
  const msg = resultRequestText(r);
  assert.match(msg, /Resultado preliminar: DIRECCIÓN/);
  const lines = msg.split("\n").filter((l) => l.startsWith("• "));
  assert.equal(lines.length, 5);
  assert.match(msg, /Cómo llegan tus clientes: No lo tengo claro/);
  assert.match(msg, /Principal desafío: No sé cuál es el problema/);
});

test("cada combinación de respuestas produce un área válida", () => {
  const ids = QUESTIONS.map((q) => q.options.map((o) => o.id));
  let n = 0;
  const walk = (i, acc) => {
    if (i === ids.length) {
      const r = computeResult(acc);
      assert.ok(r.primary);
      n++;
      return;
    }
    for (const id of ids[i]) walk(i + 1, { ...acc, [QUESTIONS[i].id]: id });
  };
  walk(0, {});
  assert.equal(n, 6 * 4 * 4 * 3 * 5);
});
