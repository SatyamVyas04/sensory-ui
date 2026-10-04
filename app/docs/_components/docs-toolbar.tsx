"use client";

import { IconLayoutSidebar } from "@tabler/icons-react";
import { useGlassLayout } from "fumadocs-ui/layouts/glass";
import { useSidebar } from "fumadocs-ui/layouts/glass/slots/sidebar";
import { DocsBreadcrumbItems } from "./docs-breadcrumb";
import { GithubButton } from "./docs-sidebar";

/**
 * Desktop content toolbar (md+; mobile uses the header top bar).
 * Breadcrumbs always; search + theme + GitHub only when the sidebar is
 * collapsed (expanded state keeps them in the sidebar, like the
 * reference). All in-flow — nothing fixed, nothing can overlap.
 */
export function DocsToolbar() {
  const { slots } = useGlassLayout();
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <div className="mb-4 hidden h-8 items-center gap-2 md:flex">
      {collapsed && (
        <button
          aria-label="Show sidebar"
          className="flex size-8 shrink-0 items-center justify-center border border-fd-border bg-transparent text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
          onClick={() => setCollapsed(false)}
          type="button"
        >
          <IconLayoutSidebar className="size-3.5" />
        </button>
      )}
      <DocsBreadcrumbItems className="min-w-0 flex-1" />
      {collapsed && (
        <div className="flex shrink-0 items-center gap-2">
          {slots.searchTrigger && (
            <slots.searchTrigger.full className="h-8 w-48 border-fd-border bg-transparent font-sans text-xs lg:w-52" />
          )}
          <GithubButton />
        </div>
      )}
    </div>
  );
}
