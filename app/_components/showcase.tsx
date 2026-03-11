"use client";

import { motion, useReducedMotion } from "motion/react";
import posthog from "posthog-js";
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
import { SoundSuppressedBanner } from "./showcase/sound-suppressed-banner";

const ease = [0.32, 0.72, 0, 1] as const;

const PACKS: {
  value: SoundPackName;
  label: string;
  description: string;
}[] = [
  {
    value: "soft",
    label: "Soft",
    description: "Warm felt mallets",
  },
  {
    value: "aero",
    label: "Aero",
    description: "Breathy wind chimes",
  },
  {
    value: "arcade",
    label: "Arcade",
    description: "8-bit chiptune vibes",
  },
  {
    value: "organic",
    label: "Organic",
    description: "Natural wood tones",
  },
  {
    value: "glass",
    label: "Glass",
    description: "Crystalline bells",
  },
  {
    value: "industrial",
    label: "Industrial",
    description: "Metallic machinery",
  },
  {
    value: "minimal",
    label: "Minimal",
    description: "Pure sparse tones",
  },
  {
    value: "retro",
    label: "Retro",
    description: "Vintage analog synth",
  },
  {
    value: "crisp",
    label: "Crisp",
    description: "Sharp hi-fi precision",
  },
];

export function Showcase() {
  const prefersReduced = useReducedMotion();
  const [selectedPack, setSelectedPack] = useState<SoundPackName>("crisp");

  const fadeUp = {
    initial: { opacity: 0, y: prefersReduced ? 0 : 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px", amount: 0.2 },
    transition: { duration: 0.25, ease },
  };

  return (
    <section
      aria-labelledby="showcase-heading"
      className="border-border border-t py-24"
      id="showcase"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          {...fadeUp}
          onViewportEnter={() =>
            posthog.capture("section_viewed", { section: "showcase" })
          }
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <span
                aria-hidden="true"
                className="font-mono text-muted-foreground text-xs uppercase tracking-widest"
              >
                Showcase
              </span>
              <h2
                className="mt-3 text-balance font-pixel text-3xl sm:text-4xl"
                id="showcase-heading"
              >
                Feel the <span className="text-primary">difference.</span>
              </h2>
              <p className="mt-4 max-w-2xl text-pretty text-muted-foreground text-sm/relaxed">
                Every component listens for the{" "}
                <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs">
                  sound
                </code>{" "}
                prop. 17 semantic roles.{" "}
                <strong className="font-semibold text-foreground">
                  24 components
                </strong>
                . <br />
                Instant feedback that feels right.
              </p>
            </div>

            {/* Pack selector */}
            <motion.div
              className="flex flex-col gap-2"
              initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
              transition={{
                duration: 0.25,
                ease,
                delay: prefersReduced ? 0 : 0.1,
              }}
              viewport={{ once: true, margin: "-80px" }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <label
                className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest"
                htmlFor="sound-pack-selector"
              >
                Sound Pack
              </label>
              <Select
                onValueChange={(value) => {
                  setSelectedPack(value as SoundPackName);
                  posthog.capture("sound_pack_changed", { pack: value });
                }}
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
                        <span className="flex items-baseline gap-2">
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
            </motion.div>
          </div>
        </motion.div>

        {/* Component gallery - wrapped in a local SensoryUIProvider to apply the selected pack */}
        <div className="mt-12">
          <SensoryUIProvider
            config={{
              theme: selectedPack,
              volume: 0.5,
              categories: {
                interaction: true,
                navigation: true,
                notification: true,
                overlay: true,
                hero: true, // enabled for demo purposes
              },
            }}
          >
            <SoundSuppressedBanner />
            <ShowcaseGrid />
          </SensoryUIProvider>
        </div>

        {/* Note about sounds */}
        <motion.p
          className="mt-8 text-center text-muted-foreground/80 text-xs"
          initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
          transition={{ duration: 0.25, ease, delay: prefersReduced ? 0 : 0.2 }}
          viewport={{ once: true, margin: "-80px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          Sounds generated in real time via Web Audio API. No files. No latency.
        </motion.p>
      </div>
    </section>
  );
}
