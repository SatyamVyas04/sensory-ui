# sensory-ui — Configuration

> `sensory.config.js` (project root) + `components/ui/sensory-ui/config/config.ts` (runtime config)

The configuration system is split into two parts:

1. **`sensory.config.js`** — the user-facing config file at the project root, written in plain JavaScript (passed to `<SensoryUIProvider config={...}>` at runtime)
2. **`config.ts`** — exports `defaultConfig`, `mergeConfig()`, and `resolveRole()` for use by the provider and engine

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
	// Map any SoundRole to a custom audio source.
	// Values can be:
	//   - A URL path to a file in public/ (e.g. "/sounds/custom/my-click.mp3")
	//   - A base64 data URI (e.g. "data:audio/mp3;base64,//uQx...")
	// These take precedence over the built-in base64 modules in sounds/*.ts.
	// -------------------------------------------------------------------
	overrides: {
		// Example overrides (all commented out by default):
		// "activation.primary":  "/sounds/custom/my-click.mp3",
		// "navigation.forward":  "data:audio/mp3;base64,...",
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

## config.ts — Runtime Config

The config module exports:

1. `defaultConfig` — sensible defaults used when no config prop is provided
2. `mergeConfig(user)` — deep-merges user overrides on top of `defaultConfig`
3. `resolveRole(role, config)` — looks up a `SoundSource` for a given role, respecting category toggles, user overrides, and the active pack

```ts
// components/ui/sensory-ui/config/config.ts

import type { SoundRole, SoundCategory } from "./sound-roles";
import { packRegistry, type SoundPackName } from "./registry";
import type { SoundSource } from "./engine";

export interface SensoryUIConfig {
	enabled: boolean;
	volume: number;
	/** Active sound pack. Supports built-in pack names and arbitrary strings for custom packs. */
	theme: SoundPackName | (string & {});
	categories: Record<SoundCategory, boolean>;
	overrides: Partial<Record<SoundRole, string>>;
	reducedMotion: "inherit" | "force-off" | "force-on";
}

/** Defaults — used when no config prop is passed to `<SensoryUIProvider>`. */
export const defaultConfig: SensoryUIConfig = {
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

export function mergeConfig(user: Partial<SensoryUIConfig>): SensoryUIConfig {
	return {
		...defaultConfig,
		...user,
		categories: {
			...defaultConfig.categories,
			...(user.categories ?? {}),
		},
		overrides: {
			...defaultConfig.overrides,
			...(user.overrides ?? {}),
		},
	};
}

/**
 * Resolve a SoundRole to its audio source.
 *
 * Resolution priority:
 *   1. config.overrides[role]    — user-defined string override (URL or base64)
 *   2. packRegistry[theme][role] — SoundSynthesizer from the active pack
 *   3. packRegistry.default[role]— fallback if theme is unknown
 *   4. null                       — category disabled or role not found
 */
export function resolveRole(
	role: SoundRole,
	config: SensoryUIConfig,
): SoundSource | null {
	const category = role.split(".")[0] as SoundCategory;

	if (config.categories[category] === false) return null;

	// User override takes highest priority (always a string/URL)
	const override = config.overrides[role];
	if (override) return override;

	// Look up the active pack, fall back to "default" if pack name is unknown
	const packName = config.theme as SoundPackName;
	const pack = packRegistry[packName] ?? packRegistry.default;
	const source = pack[role];

	return source ?? null;
}
```

---

## Configuration Options — Quick Reference

| Key                        | Type                                                                            | Default     | Description                                            |
| -------------------------- | ------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------ |
| `enabled`                  | `boolean`                                                                       | `true`      | Global on/off. `false` silences everything.            |
| `volume`                   | `number` (0–1)                                                                  | `0.35`      | Master volume multiplier.                              |
| `theme`                    | `SoundPackName \| (string & {})` — `"default"`, `"arcade"`, `"wind"`, `"retro"` | `"default"` | Active sound pack. Selects a built-in synthesizer set. |
| `categories.activation`    | `boolean`                                                                       | `true`      | Enable/disable all activation sounds.                  |
| `categories.navigation`    | `boolean`                                                                       | `true`      | Enable/disable all navigation sounds.                  |
| `categories.notifications` | `boolean`                                                                       | `true`      | Enable/disable all notification sounds.                |
| `categories.system`        | `boolean`                                                                       | `true`      | Enable/disable all system sounds.                      |
| `categories.hero`          | `boolean`                                                                       | `false`     | Enable/disable hero sounds (off by default).           |
| `overrides["role.name"]`   | `string`                                                                        | —           | Custom audio source for a role.                        |
| `reducedMotion`            | `"inherit" \| "force-off" \| "force-on"`                                        | `"inherit"` | Reduced-motion behaviour.                              |

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

When `playSound` is called with a role, the audio source is resolved in this order:

```
1. config.overrides["role.name"]        → string override (URL or base64), if defined
2. packRegistry[config.theme]["role"]   → SoundSynthesizer from the active pack
3. packRegistry.default["role"]         → fallback to default pack if theme is unknown
4. null                                 → category disabled or role not found → no-op
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
