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

const DEFAULT_PAGINATION_LINK_SOUND = "navigation.switch" as const;
const DEFAULT_PAGINATION_PREV_SOUND = "navigation.backward" as const;
const DEFAULT_PAGINATION_NEXT_SOUND = "navigation.forward" as const;

function PaginationLink({
  sound,
  onClick,
  ...props
}: React.ComponentProps<typeof BasePaginationLink> & {
  /** Sound to play when this page link is clicked. Defaults to "navigation.switch". Set to false to disable. */
  sound?: SoundRole | false;
}) {
  const { playSound } = useSensoryUI();

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (sound !== false) void playSound(sound ?? DEFAULT_PAGINATION_LINK_SOUND);
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
  /** Sound to play when navigating to the previous page. Defaults to "navigation.backward". Set to false to disable. */
  sound?: SoundRole | false;
}) {
  const { playSound } = useSensoryUI();

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (sound !== false) void playSound(sound ?? DEFAULT_PAGINATION_PREV_SOUND);
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
  /** Sound to play when navigating to the next page. Defaults to "navigation.forward". Set to false to disable. */
  sound?: SoundRole | false;
}) {
  const { playSound } = useSensoryUI();

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (sound !== false) void playSound(sound ?? DEFAULT_PAGINATION_NEXT_SOUND);
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
