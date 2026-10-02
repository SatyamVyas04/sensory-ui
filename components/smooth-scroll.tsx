"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import type { ReactNode } from "react";
import { useEffect } from "react";

/**
 * Minimal, tasteful smooth scroll. Defaults honor prefers-reduced-motion
 * (smoothing off, anchor jumps instant), matching the site's
 * accessibility-first stance. `anchors` keeps #showcase / #main-content
 * jumps smooth.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.1,
      anchors: true,
    });
    return () => lenis.destroy();
  }, []);

  return children;
}
