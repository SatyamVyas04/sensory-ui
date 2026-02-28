# sensory-ui - Component API & Usage

> `components/ui/sensory-ui/*.tsx`

This document describes the component API - how the `sound` prop works, what event triggers are supported, how patched source components are structured, and how to use sensory-ui with components that are not yet wrapped.

---

## The `sound` Prop

Every sensory-ui primitive component accepts one optional prop on top of its usual API:

```ts
sound?: SoundRole
```

Where `SoundRole` is one of the 19 semantic role strings defined in [sound-roles.md](./sound-roles.md).

**When the `sound` prop is absent: the component behaves identically to its original shadcn/ui counterpart. No audio is produced.**

This is the fundamental opt-in rule. sensory-ui never plays audio unless `sound` is explicitly provided.

---

## Event Triggers

Different components fire sounds at different interaction points. The key rule is: **sounds must only fire from direct user interaction events** (pointer events, keyboard events). They must never fire from lifecycle methods, effects, or programmatic state changes.

| Component        | Default Sound Trigger                                                        | Notes                                                         |
| ---------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `Button`         | `onClick` / `onKeyDown` (Enter, Space)                                       | Most common usage                                             |
| `Button` (hover) | `onMouseEnter`                                                               | Only if `hoverSound` prop provided (v1.5+)                    |
| `Dialog`         | `onOpenChange(true)` → `system.open`, `onOpenChange(false)` → `system.close` | Fires on open and close separately                            |
| `DropdownMenu`   | `onOpenChange`                                                               | Per-item `sound` on `DropdownMenuItem` too                    |
| `Sheet`          | `onOpenChange`                                                               | Same as Dialog                                                |
| `Tabs`           | `onValueChange` → `navigation.switch`                                        | Fires when active tab changes                                 |
| `Select`         | `onOpenChange`                                                               | Open/close sounds                                             |
| `Checkbox`       | `onCheckedChange`                                                            | `activation.confirm` on check, `activation.subtle` on uncheck |
| `Switch`         | `onCheckedChange`                                                            | Same pattern as Checkbox                                      |
| `Alert/Toast`    | On render / `onOpenChange`                                                   | `notifications.*` roles                                       |
| `Accordion`      | `onValueChange`                                                              | `system.expand` / `system.collapse`                           |

---

## Button Primitive - Detailed Spec

The Button primitive is the most commonly used sensory-ui component. It wraps the shadcn Button and adds sound playback on the primary interaction event.

```tsx
// components/ui/sensory-ui/button.tsx

"use client";

import * as React from "react";
// Full shadcn Button source is copied here - not imported from @/components/ui/button.
// Only the root Button function is patched; buttonVariants and sub-exports are verbatim.
import { useSensoryUI } from "./config/provider";
import type { SoundRole } from "./config/sound-roles";
// ...full shadcn source...

function Button({
	sound,
	onClick,
	onKeyDown,
	...props
}: ButtonProps & { sound?: SoundRole }) {
	const { playSound } = useSensoryUI();

	const handleClick = React.useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			if (sound) {
				// Fire and forget - do not await; must not delay the click handler
				void playSound(sound);
			}
			onClick?.(e);
		},
		[sound, playSound, onClick],
	);

	const handleKeyDown = React.useCallback(
		(e: React.KeyboardEvent<HTMLButtonElement>) => {
			if (sound && (e.key === "Enter" || e.key === " ")) {
				void playSound(sound);
			}
			onKeyDown?.(e);
		},
		[sound, playSound, onKeyDown],
	);

	return (
		<button onClick={handleClick} onKeyDown={handleKeyDown} {...props} />
	);
}

export { Button, buttonVariants };
```

**Key implementation details:**

- `void playSound(sound)` - never `await`. The click handler must return synchronously.
- Both `onClick` and `onKeyDown` are intercepted so keyboard users get the same audio feedback as pointer users.
- The original `onClick` and `onKeyDown` handlers (if provided) are always called, even if `playSound` throws.
- React 19 style: no `forwardRef` needed - `ComponentProps<"button">` handles the ref natively.

---

## Dialog Component - Detailed Spec

