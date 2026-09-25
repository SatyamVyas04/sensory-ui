"use client";

import { IconLayoutSidebar, IconSettings, IconUser } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/sensory-ui/button";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import { cn } from "@/lib/utils";

export function SidebarDocsDemo() {
  const [open, setOpen] = useState(true);
  const { playSound } = useSensoryUI();

  const toggle = () => {
    const next = !open;
    setOpen(next);
    playSound(next ? "overlay.open" : "overlay.close").catch(() => undefined);
  };

  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <div className="flex overflow-hidden rounded-md border">
        <div
          className={cn(
            "flex h-40 flex-col gap-1 bg-muted/40 p-2 transition-all",
            open ? "w-36" : "w-12 items-center"
          )}
        >
          {[
            { icon: IconLayoutSidebar, label: "Overview" },
            { icon: IconUser, label: "Profile" },
            { icon: IconSettings, label: "Settings" },
          ].map(({ icon: Icon, label }) => (
            <span
              className="flex items-center gap-2 rounded px-2 py-1.5 text-xs"
              key={label}
            >
              <Icon className="size-3.5 shrink-0 text-muted-foreground" />
              {open && label}
            </span>
          ))}
        </div>
        <div className="flex flex-1 items-center justify-center p-4 text-muted-foreground text-xs">
          {open ? "Sidebar open" : "Sidebar collapsed"}
        </div>
      </div>
      <div className="flex justify-center">
        <Button onClick={toggle} size="sm" sound={false} variant="outline">
          {open ? "Collapse" : "Expand"} sidebar
        </Button>
      </div>
    </div>
  );
}
