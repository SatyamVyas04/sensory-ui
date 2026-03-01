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

function CarouselPrevious({
  sound,
  onClick,
  ...props
}: React.ComponentProps<typeof BaseCarouselPrevious> & {
  /** Sound to play when scrolling to the previous slide. */
  sound?: SoundRole;
}) {
  const { playSound } = useSensoryUI();
  const { scrollPrev } = useCarousel();

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (sound) void playSound(sound);
      scrollPrev();
      onClick?.(e);
    },
    [sound, playSound, scrollPrev, onClick]
  );

  return <BaseCarouselPrevious onClick={handleClick} {...props} />;
}

function CarouselNext({
  sound,
  onClick,
  ...props
}: React.ComponentProps<typeof BaseCarouselNext> & {
  /** Sound to play when scrolling to the next slide. */
  sound?: SoundRole;
}) {
  const { playSound } = useSensoryUI();
  const { scrollNext } = useCarousel();

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (sound) void playSound(sound);
      scrollNext();
      onClick?.(e);
    },
    [sound, playSound, scrollNext, onClick]
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
