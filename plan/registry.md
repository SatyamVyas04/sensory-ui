# sensory-ui - Registry & Publishing

> Status: **Implemented (v0.6)**

sensory-ui is published as a shadcn/ui registry served from the project itself via a parameterized Next.js route handler at `app/r/[name]/route.ts`. A `registry.json` at the project root also supports the `shadcn build` CLI workflow.

The registry is structured into three tiers:

| Entry               | URL                         | Purpose                                                          |
| ------------------- | --------------------------- | ---------------------------------------------------------------- |
| `sensory-ui`        | `/r/sensory-ui`             | Meta-block; lists all component items via `registryDependencies` |
| `sensory-ui-core`   | `/r/sensory-ui-core`        | Core sound engine, provider, config, and sound packs             |
| `sensory-ui-<name>` | `/r/sensory-ui-button` etc. | Individual component wrappers (24 total)                         |

---

## What the shadcn Registry Is

The shadcn CLI (`npx shadcn@latest add <url>`) can install components from any URL that serves a valid registry manifest. The manifest describes:

- What files to copy and where
- Any npm package dependencies to install
- Any tailwind config patches to apply

sensory-ui will be published as a single registry entry that installs the entire `components/ui/sensory-ui/` folder in one step. Audio is **synthesized programmatically** via the Web Audio API - no audio files, no base64 blobs, no `public/` directory entry needed.

---

## Two Distribution Methods

### Method 1: Route Handler (current, production)

The parameterized route handler at `app/r/[name]/route.ts` reads all source files at build time (`export const dynamic = "force-static"`) and serves a registry-item manifest for each named entry. This is the primary distribution method.

```bash
npx shadcn@latest add https://sensory-ui.com/r/sensory-ui          # everything
npx shadcn@latest add https://sensory-ui.com/r/sensory-ui-core     # core only
npx shadcn@latest add https://sensory-ui.com/r/sensory-ui-button   # single component
```

### Method 2: `registry.json` + `shadcn build` (standard CLI workflow)

A `registry.json` at the project root follows the official shadcn registry specification. File paths in `registry.json` reference sources under `components/ui/sensory-ui/`. Running `pnpm registry:build` generates static JSON files in `public/r/`.

```bash
pnpm registry:build
# Generates public/r/sensory-ui.json, public/r/sensory-ui-core.json, etc.
```

Both methods serve the same registry manifests. Method 1 is used in production; Method 2 provides the standard `shadcn build` workflow for development and testing.

---

## Registry Manifest Structure

The registry manifests conform to the `registry-item.json` schema from shadcn/ui. The route handler at `app/r/[name]/route.ts` dynamically builds manifests from the source files. Key fields for each tier:

### `sensory-ui` (meta-block)

| Field                  | Value                                             | Notes                                                |
| ---------------------- | ------------------------------------------------- | ---------------------------------------------------- |
| `$schema`              | `https://ui.shadcn.com/schema/registry-item.json` | Standard shadcn schema                               |
| `name`                 | `"sensory-ui"`                                    | Unique identifier                                    |
| `type`                 | `"registry:block"`                                | Multi-file block                                     |
| `files`                | `[]`                                              | Empty - uses `registryDependencies` to pull in files |
| `registryDependencies` | `["sensory-ui-core", "sensory-ui-button", ...]`   | References core + all 24 component items             |

### `sensory-ui-core`

| Field                  | Value                                             | Notes                                     |
| ---------------------- | ------------------------------------------------- | ----------------------------------------- |
| `$schema`              | `https://ui.shadcn.com/schema/registry-item.json` | Standard shadcn schema                    |
| `name`                 | `"sensory-ui-core"`                               | Unique identifier                         |
| `type`                 | `"registry:block"`                                | Multi-file block (not a single component) |
| `title`                | `"sensory-ui-core"`                               | Human-readable name                       |
| `files`                | Config and sound files (13 total)                 | Embedded file content                     |
| `registryDependencies` | `[]`                                              | No shadcn component dependencies          |

