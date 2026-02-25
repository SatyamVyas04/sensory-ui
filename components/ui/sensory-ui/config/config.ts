import type { SoundCategory, SoundRole } from "./sound-roles";
import { roleRegistry } from "./registry";

export interface SensoryUIConfig {
  /** Global kill-switch. false silences everything. */
  enabled: boolean;
  /** Master volume multiplier. Range: 0–1. */
  volume: number;
  /** Sound pack name. Informational in v1.0. */
  theme: string;
  /** Per-category enable/disable toggles. */
  categories: Record<SoundCategory, boolean>;
  /** Role-level path overrides. Keys are SoundRole strings. */
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
 * Edit this file directly or pass a config prop to <SensoryUIProvider>.
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
 * Resolve a SoundRole to its audio source (base64 data URI or custom URL).
 *
 * Priority:
 *   1. config.overrides[role]  — user-defined custom path or data URI
 *   2. roleRegistry[role]      — built-in base64 data URI from sounds/*.ts
 *   3. null                    — category disabled or unknown role
 */
export function resolveRole(
  role: SoundRole,
  config: SensoryUIConfig
): string | null {
  const category = role.split(".")[0] as SoundCategory;

  if (config.categories[category] === false) return null;

  const override = config.overrides[role];
  if (override) return override;

  const source = roleRegistry[role];
  // Return null for empty strings (unfilled placeholder base64 modules)
  return source || null;
}
