"use client";

import { IconMenu2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/sensory-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/sensory-ui/dropdown-menu";
import { DemoCard } from "./demo-card";

export function DropdownMenuDemo() {
  return (
    <DemoCard
      description="Trigger the menu to play sounds"
      icon={<IconMenu2 className="size-4" />}
      soundRoles={["overlay.open", "overlay.close"]}
      title="Dropdown Menu"
    >
      <DropdownMenu closeSound="overlay.close" sound="overlay.open">
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline">
            Open Menu
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Sign Out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </DemoCard>
  );
}
