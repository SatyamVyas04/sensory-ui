"use client";

import posthog from "posthog-js";
import { useEffect } from "react";

declare global {
  interface Window {
    __POSTHOG_INITIALIZED__?: boolean;
  }
}

export function initPosthog() {
  if (typeof window === "undefined") {
    return;
  }
  if (window.__POSTHOG_INITIALIZED__) {
    return;
  }

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) {
    return;
  }

  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_API_HOST,
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_UI_HOST,
    defaults: "2026-01-30",
  });

  window.__POSTHOG_INITIALIZED__ = true;
}

export function PosthogInit() {
  useEffect(() => {
    initPosthog();
  }, []);

  return null;
}
