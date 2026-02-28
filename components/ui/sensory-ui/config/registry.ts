import type { SoundRole } from "./sound-roles";
import type { SoundSource } from "./engine";
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
  type SoundPackName,
} from "../sounds/packs";

// Re-export so consumers can import SoundPackName from this module
export type { SoundPackName };

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

