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
  /** Sound to play when the dropdown opens. */
  sound?: SoundRole;
  /** Sound to play when the dropdown closes. Defaults to "system.close". */
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

  return <BaseDropdownMenu onOpenChange={handleOpenChange} {...props} />;
}

function DropdownMenuItem({
  sound,
  onSelect,
  ...props
}: React.ComponentProps<typeof BaseDropdownMenuItem> & {
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
