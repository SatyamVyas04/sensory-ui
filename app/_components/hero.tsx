"use client";

import {
  IconArrowRight,
  IconBrandGithub,
  IconBrandX,
  IconCheck,
  IconCopy,
  IconWaveSine,
} from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/sensory-ui/button";

const ease = [0.22, 1, 0.36, 1] as const;

interface HeroProps {
  stars: number;
}

export function Hero({ stars }: HeroProps) {
  const prefersReduced = useReducedMotion();
  const [copied, setCopied] = useState(false);

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: prefersReduced ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, ease, delay },
  });

  const copyInstallCommand = async () => {
    await navigator.clipboard.writeText(
      "npx shadcn@latest add https://sensory-ui.dev/r/sensory-ui"
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex h-screen max-h-225 items-center overflow-hidden"
    >
      {/* Skip to main content */}
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:bg-primary focus:px-3 focus:py-1.5 focus:font-medium focus:text-primary-foreground focus:text-xs focus-visible:ring-2 focus-visible:ring-ring"
        href="#main-content"
      >
        Skip to main content
      </a>

      {/* Hero background image - full-bleed */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full select-none"
      >
        <Image
          alt=""
          className="h-full w-full object-cover"
          fill
          priority
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

      {/* Navbar integrated into hero */}
      <motion.header
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 right-0 left-0 z-50"
        initial={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.4, ease }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            className="flex items-center gap-2.5 font-semibold text-base transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            href="/"
          >
            <Image
              alt=""
              aria-hidden="true"
              className="size-6 dark:invert"
              height={24}
              src="/icon-64.png"
              width={24}
            />
            <span>sensory-ui</span>
          </Link>

          <nav aria-label="Site links" className="flex items-center gap-2">
            <a
              className="flex items-center gap-1.5 rounded-none border border-border px-2.5 py-1 text-foreground/70 text-xs transition-colors hover:border-foreground/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href="https://github.com/SatyamVyas04/sensory-ui"
              rel="noopener noreferrer"
              target="_blank"
            >
              <IconBrandGithub aria-hidden="true" className="size-3.5" />
              <span>GitHub</span>
              {stars > 0 && (
                <span className="text-muted-foreground tabular-nums">
                  {stars}
                </span>
              )}
            </a>

            <a
              aria-label="Twitter/X - @SatyamVyas04"
              className="flex size-8 items-center justify-center text-foreground/60 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href="https://x.com/SatyamVyas04"
              rel="noopener noreferrer"
              target="_blank"
            >
              <IconBrandX aria-hidden="true" className="size-4" />
            </a>
          </nav>
        </div>
      </motion.header>

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:py-32">
        {/* Left column - text content */}
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
            className="text-balance font-semibold text-4xl tracking-tight sm:text-5xl lg:text-6xl"
          >
            Components that{" "}
            <span className="text-primary">sound as good as they look.</span>
          </motion.h1>

          {/* Sub-heading */}
          <motion.p
            {...fadeUp(0.15)}
            className="mt-5 max-w-xl text-base/relaxed text-muted-foreground sm:text-lg/relaxed"
          >
            Semantic audio feedback for{" "}
            <strong className="font-medium text-foreground">shadcn/ui</strong>.
            Add the{" "}
            <code className="rounded-none bg-muted px-1 py-0.5 font-mono text-xs">
              sound
            </code>{" "}
            prop and your components speak.
          </motion.p>

          {/* Installation command */}
          <motion.div
            {...fadeUp(0.2)}
            className="mt-5 flex items-stretch overflow-hidden border border-primary/30 bg-card/40 backdrop-blur-sm"
          >
            <code className="flex-1 px-4 py-2.5 font-mono text-primary text-xs">
              <span className="text-foreground">$</span> npx shadcn@latest add
              https://sensory-ui.dev/r/sensory-ui
            </code>
            <Button
              aria-label={
                copied ? "Copied to clipboard" : "Copy install command"
              }
              className="touch-manipulation rounded-none border-primary/30 border-l bg-primary/10 text-primary hover:bg-primary/20"
              onClick={copyInstallCommand}
              size="icon"
              sound="activation.confirm"
              variant="ghost"
            >
              <motion.div
                animate={{ scale: copied ? 0 : 1, opacity: copied ? 0 : 1 }}
                transition={{ duration: 0.15 }}
              >
                <IconCopy className="size-4" />
              </motion.div>
              <motion.div
                animate={{ scale: copied ? 1 : 0, opacity: copied ? 1 : 0 }}
                className="absolute"
                transition={{ duration: 0.15 }}
              >
                <IconCheck className="size-4" />
              </motion.div>
            </Button>
          </motion.div>

          {/* CTAs */}
          <motion.div
            {...fadeUp(0.27)}
            className="mt-6 flex flex-wrap items-center gap-3"
          >
            <motion.a
              className="inline-flex touch-manipulation items-center gap-1.5 bg-primary px-4 py-2.5 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
              className="inline-flex touch-manipulation items-center gap-1.5 border border-border px-4 py-2.5 font-medium text-foreground/70 text-sm transition-colors hover:border-foreground/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              href="#showcase"
              style={{ touchAction: "manipulation" }}
            >
              See It in Action
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            {...fadeUp(0.34)}
            className="mt-6 inline-flex flex-wrap items-center gap-x-1 gap-y-2 rounded-none border border-border/40 bg-card/30 px-4 py-2.5 backdrop-blur-sm"
          >
            {[
              { value: "24", label: "components" },
              { value: "19", label: "roles" },
              { value: "4", label: "sound packs" },
              { value: "< 3 KB", label: "gzipped" },
            ].map(({ value, label }, index, array) => (
              <div className="flex items-baseline gap-1.5" key={label}>
                <span className="font-mono font-semibold text-foreground text-sm tabular-nums">
                  {value}
                </span>
                <span className="text-muted-foreground text-xs">{label}</span>
                {index < array.length - 1 && (
                  <span aria-hidden="true" className="mx-2 text-border">
                    •
                  </span>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
