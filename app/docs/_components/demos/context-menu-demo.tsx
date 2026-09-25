"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/sensory-ui/context-menu";

export function ContextMenuDocsDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-28 w-full max-w-xs items-center justify-center rounded-md border border-dashed text-muted-foreground text-sm">
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem>Copy</ContextMenuItem>
        <ContextMenuItem>Paste</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem sound="notification.warning">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
