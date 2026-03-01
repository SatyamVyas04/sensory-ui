"use client";

import * as React from "react";
import {
  Tabs as BaseTabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  tabsListVariants,
} from "@/components/ui/tabs";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

function Tabs({
  sound,
  onValueChange,
  ...props
}: React.ComponentProps<typeof BaseTabs> & {
  /** Sound to play when the active tab changes. */
  sound?: SoundRole;
}) {
  const { playSound } = useSensoryUI();

  const handleValueChange = React.useCallback(
    (value: string) => {
      if (sound) void playSound(sound);
      onValueChange?.(value);
    },
    [sound, playSound, onValueChange]
  );

  return <BaseTabs onValueChange={handleValueChange} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
