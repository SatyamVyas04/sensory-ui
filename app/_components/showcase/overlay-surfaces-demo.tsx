"use client";

import { IconStack2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/sensory-ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/sensory-ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/sensory-ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/sensory-ui/select";
import { Separator } from "@/components/ui/separator";
import { DemoCard } from "./demo-card";

export function OverlaySurfacesDemo() {
  return (
    <DemoCard
      description="Open & close overlays to hear the sound pair"
      icon={<IconStack2 className="size-4" />}
      title="Overlay Surfaces"
    >
      <div className="flex flex-col gap-4">
        {/* Drawer */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] text-muted-foreground/70 uppercase tracking-widest">
            Drawer
          </span>
          <Drawer>
            <DrawerTrigger asChild>
              <Button className="w-full" size="sm" variant="outline">
                Open Drawer
              </Button>
            </DrawerTrigger>
            <DrawerContent className="min-h-1/2">
              <DrawerHeader>
                <DrawerTitle>Sensory Drawer</DrawerTitle>
                <DrawerDescription>
                  This drawer played overlay.open when it appeared.
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button size="sm" variant="outline">
                    Close
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>

        <Separator />

        {/* Dropdown Menu */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] text-muted-foreground/70 uppercase tracking-widest">
            Dropdown
          </span>
          <DropdownMenu closeSound="overlay.close" sound="overlay.open">
            <DropdownMenuTrigger asChild>
              <Button className="w-full" size="sm" variant="outline">
                Open Menu
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Option one</DropdownMenuItem>
              <DropdownMenuItem>Option two</DropdownMenuItem>
              <DropdownMenuItem>Option three</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Separator />

        {/* Select */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] text-muted-foreground/70 uppercase tracking-widest">
            Select
          </span>
          <Select closeSound="overlay.close" sound="overlay.open">
            <SelectTrigger
              aria-label="Select option"
              className="h-8 w-full text-xs"
            >
              <SelectValue placeholder="Choose an option…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="soft">soft</SelectItem>
              <SelectItem value="aero">aero</SelectItem>
              <SelectItem value="arcade">arcade</SelectItem>
              <SelectItem value="retro">retro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </DemoCard>
  );
}
