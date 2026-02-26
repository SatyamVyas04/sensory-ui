import type { SoundRole } from "./sound-roles";
import type { SoundSource } from "./engine";

import { activation } from "../sounds/activation";
import { navigation } from "../sounds/navigation";
import { notifications } from "../sounds/notifications";
import { system } from "../sounds/system";
import { hero } from "../sounds/hero";

import { arcadePack } from "../sounds/arcade";
import { windPack } from "../sounds/wind";
import { retroPack } from "../sounds/retro";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * The built-in sound pack names.
 *
 * Set `theme` in `sensory.config.js` (or the `config` prop on
 * `<SensoryUIProvider>`) to switch between packs at runtime.
 *
 * | Pack      | Character                                     |
 * |-----------|-----------------------------------------------|
 * | default   | Clean, modern, minimal — general-purpose SaaS |
 * | arcade    | 8-bit chiptune square waves                   |
 * | wind      | Airy, organic filtered-noise and wind chimes  |
 * | retro     | Synthwave / analog sawtooth, slightly gritty  |
 */
export type SoundPackName = "default" | "arcade" | "wind" | "retro";

/**
 * A complete mapping of every SoundRole to a SoundSource for one pack.
 * SoundSource is either a SoundSynthesizer function (preferred) or a
 * base64 data URI / public-path string (for custom user overrides).
 */
export type SoundPack = Record<SoundRole, SoundSource>;

// ---------------------------------------------------------------------------
// Default pack (assembled from the per-category modules in sounds/)
// ---------------------------------------------------------------------------

const defaultPack: SoundPack = {
  ...activation,
  ...navigation,
  ...notifications,
  ...system,
  ...hero,
};

// ---------------------------------------------------------------------------
// Pack registry — maps pack name → full SoundPack
// ---------------------------------------------------------------------------

/**
 * All built-in sound packs, keyed by their `SoundPackName`.
 *
 * The engine uses this via `config.theme` to resolve a role to
 * its audio source before playback.
 *
 * This file is NOT modified by config overrides at runtime.
 * Overrides in `sensory.config.js` are resolved by `config.ts` before lookup.
 */
export const packRegistry: Record<SoundPackName, SoundPack> = {
  default: defaultPack,
  arcade: arcadePack,
  wind: windPack,
  retro: retroPack,
};

/**
 * Backwards-compat alias: the default pack's role → source mapping.
 * Kept so any code that imported `roleRegistry` directly still compiles.
 */
export const roleRegistry: SoundPack = defaultPack;

