# sensory-ui - Registry & Publishing

> Status: **Implemented (v0.5)**

sensory-ui is published as a shadcn/ui registry entry served from the project itself via a Next.js route handler at `app/r/sensory-ui/route.ts`. The registry serves all components, config files, and sound modules in a single install step.

---

## What the shadcn Registry Is

The shadcn CLI (`npx shadcn@latest add <url>`) can install components from any URL that serves a valid registry manifest. The manifest describes:

- What files to copy and where
- Any npm package dependencies to install
- Any tailwind config patches to apply

sensory-ui will be published as a single registry entry that installs the entire `components/ui/sensory-ui/` folder and the `sensory.config.js` template in one step. Audio is **synthesized programmatically** via the Web Audio API - no audio files, no base64 blobs, no `public/` directory entry needed.

---

## Registry Manifest Structure

The registry is served as a Next.js route handler at `app/r/sensory-ui/route.ts`. When `npx shadcn@latest add https://sensory-ui.com/r/sensory-ui` is run, the CLI fetches the JSON manifest from this endpoint. The route reads all source files at build time (using `export const dynamic = "force-static"`) and embeds their content in the response.

The manifest includes all `.ts`/`.tsx` source files from `components/ui/sensory-ui/`:

```json
{
	"name": "sensory-ui",
	"type": "registry:ui",
	"description": "Semantic, opt-in sound layer for shadcn/ui components. 19 sound roles, 9 sound packs, zero dependencies.",
	"files": [
		{
			"path": "components/ui/sensory-ui/config/engine.ts",
			"type": "registry:lib",
			"target": "components/ui/sensory-ui/config/engine.ts"
		},
		{
			"path": "components/ui/sensory-ui/config/provider.tsx",
			"type": "registry:lib",
			"target": "components/ui/sensory-ui/config/provider.tsx"
		},
		{
			"path": "components/ui/sensory-ui/config/config.ts",
			"type": "registry:lib",
			"target": "components/ui/sensory-ui/config/config.ts"
		},
		{
			"path": "components/ui/sensory-ui/config/sound-roles.ts",
			"type": "registry:lib",
			"target": "components/ui/sensory-ui/config/sound-roles.ts"
		},
		{
			"path": "components/ui/sensory-ui/config/registry.ts",
			"type": "registry:lib",
			"target": "components/ui/sensory-ui/config/registry.ts"
		},
		{
			"path": "components/ui/sensory-ui/config/use-play-sound.ts",
			"type": "registry:lib",
			"target": "components/ui/sensory-ui/config/use-play-sound.ts"
		},
		{
			"path": "components/ui/sensory-ui/sounds/index.ts",
			"type": "registry:lib",
			"target": "components/ui/sensory-ui/sounds/index.ts"
		},
		{
			"path": "components/ui/sensory-ui/sounds/packs.ts",
			"type": "registry:lib",
			"target": "components/ui/sensory-ui/sounds/packs.ts"
		},
		{
			"path": "components/ui/sensory-ui/sounds/core/index.ts",
			"type": "registry:lib",
			"target": "components/ui/sensory-ui/sounds/core/index.ts"
		},
		{
			"path": "components/ui/sensory-ui/sounds/core/tunes.ts",
			"type": "registry:lib",
			"target": "components/ui/sensory-ui/sounds/core/tunes.ts"
		},
		{
			"path": "components/ui/sensory-ui/sounds/core/instruments.ts",
			"type": "registry:lib",
			"target": "components/ui/sensory-ui/sounds/core/instruments.ts"
		},
		{
			"path": "components/ui/sensory-ui/sounds/core/factory.ts",
			"type": "registry:lib",
			"target": "components/ui/sensory-ui/sounds/core/factory.ts"
		},
		{
			"path": "components/ui/sensory-ui/sounds/core/pack-generator.ts",
			"type": "registry:lib",
			"target": "components/ui/sensory-ui/sounds/core/pack-generator.ts"
		},
		{
			"path": "components/ui/sensory-ui/accordion.tsx",
			"type": "registry:ui",
			"target": "components/ui/sensory-ui/accordion.tsx"
		},
		{
			"path": "components/ui/sensory-ui/alert-dialog.tsx",
			"type": "registry:ui",
			"target": "components/ui/sensory-ui/alert-dialog.tsx"
		},
		{
			"path": "components/ui/sensory-ui/button.tsx",
			"type": "registry:ui",
			"target": "components/ui/sensory-ui/button.tsx"
		},
		{
			"path": "components/ui/sensory-ui/carousel.tsx",
			"type": "registry:ui",
			"target": "components/ui/sensory-ui/carousel.tsx"
		},
		{
			"path": "components/ui/sensory-ui/checkbox.tsx",
			"type": "registry:ui",
			"target": "components/ui/sensory-ui/checkbox.tsx"
		},
		{
			"path": "components/ui/sensory-ui/collapsible.tsx",
			"type": "registry:ui",
			"target": "components/ui/sensory-ui/collapsible.tsx"
		},
		{
			"path": "components/ui/sensory-ui/command.tsx",
			"type": "registry:ui",
			"target": "components/ui/sensory-ui/command.tsx"
		},
		{
			"path": "components/ui/sensory-ui/context-menu.tsx",
			"type": "registry:ui",
			"target": "components/ui/sensory-ui/context-menu.tsx"
		},
		{
			"path": "components/ui/sensory-ui/dialog.tsx",
			"type": "registry:ui",
			"target": "components/ui/sensory-ui/dialog.tsx"
		},
		{
			"path": "components/ui/sensory-ui/drawer.tsx",
			"type": "registry:ui",
			"target": "components/ui/sensory-ui/drawer.tsx"
		},
		{
			"path": "components/ui/sensory-ui/dropdown-menu.tsx",
			"type": "registry:ui",
			"target": "components/ui/sensory-ui/dropdown-menu.tsx"
		},
		{
			"path": "components/ui/sensory-ui/menubar.tsx",
			"type": "registry:ui",
			"target": "components/ui/sensory-ui/menubar.tsx"
		},
		{
			"path": "components/ui/sensory-ui/navigation-menu.tsx",
			"type": "registry:ui",
			"target": "components/ui/sensory-ui/navigation-menu.tsx"
		},
		{
			"path": "components/ui/sensory-ui/pagination.tsx",
			"type": "registry:ui",
			"target": "components/ui/sensory-ui/pagination.tsx"
		},
		{
			"path": "components/ui/sensory-ui/popover.tsx",
			"type": "registry:ui",
			"target": "components/ui/sensory-ui/popover.tsx"
		},
		{
			"path": "components/ui/sensory-ui/radio-group.tsx",
			"type": "registry:ui",
			"target": "components/ui/sensory-ui/radio-group.tsx"
		},
		{
			"path": "components/ui/sensory-ui/select.tsx",
			"type": "registry:ui",
			"target": "components/ui/sensory-ui/select.tsx"
		},
		{
			"path": "components/ui/sensory-ui/sheet.tsx",
			"type": "registry:ui",
			"target": "components/ui/sensory-ui/sheet.tsx"
		},
		{
			"path": "components/ui/sensory-ui/sidebar.tsx",
			"type": "registry:ui",
			"target": "components/ui/sensory-ui/sidebar.tsx"
		},
		{
			"path": "components/ui/sensory-ui/slider.tsx",
			"type": "registry:ui",
			"target": "components/ui/sensory-ui/slider.tsx"
		},
		{
			"path": "components/ui/sensory-ui/switch.tsx",
			"type": "registry:ui",
			"target": "components/ui/sensory-ui/switch.tsx"
		},
		{
			"path": "components/ui/sensory-ui/tabs.tsx",
			"type": "registry:ui",
			"target": "components/ui/sensory-ui/tabs.tsx"
		},
		{
			"path": "components/ui/sensory-ui/toggle-group.tsx",
			"type": "registry:ui",
			"target": "components/ui/sensory-ui/toggle-group.tsx"
		},
		{
			"path": "components/ui/sensory-ui/toggle.tsx",
			"type": "registry:ui",
			"target": "components/ui/sensory-ui/toggle.tsx"
		}
	],
	"dependencies": [],
	"devDependencies": [],
	"registryDependencies": []
}
```

