"use client";

import { IconSquareRoundedCheck } from "@tabler/icons-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/sensory-ui/checkbox";
import { DemoCard, SoundTrigger } from "./demo-card";

export function CheckboxDemo() {
  return (
    <DemoCard
      description="Check the box to confirm"
      icon={<IconSquareRoundedCheck className="size-4" />}
      title="Checkbox"
    >
      <div className="flex items-center justify-center">
        <SoundTrigger soundRole="activation.confirm">
          <div className="flex items-center gap-3">
            <Checkbox id="demo-checkbox" sound="activation.confirm" />
            <Label htmlFor="demo-checkbox">Accept terms</Label>
          </div>
        </SoundTrigger>
      </div>
    </DemoCard>
  );
}
