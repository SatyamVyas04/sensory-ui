/**
 * Sound Pack Generator
 *
 * Generates a complete SoundPack from an InstrumentConfig.
 * This is the bridge between the tune/instrument system and the
 * existing SoundPack interface used by the registry.
 */

import type { SoundRole } from "../../config/sound-roles";
import type { SoundSynthesizer } from "../../config/engine";
import type { InstrumentConfig } from "./instruments";
import {
  ACTIVATION_TUNES,
  NAVIGATION_TUNES,
  NOTIFICATION_TUNES,
  SYSTEM_TUNES,
  HERO_TUNES,
} from "./tunes";
import { createSoundFromTune } from "./factory";

/**
 * Generate a complete SoundPack from an instrument configuration.
 *
 * @param instrument - The instrument configuration to use for all sounds
 * @returns A record mapping every SoundRole to its synthesizer
 */
export function generateSoundPack(
  instrument: InstrumentConfig
): Record<SoundRole, SoundSynthesizer> {
  return {
    // Activation sounds
    "activation.primary": createSoundFromTune(ACTIVATION_TUNES.primary, instrument),
    "activation.subtle": createSoundFromTune(ACTIVATION_TUNES.subtle, instrument),
    "activation.confirm": createSoundFromTune(ACTIVATION_TUNES.confirm, instrument),
    "activation.error": createSoundFromTune(ACTIVATION_TUNES.error, instrument),

    // Navigation sounds
    "navigation.forward": createSoundFromTune(NAVIGATION_TUNES.forward, instrument),
    "navigation.backward": createSoundFromTune(NAVIGATION_TUNES.backward, instrument),
    "navigation.switch": createSoundFromTune(NAVIGATION_TUNES.switch, instrument),
    "navigation.scroll": createSoundFromTune(NAVIGATION_TUNES.scroll, instrument),

    // Notification sounds
    "notifications.passive": createSoundFromTune(NOTIFICATION_TUNES.passive, instrument),
    "notifications.error": createSoundFromTune(NOTIFICATION_TUNES.error, instrument),
    "notifications.success": createSoundFromTune(NOTIFICATION_TUNES.success, instrument),
    "notifications.warning": createSoundFromTune(NOTIFICATION_TUNES.warning, instrument),

    // System sounds
    "system.open": createSoundFromTune(SYSTEM_TUNES.open, instrument),
    "system.close": createSoundFromTune(SYSTEM_TUNES.close, instrument),
    "system.expand": createSoundFromTune(SYSTEM_TUNES.expand, instrument),
    "system.collapse": createSoundFromTune(SYSTEM_TUNES.collapse, instrument),
    "system.focus": createSoundFromTune(SYSTEM_TUNES.focus, instrument),

    // Hero sounds
    "hero.complete": createSoundFromTune(HERO_TUNES.complete, instrument),
    "hero.milestone": createSoundFromTune(HERO_TUNES.milestone, instrument),
  };
}

/**
 * Create a custom sound pack with instrument modifications for specific roles.
 *
 * This allows fine-tuning individual sounds while keeping the base instrument
 * character consistent across the pack.
 *
 * @param baseInstrument - The base instrument for the pack
 * @param overrides - Partial instrument configs keyed by sound role
 */
export function generateCustomSoundPack(
  baseInstrument: InstrumentConfig,
  overrides?: Partial<Record<SoundRole, Partial<InstrumentConfig>>>
): Record<SoundRole, SoundSynthesizer> {
  const basePack = generateSoundPack(baseInstrument);

  if (!overrides) return basePack;

  // Apply overrides
  for (const [role, instrumentOverride] of Object.entries(overrides)) {
    const soundRole = role as SoundRole;
    const mergedInstrument = { ...baseInstrument, ...instrumentOverride };

    // Determine which tune category this role belongs to
    const [category, name] = soundRole.split(".") as [string, string];

    let tune;
    switch (category) {
      case "activation":
        tune = ACTIVATION_TUNES[name];
        break;
      case "navigation":
        tune = NAVIGATION_TUNES[name];
        break;
      case "notifications":
        tune = NOTIFICATION_TUNES[name];
        break;
      case "system":
        tune = SYSTEM_TUNES[name];
        break;
      case "hero":
        tune = HERO_TUNES[name];
        break;
      default:
        continue;
    }

    if (tune) {
      basePack[soundRole] = createSoundFromTune(tune, mergedInstrument);
    }
  }

  return basePack;
}
