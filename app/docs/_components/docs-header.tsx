"use client";

import {
  IconBrandGithub,
  IconChevronDown,
  IconMenu2,
} from "@tabler/icons-react";
import { getBreadcrumbItemsFromPath } from "fumadocs-core/breadcrumb";
import {
  SidebarTrigger,
  useSidebar,
} from "fumadocs-ui/components/sidebar/base";
import { useTreeContext, useTreePath } from "fumadocs-ui/contexts/tree";
import { useGlassLayout } from "fumadocs-ui/layouts/glass";
import type { HeaderProps } from "fumadocs-ui/layouts/glass/slots/header";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  if (target.isContentEditable) {
    return true;
  }
  if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
    return true;
  }
  return target.closest('[role="dialog"]') !== null;
}

function useCurrentPageTitle() {
  const path = useTreePath();
  const { root } = useTreeContext();
  const items = [
    ...(typeof root.name === "string" && root.name
      ? [{ name: root.name, url: "/docs" }]
      : []),
    ...getBreadcrumbItemsFromPath(root, path, { includePage: true }),
  ];
  return items.length > 0 ? (items.at(-1)?.name ?? "Docs") : "Docs";
}

interface TocEntry {
  depth: number;
  id: string;
  text: string;
}

function contentRoot(): Element | null {
  // Glass docs pages render the MDX body in DocsBody (`.prose`), not an
  // <article> element — scope to the layout so landing pages never match.
  return document.querySelector("#fd-glass-layout .prose");
}

function collectToc(): TocEntry[] {
  const root = contentRoot();
  if (!root) {
    return [];
  }
  return Array.from(root.querySelectorAll("h2[id], h3[id]"))
    .map((el) => ({
      id: el.id,
      text: (el.textContent ?? "").trim().replace("Copy Anchor Link", ""),
      depth: el.tagName === "H3" ? 3 : 2,
    }))
    .filter((entry) => entry.id && entry.text);
}

function readProgress(): number {
  const root = contentRoot();
  if (!root) {
    return 0;
  }
  const rect = root.getBoundingClientRect();
  const total = rect.height - window.innerHeight;
  if (total <= 0) {
    return 1;
  }
  return Math.min(1, Math.max(0, -rect.top / total));
}

function ProgressRing({ value }: { value: number }) {
  const size = 22;
  const stroke = 2.5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  return (
    <svg
      aria-hidden="true"
      className="size-[22px] shrink-0 -rotate-90"
      viewBox={`0 0 ${size} ${size}`}
    >
      <circle
        className="text-fd-border"
        cx={size / 2}
        cy={size / 2}
        fill="none"
        r={radius}
        stroke="currentColor"
        strokeWidth={stroke}
      />
      <circle
        className="text-fd-primary transition-[stroke-dashoffset] duration-150"
        cx={size / 2}
        cy={size / 2}
        fill="none"
        r={radius}
        stroke="currentColor"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - value)}
        strokeLinecap="round"
        strokeWidth={stroke}
      />
    </svg>
  );
}

/**
 * Mobile page nav: current subtopic + reading-progress ring. Tapping the
 * row expands an accordion with the full page contents (the desktop
 * right-rail dots stay hidden on mobile).
 */
