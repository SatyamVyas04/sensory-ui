"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SensoryUIProvider } from "@/components/ui/sensory-ui/config/provider";
import type { SoundPackName } from "@/components/ui/sensory-ui/config/registry";
import { ShowcaseGrid } from "./showcase/index";

const ease = [0.22, 1, 0.36, 1] as const;

const PACKS: {
  value: SoundPackName;
  label: string;
  description: string;
}[] = [
  {
    value: "default",
    label: "Default",
    description: "Clean SaaS aesthetic",
  },
  {
    value: "arcade",
    label: "Arcade",
    description: "8-bit chiptune vibes",
  },
  {
    value: "wind",
    label: "Wind",
    description: "Organic and airy tones",
  },
  {
    value: "retro",
    label: "Retro",
    description: "Synthwave nostalgia",
  },
];

export function Showcase() {
  const prefersReduced = useReducedMotion();
  const [selectedPack, setSelectedPack] = useState<SoundPackName>("default");

  const fadeUp = {
    initial: { opacity: 0, y: prefersReduced ? 0 : 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { margin: "-100px", amount: 0.3 },
    transition: { duration: 0.4, ease },
  };

  return (
    <section
      aria-labelledby="showcase-heading"
      className="border-border border-t py-24"
      id="showcase"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section header */}
        <motion.div {...fadeUp}>
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <span className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
                Showcase
              </span>
              <h2
                className="mt-2 text-balance font-semibold text-3xl sm:text-4xl"
                id="showcase-heading"
              >
                Interactive components with audio feedback.
              </h2>
              <p className="mt-3 max-w-2xl text-muted-foreground text-sm/relaxed">
                Every component accepts a semantic{" "}
                <code className="rounded-none bg-muted px-1.5 py-0.5 font-mono text-xs">
                  sound
                </code>{" "}
                prop. Nothing plays unless you ask it to. Choose from{" "}
                <strong className="font-semibold text-foreground">
                  19&nbsp;sound&nbsp;roles
                </strong>{" "}
                across{" "}
                <strong className="font-semibold text-foreground">
                  24&nbsp;components
                </strong>
                .
              </p>
            </div>

            {/* Pack selector - redesigned as Select */}
            <div className="flex flex-col gap-2">
              <label
                className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest"
                htmlFor="sound-pack-selector"
              >
                Sound Pack
              </label>
              <Select
                onValueChange={(value) =>
                  setSelectedPack(value as SoundPackName)
                }
                value={selectedPack}
              >
                <SelectTrigger
                  aria-label="Select sound pack theme"
                  className="w-60 border-primary/30 bg-card/50 backdrop-blur-sm hover:border-primary/50 focus:border-primary"
                  id="sound-pack-selector"
                >
                  <SelectValue>
                    {(() => {
                      const pack = PACKS.find((p) => p.value === selectedPack);
                      return pack ? (
                        <span className="flex items-center gap-2">
                          <span className="font-medium">{pack.label}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {pack.description}
                          </span>
                        </span>
                      ) : null;
                    })()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="border-primary/30">
                  {PACKS.map((pack) => (
                    <SelectItem
                      className="cursor-pointer"
                      key={pack.value}
                      value={pack.value}
                    >
                      <span className="flex flex-col">
                        <span className="font-medium text-sm">
                          {pack.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {pack.description}
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Component gallery - wrapped in a local SensoryUIProvider to apply the selected pack */}
        <div className="mt-12">
          <SensoryUIProvider
            config={{
              theme: selectedPack,
              categories: {
                activation: true,
                navigation: true,
                notifications: true,
                system: true,
                hero: true, // enabled for demo purposes
              },
            }}
          >
            <ShowcaseGrid />
          </SensoryUIProvider>
        </div>

        {/* Note about sounds */}
        <motion.p
          className="mt-6 text-center text-muted-foreground text-xs"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.2 }}
          viewport={{ margin: "-100px", amount: 0.3 }}
          whileInView={{ opacity: 1 }}
        >
          All sounds are generated in real time via the Web Audio API. No audio
          files, no network requests.
        </motion.p>
      </div>
    </section>
  );
}
