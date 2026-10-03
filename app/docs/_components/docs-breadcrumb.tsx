"use client";

import { IconChevronRight } from "@tabler/icons-react";
import { getBreadcrumbItemsFromPath } from "fumadocs-core/breadcrumb";
import { useTreeContext, useTreePath } from "fumadocs-ui/contexts/tree";
import Link from "next/link";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

/**
 * Minimal sticky breadcrumb bar for docs pages (mobile only — desktop has
 * the sidebar for hierarchy). Segments without a page (e.g. section
 * folders like "Getting started" that have no index) render as plain text;
 * the current page renders as active brand-red text.
 */
export function DocsBreadcrumb({ className }: { className?: string }) {
  const path = useTreePath();
  const { root } = useTreeContext();
  const items = getBreadcrumbItemsFromPath(root, path, {
    includeRoot: true,
    includePage: true,
  });

  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "sticky top-0 z-30 border-border/60 border-b bg-background/85 py-2 backdrop-blur-sm md:hidden",
        className
      )}
    >
      <ol className="flex items-center gap-1 text-xs">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <Fragment key={`${item.url ?? ""}#${item.name}`}>
              {i > 0 && (
                <li aria-hidden="true" className="flex shrink-0">
                  <IconChevronRight className="size-3 text-muted-foreground/60" />
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
    </nav>
  );
}
