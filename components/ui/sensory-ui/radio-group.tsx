"use client";

import * as React from "react";
import {
  RadioGroup as BaseRadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

const DEFAULT_RADIO_SOUND = "interaction.toggleUp" as const;

function RadioGroup({
  sound,
  onValueChange,
  ...props
}: React.ComponentProps<typeof BaseRadioGroup> & {
  /** Sound to play when the selected value changes. Defaults to "interaction.toggleUp". Set to false to disable. */
  sound?: SoundRole | false;
}) {
  const { playSound } = useSensoryUI();

  const handleValueChange = React.useCallback(
    (value: string) => {
      if (sound !== false) void playSound(sound ?? DEFAULT_RADIO_SOUND);
      onValueChange?.(value);
    },
    [sound, playSound, onValueChange]
  );

  return <BaseRadioGroup onValueChange={handleValueChange} {...props} />;
}

export { RadioGroup, RadioGroupItem };
