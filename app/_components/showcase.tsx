"use client";

import {
  IconBell,
  IconCursorText,
  IconLayoutGrid,
  IconTerminal2,
} from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/sensory-ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/sensory-ui/tabs";

const ease = [0.22, 1, 0.36, 1] as const;

const CODE_INSTALL =
  "npx shadcn@latest add https://sensory-ui.dev/r/sensory-ui";

const CODE_USAGE = `import { Button } from "@/components/ui/sensory-ui/button"
import { SensoryUIProvider } from "@/components/ui/sensory-ui/config/provider"

// 1. Wrap your root layout
export default function Layout({ children }) {
  return <SensoryUIProvider>{children}</SensoryUIProvider>
}

// 2. Add a sound prop — that's it
export function SaveButton() {
  return (
    <Button sound="activation.primary">
      Save Changes
    </Button>
  )
}`;

function CodeBlock({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="flex flex-col border border-border bg-muted/20">
      <div className="flex items-center justify-between border-border border-b px-3 py-2">
        <span className="font-mono text-muted-foreground text-xs">{label}</span>
        <motion.button
          aria-label={`Copy ${label} code to clipboard`}
          className="font-mono text-muted-foreground text-xs transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={copy}
          style={{ touchAction: "manipulation" }}
          type="button"
          whileTap={{ scale: 0.95 }}
        >
          {copied ? "Copied!" : "Copy"}
        </motion.button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-foreground text-xs/relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

interface DemoCardProps {
  children: React.ReactNode;
  delay?: number;
  description: string;
  icon: React.ReactNode;
  title: string;
}

function DemoCard({
  title,
  description,
  icon,
  children,
  delay = 0,
}: DemoCardProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className="flex flex-col border border-border bg-card p-5"
      initial={{ opacity: 0, y: prefersReduced ? 0 : 14 }}
      transition={{ duration: 0.45, ease, delay }}
      viewport={{ once: true, margin: "-80px" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="mb-1 flex items-center gap-2 text-muted-foreground">
        <span aria-hidden="true" className="text-primary">
          {icon}
        </span>
        <span className="font-medium text-foreground text-xs">{title}</span>
      </div>
      <p className="mb-5 font-mono text-muted-foreground text-xs">
        {description}
      </p>
      <div className="mt-auto">{children}</div>
    </motion.div>
  );
}

export function Showcase() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      aria-labelledby="showcase-heading"
      className="border-border border-t py-24"
      id="showcase"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
          transition={{ duration: 0.5, ease }}
          viewport={{ once: true, margin: "-80px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <span className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
            Showcase
          </span>
          <h2
            className="mt-2 text-balance font-semibold text-3xl sm:text-4xl"
            id="showcase-heading"
          >
            Sound-aware by design.
          </h2>
          <p className="mt-3 max-w-lg text-muted-foreground text-sm/relaxed">
            Every component accepts a semantic{" "}
            <code className="rounded-none bg-muted px-1 py-0.5 font-mono text-xs">
              sound
            </code>{" "}
            prop. Nothing plays unless you ask it to. Bring your own audio files
            — sensory-ui handles the wiring.
          </p>
        </motion.div>

        {/* Demo cards */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DemoCard
            delay={0.08}
            description="activation.primary / .subtle / .error"
            icon={<IconCursorText className="size-4" />}
            title="Button"
          >
            <div className="flex flex-wrap gap-2">
              <Button size="sm" sound="activation.primary">
                Primary
              </Button>
              <Button size="sm" sound="activation.subtle" variant="outline">
                Subtle
              </Button>
              <Button size="sm" sound="activation.error" variant="destructive">
                Error
              </Button>
            </div>
          </DemoCard>

          <DemoCard
            delay={0.15}
            description="navigation.switch"
            icon={<IconLayoutGrid className="size-4" />}
            title="Tabs"
          >
            <Tabs defaultValue="preview" sound="navigation.switch">
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="docs">Docs</TabsTrigger>
              </TabsList>
              <TabsContent
                className="mt-3 text-muted-foreground text-xs"
                value="preview"
              >
                Preview panel — switch tabs to trigger sound.
              </TabsContent>
              <TabsContent
                className="mt-3 text-muted-foreground text-xs"
                value="code"
              >
                Code panel — navigation.switch fired.
              </TabsContent>
              <TabsContent
                className="mt-3 text-muted-foreground text-xs"
                value="docs"
              >
                Docs panel — directional audio cue triggers.
              </TabsContent>
            </Tabs>
          </DemoCard>

          <DemoCard
            delay={0.22}
            description="Dialog · Select · Accordion · Switch · Sheet"
            icon={<IconBell className="size-4" />}
            title="9+ Components"
          >
            <p className="text-muted-foreground text-xs/relaxed">
              Every open, close, confirm, toggle, and navigation has a semantic
              role. One prop bridges your component to the Web Audio engine.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {[
                "system.open",
                "system.close",
                "activation.confirm",
                "notifications.success",
              ].map((role) => (
                <span
                  className="border border-border bg-muted/30 px-1.5 py-0.5 font-mono text-muted-foreground text-xs"
                  key={role}
                >
                  {role}
                </span>
              ))}
            </div>
          </DemoCard>
        </div>

        {/* Note about sounds */}
        <motion.p
          className="mt-4 text-center text-muted-foreground text-xs"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.3 }}
          viewport={{ once: true, margin: "-80px" }}
          whileInView={{ opacity: 1 }}
        >
          * Demos are interactive — sounds require audio files.{" "}
          <a
            className="underline underline-offset-2 hover:text-foreground"
            href="https://m2.material.io/design/sound/sound-resources.html"
            rel="noopener noreferrer"
            target="_blank"
          >
            Find quality UI sounds here.
          </a>
        </motion.p>

        {/* Installation */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
          viewport={{ once: true, margin: "-80px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="mb-4 flex items-center gap-2">
            <IconTerminal2
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
            <span className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
              Installation
            </span>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            <CodeBlock code={CODE_INSTALL} label="1. Add to your project" />
            <CodeBlock code={CODE_USAGE} label="2. Wire up a component" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
