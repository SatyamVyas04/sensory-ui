"use client";

import { IconArrowUpRight, IconVolume } from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

const CATEGORIES = [
  {
    name: "activation",
    roles: ["primary", "subtle", "confirm", "error"],
    description: "Direct user actions",
    ms: "40–90ms",
  },
  {
    name: "navigation",
    roles: ["forward", "backward", "switch", "scroll"],
    description: "Spatial movement",
    ms: "100–250ms",
  },
  {
    name: "notifications",
    roles: ["passive", "important", "success", "warning"],
    description: "System messages",
    ms: "200–600ms",
  },
  {
    name: "system",
    roles: ["open", "close", "expand", "collapse", "focus"],
    description: "UI structure",
    ms: "120–400ms",
  },
  {
    name: "hero",
    roles: ["complete", "milestone"],
    description: "Celebratory moments",
    ms: "800–1800ms",
  },
] as const;

export function Inspiration() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      aria-labelledby="inspiration-heading"
      className="border-border border-t py-24"
      id="inspiration"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column — reasoning */}
          <motion.div
            initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
            transition={{ duration: 0.5, ease }}
            viewport={{ once: true, margin: "-80px" }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <span className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
              Inspiration
            </span>
            <h2
              className="mt-2 text-balance font-semibold text-3xl sm:text-4xl"
              id="inspiration-heading"
            >
              Sound design is craft.
            </h2>

            <blockquote className="mt-6 border-primary border-l-2 pl-4">
              <p className="text-muted-foreground text-sm/relaxed italic">
                "Sounds make UI feel responsive, alive, and trustworthy. Used
                well, sound reinforces meaning and confirms actions without
                requiring visual attention."
              </p>
              <footer className="mt-3 text-muted-foreground text-xs">
                —{" "}
                <cite>
                  Material Design,{" "}
                  <a
                    className="underline underline-offset-2 hover:text-foreground"
                    href="https://m2.material.io/design/sound/applying-sound-to-ui.html#sound-use-cases"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Applying Sound to UI
                    <IconArrowUpRight
                      aria-hidden="true"
                      className="ml-0.5 inline size-3"
                    />
                  </a>
                </cite>
              </footer>
            </blockquote>

            <div className="mt-6 space-y-3 text-muted-foreground text-sm/relaxed">
              <p>
                Google figured this out in 2014. The soft tap of a Material
                button, the chime of a notification, the sweep of a page
                transition — all deliberate. All crafted. All meaningful.
              </p>
              <p>
                Web developers have largely ignored this dimension. Either
                sounds were implemented badly (jarring, uncontrollable, loud) or
                not at all. There was no clean, framework-native way to add
                sound feedback to a React component tree.
              </p>
              <p>
                sensory-ui is that missing piece. You bring the sounds. We bring
                the plumbing.
              </p>
            </div>
          </motion.div>

          {/* Right column — sound categories */}
          <div>
            <motion.p
              className="mb-4 font-mono text-muted-foreground text-xs uppercase tracking-widest"
              initial={{ opacity: 0 }}
              transition={{ duration: 0.4, ease }}
              viewport={{ once: true, margin: "-80px" }}
              whileInView={{ opacity: 1 }}
            >
              19 semantic roles · 5 categories
            </motion.p>

            <div className="space-y-2.5">
              {CATEGORIES.map(({ name, roles, description, ms }, i) => (
                <motion.div
                  className="border border-border p-4"
                  initial={{
                    opacity: 0,
                    x: prefersReduced ? 0 : 16,
                  }}
                  key={name}
                  transition={{ duration: 0.4, ease, delay: i * 0.07 }}
                  viewport={{ once: true, margin: "-80px" }}
                  whileInView={{ opacity: 1, x: 0 }}
                >
                  <div className="mb-2.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <IconVolume
                        aria-hidden="true"
                        className="size-3.5 text-primary"
                      />
                      <span className="font-medium font-mono text-foreground text-xs">
                        {name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground text-xs">
                      <span className="font-mono tabular-nums">{ms}</span>
                      <span>{description}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {roles.map((role) => (
                      <span
                        className="border border-border bg-muted/30 px-1.5 py-0.5 font-mono text-muted-foreground text-xs"
                        key={role}
                      >
                        {name}.{role}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
