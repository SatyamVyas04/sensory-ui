"use client";

import { motion, useReducedMotion } from "motion/react";
import { ButtonDemo } from "./button-demo";
import { CarouselDemo } from "./carousel-demo";
import { CommandDemo } from "./command-demo";
import { DialogDemo } from "./dialog-demo";
import { ExpandCollapseDemo } from "./expand-collapse-demo";
import { HeroDemo } from "./hero-demo";
import { NavigationControlsDemo } from "./navigation-controls-demo";
import { NotificationsDemo } from "./notifications-demo";
import { OverlaySurfacesDemo } from "./overlay-surfaces-demo";
import { SliderDemo } from "./slider-demo";
import { TabsDemo } from "./tabs-demo";
import { ToggleControlsDemo } from "./toggle-controls-demo";

const ease = [0.32, 0.72, 0, 1] as const;

// Simple staggered column animation
function StaggerColumn({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className="flex flex-col gap-4 *:w-full *:max-w-full"
      initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
      transition={{
        duration: 0.25,
        ease,
        delay: prefersReduced ? 0 : index * 0.05,
      }}
      viewport={{ once: true, margin: "-80px", amount: 0.1 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}

export function ShowcaseGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {/* Column 1 — Interaction */}
      <StaggerColumn index={0}>
        <ButtonDemo />
        <ToggleControlsDemo />
        <SliderDemo />
        <CommandDemo />
      </StaggerColumn>

      {/* Column 2 — Navigation */}
      <StaggerColumn index={1}>
        <TabsDemo />
        <NotificationsDemo />
        <CarouselDemo />
        <NavigationControlsDemo />
      </StaggerColumn>

      {/* Column 3 — Surfaces & Feedback */}
      <StaggerColumn index={2}>
        <HeroDemo />
        <DialogDemo />
        <OverlaySurfacesDemo />
        <ExpandCollapseDemo />
      </StaggerColumn>
    </div>
  );
}
