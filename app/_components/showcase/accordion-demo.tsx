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
      soundRoles={["overlay.expand", "overlay.collapse"]}
      title="Accordion"
    >
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
            Add a <code>sound</code> prop - the Web Audio engine handles the
            rest.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </DemoCard>
  );
}
