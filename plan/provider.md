# sensory-ui — Provider Architecture

> `components/ui/sensory-ui/config/provider.tsx`

The `SensoryUIProvider` is a React context provider that wraps the entire application. It acts as the global configuration hub for the sound engine — managing whether sounds are enabled, what volume to use, and providing the `playSound` function to any sensory-ui component deep in the tree.

---

## Why a Provider?

Without a provider, each sensory-ui component would need to independently read the config, check accessibility preferences, and call the engine. This creates several problems:

1. **Navigation persistence**: In Next.js App Router, layout components persist across navigations. A provider mounted at the root layout level will keep the `AudioContext` alive across page transitions, so there is no re-initialization cost or audio gap mid-navigation.
2. **Global state**: Whether sounds are enabled, muted, or at a certain volume is a cross-cutting concern. It belongs in one place.
3. **Single AudioContext**: The browser allows (and prefers) a single `AudioContext` per page. The provider ensures only one is ever created, regardless of how many sensory-ui components are rendered.
4. **HMR safety**: In development, the provider can close and re-open the `AudioContext` on hot module replacement, preventing stale state.

---

## Provider Responsibilities

| Responsibility                                | Details                                                                                         |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Accept optional `config` prop at runtime      | Merged on top of `defaultConfig` via `mergeConfig()`; pass your `sensory.config.js` values here |
| Expose `playSound(role, options)` via context | So any child component can trigger a sound without importing the engine directly                |
| Check `prefers-reduced-motion`                | Read the media query once on mount, update on change                                            |
| Provide global mute toggle                    | For developer tooling, storybook, testing                                                       |
| Manage `AudioContext` lifecycle               | Create on first use, resume after suspension, clean up on unmount in dev                        |

---

## Context Shape

```ts
// components/ui/sensory-ui/config/provider.tsx

import { createContext, useContext } from "react";
import type { SoundRole } from "./sound-roles";
import type { PlaySoundOptions, SoundPlayback } from "./engine";

export interface SensoryUIContextValue {
	/**
	 * Play a sound by its semantic role.
	 * Resolves the file path, applies master volume, checks accessibility flags.
	 * Returns a SoundPlayback handle (with .stop()) or null if sound is suppressed.
	 */
	playSound: (
		role: SoundRole,
		options?: PlaySoundOptions,
	) => Promise<SoundPlayback | null>;

	/**
	 * Whether the sound system is globally enabled.
	 * Reflects both sensory.config.js `enabled` flag and the reduced-motion preference.
	 */
	enabled: boolean;

	/**
	 * Master volume level (0–1). Sourced from sensory.config.js.
	 */
	volume: number;

	/**
	 * Programmatically mute/unmute all sounds without changing the config.
	 * Useful for tests, Storybook, or a UI mute toggle.
	 */
	setMuted: (muted: boolean) => void;

	/**
	 * Whether the user has activated the mute toggle.
	 */
	muted: boolean;
}

export const SensoryUIContext = createContext<SensoryUIContextValue | null>(
	null,
);

> **Note:** `SensoryUIContext` is intentionally **not exported** from the actual implementation.
> Consumers must use the `useSensoryUI()` hook, which provides a proper error message
> if called outside the provider.

export function useSensoryUI(): SensoryUIContextValue {
	const ctx = useContext(SensoryUIContext);
	if (!ctx) {
		throw new Error("useSensoryUI must be used inside <SensoryUIProvider>");
	}
	return ctx;
}
```

---

## Provider Implementation Plan

