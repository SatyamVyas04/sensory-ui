"use client";

import * as React from "react";
import {
  Select as BaseSelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

function Select({
  sound,
  closeSound,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof BaseSelect> & {
  /** Sound to play when the select dropdown opens. Defaults to "overlay.open". Set to false to disable. */
  sound?: SoundRole | false;
  /** Sound to play when the select dropdown closes. Defaults to "overlay.close". Set to false to disable. */
  closeSound?: SoundRole | false;
}) {
  const { playSound } = useSensoryUI();

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (open && sound !== false) {
        void playSound(sound ?? "overlay.open");
      } else if (!open && closeSound !== false) {
        void playSound(closeSound ?? "overlay.close");
      }
      onOpenChange?.(open);
    },
    [sound, closeSound, playSound, onOpenChange]
  );

  return <BaseSelect onOpenChange={handleOpenChange} {...props} />;
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
