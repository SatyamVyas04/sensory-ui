# sensory-ui — Configuration

> `sensory.config.js` (project root) + `components/ui/sensory-ui/config.ts` (runtime loader)

The configuration system is split into two parts:

1. **`sensory.config.js`** — the user-facing config file at the project root, written in plain JavaScript
2. **`config.ts`** — the runtime loader inside sensory-ui that reads the config and exposes a typed interface to the engine and provider

---

## sensory.config.js — Full Reference

This file is generated at project root during installation. It is user-owned and never overwritten by updates.

```js
// sensory.config.js
module.exports = {
	// -------------------------------------------------------------------
	// Global kill-switch.
	// Set to false to silence ALL sounds throughout the app without
	// removing any code. Useful for staging environments or QA reviews.
	// -------------------------------------------------------------------
	enabled: true,

	// -------------------------------------------------------------------
	// Master volume multiplier. Range: 0.0 – 1.0.
	// Applied to every sound before playback. Individual sounds can be
	// further controlled with the per-call volume option, but this is
	// the global ceiling.
	// -------------------------------------------------------------------
	volume: 0.35,

	// -------------------------------------------------------------------
	// Sound pack / theme name.
	// Currently informational only (determines which files were copied
	// at install time). Future versions may use this to switch between
	// multiple installed packs at runtime.
	// -------------------------------------------------------------------
	theme: "default",

	// -------------------------------------------------------------------
	// Per-category enable/disable toggles.
	// All unspecified categories default to true.
	// Setting a category to false silences every role in that category,
	// even if a component has the sound prop set.
	// -------------------------------------------------------------------
	categories: {
		activation: true,
		navigation: true,
		notifications: true,
		system: true,
		hero: false, // Hero is disabled by default — must be explicitly enabled
	},

	// -------------------------------------------------------------------
	// Role-level overrides.
	// Map any SoundRole to a custom file path (relative to public/).
	// These take precedence over the built-in registry.
	// The "custom/" directory is the recommended location for user files.
	// -------------------------------------------------------------------
	overrides: {
		// Example overrides (all commented out by default):
		// "activation.primary":  "/sounds/custom/my-click.mp3",
		// "navigation.forward":  "/sounds/custom/swoosh.mp3",
		// "hero.complete":        "/sounds/custom/fanfare.ogg",
	},

	// -------------------------------------------------------------------
	// Reduced-motion handling.
	// "inherit"   → respect the user's OS/browser prefers-reduced-motion setting
	// "force-off" → always suppress sounds, regardless of user preference
	// "force-on"  → always play sounds, ignore prefers-reduced-motion
	//
	// Default: "inherit"
	// Only change this if you have a specific UX reason to override
	// the user's accessibility preference.
	// -------------------------------------------------------------------
	reducedMotion: "inherit",
};
```

---

## config.ts — Runtime Loader

The config loader is responsible for:

1. Importing `sensory.config.js` (in Next.js this works via a dynamic import with a server-side read, or by bundling the config as a module)
2. Merging it with default values so missing keys never cause errors
3. Exposing a typed `SensoryUIConfig` object to the provider and engine

