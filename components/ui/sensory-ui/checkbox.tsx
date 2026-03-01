"use client";

import * as React from "react";
import { Checkbox as BaseCheckbox } from "@/components/ui/checkbox";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

function Checkbox({
  sound,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof BaseCheckbox> & {
  /** Sound to play when the checked state changes. */
  sound?: SoundRole;
}) {
  const { playSound } = useSensoryUI();

  const handleCheckedChange = React.useCallback(
    (checked: boolean | "indeterminate") => {
      // Only play sound when checking (not when unchecking)
      if (sound && checked === true) void playSound(sound);
      onCheckedChange?.(checked);
    },
    [sound, playSound, onCheckedChange]
  );

  return <BaseCheckbox onCheckedChange={handleCheckedChange} {...props} />;
}

export { Checkbox };
