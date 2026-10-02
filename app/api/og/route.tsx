import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Brand fonts, read once at module scope per
// https://vercel.com/kb/guide/using-custom-font
const cardoBold = await readFile(
  join(process.cwd(), "public/cardo-heading-font/Cardo-Bold.ttf")
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

const SIZE = { width: 1200, height: 630 };

const SERIF = "Cardo";
const SANS = "Be Vietnam Pro";

function truncate(value: string | null, max: number, fallback: string) {
  const text = (value ?? "").trim() || fallback;
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
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
 * Theme matches the homepage: deep ink ground with a reddish glow.
 *
 * TODO(images): swap the "s" disc for the final brand mark once it lands.
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
        backgroundColor: "#0b0a10",
        color: "#f4f1ea",
        fontFamily: SANS,
      }}
    >
      {/* Reddish glow blobs (layered translucency, no blur needed) */}
      <div
        style={{
          position: "absolute",
          left: -220,
          top: -260,
          width: 720,
          height: 720,
          borderRadius: 360,
          backgroundColor: "#e84840",
          opacity: 0.16,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -80,
          top: -120,
          width: 440,
          height: 440,
          borderRadius: 220,
          backgroundColor: "#e84840",
          opacity: 0.16,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -200,
          bottom: -280,
          width: 640,
          height: 640,
          borderRadius: 320,
          backgroundColor: "#e84840",
          opacity: 0.1,
        }}
      />
      {/* Hairline frame */}
      <div
        style={{
          position: "absolute",
          left: 24,
          top: 24,
          width: 1152,
          height: 582,
          border: "1px solid rgba(232, 72, 64, 0.28)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "64px 84px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 29,
              backgroundColor: "#e84840",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: SERIF,
              fontSize: 34,
              fontWeight: 700,
              color: "#0b0a10",
            }}
          >
            s
          </div>
          <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: -0.5 }}>
            sensory-ui
          </div>
          {mode === "docs" ? (
            <div
              style={{
                marginLeft: 12,
                fontSize: 22,
                fontWeight: 600,
                color: "#f07067",
                border: "2px solid #e84840",
                borderRadius: 999,
                padding: "6px 22px",
                letterSpacing: 1,
              }}
            >
              {badge}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {mode === "docs" ? (
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 82,
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: -1,
              }}
            >
              {title}
            </div>
          ) : (
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 96,
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: -1,
              }}
            >
              Your website speaks.
            </div>
          )}
          {mode === "docs" ? (
            <div style={{ fontSize: 29, color: "#b9b3c4", lineHeight: 1.4 }}>
              {description}
            </div>
          ) : (
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 96,
                fontStyle: "italic",
                fontWeight: 400,
                lineHeight: 1.08,
                letterSpacing: -1,
                color: "#f07067",
              }}
            >
              Give it a voice.
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 23,
            color: "#8a8496",
            letterSpacing: 0.5,
          }}
        >
          <div>sensory-ui.com</div>
          <div>17 sound roles · 9 packs · 24 components</div>
        </div>
      </div>
    </div>,
    {
      ...SIZE,
      fonts: [
        { name: SERIF, data: cardoBold, weight: 700, style: "normal" },
        { name: SERIF, data: cardoItalic, weight: 400, style: "italic" },
        { name: SANS, data: vietnamSemiBold, weight: 600, style: "normal" },
        { name: SANS, data: vietnamRegular, weight: 400, style: "normal" },
      ],
    }
  );
}
