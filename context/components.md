# sensory-ui - Component API & Usage

> `components/ui/sensory-ui/*.tsx`

This document describes the component API - how the `sound` prop works, what event triggers are supported, how patched source components are structured, and how to use sensory-ui with components that are not yet wrapped.

---

## The `sound` Prop

Every sensory-ui primitive component accepts optional sound-related props on top of its usual API. The exact prop names vary by component pattern:

**Standard pattern** (Button, Checkbox, Switch, Slider, Tabs, RadioGroup, Toggle, ToggleGroup, Command, Menubar, NavigationMenu, Pagination):

```ts
sound?: SoundRole | false
volume?: number
```

**Overlay pattern** (Dialog, AlertDialog, Sheet, Drawer, Popover, Select, ContextMenu, DropdownMenu):

```ts
sound?: SoundRole | false      // open sound (defaults to "overlay.open")
closeSound?: SoundRole | false  // close sound (defaults to "overlay.close")
volume?: number
```

**Expand/collapse pattern** (Accordion, Collapsible, Sidebar):

```ts
expandSound?: SoundRole | false  // or openSound (Accordion uses expandSound, Collapsible/Sidebar use openSound)
collapseSound?: SoundRole | false
volume?: number
```

Where `SoundRole` is one of the 17 semantic role strings defined in [sound-roles.md](./sound-roles.md).

- **When the sound prop is absent:** the component uses its **baked-in default role** (e.g. `Button` defaults to `interaction.tap`).
- **When the sound prop is `false`:** the component is silenced — no audio is produced.
- **When the sound prop is a string:** the component plays that role, overriding the default.
- **`volume`** is an optional per-component volume multiplier (0–1) that stacks multiplicatively with the master volume from config.

This gives three modes for the sound prop: default (baked-in), silent (`false`), override (explicit string).

---

## Event Triggers

Different components fire sounds at different interaction points. The key rule is: **sounds must only fire from direct user interaction events** (pointer events, keyboard events). They must never fire from lifecycle methods, effects, or programmatic state changes.

| Component        | Default Sound Trigger                                                          | Notes                                                                                       |
| ---------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `Button`         | `onClick`                                                                      | Defaults to `interaction.tap`                                                               |
| `Dialog`         | `onOpenChange(true)` → `overlay.open`, `onOpenChange(false)` → `overlay.close` | Fires on open and close separately                                                          |
| `AlertDialog`    | `onOpenChange`                                                                 | Same pattern as Dialog                                                                      |
| `DropdownMenu`   | `onOpenChange` + `DropdownMenuItem` on `onSelect`                              | Root: open/close. Item: `interaction.tap`                                                   |
| `Sheet`          | `onOpenChange`                                                                 | Same as Dialog                                                                              |
| `Drawer`         | `onOpenChange`                                                                 | Same as Dialog                                                                              |
| `Popover`        | `onOpenChange`                                                                 | Same as Dialog                                                                              |
| `Select`         | `onOpenChange`                                                                 | Open/close sounds                                                                           |
| `ContextMenu`    | `onOpenChange` + `ContextMenuItem` on `onSelect`                               | Root: open/close. Item: `interaction.tap`                                                   |
| `Tabs`           | `onValueChange` → `navigation.tab`                                             | Fires when active tab changes                                                               |
| `Checkbox`       | `onCheckedChange`                                                              | Defaults to `interaction.toggle` on both check and uncheck                                  |
| `Switch`         | `onCheckedChange`                                                              | Defaults to `interaction.toggle`                                                            |
| `Slider`         | `onValueChange`                                                                | Defaults to `interaction.subtle` on every value change during drag                          |
| `Command`        | `CommandInput` on `onValueChange`; `CommandItem` on `onSelect`                 | Input: `interaction.subtle` per keystroke; Items: `interaction.tap`                         |
| `Accordion`      | `onValueChange`                                                                | `expandSound` defaults to `overlay.expand`; `collapseSound` defaults to `overlay.collapse`  |
| `Collapsible`    | `onOpenChange`                                                                 | `openSound` defaults to `overlay.expand`; `closeSound` defaults to `overlay.collapse`       |
| `Sidebar`        | `SidebarProvider` `onOpenChange`                                               | `openSound` defaults to `overlay.open`; `closeSound` defaults to `overlay.close`            |
| `RadioGroup`     | `onValueChange`                                                                | Defaults to `interaction.toggle`                                                           |
| `ToggleGroup`    | `onValueChange`                                                                | Defaults to `interaction.toggle`                                                           |
| `Toggle`         | `onPressedChange`                                                              | Defaults to `interaction.toggle`                                                           |
| `Menubar`        | `MenubarTrigger` on `onClick`; `MenubarItem` on `onSelect`                    | Trigger: `overlay.open`. Item: `interaction.tap`                                           |
| `NavigationMenu` | `NavigationMenuTrigger` on `onClick`; `NavigationMenuLink` on `onClick`        | Trigger: `overlay.open`. Link: `navigation.tab`                                            |
| `Pagination`     | `PaginationLink`/`Previous`/`Next` on `onClick`                                | Link: `navigation.tab`. Prev: `navigation.backward`. Next: `navigation.forward`            |
| `Carousel`       | `CarouselPrevious`/`Next` on `onClick`                                         | Prev: `navigation.backward`. Next: `navigation.forward`                                    |

