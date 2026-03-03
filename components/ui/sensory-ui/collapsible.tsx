"use client";

import * as React from "react";
import {
  Collapsible as BaseCollapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

const DEFAULT_COLLAPSIBLE_OPEN_SOUND = "overlay.expand" as const;
const DEFAULT_COLLAPSIBLE_CLOSE_SOUND = "overlay.collapse" as const;

function Collapsible({
  openSound,
  closeSound,
  volume,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof BaseCollapsible> & {
  /** Sound to play when the collapsible expands. Defaults to "overlay.expand". Set to false to disable. */
  openSound?: SoundRole | false;
  /** Sound to play when the collapsible collapses. Defaults to "overlay.collapse". Set to false to disable. */
  closeSound?: SoundRole | false;
  /** Per-component volume multiplier (0–1). Stacks with master volume. */
  volume?: number;
}) {
  const { playSound } = useSensoryUI();

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (open && openSound !== false) {
        void playSound(openSound ?? DEFAULT_COLLAPSIBLE_OPEN_SOUND, { volume });
      } else if (!open && closeSound !== false) {
        void playSound(closeSound ?? DEFAULT_COLLAPSIBLE_CLOSE_SOUND, { volume });
      }
      onOpenChange?.(open);
    },
    [openSound, closeSound, volume, playSound, onOpenChange]
  );

  return <BaseCollapsible onOpenChange={handleOpenChange} {...props} />;
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
