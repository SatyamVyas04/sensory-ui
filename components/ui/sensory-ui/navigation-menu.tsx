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

function NavigationMenuTrigger({
  sound,
  onClick,
  ...props
}: React.ComponentProps<typeof BaseNavigationMenuTrigger> & {
  /** Sound to play when this trigger is clicked. */
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

  return <BaseNavigationMenuTrigger onClick={handleClick} {...props} />;
}

function NavigationMenuLink({
  sound,
  onClick,
  ...props
}: React.ComponentProps<typeof BaseNavigationMenuLink> & {
  /** Sound to play when this link is clicked. */
  sound?: SoundRole;
}) {
  const { playSound } = useSensoryUI();

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (sound) void playSound(sound);
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
