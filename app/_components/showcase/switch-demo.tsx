"use client";

import { IconToggleLeft } from "@tabler/icons-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/sensory-ui/switch";
import { DemoCard, SoundTrigger } from "./demo-card";

const OPTIONS = [
  { id: "sounds", label: "Enable sounds" },
  { id: "haptics", label: "Enable haptics" },
  { id: "notifications", label: "Push notifications" },
];

export function SwitchDemo() {
  return (
    <DemoCard
      description="Toggle the switch for a subtle cue"
      icon={<IconToggleLeft className="size-4" />}
      title="Switch"
    >
      <SoundTrigger soundRole="interaction.toggle">
        <div className="flex flex-col gap-3">
          {OPTIONS.map((opt) => (
            <div className="flex items-center justify-between" key={opt.id}>
              <Label className="text-xs" htmlFor={`sw-${opt.id}`}>
                {opt.label}
              </Label>
              <Switch id={`sw-${opt.id}`} sound="interaction.toggle" />
            </div>
          ))}
        </div>
      </SoundTrigger>
    </DemoCard>
  );
}
