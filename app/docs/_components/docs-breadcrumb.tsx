"use client";

import { getBreadcrumbItemsFromPath } from "fumadocs-core/breadcrumb";
import { useTreeContext, useTreePath } from "fumadocs-ui/contexts/tree";
import Link from "next/link";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

/**
 * Breadcrumb segments for docs pages. `Category > Subcategory > Title`:
 * parents are muted, the current page is brand-red. Bare list — callers
 * place it (DocsToolbar on desktop, DocsHeader top bar on mobile).
 */
export function DocsBreadcrumbItems({ className }: { className?: string }) {
  const path = useTreePath();
  const { root } = useTreeContext();
  // The tree root carries no index page, so link the docs landing explicitly.
  // `root.name` is the tree display name ("Docs").
  const items = [
    ...(typeof root.name === "string" && root.name
      ? [{ name: root.name, url: "/docs" }]
      : []),
    ...getBreadcrumbItemsFromPath(root, path, { includePage: true }),
  ];

  if (items.length === 0) {
    return null;
  }

  return (
    <ol
      className={cn(
        "flex min-w-0 items-center gap-1.5 font-sans text-xs",
        className
      )}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <Fragment key={`${item.url ?? ""}#${item.name}`}>
            {i > 0 && (
              <li aria-hidden="true" className="shrink-0 select-none">
                <span className="text-muted-foreground/60">&gt;</span>
              </li>
            )}
            <li className="flex min-w-0">
              {item.url && !isLast ? (
                <Link
                  className="truncate text-muted-foreground transition-colors hover:text-foreground"
                  href={item.url}
                >
                  {item.name}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(
                    "truncate",
                    isLast
                      ? "font-medium text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {item.name}
                </span>
              )}
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}
