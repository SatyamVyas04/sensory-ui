"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/sensory-ui/accordion";

export function AccordionDocsDemo() {
  return (
    <Accordion
      className="h-[200px] w-full"
      collapsible
      defaultValue="item-2"
      type="single"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="font-sans text-md">
          Refund policy
        </AccordionTrigger>
        <AccordionContent className="h-full">
          30-day money-back guarantee.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="font-sans text-md">
          Shipping info
        </AccordionTrigger>
        <AccordionContent className="h-full">
          Free shipping over $50.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger className="font-sans text-md">
          Contact us
        </AccordionTrigger>
        <AccordionContent className="h-full">
          Email us at support@example.com.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