```tsx
// components/ui/sensory-ui/config/provider.tsx

"use client"; // Required for Next.js App Router — provider uses hooks

import * as React from "react";
import {
	closeAudioContext,
	playSound as enginePlaySound,
	type PlaySoundOptions,
	type SoundPlayback,
} from "./engine";
import {
	defaultConfig,
	mergeConfig,
	resolveRole,
	type SensoryUIConfig,
} from "./config";
import type { SoundRole } from "./sound-roles";

interface SensoryUIProviderProps {
	children: React.ReactNode;
	/**
	 * Override config programmatically (e.g., in Storybook or tests).
	 * These are merged on top of sensory.config.js values.
	 */
	config?: Partial<SensoryUIConfig>;
}

export function SensoryUIProvider({
	children,
	config: configOverride,
}: SensoryUIProviderProps) {
	const config = React.useMemo(
		() => mergeConfig(configOverride ?? {}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[JSON.stringify(configOverride)],
	);

	const [muted, setMuted] = React.useState(false);
	const reducedMotion = useReducedMotion(config.reducedMotion);
	const shouldPlay = config.enabled && !muted && !reducedMotion;

	const playSound = React.useCallback(
		async (
			role: SoundRole,
			options: PlaySoundOptions = {},
		): Promise<SoundPlayback | null> => {
			if (typeof window === "undefined") return null;
			if (!shouldPlay) return null;

			// resolveRole handles category-disabled check + pack lookup
			const source = resolveRole(role, config);
			if (!source) return null;

			// Apply master volume
			const finalVolume = (options.volume ?? 1) * config.volume;

			try {
				return await enginePlaySound(source, {
					...options,
					volume: finalVolume,
				});
			} catch (err) {
				// Silently swallow audio errors — they should never crash the UI
				if (process.env.NODE_ENV === "development") {
					console.warn(
						"[sensory-ui] Failed to play sound:",
						role,
						err,
					);
				}
				return null;
			}
		},
		[shouldPlay, config],
	);

	// Clean up AudioContext on unmount in development
	React.useEffect(() => {
		if (process.env.NODE_ENV !== "development") return;
		return () => {
			void closeAudioContext();
		};
	}, []);

	const value = React.useMemo(
		() => ({
			playSound,
			enabled: shouldPlay,
			volume: config.volume,
			muted,
			setMuted,
		}),
		[playSound, shouldPlay, config.volume, muted],
	);

	return (
		<SensoryUIContext.Provider value={value}>
			{children}
		</SensoryUIContext.Provider>
	);
}
```

---

## Reduced Motion Hook

The provider reads `prefers-reduced-motion` as a media query. The behaviour is governed by the `reducedMotion` field in `sensory.config.js`:

```ts
function useReducedMotion(pref: SensoryUIConfig["reducedMotion"]): boolean {
	const [matches, setMatches] = React.useState(() => {
		if (typeof window === "undefined") return false;
		return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	});

	React.useEffect(() => {
		if (typeof window === "undefined") return;
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, []);

	if (pref === "force-off") return true; // Always suppress (treat as reduced)
	if (pref === "force-on") return false; // Always play, ignore user preference
	return matches; // "inherit" — respect OS/browser setting
}
```

---

## Mounting in Next.js App Router

```tsx
// app/layout.tsx

import { SensoryUIProvider } from "@/components/ui/sensory-ui/config/provider";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body>
				<SensoryUIProvider>{children}</SensoryUIProvider>
			</body>
		</html>
	);
}
```

Since `SensoryUIProvider` is a client component (`"use client"`), the root layout itself can remain a server component. Next.js allows client components to render server component children, so this pattern is fully compatible with the App Router.

---

## Mounting in Next.js Pages Router

```tsx
// pages/_app.tsx

import { SensoryUIProvider } from "@/components/ui/sensory-ui/config/provider";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<SensoryUIProvider>
			<Component {...pageProps} />
		</SensoryUIProvider>
	);
}
```

---

## Provider Props

| Prop       | Type                       | Default     | Description                                                                                                                    |
| ---------- | -------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `children` | `ReactNode`                | —           | Required. The entire application tree.                                                                                         |
| `config`   | `Partial<SensoryUIConfig>` | `undefined` | Optional runtime config overrides, merged on top of `sensory.config.js`. Useful for Storybook stories or testing environments. |

---

## Why `"use client"` Is Required

The provider uses:

- `useState` — to manage the muted state
- `useEffect` — to watch `prefers-reduced-motion` changes and clean up on unmount
- `useCallback / useMemo` — to stabilise context values

All of these require a client boundary. The provider adds exactly one `"use client"` directive in the whole sensory-ui system. Every primitive component that imports `useSensoryUI` will also be a client component.

---

## Error Boundary Behaviour

The provider catches audio errors internally and logs them in development. The UI is never affected by a failed audio playback. A failed `decodeAudioData` or `ctx.resume()` is swallowed with a `console.warn`.

---

## Testing and Storybook

Pass a `config` override to the provider to disable sounds or mock them in tests:

```tsx
// In a test or Storybook story
<SensoryUIProvider config={{ enabled: false }}>
	<YourComponent />
</SensoryUIProvider>
```

This avoids any real audio during automated or visual tests.
