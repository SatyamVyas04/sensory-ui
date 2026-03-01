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
  /** Sound to play when the context menu opens. */
  sound?: SoundRole;
  /** Sound to play when the context menu closes. Defaults to "system.close". */
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

  return <BaseContextMenu onOpenChange={handleOpenChange} {...props} />;
}

function ContextMenuItem({
  sound,
  onSelect,
  ...props
}: React.ComponentProps<typeof BaseContextMenuItem> & {
  /** Sound to play when this item is selected. */
  sound?: SoundRole;
}) {
  const { playSound } = useSensoryUI();

  const handleSelect = React.useCallback(
    (e: Event) => {
      if (sound) void playSound(sound);
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
