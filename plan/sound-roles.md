# sensory-ui - Sound Roles & Categories

> `components/ui/sensory-ui/config/sound-roles.ts`

This document defines every semantic sound role in sensory-ui, the rationale behind the category structure, and the TypeScript type definitions.

---

## Category Overview

Sound roles are organised into five top-level **categories**. Each category represents a distinct class of UI feedback at a different emotional register and duration.

| Category       | Count | Default Enabled | Duration Range | Character                      |
| -------------- | ----- | --------------- | -------------- | ------------------------------ |
| `interaction`  | 4     | Yes             | 40–90 ms       | Short transients, soft attack  |
| `overlay`      | 4     | Yes             | 120–300 ms     | Tonal pairs (open ↔ close)     |
| `navigation`   | 3     | Yes             | 100–250 ms     | Low-volume sweeps, directional |
| `notification` | 4     | Yes             | 200–600 ms     | Two-tier intensity             |
| `hero`         | 2     | **No**          | 800–1800 ms    | Celebratory, longer form       |

Total: **17 sounds**

---

## Category: `interaction`

Fired when the user performs a direct action — pressing a button, toggling a state, confirming a form, or providing subtle feedback during continuous interactions.

| Role    | Full Key              | Duration | Description                                                         | Typical Trigger                     |
| ------- | --------------------- | -------- | ------------------------------------------------------------------- | ----------------------------------- |
| Tap     | `interaction.tap`     | ~8 ms    | The default click/tap sound. Noise click, bandpass 4000 Hz.         | Primary button click                |
| Subtle  | `interaction.subtle`  | ~4 ms    | Secondary soft click. Highpass 3000 Hz. Quieter than tap.           | Slider drag, command input keypress |
| Toggle  | `interaction.toggle`  | ~52 ms   | Noise click (12 ms) + tonal tail (40 ms). Tick-tock state change.   | Checkbox, switch, radio, toggle     |
| Confirm | `interaction.confirm` | ~10 ms   | Crisp noise click, bandpass 5000 Hz. Brighter than tap.             | Form submit, save confirm           |

**Design notes:**

- No hard transient attacks. All sounds should feel like gentle taps.
- `interaction.subtle` is the quietest sound in this category — designed for high-frequency interactions (slider drags, keystrokes) where a full tap would be too intrusive.
- `interaction.toggle` is distinct from `interaction.tap` — it conveys state change via a noise click followed by a tonal sweep tail.
- `interaction.confirm` should feel resolved and crisp — brighter bandpass filter than tap.
- There is no `interaction.disabled` role — disabled buttons cannot be clicked, so no sound is needed.

---

## Category: `navigation`

Fired when the user moves through space — between pages, tabs, or steps.

| Role     | Full Key              | Duration   | Description                                           | Typical Trigger                           |
| -------- | --------------------- | ---------- | ----------------------------------------------------- | ----------------------------------------- |
| Forward  | `navigation.forward`  | 150–250 ms | A rightward / upward sweep.                           | Next step, next page, carousel next       |
| Backward | `navigation.backward` | 150–250 ms | A leftward / downward sweep. Tonal mirror of forward. | Back button, previous step, carousel prev |
| Tab      | `navigation.tab`      | 100–180 ms | Whoosh-style noise burst with sine envelope and filter sweep. | Tab switch, segment switch, pagination    |

**Design notes:**

- `navigation.forward` and `navigation.backward` should be **tonal inversions** of each other (same harmonic content, opposite pitch arc).
- `navigation.tab` is for lateral movement where direction is not meaningful — tabs, pagination links. It uses a whoosh-style noise burst rather than a tonal sweep.
- All navigation sounds should have a sweep quality, not a stab or click quality.
- The `navigation.scroll` role was removed in the taxonomy simplification — scroll-snap sounds are now either omitted or handled via `interaction.tap`.

---

## Category: `notification`

Fired when the system delivers feedback to the user — toasts, alerts, banners, inline validation messages.

