"use client";

import * as React from "react";
import { Checkbox as BaseCheckbox } from "@/components/ui/checkbox";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

const DEFAULT_CHECKBOX_SOUND = "interaction.toggle" as const;

function Checkbox({
  sound,
  volume,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof BaseCheckbox> & {
  /** Sound to play when the checked state changes. Defaults to "interaction.toggle". Set to false to disable. */
  sound?: SoundRole | false;
  /** Per-component volume multiplier (0–1). Stacks with master volume. */
  volume?: number;
}) {
  const { playSound } = useSensoryUI();

  const handleCheckedChange = React.useCallback(
    (checked: boolean | "indeterminate") => {
      if (sound !== false && checked !== "indeterminate") {
        void playSound(sound ?? DEFAULT_CHECKBOX_SOUND, { volume });
      }
      onCheckedChange?.(checked);
    },
    [sound, volume, playSound, onCheckedChange]
  );

  return <BaseCheckbox onCheckedChange={handleCheckedChange} {...props} />;
}

export { Checkbox };
