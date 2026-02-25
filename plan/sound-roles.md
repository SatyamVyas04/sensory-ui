# sensory-ui — Sound Roles & Categories

> `components/ui/sensory-ui/config/sound-roles.ts`

This document defines every semantic sound role in sensory-ui v1.0, the rationale behind the category structure, file specifications for audio assets, and the TypeScript type definitions.

---

## Category Overview

Sound roles are organised into five top-level **categories**. Each category represents a distinct class of UI feedback at a different emotional register and duration.

| Category        | Count | Default Enabled | Duration Range | Character                      |
| --------------- | ----- | --------------- | -------------- | ------------------------------ |
| `activation`    | 4     | Yes             | 40–90 ms       | Short transients, soft attack  |
| `navigation`    | 4     | Yes             | 100–250 ms     | Low-volume sweeps, directional |
| `notifications` | 4     | Yes             | 200–600 ms     | Two-tier intensity             |
| `system`        | 5     | Yes             | 120–400 ms     | Tonal pairs (open ↔ close)     |
| `hero`          | 2     | **No**          | 800–1800 ms    | Celebratory, longer form       |

Total: **19 sounds**

---

## Category: `activation`

Fired when the user performs a primary direct action — pressing a button, confirming a form, triggering an error.

| Role    | Full Key             | Duration | Description                                 | Typical Trigger                 |
| ------- | -------------------- | -------- | ------------------------------------------- | ------------------------------- |
| Primary | `activation.primary` | 40–60 ms | The default click/tap sound. Soft, neutral. | Primary button click            |
| Subtle  | `activation.subtle`  | 30–50 ms | Quieter variant. For secondary actions.     | Secondary button, icon button   |
| Confirm | `activation.confirm` | 60–90 ms | Slightly elevated, positive.                | Form submit, save confirm       |
| Error   | `activation.error`   | 50–80 ms | Short attention-getter, not harsh.          | Validation failure, error state |

**Design notes:**

- No hard transient attacks. All sounds should feel like gentle taps.
- `activation.subtle` should be at approximately 60% the perceived loudness of `activation.primary`.
- `activation.error` should be distinct from the others (slightly lower pitch or a flat harmonic) but should never feel alarming or jarring.

---

## Category: `navigation`

Fired when the user moves through space — between pages, tabs, steps, or scrollable areas.

| Role     | Full Key              | Duration   | Description                                           | Typical Trigger                    |
| -------- | --------------------- | ---------- | ----------------------------------------------------- | ---------------------------------- |
| Forward  | `navigation.forward`  | 150–250 ms | A rightward / upward sweep.                           | Next step, next page, forward link |
| Backward | `navigation.backward` | 150–250 ms | A leftward / downward sweep. Tonal mirror of forward. | Back button, previous step         |
| Switch   | `navigation.switch`   | 100–180 ms | Neutral lateral movement.                             | Tab switch, segment switch         |
| Scroll   | `navigation.scroll`   | 80–150 ms  | Very quiet, almost subliminal.                        | Scroll snap, virtual list jump     |

**Design notes:**

- `navigation.forward` and `navigation.backward` should be **tonal inversions** of each other (same harmonic content, opposite pitch arc).
- `navigation.scroll` is meant to be barely audible — a subtle tick, not a whoosh. Volume should be 50% of other navigation sounds.
- All navigation sounds should have a whoosh-like or sweep quality, not a stab or click quality.

---

## Category: `notifications`

Fired when the system delivers feedback to the user — toasts, alerts, banners, inline validation messages.

| Role      | Full Key                  | Duration   | Description                                 | Typical Trigger                         |
| --------- | ------------------------- | ---------- | ------------------------------------------- | --------------------------------------- |
| Passive   | `notifications.passive`   | 200–350 ms | Neutral information. Lowest intensity.      | Info toast, passive alert               |
| Important | `notifications.important` | 300–500 ms | Elevated attention. Not alarming.           | Warning alert, important banner         |
| Success   | `notifications.success`   | 250–400 ms | Positive, warm, brief resolve.              | Success toast, form saved               |
| Warning   | `notifications.warning`   | 350–600 ms | Cautionary. More presence than `important`. | Destructive action warning, quota alert |

**Design notes:**

