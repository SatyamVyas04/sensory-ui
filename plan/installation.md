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
npx shadcn@latest add https://<registry-url>/sensory-ui
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
  > default        (balanced, general-purpose UI sounds)
    minimal        (very short, near-silent feedback only)
    expressive     (richer, longer sounds with more character)
    none           (no audio files — bring your own)
```

**What this choice does:**

- Copies the corresponding `.mp3` files into `public/sounds/`
- Sets the `theme` field in `sensory.config.js` to the chosen pack name

All packs use the same role names and registry structure. Swapping packs later is done by replacing the files in `public/sounds/` and optionally updating `sensory.config.js`.

---

## Step 3: Files Created by the Installer

```
components/ui/sensory-ui/
  engine.ts              ← Web Audio engine
  provider.tsx           ← SensoryUIProvider React context
  config.ts              ← Runtime config loader
  sound-roles.ts         ← SoundRole TypeScript types
  registry.ts            ← Role → file path mapping
  primitives/
    button.tsx
    dialog.tsx
    dropdown-menu.tsx
    tabs.tsx
    select.tsx
    checkbox.tsx
    switch.tsx
    alert.tsx
    toast.tsx

public/sounds/
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
  custom/               ← empty, user-managed

sensory.config.js       ← generated at project root
```

**Design goal:** Everything stays inside `components/ui/sensory-ui/`. The only files outside that folder are:

- `public/sounds/` — static audio assets (must be in `public/` for Next.js to serve them)
- `sensory.config.js` — project-root config (optional, can be deleted to use defaults)

---

## Step 4: Wrap the App in SensoryUIProvider

The provider must wrap the entire component tree to ensure the `AudioContext` persists across navigations and all components have access to the `playSound` function.

### App Router (`app/layout.tsx`)

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

### Pages Router (`pages/_app.tsx`)

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

The provider is a client component. The root layout can remain a server component — Next.js allows client components to receive and render server component children transparently.

---

## Step 5: Use a Sound-Enabled Component

Import the Button (or any other component) from `sensory-ui/primitives` and pass a `sound` prop:

```tsx
import { Button } from "@/components/ui/sensory-ui/primitives/button";

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
3. Check that `public/sounds/activation/primary.mp3` exists and is accessible at `http://localhost:3000/sounds/activation/primary.mp3`
4. Check that the click is a direct user gesture (not triggered on mount)

---

## Updating sensory-ui

To update the engine and primitives to a newer version:

```bash
npx shadcn@latest add https://<registry-url>/sensory-ui --overwrite
```

The `--overwrite` flag replaces the engine, config loader, and primitive files. Sound files in `public/sounds/` are **not overwritten** unless the user explicitly passes `--overwrite-sounds`.

Custom files in `public/sounds/custom/` are **never touched** by the installer.

---

## Uninstalling

There is no uninstall command. To remove sensory-ui:

1. Delete `components/ui/sensory-ui/`
2. Delete `public/sounds/`
3. Delete `sensory.config.js`
4. Remove `<SensoryUIProvider>` from the root layout
5. Revert any components that import from `sensory-ui/primitives` back to their original shadcn imports

---

## File Ownership Model

| File/Directory                              | Owned by                  | Auto-updated         |
| ------------------------------------------- | ------------------------- | -------------------- |
| `components/ui/sensory-ui/engine.ts`        | sensory-ui                | On `add --overwrite` |
| `components/ui/sensory-ui/provider.tsx`     | sensory-ui                | On `add --overwrite` |
| `components/ui/sensory-ui/primitives/*.tsx` | sensory-ui                | On `add --overwrite` |
| `components/ui/sensory-ui/registry.ts`      | sensory-ui                | On `add --overwrite` |
| `sensory.config.js`                         | **User**                  | Never (user-owned)   |
| `public/sounds/activation/`                 | sensory-ui (default pack) | On `add --overwrite` |
| `public/sounds/custom/`                     | **User**                  | Never                |
