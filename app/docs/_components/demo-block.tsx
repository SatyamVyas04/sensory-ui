"use client";

import { useState } from "react";
import { SensoryUIProvider } from "@/components/ui/sensory-ui/config/provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
            <span className="text-sm font-medium text-foreground">
              {title}
            </span>
          )}
          {description && (
            <span className="text-sm text-muted-foreground">
              {description}
            </span>
          )}
        </div>
        <Select value={pack} onValueChange={setPack}>
          <SelectTrigger className="h-8 w-[140px] text-xs">
            <SelectValue placeholder="Sound pack" />
          </SelectTrigger>
          <SelectContent>
            {soundPacks.map((p) => (
              <SelectItem key={p.value} value={p.value} className="text-xs">
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <SensoryUIProvider config={{ theme: pack, volume: 0.5 }}>
        <div className="flex items-center justify-center bg-background/50 p-8">
          {children}
        </div>
      </SensoryUIProvider>
    </div>
  );
}
