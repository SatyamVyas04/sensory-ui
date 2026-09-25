"use client";

import { IconHeart } from "@tabler/icons-react";
import {
  Sidebar as GlassSidebar,
  SidebarDrawer,
  SidebarProvider,
  useSidebar,
} from "fumadocs-ui/layouts/glass/slots/sidebar";

export const docsSidebarSlots = {
  drawer: SidebarDrawer,
  main: DocsSidebar,
  provider: SidebarProvider,
  use: useSidebar,
};

export function SponsorCard() {
  return (
    <div className="px-2 pt-1 pb-3">
      <a
        className="group flex flex-col items-center gap-2 rounded-xl border border-pink-200 bg-pink-50/60 px-2 py-4 text-center transition-colors hover:border-pink-300 hover:bg-pink-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-pink-500 focus-visible:outline-offset-2 dark:border-pink-900/40 dark:bg-pink-950/20 dark:hover:border-pink-800 dark:hover:bg-pink-950/30"
        href="https://github.com/sponsors/SatyamVyas04"
        rel="noopener noreferrer"
        target="_blank"
      >
        <IconHeart className="size-5 fill-pink-500 text-pink-500 transition-transform duration-300 group-hover:scale-110" />
        <span className="font-semibold text-fd-foreground text-sm">
          Sponsor sensory-ui
        </span>
        <span className="text-balance text-fd-muted-foreground text-xs leading-snug">
          Free & Open-Source, Forever.
        </span>
      </a>
    </div>
  );
}

export default SponsorCard;

export function DocsSidebar(props: React.ComponentProps<typeof GlassSidebar>) {
  return (
    <GlassSidebar {...props}>
      <SponsorCard />
    </GlassSidebar>
  );
}
