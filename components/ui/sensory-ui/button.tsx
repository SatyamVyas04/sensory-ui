"use client";

import * as React from "react";
import {
  Button as BaseButton,
  buttonVariants,
} from "@/components/ui/button";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

const DEFAULT_BUTTON_SOUND = "interaction.tap" as const;

function Button({
  sound,
  volume,
  onClick,
  ...props
}: React.ComponentProps<typeof BaseButton> & {
  /** Sound to play on click. Defaults to "interaction.tap". Set to false to disable. */
  sound?: SoundRole | false;
  /** Per-component volume multiplier (0–1). Stacks with master volume. */
  volume?: number;
}) {
  const { playSound } = useSensoryUI();

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (sound !== false)
        void playSound(sound ?? DEFAULT_BUTTON_SOUND, { volume });
      onClick?.(e);
    },
    [sound, volume, playSound, onClick]
  );

  return <BaseButton onClick={handleClick} {...props} />;
}

export { Button, buttonVariants };