```ts
// components/ui/sensory-ui/config.ts

import type { SoundRole, SoundCategory } from "./sound-roles";
import { roleRegistry } from "./registry";

export interface SensoryUIConfig {
	enabled: boolean;
	volume: number;
	theme: string;
	categories: Record<SoundCategory, boolean>;
	overrides: Partial<Record<SoundRole, string>>;
	reducedMotion: "inherit" | "force-off" | "force-on";
}

/** Defaults — used when sensory.config.js is absent or has missing keys. */
const defaults: SensoryUIConfig = {
	enabled: true,
	volume: 0.35,
	theme: "default",
	categories: {
		activation: true,
		navigation: true,
		notifications: true,
		system: true,
		hero: false,
	},
	overrides: {},
	reducedMotion: "inherit",
};

/**
 * Load and merge config from sensory.config.js.
 * Falls back to defaults for any missing keys.
 *
 * This function is called once inside the provider on mount.
 * It is NOT called on every render.
 */
export async function loadConfig(): Promise<SensoryUIConfig> {
	try {
		// Dynamic import so the config is bundled at build time in Next.js
		const userConfig = await import("../../../sensory.config.js");
		return mergeConfig(userConfig.default ?? userConfig);
	} catch {
		// sensory.config.js does not exist — use defaults silently
		return defaults;
	}
}

function mergeConfig(user: Partial<SensoryUIConfig>): SensoryUIConfig {
	return {
		...defaults,
		...user,
		categories: {
			...defaults.categories,
			...(user.categories ?? {}),
		},
		overrides: {
			...defaults.overrides,
			...(user.overrides ?? {}),
		},
	};
}

/**
 * Resolve a SoundRole to its final file URL.
 * Priority: config.overrides → roleRegistry default
 *
 * Returns null if:
 * - The role's category is disabled in config.categories
 * - The role does not exist in the registry (bad role string)
 */
export function resolveRole(
	role: SoundRole,
	config: SensoryUIConfig,
): string | null {
	const category = role.split(".")[0] as SoundCategory;

	if (config.categories[category] === false) return null;

	const overrideUrl = config.overrides[role];
	if (overrideUrl) return overrideUrl;

	return roleRegistry[role] ?? null;
}
```

---

## Configuration Options — Quick Reference

| Key                        | Type                                     | Default     | Description                                  |
| -------------------------- | ---------------------------------------- | ----------- | -------------------------------------------- |
| `enabled`                  | `boolean`                                | `true`      | Global on/off. `false` silences everything.  |
| `volume`                   | `number` (0–1)                           | `0.35`      | Master volume multiplier.                    |
| `theme`                    | `string`                                 | `"default"` | Pack name. Informational in v1.0.            |
| `categories.activation`    | `boolean`                                | `true`      | Enable/disable all activation sounds.        |
| `categories.navigation`    | `boolean`                                | `true`      | Enable/disable all navigation sounds.        |
| `categories.notifications` | `boolean`                                | `true`      | Enable/disable all notification sounds.      |
| `categories.system`        | `boolean`                                | `true`      | Enable/disable all system sounds.            |
| `categories.hero`          | `boolean`                                | `false`     | Enable/disable hero sounds (off by default). |
| `overrides["role.name"]`   | `string`                                 | —           | Custom file path for a specific role.        |
| `reducedMotion`            | `"inherit" \| "force-off" \| "force-on"` | `"inherit"` | Reduced-motion behaviour.                    |

---

## Volume Guidelines

The default master volume is `0.35` (35%). This is intentionally low. UI sounds should be background-level — noticeable but not distracting.

Suggested ranges:

| Scenario                               | Recommended `volume` |
| -------------------------------------- | -------------------- |
| Subtle background feedback             | 0.15 – 0.25          |
| Default / balanced                     | 0.30 – 0.40          |
| Expressive / gaming-adjacent           | 0.50 – 0.70          |
| Accessibility demo (clear and audible) | 0.80 – 1.00          |

---

## Category Toggles in Practice

If a client wants no system sounds (open/close dialogs), without removing any code:

```js
categories: {
  system: false,
}
```

All components with `sound="system.open"` or `sound="system.close"` will silently no-op. The `sound` prop is still valid — it just resolves to null in the engine when the category is off.

---

## Override Resolution Order

When `playSound` is called with a role, the URL is resolved in this order:

```
1. config.overrides["role.name"]  → if defined, use this path
2. roleRegistry["role.name"]      → built-in default path
3. null                           → category disabled or unknown role → no-op
```

---

## Future: Per-Role Volume Multipliers (v1.5)

In v1.5, the config will support per-role volume multipliers in addition to the master volume:

```js
// sensory.config.js (v1.5 preview)
roleVolumes: {
  "navigation.scroll": 0.2,   // Very quiet
  "hero.complete":     0.8,   // Louder than default
}
```

Final volume = `masterVolume × roleVolume × perCallVolume`

---

## Environment-Specific Config

For CI/testing environments, set `enabled: false` via an environment variable check:

```js
// sensory.config.js
module.exports = {
	enabled: process.env.NODE_ENV !== "test",
	volume: 0.35,
	// ...
};
```

This is the recommended pattern for keeping audio out of automated test runs without needing to mock the provider.
