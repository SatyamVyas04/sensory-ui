"use client";

import {
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/sensory-ui/button";

export function IconButtonsBlockLive() {
  return (
    <div className="flex items-center gap-2">
      <Button
        aria-label="Previous"
        size="icon"
        sound="navigation.backward"
        variant="outline"
      >
        <IconChevronLeft className="size-4" />
      </Button>
      <Button
        aria-label="Next"
        size="icon"
        sound="navigation.forward"
        variant="outline"
      >
        <IconChevronRight className="size-4" />
      </Button>
      <div className="mx-2 h-6 w-px bg-border" />
      <Button aria-label="Add" size="icon" sound="interaction.confirm">
        <IconPlus className="size-4" />
      </Button>
      <Button
        aria-label="Delete"
        size="icon"
        sound="notification.warning"
        variant="destructive"
      >
        <IconTrash className="size-4" />
      </Button>
    </div>
  );
}
