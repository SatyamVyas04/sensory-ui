"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MotionStatusDotProps {
  /** Whether the OS/browser prefers-reduced-motion setting is active. */
  reducedMotion: boolean;
}

/**
 * A small gradient circle that shows the current system motion preference.
 *
 * - Green  → motion enabled, sounds will play.
 * - Red    → prefers-reduced-motion is on, sounds are silenced.
 *
 * Hovering reveals a tooltip with a plain-language explanation and, for the
 * red state, a link to learn more about the system setting.
 */
export function MotionStatusDot({ reducedMotion }: MotionStatusDotProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            aria-label={
              reducedMotion
                ? "Reduced motion is on — sounds are silenced"
                : "Motion enabled — sounds are active"
            }
            className={`inline-block size-2 cursor-default rounded-full ${
              reducedMotion
                ? "bg-gradient-to-br from-red-400 to-red-600"
                : "bg-gradient-to-br from-green-400 to-green-600"
            }`}
            role="img"
          />
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={6}>
          {reducedMotion ? (
            <span>
              Your system has{" "}
              <strong className="font-semibold">prefers-reduced-motion</strong>{" "}
              on — sounds are silenced.{" "}
              <a
                className="underline underline-offset-2 hover:opacity-80"
                href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion"
                rel="noopener noreferrer"
                target="_blank"
              >
                Learn more ↗
              </a>
            </span>
          ) : (
            <span>Your system has motion enabled — sounds will play.</span>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
