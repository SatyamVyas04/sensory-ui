"use client";

import { IconCursorText } from "@tabler/icons-react";
import { Button } from "@/components/ui/sensory-ui/button";
import { DemoCard, SoundTrigger } from "./demo-card";

export function ButtonDemo() {
  return (
    <DemoCard
      description="Click to trigger each activation"
      icon={<IconCursorText className="size-4" />}
      title="Button"
    >
      <div className="flex flex-wrap gap-x-3 gap-y-4">
        <SoundTrigger soundRole="activation.primary">
          <Button size="sm" sound="activation.primary">
            Primary
          </Button>
        </SoundTrigger>
        <SoundTrigger soundRole="activation.subtle">
          <Button size="sm" sound="activation.subtle" variant="outline">
            Subtle
          </Button>
        </SoundTrigger>
        <SoundTrigger soundRole="activation.confirm">
          <Button size="sm" sound="activation.confirm" variant="secondary">
            Confirm
          </Button>
        </SoundTrigger>
        <SoundTrigger soundRole="activation.error">
          <Button size="sm" sound="activation.error" variant="destructive">
            Error
          </Button>
        </SoundTrigger>
      </div>
    </DemoCard>
  );
}
