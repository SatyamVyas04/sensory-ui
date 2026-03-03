"use client";

import * as React from "react";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious as BaseCarouselPrevious,
  CarouselNext as BaseCarouselNext,
  useCarousel,
} from "@/components/ui/carousel";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

const DEFAULT_CAROUSEL_PREV_SOUND = "navigation.backward" as const;
const DEFAULT_CAROUSEL_NEXT_SOUND = "navigation.forward" as const;

function CarouselPrevious({
  sound,
  volume,
  onClick,
  ...props
}: React.ComponentProps<typeof BaseCarouselPrevious> & {
  /** Sound to play when scrolling to the previous slide. Defaults to "navigation.backward". Set to false to disable. */
  sound?: SoundRole | false;
  /** Per-component volume multiplier (0–1). Stacks with master volume. */
  volume?: number;
}) {
  const { playSound } = useSensoryUI();
  const { scrollPrev } = useCarousel();

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (sound !== false) void playSound(sound ?? DEFAULT_CAROUSEL_PREV_SOUND, { volume });
      scrollPrev();
      onClick?.(e);
    },
    [sound, volume, playSound, scrollPrev, onClick]
  );

  return <BaseCarouselPrevious onClick={handleClick} {...props} />;
}

function CarouselNext({
  sound,
  volume,
  onClick,
  ...props
}: React.ComponentProps<typeof BaseCarouselNext> & {
  /** Sound to play when scrolling to the next slide. Defaults to "navigation.forward". Set to false to disable. */
  sound?: SoundRole | false;
  /** Per-component volume multiplier (0–1). Stacks with master volume. */
  volume?: number;
}) {
  const { playSound } = useSensoryUI();
  const { scrollNext } = useCarousel();

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (sound !== false) void playSound(sound ?? DEFAULT_CAROUSEL_NEXT_SOUND, { volume });
      scrollNext();
      onClick?.(e);
    },
    [sound, volume, playSound, scrollNext, onClick]
  );

  return <BaseCarouselNext onClick={handleClick} {...props} />;
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarousel,
};
