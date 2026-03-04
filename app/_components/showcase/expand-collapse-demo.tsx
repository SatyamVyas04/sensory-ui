"use client";

import { IconChevronDown } from "@tabler/icons-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/sensory-ui/accordion";
import { Button } from "@/components/ui/sensory-ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/sensory-ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { DemoCard } from "./demo-card";

export function ExpandCollapseDemo() {
  return (
    <DemoCard
      description="Accordion & collapsible expand/collapse sounds"
      icon={<IconChevronDown className="size-4" />}
      title="Expand / Collapse"
    >
      <div className="flex flex-col gap-4">
        {/* Accordion */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] text-muted-foreground/70 uppercase tracking-widest">
            Accordion
          </span>
          <Accordion
            collapseSound="overlay.collapse"
            collapsible
            expandSound="overlay.expand"
            type="single"
          >
            <AccordionItem value="what">
              <AccordionTrigger>What is sensory-ui?</AccordionTrigger>
              <AccordionContent>
                A sound layer for shadcn/ui components.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="how">
              <AccordionTrigger>How does it work?</AccordionTrigger>
              <AccordionContent>
                Add a <code>sound</code> prop — the Web Audio engine handles the
                rest.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <Separator />

        {/* Collapsible */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] text-muted-foreground/70 uppercase tracking-widest">
            Collapsible
          </span>
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button className="w-full" size="sm" variant="outline">
                Show more
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 flex flex-col gap-1.5 border border-border bg-muted/30 p-3">
                <span className="text-foreground text-xs">
                  Collapsible plays expand/collapse sounds when toggled.
                </span>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </DemoCard>
  );
}
