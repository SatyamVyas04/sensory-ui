"use client";

import * as React from "react";
import {
  Toggle as BaseToggle,
  toggleVariants,
} from "@/components/ui/toggle";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

function Toggle({
  sound,
  onPressedChange,
  ...props
}: React.ComponentProps<typeof BaseToggle> & {
  /** Sound to play whenever the pressed state changes. */
  sound?: SoundRole;
}) {
  const { playSound } = useSensoryUI();

  const handlePressedChange = React.useCallback(
    (pressed: boolean) => {
      if (sound) void playSound(sound);
      onPressedChange?.(pressed);
    },
    [sound, playSound, onPressedChange]
  );

  return <BaseToggle onPressedChange={handlePressedChange} {...props} />;
}

export { Toggle, toggleVariants };
