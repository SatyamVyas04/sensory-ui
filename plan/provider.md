# sensory-ui — Provider Architecture

> `components/ui/sensory-ui/provider.tsx`

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

| Responsibility                                | Details                                                                          |
| --------------------------------------------- | -------------------------------------------------------------------------------- |
| Load `sensory.config.js` at runtime           | Read enabled/disabled, master volume, category toggles, overrides                |
| Expose `playSound(role, options)` via context | So any child component can trigger a sound without importing the engine directly |
| Check `prefers-reduced-motion`                | Read the media query once on mount, update on change                             |
| Provide global mute toggle                    | For developer tooling, storybook, testing                                        |
| Manage `AudioContext` lifecycle               | Create on first use, resume after suspension, clean up on unmount in dev         |

---

## Context Shape

```ts
// components/ui/sensory-ui/provider.tsx

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
// components/ui/sensory-ui/provider.tsx

"use client"; // Required for Next.js App Router — provider uses hooks

import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { playSound as enginePlaySound, closeAudioContext } from "./engine";
import { resolveRole } from "./config";
import type { SoundRole } from "./sound-roles";
import type { PlaySoundOptions, SoundPlayback } from "./engine";

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
	const [muted, setMuted] = useState(false);
	const reducedMotion = useReducedMotion();
	const config = useLoadConfig(configOverride);

	const shouldPlay = config.enabled && !muted && !reducedMotion;

	const playSound = useCallback(
		async (
			role: SoundRole,
			options: PlaySoundOptions = {},
		): Promise<SoundPlayback | null> => {
			if (typeof window === "undefined") return null;
			if (!shouldPlay) return null;

			// Check if category is disabled
			const category = role.split(".")[0] as SoundCategory;
			if (config.categories[category] === false) return null;

			// Resolve URL: override → registry default
			const url = resolveRole(role, config);
			if (!url) return null;

			// Apply master volume
			const finalVolume = (options.volume ?? 1) * config.volume;

			try {
				return await enginePlaySound(url, {
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
	useEffect(() => {
		if (process.env.NODE_ENV !== "development") return;
		return () => {
			closeAudioContext();
		};
	}, []);

	const value = useMemo(
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
function useReducedMotion(): boolean {
	const configValue = useLoadConfig().reducedMotion; // "inherit" | "force-off" | "force-on"

	if (configValue === "force-off") return true; // Always suppress sound (treat as reduced)
	if (configValue === "force-on") return false; // Always play sound, ignore user preference

	// "inherit" — respect the OS/browser setting
	const [matches, setMatches] = useState(() => {
		if (typeof window === "undefined") return false;
		return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	});

	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, []);

	return matches;
}
```

---

## Mounting in Next.js App Router

```tsx
// app/layout.tsx

import { SensoryUIProvider } from "@/components/ui/sensory-ui/provider";
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

import { SensoryUIProvider } from "@/components/ui/sensory-ui/provider";
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
