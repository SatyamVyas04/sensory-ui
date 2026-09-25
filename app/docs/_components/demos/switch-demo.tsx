"use client";

import { Switch } from "@/components/ui/sensory-ui/switch";

export function SwitchDocsDemo() {
  return (
    <div className="flex flex-col items-start gap-4">
      <label
        className="flex cursor-pointer items-center gap-2.5 text-sm"
        htmlFor="demo-switch-wifi"
      >
        <Switch defaultChecked id="demo-switch-wifi" />
        Wi-Fi
      </label>
      <label
        className="flex cursor-pointer items-center gap-2.5 text-sm"
        htmlFor="demo-switch-autosave"
      >
        <Switch id="demo-switch-autosave" sound="interaction.confirm" />
        Auto-save (confirm)
      </label>
      <label
        className="flex cursor-pointer items-center gap-2.5 text-sm"
        htmlFor="demo-switch-delete"
      >
        <Switch id="demo-switch-delete" sound="notification.warning" />
        Delete on close
      </label>
      <label
        className="flex cursor-pointer items-center gap-2.5 text-muted-foreground text-sm"
        htmlFor="demo-switch-silent"
      >
        <Switch id="demo-switch-silent" sound={false} />
        Silent
      </label>
    </div>
  );
}
