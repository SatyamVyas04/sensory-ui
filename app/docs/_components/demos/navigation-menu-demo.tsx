"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/sensory-ui/navigation-menu";

function DeadLink({ children }: { children: React.ReactNode }) {
  return (
    <NavigationMenuLink
      className="rounded-md px-3 py-2 text-sm hover:bg-accent"
      href="#"
      onClick={(e) => e.preventDefault()}
    >
      {children}
    </NavigationMenuLink>
  );
}

export function NavigationMenuDocsDemo() {
  return (
    <div className="flex min-h-56 w-full items-start justify-center pt-1">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Docs</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-56 gap-1 p-2">
                <DeadLink>Installation</DeadLink>
                <DeadLink>Sound roles</DeadLink>
                <DeadLink>Components</DeadLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className="inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm"
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              Pricing
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
