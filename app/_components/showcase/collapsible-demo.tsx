"use client";

import { IconFold } from "@tabler/icons-react";
import { Button } from "@/components/ui/sensory-ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/sensory-ui/collapsible";
import { DemoCard } from "./demo-card";

export function CollapsibleDemo() {
  return (
    <DemoCard
      description="Expand & collapse a content block"
      icon={<IconFold className="size-4" />}
      soundRoles={["overlay.expand", "overlay.collapse"]}
      title="Collapsible"
    >
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button className="w-full" size="sm" variant="outline">
            Show more
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 flex flex-col gap-1.5 border border-border bg-muted/30 p-3">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              Details
            </span>
            <span className="text-foreground text-xs">
              This content was hidden. Collapsible plays expand/collapse sounds
              when toggled.
            </span>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </DemoCard>
  );
}
