"use client";

import * as React from "react";
import {
  Button as BaseButton,
  buttonVariants,
} from "@/components/ui/button";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

const DEFAULT_BUTTON_SOUND = "interaction.tap" as const;
const DEFAULT_DISABLED_BUTTON_SOUND = "interaction.disabled" as const;

function Button({
  sound,
  disabledSound,
  onClick,
  onKeyDown,
  ...props
}: React.ComponentProps<typeof BaseButton> & {
  /** Sound to play on click/keydown. Defaults to "interaction.tap". Set to false to disable. */
  sound?: SoundRole | false;
  /** Sound to play when the button is clicked while disabled. Defaults to "interaction.disabled". Set to false to disable. */
  disabledSound?: SoundRole | false;
}) {
  const { playSound } = useSensoryUI();

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (props.disabled) {
        if (disabledSound !== false) void playSound(disabledSound ?? DEFAULT_DISABLED_BUTTON_SOUND);
      } else if (sound !== false) {
        void playSound(sound ?? DEFAULT_BUTTON_SOUND);
      }
      onClick?.(e);
    },
    [sound, disabledSound, playSound, onClick, props.disabled]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        if (props.disabled) {
          if (disabledSound !== false) void playSound(disabledSound ?? DEFAULT_DISABLED_BUTTON_SOUND);
        } else if (sound !== false) {
          void playSound(sound ?? DEFAULT_BUTTON_SOUND);
        }
      }
      onKeyDown?.(e);
    },
    [sound, disabledSound, playSound, onKeyDown, props.disabled]
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
