"use client";

import { IconSquareRoundedCheck } from "@tabler/icons-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/sensory-ui/checkbox";
import { DemoCard, SoundTrigger } from "./demo-card";

const OPTIONS = [
  { id: "apple", label: "Apple" },
  { id: "banana", label: "Banana" },
  { id: "cherry", label: "Cherry" },
  { id: "orange", label: "Orange" },
];

export function CheckboxDemo() {
  return (
    <DemoCard
      description="Check the box to confirm"
      icon={<IconSquareRoundedCheck className="size-4" />}
      title="Checkbox"
    >
      <SoundTrigger soundRole="interaction.toggle">
        <div className="flex flex-col gap-3">
          {OPTIONS.map((opt) => (
            <div className="flex items-center gap-2.5" key={opt.id}>
              <Checkbox id={`cb-${opt.id}`} />
              <Label className="text-xs" htmlFor={`cb-${opt.id}`}>
                {opt.label}
              </Label>
            </div>
          ))}
        </div>
      </SoundTrigger>
    </DemoCard>
  );
}
