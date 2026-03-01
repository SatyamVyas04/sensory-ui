"use client";

import * as React from "react";
import { Slider as BaseSlider } from "@/components/ui/slider";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

function Slider({
  sound,
  onValueCommit,
  ...props
}: React.ComponentProps<typeof BaseSlider> & {
  /**
   * Sound to play when the user commits a value (releases the thumb).
   * Fires once per drag, not on every tick.
   */
  sound?: SoundRole;
}) {
  const { playSound } = useSensoryUI();

  const handleValueCommit = React.useCallback(
    (values: number[]) => {
      if (sound) void playSound(sound);
      onValueCommit?.(values);
    },
    [sound, playSound, onValueCommit]
  );

  return <BaseSlider onValueCommit={handleValueCommit} {...props} />;
}

export { Slider };
