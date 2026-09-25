"use client";

import { Button } from "@/components/ui/sensory-ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/sensory-ui/collapsible";

export function CollapsibleDocsDemo() {
  return (
    <Collapsible className="flex w-full max-w-xs flex-col items-center gap-2">
      <CollapsibleTrigger asChild>
        <Button variant="outline">Show details</Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="text-center text-muted-foreground text-sm">
        Hidden until expanded.
      </CollapsibleContent>
    </Collapsible>
  );
}
