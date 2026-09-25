"use client";

import { Toggle } from "@/components/ui/sensory-ui/toggle";

export function ToggleDocsDemo() {
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex items-center gap-2.5">
        <Toggle aria-label="Toggle bold">B</Toggle>
        <span className="text-sm">Default toggle sound</span>
      </div>
      <div className="flex items-center gap-2.5">
        <Toggle aria-label="Confirm toggle" sound="interaction.confirm">
          B
        </Toggle>
        <span className="text-sm">Confirm instead of toggle</span>
      </div>
      <div className="flex items-center gap-2.5">
        <Toggle aria-label="Silent toggle" sound={false}>
          B
        </Toggle>
        <span className="text-muted-foreground text-sm">Silent toggle</span>
      </div>
    </div>
  );
}
