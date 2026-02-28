"use client";

import { IconWindowMaximize } from "@tabler/icons-react";
import { Button } from "@/components/ui/sensory-ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/sensory-ui/dialog";
import { DemoCard, SoundTrigger } from "./demo-card";

export function DialogDemo() {
  return (
    <DemoCard
      description="Open & close to trigger system sounds"
      icon={<IconWindowMaximize className="size-4" />}
      title="Dialog"
    >
      <SoundTrigger soundRole="system.open / close">
        <Dialog closeSound="system.close" sound="system.open">
          <DialogTrigger asChild>
            <Button className="w-full" size="sm" variant="outline">
              Open Dialog
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sensory Dialog</DialogTitle>
              <DialogDescription>
                This dialog played system.open when it appeared. Close it to
                hear system.close.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter showCloseButton>
              <Button size="sm" sound="activation.confirm">
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SoundTrigger>
    </DemoCard>
  );
}
