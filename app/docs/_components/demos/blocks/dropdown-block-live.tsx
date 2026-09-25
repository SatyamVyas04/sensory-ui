"use client";

import { IconDots } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/sensory-ui/dropdown-menu";

export function DropdownBlockLive() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="Open actions" size="icon" variant="outline">
          <IconDots className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Archive</DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive"
          sound="notification.warning"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
