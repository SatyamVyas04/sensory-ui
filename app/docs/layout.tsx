import { GlassLayout } from "fumadocs-ui/layouts/glass";
import type { ReactNode } from "react";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";
import { DocsHeader } from "./_components/docs-header";
import { docsSidebarSlots } from "./_components/docs-sidebar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="docs-sharp contents">
      <GlassLayout
        {...baseOptions()}
        slots={{
          sidebar: docsSidebarSlots,
          header: DocsHeader,
        }}
        tree={source.pageTree}
      >
        {children}
      </GlassLayout>
    </div>
  );
}
