"use client";

import { IconCheck, IconLoader2 } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/sensory-ui/button";

export function LoadingCtaBlockLive() {
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      for (const t of timers.current) {
        window.clearTimeout(t);
      }
    },
    []
  );

  const handleClick = () => {
    setState("loading");
    timers.current.push(
      window.setTimeout(() => {
        setState("success");
        timers.current.push(window.setTimeout(() => setState("idle"), 2000));
      }, 1500)
    );
  };

  return (
    <Button
      className="gap-2"
      disabled={state === "loading"}
      onClick={handleClick}
      sound={state === "success" ? "notification.success" : "interaction.tap"}
    >
      {state === "idle" && "Save changes"}
      {state === "loading" && (
        <>
          <IconLoader2 className="size-4 animate-spin" />
          Saving...
        </>
      )}
      {state === "success" && (
        <>
          <IconCheck className="size-4" />
          Saved!
        </>
      )}
    </Button>
  );
}
