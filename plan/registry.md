# sensory-ui — Registry & Publishing

> Status: **Deferred — Future Work (post v1.0)**

This document outlines the plan for publishing sensory-ui as a proper shadcn/ui registry entry. The registry layer is a distribution concern, separate from the runtime. The runtime (engine, provider, primitives) can be developed and tested locally before the registry is wired up.

---

## What the shadcn Registry Is

The shadcn CLI (`npx shadcn@latest add <url>`) can install components from any URL that serves a valid registry manifest. The manifest describes:

- What files to copy and where
- Any npm package dependencies to install
- Any tailwind config patches to apply

sensory-ui will be published as a single registry entry that installs the entire `components/ui/sensory-ui/` folder and the `sensory.config.js` template in one step. Audio data is embedded as base64-encoded TypeScript modules in `sensory-ui/sounds/` and is therefore included in the normal code file install — no separate asset download, no `public/` directory entry needed.

---

## Registry Manifest Structure

```json
{
	"name": "sensory-ui",
	"type": "registry:lib",
	"description": "Semantic, opt-in sound layer for shadcn/ui components.",
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
			"path": "components/ui/sensory-ui/sounds/activation.ts",
			"type": "registry:lib",
			"target": "components/ui/sensory-ui/sounds/activation.ts"
		},
		{
			"path": "components/ui/sensory-ui/sounds/navigation.ts",
			"type": "registry:lib",
			"target": "components/ui/sensory-ui/sounds/navigation.ts"
		},
		{
			"path": "components/ui/sensory-ui/sounds/notifications.ts",
			"type": "registry:lib",
			"target": "components/ui/sensory-ui/sounds/notifications.ts"
		},
		{
			"path": "components/ui/sensory-ui/sounds/system.ts",
			"type": "registry:lib",
			"target": "components/ui/sensory-ui/sounds/system.ts"
		},
		{
			"path": "components/ui/sensory-ui/sounds/hero.ts",
			"type": "registry:lib",
			"target": "components/ui/sensory-ui/sounds/hero.ts"
		},
		{
			"path": "components/ui/sensory-ui/sounds/arcade.ts",
			"type": "registry:lib",
			"target": "components/ui/sensory-ui/sounds/arcade.ts"
		},
		{
			"path": "components/ui/sensory-ui/sounds/wind.ts",
			"type": "registry:lib",
			"target": "components/ui/sensory-ui/sounds/wind.ts"
		},
		{
			"path": "components/ui/sensory-ui/sounds/retro.ts",
			"type": "registry:lib",
			"target": "components/ui/sensory-ui/sounds/retro.ts"
		},
		{
			"path": "components/ui/sensory-ui/button.tsx",
			"type": "registry:component",
			"target": "components/ui/sensory-ui/button.tsx"
		},
		{
			"path": "components/ui/sensory-ui/dialog.tsx",
			"type": "registry:component",
			"target": "components/ui/sensory-ui/dialog.tsx"
		},
		{
			"path": "components/ui/sensory-ui/dropdown-menu.tsx",
			"type": "registry:component",
			"target": "components/ui/sensory-ui/dropdown-menu.tsx"
		},
		{
			"path": "components/ui/sensory-ui/tabs.tsx",
			"type": "registry:component",
			"target": "components/ui/sensory-ui/tabs.tsx"
		},
		{
			"path": "components/ui/sensory-ui/select.tsx",
			"type": "registry:component",
			"target": "components/ui/sensory-ui/select.tsx"
		},
		{
			"path": "components/ui/sensory-ui/checkbox.tsx",
			"type": "registry:component",
			"target": "components/ui/sensory-ui/checkbox.tsx"
		},
		{
			"path": "components/ui/sensory-ui/switch.tsx",
			"type": "registry:component",
			"target": "components/ui/sensory-ui/switch.tsx"
		},
		{
			"path": "components/ui/sensory-ui/accordion.tsx",
			"type": "registry:component",
			"target": "components/ui/sensory-ui/accordion.tsx"
		},
		{
			"path": "components/ui/sensory-ui/sheet.tsx",
			"type": "registry:component",
			"target": "components/ui/sensory-ui/sheet.tsx"
		},
		{
			"path": "sensory.config.js",
			"type": "registry:file",
			"target": "sensory.config.js"
		}
	],
	"dependencies": [],
	"devDependencies": [],
	"registryDependencies": []
}
```

