"use client";

import * as React from "react";
import {
  Popover as BasePopover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

function Popover({
  sound,
  closeSound,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof BasePopover> & {
  /** Sound to play when the popover opens. */
  sound?: SoundRole;
  /** Sound to play when the popover closes. Defaults to "system.close". */
  closeSound?: SoundRole;
}) {
  const { playSound } = useSensoryUI();

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (open && sound) {
        void playSound(sound);
      } else if (!open && (closeSound ?? sound)) {
        void playSound(closeSound ?? "system.close");
      }
      onOpenChange?.(open);
    },
    [sound, closeSound, playSound, onOpenChange]
  );

  return <BasePopover onOpenChange={handleOpenChange} {...props} />;
}

export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
};
