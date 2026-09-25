"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/sensory-ui/context-menu";

export function ContextMenuBlockLive() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-32 w-full max-w-xs items-center justify-center rounded-md border border-dashed text-muted-foreground text-sm">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem>Back</ContextMenuItem>
        <ContextMenuItem>Forward</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Reload</ContextMenuItem>
        <ContextMenuItem sound="notification.warning">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
