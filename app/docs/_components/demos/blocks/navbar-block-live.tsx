"use client";

import { IconMenu2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/sensory-ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sensory-ui/sheet";

const links = ["Home", "Features", "Pricing", "Docs"];

export function NavbarBlockLive() {
  return (
    <nav className="flex w-full items-center justify-between rounded-md border px-4 py-3">
      <span className="font-bold text-foreground text-sm">Acme</span>
      <div className="hidden items-center gap-1 sm:flex">
        {links.map((label) => (
          <Button
            asChild
            key={label}
            size="sm"
            sound="navigation.forward"
            variant="ghost"
          >
            <span className="cursor-pointer text-muted-foreground hover:text-foreground">
              {label}
            </span>
          </Button>
        ))}
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            aria-label="Open menu"
            size="icon"
            sound={false}
            variant="ghost"
          >
            <IconMenu2 className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-1 px-2 pt-6">
            {links.map((label) => (
              <Button
                asChild
                className="justify-start"
                key={label}
                sound="navigation.forward"
                variant="ghost"
              >
                <span className="cursor-pointer text-muted-foreground hover:text-foreground">
                  {label}
                </span>
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
