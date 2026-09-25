"use client";

import { Checkbox } from "@/components/ui/sensory-ui/checkbox";

export function CheckboxDocsDemo() {
  return (
    <div className="flex flex-col items-start gap-4">
      <label
        className="flex cursor-pointer items-center gap-2.5 text-sm"
        htmlFor="demo-checkbox-default"
      >
        <Checkbox defaultChecked id="demo-checkbox-default" />
        Default toggle sound
      </label>
      <label
        className="flex cursor-pointer items-center gap-2.5 text-sm"
        htmlFor="demo-checkbox-confirm"
      >
        <Checkbox id="demo-checkbox-confirm" sound="interaction.confirm" />
        Confirm instead of toggle
      </label>
      <label
        className="flex cursor-pointer items-center gap-2.5 text-muted-foreground text-sm"
        htmlFor="demo-checkbox-silent"
      >
        <Checkbox id="demo-checkbox-silent" sound={false} />
        Silent checkbox
      </label>
    </div>
  );
}
