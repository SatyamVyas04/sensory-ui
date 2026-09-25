"use client";

import { Button } from "@/components/ui/sensory-ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/sensory-ui/drawer";

export function DrawerDocsDemo() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent className="mx-auto max-w-sm">
        <DrawerHeader>
          <DrawerTitle>Bottom sheet</DrawerTitle>
          <DrawerDescription>
            Slides up with `overlay.open`, away with `overlay.close`.
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
