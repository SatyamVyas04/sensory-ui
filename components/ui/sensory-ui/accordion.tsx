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

function Accordion({
  expandSound,
  collapseSound,
  onValueChange,
  ...props
}: React.ComponentProps<typeof BaseAccordion> & {
  /**
   * Sound to play when an accordion item expands.
   * For type="multiple", fires when an item is added to the open set.
   */
  expandSound?: SoundRole;
  /**
   * Sound to play when an accordion item collapses.
   * For type="multiple", fires when an item is removed from the open set.
   * For type="single", fires when the open item is closed.
   */
  collapseSound?: SoundRole;
}) {
  const { playSound } = useSensoryUI();
  const prevValueRef = React.useRef<string | string[] | undefined>(undefined);

  // Unified handler that works for both type="single" and type="multiple"
  const handleValueChange = React.useCallback(
    (value: string & string[]) => {
      const prev = prevValueRef.current;

      if (expandSound || collapseSound) {
        const isExpanding = (() => {
          if (Array.isArray(value)) {
            // type="multiple"
            const prevLen = Array.isArray(prev) ? prev.length : 0;
            return value.length > prevLen;
          }
          // type="single": non-empty string = opening, empty string = closing
          return value !== "";
        })();

        if (isExpanding && expandSound) {
          void playSound(expandSound);
        } else if (!isExpanding && collapseSound) {
          void playSound(collapseSound);
        }
      }

      prevValueRef.current = value;
      // Cast needed because Radix overloads onValueChange per type
      (onValueChange as ((v: string & string[]) => void) | undefined)?.(value);
    },
    [expandSound, collapseSound, playSound, onValueChange]
  );

  return <BaseAccordion onValueChange={handleValueChange} {...props} />;
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
