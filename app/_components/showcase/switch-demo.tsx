"use client";

import { IconToggleLeft } from "@tabler/icons-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/sensory-ui/switch";
import { DemoCard, SoundTrigger } from "./demo-card";

export function SwitchDemo() {
  return (
    <DemoCard
      description="Toggle the switch for a subtle cue"
      icon={<IconToggleLeft className="size-4" />}
      title="Switch"
    >
      <div className="flex items-center justify-center">
        <SoundTrigger soundRole="activation.subtle">
          <div className="flex items-center gap-3">
            <Switch id="demo-switch" sound="activation.subtle" />
            <Label htmlFor="demo-switch">Enable sounds</Label>
          </div>
        </SoundTrigger>
      </div>
    </DemoCard>
  );
}
