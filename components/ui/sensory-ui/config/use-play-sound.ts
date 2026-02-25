"use client";

import * as React from "react";

import { useSensoryUI } from "./provider";
import type { SoundRole } from "./sound-roles";

export interface UsePlaySoundOptions {
  /**
   * SoundRole (e.g. "activation.primary") or an absolute URL to a custom
   * audio file (e.g. "/sounds/custom/beep.mp3").
   */
  sound: SoundRole | (string & {});
  /**
   * Volume multiplier for this specific sound (0–1).
   * Stacks multiplicatively with the provider-level volume.
   */
  volume?: number;
}

export interface UsePlaySoundReturn {
  /** Imperatively trigger the sound. Safe to call during render — it is
   *  memoised and will no-op if the provider is disabled or muted. */
  play: () => void;
  /** Whether audio is currently enabled (provider not disabled, not muted,
   *  not suppressed by prefers-reduced-motion). */
  enabled: boolean;
}

/**
 * `usePlaySound` — low-level hook for imperative sound playback.
 *
 * Use this when you need to trigger a sound outside a sensory-ui component,
 * for example in a custom component or an event handler.
 *
 * @example
 * ```tsx
 * const { play } = usePlaySound({ sound: "notifications.success" });
 * // ...
 * <button onClick={play}>Save</button>
 * ```
 */
export function usePlaySound({
  sound,
  volume,
}: UsePlaySoundOptions): UsePlaySoundReturn {
  const { playSound, enabled } = useSensoryUI();

  const play = React.useCallback(() => {
    void playSound(sound as SoundRole, { volume });
  }, [playSound, sound, volume]);

  return { play, enabled };
}
