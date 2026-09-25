"use client";

import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/sensory-ui/button";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";

export function MultilineCodeBlockLive() {
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

  const code = `import { Button } from "@/components/ui/sensory-ui/button";

export function SaveButton() {
  return (
    <Button sound="interaction.confirm" onClick={handleSave}>
      Save
    </Button>
  );
}`;

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
    <div className="w-full max-w-md overflow-hidden rounded-lg border">
      <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2">
        <span className="font-mono text-muted-foreground text-xs">
          button.tsx
        </span>
        <Button
          aria-label="Copy code"
          className="size-7"
          onClick={handleCopy}
          size="icon"
          sound="interaction.tap"
          variant="ghost"
        >
          {copied ? (
            <IconCheck className="size-3.5 text-green-500" />
          ) : (
            <IconCopy className="size-3.5" />
          )}
        </Button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
