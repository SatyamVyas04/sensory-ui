import { ImageResponse } from "next/og";

export const runtime = "edge";

const SIZE = { width: 1200, height: 630 };

const FONT_STACK =
  "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
const SERIF_STACK = "ui-serif, Georgia, 'Times New Roman', serif";

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
 * Pure text + CSS shapes on purpose: no external font/image fetches, so this
 * never fails at the edge.
 *
 * TODO(images): swap the text wordmark for the brand logo
 * (`/sensory-ui-logo-large.png`) once final brand assets land.
 */
export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") === "docs" ? "docs" : "home";

  const badge = truncate(searchParams.get("badge"), 24, "Docs");
  const title = truncate(
    searchParams.get("title"),
    70,
    "Semantic sound for shadcn/ui"
  );
  const description = truncate(
    searchParams.get("description"),
    140,
    "Sound-enabled React components. A single prop adds meaningful audio feedback. Web Audio API powered, zero audio files."
  );

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        backgroundColor: "#0b0a10",
        color: "#f4f1ea",
        fontFamily: FONT_STACK,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: "#e84840",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 30,
            fontWeight: 800,
          }}
        >
          s
        </div>
        <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>
          sensory-ui
        </div>
        {mode === "docs" ? (
          <div
            style={{
              marginLeft: 12,
              fontSize: 22,
              fontWeight: 600,
              color: "#e84840",
              border: "2px solid #e84840",
              borderRadius: 999,
              padding: "6px 22px",
            }}
          >
            {badge}
          </div>
        ) : null}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            fontFamily: SERIF_STACK,
            fontSize: mode === "docs" ? 84 : 92,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          {mode === "docs" ? title : "Your website speaks."}
        </div>
        <div style={{ fontSize: 30, color: "#b9b3c4", lineHeight: 1.4 }}>
          {mode === "docs" ? description : "Give it a voice."}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 24,
          color: "#8a8496",
        }}
      >
        <div>sensory-ui.com</div>
        <div>17 sound roles · 9 packs · 24 components</div>
      </div>
    </div>,
    { ...SIZE }
  );
}