### `sensory-ui-<name>` (individual components)

| Field                  | Value                                             | Notes                                       |
| ---------------------- | ------------------------------------------------- | ------------------------------------------- |
| `$schema`              | `https://ui.shadcn.com/schema/registry-item.json` | Standard shadcn schema                      |
| `name`                 | `"sensory-ui-button"` etc.                        | Component-specific identifier               |
| `type`                 | `"registry:ui"`                                   | Single UI component                         |
| `files`                | Single component `.tsx` file                      | Embedded file content                       |
| `registryDependencies` | `["sensory-ui-core", "<shadcn-name>"]`            | Depends on core + matching shadcn component |

### File Types

Each file in the manifest has a `type` that tells the CLI where to place it:

| Relative Path                 | Registry Type   | Reasoning                       |
| ----------------------------- | --------------- | ------------------------------- |
| `config/use-play-sound.ts`    | `registry:hook` | It's a React hook               |
| `config/*.ts`, `config/*.tsx` | `registry:lib`  | Internal infrastructure         |
| `sounds/**/*.ts`              | `registry:lib`  | Sound synthesis modules         |
| `*.tsx` (root level)          | `registry:ui`   | UI components with `sound` prop |

### `registry.json` (project root)

The `registry.json` file follows the official schema for the `shadcn build` workflow. File paths reference sources under `components/ui/sensory-ui/` (not `registry/`):

```json
{
	"$schema": "https://ui.shadcn.com/schema/registry.json",
	"name": "sensory-ui",
	"items": [
		{
			"name": "sensory-ui-core",
			"type": "registry:block",
			"files": [
				{
					"path": "components/ui/sensory-ui/config/engine.ts",
					"type": "registry:lib"
				}
				/* ... remaining config and sounds files ... */
			]
		},
		{
			"name": "sensory-ui-button",
			"type": "registry:ui",
			"registryDependencies": ["sensory-ui-core", "button"],
			"files": [
				{
					"path": "components/ui/sensory-ui/button.tsx",
					"type": "registry:ui"
				}
			]
		},
		/* ... remaining 23 component entries ... */
		{
			"name": "sensory-ui",
			"type": "registry:block",
			"registryDependencies": [
				"sensory-ui-core",
				"sensory-ui-button" /* ... */
			],
			"files": []
		}
	]
}
```

### Route Handler (`app/r/[name]/route.ts`)

```ts
// Key features:
// - export const dynamic = "force-static" → file reads happen at build time
// - Serves per-name manifests: sensory-ui, sensory-ui-core, sensory-ui-<component>
// - Recursively collects all .ts/.tsx files from components/ui/sensory-ui/
// - Embeds file content directly in the JSON response for core and component items
// - sensory-ui meta-block uses registryDependencies (empty files) to reference all items
// - Normalises Windows backslashes to forward slashes in paths
// - Classifies files into registry:ui, registry:lib, or registry:hook
// - GET handler is async and awaits params (Next.js 15+ async params API)
```

The route handler serves manifests when the CLI fetches the URL. Core item contains 13 files (6 config + 7 sounds); each component item contains 1 `.tsx` file; the meta `sensory-ui` item has empty `files` and lists all 25 entries in `registryDependencies`.

**Notes:**

- `dependencies` is empty - sensory-ui has zero npm dependencies. All code uses native browser APIs and existing React/Radix primitives already present in the user's shadcn project.
- All audio is **synthesized at runtime** via the Web Audio API. No binary assets, no base64 blobs, no `public/` directory entry needed.

---

## Sound Pack Distribution

Audio is generated **programmatically** via the Web Audio API. Each `sounds/*.ts` module exports a `SoundPack` object that maps role names to `SoundSynthesizer` functions - plain TypeScript functions that receive an `AudioContext` and return a `SoundPlayback` handle.

