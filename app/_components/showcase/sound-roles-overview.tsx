"use client";

import { IconBell } from "@tabler/icons-react";
import { DemoCard } from "./demo-card";

export function SoundRolesOverview() {
  return (
    <DemoCard
      description="All 17 semantic sound roles across 5 categories"
      icon={<IconBell className="size-4" />}
      title="+ More Sound Roles"
    >
      <p className="text-muted-foreground text-xs/relaxed">
        Beyond the interactive demos, sensory-ui defines additional semantic
        roles for navigation, notifications, and hero moments — each wired
        through the same{" "}
        <code className="bg-muted px-1 py-0.5 font-mono text-[10px]">
          sound
        </code>{" "}
        prop. Pass{" "}
        <code className="bg-muted px-1 py-0.5 font-mono text-[10px]">
          false
        </code>{" "}
        to silence any component.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1">
        {[
          {
            cat: "interaction",
            roles: ["tap", "subtle", "toggle", "confirm"],
          },
          { cat: "overlay", roles: ["open", "close", "expand", "collapse"] },
          { cat: "navigation", roles: ["forward", "backward", "tab"] },
          {
            cat: "notification",
            roles: ["info", "success", "warning", "error"],
          },
          { cat: "hero", roles: ["complete", "milestone"] },
        ].map(({ cat, roles }) => (
          <div className="py-1" key={cat}>
            <span className="font-mono text-[10px] text-primary/70 uppercase tracking-wider">
              {cat}
            </span>
            <div className="mt-0.5 flex flex-col gap-0.5">
              {roles.map((r) => (
                <span
                  className="font-mono text-[10px] text-muted-foreground"
                  key={r}
                >
                  .{r}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DemoCard>
  );
}
