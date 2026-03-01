"use client";

import * as React from "react";
import { Switch as BaseSwitch } from "@/components/ui/switch";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

function Switch({
  sound,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof BaseSwitch> & {
  /** Sound to play when the switch is toggled. */
  sound?: SoundRole;
}) {
  const { playSound } = useSensoryUI();

  const handleCheckedChange = React.useCallback(
    (checked: boolean) => {
      if (sound) void playSound(sound);
      onCheckedChange?.(checked);
    },
    [sound, playSound, onCheckedChange]
  );

  return <BaseSwitch onCheckedChange={handleCheckedChange} {...props} />;
}

export { Switch };
