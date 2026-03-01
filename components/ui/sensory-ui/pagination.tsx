"use client";

import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink as BasePaginationLink,
  PaginationNext as BasePaginationNext,
  PaginationPrevious as BasePaginationPrevious,
} from "@/components/ui/pagination";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

function PaginationLink({
  sound,
  onClick,
  ...props
}: React.ComponentProps<typeof BasePaginationLink> & {
  /** Sound to play when this page link is clicked. */
  sound?: SoundRole;
}) {
  const { playSound } = useSensoryUI();

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (sound) void playSound(sound);
      onClick?.(e);
    },
    [sound, playSound, onClick]
  );

  return <BasePaginationLink onClick={handleClick} {...props} />;
}

function PaginationPrevious({
  sound,
  onClick,
  ...props
}: React.ComponentProps<typeof BasePaginationPrevious> & {
  /** Sound to play when navigating to the previous page. */
  sound?: SoundRole;
}) {
  const { playSound } = useSensoryUI();

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (sound) void playSound(sound);
      onClick?.(e);
    },
    [sound, playSound, onClick]
  );

  return <BasePaginationPrevious onClick={handleClick} {...props} />;
}

function PaginationNext({
  sound,
  onClick,
  ...props
}: React.ComponentProps<typeof BasePaginationNext> & {
  /** Sound to play when navigating to the next page. */
  sound?: SoundRole;
}) {
  const { playSound } = useSensoryUI();

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (sound) void playSound(sound);
      onClick?.(e);
    },
    [sound, playSound, onClick]
  );

  return <BasePaginationNext onClick={handleClick} {...props} />;
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
