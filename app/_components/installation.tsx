"use client";

import {
  IconArrowRight,
  IconCheck,
  IconClock,
  IconCopy,
  IconTerminal2,
} from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { Button } from "@/components/ui/sensory-ui/button";

const ease = [0.22, 1, 0.36, 1] as const;

const STEPS = [
  {
    number: "01",
    title: "Install the CLI",
    code: "npx shadcn@latest add https://sensory-ui.dev/r/sensory-ui",
    description: "Add sensory-ui components to your existing shadcn/ui project",
    effort: "30 sec",
    status: "From shadcn/ui to sensory-ui",
  },
  {
    number: "02",
    title: "Wrap Your App",
    code: `import { SensoryUIProvider } from "@/components/ui/sensory-ui/config/provider"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SensoryUIProvider>
          {children}
        </SensoryUIProvider>
      </body>
    </html>
  )
}`,
    description: "Configure the provider in your root layout",
    effort: "2 min",
    status: "One-time setup",
  },
  {
    number: "03",
    title: "Add Sounds",
    code: `import { Button } from "@/components/ui/sensory-ui/button"

export function SaveButton() {
  return (
    <Button sound="activation.primary">
      Save Changes
    </Button>
  )
}`,
    description: "Use the sound prop on any component",
    effort: "Instant",
    status: "Drop-in replacement ready",
  },
];

function InstallCard({
  number,
  title,
  code,
  description,
  effort,
  status,
  delay,
  isLast = false,
}: {
  number: string;
  title: string;
  code: string;
  description: string;
  effort: string;
  status: string;
  delay: number;
  isLast?: boolean;
}) {
  const prefersReduced = useReducedMotion();
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.article
      className="relative grid gap-0 md:grid-cols-[auto_1fr]"
      initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
      transition={{ duration: 0.4, ease, delay }}
      viewport={{ margin: "-100px", amount: 0.3 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {/* Timeline column */}
      <div className="relative flex flex-col items-center pr-6 md:pr-8">
        {/* Number badge */}
        <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center border-2 border-primary bg-background">
          <span className="font-bold font-mono text-primary text-xl tabular-nums">
            {number}
          </span>
        </div>

        {/* Connecting line */}
        {!isLast && (
          <div className="my-1 min-h-30 w-0.5 flex-1 bg-linear-to-b from-primary/60 via-primary/30 to-primary/10" />
        )}
      </div>

      {/* Content column */}
      <div className="group relative mb-10 flex flex-col border border-border bg-card/40 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-card/60 md:mb-12">
        {/* Header */}
        <div className="flex flex-col gap-2 border-border border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground text-lg">{title}</h3>
              <span className="inline-flex items-center gap-1 border border-primary/20 bg-primary/5 px-2 py-0.5 font-mono text-[10px] text-primary uppercase tracking-wider">
                <IconClock aria-hidden="true" className="size-3" />
                {effort}
              </span>
            </div>
            <p className="mt-1 text-muted-foreground text-xs">{description}</p>
          </div>
          <Button
            aria-label={copied ? "Copied to clipboard" : "Copy code"}
            className="touch-manipulation self-start opacity-60 transition-opacity hover:opacity-100 group-hover:opacity-100 sm:self-auto"
            onClick={copyCode}
            size="icon-sm"
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
        </div>

        {/* Code block */}
        <div className="relative flex-1 overflow-x-auto bg-muted/30 p-5">
          <pre className="font-mono text-foreground text-xs/relaxed">
            <code>{code}</code>
          </pre>
        </div>

        {/* Status indicator */}
        <div className="border-border border-t bg-muted/10 px-5 py-2.5">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <IconArrowRight
              aria-hidden="true"
              className="size-3.5 text-primary"
            />
            <span className="font-medium">{status}</span>
          </div>
        </div>

        {/* Hover accent */}
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </motion.article>
  );
}

export function Installation() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      aria-labelledby="installation-heading"
      className="border-border border-t py-24"
      id="installation"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
          transition={{ duration: 0.4, ease }}
          viewport={{ margin: "-100px", amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6 flex items-center gap-2">
            <IconTerminal2 aria-hidden="true" className="size-5 text-primary" />
            <span className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
              Quick Start
            </span>
          </div>
          <h2
            className="text-balance font-semibold text-3xl sm:text-4xl"
            id="installation-heading"
          >
            Get started in under 3 minutes
          </h2>
          <p className="mt-3 max-w-2xl text-base/relaxed text-muted-foreground">
            Drop-in replacement for shadcn/ui components. No breaking changes.
            Add the{" "}
            <code className="rounded-none bg-muted px-1.5 py-0.5 font-mono text-xs">
              sound
            </code>{" "}
            prop when you want audio feedback.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="mt-16">
          {STEPS.map((step, index) => (
            <InstallCard
              key={step.number}
              {...step}
              delay={0.1 + index * 0.08}
              isLast={index === STEPS.length - 1}
            />
          ))}
        </div>

        {/* Footer note with migration callout */}
        <motion.div
          className="mt-8 space-y-4"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.4 }}
          viewport={{ margin: "-100px", amount: 0.3 }}
          whileInView={{ opacity: 1 }}
        >
          <div className="border-primary/40 border-l-2 bg-primary/5 px-4 py-3">
            <p className="text-foreground text-sm">
              <strong className="font-semibold">
                Already using shadcn/ui?
              </strong>{" "}
              Perfect. Sensory-ui is designed as a drop-in replacement. Your
              existing components keep working exactly as they are.
            </p>
          </div>
          <p className="text-center text-muted-foreground text-xs">
            No configuration needed • Web Audio API • Zero dependencies •
            TypeScript native
          </p>
        </motion.div>
      </div>
    </section>
  );
}