| Role    | Full Key               | Duration   | Description                                  | Typical Trigger                  |
| ------- | ---------------------- | ---------- | -------------------------------------------- | -------------------------------- |
| Info    | `notification.info`    | 200–350 ms | Neutral information. Soft single chime.      | Info toast, passive alert        |
| Success | `notification.success` | 250–400 ms | Two ascending notes (positive feeling).      | Success toast, form saved        |
| Warning | `notification.warning` | 300–450 ms | Same note twice (attention-getting).         | Quota alert, confirmation needed |
| Error   | `notification.error`   | 300–450 ms | Two descending notes (negative connotation). | Error toast, connection failed   |

**Design notes:**

- `notification.info` should feel like a whisper — something you hear but don't need to act on. Renamed from `passive` for clarity.
- `notification.success` uses ascending notes (C5 → E5) for a positive, resolved feeling.
- `notification.warning` repeats the same note twice (A4 → A4) to grab attention without negativity.
- `notification.error` uses descending tritone (B4 → F4) for tension/negative feeling without being harsh.
- The category name changed from `notifications` (plural) to `notification` (singular) for consistency with other category names.

---

## Category: `overlay`

Fired when UI surfaces open, close, expand, or collapse. These are structural changes to the visual layout.

| Role     | Full Key           | Duration   | Description                         | Typical Trigger                           |
| -------- | ------------------ | ---------- | ----------------------------------- | ----------------------------------------- |
| Open     | `overlay.open`     | 150–250 ms | A gentle expansion sound.           | Dialog open, sheet open, dropdown open    |
| Close    | `overlay.close`    | 150–250 ms | Tonal inverse of open. Collapse.    | Dialog close, sheet close, dropdown close |
| Expand   | `overlay.expand`   | 120–220 ms | Lighter than open. Content reveals. | Accordion expand, collapsible open        |
| Collapse | `overlay.collapse` | 120–220 ms | Paired with expand. Content hides.  | Accordion collapse, collapsible close     |

**Design notes:**

- `overlay.open` / `overlay.close` are a **tonal inversion pair**: if open rises in pitch, close falls.
- `overlay.expand` / `overlay.collapse` are the same idea but shorter and lighter. Accordion feels smaller than a Dialog.
- The `system.focus` role was removed from the taxonomy — focus sounds are non-standard and should not be applied automatically.
- The category name changed from `system` to `overlay` to better describe the nature of these surface-level changes.

---

## Category: `hero`

Fired for significant completion moments - task completion, onboarding milestones, achievement unlocks. These are special-occasion sounds and are **disabled by default** in `sensory.config.js`.

| Role      | Full Key         | Duration     | Description                        | Typical Trigger                        |
| --------- | ---------------- | ------------ | ---------------------------------- | -------------------------------------- |
| Complete  | `hero.complete`  | 800–1200 ms  | Task done. Clear resolve.          | Checklist complete, upload done        |
| Milestone | `hero.milestone` | 1200–1800 ms | Major achievement. Richer, longer. | Onboarding finished, first action ever |

**Design notes:**

- These are the only sounds in sensory-ui that are allowed to be longer than 1 second.
- Both should feel rewarding, not over-the-top.
- `hero.milestone` is intentionally richer - it can have a small harmonic tail.
- Because Hero is disabled by default, developers must explicitly enable it in `sensory.config.js` and then assign the sound prop. This double opt-in prevents accidental hero sounds in production.

---

## TypeScript Type Definitions

