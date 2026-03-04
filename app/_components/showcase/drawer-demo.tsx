"use client";

import { IconLayoutBottombar } from "@tabler/icons-react";
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
import { DemoCard } from "./demo-card";

export function DrawerDemo() {
  return (
    <DemoCard
      description="Slide up a bottom drawer"
      icon={<IconLayoutBottombar className="size-4" />}
      soundRoles={["overlay.open", "overlay.close"]}
      title="Drawer"
    >
      <Drawer>
        <DrawerTrigger asChild>
          <Button className="w-full" size="sm" variant="outline">
            Open Drawer
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Sensory Drawer</DrawerTitle>
            <DrawerDescription>
              This drawer played overlay.open when it appeared. Close it to hear
              overlay.close.
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
    </DemoCard>
  );
}