**Notes:**

- `dependencies` is empty - sensory-ui has zero npm dependencies. All code uses native browser APIs and existing React/Radix primitives already present in the user's shadcn project.
- All audio is **synthesized at runtime** via the Web Audio API. No binary assets, no base64 blobs, no `public/` directory entry needed.

---

## Sound Pack Distribution

Audio is generated **programmatically** via the Web Audio API. Each `sounds/*.ts` module exports a `SoundPack` object that maps role names to `SoundSynthesizer` functions - plain TypeScript functions that receive an `AudioContext` and return a `SoundPlayback` handle.

The sound system uses a **tunes + instruments architecture**:

- `sounds/core/tunes.ts` - musical content (frequencies, durations, patterns) for all 19 roles
- `sounds/core/instruments.ts` - 9 synthesis configurations (waveforms, filters, envelopes)
- `sounds/core/factory.ts` - combines a tune with an instrument to produce a synthesizer
- `sounds/packs.ts` - generates all 9 packs and exports `soundPacks` + `SoundPackName`

This approach:

- Keeps all library files together in one folder
- Produces zero binary assets - no `public/` directory entry, no base64 blobs
- Works fully offline - no network fetch for built-in sounds
- Enables the standard shadcn registry install flow (no post-install scripts, no CDN downloads)
- Allows 9 sound packs to coexist: `soft`, `aero`, `arcade`, `organic`, `glass`, `industrial`, `minimal`, `retro`, `crisp`

