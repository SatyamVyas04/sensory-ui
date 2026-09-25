"use client";

import confetti from "canvas-confetti";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/sensory-ui/button";

const CONFETTI_COLORS = ["#fb7185", "#fbbf24", "#ffffff", "#e11d48"];

export function ConfettiBlockLive() {
  const [fired, setFired] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) {
        window.clearTimeout(timer.current);
      }
    },
    []
  );

  const handleCelebrate = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const origin = {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      };
      confetti({
        particleCount: 90,
        spread: 75,
        origin,
        colors: CONFETTI_COLORS,
      });
      timer.current = window.setTimeout(() => {
        confetti({
          particleCount: 40,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.7 },
          colors: CONFETTI_COLORS,
        });
        confetti({
          particleCount: 40,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.7 },
          colors: CONFETTI_COLORS,
        });
      }, 250);
      setFired(true);
    },
    []
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        className="gap-2 text-lg"
        onClick={handleCelebrate}
        sound="hero.complete"
      >
        Celebrate!
      </Button>
      <p className="text-muted-foreground text-xs">
        {fired
          ? "Fanfare plus a canvas-confetti cannon — fire away."
          : "Real confetti via canvas-confetti, fired from the button."}
      </p>
    </div>
  );
}
