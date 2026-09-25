"use client";

import { IconPlayerPlay, IconPlayerStop } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/sensory-ui/button";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";

const TOTAL = 10;

export function CountdownBlockLive() {
  const [timeLeft, setTimeLeft] = useState(TOTAL);
  const [isRunning, setIsRunning] = useState(false);
  const { playSound } = useSensoryUI();
  const playRef = useRef(playSound);
  playRef.current = playSound;

  const halfway = TOTAL / 2;

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      return;
    }
    const timer = window.setTimeout(() => {
      const next = timeLeft - 1;
      if (next === 0) {
        playRef
          .current("hero.complete", { volume: 0.8 })
          .catch(() => undefined);
        setIsRunning(false);
      } else if (next === halfway) {
        playRef
          .current("hero.milestone", { volume: 0.6 })
          .catch(() => undefined);
      } else {
        playRef
          .current("navigation.tab", { volume: 0.25 })
          .catch(() => undefined);
      }
      setTimeLeft(next);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [isRunning, timeLeft, halfway]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progress = ((TOTAL - timeLeft) / TOTAL) * 100;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative size-40">
        <svg className="size-full -rotate-90" role="img" viewBox="0 0 100 100">
          <title>Countdown progress</title>
          <circle
            className="text-muted"
            cx="50"
            cy="50"
            fill="none"
            r="45"
            stroke="currentColor"
            strokeWidth="4"
          />
          <circle
            className="text-primary transition-all duration-1000"
            cx="50"
            cy="50"
            fill="none"
            r="45"
            stroke="currentColor"
            strokeDasharray={`${progress * 2.83} 283`}
            strokeWidth="4"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-bold font-mono text-2xl">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>
      <div className="flex gap-3">
        <Button
          className="gap-2"
          onClick={() => {
            if (timeLeft === 0) {
              setTimeLeft(TOTAL);
            }
            setIsRunning(!isRunning);
          }}
          sound={isRunning ? "interaction.tap" : "interaction.confirm"}
        >
          {isRunning ? (
            <>
              <IconPlayerStop className="size-4" />
              Pause
            </>
          ) : (
            <>
              <IconPlayerPlay className="size-4" />
              Start
            </>
          )}
        </Button>
        <Button
          onClick={() => {
            setTimeLeft(TOTAL);
            setIsRunning(false);
          }}
          sound="interaction.tap"
          variant="outline"
        >
          Reset
        </Button>
      </div>
      <p className="text-muted-foreground text-xs">
        10-second demo — a tick every second, milestone at half, fanfare at
        zero.
      </p>
    </div>
  );
}
