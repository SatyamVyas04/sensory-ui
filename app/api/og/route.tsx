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
// Brand mark for the OG wordmark.
const logoSvg = await readFile(
  join(process.cwd(), "public/sensory-ui-logo-small.svg"),
  "utf8"
);
const logoSrc = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString("base64")}`;

const gridSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='630'><defs><pattern id='g' width='72' height='72' patternUnits='userSpaceOnUse'><path d='M72 0H0V72' fill='none' stroke='rgb(255,255,255)' stroke-opacity='0.055' stroke-width='1'/></pattern></defs><rect width='1200' height='630' fill='url(#g)'/></svg>`;
const gridSrc = `data:image/svg+xml;base64,${Buffer.from(gridSvg).toString("base64")}`;

const SIZE = { width: 1200, height: 630 };

const SERIF = "Cardo";
const SANS = "Be Vietnam Pro";
const INK = "#08070b";
const RED = "#e84840";
const RED_SOFT = "#f07067";
const PAPER = "#f4f1ea";
const MUTED = "#a09aa9";
const FAINT = "#6f6a7a";

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
 * Design: dark stage, faint grid, red glow beams, centered serif headline.
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
        backgroundColor: INK,
        color: PAPER,
        fontFamily: SANS,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Faint grid */}
      {/* biome-ignore lint/performance/noImgElement: next/og ImageResponse requires <img>; next/image is unavailable here */}
      <img
        alt=""
        height={630}
        src={gridSrc}
        style={{ position: "absolute", left: 0, top: 0 }}
        width={1200}
      />
      {/* Diagonal red glow beams */}
      <div
        style={{
          position: "absolute",
          left: -40,
          top: -320,
          width: 250,
          height: 1250,
          transform: "rotate(18deg)",
          backgroundImage: `linear-gradient(180deg, transparent, ${RED} 42%, ${RED} 58%, transparent)`,
          opacity: 0.42,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -30,
          top: -320,
          width: 190,
          height: 1250,
          transform: "rotate(-16deg)",
          backgroundImage: `linear-gradient(180deg, transparent, ${RED} 42%, ${RED} 58%, transparent)`,
          opacity: 0.36,
        }}
      />
      {/* Warm wash, bottom-left */}
      <div
        style={{
          position: "absolute",
          left: -260,
          bottom: -320,
          width: 640,
          height: 640,
          borderRadius: 320,
          backgroundColor: RED,
          opacity: 0.22,
        }}
      />
      {/* Edge fades to keep text readable */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 320,
          height: 630,
          backgroundImage: `linear-gradient(90deg, ${INK}, transparent)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: 320,
          height: 630,
          backgroundImage: `linear-gradient(270deg, ${INK}, transparent)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: 1200,
          height: 220,
          backgroundImage: `linear-gradient(0deg, ${INK}, transparent)`,
        }}
      />

      {/* Centered content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 26,
          padding: "0 90px",
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

        {mode === "docs" ? (
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: RED_SOFT,
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
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -1,
              textAlign: "center",
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
              fontSize: 92,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -1,
              textAlign: "center",
            }}
          >
            <div>Your website speaks.</div>
            <div
              style={{
                fontStyle: "italic",
                fontWeight: 400,
                color: RED_SOFT,
              }}
            >
              Give it a voice.
            </div>
          </div>
        )}

        {mode === "docs" ? (
          <div
            style={{
              fontSize: 26,
              color: MUTED,
              lineHeight: 1.45,
              maxWidth: 880,
              textAlign: "center",
            }}
          >
            {description}
          </div>
        ) : null}

        <div style={{ fontSize: 26, color: FAINT, letterSpacing: 0.5 }}>
          sensory-ui.com
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
