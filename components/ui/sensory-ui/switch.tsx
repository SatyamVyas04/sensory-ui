"use client";

import * as React from "react";
import { Switch as BaseSwitch } from "@/components/ui/switch";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

const DEFAULT_SWITCH_SOUND_ON = "interaction.toggleUp" as const;
const DEFAULT_SWITCH_SOUND_OFF = "interaction.toggleDown" as const;

function Switch({
  sound,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof BaseSwitch> & {
  /** Sound to play when the switch is toggled. Defaults to "interaction.toggleUp" / "interaction.toggleDown". Set to false to disable. */
  sound?: SoundRole | false;
}) {
  const { playSound } = useSensoryUI();

  const handleCheckedChange = React.useCallback(
    (checked: boolean) => {
      if (sound !== false) {
        const role = sound ?? (checked ? DEFAULT_SWITCH_SOUND_ON : DEFAULT_SWITCH_SOUND_OFF);
        void playSound(role);
      }
      onCheckedChange?.(checked);
    },
    [sound, playSound, onCheckedChange]
  );

  return <BaseSwitch onCheckedChange={handleCheckedChange} {...props} />;
}

export { Switch };
