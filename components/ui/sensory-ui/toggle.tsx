"use client";

import * as React from "react";
import {
  Toggle as BaseToggle,
  toggleVariants,
} from "@/components/ui/toggle";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

const DEFAULT_TOGGLE_SOUND = "interaction.toggle" as const;

function Toggle({
  sound,
  volume,
  onPressedChange,
  ...props
}: React.ComponentProps<typeof BaseToggle> & {
  /** Sound to play whenever the pressed state changes. Defaults to "interaction.toggle". Set to false to disable. */
  sound?: SoundRole | false;
  /** Per-component volume multiplier (0–1). Stacks with master volume. */
  volume?: number;
}) {
  const { playSound } = useSensoryUI();

  const handlePressedChange = React.useCallback(
    (pressed: boolean) => {
      if (sound !== false) void playSound(sound ?? DEFAULT_TOGGLE_SOUND, { volume });
      onPressedChange?.(pressed);
    },
    [sound, volume, playSound, onPressedChange]
  );

  return <BaseToggle onPressedChange={handlePressedChange} {...props} />;
}

export { Toggle, toggleVariants };
