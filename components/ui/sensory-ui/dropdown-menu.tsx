"use client";

import * as React from "react";
import {
  DropdownMenu as BaseDropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem as BaseDropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

function DropdownMenu({
  sound,
  closeSound,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof BaseDropdownMenu> & {
  /** Sound to play when the dropdown opens. Defaults to "overlay.open". Set to false to disable. */
  sound?: SoundRole | false;
  /** Sound to play when the dropdown closes. Defaults to "overlay.close". Set to false to disable. */
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

  return <BaseDropdownMenu onOpenChange={handleOpenChange} {...props} />;
}

function DropdownMenuItem({
  sound,
  onSelect,
  ...props
}: React.ComponentProps<typeof BaseDropdownMenuItem> & {
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

  return <BaseDropdownMenuItem onSelect={handleSelect} {...props} />;
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
