"use client";

import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/sensory-ui/button";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";

export function CodeCopyBlockLive() {
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

  const code =
    "npx shadcn@latest add SatyamVyas04/sensory-ui/sensory-ui-button";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
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
    <div className="w-full max-w-md overflow-hidden rounded-lg border bg-muted/30 font-mono text-sm">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <code className="truncate text-foreground">{code}</code>
        <Button
          aria-label="Copy install command"
          className="size-8 shrink-0"
          onClick={handleCopy}
          size="icon"
          sound="interaction.tap"
          variant="ghost"
        >
          {copied ? (
            <IconCheck className="size-4 text-green-500" />
          ) : (
            <IconCopy className="size-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
