import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const alt = "PYMEmkt | Growth Systems — Menos improvisación. Más crecimiento.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  const logo = await readFile(join(process.cwd(), "public/brand/lockup-light.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const fontDir = join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans");
  const [semibold, regular] = await Promise.all([
    readFile(join(fontDir, "Geist-SemiBold.ttf")),
    readFile(join(fontDir, "Geist-Regular.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "radial-gradient(ellipse at 85% -10%, #1e3a8a 0%, #0B0F19 58%)",
          color: "white",
          fontFamily: "Geist",
        }}
      >
        <img src={logoSrc} width={330} height={78} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 66, fontWeight: 600, lineHeight: 1.05, letterSpacing: -2.5, maxWidth: 1000 }}>
            Tu empresa no necesita más acciones aisladas.
          </div>
          <div style={{ fontSize: 40, marginTop: 18, color: "#93C5FD", letterSpacing: -1 }}>
            Necesita un sistema que genere oportunidades.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "rgba(255,255,255,0.7)" }}>
          Menos improvisación. Más crecimiento.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: semibold, weight: 600, style: "normal" },
        { name: "Geist", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}
