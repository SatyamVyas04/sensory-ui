"use client";

import * as React from "react";
import { Switch as BaseSwitch } from "@/components/ui/switch";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

const DEFAULT_SWITCH_SOUND = "interaction.toggle" as const;

function Switch({
  sound,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof BaseSwitch> & {
  /** Sound to play when the switch is toggled. Defaults to "interaction.toggle". Set to false to disable. */
  sound?: SoundRole | false;
}) {
  const { playSound } = useSensoryUI();

  const handleCheckedChange = React.useCallback(
    (checked: boolean) => {
      if (sound !== false) void playSound(sound ?? DEFAULT_SWITCH_SOUND);
      onCheckedChange?.(checked);
    },
    [sound, playSound, onCheckedChange]
  );

  return <BaseSwitch onCheckedChange={handleCheckedChange} {...props} />;
}

export { Switch };
