"use client";

import { IconCheck, IconTerminal } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/sensory-ui/button";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";

export function InstallCommandBlockLive() {
  const [copied, setCopied] = useState(false);
  const { playSound } = useSensoryUI();
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) {
        window.clearTimeout(timer.current);
      }
    },
    []
  );

  const command =
    "npx shadcn@latest add SatyamVyas04/sensory-ui/sensory-ui-button";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      playSound("notification.success").catch(() => undefined);
    } catch {
      playSound("notification.error").catch(() => undefined);
    }
    if (timer.current) {
      window.clearTimeout(timer.current);
    }
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex w-full max-w-md items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3 font-mono text-xs">
      <IconTerminal className="size-4 shrink-0 text-muted-foreground" />
      <span className="flex-1 truncate text-foreground">{command}</span>
      <Button
        className="shrink-0 gap-1.5"
        onClick={handleCopy}
        size="sm"
        sound="interaction.tap"
        variant="ghost"
      >
        {copied ? (
          <>
            <IconCheck className="size-3.5" />
            Copied
          </>
        ) : (
          "Copy"
        )}
      </Button>
    </div>
  );
}
