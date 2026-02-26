"use client";

import { IconCarouselHorizontal } from "@tabler/icons-react";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/sensory-ui/carousel";
import { DemoCard } from "./demo-card";

const SLIDES = [
  { label: "Step 1", copy: "Install the component" },
  { label: "Step 2", copy: "Add the sound prop" },
  { label: "Step 3", copy: "Ship with confidence" },
];

export function CarouselDemo() {
  return (
    <DemoCard
      description="Prev/next trigger directional navigation cues"
      icon={<IconCarouselHorizontal className="size-4" />}
      title="Carousel"
    >
      <div className="flex flex-col gap-3">
        <Carousel
          className="w-full"
          nextSound="navigation.forward"
          prevSound="navigation.backward"
        >
          <CarouselContent>
            {SLIDES.map((slide) => (
              <CarouselItem key={slide.label}>
                <div className="flex h-16 flex-col items-start justify-center border border-border bg-muted/30 px-4">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                    {slide.label}
                  </span>
                  <span className="mt-0.5 text-foreground text-xs">
                    {slide.copy}
                  </span>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <ButtonGroup className="mt-2">
            <CarouselPrevious className="relative top-0 left-0 translate-y-0" />
            <CarouselNext className="relative top-0 right-0 translate-y-0" />
          </ButtonGroup>
        </Carousel>
      </div>
    </DemoCard>
  );
}
