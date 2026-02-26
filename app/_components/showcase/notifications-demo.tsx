"use client";

import { IconBell } from "@tabler/icons-react";
import { Button } from "@/components/ui/sensory-ui/button";
import { DemoCard, SoundTrigger } from "./demo-card";

export function NotificationsDemo() {
  return (
    <DemoCard
      description="Click to hear each notification tone"
      icon={<IconBell className="size-4" />}
      title="Notifications"
    >
      <div className="flex flex-wrap gap-x-3 gap-y-4">
        <SoundTrigger soundRole="notifications.passive">
          <Button size="sm" sound="notifications.passive" variant="outline">
            Passive
          </Button>
        </SoundTrigger>
        <SoundTrigger soundRole="notifications.important">
          <Button size="sm" sound="notifications.important" variant="outline">
            Important
          </Button>
        </SoundTrigger>
        <SoundTrigger soundRole="notifications.success">
          <Button size="sm" sound="notifications.success" variant="secondary">
            Success
          </Button>
        </SoundTrigger>
        <SoundTrigger soundRole="notifications.warning">
          <Button size="sm" sound="notifications.warning" variant="destructive">
            Warning
          </Button>
        </SoundTrigger>
      </div>
    </DemoCard>
  );
}
