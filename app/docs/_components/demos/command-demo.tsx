"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/sensory-ui/command";

export function CommandDocsDemo() {
  return (
    <Command className="h-60 w-full max-w-xs overflow-hidden rounded-lg border shadow-none">
      <CommandInput placeholder="Type to filter..." />
      <CommandList className="min-h-0 flex-1 overflow-y-auto">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search emoji</CommandItem>
          <CommandItem sound="interaction.confirm">Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
