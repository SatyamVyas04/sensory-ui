import type { SoundCategory, SoundRole } from "./sound-roles";
import type { SoundSource } from "./engine";
import { packRegistry, type SoundPackName } from "./registry";

export interface SensoryUIConfig {
  /** Global kill-switch. false silences everything. */
  enabled: boolean;
  /** Master volume multiplier. Range: 0–1. */
  volume: number;
  /**
   * Sound pack name. Selects a built-in pack or falls back to "default".
   *
   * Built-in packs:
   *   "default" — clean, modern, minimal (general-purpose SaaS)
   *   "arcade"  — 8-bit chiptune square waves
   *   "wind"    — airy, organic filtered-noise and wind chimes
   *   "retro"   — synthwave / analog sawtooth, slightly gritty
   *
   * Individual roles can still be overridden via `overrides` regardless
   * of which pack is active.
   */
  theme: SoundPackName | (string & {});
  /** Per-category enable/disable toggles. */
  categories: Record<SoundCategory, boolean>;
  /**
   * Role-level source overrides.
   * Values can be:
   *   - A URL path to a file in public/ (e.g. "/sounds/my-click.mp3")
   *   - A base64 data URI (e.g. "data:audio/mp3;base64,...")
   * These take precedence over the active sound pack.
   */
  overrides: Partial<Record<SoundRole, string>>;
  /**
   * How to respond to prefers-reduced-motion.
   * "inherit"   → respect the OS/browser setting
   * "force-off" → always suppress sounds
   * "force-on"  → always play sounds regardless of user pref
   */
  reducedMotion: "inherit" | "force-off" | "force-on";
}

/**
 * Default config — used when no overrides are provided.
 * Edit sensory.config.js at the project root or pass a `config` prop to
 * <SensoryUIProvider> to customise at runtime.
 */
export const defaultConfig: SensoryUIConfig = {
  enabled: true,
  volume: 0.35,
  theme: "default",
  categories: {
    activation: true,
    navigation: true,
    notifications: true,
    system: true,
    hero: false, // Disabled by default — must be explicitly enabled
  },
  overrides: {},
  reducedMotion: "inherit",
};

export function mergeConfig(
  user: Partial<SensoryUIConfig>
): SensoryUIConfig {
  return {
    ...defaultConfig,
    ...user,
    categories: {
      ...defaultConfig.categories,
      ...(user.categories ?? {}),
    },
    overrides: {
      ...defaultConfig.overrides,
      ...(user.overrides ?? {}),
    },
  };
}

/**
 * Resolve a SoundRole to its audio source.
 *
 * Resolution priority:
 *   1. config.overrides[role]   — user-defined string override (URL or base64)
 *   2. packRegistry[theme][role] — synthesizer from the active sound pack
 *   3. packRegistry.default[role]— fallback to default pack if theme unknown
 *   4. null                      — category disabled or role not found
 */
export function resolveRole(
  role: SoundRole,
  config: SensoryUIConfig
): SoundSource | null {
  const category = role.split(".")[0] as SoundCategory;

  if (config.categories[category] === false) return null;

  // User override takes highest priority (always a string/URL)
  const override = config.overrides[role];
  if (override) return override;

  // Look up the active pack, fall back to "default" if pack name is unknown
  const packName = config.theme as SoundPackName;
  const pack = packRegistry[packName] ?? packRegistry.default;
  const source = pack[role];

  return source ?? null;
}
