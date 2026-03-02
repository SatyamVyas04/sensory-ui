"use client";

import {
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/sensory-ui/button";
import { DemoCard, SoundTrigger } from "./demo-card";

export function NavigationDemo() {
  return (
    <DemoCard
      description="Directional movement and scrolling"
      icon={<IconArrowRight className="size-4" />}
      title="Navigation"
    >
      <div className="flex flex-col gap-3">
        <SoundTrigger soundRole="navigation.forward">
          <Button
            className="w-full justify-start"
            size="sm"
            sound="navigation.forward"
            variant="outline"
          >
            <IconArrowRight className="size-3.5" />
            Navigate Forward
          </Button>
        </SoundTrigger>
        <SoundTrigger soundRole="navigation.backward">
          <Button
            className="w-full justify-start"
            size="sm"
            sound="navigation.backward"
            variant="outline"
          >
            <IconArrowLeft className="size-3.5" />
            Navigate Back
          </Button>
        </SoundTrigger>
        <SoundTrigger soundRole="navigation.switch">
          <Button
            className="w-full justify-start"
            size="sm"
            sound="navigation.switch"
            variant="ghost"
          >
            <IconArrowDown className="size-3.5" />
            Switch Tab
          </Button>
        </SoundTrigger>
      </div>
    </DemoCard>
  );
}
