"use client";

import { IconArrowRight, IconWaveSine } from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const prefersReduced = useReducedMotion();

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: prefersReduced ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, ease, delay },
  });

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex min-h-svh items-center overflow-hidden pt-12"
    >
      {/* Hero background image — full-bleed */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full select-none"
      >
        <Image
          alt=""
          className="h-full w-full object-cover"
          fill
          priority
          sizes="100vw"
          src="/hero-background.jpg"
        />
        {/* Gradient fade from left to blend with content */}
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/90 to-transparent" />
        {/* Subtle bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background to-transparent" />
      </div>

      {/* Mobile: softer overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-background/60 lg:hidden"
      />

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:py-32">
        {/* Left column — text content */}
        <div className="max-w-xl">
          {/* Badge */}
          <motion.div {...fadeUp(0)} className="mb-5 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 border border-primary/30 bg-primary/5 px-2.5 py-1 font-mono text-primary text-xs">
              <IconWaveSine aria-hidden="true" className="size-3" />
              v0.1&nbsp;·&nbsp;Early Preview
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            id="hero-heading"
            {...fadeUp(0.07)}
            className="text-balance font-semibold text-5xl tracking-tight sm:text-6xl lg:text-7xl"
          >
            Give your UI
            <br />
            <span className="text-primary">a voice.</span>
          </motion.h1>

          {/* Sub-heading */}
          <motion.p
            {...fadeUp(0.15)}
            className="mt-6 max-w-xl text-base/relaxed text-muted-foreground sm:text-lg/relaxed"
          >
            We design for sight. We design for touch.{" "}
            <strong className="font-medium text-foreground">sensory-ui</strong>{" "}
            brings the missing dimension — semantic, opt-in sound feedback wired
            directly into your shadcn/ui components. Not noise. Precision.
          </motion.p>

          {/* Supporting detail */}
          <motion.p
            {...fadeUp(0.2)}
            className="mt-3 max-w-lg text-muted-foreground text-sm/relaxed"
          >
            The web has evolved to stimulate every sense except one. Every
            button click, every dialog open, every navigation can carry meaning
            through sound — if you choose to use it.
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...fadeUp(0.27)}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <motion.a
              className="inline-flex items-center gap-1.5 bg-primary px-4 py-2.5 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              href="https://github.com/SatyamVyas04/sensory-ui"
              rel="noopener noreferrer"
              style={{ touchAction: "manipulation" }}
              target="_blank"
              transition={{ duration: 0.12, ease }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
            >
              Get Started
              <IconArrowRight aria-hidden="true" className="size-4" />
            </motion.a>

            <a
              className="inline-flex items-center gap-1.5 border border-border px-4 py-2.5 font-medium text-foreground/70 text-sm transition-colors hover:border-foreground/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              href="#showcase"
              style={{ touchAction: "manipulation" }}
            >
              See It in Action
            </a>
          </motion.div>

          {/* Stat row */}
          <motion.div
            {...fadeUp(0.34)}
            className="mt-12 flex flex-wrap gap-x-8 gap-y-3"
          >
            {[
              { value: "9", label: "components" },
              { value: "19", label: "sound roles" },
              { value: "5", label: "categories" },
              { value: "< 3 KB", label: "engine (min)" },
            ].map(({ value, label }) => (
              <div className="flex flex-col gap-0.5" key={label}>
                <span className="font-mono font-semibold text-foreground text-lg tabular-nums">
                  {value}
                </span>
                <span className="text-muted-foreground text-xs">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
