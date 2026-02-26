"use client";

import { IconAdjustments } from "@tabler/icons-react";
import { useState } from "react";
import { Slider } from "@/components/ui/sensory-ui/slider";
import { DemoCard } from "./demo-card";

export function SliderDemo() {
  const [value, setValue] = useState([40]);

  return (
    <DemoCard
      description="Release to commit — plays once on drop"
      icon={<IconAdjustments className="size-4" />}
      title="Slider"
    >
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
          max={100}
          min={0}
          onValueChange={setValue}
          sound="activation.subtle"
          step={1}
          value={value}
        />
        <span className="font-mono text-[10px] text-muted-foreground/50 leading-none">
          activation.subtle
        </span>
      </div>
    </DemoCard>
  );
}
