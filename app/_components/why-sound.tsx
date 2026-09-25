"use client";

import { IconVolume } from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";
import posthog from "posthog-js";
import { Button } from "@/components/ui/sensory-ui/button";
import {
  SensoryUIProvider,
  useSensoryUI,
} from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

const ease = [0.32, 0.72, 0, 1] as const;

const REASONS: {
  stat: string;
  label: string;
  body: string;
  sound: SoundRole;
}[] = [
  {
    stat: "0",
    label: "audio files",
    body: "No MP3s. No WAVs. Every sound is synthesized in the browser.",
    sound: "interaction.tap",
  },
  {
    stat: "0",
    label: "network requests",
    body: "Sounds are generated locally. Nothing to download, nothing to cache.",
    sound: "notification.info",
  },
  {
    stat: "0",
    label: "latency",
    body: "No waiting. Sounds render the instant you interact.",
    sound: "notification.success",
  },
];

function GlassSoundButton({
  sound,
  label,
}: {
  sound: SoundRole;
  label: string;
}) {
  const { playSound } = useSensoryUI();
  return (
    <Button
      aria-label={`Hear the glass ${label} sound`}
      className="size-7 text-muted-foreground hover:text-foreground"
      onClick={() => {
        playSound(sound).catch(() => undefined);
      }}
      size="icon"
      sound={false}
      variant="ghost"
    >
      <IconVolume className="size-4" />
    </Button>
  );
}

export function WhySound() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      aria-labelledby="why-sound-heading"
      className="border-border border-t py-24"
      id="why-sound"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
          onViewportEnter={() =>
            posthog.capture("section_viewed", { section: "why_sound" })
          }
          transition={{ duration: 0.25, ease }}
          viewport={{ once: true, margin: "-80px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <span className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
            How it works
          </span>
          <h2
            className="mt-3 text-balance font-serif text-3xl sm:text-4xl"
            id="why-sound-heading"
          >
            No audio files. Just <span className="text-primary">sound.</span>
          </h2>
          <p className="mt-4 max-w-lg text-balance text-muted-foreground text-sm/relaxed">
            Every sound is generated in the browser using the Web Audio API. No
            downloads. No assets. No latency.
          </p>
        </motion.div>

        <SensoryUIProvider config={{ theme: "glass" }}>
          <div className="mt-12 grid gap-8 sm:grid-cols-3 sm:gap-px sm:border sm:border-primary/25 sm:bg-primary/25">
            {REASONS.map((reason, i) => (
              <motion.div
                className="group relative flex flex-col gap-4 bg-background p-0 sm:p-8"
                initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
                key={reason.label}
                transition={{ duration: 0.25, ease, delay: i * 0.08 }}
                viewport={{ once: true, margin: "-80px" }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-serif text-4xl text-primary sm:text-5xl">
                      {reason.stat}
                    </span>
                    <p className="mt-1 font-mono text-muted-foreground text-xs uppercase tracking-widest">
                      {reason.label}
                    </p>
                  </div>
                  <GlassSoundButton label={reason.label} sound={reason.sound} />
                </div>
                <p className="text-balance text-muted-foreground text-sm leading-relaxed">
                  {reason.body}
                </p>
              </motion.div>
            ))}
          </div>
        </SensoryUIProvider>
      </div>
    </section>
  );
}
