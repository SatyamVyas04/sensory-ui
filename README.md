<div align="center">
  <img width="1897" height="1125" alt="readme-banner" src="https://github.com/user-attachments/assets/389899c0-6ef9-4791-9624-d198c799ba85" />

  <h1>sensory-ui</h1>
  <p>A semantic, opt-in sound layer for React and Next.js apps.<br/>17 sound roles · 9 sound packs · 24 components — built for <a href="https://ui.shadcn.com">shadcn/ui</a>.</p>

  <p>
    <a href="https://sensory-ui.com">Website</a> ·
    <a href="#quick-installation">Install</a> ·
    <a href="#sound-packs">Sound Packs</a> ·
    <a href="#sound-roles">Sound Roles</a> ·
    <a href="#available-components">Components</a>
  </p>
</div>

---

## Table of Contents

- [Quick Installation](#quick-installation)
- [Setup](#setup)
- [Configuration](#configuration)
- [Sound Packs](#sound-packs)
- [Sound Roles](#sound-roles)
- [Available Components](#available-components)
- [Development](#development)
- [License](#license)

---

## Quick Installation

Install the full library with a single command via the shadcn CLI:

```bash
npx shadcn@latest add https://sensory-ui.com/r/sensory-ui
```

Or pick only what you need:

```bash
# Core engine only (no components)
npx shadcn@latest add https://sensory-ui.com/r/sensory-ui-core

# A single component
npx shadcn@latest add https://sensory-ui.com/r/sensory-ui-button
npx shadcn@latest add https://sensory-ui.com/r/sensory-ui-dialog
```

> **Prerequisites:** Next.js 13.4+, shadcn/ui initialised (`components.json` present), Node.js 18+.

---

## Setup

### 1. Wrap your app with the provider

```tsx
// app/layout.tsx
import { SensoryUIProvider } from "@/components/ui/sensory-ui/config/provider";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<SensoryUIProvider>{children}</SensoryUIProvider>
			</body>
		</html>
	);
}
```

### 2. Use sound-enabled components

Drop in any sensory-ui component the same way you'd use its shadcn counterpart — just add a `sound` prop:

```tsx
import { Button } from "@/components/ui/sensory-ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/sensory-ui/dialog";

// Single sound role
<Button sound="interaction.tap">Save</Button>

// Object form with open/close sounds
<Dialog sound={{ open: "overlay.open", close: "overlay.close" }}>
  ...
</Dialog>
```

### 3. Use the hook directly (optional)

For anything not covered by a patched component, use the `usePlaySound` hook:

```tsx
import { usePlaySound } from "@/components/ui/sensory-ui/config/use-play-sound";

function MyComponent() {
	const { play } = usePlaySound({ sound: "interaction.subtle" });
	return <div onMouseEnter={play}>Hover me</div>;
}
```

---

## Configuration

After installation, a `sensory.config.js` file is created at your project root. Pass it to the provider at runtime:

```tsx
import config from "@/sensory.config.js";

<SensoryUIProvider config={config}>{children}</SensoryUIProvider>;
```

```js
// sensory.config.js
module.exports = {
	enabled: true, // global kill-switch
	volume: 0.35, // master volume (0.0 – 1.0)
	theme: "aero", // active sound pack

	categories: {
		interaction: true,
		navigation: true,
		notification: true,
		overlay: true,
		hero: false, // disabled by default — must opt in
	},

	overrides: {
		// Map any role to a custom audio file or base64 URI
		// "interaction.tap": "/sounds/my-click.mp3",
	},

	reducedMotion: "inherit", // "inherit" | "force-off" | "force-on"
};
```

You can also pass config inline to the provider without a config file:

```tsx
<SensoryUIProvider config={{ theme: "arcade", volume: 0.5 }}>
	{children}
</SensoryUIProvider>
```

---

## Sound Packs

Nine built-in packs — all synthesized via the Web Audio API at runtime. No audio files, no network requests.

| Pack         | Character                                                 |
| ------------ | --------------------------------------------------------- |
| `soft`       | Warm, rounded, gentle — felt mallets on soft pads         |
| `aero`       | Airy, breathy, ethereal — wind through chimes _(default)_ |
| `arcade`     | 8-bit chiptune — square waves, punchy NES vibe            |
| `organic`    | Natural, warm, wooden — marimba and wood blocks           |
| `glass`      | Crystalline, bright — struck glass or bells               |
| `industrial` | Metallic, harsh, mechanical — machines and metal          |
| `minimal`    | Clean, sparse, understated — pure tones only              |
| `retro`      | Analog synth — vintage dual-detuned sawtooth              |
| `crisp`      | Sharp, defined, precise — tight envelopes                 |

Switch packs with a one-line change:

```js
// sensory.config.js
module.exports = { theme: "glass" };
```

---

## Sound Roles

17 semantic roles across 5 categories. Every sound maps to a meaningful interaction type — nothing is decorative.

### `interaction` — Direct user actions (40–90 ms)

| Role                  | Trigger                         |
| --------------------- | ------------------------------- |
| `interaction.tap`     | Primary button click            |
| `interaction.subtle`  | Slider drag, command keypress   |
| `interaction.toggle`  | Checkbox, switch, radio, toggle |
| `interaction.confirm` | Form submit, save confirm       |

### `overlay` — Surface open / close (120–300 ms)

| Role               | Trigger                               |
| ------------------ | ------------------------------------- |
| `overlay.open`     | Dialog, sheet, dropdown open          |
| `overlay.close`    | Dialog, sheet, dropdown close         |
| `overlay.expand`   | Accordion expand, collapsible open    |
| `overlay.collapse` | Accordion collapse, collapsible close |

### `navigation` — Moving through space (100–250 ms)

| Role                  | Trigger                              |
| --------------------- | ------------------------------------ |
| `navigation.forward`  | Next step, next page, carousel next  |
| `navigation.backward` | Back button, previous, carousel prev |
| `navigation.tab`      | Tab switch, segment switch           |

### `notification` — System feedback (200–600 ms)

| Role                   | Trigger                          |
| ---------------------- | -------------------------------- |
| `notification.info`    | Info toast, passive alert        |
| `notification.success` | Success toast, form saved        |
| `notification.warning` | Quota alert, confirmation needed |
| `notification.error`   | Error toast, connection failed   |

### `hero` — Celebratory moments (800–1800 ms) _(disabled by default)_

| Role             | Trigger                           |
| ---------------- | --------------------------------- |
| `hero.complete`  | Checklist complete, upload done   |
| `hero.milestone` | Onboarding finished, first action |

> Hero sounds must be explicitly enabled in `sensory.config.js` via `categories: { hero: true }`.

---

## Available Components

25 installable components. Each is a drop-in replacement for its shadcn/ui counterpart with an added `sound` prop.

|                   |                 |                |
| ----------------- | --------------- | -------------- |
| `accordion`       | `alert-dialog`  | `button`       |
| `carousel`        | `checkbox`      | `collapsible`  |
| `command`         | `context-menu`  | `dialog`       |
| `drawer`          | `dropdown-menu` | `menubar`      |
| `navigation-menu` | `pagination`    | `popover`      |
| `radio-group`     | `select`        | `sheet`        |
| `sidebar`         | `slider`        | `switch`       |
| `tabs`            | `toggle`        | `toggle-group` |
| `core`            |                 |                |

Install any component individually:

```bash
npx shadcn@latest add https://sensory-ui.com/r/sensory-ui-<name>
# e.g.
npx shadcn@latest add https://sensory-ui.com/r/sensory-ui-tabs
```

---

## Development

```bash
# Clone and install
git clone https://github.com/SatyamVyas04/sensory-ui.git
cd sensory-ui
npm install

# Start dev server
npm run dev

# Lint & format
npm run check
npm run fix

# Build registry
npm run registry:build
```

The dev server runs the landing page at `http://localhost:3000`, including the interactive component showcase. Registry manifests are served from `app/r/[name]/route.ts`.

---

## License

[MIT](./LICENSE) — free to use in personal and commercial projects.

---

<div align="center">
  <p>Built by <a href="https://twitter.com/SatyamVyas04">@SatyamVyas04</a></p>
</div>
