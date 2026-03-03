"use client";

import * as React from "react";
import { Checkbox as BaseCheckbox } from "@/components/ui/checkbox";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

const DEFAULT_CHECKBOX_SOUND_ON = "interaction.toggleUp" as const;
const DEFAULT_CHECKBOX_SOUND_OFF = "interaction.toggleDown" as const;

function Checkbox({
  sound,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof BaseCheckbox> & {
  /** Sound to play when the checked state changes. Defaults to "interaction.toggleUp" / "interaction.toggleDown". Set to false to disable. */
  sound?: SoundRole | false;
}) {
  const { playSound } = useSensoryUI();

  const handleCheckedChange = React.useCallback(
    (checked: boolean | "indeterminate") => {
      if (sound !== false) {
        const role = sound ?? (checked === true ? DEFAULT_CHECKBOX_SOUND_ON : DEFAULT_CHECKBOX_SOUND_OFF);
        void playSound(role);
      }
      onCheckedChange?.(checked);
    },
    [sound, playSound, onCheckedChange]
  );

  return <BaseCheckbox onCheckedChange={handleCheckedChange} {...props} />;
}

export { Checkbox };
