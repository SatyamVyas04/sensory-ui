"use client";

import { Button } from "@/components/ui/sensory-ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sensory-ui/sheet";

export function SheetDocsDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Open sheet</Button>
        </SheetTrigger>
        <SheetContent className="sm:max-w-xs">
          <SheetHeader>
            <SheetTitle>Default pair</SheetTitle>
            <SheetDescription>
              `overlay.open` in, `overlay.close` out.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <Sheet closeSound="interaction.subtle">
        <SheetTrigger asChild>
          <Button variant="ghost">Soft close</Button>
        </SheetTrigger>
        <SheetContent className="sm:max-w-xs" side="left">
          <SheetHeader>
            <SheetTitle>Custom close</SheetTitle>
            <SheetDescription>Same open, lighter close.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}