Example synthesizer (from `sounds/packs.ts`):

```ts
import { generateSoundPack } from "./core/pack-generator";
import { AERO_INSTRUMENT } from "./core/instruments";

export const aeroPack = generateSoundPack(AERO_INSTRUMENT);
// aeroPack["activation.primary"] → SoundSynthesizer function
```

The `config/registry.ts` file imports from `sounds/packs.ts` and builds the `packRegistry` at module load time. User overrides pointing to regular URLs (e.g. `/sounds/custom/...`) are fetched normally via `engine.ts`.

---

## Registry Hosting

The registry is served directly from the sensory-ui website via a Next.js route handler. The install command URL points to:

```bash
npx shadcn@latest add https://sensory-ui.com/r/sensory-ui
```

| Hosting | URL                                    | Notes                                   |
| ------- | -------------------------------------- | --------------------------------------- |
| Vercel  | `https://sensory-ui.com/r/sensory-ui`  | Custom domain pointing to Vercel deploy |

The route handler at `app/r/sensory-ui/route.ts` reads all source files from `components/ui/sensory-ui/` at build time using `export const dynamic = "force-static"` and returns the complete registry manifest with embedded file contents.

---

## Versioning Strategy

| Asset                                     | Version Carrier                        | Update Mechanism                |
| ----------------------------------------- | -------------------------------------- | ------------------------------- |
| Registry manifest                         | Semver via URL path `/r/v1/sensory-ui` | Users pin or use latest         |
| Code files (engine, provider, primitives) | Embedded in manifest                   | Re-run `add` with `--overwrite` |
| Sound packs (`sounds/*.ts`)               | Embedded in manifest as TS modules     | Re-run `add` with `--overwrite` |
| `sensory.config.js`                       | User-owned                             | Never updated automatically     |

---

## Registry Build Process (To Be Defined)

The build pipeline for publishing a registry entry needs to:

1. Run TypeScript compilation checks on all files in `components/ui/sensory-ui/`
2. Bundle each file's content into the registry manifest JSON
3. Run a size check - each code file minified must be within budget
4. Verify all synthesizer functions are tree-shakeable and within bundle size budget
5. Upload manifest JSON to the hosting CDN
6. Tag the GitHub release with the version

This build process is TBD and will be designed once the runtime implementation is complete.

---

## Timeline

| Milestone                                | Status                  |
| ---------------------------------------- | ----------------------- |
| Runtime (engine + provider + primitives) | Complete                |
| Sound file production (19 roles)         | Complete (9 packs)      |
| Registry manifest structure              | Complete                |
| Hosting setup                            | Complete (Vercel)       |
| CLI install testing                      | Pending                 |
| Public launch                            | Pending                 |

---

## Deferred: CLI Patching of Existing shadcn Components

The original agents.md mentioned patching existing `components/ui/button.tsx` to import from `sensory-ui/primitives`. This is deferred because:

1. It is destructive - overwrites user-edited components
2. It is unnecessary - users can import from `sensory-ui/primitives` directly
3. Patching arbitrary component files reliably via the shadcn CLI is complex

The v1.0 design keeps existing `components/ui/` files untouched. Users choose to use the sensory-ui component instead of the shadcn original at the point of use.
