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

const ease = [0.32, 0.72, 0, 1] as const;

// Token configuration
const TOKEN_CONFIG = [
  { pattern: /^"[^"]*"/, className: "text-emerald-500 dark:text-emerald-400" },
  {
    pattern: /^(import|export|from|default|function|return|const|let|var)\b/,
    className: "text-primary",
  },
  {
    pattern: /^<\/?[A-Z][a-zA-Z]*/,
    className: "text-sky-500 dark:text-sky-400",
  },
  { pattern: /^<\/?[a-z]+/, className: "text-sky-500 dark:text-sky-400" },
  {
    pattern: /^[a-zA-Z_][a-zA-Z0-9_]*(?==)/,
    className: "text-amber-500 dark:text-amber-400",
  },
  { pattern: /^\/\/.*/, className: "text-muted-foreground/60" },
] as const;

function tokenizeLine(
  line: string
): Array<{ text: string; className?: string }> {
  const tokens: Array<{ text: string; className?: string }> = [];
  let remaining = line;

  while (remaining.length > 0) {
    let matched = false;

    for (const { pattern, className } of TOKEN_CONFIG) {
      const match = remaining.match(pattern);
      if (match) {
        tokens.push({ text: match[0], className });
        remaining = remaining.slice(match[0].length);
        matched = true;
        break;
      }
    }

    if (!matched) {
      tokens.push({ text: remaining[0] });
      remaining = remaining.slice(1);
    }
  }

  return tokens;
}

function HighlightedCode({ code }: { code: string }) {
  const lines = code.split("\n");

  return (
    <>
      {lines.map((line, lineIdx) => {
        const tokens = tokenizeLine(line);
        const lineKey = `${line.slice(0, 20).replace(/\s/g, "_")}-${lineIdx}`;

        return (
          <span key={lineKey}>
            {tokens.map((token, tokenIdx) => {
              const tokenKey = `${lineKey}-${token.text.slice(0, 8).replace(/\s/g, "_")}-${tokenIdx}`;
              return token.className ? (
                <span className={token.className} key={tokenKey}>
                  {token.text}
                </span>
              ) : (
                token.text
              );
            })}
            {lineIdx < lines.length - 1 && "\n"}
          </span>
        );
      })}
    </>
  );
}

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
      initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
      transition={{ duration: 0.25, ease, delay }}
      viewport={{ once: true, margin: "-100px", amount: 0.3 }}
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
              animate={{ scale: copied ? 0.95 : 1, opacity: copied ? 0 : 1 }}
              transition={{ duration: 0.12, ease }}
            >
              <IconCopy className="size-4" />
            </motion.div>
            <motion.div
              animate={{ scale: copied ? 1 : 0.95, opacity: copied ? 1 : 0 }}
              className="absolute"
              transition={{ duration: 0.12, ease }}
            >
              <IconCheck className="size-4" />
            </motion.div>
          </Button>
        </div>

        {/* Code block */}
        <div className="relative flex-1 overflow-x-auto bg-muted/30 p-5">
          <pre className="font-mono text-foreground text-xs/relaxed">
            <code>
              <HighlightedCode code={code} />
            </code>
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: prefersReduced ? 0 : 10 }}
          transition={{ duration: 0.25, ease }}
          viewport={{ once: true, margin: "-100px", amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8 flex items-center gap-2.5">
            <IconTerminal2 aria-hidden="true" className="size-6 text-primary" />
            <span className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
              Quick Start
            </span>
          </div>
          <h2
            className="text-balance font-semibold text-3xl sm:text-4xl"
            id="installation-heading"
          >
            Ship sound in 3 minutes.
          </h2>
          <p className="mt-4 max-w-2xl text-base/relaxed text-muted-foreground">
            Drop-in replacement for shadcn/ui. No breaking changes. Add the{" "}
            <code className="rounded-none bg-muted px-1.5 py-0.5 font-mono text-xs">
              sound
            </code>{" "}
            prop when ready.
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
          transition={{ duration: 0.25, ease, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px", amount: 0.3 }}
          whileInView={{ opacity: 1 }}
        >
          <div className="border-primary/40 border-l-2 bg-primary/5 px-4 py-3">
            <p className="text-foreground text-sm">
              <strong className="font-semibold">
                Already using shadcn/ui?
              </strong>{" "}
              Your existing components work as-is. Start adding sound whenever
              you are ready.
            </p>
          </div>
          <p className="text-center text-muted-foreground text-xs">
            No config needed | Web Audio API | Zero dependencies | TypeScript
            native
          </p>
        </motion.div>
      </div>
    </section>
  );
}
