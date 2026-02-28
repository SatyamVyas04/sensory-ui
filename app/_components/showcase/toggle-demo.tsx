"use client";

import { IconBold, IconItalic, IconUnderline } from "@tabler/icons-react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/sensory-ui/toggle-group";
import { DemoCard, SoundTrigger } from "./demo-card";

export function ToggleDemo() {
  return (
    <DemoCard
      description="Select formatting options to toggle"
      icon={<IconBold className="size-4" />}
      title="Toggle Group"
    >
      <SoundTrigger soundRole="navigation.switch">
        <ToggleGroup
          className="w-full justify-between"
          sound="navigation.switch"
          type="multiple"
        >
          <ToggleGroupItem aria-label="Bold" value="bold">
            <IconBold className="size-3.5" />
            Bold
          </ToggleGroupItem>
          <ToggleGroupItem aria-label="Italic" value="italic">
            <IconItalic className="size-3.5" />
            Italic
          </ToggleGroupItem>
          <ToggleGroupItem aria-label="Underline" value="underline">
            <IconUnderline className="size-3.5" />
            Underline
          </ToggleGroupItem>
        </ToggleGroup>
      </SoundTrigger>
    </DemoCard>
  );
}