---

## Button Primitive - Detailed Spec

The Button primitive is the most commonly used sensory-ui component. It wraps the shadcn Button and adds sound playback on click.

```tsx
// components/ui/sensory-ui/button.tsx

"use client";

import * as React from "react";
import { Button as BaseButton, buttonVariants } from "@/components/ui/button";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

const DEFAULT_BUTTON_SOUND = "interaction.tap" as const;

function Button({
	sound,
	volume,
	onClick,
	...props
}: React.ComponentProps<typeof BaseButton> & {
	sound?: SoundRole | false;
	volume?: number;
}) {
	const { playSound } = useSensoryUI();

	const handleClick = React.useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			if (sound !== false)
				void playSound(sound ?? DEFAULT_BUTTON_SOUND, { volume });
			onClick?.(e);
		},
		[sound, volume, playSound, onClick],
	);

	return <BaseButton onClick={handleClick} {...props} />;
}

export { Button, buttonVariants };
```

**Key implementation details:**

- Imports `BaseButton` from `@/components/ui/button` — does NOT copy the shadcn source. Only the root `Button` function is wrapped; `buttonVariants` is re-exported verbatim.
- `void playSound(sound, { volume })` - never `await`. The click handler must return synchronously.
- The original `onClick` handler (if provided) is always called, even if `playSound` throws.
- There is no `disabledSound` prop — disabled buttons cannot be clicked, so no sound is needed.
- No `forwardRef` — React 19 `ComponentProps` handles refs natively.

---

## Dialog Component - Detailed Spec

Dialog is more complex than Button because it has two distinct sound moments: open and close. The `sound` prop on Dialog is the **open sound**. The `closeSound` prop is the close sound.

```tsx
// components/ui/sensory-ui/dialog.tsx

"use client";

import * as React from "react";
import {
	Dialog as BaseDialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogTrigger,
	DialogClose,
} from "@/components/ui/dialog";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

function Dialog({
	sound,
	closeSound,
	volume,
	onOpenChange,
	...props
}: React.ComponentProps<typeof BaseDialog> & {
	sound?: SoundRole | false;
	closeSound?: SoundRole | false;
	volume?: number;
}) {
	const { playSound } = useSensoryUI();

	const handleOpenChange = React.useCallback(
		(open: boolean) => {
			if (open && sound !== false) {
				void playSound(sound ?? "overlay.open", { volume });
			} else if (!open && closeSound !== false) {
				void playSound(closeSound ?? "overlay.close", { volume });
			}
			onOpenChange?.(open);
		},
		[sound, closeSound, volume, playSound, onOpenChange],
	);

	return <BaseDialog onOpenChange={handleOpenChange} {...props} />;
}

export {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogTrigger,
	DialogClose,
};
```

---

## Tabs Component - Detailed Spec

```tsx
// components/ui/sensory-ui/tabs.tsx

"use client";

import * as React from "react";
import {
	Tabs as BaseTabs,
	TabsList,
	TabsTrigger,
	TabsContent,
	tabsListVariants,
} from "@/components/ui/tabs";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

const DEFAULT_TABS_SOUND = "navigation.tab" as const;

function Tabs({
	sound,
	volume,
	onValueChange,
	...props
}: React.ComponentProps<typeof BaseTabs> & {
	sound?: SoundRole | false;
	volume?: number;
}) {
	const { playSound } = useSensoryUI();

	const handleValueChange = React.useCallback(
		(value: string) => {
			if (sound !== false) void playSound(sound ?? DEFAULT_TABS_SOUND, { volume });
			onValueChange?.(value);
		},
		[sound, volume, playSound, onValueChange],
	);

	return <BaseTabs onValueChange={handleValueChange} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
```

---

## General Component Pattern

Every sensory-ui component follows this structure:

