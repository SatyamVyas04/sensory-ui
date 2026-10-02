import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Brand fonts, read once at module scope per
// https://vercel.com/kb/guide/using-custom-font
const cardoRegular = await readFile(
  join(process.cwd(), "public/cardo-heading-font/Cardo-Regular.ttf")
);
const cardoItalic = await readFile(
  join(process.cwd(), "public/cardo-heading-font/Cardo-Italic.ttf")
);
const vietnamSemiBold = await readFile(
  join(
    process.cwd(),
    "public/be-vietnam-pro-body-font/BeVietnamPro-SemiBold.ttf"
  )
);
const vietnamRegular = await readFile(
  join(
    process.cwd(),
    "public/be-vietnam-pro-body-font/BeVietnamPro-Regular.ttf"
  )
);
// Brand mark for the OG wordmark.
const logoSvg = await readFile(
  join(process.cwd(), "public/sensory-ui-logo-small.svg"),
  "utf8"
);
const logoSrc = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString("base64")}`;
// Corner-blob background template (1200x630, center writable area 960x390).
const bgPng = await readFile(
  join(process.cwd(), "public/og-image-background.png")
);
const bgSrc = `data:image/png;base64,${bgPng.toString("base64")}`;

const SIZE = { width: 1200, height: 630 };

const SERIF = "Cardo";
const SANS = "Be Vietnam Pro";
const INK = "#17141c";
const MUTED = "#5c5666";
const FAINT = "#8a8496";
const RED = "#e84840";

function truncate(value: string | null, max: number, fallback: string) {
  const text = (value ?? "").trim() || fallback;
  if (text.length <= max) {
    return text;
  }
  // Cut at the last word boundary so cards never end mid-word.
  const cut = text.slice(0, max - 1).trimEnd();
  const boundary = cut.lastIndexOf(" ");
  return `${(boundary > max * 0.5 ? cut.slice(0, boundary) : cut).trimEnd()}…`;
}

/**
 * Dynamic OG images for the whole site, per
 * https://vercel.com/docs/og-image-generation/og-image-api
 *
 *   /api/og?mode=home
 *   /api/og?mode=docs&badge=Components&title=Button&description=...
 *
 * One 1200x630 PNG serves X/Twitter, WhatsApp, and LinkedIn (all three
 * accept this size; metadata declares width/height/alt for each crawler).
 * Layout honors the template's 960x390 center writable area: branding on
 * top, thin serif title in the middle, URL at the bottom.
 */
export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") === "docs" ? "docs" : "home";

  const badge = truncate(searchParams.get("badge"), 24, "Docs");
  const title = truncate(
    searchParams.get("title"),
    64,
    "Semantic sound for shadcn/ui"
  );
  const description = truncate(
    searchParams.get("description"),
    130,
    "A single prop adds meaningful audio feedback. Web Audio API powered, zero audio files."
  );

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#f4f4f5",
        color: INK,
        fontFamily: SANS,
      }}
    >
      {/* biome-ignore lint/performance/noImgElement: next/og ImageResponse requires <img>; next/image is unavailable here */}
      <img
        alt=""
        height={630}
        src={bgSrc}
        style={{ position: "absolute", left: 0, top: 0 }}
        width={1200}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          textAlign: "center",
          width: "100%",
          height: "100%",
          padding: "48px 120px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* biome-ignore lint/performance/noImgElement: next/og ImageResponse requires <img>; next/image is unavailable here */}
          <img
            alt="sensory-ui logo"
            height={52}
            src={logoSrc}
            style={{ borderRadius: 26 }}
            width={52}
          />
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: 0.5 }}>
            sensory-ui
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          {mode === "docs" ? (
            <div
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: RED,
                border: `2px solid ${RED}`,
                borderRadius: 999,
                padding: "6px 22px",
                letterSpacing: 2,
              }}
            >
              {badge}
            </div>
          ) : null}

          {mode === "docs" ? (
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 80,
                fontWeight: 400,
                lineHeight: 1.1,
                letterSpacing: 0,
                maxWidth: 960,
                textWrap: "balance",
              }}
            >
              {title}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontFamily: SERIF,
                fontSize: 84,
                fontWeight: 400,
                lineHeight: 1.12,
                letterSpacing: 0,
                maxWidth: 960,
              }}
            >
              <div>Your website speaks.</div>
              <div style={{ fontStyle: "italic", color: RED }}>
                Give it a voice.
              </div>
            </div>
          )}

          {mode === "docs" ? (
            <div
              style={{
                fontSize: 25,
                color: MUTED,
                lineHeight: 1.45,
                maxWidth: 880,
                textWrap: "balance",
              }}
            >
              {description}
            </div>
          ) : null}
        </div>

        <div style={{ fontSize: 24, color: FAINT, letterSpacing: 0.5 }}>
          sensory-ui.com
        </div>
      </div>
    </div>,
    {
      ...SIZE,
      fonts: [
        { name: SERIF, data: cardoRegular, weight: 400, style: "normal" },
        { name: SERIF, data: cardoItalic, weight: 400, style: "italic" },
        { name: SANS, data: vietnamSemiBold, weight: 600, style: "normal" },
        { name: SANS, data: vietnamRegular, weight: 400, style: "normal" },
      ],
    }
  );
}
