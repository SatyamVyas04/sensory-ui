"use client";

import { motion, useReducedMotion } from "motion/react";
import posthog from "posthog-js";

const ease = [0.32, 0.72, 0, 1] as const;

const REASONS = [
  {
    stat: "0",
    label: "audio files",
    body: "No MP3s. No WAVs. Every sound is synthesized in the browser.",
  },
  {
    stat: "0",
    label: "network requests",
    body: "Sounds are generated locally. Nothing to download, nothing to cache.",
  },
  {
    stat: "~26kb",
    label: "gzipped",
    body: "Small enough to disappear into your bundle. Pure Web Audio API.",
  },
];

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
            className="mt-3 text-balance font-pixel text-3xl sm:text-4xl"
            id="why-sound-heading"
          >
            No audio files. Just <span className="text-primary">sound.</span>
          </h2>
          <p className="mt-4 max-w-lg text-balance text-muted-foreground text-sm/relaxed">
            Every sound is generated in the browser using the Web Audio API. No
            downloads. No assets. No latency.
          </p>
        </motion.div>

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
              <div>
                <span className="font-pixel text-4xl text-primary sm:text-5xl">
                  {reason.stat}
                </span>
                <p className="mt-1 font-mono text-muted-foreground text-xs uppercase tracking-widest">
                  {reason.label}
                </p>
              </div>
              <p className="text-balance text-muted-foreground text-sm leading-relaxed">
                {reason.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
