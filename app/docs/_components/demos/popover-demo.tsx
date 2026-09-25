"use client";

import { Button } from "@/components/ui/sensory-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/sensory-ui/popover";

export function PopoverDocsDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Open popover</Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 text-sm">
          Floating content with the standard open / close pair.
        </PopoverContent>
      </Popover>
      <Popover closeSound={false}>
        <PopoverTrigger asChild>
          <Button variant="ghost">Close silently</Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 text-sm">
          Opens with sound, closes without.
        </PopoverContent>
      </Popover>
    </div>
  );
}
