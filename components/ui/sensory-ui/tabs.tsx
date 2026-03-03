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

const DEFAULT_TABS_SOUND = "navigation.tab" as const;

function Tabs({
  sound,
  volume,
  onValueChange,
  ...props
}: React.ComponentProps<typeof BaseTabs> & {
  /** Sound to play when the active tab changes. Defaults to "navigation.tab". Set to false to disable. */
  sound?: SoundRole | false;
  /** Per-component volume multiplier (0–1). Stacks with master volume. */
  volume?: number;
}) {
  const { playSound } = useSensoryUI();

  const handleValueChange = React.useCallback(
    (value: string) => {
      if (sound !== false) void playSound(sound ?? DEFAULT_TABS_SOUND, { volume });
      onValueChange?.(value);
    },
    [sound, volume, playSound, onValueChange]
  );

  return <BaseTabs onValueChange={handleValueChange} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
