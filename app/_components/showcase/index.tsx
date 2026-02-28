"use client";

import { motion, useReducedMotion } from "motion/react";
import { AccordionDemo } from "./accordion-demo";
import { ButtonDemo } from "./button-demo";
import { CarouselDemo } from "./carousel-demo";
import { CheckboxDemo } from "./checkbox-demo";
import { DialogDemo } from "./dialog-demo";
import { HeroDemo } from "./hero-demo";
import { NavigationDemo } from "./navigation-demo";
import { NotificationsDemo } from "./notifications-demo";
import { RadioGroupDemo } from "./radio-group-demo";
import { SelectDemo } from "./select-demo";
import { SliderDemo } from "./slider-demo";
import { SwitchDemo } from "./switch-demo";
import { TabsDemo } from "./tabs-demo";
import { ToggleDemo } from "./toggle-demo";

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
        delay: prefersReduced ? 0 : index * 0.06,
      }}
      viewport={{ once: true, margin: "-40px", amount: 0.1 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}

export function ShowcaseGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
      {/* Column 1 - activation: clicks, toggles, state changes */}
      <StaggerColumn index={0}>
        <ButtonDemo />
        <RadioGroupDemo />
        <CheckboxDemo />
      </StaggerColumn>

      {/* Column 2 - navigation: direction, selection, spatial movement */}
      <StaggerColumn index={1}>
        <TabsDemo />
        <CarouselDemo />
        <ToggleDemo />
        <SliderDemo />
      </StaggerColumn>

      {/* Column 3 - system: open/close overlays, expand/collapse */}
      <StaggerColumn index={2}>
        <DialogDemo />
        <AccordionDemo />
        <SelectDemo />
        <SwitchDemo />
      </StaggerColumn>

      {/* Column 4 - feedback: notifications and hero moments */}
      <StaggerColumn index={3}>
        <NotificationsDemo />
        <HeroDemo />
        <NavigationDemo />
      </StaggerColumn>
    </div>
  );
}
