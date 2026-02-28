"use client";

import {
  IconAlertTriangle,
  IconBell,
  IconCircleCheck,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/sensory-ui/button";
import { DemoCard, SoundTrigger } from "./demo-card";

export function NotificationsDemo() {
  return (
    <DemoCard
      description="Toast notifications with sound"
      icon={<IconBell className="size-4" />}
      title="Notifications"
    >
      <div className="flex flex-col gap-3">
        <SoundTrigger soundRole="notifications.passive">
          <Button
            className="w-full justify-start gap-2"
            onClick={() =>
              toast.info("System Update Available", {
                description: "A new version is ready to install.",
              })
            }
            size="sm"
            sound="notifications.passive"
            variant="outline"
          >
            <IconInfoCircle className="size-4 text-blue-500" />
            Info Toast
          </Button>
        </SoundTrigger>
        <SoundTrigger soundRole="notifications.success">
          <Button
            className="w-full justify-start gap-2"
            onClick={() =>
              toast.success("Changes Saved", {
                description: "Your preferences have been updated.",
              })
            }
            size="sm"
            sound="notifications.success"
            variant="outline"
          >
            <IconCircleCheck className="size-4 text-green-500" />
            Success Toast
          </Button>
        </SoundTrigger>
        <SoundTrigger soundRole="notifications.warning">
          <Button
            className="w-full justify-start gap-2"
            onClick={() =>
              toast.warning("Storage Almost Full", {
                description: "You're using 95% of available storage.",
              })
            }
            size="sm"
            sound="notifications.warning"
            variant="outline"
          >
            <IconAlertTriangle className="size-4 text-amber-500" />
            Warning Toast
          </Button>
        </SoundTrigger>
        <SoundTrigger soundRole="notifications.error">
          <Button
            className="w-full justify-start gap-2"
            onClick={() =>
              toast.error("Connection Failed", {
                description: "Unable to connect. Please try again.",
              })
            }
            size="sm"
            sound="notifications.error"
            variant="outline"
          >
            <IconX className="size-4 text-red-500" />
            Error Toast
          </Button>
        </SoundTrigger>
      </div>
    </DemoCard>
  );
}
