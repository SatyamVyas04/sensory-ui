"use client";

import { IconChevronLeft } from "@tabler/icons-react";
import { Button } from "@/components/ui/sensory-ui/button";

const crumbs = ["Home", "Components", "Button"];

export function BreadcrumbBlockLive() {
  return (
    <nav className="flex items-center gap-1 text-muted-foreground text-sm">
      <Button
        aria-label="Go back"
        className="size-8"
        size="icon"
        sound="navigation.backward"
        variant="ghost"
      >
        <IconChevronLeft className="size-4" />
      </Button>
      {crumbs.map((label, i) => (
        <span className="flex items-center gap-1" key={label}>
          {i > 0 && <span className="text-muted-foreground/50">/</span>}
          <Button asChild size="sm" sound="navigation.tab" variant="link">
            <span className="h-auto cursor-pointer p-0">{label}</span>
          </Button>
        </span>
      ))}
    </nav>
  );
}
