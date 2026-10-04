"use client";

import { IconX } from "@tabler/icons-react";
import {
  SidebarDrawerContent,
  SidebarDrawerOverlay,
  useSidebar,
} from "fumadocs-ui/components/sidebar/base";
import { useGlassLayout } from "fumadocs-ui/layouts/glass";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DocsDrawerFooter } from "./docs-drawer-footer";
import { SponsorCard, TreeNav } from "./docs-sidebar";

/**
 * Mobile menu sheet (drawer mode only): logo + close header, scrolling
 * tree with full text rows, slim sponsor row, and a 3-cell bottom bar
 * (GitHub | theme | close). Overlay z-40, panel z-40 after it in DOM so
 * it always paints above page chrome (top bar + thumb buttons sit z-30).
 */
export function DocsDrawer() {
  const { slots } = useGlassLayout();
  const { setOpen } = useSidebar();

  return (
    <>
      <SidebarDrawerOverlay className="fixed inset-0 z-40 bg-fd-overlay backdrop-blur-sm data-[state=closed]:animate-fd-fade-out data-[state=open]:animate-fd-fade-in" />
      <SidebarDrawerContent className="fixed inset-y-0 right-0 z-40 flex w-[320px] max-w-[85vw] flex-col border-fd-border border-l bg-fd-background data-[state=closed]:animate-fd-sidebar-out data-[state=open]:animate-fd-sidebar-in">
        <div className="flex h-12 shrink-0 items-center gap-2 border-fd-border border-b px-4">
          <slots.navTitle className="flex min-w-0 flex-1 items-center gap-2.5 font-semibold text-[15px]" />
          <button
            aria-label="Close sidebar"
            className="flex size-8 shrink-0 items-center justify-center border border-fd-border bg-transparent text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
            onClick={() => setOpen(false)}
            type="button"
          >
            <IconX className="size-3.5" />
          </button>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          <div className="p-3 [mask-image:linear-gradient(to_bottom,transparent,white_12px,white_calc(100%-12px),transparent)]">
            <TreeNav />
          </div>
        </ScrollArea>

        <SponsorCard compact />
        <DocsDrawerFooter />
      </SidebarDrawerContent>
    </>
  );
}
