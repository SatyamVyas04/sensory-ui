"use client";

import * as React from "react";
import {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger as BaseMenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem as BaseMenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from "@/components/ui/menubar";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

function MenubarTrigger({
  sound,
  onClick,
  ...props
}: React.ComponentProps<typeof BaseMenubarTrigger> & {
  /** Sound to play when this menu trigger is clicked. */
  sound?: SoundRole;
}) {
  const { playSound } = useSensoryUI();

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (sound) void playSound(sound);
      onClick?.(e);
    },
    [sound, playSound, onClick]
  );

  return <BaseMenubarTrigger onClick={handleClick} {...props} />;
}

function MenubarItem({
  sound,
  onSelect,
  ...props
}: React.ComponentProps<typeof BaseMenubarItem> & {
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

  return <BaseMenubarItem onSelect={handleSelect} {...props} />;
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
};
