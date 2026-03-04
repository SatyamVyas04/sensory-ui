"use client";

import { IconCommand } from "@tabler/icons-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/sensory-ui/command";
import { DemoCard } from "./demo-card";

const ITEMS = [
  { value: "search", label: "Search files" },
  { value: "settings", label: "Open settings" },
  { value: "profile", label: "View profile" },
  { value: "theme", label: "Toggle theme" },
];

export function CommandDemo() {
  return (
    <DemoCard
      description="Search and select from a command palette"
      icon={<IconCommand className="size-4" />}
      soundRoles={["interaction.subtle", "interaction.tap"]}
      title="Command"
    >
      <Command className="border border-border">
        <CommandInput placeholder="Type a command…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Actions">
            {ITEMS.map((item) => (
              <CommandItem key={item.value} value={item.value}>
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </DemoCard>
  );
}
