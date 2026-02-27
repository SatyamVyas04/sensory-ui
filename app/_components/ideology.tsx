"use client";

import {
  IconAccessible,
  IconBraces,
  IconFeather,
  IconToggleLeft,
} from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";

const ease = [0.32, 0.72, 0, 1] as const;

const PRINCIPLES = [
  {
    icon: IconBraces,
    title: "Semantic, not decorative",
    description:
      "Every sound maps to an interaction class. Activation, navigation, system, notifications. Not random noise. A vocabulary.",
  },
  {
    icon: IconToggleLeft,
    title: "Explicit opt-in",
    description:
      "Components stay silent until you pass a sound prop. Zero magic. Zero surprises. Full control.",
  },
  {
    icon: IconAccessible,
    title: "Accessible by default",
    description:
      "Honors prefers-reduced-motion. Global kill-switch. Per-category toggles. Sound enhances, never distracts.",
  },
  {
    icon: IconFeather,
    title: "Featherweight",
    description:
      "Under 3 KB gzipped. No bundled audio files, no global side effects. Drops into any shadcn project.",
  },
] as const;

export function Ideology() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      aria-labelledby="ideology-heading"
      className="border-border border-t py-24"
      id="ideology"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
          transition={{ duration: 0.25, ease }}
          viewport={{ once: true, margin: "-80px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <span className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
            Philosophy
          </span>
          <h2
            className="mt-2 text-balance font-semibold text-3xl sm:text-4xl"
            id="ideology-heading"
          >
            Sound with intention.
          </h2>
          <p className="mt-3 max-w-lg text-muted-foreground text-sm/relaxed">
            UI sound is a craft, not a gimmick. Four principles keep sensory-ui
            from becoming noise.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-px border border-border bg-border sm:grid-cols-2"
          initial="hidden"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.05 } },
          }}
          viewport={{ once: true, margin: "-80px" }}
          whileInView="show"
        >
          {PRINCIPLES.map(({ icon: Icon, title, description }) => (
            <motion.div
              className="flex flex-col gap-3.5 bg-background p-8"
              key={title}
              variants={{
                hidden: {
                  opacity: 0,
                  y: prefersReduced ? 0 : 10,
                },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.25, ease },
                },
              }}
            >
              <Icon aria-hidden="true" className="size-6 text-primary" />
              <div>
                <h3 className="font-semibold text-base">{title}</h3>
                <p className="mt-2 text-muted-foreground text-sm/relaxed">
                  {description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
