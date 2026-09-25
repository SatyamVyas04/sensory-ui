"use client";

import { type ComponentProps, useEffect, useState } from "react";
import DitherVeil from "@/components/reactbits/dither-veil";

/**
 * Resolves to true once the given src has been decoded (or failed), so we
 * never mount a Veil while its image is still on the wire. That first
 * pre-image frame is what causes the solid-color flash on load.
 */
function useImageLoaded(src?: string) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!src) {
      return;
    }
    let active = true;
    const img = new Image();
    img.decoding = "async";
    const done = () => {
      if (active) {
        setReady(true);
      }
    };
    img.onload = done;
    img.onerror = done;
    img.src = src;
    return () => {
      active = false;
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return ready;
}

/**
 * Renders a DitherVeil only once its image is loaded, and fades it in from
 * opacity 0 -> 1 so the dithered reveal never pops onto the page.
 */
function FadeInVeil({
  src,
  className = "",
  ...props
}: ComponentProps<typeof DitherVeil>) {
  const ready = useImageLoaded(src);

  return (
    <div
      className={`relative h-full w-full ${className}`.trim()}
      style={{
        opacity: ready ? 1 : 0,
        transition: ready ? "opacity 1200ms ease-out" : "none",
      }}
    >
      {ready && <DitherVeil src={src} {...props} />}
    </div>
  );
}

const veilProps = {
  clickBurst: true,
  contrast: 1,
  fit: "cover",
  inkColor: "#120f17", // overridden per veil below with --background
  levels: 2,
  linger: 1.1,
  paperColor: "#f4f1ea",
  pattern: "lines",
  pixelSize: 2,
  revealRadius: 180,
  rimColor: "#e84840",
  softness: 0.5,
  wander: true,
} as const;

const FADE_STOPS = [
  [1, 0],
  [0.738, 19],
  [0.541, 34],
  [0.382, 47],
  [0.278, 56.5],
  [0.194, 65],
  [0.126, 73],
  [0.075, 80.2],
  [0.042, 86.1],
  [0.021, 91],
  [0.008, 95.2],
  [0.002, 98.2],
  [0, 100],
] as const;

const fade = (direction: string) =>
  `linear-gradient(${direction}, ${FADE_STOPS.map(
    ([alpha, pos]) =>
      `color-mix(in oklch, var(--background) ${(alpha * 100).toFixed(1)}%, transparent) ${pos}%`
  ).join(", ")})`;

/**
 * Resolves a CSS variable (oklch, hsl, whatever) to a hex string.
 * Re-resolves when the theme class on <html> changes.
 */
function useThemeColor(cssVar: string) {
  const [color, setColor] = useState<string | null>(null);

  useEffect(() => {
    const ctx = document
      .createElement("canvas")
      .getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      return;
    }

    const resolve = () => {
      const probe = document.createElement("span");
      probe.style.color = `var(${cssVar})`;
      document.body.appendChild(probe);
      const computed = getComputedStyle(probe).color;
      probe.remove();

      // Canvas converts any CSS color to sRGB for us
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = computed;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      setColor(
        `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`
      );
    };

    resolve();
    const observer = new MutationObserver(resolve);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "style"],
    });
    return () => observer.disconnect();
  }, [cssVar]);

  return color;
}

/**
 * Tracks whether the veil images have finished loading (with a timeout
 * fallback), so a theme-colored cover can fade away to reveal them instead
 * of flashing half-loaded pixels on first paint.
 */
function useRevealReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    let loaded = 0;
    const done = () => {
      loaded += 1;
      if (loaded >= 2 && active) {
        setReady(true);
      }
    };
    for (const src of [
      "/hero-background-light.webp",
      "/hero-background-dark.webp",
    ]) {
      const img = new Image();
      img.decoding = "async";
      img.onload = done;
      img.onerror = done;
      img.src = src;
    }
    const fallback = window.setTimeout(() => {
      if (active) {
        setReady(true);
      }
    }, 2500);
    return () => {
      active = false;
      window.clearTimeout(fallback);
    };
  }, []);

  return ready;
}

const grain = (tone: 0 | 1, opacity: number) => {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>` +
    `<filter id='n' x='0' y='0' width='100%' height='100%' color-interpolation-filters='sRGB'>` +
    `<feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>` +
    `<feColorMatrix type='matrix' values='0 0 0 0 ${tone} 0 0 0 0 ${tone} 0 0 0 0 ${tone} 4 0 0 0 -1.8'/>` +
    "</filter>" +
    `<rect width='100%' height='100%' filter='url(#n)' opacity='${opacity}'/>` +
    "</svg>";
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

const GRAIN_DARK = grain(1, 0.045);
const GRAIN_LIGHT = grain(0, 0.05);

// Grain fades out toward the bottom so it doesn't leave a seam
const GRAIN_MASK = "linear-gradient(to bottom, #000 55%, transparent 100%)";

function Grain() {
  const base = "pointer-events-none absolute inset-0 select-none";
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ maskImage: GRAIN_MASK, WebkitMaskImage: GRAIN_MASK }}
    >
      <div
        className={`${base} dark:hidden`}
        style={{ backgroundImage: GRAIN_LIGHT, backgroundSize: "200px 200px" }}
      />
      <div
        className={`${base} hidden dark:block`}
        style={{ backgroundImage: GRAIN_DARK, backgroundSize: "200px 200px" }}
      />
    </div>
  );
}

export function HeroBackground() {
  const bg = useThemeColor("--background");
  const revealed = useRevealReady();

  return (
    <>
      {/* Desktop dither veil + overlays, hidden below lg */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden w-full select-none lg:block"
      >
        {bg && (
          <>
            {/* Light theme: assumes paper is the ground color. Swap to
                inkColor={bg} if the light image renders the other way round */}
            <FadeInVeil
              key={`light-${bg}`}
              {...veilProps}
              className="dark:hidden"
              paperColor={bg}
              src="/hero-background-light.webp"
            />
            {/* Dark theme: ink is the ground color */}
            <FadeInVeil
              key={`dark-${bg}`}
              {...veilProps}
              className="hidden dark:block"
              inkColor={bg}
              src="/hero-background-dark.webp"
            />
          </>
        )}

        {/* Theme-colored cover: hides half-loaded pixels, then fades away */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-background transition-opacity duration-1000 ease-out"
          style={{ opacity: revealed ? 0 : 1 }}
        />

        {/* Left fade to blend with content */}
        <div
          className="absolute inset-0"
          style={{ background: fade("to right") }}
        />

        {/* Bottom fade into the next section */}
        <div
          className="absolute inset-x-0 bottom-0 h-56"
          style={{ background: fade("to top") }}
        />
      </div>

      {/* Mobile accent, shown below lg only */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 lg:hidden"
        style={{
          background:
            "radial-gradient(ellipse 100% 55% at 50% -10%, color-mix(in oklch, var(--primary) 10%, transparent), transparent)",
        }}
      />

      {/* Dither grain, topmost layer, all breakpoints */}
      <Grain />
    </>
  );
}
