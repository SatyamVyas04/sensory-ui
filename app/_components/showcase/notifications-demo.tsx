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
      description="Semantic toast notifications with sound"
      icon={<IconBell className="size-4" />}
      title="Notifications"
    >
      <div className="flex flex-col gap-2.5">
        <SoundTrigger soundRole="notifications.passive">
          <Button
            className="w-full justify-start gap-2 border-blue-500/30 bg-blue-500/5 text-blue-600 hover:bg-blue-500/10 dark:text-blue-400"
            onClick={() =>
              toast.info("System Update Available", {
                description: "A new version is ready to install.",
                icon: <IconInfoCircle className="size-4" />,
              })
            }
            size="sm"
            sound="notifications.passive"
            variant="outline"
          >
            <IconInfoCircle className="size-4" />
            Info
          </Button>
        </SoundTrigger>
        <SoundTrigger soundRole="notifications.success">
          <Button
            className="w-full justify-start gap-2 border-green-500/30 bg-green-500/5 text-green-600 hover:bg-green-500/10 dark:text-green-400"
            onClick={() =>
              toast.success("Changes Saved", {
                description: "Your preferences have been updated successfully.",
                icon: <IconCircleCheck className="size-4" />,
              })
            }
            size="sm"
            sound="notifications.success"
            variant="outline"
          >
            <IconCircleCheck className="size-4" />
            Success
          </Button>
        </SoundTrigger>
        <SoundTrigger soundRole="notifications.warning">
          <Button
            className="w-full justify-start gap-2 border-amber-500/30 bg-amber-500/5 text-amber-600 hover:bg-amber-500/10 dark:text-amber-400"
            onClick={() =>
              toast.warning("Storage Almost Full", {
                description: "You're using 95% of your available storage.",
                icon: <IconAlertTriangle className="size-4" />,
              })
            }
            size="sm"
            sound="notifications.warning"
            variant="outline"
          >
            <IconAlertTriangle className="size-4" />
            Warning
          </Button>
        </SoundTrigger>
        <SoundTrigger soundRole="notifications.important">
          <Button
            className="w-full justify-start gap-2 border-red-500/30 bg-red-500/5 text-red-600 hover:bg-red-500/10 dark:text-red-400"
            onClick={() =>
              toast.error("Connection Failed", {
                description:
                  "Unable to connect to the server. Please try again.",
                icon: <IconX className="size-4" />,
              })
            }
            size="sm"
            sound="notifications.important"
            variant="outline"
          >
            <IconX className="size-4" />
            Error
          </Button>
        </SoundTrigger>
      </div>
    </DemoCard>
  );
}
