"use client";

import * as React from "react";
import {
  RadioGroup as BaseRadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

const DEFAULT_RADIO_SOUND = "interaction.toggle" as const;

function RadioGroup({
  sound,
  volume,
  onValueChange,
  ...props
}: React.ComponentProps<typeof BaseRadioGroup> & {
  /** Sound to play when the selected value changes. Defaults to "interaction.toggle". Set to false to disable. */
  sound?: SoundRole | false;
  /** Per-component volume multiplier (0–1). Stacks with master volume. */
  volume?: number;
}) {
  const { playSound } = useSensoryUI();

  const handleValueChange = React.useCallback(
    (value: string) => {
      if (sound !== false) void playSound(sound ?? DEFAULT_RADIO_SOUND, { volume });
      onValueChange?.(value);
    },
    [sound, volume, playSound, onValueChange]
  );

  return <BaseRadioGroup onValueChange={handleValueChange} {...props} />;
}

export { RadioGroup, RadioGroupItem };