```tsx
"use client";

// Imports from the shadcn component layer — NOT copied source.
// Only the root component function is wrapped; sub-components are re-exported verbatim.

import * as React from "react";
import { SomeComponent as BaseSomeComponent, /* sub-components */ } from "@/components/ui/some-component";
import { useSensoryUI } from "@/components/ui/sensory-ui/config/provider";
import type { SoundRole } from "@/components/ui/sensory-ui/config/sound-roles";

const DEFAULT_COMPONENT_SOUND = "some.default.role" as const;

// Wrapped root function — added sound prop + handler interception
function Component({
	sound,
	volume,
	onInteractionEvent,
	...props
}: React.ComponentProps<typeof BaseSomeComponent> & {
	sound?: SoundRole | false;
	volume?: number;
}) {
	const { playSound } = useSensoryUI();

	const handleEvent = React.useCallback(
		(eventArgs) => {
			if (sound !== false)
				void playSound(sound ?? DEFAULT_COMPONENT_SOUND, { volume });
			onInteractionEvent?.(eventArgs);
		},
		[sound, volume, playSound, onInteractionEvent],
	);

	return <BaseSomeComponent onInteractionEvent={handleEvent} {...props} />;
}

// Re-exported sub-components from shadcn (ComponentContent, ComponentTrigger, etc.)
// ...

export { Component, ComponentContent, ComponentTrigger /* etc. */ };
```

Rules for components:

1. Always `"use client"` at the top
2. Do **not** use `React.forwardRef` - React 19 `ComponentProps` handles refs natively
3. Import from `@/components/ui/<name>` — do NOT copy the shadcn source
4. Only wrap the root component function — sub-components are re-exported verbatim
5. Always call the original event handler after triggering sound
6. Never `await playSound` - fire and forget
7. Each component has a **baked-in default role constant** (e.g. `DEFAULT_BUTTON_SOUND = "interaction.tap"`). Use `sound ?? DEFAULT_SOUND` in the handler.
8. Pass `sound !== false` guard before calling `playSound` to allow silencing via `sound={false}`
9. Accept a `volume?: number` prop for per-component volume control

---

## Available Components (v0.5)

| Component        | File                  | Primary Event   | Notes                                                                                      |
| ---------------- | --------------------- | --------------- | ------------------------------------------------------------------------------------------ |
| `Accordion`      | `accordion.tsx`       | value change    | `expandSound` / `collapseSound` props (not `sound`)                                       |
| `AlertDialog`    | `alert-dialog.tsx`    | open/close      | `sound` + `closeSound` props. Same pattern as Dialog.                                     |
| `Button`         | `button.tsx`          | click           | Defaults to `interaction.tap`. Also accepts `volume`.                                      |
| `Carousel`       | `carousel.tsx`        | click           | `CarouselPrevious`: `navigation.backward`. `CarouselNext`: `navigation.forward`.           |
| `Checkbox`       | `checkbox.tsx`        | checked change  | Defaults to `interaction.toggle`. Skips indeterminate state.                               |
| `Collapsible`    | `collapsible.tsx`     | open/close      | `openSound` / `closeSound` props (not `sound`). Defaults to `overlay.expand` / `overlay.collapse`. |
| `Command`        | `command.tsx`         | selection/input | `CommandInput`: `interaction.subtle` per keystroke. `CommandItem`: `interaction.tap`.      |
| `ContextMenu`    | `context-menu.tsx`    | open/close      | Root: `sound` + `closeSound`. `ContextMenuItem`: `interaction.tap`.                        |
| `Dialog`         | `dialog.tsx`          | open/close      | `sound` + `closeSound` props. Pairs open + close sounds.                                  |
| `Drawer`         | `drawer.tsx`          | open/close      | `sound` + `closeSound` props. Same pattern as Dialog.                                     |
| `DropdownMenu`   | `dropdown-menu.tsx`   | open/close      | Root: `sound` + `closeSound`. `DropdownMenuItem`: `interaction.tap`.                       |
| `Menubar`        | `menubar.tsx`         | click/select    | `MenubarTrigger`: `overlay.open`. `MenubarItem`: `interaction.tap`.                       |
| `NavigationMenu` | `navigation-menu.tsx` | click           | `NavigationMenuTrigger`: `overlay.open`. `NavigationMenuLink`: `navigation.tab`.           |
| `Pagination`     | `pagination.tsx`      | click           | Link: `navigation.tab`. Previous: `navigation.backward`. Next: `navigation.forward`.       |
| `Popover`        | `popover.tsx`         | open/close      | `sound` + `closeSound` props. Same pattern as Dialog.                                     |
| `RadioGroup`     | `radio-group.tsx`     | value change    | Defaults to `interaction.toggle`.                                                         |
| `Select`         | `select.tsx`          | open/close      | `sound` + `closeSound` props. Same pattern as Dialog.                                     |
| `Sheet`          | `sheet.tsx`           | open/close      | `sound` + `closeSound` props. Same pattern as Dialog.                                     |
| `Sidebar`        | `sidebar.tsx`         | open/close      | `SidebarProvider` wraps with `openSound` / `closeSound`. Defaults to `overlay.open` / `overlay.close`. |
| `Slider`         | `slider.tsx`          | value change    | Defaults to `interaction.subtle` on every value change during drag.                        |
| `Switch`         | `switch.tsx`          | checked change  | Defaults to `interaction.toggle`.                                                         |
| `Tabs`           | `tabs.tsx`            | value change    | Defaults to `navigation.tab`.                                                             |
| `Toggle`         | `toggle.tsx`          | pressed change  | Defaults to `interaction.toggle`.                                                         |
| `ToggleGroup`    | `toggle-group.tsx`    | value change    | Defaults to `interaction.toggle`.                                                         |

