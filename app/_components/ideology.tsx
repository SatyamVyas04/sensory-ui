"use client";

import {
  IconAccessible,
  IconBraces,
  IconFeather,
  IconToggleLeft,
} from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

const PRINCIPLES = [
  {
    icon: IconBraces,
    title: "Semantic, not decorative",
    description:
      "Every sound maps to a meaningful interaction class. Activation, navigation, system feedback, notifications — not a jukebox. A vocabulary.",
  },
  {
    icon: IconToggleLeft,
    title: "Explicit opt-in only",
    description:
      "No component ever makes a sound unless you pass a sound prop. Zero magic. Zero surprises. You are always in control.",
  },
  {
    icon: IconAccessible,
    title: "Accessible by default",
    description:
      "Respects prefers-reduced-motion. Global kill-switch. Per-category toggles. Sound should enhance — never antagonise.",
  },
  {
    icon: IconFeather,
    title: "Minimal footprint",
    description:
      "< 3 KB engine, minified. No bundled audio blobs, no global side effects. Drops into any shadcn project without adding weight.",
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
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
          transition={{ duration: 0.5, ease }}
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
            Built on four principles.
          </h2>
          <p className="mt-3 max-w-lg text-muted-foreground text-sm/relaxed">
            Sound in UI is not a trend — it is a craft. These principles keep
            sensory-ui from becoming noise.
          </p>
        </motion.div>

        <motion.div
          className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-2"
          initial="hidden"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.09 } },
          }}
          viewport={{ once: true, margin: "-80px" }}
          whileInView="show"
        >
          {PRINCIPLES.map(({ icon: Icon, title, description }) => (
            <motion.div
              className="flex flex-col gap-3 bg-background p-6"
              key={title}
              variants={{
                hidden: {
                  opacity: 0,
                  y: prefersReduced ? 0 : 12,
                },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.4, ease },
                },
              }}
            >
              <Icon aria-hidden="true" className="size-5 text-primary" />
              <div>
                <h3 className="font-medium text-sm">{title}</h3>
                <p className="mt-1.5 text-muted-foreground text-xs/relaxed">
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