- `notifications.passive` should feel like a whisper — something you hear but don't need to act on.
- `notifications.success` is intentionally warm and brief. Not a "win" fanfare (that's `hero.complete`). Think of it as a small, satisfying resolution.
- `notifications.warning` and `notifications.important` are both cautionary but at different intensities. Warning is the more intrusive of the two.

---

## Category: `system`

Fired when UI surfaces open, close, expand, collapse, or receive focus. These are structural changes to the visual layout.

| Role     | Full Key          | Duration   | Description                           | Typical Trigger                           |
| -------- | ----------------- | ---------- | ------------------------------------- | ----------------------------------------- |
| Open     | `system.open`     | 150–250 ms | A gentle expansion sound.             | Dialog open, sheet open, dropdown open    |
| Close    | `system.close`    | 150–250 ms | Tonal inverse of open. Collapse.      | Dialog close, sheet close, dropdown close |
| Expand   | `system.expand`   | 120–220 ms | Lighter than open. Content reveals.   | Accordion expand, collapsible open        |
| Collapse | `system.collapse` | 120–220 ms | Paired with expand. Content hides.    | Accordion collapse, collapsible close     |
| Focus    | `system.focus`    | 80–150 ms  | Very subtle. Focus ring confirmation. | Focus trap entry, modal focus gain        |

**Design notes:**

- `system.open` / `system.close` are a **tonal inversion pair**: if open rises in pitch, close falls.
- `system.expand` / `system.collapse` are the same idea but slightly shorter and lighter. Accordion feels smaller than a Dialog.
- `system.focus` is optional to implement in v1.0 — it is the most subtle sound in the whole set and must degrade gracefully if callers decide not to use it.

---

## Category: `hero`

Fired for significant completion moments — task completion, onboarding milestones, achievement unlocks. These are special-occasion sounds and are **disabled by default** in `sensory.config.js`.

| Role      | Full Key         | Duration     | Description                        | Typical Trigger                        |
| --------- | ---------------- | ------------ | ---------------------------------- | -------------------------------------- |
| Complete  | `hero.complete`  | 800–1200 ms  | Task done. Clear resolve.          | Checklist complete, upload done        |
| Milestone | `hero.milestone` | 1200–1800 ms | Major achievement. Richer, longer. | Onboarding finished, first action ever |

**Design notes:**

- These are the only sounds in sensory-ui that are allowed to be longer than 1 second.
- Both should feel rewarding, not over-the-top.
- `hero.milestone` is intentionally richer — it can have a small harmonic tail.
- Because Hero is disabled by default, developers must explicitly enable it in `sensory.config.js` and then assign the sound prop. This double opt-in prevents accidental hero sounds in production.

---

## TypeScript Type Definitions

```ts
// components/ui/sensory-ui/config/sound-roles.ts

export type SoundCategory =
	| "activation"
	| "navigation"
	| "notifications"
	| "system"
	| "hero";

export type ActivationRole =
	| "activation.primary"
	| "activation.subtle"
	| "activation.confirm"
	| "activation.error";

export type NavigationRole =
	| "navigation.forward"
	| "navigation.backward"
	| "navigation.switch"
	| "navigation.scroll";

export type NotificationsRole =
	| "notifications.passive"
	| "notifications.important"
	| "notifications.success"
	| "notifications.warning";

export type SystemRole =
	| "system.open"
	| "system.close"
	| "system.expand"
	| "system.collapse"
	| "system.focus";

export type HeroRole = "hero.complete" | "hero.milestone";

export type SoundRole =
	| ActivationRole
	| NavigationRole
	| NotificationsRole
	| SystemRole
	| HeroRole;

/** All valid role strings — useful for validation and config autocompletion. */
export const ALL_SOUND_ROLES: SoundRole[] = [
	"activation.primary",
	"activation.subtle",
	"activation.confirm",
	"activation.error",
	"navigation.forward",
	"navigation.backward",
	"navigation.switch",
	"navigation.scroll",
	"notifications.passive",
	"notifications.important",
	"notifications.success",
	"notifications.warning",
	"system.open",
	"system.close",
	"system.expand",
	"system.collapse",
	"system.focus",
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

## Role → Base64 Data URI Registry

```ts
// components/ui/sensory-ui/config/registry.ts

import type { SoundRole } from "./sound-roles";
import { activation } from "../sounds/activation";
import { navigation } from "../sounds/navigation";
import { notifications } from "../sounds/notifications";
import { system } from "../sounds/system";
import { hero } from "../sounds/hero";

/**
 * Default role → base64 data URI mapping.
 * Audio data is embedded as TypeScript modules in sounds/*.ts.
 * This file is NOT modified by config overrides at runtime.
 * Overrides in sensory.config.js are applied at runtime by the config loader.
 */
export const roleRegistry: Record<SoundRole, string> = {
	...activation,
	...navigation,
	...notifications,
	...system,
	...hero,
};
```

---

## Audio File Specifications

All sound files distributed with sensory-ui must meet these requirements:

| Requirement              | Spec                                                                          |
| ------------------------ | ----------------------------------------------------------------------------- |
| Format                   | `.mp3` (primary) — maximum browser compatibility                              |
| Fallback format          | `.ogg` (optional, for open-source licensing preference)                       |
| Sample rate              | 44.1 kHz or 48 kHz                                                            |
| Bit depth                | 16-bit                                                                        |
| Channels                 | Mono (L+R identical) — stereo is allowed but mono preferred for smaller files |
| Peak normalization       | −1.0 dBTP (true peak)                                                         |
| Leading silence          | None — trimmed to first transient                                             |
| Trailing silence         | ≤ 20 ms tail, then trimmed                                                    |
| Per-category size budget | ≤ 50 KB total per category                                                    |
| Per-file size guideline  | ≤ 15 KB per file                                                              |

**Why MP3?** Web Audio API's `decodeAudioData` supports MP3 universally across modern browsers. WAV files are larger with no Web Audio benefit. OGG is optional for developers who want to replace the sound pack with their own recordings under open licenses.

---

## Custom Sound Pack

Users can replace any role's audio in two ways:

1. **Edit the base64 data** directly in `sounds/*.ts` — replace the data URI string with your own base64-encoded audio.
2. **Use config overrides** — point individual roles to a custom URL path in `sensory.config.js`:

```js
overrides: {
  "activation.primary": "/sounds/custom/my-click.mp3",
  "hero.complete":       "/sounds/custom/fanfare.mp3",
}
```

Custom override URLs bypass the embedded base64 modules — the engine fetches them by URL as normal. Custom files must still meet the normalization and format spec above.
