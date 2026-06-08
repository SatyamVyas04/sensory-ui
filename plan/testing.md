# sensory-ui - Testing Guide

> Commands and strategies for testing sensory-ui components from the shadcn registry.

---

## Prerequisites

```bash
# Install dependencies
npm install

# Ensure TypeScript compiles without errors
npx tsc --noEmit
```

---

## 1. TypeScript Compilation Check

The fastest way to validate all sensory-ui modules:

```bash
npx tsc --noEmit
```

This checks:

- All 17 sound roles are correctly typed
- All component `sound` props accept `SoundRole | false`
- Pack generator covers all roles
- Registry maps all 9 packs correctly

---

## 2. Development Server

```bash
npm run dev
```

Open `http://localhost:3000` and use the interactive showcase to test:

- **Button demo** — Click to hear `interaction.tap`, `interaction.confirm`, `notification.error`
- **Checkbox demo** — Toggle to hear `interaction.toggle`
- **Switch demo** — Toggle to hear `interaction.toggle`
- **Slider demo** — Drag to hear `interaction.subtle` on every value change
- **Radio demo** — Select to hear `interaction.toggle`
- **Toggle demo** — Press to hear `interaction.toggle`
- **Tabs demo** — Switch tabs to hear `navigation.tab`
- **Navigation demo** — Forward/backward to hear `navigation.forward`/`navigation.backward`
- **Overlay demos** — Dialog/sheet/accordion to hear `overlay.open`/`overlay.close`/`overlay.expand`/`overlay.collapse`
- **Notification demos** — Toasts for `notification.info`, `notification.success`, `notification.warning`, `notification.error`
- **Sound roles overview** — All 17 roles listed with play buttons

---

## 3. Build Validation

```bash
npm run build
```

Validates:

- All pages render without errors
- No missing imports or broken references
- Sound packs generate correctly at build time

---

## 4. Linting

```bash
npm run check
```

Runs `ultracite check` (Biome-based). Scopes to `components/ui/sensory-ui/**/*` via `biome.jsonc`.

Auto-fix issues:

```bash
npm run fix
```

---

## 5. Registry Validation

Validate the GitHub registry payload directly from the CLI:

```bash
npx shadcn@latest registry validate SatyamVyas04/sensory-ui
npx shadcn@latest list SatyamVyas04/sensory-ui
```

Or validate locally:

```bash
npm run registry:build    # npx shadcn@latest build
```

---

## 6. Registry Install Test

Test installing from the GitHub registry in a separate Next.js project:

```bash
# In a separate test project directory
npx shadcn@latest add SatyamVyas04/sensory-ui/sensory-ui
```

Or install individual components:

```bash
npx shadcn@latest add SatyamVyas04/sensory-ui/sensory-ui-core
npx shadcn@latest add SatyamVyas04/sensory-ui/sensory-ui-button
npx shadcn@latest add SatyamVyas04/sensory-ui/sensory-ui-slider
npx shadcn@latest add SatyamVyas04/sensory-ui/sensory-ui-checkbox
```

The CLI reads `registry.json` and referenced files directly from the public GitHub repository. No server or build step needed for installation.

After install, verify:

1. `components/ui/sensory-ui/` folder is created with all expected files
2. TypeScript compilation passes in the test project
3. Wrapping app with `<SensoryUIProvider>` works
4. Components render and play sounds on interaction

---

## 7. Component-Level Testing

### Button

```tsx
import { Button } from "@/components/ui/sensory-ui/button";

// Default sound (interaction.tap)
<Button>Click me</Button>

// Custom sound
<Button sound="interaction.confirm">Confirm</Button>

// Disabled (no sound, button is not clickable)
<Button disabled>Disabled</Button>

// Silenced
<Button sound={false}>Silent</Button>
```

### Checkbox

```tsx
import { Checkbox } from "@/components/ui/sensory-ui/checkbox";

// Default (interaction.toggle on check/uncheck, no sound on indeterminate)
<Checkbox />

// Custom sound
<Checkbox sound="interaction.tap" />
```

### Switch

```tsx
import { Switch } from "@/components/ui/sensory-ui/switch";

// Default (interaction.toggle)
<Switch />;
```

### Slider

```tsx
import { Slider } from "@/components/ui/sensory-ui/slider";

// Default (interaction.subtle on every value change)
<Slider defaultValue={[50]} max={100} step={1} />;
```

