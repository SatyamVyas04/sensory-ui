# sensory-ui — Installation & Setup

This document describes the full installation flow, what files are created, how the provider is configured, and how to verify everything is working.

---

## Prerequisites

- Next.js 13.4+ (App Router or Pages Router)
- `shadcn/ui` already initialised in the project (`components.json` present)
- Node.js 18+

---

## Step 1: Install via shadcn CLI

```bash
npx shadcn@latest add https://sensory-ui.dev/r/sensory-ui
```

The CLI will:

1. Download the registry manifest from the sensory-ui registry
2. Present a prompt to choose a **sound pack** (see below)
3. Copy all files into the project
4. Print a short post-install message with the next steps

> Registry URL is a placeholder until the publishing step is complete. See [registry.md](./registry.md) for the publishing plan.

---

## Step 2: Choose a Sound Pack

During installation the CLI will prompt:

```
? Choose a sound pack:
  > default        (clean, modern SaaS — filtered noise clicks + sine sweeps)
    arcade         (8-bit chiptune — square waves, stepped pitch, NES vibe)
    wind           (organic/airy — bandpass noise bursts + wind chime hybrids)
    retro          (synthwave — dual detuned sawtooth, chord stabs, Moog vibe)
```

**What this choice does:**

- Sets the `theme` field in `sensory.config.js` to the chosen pack name
- At runtime, `resolveRole()` looks up `packRegistry[theme][role]` and returns a `SoundSynthesizer` function that generates audio via the Web Audio API — no audio files, no network requests

All packs use the same role names and registry structure. Swapping packs later is a one-line change in `sensory.config.js` or passing `config={{ theme: "arcade" }}` to `SensoryUIProvider`. See [sound-packs.md](./sound-packs.md) for per-pack sound design details.

---

## Step 3: Files Created by the Installer

```
components/ui/sensory-ui/
  config/
    engine.ts
    provider.tsx
    config.ts
    sound-roles.ts
    registry.ts
    use-play-sound.ts
  sounds/
    activation.ts
    navigation.ts
    notifications.ts
    system.ts
    hero.ts
    arcade.ts
    wind.ts
    retro.ts
    README.md
  button.tsx
  dialog.tsx
  dropdown-menu.tsx
  tabs.tsx
  select.tsx
  checkbox.tsx
  switch.tsx
  accordion.tsx
  sheet.tsx

sensory.config.js       ← generated at project root
```

**Design goal:** Everything inside `components/ui/sensory-ui/`. Audio is generated **programmatically** via the Web Audio API inside `sensory-ui/sounds/` — no files in `public/`, no asset serving, no base64 blobs. The only file outside that folder is:

- `sensory.config.js` — project-root config (optional, can be deleted to use defaults)

---

## Step 4: Wrap the App in SensoryUIProvider

The provider must wrap the entire component tree to ensure the `AudioContext` persists across navigations and all components have access to the `playSound` function.

### App Router (`app/layout.tsx`)

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

### Pages Router (`pages/_app.tsx`)

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

The provider is a client component. The root layout can remain a server component — Next.js allows client components to receive and render server component children transparently.

---

## Step 5: Use a Sound-Enabled Component

Import the Button (or any other component) directly from `sensory-ui` and pass a `sound` prop:

```tsx
import { Button } from "@/components/ui/sensory-ui/button";

export function SaveButton() {
	return (
		<Button sound="activation.primary" onClick={handleSave}>
			Save
		</Button>
	);
}
```

The `sound` prop is the **only required change** from the standard shadcn/ui usage. All other props, variants, and behaviour are identical.

---

## Step 6: Verify Installation

### Visual check

Open the browser devtools console and look for any sensory-ui warnings. In development mode, the engine logs a warning if a sound file cannot be fetched.

### Quick test

Temporarily set `volume: 1.0` in `sensory.config.js` and click a Button with `sound="activation.primary"`. You should hear the activation sound.

### Silence check

If you hear nothing:

1. Check that `SensoryUIProvider` wraps the component you are testing
2. Check that `sensory.config.js` has `enabled: true`
3. Check that the `sounds/*.ts` modules were installed correctly (open `components/ui/sensory-ui/sounds/activation.ts` and verify it exports `SoundSynthesizer` functions, not empty strings)
4. Check that the click is a direct user gesture (not triggered on mount)
5. Check that your browser has not blocked the `AudioContext` — Chrome suspends it until a user gesture. The engine resumes it automatically on the first `playSound()` call.

---

## Updating sensory-ui

To update the engine and primitives to a newer version:

```bash
npx shadcn@latest add https://sensory-ui.dev/r/sensory-ui --overwrite
```

The `--overwrite` flag replaces the engine, config loader, primitive files, and the embedded sound modules in `sounds/*.ts`.

No user-owned file is ever overwritten automatically.

---

## Uninstalling

There is no uninstall command. To remove sensory-ui:

1. Delete `components/ui/sensory-ui/`
2. Delete `sensory.config.js`
3. Remove `<SensoryUIProvider>` from the root layout
4. Revert any components that import from `@/components/ui/sensory-ui/*` back to their original shadcn imports

---

## File Ownership Model

| File/Directory                                 | Owned by               | Auto-updated         |
| ---------------------------------------------- | ---------------------- | -------------------- |
| `components/ui/sensory-ui/config/engine.ts`    | sensory-ui             | On `add --overwrite` |
| `components/ui/sensory-ui/config/provider.tsx` | sensory-ui             | On `add --overwrite` |
| `components/ui/sensory-ui/*.tsx`               | sensory-ui             | On `add --overwrite` |
| `components/ui/sensory-ui/config/registry.ts`  | sensory-ui             | On `add --overwrite` |
| `components/ui/sensory-ui/sounds/*.ts`         | sensory-ui (all packs) | On `add --overwrite` |
| `sensory.config.js`                            | **User**               | Never (user-owned)   |
