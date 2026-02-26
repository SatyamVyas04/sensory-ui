"use client";

import { IconTerminal2 } from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { SensoryUIProvider } from "@/components/ui/sensory-ui/config/provider";
import type { SoundPackName } from "@/components/ui/sensory-ui/config/registry";
import { ShowcaseGrid } from "./showcase/index";

const ease = [0.22, 1, 0.36, 1] as const;

const PACKS: { value: SoundPackName; label: string; description: string }[] = [
  { value: "default", label: "default", description: "clean SaaS" },
  { value: "arcade", label: "arcade", description: "8-bit chiptune" },
  { value: "wind", label: "wind", description: "organic / airy" },
  { value: "retro", label: "retro", description: "synthwave" },
];

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

export function Showcase() {
  const prefersReduced = useReducedMotion();
  const [selectedPack, setSelectedPack] = useState<SoundPackName>("default");

  return (
    <section
      aria-labelledby="showcase-heading"
      className="border-border border-t py-24"
      id="showcase"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
          transition={{ duration: 0.5, ease }}
          viewport={{ once: true, margin: "-80px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
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
                prop. Nothing plays unless you ask it to. All{" "}
                <strong className="font-medium text-foreground">
                  19 sound roles
                </strong>{" "}
                across{" "}
                <strong className="font-medium text-foreground">
                  9 components
                </strong>
                .
              </p>
            </div>

            {/* Pack selector */}
            <div className="flex shrink-0 flex-col gap-1.5 pt-1">
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                Sound pack
              </span>
              <div className="flex flex-col gap-1">
                {PACKS.map((pack) => (
                  <button
                    className={[
                      "flex items-center gap-2.5 border px-3 py-1.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      selectedPack === pack.value
                        ? "border-primary/60 bg-primary/5 text-foreground"
                        : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                    ].join(" ")}
                    key={pack.value}
                    onClick={() => setSelectedPack(pack.value)}
                    type="button"
                  >
                    <span
                      className={[
                        "h-1.5 w-1.5 rounded-full transition-colors",
                        selectedPack === pack.value
                          ? "bg-primary"
                          : "bg-muted-foreground/30",
                      ].join(" ")}
                    />
                    <span className="font-mono text-xs">{pack.label}</span>
                    <span className="text-[10px] text-muted-foreground/60">
                      {pack.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Component gallery — wrapped in a local SensoryUIProvider to apply the selected pack */}
        <div className="mt-12">
          <SensoryUIProvider config={{ theme: selectedPack }}>
            <ShowcaseGrid />
          </SensoryUIProvider>
        </div>

        {/* Note about sounds */}
        <motion.p
          className="mt-6 text-center text-muted-foreground text-xs"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.3 }}
          viewport={{ once: true, margin: "-80px" }}
          whileInView={{ opacity: 1 }}
        >
          All sounds are generated in real time via the Web Audio API — no audio
          files, no network requests.
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
