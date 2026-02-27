import type { SoundRole } from "./sound-roles";
import type { SoundSource } from "./engine";

// Import all 9 sound packs
import {
  softPack,
  aeroPack,
  arcadePack,
  organicPack,
  glassPack,
  industrialPack,
  minimalPack,
  retroPack,
  crispPack,
} from "../sounds/packs";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * The built-in sound pack names.
 *
 * Set `theme` in `sensory.config.js` (or the `config` prop on
 * `<SensoryUIProvider>`) to switch between packs at runtime.
 *
 * | Pack       | Character                                         |
 * |------------|---------------------------------------------------|
 * | soft       | Warm, rounded, gentle - felt mallets on soft pads |
 * | aero       | Airy, breathy, ethereal - wind through chimes     |
 * | arcade     | 8-bit chiptune - square waves, punchy             |
 * | organic    | Natural, warm, wooden - marimba, wood blocks      |
 * | glass      | Crystalline, bright - struck glass or bells       |
 * | industrial | Metallic, harsh, mechanical - machines and metal  |
 * | minimal    | Clean, sparse, understated - pure tones only      |
 * | retro      | Analog synth - warm square waves, vintage         |
 * | crisp      | Sharp, defined, precise - hi-fi headphones        |
 */
export type SoundPackName =
  | "soft"
  | "aero"
  | "arcade"
  | "organic"
  | "glass"
  | "industrial"
  | "minimal"
  | "retro"
  | "crisp";

/**
 * A complete mapping of every SoundRole to a SoundSource for one pack.
 * SoundSource is either a SoundSynthesizer function (preferred) or a
 * base64 data URI / public-path string (for custom user overrides).
 */
export type SoundPack = Record<SoundRole, SoundSource>;

// ---------------------------------------------------------------------------
// Pack registry — maps pack name → full SoundPack
// ---------------------------------------------------------------------------

/**
 * All built-in sound packs, keyed by their `SoundPackName`.
 *
 * The engine uses this via `config.theme` to resolve a role to
 * its audio source before playback.
 */
export const packRegistry: Record<SoundPackName, SoundPack> = {
  soft: softPack,
  aero: aeroPack,
  arcade: arcadePack,
  organic: organicPack,
  glass: glassPack,
  industrial: industrialPack,
  minimal: minimalPack,
  retro: retroPack,
  crisp: crispPack,
};

/**
 * Default sound pack name.
 * "aero" is the default - balanced, pleasant, professional.
 */
export const DEFAULT_PACK: SoundPackName = "aero";

/**
 * Backwards-compat alias: the default pack's role → source mapping.
 */
export const roleRegistry: SoundPack = aeroPack;

