"use client";

import {
  IconBrandGithub,
  IconChevronDown,
  IconHeart,
  IconLayoutSidebar,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";
import Link from "fumadocs-core/link";
import type { Folder, Item, Node } from "fumadocs-core/page-tree";
import { useOnChange } from "fumadocs-core/utils/use-on-change";
import { SidebarCollapseTrigger } from "fumadocs-ui/components/sidebar/base";
import { useTreeContext, useTreePath } from "fumadocs-ui/contexts/tree";
import { useGlassLayout } from "fumadocs-ui/layouts/glass";
import {
  SidebarProvider,
  useSidebar,
} from "fumadocs-ui/layouts/glass/slots/sidebar";
import NextLink from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/sensory-ui/switch";
import { cn } from "@/lib/utils";
import { DocsDrawer } from "./docs-drawer";

export const docsSidebarSlots = {
  drawer: DocsDrawer,
  main: DocsSidebar,
  provider: SidebarProvider,
  use: useSidebar,
};

export function useGithubStars() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("https://api.github.com/repos/SatyamVyas04/sensory-ui")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && typeof data?.stargazers_count === "number") {
          setStars(data.stargazers_count);
        }
      })
      .catch(() => {
        // Network failure or rate limit: leave the star count hidden.
        setStars(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return stars;
}

function isNodeInPath(node: { $id?: string }, path: { $id?: string }[]) {
  if (!node.$id) {
    return false;
  }
  return path.some((other) => other.$id === node.$id);
}

const treeItemClass =
  "flex w-full items-center justify-start gap-2 px-2.5 py-1.5 text-left font-sans text-sm text-fd-muted-foreground outline-none transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground focus-visible:ring-2 focus-visible:ring-fd-ring data-[active=true]:bg-fd-primary/10 data-[active=true]:text-fd-primary [&_svg]:size-4 [&_svg]:shrink-0";

function TreePage({ node, depth = 0 }: { node: Item; depth?: number }) {
  const path = useTreePath();
  const nested = depth > 0;
  return (
    <Link
      className={cn(treeItemClass, nested && "ps-4")}
      data-active={isNodeInPath(node, path)}
      external={node.external}
      href={node.url}
    >
      {node.icon}
      {nested && (
        <span
          aria-hidden="true"
          className="shrink-0 select-none text-fd-muted-foreground/50"
        >
          &gt;
        </span>
      )}
      <span className="min-w-0 flex-1 truncate">{node.name}</span>
    </Link>
  );
}

function TreeFolder({ folder, depth = 0 }: { folder: Folder; depth?: number }) {
  const path = useTreePath();
  const shouldOpen = (folder.defaultOpen ?? true) || isNodeInPath(folder, path);
  const [open, setOpen] = useState(shouldOpen);
  useOnChange(shouldOpen, () => {
    if (shouldOpen) {
      setOpen(true);
    }
  });

  const chevron = (
    <IconChevronDown
      className={cn(
        "ms-auto size-3.5 shrink-0 text-fd-muted-foreground transition-transform",
        !open && "-rotate-90"
      )}
    />
  );

  return (
    <Collapsible className="flex flex-col" onOpenChange={setOpen} open={open}>
      {folder.index ? (
        <div className="flex w-full items-center justify-start gap-2 px-2.5 py-1.5 text-left font-medium font-sans text-sm outline-none focus-visible:ring-2 focus-visible:ring-fd-ring">
          <Link
            className="inline-flex min-w-0 flex-1 items-center gap-2 text-fd-muted-foreground transition-colors hover:text-fd-accent-foreground data-[active=true]:text-fd-primary [&_svg]:size-4 [&_svg]:shrink-0"
            data-active={isNodeInPath(folder.index, path)}
            external={folder.index.external}
            href={folder.index.url}
          >
            {folder.icon}
            <span className="min-w-0 flex-1 truncate">{folder.name}</span>
          </Link>
          <CollapsibleTrigger
            aria-label={`Toggle ${folder.name}`}
            className="flex shrink-0 items-center"
          >
            {chevron}
          </CollapsibleTrigger>
        </div>
      ) : (
        <CollapsibleTrigger className={cn(treeItemClass, "font-medium")}>
          {folder.icon}
          <span className="min-w-0 flex-1 truncate">{folder.name}</span>
          {chevron}
        </CollapsibleTrigger>
      )}
      <CollapsibleContent className="flex flex-col">
        {folder.children.map((item, i) => (
          <TreeNode
            depth={depth + 1}
            key={item.$id ?? `${item.name}-${i}`}
            node={item}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

function TreeNode({ node, depth = 0 }: { node: Node; depth?: number }) {
  if (node.type === "page") {
    return <TreePage depth={depth} node={node} />;
  }
  if (node.type === "folder") {
    return <TreeFolder depth={depth} folder={node} />;
  }
  return (
    <p className="mt-3 flex w-full items-center justify-start gap-2 px-2.5 py-1.5 text-left font-medium font-sans text-sm first:mt-0 [&_svg]:size-4">
      {node.icon}
      <span className="truncate">{node.name}</span>
    </p>
  );
}

export function TreeNav({ className }: { className?: string }) {
  const { root } = useTreeContext();
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      {root.children.map((node, i) => (
        <TreeNode key={node.$id ?? `${node.name}-${i}`} node={node} />
      ))}
    </div>
  );
}

export function SponsorCard({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("shrink-0", compact ? "px-3 pb-2.5" : "px-3 pb-3")}>
      <a
        className={cn(
          "group flex flex-col items-center gap-2 border border-pink-200 bg-pink-50/60 text-center font-sans transition-colors hover:border-pink-300 hover:bg-pink-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-pink-500 focus-visible:outline-offset-2 dark:border-pink-900/40 dark:bg-pink-950/20 dark:hover:border-pink-800 dark:hover:bg-pink-950/30",
          compact ? "px-2 py-2.5" : "px-2 py-4"
        )}
        href="https://github.com/sponsors/SatyamVyas04"
        rel="noopener noreferrer"
        target="_blank"
      >
        <IconHeart
          className={cn(
            "fill-pink-500 text-pink-500 transition-transform duration-300 group-hover:scale-110",
            compact ? "size-4" : "size-5"
          )}
        />
        <span
          className={cn(
            "font-semibold text-fd-foreground",
            compact ? "text-[13px]" : "text-sm"
          )}
        >
          Sponsor sensory-ui
        </span>
        <span className="text-balance text-fd-muted-foreground text-xs leading-snug">
          Free & Open-Source, Forever.
        </span>
      </a>
    </div>
  );
}

export function ThemeSlider() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dark = mounted && resolvedTheme === "dark";

  return (
    <span className="flex shrink-0 items-center gap-1.5">
      <IconSun
        aria-hidden="true"
        className="size-3.5 text-fd-muted-foreground"
      />
      <Switch
        aria-label="Toggle dark mode"
        checked={dark}
        onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
        size="sm"
      />
      <IconMoon
        aria-hidden="true"
        className="size-3.5 text-fd-muted-foreground"
      />
    </span>
  );
}

export function GithubButton({ className }: { className?: string }) {
  const stars = useGithubStars();
  return (
    <NextLink
      aria-label="GitHub - SatyamVyas04/sensory-ui"
      className={cn(
        "flex h-8 items-center justify-center gap-1.5 border border-fd-border bg-transparent px-2.5 font-sans text-fd-muted-foreground text-xs transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground",
        className
      )}
      href="https://github.com/SatyamVyas04/sensory-ui"
      rel="noopener noreferrer"
      target="_blank"
    >
      <IconBrandGithub className="size-3.5 shrink-0" />
      {stars != null && <span className="tabular-nums">{stars} &#9733;</span>}
    </NextLink>
  );
}

/**
 * Desktop sidebar (md+): logo + collapse, full-width search, scrolling
 * tree in a shadcn ScrollArea (stable gutter, no layout shift), sponsor
 * block, and a slim GitHub + theme-slider footer line. Mirrors the stock
 * glass grid + collapse classes so `#fd-glass-layout` keeps working.
 */
export function DocsSidebar({ className }: { className?: string }) {
  const { slots } = useGlassLayout();
  const { collapsible, collapsed } = useSidebar();

  return (
    <aside
      className={cn(
        "sticky top-2 z-30 my-2 ms-2 flex h-[calc(100dvh---spacing(4))] flex-col border border-fd-border bg-fd-popover/80 text-fd-popover-foreground shadow-sm backdrop-blur-sm transition-transform [grid-area:left] max-md:hidden md:layout:[--fd-left-width:280px]",
        collapsed &&
          "w-[calc(280px---spacing(2))] -translate-x-[280px] md:layout:[--fd-left-width:0px]",
        className
      )}
      id="nd-sidebar"
    >
      <div className="flex h-12 shrink-0 items-center gap-2 border-fd-border border-b px-3">
        <slots.navTitle className="flex min-w-0 flex-1 items-center gap-2.5 font-semibold text-[15px]" />
        {collapsible && (
          <SidebarCollapseTrigger className="flex size-8 shrink-0 items-center justify-center text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground">
            <IconLayoutSidebar className="size-3.5" />
          </SidebarCollapseTrigger>
        )}
      </div>

      {slots.searchTrigger && (
        <div className="shrink-0 px-3 pt-3">
          <slots.searchTrigger.full className="h-8 w-full border-fd-border bg-transparent font-sans text-xs" />
        </div>
      )}

      <ScrollArea className="min-h-0 flex-1">
        <div className="p-3 [mask-image:linear-gradient(to_bottom,transparent,white_12px,white_calc(100%-12px),transparent)]">
          <TreeNav />
        </div>
      </ScrollArea>

      <SponsorCard />

      <div className="flex h-10 shrink-0 items-center gap-1 border-fd-border border-t px-2">
        <GithubButton className="h-8 flex-1 justify-start border-0 px-2" />
        <span className="px-2">
          <ThemeSlider />
        </span>
      </div>
    </aside>
  );
}
