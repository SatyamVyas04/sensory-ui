"use client";

import * as React from "react";
import { Slider as BaseSlider } from "@/components/ui/slider";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

const DEFAULT_SLIDER_SOUND = "interaction.subtle" as const;

function Slider({
  sound,
  onValueChange,
  ...props
}: React.ComponentProps<typeof BaseSlider> & {
  /**
   * Sound to play on every value change as the user drags.
   * Defaults to "interaction.subtle". Set to false to disable.
   */
  sound?: SoundRole | false;
}) {
  const { playSound } = useSensoryUI();

  const handleValueChange = React.useCallback(
    (values: number[]) => {
      if (sound !== false) void playSound(sound ?? DEFAULT_SLIDER_SOUND);
      onValueChange?.(values);
    },
    [sound, playSound, onValueChange]
  );

  return <BaseSlider onValueChange={handleValueChange} {...props} />;
}

export { Slider };
