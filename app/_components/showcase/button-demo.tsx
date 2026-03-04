"use client";

import { IconClick } from "@tabler/icons-react";
import { Button } from "@/components/ui/sensory-ui/button";
import { DemoCard } from "./demo-card";

export function ButtonDemo() {
  return (
    <DemoCard
      description="Click to trigger each activation"
      icon={<IconClick className="size-4" />}
      soundRoles={["interaction.tap", "interaction.confirm"]}
      title="Button"
    >
      <div className="flex flex-col gap-3">
        <Button className="w-full" size="sm" sound="interaction.tap">
          Normal Action
        </Button>
        <Button
          className="w-full"
          size="sm"
          sound="interaction.confirm"
          variant="outline"
        >
          Confirm Action
        </Button>
      </div>
    </DemoCard>
  );
}
