"use client";

import { IconRadio } from "@tabler/icons-react";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/sensory-ui/radio-group";
import { DemoCard } from "./demo-card";

const OPTIONS = [
  { value: "light", label: "Light", desc: "low feedback" },
  { value: "medium", label: "Medium", desc: "balanced" },
  { value: "heavy", label: "Heavy", desc: "high feedback" },
];

export function RadioGroupDemo() {
  return (
    <DemoCard
      description="Select an option to hear the feedback"
      icon={<IconRadio className="size-4" />}
      soundRoles={["interaction.toggle"]}
      title="Radio Group"
    >
      <RadioGroup defaultValue="medium" sound="interaction.toggle">
        {OPTIONS.map((opt) => (
          <div className="flex items-center gap-2.5" key={opt.value}>
            <RadioGroupItem id={`rg-${opt.value}`} value={opt.value} />
            <Label
              className="flex cursor-pointer items-baseline gap-1.5 text-xs"
              htmlFor={`rg-${opt.value}`}
            >
              {opt.label}
              <span className="font-mono text-[10px] text-muted-foreground/60">
                {opt.desc}
              </span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </DemoCard>
  );
}
