"use client";

import * as React from "react";
import {
  Command,
  CommandDialog,
  CommandInput as BaseCommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem as BaseCommandItem,
  CommandShortcut,
  CommandSeparator,
} from "@/components/ui/command";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

const DEFAULT_COMMAND_SOUND = "interaction.tap" as const;
const DEFAULT_COMMAND_INPUT_SOUND = "interaction.subtle" as const;

function CommandInput({
  sound,
  volume,
  onValueChange,
  ...props
}: React.ComponentProps<typeof BaseCommandInput> & {
  /** Sound to play on every keystroke / value change. Defaults to "interaction.subtle". Set to false to disable. */
  sound?: SoundRole | false;
  /** Per-component volume multiplier (0–1). Stacks with master volume. */
  volume?: number;
}) {
  const { playSound } = useSensoryUI();

  const handleValueChange = React.useCallback(
    (value: string) => {
      if (sound !== false) void playSound(sound ?? DEFAULT_COMMAND_INPUT_SOUND, { volume });
      onValueChange?.(value);
    },
    [sound, volume, playSound, onValueChange]
  );

  return <BaseCommandInput onValueChange={handleValueChange} {...props} />;
}

function CommandItem({
  sound,
  volume,
  onSelect,
  ...props
}: React.ComponentProps<typeof BaseCommandItem> & {
  /** Sound to play when this item is selected. Defaults to "interaction.tap". Set to false to disable. */
  sound?: SoundRole | false;
  /** Per-component volume multiplier (0–1). Stacks with master volume. */
  volume?: number;
}) {
  const { playSound } = useSensoryUI();

  const handleSelect = React.useCallback(
    (value: string) => {
      if (sound !== false) void playSound(sound ?? DEFAULT_COMMAND_SOUND, { volume });
      onSelect?.(value);
    },
    [sound, volume, playSound, onSelect]
  );

  return <BaseCommandItem onSelect={handleSelect} {...props} />;
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
