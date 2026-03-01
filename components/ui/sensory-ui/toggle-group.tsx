"use client";

import * as React from "react";
import {
  ToggleGroup as BaseToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

function ToggleGroup({
  sound,
  onValueChange,
  ...props
}: React.ComponentProps<typeof BaseToggleGroup> & {
  /** Sound to play when the selected value changes. */
  sound?: SoundRole;
}) {
  const { playSound } = useSensoryUI();

  const handleValueChange = React.useCallback(
    (value: string & string[]) => {
      if (sound) void playSound(sound);
      (onValueChange as ((v: string & string[]) => void) | undefined)?.(value);
    },
    [sound, playSound, onValueChange]
  );

  return <BaseToggleGroup onValueChange={handleValueChange} {...props} />;
}

export { ToggleGroup, ToggleGroupItem };
