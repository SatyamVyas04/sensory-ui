# sensory-ui — Component API & Usage

> `components/ui/sensory-ui/primitives/*.tsx`

This document describes the component API — how the `sound` prop works, what event triggers are supported, how primitive wrappers are structured, and how to use sensory-ui with components that are not yet wrapped.

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
| `DropdownMenu`   | `onOpenChange`                                                               | Same as Dialog                                                |
| `Sheet`          | `onOpenChange`                                                               | Same as Dialog                                                |
| `Tabs`           | `onValueChange` → `navigation.switch`                                        | Fires when active tab changes                                 |
| `Select`         | `onOpenChange`                                                               | Open/close sounds                                             |
| `Checkbox`       | `onCheckedChange`                                                            | `activation.confirm` on check, `activation.subtle` on uncheck |
| `Switch`         | `onCheckedChange`                                                            | Same pattern as Checkbox                                      |
| `Alert/Toast`    | On render / `onOpenChange`                                                   | `notifications.*` roles                                       |
| `Accordion`      | `onValueChange`                                                              | `system.expand` / `system.collapse`                           |

---

## Button Primitive — Detailed Spec

The Button primitive is the most commonly used sensory-ui component. It wraps the shadcn Button and adds sound playback on the primary interaction event.

```tsx
// components/ui/sensory-ui/primitives/button.tsx

"use client";

import * as React from "react";
import {
	Button as ShadcnButton,
	type ButtonProps,
} from "@/components/ui/button";
import { useSensoryUI } from "../provider";
import type { SoundRole } from "../sound-roles";

interface SensoryButtonProps extends ButtonProps {
	/**
	 * The sound role to play when the button is clicked.
	 * If omitted, the button behaves exactly like a standard Button.
	 */
	sound?: SoundRole;
}

const Button = React.forwardRef<HTMLButtonElement, SensoryButtonProps>(
	({ sound, onClick, onKeyDown, ...props }, ref) => {
		const { playSound } = useSensoryUI();

		const handleClick = React.useCallback(
			(e: React.MouseEvent<HTMLButtonElement>) => {
				if (sound) {
					// Fire and forget — do not await; must not delay the click handler
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
			<ShadcnButton
				ref={ref}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
				{...props}
			/>
		);
	},
);

Button.displayName = "SensoryButton";

export { Button };
export type { SensoryButtonProps as ButtonProps };
```

**Key implementation details:**

- `void playSound(sound)` — never `await`. The click handler must return synchronously.
- Both `onClick` and `onKeyDown` are intercepted so keyboard users get the same audio feedback as pointer users.
- The original `onClick` and `onKeyDown` handlers (if provided) are always called, even if `playSound` throws.
- The component uses `forwardRef` to preserve ref transparency.

---

## Dialog Primitive — Detailed Spec

Dialog is more complex than Button because it has two distinct sound moments: open and close. The `sound` prop on Dialog should be interpreted as the **open sound**. The close sound is automatically the tonal complement.

```tsx
// components/ui/sensory-ui/primitives/dialog.tsx

"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useSensoryUI } from "../provider";
import type { SoundRole } from "../sound-roles";

interface SensoryDialogProps extends React.ComponentPropsWithoutRef<
	typeof DialogPrimitive.Root
> {
	/**
	 * Sound to play when the dialog opens.
	 * Defaults to "system.open" if sound category is enabled.
	 * The close sound is automatically paired.
	 */
	sound?: SoundRole;
	/**
	 * Override the close sound separately. Defaults to "system.close".
	 */
	closeSound?: SoundRole;
}

function Dialog({
	sound,
	closeSound,
	onOpenChange,
	...props
}: SensoryDialogProps) {
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

export { Dialog };
```

---

## Tabs Primitive — Detailed Spec

```tsx
// components/ui/sensory-ui/primitives/tabs.tsx

"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { useSensoryUI } from "../provider";
import type { SoundRole } from "../sound-roles";

interface SensoryTabsProps extends React.ComponentPropsWithoutRef<
	typeof TabsPrimitive.Root
> {
	/** Sound to play when the active tab changes. Default suggestion: "navigation.switch" */
	sound?: SoundRole;
}

function Tabs({ sound, onValueChange, ...props }: SensoryTabsProps) {
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

// TabsList, TabsTrigger, TabsContent are re-exported as-is from shadcn.
export { Tabs };
```

---

## General Primitive Wrapper Template

Every new primitive wrapper follows this exact structure:

```tsx
"use client";

import * as React from "react";
import { OriginalComponent } from "@/components/ui/<component>";
import { useSensoryUI } from "../provider";
import type { SoundRole } from "../sound-roles";

interface SensoryComponentProps extends OriginalComponentProps {
	sound?: SoundRole;
}

const Component = React.forwardRef<HTMLElement, SensoryComponentProps>(
	({ sound, onInteractionEvent, ...props }, ref) => {
		const { playSound } = useSensoryUI();

		const handleEvent = React.useCallback(
			(eventArgs) => {
				if (sound) void playSound(sound);
				onInteractionEvent?.(eventArgs);
			},
			[sound, playSound, onInteractionEvent],
		);

		return (
			<OriginalComponent
				ref={ref}
				onInteractionEvent={handleEvent}
				{...props}
			/>
		);
	},
);

Component.displayName = "SensoryComponent";
export { Component };
```

Rules for new wrappers:

1. Always `"use client"` at the top
2. Always use `React.forwardRef` unless the component has no DOM element
3. Always call the original event handler after triggering sound
4. Never `await playSound` — fire and forget
5. Never add default sounds — `sound` must be explicitly provided
6. Always re-export the original type with the `sound` prop appended

---

## Available Primitives (v1.0)

| Component      | File                           | Primary Event   | Notes                         |
| -------------- | ------------------------------ | --------------- | ----------------------------- |
| `Button`       | `primitives/button.tsx`        | click + keydown | Most used                     |
| `Dialog`       | `primitives/dialog.tsx`        | open/close      | Pairs open + close sounds     |
| `DropdownMenu` | `primitives/dropdown-menu.tsx` | open/close      | Same pattern as Dialog        |
| `Sheet`        | `primitives/sheet.tsx`         | open/close      | Same pattern as Dialog        |
| `Tabs`         | `primitives/tabs.tsx`          | value change    | `navigation.switch` typical   |
| `Select`       | `primitives/select.tsx`        | open/close      | Same pattern as Dialog        |
| `Checkbox`     | `primitives/checkbox.tsx`      | checked change  | Check / uncheck distinction   |
| `Switch`       | `primitives/switch.tsx`        | checked change  | Same as Checkbox              |
| `Accordion`    | `primitives/accordion.tsx`     | value change    | Expand / collapse distinction |
| `Alert`        | `primitives/alert.tsx`         | on render       | `notifications.*` roles       |

---

## Using the `usePlaySound` Hook (v1.5+)

For components not yet wrapped, or for custom interaction points, the `usePlaySound` hook lets any client component trigger a sound:

```ts
// components/ui/sensory-ui/use-play-sound.ts (v1.5+)

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

import { usePlaySound } from "@/components/ui/sensory-ui/use-play-sound";

export function CustomSlider() {
	const playSound = usePlaySound();

	return <Slider onValueCommit={() => playSound("activation.confirm")} />;
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

- `sound` prop on components from `@/components/ui/` directly — must use `sensory-ui/primitives/`
- Hover sounds in v1.0 (`hoverSound` is planned for v1.5)
- Multiple sounds on the same interaction (one role per event)
- Looping sounds (all sounds play once)
- Sound chains or queues
