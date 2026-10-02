"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";

/**
 * Minimal, tasteful smooth scroll for marketing pages only.
 * Docs stay on native scroll: fumadocs has independent scroll regions
 * (sidebar, TOC, code blocks) that must scroll separately on hover.
 * Defaults honor prefers-reduced-motion (smoothing off, anchor jumps
 * instant), matching the site's accessibility-first stance.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const enabled = !pathname?.startsWith("/docs");

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.2,
      easing: (t) => (t === 1 ? 1 : 1 - 2 ** (-10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 2,
      anchors: true,
    });
    return () => lenis.destroy();
  }, [enabled]);

  return children;
}