### Command

```tsx
import {
	Command,
	CommandInput,
	CommandList,
	CommandItem,
} from "@/components/ui/sensory-ui/command";

// CommandInput plays interaction.subtle per keystroke
// CommandItem plays interaction.tap on select
<Command>
	<CommandInput placeholder="Search..." />
	<CommandList>
		<CommandItem>Item 1</CommandItem>
	</CommandList>
</Command>;
```

### Tabs

```tsx
import {
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
} from "@/components/ui/sensory-ui/tabs";

// Default (navigation.tab on tab switch)
<Tabs defaultValue="tab1">
	<TabsList>
		<TabsTrigger value="tab1">Tab 1</TabsTrigger>
		<TabsTrigger value="tab2">Tab 2</TabsTrigger>
	</TabsList>
	<TabsContent value="tab1">Content 1</TabsContent>
	<TabsContent value="tab2">Content 2</TabsContent>
</Tabs>;
```

### Dialog

```tsx
import {
	Dialog,
	DialogTrigger,
	DialogContent,
} from "@/components/ui/sensory-ui/dialog";

// Default (overlay.open on open, overlay.close on close)
<Dialog>
	<DialogTrigger>Open</DialogTrigger>
	<DialogContent>Content</DialogContent>
</Dialog>;
```

---

## 8. Sound Pack Testing

Switch packs via the provider to test each instrument's character:

```tsx
<SensoryUIProvider config={{ theme: "soft" }}>
	{/* All sounds will use the soft instrument */}
</SensoryUIProvider>
```

Available packs: `soft`, `aero` (default), `arcade`, `organic`, `glass`, `industrial`, `minimal`, `retro`, `crisp`

---

## 9. Config Testing

### Disable all sounds

```tsx
<SensoryUIProvider config={{ enabled: false }}>
```

### Disable a category

```tsx
<SensoryUIProvider config={{ categories: { hero: false, notification: false } }}>
```

### Volume control

```tsx
<SensoryUIProvider config={{ volume: 0.1 }}>
```

### Custom overrides

```tsx
<SensoryUIProvider config={{ overrides: { "interaction.tap": "/sounds/custom/click.mp3" } }}>
```

### Reduced motion

```tsx
<SensoryUIProvider config={{ reducedMotion: "force-off" }}>
```

---

## 10. Spam/Rapid-Fire Testing

The engine cancels previous sounds when a new sound is triggered rapidly. Test by:

1. Rapidly clicking a button — only the latest click sound should play
2. Rapidly toggling a checkbox — no overlapping toggle sounds
3. Dragging a slider quickly — subtle ticks should not pile up

This is handled by `activePlayback` tracking in `engine.ts`, which stops the previous sound before starting a new one and clears automatically when a sound ends naturally.

---

## 11. Accessibility Testing

1. Enable `prefers-reduced-motion: reduce` in browser dev tools → sounds should be suppressed
2. Set `reducedMotion: "force-off"` in config → sounds suppressed regardless of OS setting
3. Set `reducedMotion: "force-on"` in config → sounds play regardless of OS setting
4. Keyboard navigation (Tab + Enter/Space on buttons) should trigger the same sounds as mouse clicks

---

## Quick Reference

| Command                  | Purpose                                      |
| ------------------------ | -------------------------------------------- |
| `npm run dev`            | Start dev server for interactive testing     |
| `npm run build`          | Full production build                        |
| `npm run check`          | Biome/Ultracite lint (sensory-ui files only) |
| `npm run fix`            | Biome/Ultracite auto-fix                     |
| `npx tsc --noEmit`       | TypeScript compilation check                 |
| `npm run registry:build` | Validate registry via `shadcn build`         |
| `npx shadcn@latest registry validate SatyamVyas04/sensory-ui` | Validate GitHub registry           |

---

## Registry Validation (GitHub CLI)

Use the shadcn CLI for comprehensive validation:

```bash
# Validate registry schema and file references
npx shadcn@latest registry validate SatyamVyas04/sensory-ui

# List all items
npx shadcn@latest list SatyamVyas04/sensory-ui

# View a specific item
npx shadcn@latest view SatyamVyas04/sensory-ui/sensory-ui-core
npx shadcn@latest view SatyamVyas04/sensory-ui/sensory-ui-button

# Search items
npx shadcn@latest search SatyamVyas04/sensory-ui --query button
```