**Notes:**

- `dependencies` is empty — sensory-ui has zero npm dependencies. All code uses native browser APIs and existing React/Radix primitives already present in the user's shadcn project.
- Sound data is embedded as **base64-encoded TypeScript modules** in `sensory-ui/sounds/*.ts` and is included as normal `registry:lib` file entries above. No binary assets, no `public/` directory entry, no separate download step.

---

## Sound Pack Distribution

Audio is generated **programmatically** via the Web Audio API. Each `sounds/*.ts` module exports a `SoundPack` object that maps role names to `SoundSynthesizer` functions — plain TypeScript functions that receive an `AudioContext` and return a `SoundPlayback` handle.

This approach:

- Keeps all library files together in one folder
- Produces zero binary assets — no `public/` directory entry, no base64 blobs
- Works fully offline — no network fetch for built-in sounds
- Enables the standard shadcn registry install flow (no post-install scripts, no CDN downloads)
- Allows multiple packs (`default`, `arcade`, `wind`, `retro`) to coexist in the same install

Each `sounds/*.ts` module exports a `SoundPack` record:

```ts
// components/ui/sensory-ui/sounds/activation.ts
import type { SoundPack } from "../config/registry";

export const activation: Partial<SoundPack> = {
	"activation.primary": (ctx, options) => {
		// Web Audio API synthesis — filtered noise click
		const gain = ctx.createGain();
		// ... oscillator/filter setup ...
		gain.connect(ctx.destination);
		return { stop: () => gain.disconnect() };
	},
	// ... other activation roles
};
```

The `registry.ts` file imports from these modules and builds the `roleRegistry` at module load time. `engine.ts` detects data URIs and decodes the base64 directly — no network fetch is needed for built-in sounds. User overrides pointing to regular URLs (e.g. `/sounds/custom/...`) are still fetched normally.

---

## Registry Hosting

The registry manifest JSON needs to be served from a stable URL. Options:

| Hosting       | URL Pattern                                                               | Notes                       |
| ------------- | ------------------------------------------------------------------------- | --------------------------- |
| GitHub Pages  | `https://<org>.github.io/sensory-ui/registry.json`                        | Free, stable, tied to repo  |
| Vercel        | `https://sensory-ui.vercel.app/registry.json`                             | Free tier, fast CDN         |
| npm-based     | Published as an npm package, registry URL points to `unpkg` or `jsdelivr` | Standard for libraries      |
| Custom domain | `https://sensory-ui.dev/registry.json`                                    | Best UX for install command |

**Recommendation:** Custom domain (`sensory-ui.dev`) pointing to a Vercel deployment for the best install command ergonomics:

```bash
npx shadcn@latest add https://sensory-ui.dev/r/sensory-ui
```

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
3. Run a size check — each code file minified must be within budget
4. Encode audio assets as base64 strings and write `sounds/*.ts` modules (each module exports a typed Record mapping roles to data URIs)
5. Upload manifest JSON to the hosting CDN
6. Tag the GitHub release with the version

This build process is TBD and will be designed once the runtime implementation is complete.

---

## Timeline

| Milestone                                | Status                  |
| ---------------------------------------- | ----------------------- |
| Runtime (engine + provider + primitives) | In progress             |
| Sound file production (19 files)         | Not started             |
| Registry manifest structure              | Drafted (this document) |
| Hosting setup                            | Not started             |
| CLI install testing                      | Not started             |
| Public launch                            | Not started             |

---

## Deferred: CLI Patching of Existing shadcn Components

The original agents.md mentioned patching existing `components/ui/button.tsx` to import from `sensory-ui/primitives`. This is deferred because:

1. It is destructive — overwrites user-edited components
2. It is unnecessary — users can import from `sensory-ui/primitives` directly
3. Patching arbitrary component files reliably via the shadcn CLI is complex

The v1.0 design keeps existing `components/ui/` files untouched. Users choose to use the sensory-ui component instead of the shadcn original at the point of use.
