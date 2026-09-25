"use client";

import { Button } from "@/components/ui/sensory-ui/button";

export function ButtonDocsDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button>Default tap</Button>
      <Button sound="interaction.confirm">Confirm</Button>
      <Button sound="interaction.subtle" variant="secondary">
        Subtle
      </Button>
      <Button sound="notification.warning" variant="destructive">
        Delete
      </Button>
      <Button sound="navigation.forward" variant="outline">
        Next
      </Button>
      <Button sound={false} variant="ghost">
        Silent
      </Button>
    </div>
  );
}
