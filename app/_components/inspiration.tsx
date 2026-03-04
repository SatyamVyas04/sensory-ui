"use client";

import { IconArrowUpRight, IconPlayerPlayFilled } from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";
import { usePlaySound } from "@/components/ui/sensory-ui/config/use-play-sound";

const ease = [0.32, 0.72, 0, 1] as const;

const CATEGORIES = [
  {
    name: "interaction",
    roles: ["tap", "subtle", "toggle", "confirm"] as const,
    description: "Direct user actions",
    ms: "8–90ms",
  },
  {
    name: "overlay",
    roles: ["open", "close", "expand", "collapse"] as const,
    description: "Surface state changes",
    ms: "60–200ms",
  },
  {
    name: "navigation",
    roles: ["forward", "backward", "tab"] as const,
    description: "Spatial movement",
    ms: "100–250ms",
  },
  {
    name: "notification",
    roles: ["info", "success", "warning", "error"] as const,
    description: "System messages",
    ms: "200–600ms",
  },
  {
    name: "hero",
    roles: ["complete", "milestone"] as const,
    description: "Celebratory moments",
    ms: "800–1800ms",
  },
] as const;

function RoleButton({ category, role }: { category: string; role: string }) {
  const soundRole = `${category}.${role}` as SoundRole;
  const { play } = usePlaySound({ sound: soundRole });

  return (
    <button
      className="group/role flex items-center gap-1.5 border border-border bg-muted/30 px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-foreground active:bg-primary/10"
      onClick={play}
      type="button"
    >
      <IconPlayerPlayFilled
        aria-hidden="true"
        className="size-2.5 text-primary opacity-0 transition-opacity group-hover/role:opacity-100"
      />
      <span className="-translate-x-2 transition-all group-hover/role:translate-x-0">
        {category}.{role}
      </span>
    </button>
  );
}

export function Inspiration() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      aria-labelledby="inspiration-heading"
      className="border-border border-t py-24"
      id="inspiration"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column - reasoning */}
          <motion.div
            initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
            transition={{ duration: 0.25, ease }}
            viewport={{ once: true, margin: "-80px" }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <span className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
              Inspiration
            </span>
            <h2
              className="mt-3 text-balance font-pixel text-3xl sm:text-4xl"
              id="inspiration-heading"
            >
              The forgotten <span className="text-primary">dimension.</span>
            </h2>

            <blockquote className="mt-6 border-primary border-l-2 pl-4">
              <p className="text-muted-foreground text-sm/relaxed italic">
                "Your ears are faster than your eyes. The auditory cortex
                processes sound in about 25ms, while visual processing takes
                nearly ten times longer. A button that clicks feels faster than
                one that doesn't, even when the visual feedback is identical."
              </p>
              <footer className="mt-3 text-muted-foreground text-xs">
                –{" "}
                <cite>
                  Raphael Salaja,{" "}
                  <a
                    className="underline underline-offset-2 hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    href="https://www.userinterface.wiki/sounds-on-the-web"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Sounds on the Web
                    <IconArrowUpRight
                      aria-hidden="true"
                      className="ml-0.5 inline size-3"
                    />
                  </a>
                </cite>
              </footer>
            </blockquote>

            <blockquote className="mt-4 border-primary/50 border-l-2 pl-4">
              <p className="text-muted-foreground text-sm/relaxed italic">
                "Sound should create a sense of comfort and security – only
                calling for action when needed. Informative, honest, and
                reassuring."
              </p>
              <footer className="mt-3 text-muted-foreground text-xs">
                –{" "}
                <cite>
                  <a
                    className="underline underline-offset-2 hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    href="https://m2.material.io/design/sound/about-sound.html"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Material Design, About Sound
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
                Google understood this in 2014. The soft tap of a Material
                button, the chime of a notification, the sweep of a page
                transition. Deliberate. Crafted. Meaningful.
              </p>
              <p>
                Web developers largely ignored this dimension. No clean,
                framework-native way to add audio feedback to a React component
                tree. sensory-ui fills that gap - zero audio files, zero side
                effects, procedural synthesis powered by the Web Audio API.
              </p>
            </div>
          </motion.div>

          {/* Right column - sound categories */}
          <div>
            <motion.p
              className="mb-4 font-mono text-muted-foreground text-xs uppercase tracking-widest"
              initial={{ opacity: 0 }}
              transition={{ duration: 0.25, ease }}
              viewport={{ once: true, margin: "-80px" }}
              whileInView={{ opacity: 1 }}
            >
              17 semantic roles across 5 categories
            </motion.p>

            <div className="space-y-3">
              {CATEGORIES.map(({ name, roles, description, ms }, i) => (
                <motion.div
                  className="border border-border p-5"
                  initial={{
                    opacity: 0,
                    y: prefersReduced ? 0 : 12,
                  }}
                  key={name}
                  transition={{ duration: 0.25, ease, delay: i * 0.05 }}
                  viewport={{ once: true, margin: "-80px" }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="font-mono font-semibold text-foreground text-sm">
                      {name}
                    </span>
                    <div className="flex items-center gap-4 text-muted-foreground text-xs">
                      <span className="font-mono tabular-nums">{ms}</span>
                      <span>{description}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {roles.map((role) => (
                      <RoleButton category={name} key={role} role={role} />
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
