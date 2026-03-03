"use client";

import * as React from "react";
import {
  Toggle as BaseToggle,
  toggleVariants,
} from "@/components/ui/toggle";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

const DEFAULT_TOGGLE_SOUND_ON = "interaction.toggleUp" as const;
const DEFAULT_TOGGLE_SOUND_OFF = "interaction.toggleDown" as const;

function Toggle({
  sound,
  onPressedChange,
  ...props
}: React.ComponentProps<typeof BaseToggle> & {
  /** Sound to play whenever the pressed state changes. Defaults to "interaction.toggleUp" / "interaction.toggleDown". Set to false to disable. */
  sound?: SoundRole | false;
}) {
  const { playSound } = useSensoryUI();

  const handlePressedChange = React.useCallback(
    (pressed: boolean) => {
      if (sound !== false) {
        const role = sound ?? (pressed ? DEFAULT_TOGGLE_SOUND_ON : DEFAULT_TOGGLE_SOUND_OFF);
        void playSound(role);
      }
      onPressedChange?.(pressed);
    },
    [sound, playSound, onPressedChange]
  );

  return <BaseToggle onPressedChange={handlePressedChange} {...props} />;
}

export { Toggle, toggleVariants };
