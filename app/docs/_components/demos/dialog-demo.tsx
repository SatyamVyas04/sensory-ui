"use client";

import { Button } from "@/components/ui/sensory-ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/sensory-ui/dialog";

export function DialogDocsDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Open / close pair</DialogTitle>
          <DialogDescription>
            Opening plays `overlay.open`, closing plays `overlay.close`.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
