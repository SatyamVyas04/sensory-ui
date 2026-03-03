"use client";

import * as React from "react";
import {
  Drawer as BaseDrawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

function Drawer({
  sound,
  closeSound,
  volume,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof BaseDrawer> & {
  /** Sound to play when the drawer opens. Defaults to "overlay.open". Set to false to disable. */
  sound?: SoundRole | false;
  /** Sound to play when the drawer closes. Defaults to "overlay.close". Set to false to disable. */
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

  return <BaseDrawer onOpenChange={handleOpenChange} {...props} />;
}

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
};
