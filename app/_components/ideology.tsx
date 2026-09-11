"use client";

import {
  IconAccessible,
  IconBulb,
  IconHeartHandshake,
  IconScale,
} from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import posthog from "posthog-js";

const ease = [0.32, 0.72, 0, 1] as const;

const PRINCIPLES = [
  {
    icon: IconBulb,
    title: "Informative, not decorative",
    description:
      "Sound should tell the user something. Every cue maps to an interaction, state, or moment. If it doesn't communicate, it doesn't play.",
  },
  {
    icon: IconScale,
    title: "Small actions, small sounds",
    description:
      "A checkbox gets a tick. Navigation gets a sweep. A milestone gets a chime. Sound weight scales with the interaction.",
  },
  {
    icon: IconAccessible,
    title: "Accessible by default",
    description:
      "Sound never gets in the way. Respects reduced motion. Disable globally, by category, or per interaction. Every cue has a visual counterpart.",
  },
  {
    icon: IconHeartHandshake,
    title: "Reassuring, never punishing",
    description:
      "Errors shouldn't punish. Success shouldn't scream. Every sound is designed to reinforce the interaction and feel good.",
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
          initial={{
            opacity: 0,
            y: prefersReduced ? 0 : 12,
          }}
          onViewportEnter={() =>
            posthog.capture("section_viewed", { section: "ideology" })
          }
          transition={{ duration: 0.25, ease }}
          viewport={{ once: true, margin: "-100px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <span className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
            Philosophy
          </span>
          <h2
            className="mt-3 text-balance font-pixel text-3xl sm:text-4xl"
            id="ideology-heading"
          >
            Sound with <span className="text-primary">intention.</span>
          </h2>
          <p className="mt-4 max-w-lg text-muted-foreground text-sm/relaxed">
            Sound should communicate, not compete. These principles keep
            sensory-ui from becoming noise.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-px border border-primary/25 bg-primary/25 sm:grid-cols-2"
          initial="hidden"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
          viewport={{ once: true, margin: "-100px" }}
          whileInView="show"
        >
          {PRINCIPLES.map((principle, index) => (
            <motion.div
              className="group relative flex flex-col gap-3.5 bg-background p-8"
              key={principle.title}
              variants={{
                hidden: {
                  opacity: 0,
                  y: prefersReduced ? 0 : 12,
                  x: prefersReduced ? 0 : 12,
                },
                show: {
                  opacity: 1,
                  y: 0,
                  x: 0,
                  transition: { duration: 0.25, ease },
                },
              }}
            >
              <principle.icon
                aria-hidden="true"
                className="relative z-10 size-6 text-primary"
              />
              <div>
                <h3 className="relative z-10 font-semibold text-base">
                  {principle.title}
                </h3>
                <p className="relative z-10 mt-2 text-muted-foreground text-sm/relaxed">
                  {principle.description}
                </p>
              </div>
              <Image
                alt=""
                className="pointer-events-none absolute top-0 left-0 z-0 h-full w-full items-center justify-center object-cover opacity-15 transition-opacity group-hover:opacity-25"
                height={240}
                src={`/dither/dither-${index + 1}.png`}
                width={400}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
