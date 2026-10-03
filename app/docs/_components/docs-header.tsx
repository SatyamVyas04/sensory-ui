"use client";

import {
  IconBrandGithub,
  IconDeviceDesktop,
  IconLayoutSidebar,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";
import { useSidebar } from "fumadocs-ui/components/sidebar/base";
import { useGlassLayout } from "fumadocs-ui/layouts/glass";
import type { HeaderProps } from "fumadocs-ui/layouts/glass/slots/header";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Docs", href: "/docs" },
  { label: "Components", href: "/docs/components" },
  { label: "Blocks", href: "/docs/blocks" },
];

const THEME_ORDER = ["system", "light", "dark"];

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

/**
 * Minimal docs navbar inspired by the homepage hero header: logo left,
 * ghost text links on desktop, compact icon actions right. Replaces the
 * stock glass floating pills. Everything is sharp (rounded-none) and slim
 * (h-14, size-8 targets).
 */
export function DocsHeader({ className, ...props }: HeaderProps) {
  const { slots } = useGlassLayout();
  const { theme, setTheme } = useTheme();
  const { open, setOpen, setCollapsed } = useSidebar();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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

  // Default to System pre-mount so server HTML and hydration match.
  const effectiveTheme = mounted ? (theme ?? "system") : "system";
  const nextTheme =
    THEME_ORDER[(THEME_ORDER.indexOf(effectiveTheme) + 1) % THEME_ORDER.length];
  const THEME_ICONS: Record<string, typeof IconSun> = {
    light: IconSun,
    dark: IconMoon,
    system: IconDeviceDesktop,
  };
  const ThemeIcon = THEME_ICONS[effectiveTheme] ?? IconDeviceDesktop;

  function toggleSidebar() {
    if (window.matchMedia("(max-width: 767px)").matches) {
      setOpen((v) => !v);
    } else {
      setCollapsed((v) => !v);
    }
  }

  return (
    <div
      className={cn(
        "sticky top-0 z-40 flex h-14 items-center justify-between gap-2 border-fd-border border-b bg-fd-background/85 px-4 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              aria-expanded={open}
              aria-label="Toggle sidebar"
              className="flex size-8 shrink-0 items-center justify-center rounded-none text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
              onClick={toggleSidebar}
              type="button"
            >
              <IconLayoutSidebar className="size-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            Toggle sidebar
            <kbd data-slot="kbd">Ctrl</kbd>
            <kbd data-slot="kbd">/</kbd>
          </TooltipContent>
        </Tooltip>
        <Link
          className="flex items-center gap-2 font-semibold text-sm"
          href="/"
        >
          <Image
            alt="sensory-ui"
            className="size-6 rounded-full"
            height={24}
            src="/sensory-ui-logo-small.svg"
            width={24}
          />
          <span>sensory-ui</span>
        </Link>
        <nav
          aria-label="Docs sections"
          className="ml-3 hidden items-center gap-1 md:flex"
        >
          {NAV_LINKS.map((item) => (
            <Link
              className="rounded-none px-2.5 py-1.5 text-fd-muted-foreground text-sm transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {slots.searchTrigger && (
          <>
            <slots.searchTrigger.sm
              className="size-8 rounded-none md:hidden"
              size="icon"
              variant="ghost"
            />
            <slots.searchTrigger.full className="hidden h-8 w-44 rounded-none border-fd-border bg-transparent text-xs md:inline-flex lg:w-56" />
          </>
        )}
        <button
          aria-label={`Switch to ${nextTheme} theme`}
          className="flex size-8 items-center justify-center rounded-none text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
          onClick={() => setTheme(nextTheme)}
          type="button"
        >
          <ThemeIcon className="size-4" />
        </button>
        <Link
          aria-label="GitHub"
          className="hidden size-8 items-center justify-center rounded-none text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground sm:flex"
          href="https://github.com/SatyamVyas04/sensory-ui"
          rel="noopener noreferrer"
          target="_blank"
        >
          <IconBrandGithub className="size-4" />
        </Link>
      </div>
    </div>
  );
}
