"use client";

import { IconBold, IconItalic, IconUnderline } from "@tabler/icons-react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/sensory-ui/toggle-group";
import { DemoCard } from "./demo-card";

export function ToggleDemo() {
  return (
    <DemoCard
      description="Select formatting options to hear selection ticks"
      icon={<IconBold className="size-4" />}
      title="Toggle Group"
    >
      <div className="flex flex-col gap-3">
        <ToggleGroup sound="navigation.switch" type="multiple">
          <ToggleGroupItem aria-label="Bold" value="bold">
            <IconBold className="size-3.5" />
            <span className="text-xs">Bold</span>
          </ToggleGroupItem>
          <ToggleGroupItem aria-label="Italic" value="italic">
            <IconItalic className="size-3.5" />
            <span className="text-xs">Italic</span>
          </ToggleGroupItem>
          <ToggleGroupItem aria-label="Underline" value="underline">
            <IconUnderline className="size-3.5" />
            <span className="text-xs">Underline</span>
          </ToggleGroupItem>
        </ToggleGroup>
        <span className="font-mono text-[10px] text-muted-foreground/50 leading-none">
          navigation.switch
        </span>
      </div>
    </DemoCard>
  );
}
