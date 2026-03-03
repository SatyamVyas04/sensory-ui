"use client";

import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger as BaseNavigationMenuTrigger,
  NavigationMenuLink as BaseNavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

const DEFAULT_NAV_TRIGGER_SOUND = "overlay.open" as const;
const DEFAULT_NAV_LINK_SOUND = "navigation.tab" as const;

function NavigationMenuTrigger({
  sound,
  onClick,
  ...props
}: React.ComponentProps<typeof BaseNavigationMenuTrigger> & {
  /** Sound to play when this trigger is clicked. Defaults to "overlay.open". Set to false to disable. */
  sound?: SoundRole | false;
}) {
  const { playSound } = useSensoryUI();

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (sound !== false) void playSound(sound ?? DEFAULT_NAV_TRIGGER_SOUND);
      onClick?.(e);
    },
    [sound, playSound, onClick]
  );

  return <BaseNavigationMenuTrigger onClick={handleClick} {...props} />;
}

function NavigationMenuLink({
  sound,
  onClick,
  ...props
}: React.ComponentProps<typeof BaseNavigationMenuLink> & {
  /** Sound to play when this link is clicked. Defaults to "navigation.tab". Set to false to disable. */
  sound?: SoundRole | false;
}) {
  const { playSound } = useSensoryUI();

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (sound !== false) void playSound(sound ?? DEFAULT_NAV_LINK_SOUND);
      onClick?.(e);
    },
    [sound, playSound, onClick]
  );

  return <BaseNavigationMenuLink onClick={handleClick} {...props} />;
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};