function MobilePageNav() {
  const pathname = usePathname();
  const title = useCurrentPageTitle();
  const [entries, setEntries] = useState<TocEntry[]>([]);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-collect TOC + reset on navigation
  useEffect(() => {
    setOpen(false);
    setEntries(collectToc());
    setProgress(readProgress());
  }, [pathname]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setProgress(readProgress()));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="border-fd-border border-b">
      <button
        aria-expanded={open}
        className="flex h-11 w-full items-center gap-2 px-4 text-left"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <IconChevronDown
          className={cn(
            "size-3.5 shrink-0 text-fd-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
        <span className="min-w-0 flex-1 truncate font-medium font-sans text-sm">
          {title}
        </span>
        <div className="flex items-center gap-2">
          <span className="min-w-0 flex-1 truncate font-medium font-sans text-sm tabular-nums">
            {Math.round(progress * 100)}%
          </span>
          <ProgressRing value={progress} />
        </div>
      </button>
      {open && (
        <nav
          aria-label="On this page"
          className="max-h-[50dvh] overflow-y-auto border-fd-border border-t"
        >
          {entries.length === 0 ? (
            <p className="px-4 py-3 font-sans text-fd-muted-foreground text-xs">
              No sections on this page.
            </p>
          ) : (
            entries.map((entry) => (
              <Link
                className={cn(
                  "block truncate px-4 py-2.5 font-sans text-fd-muted-foreground text-sm transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground",
                  entry.depth === 3 && "ps-8"
                )}
                href={`#${entry.id}`}
                key={entry.id}
                onClick={() => setOpen(false)}
              >
                {entry.text}
              </Link>
            ))
          )}
        </nav>
      )}
    </div>
  );
}

/**
 * Z-index scale for docs chrome (search dialog is z-50, topmost):
 * - page content + in-flow toolbar: auto (0)
 * - mobile top bars + floating thumb buttons: z-30
 * - drawer overlay + panel: z-40 (panel after overlay in DOM)
 *
 * Mobile: logo + branding + GitHub on top, current subtopic + progress
 * ring underneath, search + menu floating bottom-right. Desktop collapsed
 * reopen lives in-flow in DocsToolbar, so nothing fixed can ever overlap
 * content on large screens.
 */
export function DocsHeader({ className, ...props }: HeaderProps) {
  const { slots } = useGlassLayout();
  const { setOpen, setCollapsed } = useSidebar();

  // Ctrl/Cmd + / toggles the sidemenu: drawer on mobile, collapse on desktop.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.defaultPrevented || e.isComposing) {
        return;
      }
      if (!(e.ctrlKey || e.metaKey) || e.key !== "/") {
        return;
      }
      if (isTypingTarget(e.target)) {
        return;
      }
      e.preventDefault();
      if (window.matchMedia("(max-width: 767px)").matches) {
        setOpen((v) => !v);
      } else {
        setCollapsed((v) => !v);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setOpen, setCollapsed]);

  return (
    <div className={cn("contents", className)} {...props}>
      {/* Mobile top chrome: brand row, then subtopic + progress accordion. */}
      <div className="sticky top-0 z-30 h-fit bg-fd-background/70 backdrop-blur-md [grid-area:left-margin/left-margin/right/right] md:hidden">
        <div className="flex h-12 items-center gap-2.5 px-4">
          <Link
            aria-label="sensory-ui home"
            className="flex min-w-0 flex-1 items-center gap-2.5 transition-opacity hover:opacity-80"
            href="/"
          >
            <Image
              alt="sensory-ui"
              className="size-6 shrink-0 rounded-full"
              height={24}
              src="/sensory-ui-logo-small.svg"
              width={24}
            />
            <span className="truncate font-semibold text-[15px]">
              sensory-ui
            </span>
          </Link>
          <Link
            aria-label="GitHub - SatyamVyas04/sensory-ui"
            className="flex size-8 shrink-0 items-center justify-center border border-fd-border bg-transparent text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
            href="https://github.com/SatyamVyas04/sensory-ui"
            rel="noopener noreferrer"
            target="_blank"
          >
            <IconBrandGithub className="size-3.5" />
          </Link>
        </div>
        <MobilePageNav />
      </div>

      {/* Mobile thumb controls: search + menu, floating bottom-right. */}
      <div className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex items-center gap-2 md:hidden">
        {slots.searchTrigger && (
          <slots.searchTrigger.sm
            className="size-10 shrink-0 border border-fd-border bg-fd-background/90 backdrop-blur-md"
            size="icon"
            variant="ghost"
          />
        )}
        <SidebarTrigger className="flex size-10 shrink-0 items-center justify-center border border-fd-border bg-fd-background/90 text-fd-muted-foreground backdrop-blur-md transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground">
          <IconMenu2 className="size-4" />
        </SidebarTrigger>
      </div>
    </div>
  );
}
