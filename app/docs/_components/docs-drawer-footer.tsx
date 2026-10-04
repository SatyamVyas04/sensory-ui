"use client";

import { IconBrandGithub } from "@tabler/icons-react";
import Link from "next/link";
import { ThemeSlider, useGithubStars } from "./docs-sidebar";

/**
 * Menu sheet bottom bar: GitHub (icon + stars) | theme slider.
 * Closing lives in the header cross — no redundant Close cell.
 */
export function DocsDrawerFooter() {
  const stars = useGithubStars();

  return (
    <div className="grid h-12 shrink-0 grid-cols-[1fr_auto] divide-x divide-fd-border border-fd-border border-t font-sans">
      <Link
        aria-label="GitHub - SatyamVyas04/sensory-ui"
        className="flex min-w-0 items-center justify-center gap-1.5 px-2 text-fd-muted-foreground text-xs transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
        href="https://github.com/SatyamVyas04/sensory-ui"
        rel="noopener noreferrer"
        target="_blank"
      >
        <IconBrandGithub className="size-3.5 shrink-0" />
        {stars != null && (
          <span className="truncate tabular-nums">{stars} &#9733;</span>
        )}
      </Link>
      <div className="flex items-center justify-center px-3">
        <ThemeSlider />
      </div>
    </div>
  );
}
