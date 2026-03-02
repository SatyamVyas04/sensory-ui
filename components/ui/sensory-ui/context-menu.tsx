"use client";

import * as React from "react";
import {
  ContextMenu as BaseContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem as BaseContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
} from "@/components/ui/context-menu";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

function ContextMenu({
  sound,
  closeSound,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof BaseContextMenu> & {
  /** Sound to play when the context menu opens. Defaults to "overlay.open". Set to false to disable. */
  sound?: SoundRole | false;
  /** Sound to play when the context menu closes. Defaults to "overlay.close". Set to false to disable. */
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

  return <BaseContextMenu onOpenChange={handleOpenChange} {...props} />;
}

function ContextMenuItem({
  sound,
  onSelect,
  ...props
}: React.ComponentProps<typeof BaseContextMenuItem> & {
  /** Sound to play when this item is selected. Defaults to "interaction.tap". Set to false to disable. */
  sound?: SoundRole | false;
}) {
  const { playSound } = useSensoryUI();

  const handleSelect = React.useCallback(
    (e: Event) => {
      if (sound !== false) void playSound(sound ?? "interaction.tap");
      onSelect?.(e);
    },
    [sound, playSound, onSelect]
  );

  return <BaseContextMenuItem onSelect={handleSelect} {...props} />;
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
