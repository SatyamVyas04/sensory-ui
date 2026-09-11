# sensory-ui - Registry & Publishing

> Status: **Implemented (v0.6)**

sensory-ui is published as a **GitHub registry** — a `registry.json` at the repository root tells the shadcn CLI how to install items. The legacy Next.js route handler at `app/r/[name]/route.ts` remains for the landing page website.

## GitHub Registry (Primary)

The root `registry.json` uses `include` to reference item definitions in `components/ui/sensory-ui/registry.json`. Users install via:

```bash
npx shadcn@latest add SatyamVyas04/sensory-ui/sensory-ui          # everything
npx shadcn@latest add SatyamVyas04/sensory-ui/sensory-ui-core     # core only
npx shadcn@latest add SatyamVyas04/sensory-ui/sensory-ui-button   # single component
```

No registry server needed — the CLI reads files directly from the public GitHub repository.

The registry is structured into three tiers:

| Entry               | CLI Address                                      | Purpose                                                          |
| ------------------- | ------------------------------------------------ | ---------------------------------------------------------------- |
| `sensory-ui`        | `SatyamVyas04/sensory-ui/sensory-ui`             | Meta-block; lists all component items via `registryDependencies` |
| `sensory-ui-core`   | `SatyamVyas04/sensory-ui/sensory-ui-core`        | Core sound engine, provider, config, and sound packs             |
| `sensory-ui-<name>` | `SatyamVyas04/sensory-ui/sensory-ui-button` etc. | Individual component wrappers (24 total)                         |

The constant `GITHUB_REGISTRY = "SatyamVyas04/sensory-ui"` is exported from `lib/github-registry.ts` and used across the codebase.

---

## What the shadcn Registry Is

The shadcn CLI (`npx shadcn@latest add <address>`) can install components from any public GitHub repository with a `registry.json` at the root. The manifest describes:

- What files to copy and where
- Any npm package dependencies to install
- Any tailwind config patches to apply

sensory-ui is published as a GitHub registry that installs the entire `components/ui/sensory-ui/` folder in one step. Audio is **synthesized programmatically** via the Web Audio API - no audio files, no base64 blobs, no `public/` directory entry needed.

---

## Distribution

The root `registry.json` delegates to `components/ui/sensory-ui/registry.json` via `include`. The CLI reads files directly from GitHub — no build step, no server needed.

```bash
# Install everything
npx shadcn@latest add SatyamVyas04/sensory-ui/sensory-ui

# Core only
npx shadcn@latest add SatyamVyas04/sensory-ui/sensory-ui-core

# Single component
npx shadcn@latest add SatyamVyas04/sensory-ui/sensory-ui-button
```

The legacy route handler at `app/r/[name]/route.ts` still serves registry-item manifests for the landing page website.

---

## Registry Manifest Structure

The registry manifests conform to the `registry-item.json` schema from shadcn/ui. The route handler at `app/r/[name]/route.ts` dynamically builds manifests from the source files. Key fields for each tier:

### `sensory-ui` (meta-block)

| Field                  | Value                                             | Notes                                                 |
| ---------------------- | ------------------------------------------------- | ----------------------------------------------------- |
| `$schema`              | `https://ui.shadcn.com/schema/registry-item.json` | Standard shadcn schema                                |
| `name`                 | `"sensory-ui"`                                    | Unique identifier                                     |
| `type`                 | `"registry:block"`                                | Multi-file block                                      |
| `files`                | `[]`                                              | Empty - uses `registryDependencies` to pull in files  |
| `registryDependencies` | Full URLs to all sensory-ui items                 | e.g. `https://sensory-ui.com/r/sensory-ui-core`, etc. |

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

| Field                  | Value                                             | Notes                                             |
| ---------------------- | ------------------------------------------------- | ------------------------------------------------- |
| `$schema`              | `https://ui.shadcn.com/schema/registry-item.json` | Standard shadcn schema                            |
| `name`                 | `"sensory-ui-button"` etc.                        | Component-specific identifier                     |
| `type`                 | `"registry:ui"`                                   | Single UI component                               |
| `files`                | Single component `.tsx` file                      | Embedded file content                             |
| `registryDependencies` | `["<base>/r/sensory-ui-core", "<shadcn-name>"]`   | Full URL for core; bare name for shadcn component |

### File Types

Each file in the manifest has a `type` that tells the CLI where to place it:

| Relative Path                 | Registry Type   | Reasoning                       |
| ----------------------------- | --------------- | ------------------------------- |
| `config/use-play-sound.ts`    | `registry:hook` | It's a React hook               |
| `config/*.ts`, `config/*.tsx` | `registry:lib`  | Internal infrastructure         |
| `sounds/**/*.ts`              | `registry:lib`  | Sound synthesis modules         |
| `*.tsx` (root level)          | `registry:ui`   | UI components with `sound` prop |

### `registry.json` (project root)

The root `registry.json` uses `include` to reference items defined in `components/ui/sensory-ui/registry.json`. File paths in the included file are relative to that file:

**Root `registry.json`:**
```json
{
	"$schema": "https://ui.shadcn.com/schema/registry.json",
	"name": "sensory-ui",
	"homepage": "https://github.com/SatyamVyas04/sensory-ui",
	"include": ["components/ui/sensory-ui/registry.json"]
}
```

**`components/ui/sensory-ui/registry.json`** (abbreviated):
```json
{
	"$schema": "https://ui.shadcn.com/schema/registry.json",
	"items": [
		{
			"name": "sensory-ui-core",
			"type": "registry:block",
			"files": [
				{ "path": "config/engine.ts", "type": "registry:lib" },
				{ "path": "config/provider.tsx", "type": "registry:lib" }
			]
		},
		{
			"name": "sensory-ui-button",
			"type": "registry:ui",
			"registryDependencies": [
				"SatyamVyas04/sensory-ui/sensory-ui-core",
				"button"
			],
			"files": [{ "path": "button.tsx", "type": "registry:ui" }]
		}
	]
}
```

Registry dependencies use the full GitHub address format (`SatyamVyas04/sensory-ui/sensory-ui-core`) instead of the old URL-based approach (`https://sensory-ui.com/r/sensory-ui-core`).

### Route Handler (`app/r/[name]/route.ts`) — Legacy / Website Only

The route handler is kept for the landing page website. It is NOT used by the CLI for installation — the CLI reads `registry.json` directly from GitHub.

```ts
// Key features:
// - export const dynamic = "force-static" → file reads happen at build time
// - Serves per-name manifests: sensory-ui, sensory-ui-core, sensory-ui-<component>
// - Recursively collects all .ts/.tsx files from components/ui/sensory-ui/
// - Embeds file content directly in the JSON response for core and component items
// - Uses GITHUB_REGISTRY constant from lib/github-registry.ts for registryDependencies
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

The registry is hosted directly on **GitHub**. No server required — the CLI reads `registry.json` and referenced files from the public repository.

```bash
npx shadcn@latest add SatyamVyas04/sensory-ui/sensory-ui          # everything
npx shadcn@latest add SatyamVyas04/sensory-ui/sensory-ui-core     # core only
npx shadcn@latest add SatyamVyas04/sensory-ui/sensory-ui-button   # single component
```

| Hosting   | Address format                          | Notes                                  |
| --------- | --------------------------------------- | -------------------------------------- |
| GitHub    | `SatyamVyas04/sensory-ui/<item>`        | Primary — CLI reads from GitHub        |
| Vercel    | `https://sensory-ui.com/r/<name>`       | Website only (legacy route handler)    |

The legacy route handler at `app/r/[name]/route.ts` still exists for the landing page website.

---

## Versioning Strategy

| Asset                                     | Version Carrier                        | Update Mechanism                |
| ----------------------------------------- | -------------------------------------- | ------------------------------- |
| Registry manifest                         | Semver via URL path `/r/v1/sensory-ui` | Users pin or use latest         |
| Code files (engine, provider, primitives) | Embedded in manifest                   | Re-run `add` with `--overwrite` |
| Sound packs (`sounds/*.ts`)               | Embedded in manifest as TS modules     | Re-run `add` with `--overwrite` |
| `sensory.config.js`                       | User-owned                             | Never updated automatically     |

---

## Registry Build & Validation

With the GitHub registry approach, no build step is needed — the CLI reads files directly from the repo. However, `shadcn build` can still be run for local validation.

```bash
npm run registry:build    # npx shadcn@latest build — validates registry schema locally
```

### Pre-publish checklist

1. Run TypeScript compilation checks on all files in `components/ui/sensory-ui/`
2. Validate the registry: `npx shadcn@latest registry validate SatyamVyas04/sensory-ui`
3. Verify all 26 items are listed: `npx shadcn@latest list SatyamVyas04/sensory-ui`
4. Run `npm run build` to confirm the website builds without errors
5. Ship to production — no build step needed; GitHub is the source of truth

> **Role taxonomy:** 17 roles across 5 categories: `interaction` (4), `overlay` (4), `navigation` (3), `notification` (4), `hero` (2).

---

## Timeline

| Milestone                                | Status             |
| ---------------------------------------- | ------------------ |
| Runtime (engine + provider + primitives) | Complete           |
| Sound file production (17 roles)         | Complete (9 packs) |
| Registry manifest structure              | Complete           |
| GitHub registry (`registry.json`)        | Complete           |
| CLI install testing                      | Complete           |
| Public launch                            | Pending            |

---

## Deferred: CLI Patching of Existing shadcn Components

The original agents.md mentioned patching existing `components/ui/button.tsx` to import from `sensory-ui/primitives`. This is deferred because:

1. It is destructive - overwrites user-edited components
2. It is unnecessary - users can import from `sensory-ui/primitives` directly
3. Patching arbitrary component files reliably via the shadcn CLI is complex

The v1.0 design keeps existing `components/ui/` files untouched. Users choose to use the sensory-ui component instead of the shadcn original at the point of use.