Dialog is more complex than Button because it has two distinct sound moments: open and close. The `sound` prop on Dialog should be interpreted as the **open sound**. The close sound is automatically the tonal complement.

```tsx
// components/ui/sensory-ui/dialog.tsx

"use client";

import * as React from "react";
// Full shadcn Dialog source is copied here. Only the Dialog root function is patched.
import { Dialog as DialogPrimitive } from "radix-ui"; // unified radix-ui package
import { useSensoryUI } from "./config/provider";
import type { SoundRole } from "./config/sound-roles";

function Dialog({
	sound,
	closeSound,
	onOpenChange,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Root> & {
	sound?: SoundRole;
	closeSound?: SoundRole;
}) {
	const { playSound } = useSensoryUI();

	const handleOpenChange = React.useCallback(
		(open: boolean) => {
			if (open && sound) {
				void playSound(sound);
			} else if (!open && (closeSound ?? sound)) {
				void playSound(closeSound ?? "system.close");
			}
			onOpenChange?.(open);
		},
		[sound, closeSound, playSound, onOpenChange],
	);

	return <DialogPrimitive.Root onOpenChange={handleOpenChange} {...props} />;
}
// DialogContent, DialogHeader, DialogTitle, etc. are verbatim from shadcn.
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
// Full shadcn Tabs source is copied here. Only the Tabs root function is patched.
import { Tabs as TabsPrimitive } from "radix-ui"; // unified radix-ui package
import { useSensoryUI } from "./config/provider";
import type { SoundRole } from "./config/sound-roles";

function Tabs({
	sound,
	onValueChange,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Root> & { sound?: SoundRole }) {
	const { playSound } = useSensoryUI();

	const handleValueChange = React.useCallback(
		(value: string) => {
			if (sound) void playSound(sound);
			onValueChange?.(value);
		},
		[sound, playSound, onValueChange],
	);

	return <TabsPrimitive.Root onValueChange={handleValueChange} {...props} />;
}

// TabsList, TabsTrigger, TabsContent are verbatim from shadcn source.
export { Tabs, TabsList, TabsTrigger, TabsContent };
```

---

## General Patched Component Template

Every patched component follows this exact structure:

```tsx
"use client";

// Full shadcn source is copied verbatim into this file.
// ONLY the root component function is patched - all sub-components are untouched.

import * as React from "react";
import { SomeComponent as SomePrimitive } from "radix-ui"; // unified radix-ui package
import { useSensoryUI } from "./config/provider";
import type { SoundRole } from "./config/sound-roles";
// ...rest of verbatim shadcn imports...

// Patched root function - added sound prop + handler interception
function Component({
	sound,
	onInteractionEvent,
	...props
}: React.ComponentProps<typeof SomePrimitive.Root> & { sound?: SoundRole }) {
	const { playSound } = useSensoryUI();

	const handleEvent = React.useCallback(
		(eventArgs) => {
			if (sound) void playSound(sound);
			onInteractionEvent?.(eventArgs);
		},
		[sound, playSound, onInteractionEvent],
	);

	return <SomePrimitive.Root onInteractionEvent={handleEvent} {...props} />;
}

// Verbatim sub-components from shadcn (ComponentContent, ComponentTrigger, etc.)
// ...

export { Component, ComponentContent, ComponentTrigger /* etc. */ };
```

Rules for patched components:

1. Always `"use client"` at the top
2. Do **not** use `React.forwardRef` - React 19 `ComponentProps` handles refs natively
3. Copy the **full** shadcn source, patch only the root function
4. Always call the original event handler after triggering sound
5. Never `await playSound` - fire and forget
6. Never add default sounds - `sound` must be explicitly provided
7. Imports use `radix-ui` (unified package), never `@radix-ui/react-*`

---

## Available Components (v0.5)

