"use client";

import * as React from "react";
import {
  Dialog as BaseDialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

function Dialog({
  sound,
  closeSound,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof BaseDialog> & {
  /** Sound to play when the dialog opens. Defaults to "overlay.open". Set to false to disable. */
  sound?: SoundRole | false;
  /** Sound to play when the dialog closes. Defaults to "overlay.close". Set to false to disable. */
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

  return <BaseDialog onOpenChange={handleOpenChange} {...props} />;
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
