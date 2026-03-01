"use client";

import * as React from "react";
import {
  Button as BaseButton,
  buttonVariants,
} from "@/components/ui/button";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

function Button({
  sound,
  onClick,
  onKeyDown,
  ...props
}: React.ComponentProps<typeof BaseButton> & {
  /** Semantic sound role to play on click/keydown. */
  sound?: SoundRole;
}) {
  const { playSound } = useSensoryUI();

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (sound) void playSound(sound);
      onClick?.(e);
    },
    [sound, playSound, onClick]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (sound && (e.key === "Enter" || e.key === " ")) {
        void playSound(sound);
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
