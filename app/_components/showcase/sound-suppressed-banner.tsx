"use client";

import { IconAlertTriangle, IconVolume3 } from "@tabler/icons-react";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";

/**
 * Renders a contextual banner inside the showcase when sounds cannot be heard.
 *
 * Reasons surfaced:
 *  1. `prefers-reduced-motion: reduce` is active in the OS / browser — the
 *     most common silent culprit for users who never touch a mute button.
 *  2. The provider is explicitly disabled (`config.enabled = false`).
 *  3. The user has manually muted sounds.
 *
 * The banner is hidden when `enabled === true` (sounds are playing normally).
 */
export function SoundSuppressedBanner() {
  const { enabled, muted, reducedMotion } = useSensoryUI();

  // Nothing to surface when sounds are playing.
  if (enabled) {
    return null;
  }

  return (
    <output
      aria-live="polite"
      className="mb-6 flex flex-col gap-3 border border-amber-500/40 bg-amber-500/5 px-4 py-3 text-sm"
    >
      <div className="flex items-center gap-2 font-medium text-amber-600 dark:text-amber-400">
        <IconVolume3 aria-hidden="true" className="size-4 shrink-0" />
        <span>Sounds are currently silenced</span>
      </div>

      {reducedMotion && <ReducedMotionReason />}

      {muted && !reducedMotion && (
        <p className="text-muted-foreground text-xs">
          You have manually muted the sound system. Unmute via the mute toggle
          to restore audio feedback.
        </p>
      )}

      {!(reducedMotion || muted) && (
        <p className="text-muted-foreground text-xs">
          The sound provider is disabled in the current configuration (
          <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[10px]">
            enabled: false
          </code>
          ). Pass{" "}
          <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[10px]">
            config={"{{ enabled: true }}"}
          </code>{" "}
          to{" "}
          <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[10px]">
            &lt;SensoryUIProvider&gt;
          </code>{" "}
          to re-enable it.
        </p>
      )}
    </output>
  );
}

/**
 * Detailed reason block + debug steps for the `prefers-reduced-motion` case.
 * This is the most common reason users report no sound.
 */
function ReducedMotionReason() {
  return (
    <div className="space-y-3 text-muted-foreground text-xs">
      <p>
        <strong className="font-medium text-foreground">
          Cause:{" "}
          <code className="font-mono">prefers-reduced-motion: reduce</code>
        </strong>{" "}
        is active. sensory-ui respects this OS/browser accessibility preference
        and silences all sounds by default.
      </p>

      {/* Debug steps */}
      <div className="space-y-2">
        <p className="flex items-center gap-1.5 font-medium text-foreground">
          <IconAlertTriangle
            aria-hidden="true"
            className="size-3.5 text-amber-500"
          />
          How to verify &amp; disable
        </p>
        <ol className="ml-4 list-decimal space-y-1.5 marker:text-muted-foreground/60">
          <li>
            <strong className="text-foreground">
              Check in your browser console
            </strong>{" "}
            — open DevTools (
            <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
              F12
            </kbd>
            ) and run:
            <pre className="mt-1 overflow-x-auto rounded-sm bg-muted px-2 py-1 font-mono text-[10px] leading-relaxed">
              {"window.matchMedia('(prefers-reduced-motion: reduce)').matches"}
            </pre>
            If this returns{" "}
            <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[10px]">
              true
            </code>
            , reduced motion is the cause.
          </li>
          <li>
            <strong className="text-foreground">Disable in your OS</strong>
            <ul className="mt-1 ml-4 list-disc space-y-1">
              <li>
                <strong>macOS</strong> — System Settings → Accessibility →
                Display → uncheck <em>Reduce Motion</em>
              </li>
              <li>
                <strong>Windows</strong> — Settings → Ease of Access → Display →
                toggle off <em>Show animations in Windows</em>
              </li>
              <li>
                <strong>iOS / iPadOS</strong> — Settings → Accessibility →
                Motion → toggle off <em>Reduce Motion</em>
              </li>
              <li>
                <strong>Android</strong> — Settings → Accessibility → Visibility
                enhancements → toggle off <em>Remove animations</em>
              </li>
            </ul>
          </li>
          <li>
            <strong className="text-foreground">
              Override programmatically
            </strong>{" "}
            — if you intentionally want sounds regardless of the user's
            preference, pass{" "}
            <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[10px]">
              reducedMotion: &quot;force-on&quot;
            </code>{" "}
            to{" "}
            <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[10px]">
              {'<SensoryUIProvider config={{ reducedMotion: "force-on" }}>'}
            </code>
            . Use sparingly — this overrides an explicit accessibility choice.
          </li>
        </ol>
      </div>

      {/* Other common browser causes */}
      <details className="group">
        <summary className="cursor-pointer select-none font-medium text-foreground hover:underline">
          Other common reasons sounds don't play in browsers
        </summary>
        <ol className="mt-2 ml-4 list-decimal space-y-1.5 marker:text-muted-foreground/60">
          <li>
            <strong className="text-foreground">
              Autoplay / AudioContext policy
            </strong>{" "}
            — Chromium, Firefox and Safari all require a user gesture (click,
            tap, keypress) before an{" "}
            <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[10px]">
              AudioContext
            </code>{" "}
            can start. The context is created in a{" "}
            <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[10px]">
              suspended
            </code>{" "}
            state and is resumed automatically on the first interaction. Confirm
            in DevTools:
            <pre className="mt-1 overflow-x-auto rounded-sm bg-muted px-2 py-1 font-mono text-[10px] leading-relaxed">
              {
                "// Run AFTER clicking something on the page\nnew AudioContext().state // should be 'running'"
              }
            </pre>
          </li>
          <li>
            <strong className="text-foreground">System volume / mute</strong> —
            the OS volume may be at zero or the device is in silent mode (check
            the physical mute switch on iOS).
          </li>
          <li>
            <strong className="text-foreground">Browser tab muted</strong> —
            right-click the browser tab and ensure <em>Mute Site</em> is not
            active.
          </li>
          <li>
            <strong className="text-foreground">
              Safari — requires user interaction on page load
            </strong>{" "}
            — unlike Chromium, Safari never auto-resumes a suspended{" "}
            <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[10px]">
              AudioContext
            </code>
            . sensory-ui resumes it on the first sound trigger, so the very
            first sound after page load may silently fail. A second interaction
            will work. You can work around this by adding a &quot;click to
            enable sound&quot; overlay.
          </li>
          <li>
            <strong className="text-foreground">Category disabled</strong> — the
            relevant sound category (
            <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[10px]">
              interaction
            </code>
            ,{" "}
            <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[10px]">
              notification
            </code>
            , etc.) may be set to{" "}
            <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[10px]">
              false
            </code>{" "}
            in the{" "}
            <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[10px]">
              categories
            </code>{" "}
            config object.
          </li>
        </ol>
      </details>
    </div>
  );
}
