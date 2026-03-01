"use client";

import * as React from "react";
import {
  Collapsible as BaseCollapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

function Collapsible({
  openSound,
  closeSound,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof BaseCollapsible> & {
  /** Sound to play when the collapsible expands. */
  openSound?: SoundRole;
  /** Sound to play when the collapsible collapses. */
  closeSound?: SoundRole;
}) {
  const { playSound } = useSensoryUI();

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (open && openSound) {
        void playSound(openSound);
      } else if (!open && (closeSound ?? openSound)) {
        void playSound(closeSound ?? "system.collapse");
      }
      onOpenChange?.(open);
    },
    [openSound, closeSound, playSound, onOpenChange]
  );

  return <BaseCollapsible onOpenChange={handleOpenChange} {...props} />;
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
