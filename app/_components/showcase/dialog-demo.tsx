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
      <SoundTrigger soundRole="system.open / system.close">
        <Dialog closeSound="system.close" sound="system.open">
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              Open Dialog
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sensory Dialog</DialogTitle>
              <DialogDescription>
                This dialog played <code>system.open</code> when it appeared.
                Close it to hear <code>system.close</code>.
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
