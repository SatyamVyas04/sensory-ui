# sensory-ui — Project Overview

> A semantic, modular, opt-in sound layer for React/Next.js apps, distributed as a **shadcn/ui registry package**.

---

## What Is sensory-ui?

sensory-ui adds meaningful, non-intrusive sound feedback to UI interactions. It is not a sound effects library, not a music player, and not a game audio engine. It is a thin, composable sound layer that sits alongside your existing shadcn/ui components and responds only when you explicitly ask it to.

The core idea is simple: UI interactions have meaning, and sound can reinforce that meaning — a soft click when a primary action fires, a short sweep when you navigate forward, a calming chime when a success notification appears. sensory-ui provides the infrastructure to wire those semantic sounds to the right moments, with full developer control and full accessibility compliance.

**Target platform:** Next.js (App Router and Pages Router) + React  
**Distribution:** shadcn/ui registry (CLI installable)  
**Runtime footprint:** Minimal — no bundled audio, no global side effects, no forced re-renders

---

## Core Philosophy

| Principle                     | What It Means in Practice                                                                                                                 |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Semantic, not decorative**  | Every sound maps to a meaningful interaction type (activation, navigation, system feedback). No random audio.                             |
| **Explicit opt-in only**      | No component ever makes a sound unless you pass a `sound` prop to it. Nothing is automatic.                                               |
| **Accessibility-first**       | Respects `prefers-reduced-motion`, provides a global kill-switch, and never forces audio on users.                                        |
| **Minimal runtime footprint** | The sound engine is < 3 KB minified. No heavy DSP chains, no AudioWorklets, no bundled audio blobs.                                       |
| **Registry-native**           | Built specifically for the shadcn/ui distribution model. One install command, then it lives inside your project like any other component. |
| **Composable**                | Works with any combination of Radix primitives, any shadcn/ui component, or raw HTML elements via the `usePlaySound` hook.                |

---

## Non-Goals (v1)

These are explicitly out of scope and will not be pursued in the initial version:

- Auto-attaching sounds to components without a `sound` prop
- Background music or ambient audio layers
- Game-style soundscapes or layered audio
- Heavy Web Audio DSP effects (reverb, convolution, etc.)
- Sound-triggered React re-renders
- Audio preloading on mount

---

## High-Level Architecture

sensory-ui is composed of four runtime layers and one distribution layer:

```
┌─────────────────────────────────────────────────────────────┐
│                    Your Application                         │
│                                                             │
│   <SensoryUIProvider>                ← Layer 1: Provider    │
│     <Button sound="activation.primary">                     │
│       Save                                                  │
│     </Button>                        ← Layer 2: Component   │
│   </SensoryUIProvider>                                      │
└─────────────────────────────────────────────────────────────┘
          │ triggers playSound(role)
          ▼
┌─────────────────────────────────────────────────────────────┐
│              Sound Engine (engine.ts)                       │  ← Layer 3: Engine
│  AudioContext → decode buffer → gain node → destination     │
└─────────────────────────────────────────────────────────────┘
          │ resolves path via
          ▼
┌─────────────────────────────────────────────────────────────┐
│         Role Registry + Config (registry.ts / config.ts)    │  ← Layer 4: Config
│  "activation.primary" → "/sounds/activation/primary.mp3"   │
└─────────────────────────────────────────────────────────────┘
```

**Distribution layer** (shadcn registry) is separate from runtime and is covered in [registry.md](./registry.md).

---

## File Structure After Installation

The design goal is to keep everything inside a single well-scoped folder so the footprint in the user's project is clean and easy to reason about.

```
components/
  ui/
    button.tsx                ← existing shadcn component (optionally patched)
    dialog.tsx
    ...
    sensory-ui/               ← everything sensory-ui lives here
      engine.ts               ← Web Audio engine (core)
      provider.tsx            ← SensoryUIProvider (React context)
      config.ts               ← runtime config loader
      sound-roles.ts          ← TypeScript types for all SoundRole values
      registry.ts             ← role → file path mapping
      use-play-sound.ts       ← usePlaySound(role) hook
      components/
        button.tsx            ← patched shadcn Button with sound prop
        dialog.tsx
        dropdown-menu.tsx
        tabs.tsx
        select.tsx
        checkbox.tsx
        switch.tsx
        accordion.tsx
        sheet.tsx
        ...                   ← one patched source file per supported component

public/
  sounds/                     ← audio files (served statically)
    activation/
      primary.mp3
      subtle.mp3
      confirm.mp3
      error.mp3
    navigation/
      forward.mp3
      backward.mp3
      switch.mp3
      scroll.mp3
    notifications/
      passive.mp3
      important.mp3
      success.mp3
      warning.mp3
    system/
      open.mp3
      close.mp3
      expand.mp3
      collapse.mp3
      focus.mp3
    hero/
      complete.mp3
      milestone.mp3
    custom/                   ← user-managed, not tracked by sensory-ui

sensory.config.js             ← optional project-root config file
```

> Audio files live in `public/sounds/` so Next.js serves them as static assets via the `/_next/static` pipeline without any server-side involvement.

---

## Plan Document Index

| Document                             | Description                                            |
| ------------------------------------ | ------------------------------------------------------ |
| [overview.md](./overview.md)         | This file — project-wide context and structure         |
| [engine.md](./engine.md)             | Web Audio engine design and implementation spec        |
| [provider.md](./provider.md)         | React provider architecture and context API            |
| [sound-roles.md](./sound-roles.md)   | All sound categories, roles, durations, and file specs |
| [installation.md](./installation.md) | Installation flow, CLI steps, post-install setup       |
| [config.md](./config.md)             | Configuration file format and all options              |
| [components.md](./components.md)     | Component API, `sound` prop usage, event triggers      |
| [registry.md](./registry.md)         | shadcn registry publishing (deferred — future work)    |
| [agents.md](./agents.md)             | Original architecture and agent responsibilities doc   |

---

## Roadmap Summary

### v1.0 — Core

- shadcn registry distribution
- 19 base sounds across 5 categories
- `SensoryUIProvider` wrapping the whole app
- `sound` prop on Button and ~8–12 common Radix components
- `sensory.config.js` with volume, enable/disable, overrides
- Full SSR safety and reduced-motion compliance

### v1.5 — Developer Ergonomics

- `usePlaySound(role)` hook for arbitrary trigger points
- Per-role volume multipliers in config
- CLI helper to toggle categories interactively

### v2.0 — Extended (Nice to Have)

- Visual sound-role editor in the browser
- Optional Web Audio mode with basic filter effects
- Multiple named themes / sound packs switchable at runtime

---

## Quick Example

```tsx
// app/layout.tsx
import { SensoryUIProvider } from "@/components/ui/sensory-ui/provider";

export default function RootLayout({ children }) {
	return (
		<html>
			<body>
				<SensoryUIProvider>{children}</SensoryUIProvider>
			</body>
		</html>
	);
}
```

```tsx
// Any component
import { Button } from "@/components/ui/sensory-ui/components/button";

export function SaveButton() {
	return (
		<Button sound="activation.primary" onClick={handleSave}>
			Save
		</Button>
	);
}
```

That's all a developer needs to do. The rest is handled by the engine, provider, and config system working together.
