"use client";

import { IconSelector } from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/sensory-ui/select";
import { DemoCard } from "./demo-card";

export function SelectDemo() {
  return (
    <DemoCard
      description="Open & close to hear the overlay pair"
      icon={<IconSelector className="size-4" />}
      title="Select"
    >
      <div className="flex flex-col gap-3">
        <Select closeSound="system.close" sound="system.open">
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Choose sound pack…" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">default — clean SaaS</SelectItem>
            <SelectItem value="arcade">arcade — 8-bit chiptune</SelectItem>
            <SelectItem value="wind">wind — organic / airy</SelectItem>
            <SelectItem value="retro">retro — synthwave</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-4">
          <span className="font-mono text-[10px] text-muted-foreground/50 leading-none">
            system.open
          </span>
          <span className="font-mono text-[10px] text-muted-foreground/50 leading-none">
            system.close
          </span>
        </div>
      </div>
    </DemoCard>
  );
}
