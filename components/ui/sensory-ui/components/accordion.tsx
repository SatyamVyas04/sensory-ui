"use client";

import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";
import { useSensoryUI } from "@/components/ui/sensory-ui/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/sound-roles";

function Accordion({
  className,
  expandSound,
  collapseSound,
  onValueChange,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root> & {
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
          } else {
            // type="single": non-empty string = opening, empty string = closing
            return value !== "";
          }
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

  return (
    <AccordionPrimitive.Root
      className={cn("flex w-full flex-col", className)}
      data-slot="accordion"
      onValueChange={handleValueChange}
      {...props}
    />
  );
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn("not-last:border-b", className)}
      data-slot="accordion-item"
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group/accordion-trigger relative flex flex-1 items-start justify-between rounded-none border border-transparent py-2.5 text-left font-medium text-xs outline-none transition-all hover:underline focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:after:border-ring disabled:pointer-events-none disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground",
          className
        )}
        data-slot="accordion-trigger"
        {...props}
      >
        {children}
        <IconChevronDown
          className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
          data-slot="accordion-trigger-icon"
        />
        <IconChevronUp
          className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
          data-slot="accordion-trigger-icon"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden text-xs data-closed:animate-accordion-up data-open:animate-accordion-down"
      data-slot="accordion-content"
      {...props}
    >
      <div
        className={cn(
          "h-(--radix-accordion-content-height) pt-0 pb-2.5 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
