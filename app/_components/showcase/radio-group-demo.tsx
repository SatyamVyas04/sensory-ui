"use client";

import { IconRadio } from "@tabler/icons-react";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/sensory-ui/radio-group";
import { DemoCard } from "./demo-card";

const OPTS = [
  { value: "light", label: "Light", desc: "minimal feedback" },
  { value: "standard", label: "Standard", desc: "balanced" },
  { value: "rich", label: "Rich", desc: "full fidelity" },
];

export function RadioGroupDemo() {
  return (
    <DemoCard
      description="Select an option to hear the confirm cue"
      icon={<IconRadio className="size-4" />}
      title="Radio Group"
    >
      <div className="flex flex-col gap-3">
        <RadioGroup defaultValue="standard" sound="activation.confirm">
          {OPTS.map((opt) => (
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
        <span className="font-mono text-[10px] text-muted-foreground/50 leading-none">
          activation.confirm
        </span>
      </div>
    </DemoCard>
  );
}
