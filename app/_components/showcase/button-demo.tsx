"use client";

import { IconClick } from "@tabler/icons-react";
import { Button } from "@/components/ui/sensory-ui/button";
import { DemoCard, SoundTrigger } from "./demo-card";

export function ButtonDemo() {
  return (
    <DemoCard
      description="Click to trigger each activation"
      icon={<IconClick className="size-4" />}
      title="Button"
    >
      <div className="flex flex-col gap-3">
        <SoundTrigger soundRole="interaction.tap">
          <Button className="w-full" size="sm" sound="interaction.tap">
            Primary
          </Button>
        </SoundTrigger>
        <SoundTrigger soundRole="interaction.confirm">
          <Button
            className="w-full"
            size="sm"
            sound="interaction.confirm"
            variant="outline"
          >
            Confirm
          </Button>
        </SoundTrigger>
        <SoundTrigger soundRole="notification.error">
          <Button
            className="w-full"
            size="sm"
            sound="notification.error"
            variant="destructive"
          >
            Error
          </Button>
        </SoundTrigger>
      </div>
    </DemoCard>
  );
}
