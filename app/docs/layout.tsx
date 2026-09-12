import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";
import { DocsTopbar } from "./_components/docs-topbar";

async function getStars(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/SatyamVyas04/sensory-ui",
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return (data.stargazers_count as number) ?? 0;
  } catch {
    return null;
  }
}

export const metadata = {
  title: {
    template: "%s - sensory-ui",
    default: "Documentation - sensory-ui",
  },
  description:
    "Documentation for sensory-ui - semantic sound for shadcn/ui components.",
};

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const stars = await getStars();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DocsTopbar stars={stars} />
        <main className="flex-1 overflow-y-auto">
          <article className="mx-auto max-w-3xl px-6 py-10 lg:px-8">
            {children}
          </article>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
