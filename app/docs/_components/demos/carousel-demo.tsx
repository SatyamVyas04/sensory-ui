"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/sensory-ui/carousel";

const SLIDES = ["Slide 1", "Slide 2", "Slide 3"];

export function CarouselDocsDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <Carousel className="w-full">
        <CarouselContent>
          {SLIDES.map((slide) => (
            <CarouselItem key={slide}>
              <div className="flex h-28 items-center justify-center rounded-md border bg-muted/30 text-muted-foreground text-sm">
                {slide}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="mt-4 flex items-center justify-center gap-3">
          <CarouselPrevious className="static translate-y-0" />
          <CarouselNext className="static translate-y-0" />
        </div>
      </Carousel>
    </div>
  );
}
