"use client";

import * as React from "react";
import {
  ToggleGroup as BaseToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

const DEFAULT_TOGGLE_GROUP_SOUND = "interaction.toggle" as const;

function ToggleGroup({
  sound,
  volume,
  onValueChange,
  ...props
}: React.ComponentProps<typeof BaseToggleGroup> & {
  /** Sound to play when the selected value changes. Defaults to "interaction.toggle". Set to false to disable. */
  sound?: SoundRole | false;
  /** Per-component volume multiplier (0–1). Stacks with master volume. */
  volume?: number;
}) {
  const { playSound } = useSensoryUI();

  const handleValueChange = React.useCallback(
    (value: string & string[]) => {
      if (sound !== false) void playSound(sound ?? DEFAULT_TOGGLE_GROUP_SOUND, { volume });
      (onValueChange as ((v: string & string[]) => void) | undefined)?.(value);
    },
    [sound, volume, playSound, onValueChange]
  );

  return <BaseToggleGroup onValueChange={handleValueChange} {...props} />;
}

export { ToggleGroup, ToggleGroupItem };
