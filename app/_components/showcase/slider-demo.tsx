"use client";

import { IconAdjustments } from "@tabler/icons-react";
import { useState } from "react";
import { Slider } from "@/components/ui/sensory-ui/slider";
import { DemoCard, SoundTrigger } from "./demo-card";

export function SliderDemo() {
  const [value, setValue] = useState([40]);

  return (
    <DemoCard
      description="Plays once on drop"
      icon={<IconAdjustments className="size-4" />}
      title="Slider"
    >
      <SoundTrigger soundRole="interaction.tap">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              Volume
            </span>
            <span className="font-mono text-[11px] text-foreground tabular-nums">
              {value[0]}
            </span>
          </div>
          <Slider
            aria-label="Volume control"
            max={100}
            min={0}
            onValueChange={setValue}
            step={1}
            value={value}
          />
        </div>
      </SoundTrigger>
    </DemoCard>
  );
}
