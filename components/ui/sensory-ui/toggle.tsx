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
  onPressedChange,
  ...props
}: React.ComponentProps<typeof BaseToggle> & {
  /** Sound to play whenever the pressed state changes. Defaults to "interaction.toggle". Set to false to disable. */
  sound?: SoundRole | false;
}) {
  const { playSound } = useSensoryUI();

  const handlePressedChange = React.useCallback(
    (pressed: boolean) => {
      if (sound !== false) void playSound(sound ?? DEFAULT_TOGGLE_SOUND);
      onPressedChange?.(pressed);
    },
    [sound, playSound, onPressedChange]
  );

  return <BaseToggle onPressedChange={handlePressedChange} {...props} />;
}

export { Toggle, toggleVariants };
