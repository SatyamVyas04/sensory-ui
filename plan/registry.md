# sensory-ui - Registry & Publishing

> Status: **Implemented (v0.5)**

sensory-ui is published as a shadcn/ui registry entry served from the project itself via a Next.js route handler at `app/r/sensory-ui/route.ts`. A `registry.json` at the project root also supports the `shadcn build` CLI workflow. Both approaches serve the same manifest — all components, config files, and sound modules in a single install step.

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

The route handler at `app/r/sensory-ui/route.ts` reads all source files at build time (`export const dynamic = "force-static"`) and embeds their content in the JSON response. This is the primary distribution method.

```bash
npx shadcn@latest add https://sensory-ui.com/r/sensory-ui
```

### Method 2: `registry.json` + `shadcn build` (standard CLI workflow)

A `registry.json` at the project root follows the official shadcn registry specification. Running `pnpm registry:build` generates static JSON files in `public/r/`.

```bash
pnpm registry:build
# Generates public/r/sensory-ui.json
```

Both methods produce the same registry manifest. Method 1 is used in production; Method 2 provides the standard `shadcn build` workflow for development and testing.

---

## Registry Manifest Structure

The registry manifest conforms to the `registry-item.json` schema from shadcn/ui. The route handler at `app/r/sensory-ui/route.ts` dynamically builds this manifest from the source files. Key fields:

| Field                  | Value                                             | Notes                                     |
| ---------------------- | ------------------------------------------------- | ----------------------------------------- |
| `$schema`              | `https://ui.shadcn.com/schema/registry-item.json` | Standard shadcn schema                    |
| `name`                 | `"sensory-ui"`                                    | Unique identifier                         |
| `type`                 | `"registry:block"`                                | Multi-file block (not a single component) |
| `title`                | `"sensory-ui"`                                    | Human-readable name                       |
| `description`          | Descriptive text                                  | Helps LLMs understand the component       |
| `dependencies`         | `[]`                                              | Zero npm dependencies                     |
| `registryDependencies` | `[]`                                              | No shadcn component dependencies          |

### File Types

Each file in the manifest has a `type` that tells the CLI where to place it:

| Relative Path                 | Registry Type   | Reasoning                       |
| ----------------------------- | --------------- | ------------------------------- |
| `config/use-play-sound.ts`    | `registry:hook` | It's a React hook               |
| `config/*.ts`, `config/*.tsx` | `registry:lib`  | Internal infrastructure         |
| `sounds/**/*.ts`              | `registry:lib`  | Sound synthesis modules         |
| `*.tsx` (root level)          | `registry:ui`   | UI components with `sound` prop |

### `registry.json` (project root)

The `registry.json` file follows the official schema for the `shadcn build` workflow:

```json
{
	"$schema": "https://ui.shadcn.com/schema/registry.json",
	"name": "sensory-ui",
	"homepage": "https://sensory-ui.com",
	"items": [
		{
			"name": "sensory-ui",
			"type": "registry:block",
			"files": [
				/* ... all files ... */
			]
		}
	]
}
```

### Route Handler (`app/r/sensory-ui/route.ts`)

```ts
// Key features:
// - export const dynamic = "force-static" → file reads happen at build time
// - Recursively collects all .ts/.tsx files from components/ui/sensory-ui/
// - Embeds file content directly in the JSON response
// - Normalises Windows backslashes to forward slashes in paths
// - Classifies files into registry:ui, registry:lib, or registry:hook
```

The route handler serves this manifest when the CLI fetches the URL. The full file list matches the 37 files under `components/ui/sensory-ui/` (7 config, 6 sounds, 24 components).

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

| Hosting | URL                                   | Notes                                   |
| ------- | ------------------------------------- | --------------------------------------- |
| Vercel  | `https://sensory-ui.com/r/sensory-ui` | Custom domain pointing to Vercel deploy |

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

## Registry Build Process

Two complementary build paths exist:

### Route Handler (automatic)

The route handler at `app/r/sensory-ui/route.ts` uses `export const dynamic = "force-static"` to read all source files at build time. Every `next build` produces a fresh manifest. No manual step required.

### `shadcn build` (standard CLI)

Run `pnpm registry:build` to invoke `shadcn build`, which reads `registry.json` at the project root and generates static JSON files in `public/r/`. Useful for local testing and validation.

### Pre-publish checklist

1. Run TypeScript compilation checks on all files in `components/ui/sensory-ui/`
2. Verify the manifest JSON includes all 37 files (7 config + 6 sounds + 24 components)
3. Run `npx shadcn@latest add http://localhost:3000/r/sensory-ui` in a test project to confirm install
4. Tag the GitHub release with the version

---

## Timeline

| Milestone                                | Status             |
| ---------------------------------------- | ------------------ |
| Runtime (engine + provider + primitives) | Complete           |
| Sound file production (19 roles)         | Complete (9 packs) |
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
