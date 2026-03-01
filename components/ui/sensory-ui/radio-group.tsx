"use client";

import * as React from "react";
import {
  RadioGroup as BaseRadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

function RadioGroup({
  sound,
  onValueChange,
  ...props
}: React.ComponentProps<typeof BaseRadioGroup> & {
  /** Sound to play when the selected value changes. */
  sound?: SoundRole;
}) {
  const { playSound } = useSensoryUI();

  const handleValueChange = React.useCallback(
    (value: string) => {
      if (sound) void playSound(sound);
      onValueChange?.(value);
    },
    [sound, playSound, onValueChange]
  );

  return <BaseRadioGroup onValueChange={handleValueChange} {...props} />;
}

export { RadioGroup, RadioGroupItem };
