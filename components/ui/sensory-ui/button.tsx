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
  onClick,
  onKeyDown,
  ...props
}: React.ComponentProps<typeof BaseButton> & {
  /** Sound to play on click/keydown. Defaults to "interaction.tap". Set to false to disable. */
  sound?: SoundRole | false;
}) {
  const { playSound } = useSensoryUI();

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (sound !== false) void playSound(sound ?? DEFAULT_BUTTON_SOUND);
      onClick?.(e);
    },
    [sound, playSound, onClick]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        if (sound !== false) void playSound(sound ?? DEFAULT_BUTTON_SOUND);
      }
      onKeyDown?.(e);
    },
    [sound, playSound, onKeyDown]
  );

  return (
    <BaseButton
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
}

export { Button, buttonVariants };
