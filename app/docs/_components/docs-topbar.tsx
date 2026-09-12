"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { IconBrandGithub, IconBrandX } from "@tabler/icons-react";

interface DocsTopbarProps {
  stars?: number | null;
}

export function DocsTopbar({ stars }: DocsTopbarProps) {
  return (
    <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-sm">
      <SidebarTrigger className="-ml-1" />
      <div className="flex-1" />
      <nav className="flex items-center gap-2">
        <ModeToggle />
        <Button asChild className="size-8 bg-transparent" variant="outline">
          <Link
            aria-label="Twitter/X - @SatyamVyas04"
            href="https://x.com/SatyamVyas04"
            rel="noopener noreferrer"
            target="_blank"
          >
            <IconBrandX aria-hidden="true" className="size-4" />
          </Link>
        </Button>
        <Button asChild className="bg-transparent" variant="outline">
          <Link
            aria-label="GitHub - SatyamVyas04/sensory-ui"
            href="https://github.com/SatyamVyas04/sensory-ui"
            rel="noopener noreferrer"
            target="_blank"
          >
            <IconBrandGithub aria-hidden="true" className="size-3.5" />
            {stars != null && (
              <span className="hidden text-muted-foreground tabular-nums sm:inline">
                {stars} &#9733;
              </span>
            )}
          </Link>
        </Button>
      </nav>
    </header>
  );
}
