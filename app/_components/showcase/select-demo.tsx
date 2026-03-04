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
      soundRoles={["overlay.open", "overlay.close"]}
      title="Select"
    >
      <Select closeSound="overlay.close" sound="overlay.open">
        <SelectTrigger
          aria-label="Select sound pack"
          className="h-8 w-full text-xs"
        >
          <SelectValue placeholder="Choose sound pack…" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="soft">soft</SelectItem>
          <SelectItem value="aero">aero</SelectItem>
          <SelectItem value="arcade">arcade</SelectItem>
          <SelectItem value="retro">retro</SelectItem>
        </SelectContent>
      </Select>
    </DemoCard>
  );
}