---

## Using the `usePlaySound` Hook

For components not yet wrapped, or for custom interaction points, the `usePlaySound` hook lets any client component trigger a sound:

```ts
// components/ui/sensory-ui/config/use-play-sound.ts

"use client";

import * as React from "react";
import { useSensoryUI } from "./provider";
import type { SoundRole } from "./sound-roles";

export interface UsePlaySoundOptions {
	/** SoundRole (e.g. "interaction.tap") or an absolute URL to a custom audio file. */
	sound: SoundRole | (string & {});
	/** Volume multiplier for this specific sound (0–1). Stacks with master volume. */
	volume?: number;
}

export interface UsePlaySoundReturn {
	/** Imperatively trigger the sound. No-ops if the provider is disabled or muted. */
	play: () => void;
	/** Whether audio is currently enabled. */
	enabled: boolean;
}

export function usePlaySound({ sound, volume }: UsePlaySoundOptions): UsePlaySoundReturn {
	const { playSound, enabled } = useSensoryUI();

	const play = React.useCallback(() => {
		void playSound(sound as SoundRole, { volume });
	}, [playSound, sound, volume]);

	return { play, enabled };
}
```

Usage:

```tsx
"use client";

import { usePlaySound } from "@/components/ui/sensory-ui/config/use-play-sound";

export function CustomComponent() {
	const { play } = usePlaySound({ sound: "interaction.tap" });

	return <button onClick={play}>Custom action</button>;
}
```

---

## Common Usage Patterns

### Primary action button

```tsx
<Button sound="interaction.tap">Save changes</Button>
```

### Destructive action

```tsx
<Button
	variant="destructive"
	sound="interaction.confirm"
	onClick={handleDelete}
>
	Delete account
</Button>
```

### Silencing a button's default sound

```tsx
<Button sound={false}>No sound</Button>
```

### Navigation forward / backward

```tsx
<Button sound="navigation.forward" onClick={goNext}>Next →</Button>
<Button sound="navigation.backward" onClick={goPrev}>← Back</Button>
```

### Dialog with open/close sounds

```tsx
<Dialog sound="overlay.open" closeSound="overlay.close">
	<DialogTrigger asChild>
		<Button>Open settings</Button>
	</DialogTrigger>
	<DialogContent>...</DialogContent>
</Dialog>
```

### Tabs with navigation sound

```tsx
<Tabs defaultValue="overview" sound="navigation.tab">
	<TabsList>
		<TabsTrigger value="overview">Overview</TabsTrigger>
		<TabsTrigger value="details">Details</TabsTrigger>
	</TabsList>
	...
</Tabs>
```

### Success notification

```tsx
// In a toast handler
toast({
	title: "Profile saved",
	// sound="notification.success" is set on the Toast primitive internally
});
```

### Hero completion (must enable hero category in config first)

```tsx
// sensory.config.js: categories: { hero: true }
<Button sound="hero.complete" onClick={handleOnboardingFinish}>
	Get started
</Button>
```

---

## What Is NOT Supported

- `sound` prop on standard shadcn components from `@/components/ui/` — must import from `@/components/ui/sensory-ui/<component>`
- Hover sounds in v1.0 (`hoverSound` is planned for v1.5)
- Multiple sounds on the same interaction (one role per event, except components with separate sub-component sounds like ContextMenu)
- Looping sounds (all sounds play once)
- Sound chains or queues