```ts
// components/ui/sensory-ui/config/sound-roles.ts

export type SoundCategory =
	| "interaction"
	| "overlay"
	| "navigation"
	| "notification"
	| "hero";

export type InteractionRole =
	| "interaction.tap"
	| "interaction.subtle"
	| "interaction.toggle"
	| "interaction.confirm";

export type OverlayRole =
	| "overlay.open"
	| "overlay.close"
	| "overlay.expand"
	| "overlay.collapse";

export type NavigationRole =
	| "navigation.forward"
	| "navigation.backward"
	| "navigation.tab";

export type NotificationRole =
	| "notification.info"
	| "notification.success"
	| "notification.warning"
	| "notification.error";

export type HeroRole = "hero.complete" | "hero.milestone";

export type SoundRole =
	| InteractionRole
	| OverlayRole
	| NavigationRole
	| NotificationRole
	| HeroRole;

/** All valid role strings - useful for validation and config autocompletion. */
export const ALL_SOUND_ROLES: SoundRole[] = [
	"interaction.tap",
	"interaction.subtle",
	"interaction.toggle",
	"interaction.confirm",
	"overlay.open",
	"overlay.close",
	"overlay.expand",
	"overlay.collapse",
	"navigation.forward",
	"navigation.backward",
	"navigation.tab",
	"notification.info",
	"notification.success",
	"notification.warning",
	"notification.error",
	"hero.complete",
	"hero.milestone",
];

/** Parse a SoundRole string into its category and name parts. */
export function parseRole(role: SoundRole): {
	category: SoundCategory;
	name: string;
} {
	const [category, name] = role.split(".") as [SoundCategory, string];
	return { category, name };
}
```

---

## Role Registry

```ts
// components/ui/sensory-ui/config/registry.ts

import type { SoundRole } from "./sound-roles";
import type { SoundSource } from "./engine";
import {
	softPack,
	aeroPack,
	arcadePack,
	organicPack,
	glassPack,
	industrialPack,
	minimalPack,
	retroPack,
	crispPack,
} from "../sounds/packs";

/**
 * Built-in sound pack names.
 */
export type SoundPackName =
	| "soft"
	| "aero"
	| "arcade"
	| "organic"
	| "glass"
	| "industrial"
	| "minimal"
	| "retro"
	| "crisp";

/**
 * All built-in sound packs, keyed by their SoundPackName.
 * Each pack maps all 17 SoundRole strings to SoundSynthesizer functions.
 */
export const packRegistry: Record<SoundPackName, SoundPack> = {
	soft: softPack,
	aero: aeroPack,
	arcade: arcadePack,
	organic: organicPack,
	glass: glassPack,
	industrial: industrialPack,
	minimal: minimalPack,
	retro: retroPack,
	crisp: crispPack,
};

/**
 * Default sound pack name ("aero" - balanced, pleasant, professional).
 */
export const DEFAULT_PACK: SoundPackName = "aero";
```

---

## Audio Specifications (for custom overrides)

When providing custom audio source overrides via `config.overrides`, the URL-based files should meet these requirements:

| Requirement              | Spec                                                                          |
| ------------------------ | ----------------------------------------------------------------------------- |
| Format                   | `.mp3` (primary) - maximum browser compatibility                              |
| Fallback format          | `.ogg` (optional, for open-source licensing preference)                       |
| Sample rate              | 44.1 kHz or 48 kHz                                                            |
| Bit depth                | 16-bit                                                                        |
| Channels                 | Mono (L+R identical) - stereo is allowed but mono preferred for smaller files |
| Peak normalization       | −1.0 dBTP (true peak)                                                         |
| Leading silence          | None - trimmed to first transient                                             |
| Trailing silence         | ≤ 20 ms tail, then trimmed                                                    |
| Per-category size budget | ≤ 50 KB total per category                                                    |
| Per-file size guideline  | ≤ 15 KB per file                                                              |

**Why MP3?** Web Audio API's `decodeAudioData` supports MP3 universally across modern browsers. WAV files are larger with no Web Audio benefit. OGG is optional for developers who want to replace the sound pack with their own recordings under open licenses.

---

## Custom Sound Pack

Users can replace any role's audio in two ways:

1. **Use config overrides** - point individual roles to a custom URL path in `sensory.config.js`:

```js
overrides: {
  "interaction.tap":  "/sounds/custom/my-click.mp3",
  "hero.complete":    "/sounds/custom/fanfare.mp3",
}
```

2. **Create a custom instrument/pack** - see `sounds/README.md` for the tunes + instruments API.

Custom override URLs bypass the synthesizer - the engine fetches them by URL as normal. Custom files must still meet the normalization and format spec above.
