import { GlassLayout } from "fumadocs-ui/layouts/glass";
import type { ReactNode } from "react";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";
import { docsSidebarSlots } from "./_components/docs-sidebar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <GlassLayout
      {...baseOptions()}
      slots={{ sidebar: docsSidebarSlots }}
      tree={source.pageTree}
    >
      {children}
    </GlassLayout>
  );
}