| Component        | File                  | Primary Event   | Notes                                  |
| ---------------- | --------------------- | --------------- | -------------------------------------- |
| `Accordion`      | `accordion.tsx`       | value change    | Expand / collapse distinction          |
| `AlertDialog`    | `alert-dialog.tsx`    | open/close      | Same pattern as Dialog                 |
| `Button`         | `button.tsx`          | click + keydown | Most used                              |
| `Carousel`       | `carousel.tsx`        | slide change    | Navigation sounds                      |
| `Checkbox`       | `checkbox.tsx`        | checked change  | Check / uncheck distinction            |
| `Collapsible`    | `collapsible.tsx`     | open/close      | Close falls back to `system.collapse`  |
| `Command`        | `command.tsx`         | selection       | Command palette sounds                 |
| `ContextMenu`    | `context-menu.tsx`    | open/close      | Same pattern as Dialog                 |
| `Dialog`         | `dialog.tsx`          | open/close      | Pairs open + close sounds              |
| `Drawer`         | `drawer.tsx`          | open/close      | Same pattern as Dialog                 |
| `DropdownMenu`   | `dropdown-menu.tsx`   | open/close      | Per-item `sound` on `DropdownMenuItem` |
| `Menubar`        | `menubar.tsx`         | open/close      | Same pattern as Dialog                 |
| `NavigationMenu` | `navigation-menu.tsx` | value change    | Navigation sounds                      |
| `Pagination`     | `pagination.tsx`      | page change     | Navigation sounds                      |
| `Popover`        | `popover.tsx`         | open/close      | Same pattern as Dialog                 |
| `RadioGroup`     | `radio-group.tsx`     | value change    | Selection sounds                       |
| `Select`         | `select.tsx`          | open/close      | Same pattern as Dialog                 |
| `Sheet`          | `sheet.tsx`           | open/close      | Same pattern as Dialog                 |
| `Sidebar`        | `sidebar.tsx`         | open/close      | Navigation sounds                      |
| `Slider`         | `slider.tsx`          | value change    | Activation sounds                      |
| `Switch`         | `switch.tsx`          | checked change  | Same as Checkbox                       |
| `Tabs`           | `tabs.tsx`            | value change    | `navigation.switch` typical            |
| `ToggleGroup`    | `toggle-group.tsx`    | value change    | Selection sounds                       |
| `Toggle`         | `toggle.tsx`          | pressed change  | Activation sounds                      |

---

## Using the `usePlaySound` Hook (v1.5+)

For components not yet wrapped, or for custom interaction points, the `usePlaySound` hook lets any client component trigger a sound:

```ts
// components/ui/sensory-ui/config/use-play-sound.ts

import { useSensoryUI } from "./provider";
import type { SoundRole } from "./sound-roles";
import type { PlaySoundOptions } from "./engine";

export function usePlaySound() {
	const { playSound } = useSensoryUI();
	return (role: SoundRole, options?: PlaySoundOptions) => {
		void playSound(role, options);
	};
}
```

Usage:

```tsx
"use client";

import { usePlaySound } from "@/components/ui/sensory-ui/config/use-play-sound";

export function CustomSlider() {
	const { play } = usePlaySound({ sound: "activation.confirm" });

	return <Slider onValueCommit={play} />;
}
```

---

## Common Usage Patterns

### Primary action button

```tsx
<Button sound="activation.primary">Save changes</Button>
```

### Destructive action (error feedback)

```tsx
<Button variant="destructive" sound="activation.error" onClick={handleDelete}>
	Delete account
</Button>
```

### Navigation forward / backward

```tsx
<Button sound="navigation.forward" onClick={goNext}>Next →</Button>
<Button sound="navigation.backward" onClick={goPrev}>← Back</Button>
```

### Dialog with open/close sounds

```tsx
<Dialog sound="system.open">
	<DialogTrigger asChild>
		<Button>Open settings</Button>
	</DialogTrigger>
	<DialogContent>...</DialogContent>
</Dialog>
```

### Tabs with navigation sound

```tsx
<Tabs defaultValue="overview" sound="navigation.switch">
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
	// sound="notifications.success" is set on the Toast primitive internally
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

- `sound` prop on components from `@/components/ui/` directly - must use `@/components/ui/sensory-ui/<component>`
- Hover sounds in v1.0 (`hoverSound` is planned for v1.5)
- Multiple sounds on the same interaction (one role per event)
- Looping sounds (all sounds play once)
- Sound chains or queues