The sound system uses a **tunes + instruments architecture**:

- `sounds/core/tunes.ts` - musical content (frequencies, durations, patterns) for all 17 roles
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
// aeroPack["interaction.tap"] → SoundSynthesizer function
```

The `config/registry.ts` file imports from `sounds/packs.ts` and builds the `packRegistry` at module load time. User overrides pointing to regular URLs (e.g. `/sounds/custom/...`) are fetched normally via `engine.ts`.

---

## Registry Hosting

The registry is served directly from the sensory-ui website via a parameterized Next.js route handler (`app/r/[name]/route.ts`). Example install commands:

```bash
npx shadcn@latest add https://sensory-ui.com/r/sensory-ui          # everything
npx shadcn@latest add https://sensory-ui.com/r/sensory-ui-core     # core only
npx shadcn@latest add https://sensory-ui.com/r/sensory-ui-button   # single component
```

| Hosting | URL pattern                       | Notes                                   |
| ------- | --------------------------------- | --------------------------------------- |
| Vercel  | `https://sensory-ui.com/r/<name>` | Custom domain pointing to Vercel deploy |

The route handler at `app/r/[name]/route.ts` reads all source files from `components/ui/sensory-ui/` at build time using `export const dynamic = "force-static"` and returns the per-name registry manifest with embedded file contents.

---

## Versioning Strategy

| Asset                                     | Version Carrier                        | Update Mechanism                |
| ----------------------------------------- | -------------------------------------- | ------------------------------- |
| Registry manifest                         | Semver via URL path `/r/v1/sensory-ui` | Users pin or use latest         |
| Code files (engine, provider, primitives) | Embedded in manifest                   | Re-run `add` with `--overwrite` |
| Sound packs (`sounds/*.ts`)               | Embedded in manifest as TS modules     | Re-run `add` with `--overwrite` |
| `sensory.config.js`                       | User-owned                             | Never updated automatically     |

---

## Registry Build Process

Two complementary build paths exist:

### Route Handler (automatic)

The parameterized route handler at `app/r/[name]/route.ts` uses `export const dynamic = "force-static"` to read all source files at build time. Every `next build` produces fresh manifests for all entries. No manual step required.

### `shadcn build` (standard CLI)

Run `pnpm registry:build` to invoke `shadcn build`, which reads `registry.json` at the project root and generates static JSON files in `public/r/`. Useful for local testing and validation.

### Pre-publish checklist

1. Run TypeScript compilation checks on all files in `components/ui/sensory-ui/`
2. Verify the manifest JSON includes all 37 files (6 config + 7 sounds + 24 components)
3. Run `npx shadcn@latest add http://localhost:3000/r/sensory-ui` in a test project to confirm install
4. Tag the GitHub release with the version

> **Role taxonomy:** 17 roles across 5 categories: `interaction` (4), `overlay` (4), `navigation` (3), `notification` (4), `hero` (2).

---

## Timeline

| Milestone                                | Status             |
| ---------------------------------------- | ------------------ |
| Runtime (engine + provider + primitives) | Complete           |
| Sound file production (17 roles)         | Complete (9 packs) |
| Registry manifest structure              | Complete           |
| Route handler with $schema + types       | Complete           |
| `registry.json` + build script           | Complete           |
| Hosting setup                            | Complete (Vercel)  |
| CLI install testing                      | Pending            |
| Public launch                            | Pending            |

---

## Deferred: CLI Patching of Existing shadcn Components

The original agents.md mentioned patching existing `components/ui/button.tsx` to import from `sensory-ui/primitives`. This is deferred because:

1. It is destructive - overwrites user-edited components
2. It is unnecessary - users can import from `sensory-ui/primitives` directly
3. Patching arbitrary component files reliably via the shadcn CLI is complex

The v1.0 design keeps existing `components/ui/` files untouched. Users choose to use the sensory-ui component instead of the shadcn original at the point of use.
