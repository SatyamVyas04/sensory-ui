"use client";

import * as React from "react";
import {
  Sheet as BaseSheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

function Sheet({
  sound,
  closeSound,
  volume,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof BaseSheet> & {
  /** Sound to play when the sheet opens. Defaults to "overlay.open". Set to false to disable. */
  sound?: SoundRole | false;
  /** Sound to play when the sheet closes. Defaults to "overlay.close". Set to false to disable. */
  closeSound?: SoundRole | false;
  /** Per-component volume multiplier (0–1). Stacks with master volume. */
  volume?: number;
}) {
  const { playSound } = useSensoryUI();

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (open && sound !== false) {
        void playSound(sound ?? "overlay.open", { volume });
      } else if (!open && closeSound !== false) {
        void playSound(closeSound ?? "overlay.close", { volume });
      }
      onOpenChange?.(open);
    },
    [sound, closeSound, volume, playSound, onOpenChange]
  );

  return <BaseSheet onOpenChange={handleOpenChange} {...props} />;
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
};
