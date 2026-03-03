"use client";

import * as React from "react";
import {
  Accordion as BaseAccordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

const DEFAULT_ACCORDION_EXPAND_SOUND = "overlay.expand" as const;
const DEFAULT_ACCORDION_COLLAPSE_SOUND = "overlay.collapse" as const;

function Accordion({
  expandSound,
  collapseSound,
  volume,
  onValueChange,
  ...props
}: React.ComponentProps<typeof BaseAccordion> & {
  /**
   * Sound to play when an accordion item expands.
   * Defaults to "overlay.expand". Set to false to disable.
   */
  expandSound?: SoundRole | false;
  /**
   * Sound to play when an accordion item collapses.
   * Defaults to "overlay.collapse". Set to false to disable.
   */
  collapseSound?: SoundRole | false;
  /** Per-component volume multiplier (0–1). Stacks with master volume. */
  volume?: number;
}) {
  const { playSound } = useSensoryUI();
  const prevValueRef = React.useRef<string | string[] | undefined>(undefined);

  // Unified handler that works for both type="single" and type="multiple"
  const handleValueChange = React.useCallback(
    (value: string & string[]) => {
      const prev = prevValueRef.current;

      if (expandSound !== false || collapseSound !== false) {
        const isExpanding = (() => {
          if (Array.isArray(value)) {
            // type="multiple"
            const prevLen = Array.isArray(prev) ? prev.length : 0;
            return value.length > prevLen;
          }
          // type="single": non-empty string = opening, empty string = closing
          return value !== "";
        })();

        if (isExpanding && expandSound !== false) {
          void playSound(expandSound ?? DEFAULT_ACCORDION_EXPAND_SOUND, { volume });
        } else if (!isExpanding && collapseSound !== false) {
          void playSound(collapseSound ?? DEFAULT_ACCORDION_COLLAPSE_SOUND, { volume });
        }
      }

      prevValueRef.current = value;
      // Cast needed because Radix overloads onValueChange per type
      (onValueChange as ((v: string & string[]) => void) | undefined)?.(value);
    },
    [expandSound, collapseSound, volume, playSound, onValueChange]
  );

  return <BaseAccordion onValueChange={handleValueChange} {...props} />;
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
