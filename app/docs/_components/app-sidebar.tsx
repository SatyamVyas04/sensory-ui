"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  IconBook,
  IconStack2,
  IconPuzzle,
  IconSettings,
  IconFileText,
  IconSearch,
  IconChevronRight,
  IconHeart,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  url: string;
  icon: React.ReactNode;
  items?: {
    title: string;
    url: string;
  }[];
}

const navigation: NavItem[] = [
  {
    title: "Getting Started",
    url: "/docs/getting-started",
    icon: <IconBook className="size-4" />,
    items: [
      { title: "Installation", url: "/docs/getting-started/installation" },
      { title: "Configuration", url: "/docs/getting-started/configuration" },
    ],
  },
  {
    title: "Concepts",
    url: "/docs/concepts",
    icon: <IconStack2 className="size-4" />,
    items: [
      { title: "Overview", url: "/docs/concepts/overview" },
      { title: "Sound Roles", url: "/docs/concepts/sound-roles" },
      { title: "Sound Packs", url: "/docs/concepts/sound-packs" },
      { title: "Engine", url: "/docs/concepts/engine" },
      { title: "Provider", url: "/docs/concepts/provider" },
    ],
  },
  {
    title: "Components",
    url: "/docs/components",
    icon: <IconPuzzle className="size-4" />,
    items: [
      { title: "Overview", url: "/docs/components" },
      { title: "Accordion", url: "/docs/components/accordion" },
      { title: "Alert Dialog", url: "/docs/components/alert-dialog" },
      { title: "Button", url: "/docs/components/button" },
      { title: "Carousel", url: "/docs/components/carousel" },
      { title: "Checkbox", url: "/docs/components/checkbox" },
      { title: "Collapsible", url: "/docs/components/collapsible" },
      { title: "Command", url: "/docs/components/command" },
      { title: "Context Menu", url: "/docs/components/context-menu" },
      { title: "Dialog", url: "/docs/components/dialog" },
      { title: "Drawer", url: "/docs/components/drawer" },
      { title: "Dropdown Menu", url: "/docs/components/dropdown-menu" },
      { title: "Menubar", url: "/docs/components/menubar" },
      { title: "Navigation Menu", url: "/docs/components/navigation-menu" },
      { title: "Pagination", url: "/docs/components/pagination" },
      { title: "Popover", url: "/docs/components/popover" },
      { title: "Radio Group", url: "/docs/components/radio-group" },
      { title: "Select", url: "/docs/components/select" },
      { title: "Sheet", url: "/docs/components/sheet" },
      { title: "Sidebar", url: "/docs/components/sidebar" },
      { title: "Slider", url: "/docs/components/slider" },
      { title: "Switch", url: "/docs/components/switch" },
      { title: "Tabs", url: "/docs/components/tabs" },
      { title: "Toggle", url: "/docs/components/toggle" },
      { title: "Toggle Group", url: "/docs/components/toggle-group" },
    ],
  },
  {
    title: "Guides",
    url: "/docs/guides",
    icon: <IconFileText className="size-4" />,
    items: [
      { title: "Custom Sounds", url: "/docs/guides/custom-sounds" },
      { title: "Accessibility", url: "/docs/guides/accessibility" },
    ],
  },
  {
    title: "Registry",
    url: "/docs/registry",
    icon: <IconSettings className="size-4" />,
  },
  {
    title: "Testing",
    url: "/docs/testing",
    icon: <IconSearch className="size-4" />,
  },
];

const ALWAYS_OPEN = ["Getting Started", "Concepts", "Guides"];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="bg-transparent hover:bg-accent/10 active:bg-accent/20"
            >
              <Link href="/">
                <Image
                  alt=""
                  aria-hidden="true"
                  className="size-8 rounded-full"
                  height={256}
                  src="/sensory-ui-logo-small.png"
                  width={256}
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-foreground">
                    sensory-ui
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    Documentation
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navigation.map((item) => {
              const isAlwaysOpen = ALWAYS_OPEN.includes(item.title);
              const isExpanded =
                isAlwaysOpen ||
                (item.items?.some((sub) => pathname === sub.url) ?? false);
              const isActive =
                pathname === item.url ||
                item.items?.some((sub) => pathname === sub.url);

              return (
                <Collapsible
                  key={item.title}
                  defaultOpen={isExpanded}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    {item.items?.length ? (
                      <>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            isActive={isActive}
                            className="bg-transparent! hover:bg-accent/10! active:bg-accent/20! text-foreground!"
                          >
                            {item.icon}
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <SidebarMenuAction className="pointer-events-none">
                          <IconChevronRight className="text-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          <span className="sr-only">Toggle</span>
                        </SidebarMenuAction>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.url}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === subItem.url}
                                  className={cn(
                                    "bg-transparent hover:bg-accent/10 active:bg-accent/20 hover:text-foreground!",
                                    pathname === subItem.url && "text-primary!"
                                  )}
                                >
                                  <Link href={subItem.url}>
                                    <div className="flex items-center gap-2">
                                      <div
                                        className={cn(
                                          "size-2 bg-primary rounded-full",
                                          pathname === subItem.url
                                            ? "block"
                                            : "hidden"
                                        )}
                                      />
                                      <span
                                        className={
                                          pathname === subItem.url
                                            ? "text-primary!"
                                            : "text-foreground!"
                                        }
                                      >
                                        {subItem.title}
                                      </span>
                                    </div>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    ) : (
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={cn(
                          "bg-transparent! hover:bg-accent/10! active:bg-accent/20! text-foreground!",
                          isActive && "text-primary!"
                        )}
                      >
                        <Link href={item.url}>
                          {item.icon}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="group h-auto w-full border border-pink-200 bg-pink-50/60 py-2.5 transition-colors hover:border-pink-300 hover:bg-pink-50 dark:border-pink-900/40 dark:bg-pink-950/20 dark:hover:border-pink-800 dark:hover:bg-pink-950/30"
            >
              <Link
                href="https://github.com/sponsors/SatyamVyas04"
                rel="noopener noreferrer"
                target="_blank"
                className="flex w-full items-center gap-2.5 px-1"
              >
                <IconHeart className="size-4 shrink-0 fill-pink-500 text-pink-500 transition-transform group-hover:scale-110" />
                <span className="text-left text-xs leading-snug text-balance text-foreground/80">
                  Love this project?{" "}
                  <span className="font-medium text-foreground">
                    Sponsor it
                  </span>
                </span>
              </Link>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
