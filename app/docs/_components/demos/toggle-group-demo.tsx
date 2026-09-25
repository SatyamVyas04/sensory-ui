"use client";

import {
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
} from "@tabler/icons-react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/sensory-ui/toggle-group";

export function ToggleGroupDocsDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <ToggleGroup
        aria-label="Text alignment"
        defaultValue="center"
        type="single"
      >
        <ToggleGroupItem aria-label="Align left" value="left">
          <IconAlignLeft className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Align center" value="center">
          <IconAlignCenter className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Align right" value="right">
          <IconAlignRight className="size-4" />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup aria-label="Options" sound="navigation.tab" type="multiple">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
        <ToggleGroupItem value="c">C</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
