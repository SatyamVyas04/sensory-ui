"use client";

import { IconCommand } from "@tabler/icons-react";
import { useState } from "react";
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
  { value: "action-one", label: "Action one" },
  { value: "action-two", label: "Action two" },
  { value: "action-three", label: "Action three" },
  { value: "action-four", label: "Action four" },
];

export function CommandDemo() {
  const [commandValue, setCommandValue] = useState("");

  return (
    <DemoCard
      description="Search and select from a command palette"
      icon={<IconCommand className="size-4" />}
      title="Command"
    >
      <Command
        className="border border-border"
        onValueChange={setCommandValue}
        value={commandValue}
      >
        <CommandInput autoFocus={false} placeholder="Type a command…" />
        <CommandList className="h-30">
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
