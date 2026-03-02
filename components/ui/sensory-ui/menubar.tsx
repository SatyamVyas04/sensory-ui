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

const DEFAULT_MENUBAR_TRIGGER_SOUND = "overlay.open" as const;
const DEFAULT_MENUBAR_ITEM_SOUND = "interaction.tap" as const;

function MenubarTrigger({
  sound,
  onClick,
  ...props
}: React.ComponentProps<typeof BaseMenubarTrigger> & {
  /** Sound to play when this menu trigger is clicked. Defaults to "overlay.open". Set to false to disable. */
  sound?: SoundRole | false;
}) {
  const { playSound } = useSensoryUI();

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (sound !== false) void playSound(sound ?? DEFAULT_MENUBAR_TRIGGER_SOUND);
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
  /** Sound to play when this item is selected. Defaults to "interaction.tap". Set to false to disable. */
  sound?: SoundRole | false;
}) {
  const { playSound } = useSensoryUI();

  const handleSelect = React.useCallback(
    (e: Event) => {
      if (sound !== false) void playSound(sound ?? DEFAULT_MENUBAR_ITEM_SOUND);
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
