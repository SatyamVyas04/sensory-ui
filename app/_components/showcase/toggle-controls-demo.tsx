"use client";

import {
  IconBold,
  IconItalic,
  IconToggleLeft,
  IconUnderline,
} from "@tabler/icons-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/sensory-ui/checkbox";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/sensory-ui/radio-group";
import { Switch } from "@/components/ui/sensory-ui/switch";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/sensory-ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { DemoCard } from "./demo-card";

export function ToggleControlsDemo() {
  return (
    <DemoCard
      description="Checkboxes, switches, radios & toggles"
      icon={<IconToggleLeft className="size-4" />}
      title="Toggle Controls"
    >
      <div className="flex flex-col gap-4">
        {/* Checkboxes */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] text-muted-foreground/70 uppercase tracking-widest">
            Checkbox
          </span>
          <div className="flex items-center gap-4">
            {["Apple", "Banana", "Cherry"].map((label) => (
              <div className="flex items-center gap-2" key={label}>
                <Checkbox id={`cb-${label.toLowerCase()}`} />
                <Label
                  className="text-xs"
                  htmlFor={`cb-${label.toLowerCase()}`}
                >
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Switches */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] text-muted-foreground/70 uppercase tracking-widest">
            Switch
          </span>
          {["Enable sounds", "Enable haptics"].map((label) => (
            <div className="flex items-center justify-between" key={label}>
              <Label
                className="text-xs"
                htmlFor={`sw-${label.toLowerCase().replace(/\s/g, "-")}`}
              >
                {label}
              </Label>
              <Switch id={`sw-${label.toLowerCase().replace(/\s/g, "-")}`} />
            </div>
          ))}
        </div>

        <Separator />

        {/* Radio Group */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] text-muted-foreground/70 uppercase tracking-widest">
            Radio Group
          </span>
          <RadioGroup
            className="flex gap-4"
            defaultValue="medium"
            sound="interaction.toggle"
          >
            {["Light", "Medium", "Heavy"].map((label) => (
              <div className="flex items-center gap-1.5" key={label}>
                <RadioGroupItem
                  id={`rg-${label.toLowerCase()}`}
                  value={label.toLowerCase()}
                />
                <Label
                  className="cursor-pointer text-xs"
                  htmlFor={`rg-${label.toLowerCase()}`}
                >
                  {label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator />

        {/* Toggle Group */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] text-muted-foreground/70 uppercase tracking-widest">
            Toggle Group
          </span>
          <ToggleGroup className="w-full justify-between" type="multiple">
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
        </div>
      </div>
    </DemoCard>
  );
}
