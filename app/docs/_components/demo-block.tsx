"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SensoryUIProvider } from "@/components/ui/sensory-ui/config/provider";

const soundPacks = [
  { value: "aero", label: "Aero" },
  { value: "soft", label: "Soft" },
  { value: "arcade", label: "Arcade" },
  { value: "organic", label: "Organic" },
  { value: "glass", label: "Glass" },
  { value: "industrial", label: "Industrial" },
  { value: "minimal", label: "Minimal" },
  { value: "retro", label: "Retro" },
  { value: "crisp", label: "Crisp" },
] as const;

export function DemoBlock({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
}) {
  const [pack, setPack] = useState("aero");

  return (
    <div className="my-8 overflow-hidden rounded-lg border">
      <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-3">
          {title && (
            <span className="font-medium text-foreground text-sm">{title}</span>
          )}
          {description && (
            <span className="text-muted-foreground text-sm">{description}</span>
          )}
        </div>
        <Select onValueChange={setPack} value={pack}>
          <SelectTrigger className="h-8 w-[140px] text-xs">
            <SelectValue placeholder="Sound pack" />
          </SelectTrigger>
          <SelectContent>
            {soundPacks.map((p) => (
              <SelectItem className="text-xs" key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <SensoryUIProvider
        config={{
          theme: pack,
          volume: 0.5,
          categories: {
            interaction: true,
            navigation: true,
            notification: true,
            overlay: true,
            hero: true,
          },
        }}
      >
        <div className="not-prose flex min-w-0 items-center justify-center bg-background/50 p-8 py-12">
          {children}
        </div>
      </SensoryUIProvider>
    </div>
  );
}
