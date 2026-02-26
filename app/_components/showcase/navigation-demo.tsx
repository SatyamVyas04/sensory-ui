"use client";

import {
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconPointer,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/sensory-ui/button";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import { DemoCard, SoundTrigger } from "./demo-card";

export function NavigationDemo() {
  const { playSound } = useSensoryUI();

  return (
    <DemoCard
      description="Spatial movement and focus feedback"
      icon={<IconArrowRight className="size-4" />}
      title="Navigation"
    >
      <div className="flex flex-wrap gap-x-3 gap-y-4">
        <SoundTrigger soundRole="navigation.forward">
          <Button size="sm" sound="navigation.forward" variant="outline">
            <IconArrowRight className="size-3.5" />
            Forward
          </Button>
        </SoundTrigger>
        <SoundTrigger soundRole="navigation.backward">
          <Button size="sm" sound="navigation.backward" variant="outline">
            <IconArrowLeft className="size-3.5" />
            Back
          </Button>
        </SoundTrigger>
        <SoundTrigger soundRole="navigation.scroll">
          <Button size="sm" sound="navigation.scroll" variant="ghost">
            <IconArrowDown className="size-3.5" />
            Scroll
          </Button>
        </SoundTrigger>
        <SoundTrigger soundRole="system.focus">
          <button
            aria-label="Tab to this button to hear the focus sound"
            className="inline-flex h-7 items-center gap-1.5 border border-border border-dashed px-2.5 font-mono text-muted-foreground text-xs transition-colors focus:border-ring focus:text-foreground focus:outline-none focus:ring-1 focus:ring-ring/50"
            onFocus={() => {
              playSound("system.focus");
            }}
            tabIndex={0}
            type="button"
          >
            <IconPointer className="size-3.5 text-primary/60" />
            tab to focus
          </button>
        </SoundTrigger>
      </div>
    </DemoCard>
  );
}
