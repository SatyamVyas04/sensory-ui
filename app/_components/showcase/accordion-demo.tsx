"use client";

import { IconChevronDown } from "@tabler/icons-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/sensory-ui/accordion";
import { DemoCard } from "./demo-card";

export function AccordionDemo() {
  return (
    <DemoCard
      description="Expand & collapse accordion items"
      icon={<IconChevronDown className="size-4" />}
      title="Accordion"
    >
      <div className="flex flex-col gap-3">
        <Accordion
          collapseSound="system.collapse"
          collapsible
          expandSound="system.expand"
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
        <div className="flex gap-4">
          <span className="font-mono text-[10px] text-muted-foreground/50 leading-none">
            system.expand
          </span>
          <span className="font-mono text-[10px] text-muted-foreground/50 leading-none">
            system.collapse
          </span>
        </div>
      </div>
    </DemoCard>
  );
}
