"use client";

import * as React from "react";
import {
  closeAudioContext,
  playSound as enginePlaySound,
  type PlaySoundOptions,
  type SoundPlayback,
} from "./engine";
import {
  defaultConfig,
  mergeConfig,
  resolveRole,
  type SensoryUIConfig,
} from "./config";
import type { SoundRole } from "./sound-roles";

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------

export interface SensoryUIContextValue {
  /**
   * Play a sound by its semantic role.
   * Returns a SoundPlayback handle or null if suppressed.
   */
  playSound: (
    role: SoundRole,
    options?: PlaySoundOptions
  ) => Promise<SoundPlayback | null>;
  /** Whether the sound system is globally active. */
  enabled: boolean;
  /** Current master volume (0–1). */
  volume: number;
  /** Whether the user has manually muted all sounds. */
  muted: boolean;
  /** Toggle the mute state programmatically. */
  setMuted: (muted: boolean) => void;
}

const SensoryUIContext = React.createContext<SensoryUIContextValue | null>(
  null
);

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useSensoryUI(): SensoryUIContextValue {
  const ctx = React.useContext(SensoryUIContext);
  if (!ctx) {
    throw new Error(
      "[sensory-ui] useSensoryUI must be called inside <SensoryUIProvider>"
    );
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Reduced-motion hook
// ---------------------------------------------------------------------------

function useReducedMotion(
  pref: SensoryUIConfig["reducedMotion"]
): boolean {
  const [matches, setMatches] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (pref === "force-off") return true;
  if (pref === "force-on") return false;
  return matches;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface SensoryUIProviderProps {
  children: React.ReactNode;
  /**
   * Optional config overrides merged on top of the defaults in config.ts.
   * Useful for Storybook, tests, or dynamic settings.
   *
   * @example
   * // Disable all sounds in tests
   * <SensoryUIProvider config={{ enabled: false }}>
   */
  config?: Partial<SensoryUIConfig>;
}

export function SensoryUIProvider({
  children,
  config: configOverride,
}: SensoryUIProviderProps) {
  const config = React.useMemo(
    () => mergeConfig(configOverride ?? {}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(configOverride)]
  );

  const [muted, setMuted] = React.useState(false);
  const reducedMotion = useReducedMotion(config.reducedMotion);
  const shouldPlay = config.enabled && !muted && !reducedMotion;

  const playSound = React.useCallback(
    async (
      role: SoundRole,
      options: PlaySoundOptions = {}
    ): Promise<SoundPlayback | null> => {
      if (typeof window === "undefined") return null;
      if (!shouldPlay) return null;

      const source = resolveRole(role, config);
      if (!source) return null;

      const finalVolume = (options.volume ?? 1) * config.volume;

      try {
        return await enginePlaySound(source, { ...options, volume: finalVolume });
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[sensory-ui] Failed to play sound:", role, err);
        }
        return null;
      }
    },
    [shouldPlay, config]
  );

  // Clean up the AudioContext on unmount in development to avoid stale state
  // across HMR reloads.
  React.useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    return () => {
      void closeAudioContext();
    };
  }, []);

  const value = React.useMemo(
    () => ({
      playSound,
      enabled: shouldPlay,
      volume: config.volume,
      muted,
      setMuted,
    }),
    [playSound, shouldPlay, config.volume, muted]
  );

  return (
    <SensoryUIContext.Provider value={value}>
      {children}
    </SensoryUIContext.Provider>
  );
}
