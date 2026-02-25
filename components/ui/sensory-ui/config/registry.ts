import type { SoundRole } from "./sound-roles";
import { activation } from "../sounds/activation";
import { navigation } from "../sounds/navigation";
import { notifications } from "../sounds/notifications";
import { system } from "../sounds/system";
import { hero } from "../sounds/hero";

/**
 * Default role → base64 data URI mapping.
 *
 * Audio data is embedded as TypeScript modules in `sounds/*.ts`.
 * This eliminates the need for files in `public/sounds/` — everything
 * is co-located with the library code and bundled at build time.
 *
 * This file is NOT modified by config overrides at runtime.
 * Overrides in sensory.config.js are resolved by config.ts before lookup.
 */
export const roleRegistry: Record<SoundRole, string> = {
  ...activation,
  ...navigation,
  ...notifications,
  ...system,
  ...hero,
};
