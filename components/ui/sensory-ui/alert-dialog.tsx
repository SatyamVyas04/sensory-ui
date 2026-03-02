"use client";

import * as React from "react";
import {
  AlertDialog as BaseAlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

function AlertDialog({
  sound,
  closeSound,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof BaseAlertDialog> & {
  /** Sound to play when the alert dialog opens. Defaults to "overlay.open". Set to false to disable. */
  sound?: SoundRole | false;
  /** Sound to play when the alert dialog closes. Defaults to "overlay.close". Set to false to disable. */
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

  return <BaseAlertDialog onOpenChange={handleOpenChange} {...props} />;
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
