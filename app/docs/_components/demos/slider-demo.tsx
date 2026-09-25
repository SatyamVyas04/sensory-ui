"use client";

import { Slider } from "@/components/ui/sensory-ui/slider";

export function SliderDocsDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-xs">
          Volume (subtle ticks)
        </span>
        <Slider defaultValue={[50]} max={100} step={1} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-xs">Quiet range</span>
        <Slider defaultValue={[30]} max={100} step={5} volume={0.3} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-xs">Tab ticks</span>
        <Slider
          defaultValue={[70]}
          max={100}
          sound="navigation.tab"
          step={10}
        />
      </div>
    </div>
  );
}
