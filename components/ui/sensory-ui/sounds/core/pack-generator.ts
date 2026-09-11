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
import type { BaseTune } from "./tunes";
import {
  INTERACTION_TUNES,
  NAVIGATION_TUNES,
  NOTIFICATION_TUNES,
  OVERLAY_TUNES,
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
    // Interaction sounds
    "interaction.tap": createSoundFromTune(INTERACTION_TUNES.tap, instrument),
    "interaction.subtle": createSoundFromTune(INTERACTION_TUNES.subtle, instrument),
    "interaction.toggle": createSoundFromTune(INTERACTION_TUNES.toggle, instrument),
    "interaction.confirm": createSoundFromTune(INTERACTION_TUNES.confirm, instrument),

    // Navigation sounds
    "navigation.forward": createSoundFromTune(NAVIGATION_TUNES.forward, instrument),
    "navigation.backward": createSoundFromTune(NAVIGATION_TUNES.backward, instrument),
    "navigation.tab": createSoundFromTune(NAVIGATION_TUNES.tab, instrument),

    // Notification sounds
    "notification.info": createSoundFromTune(NOTIFICATION_TUNES.info, instrument),
    "notification.success": createSoundFromTune(NOTIFICATION_TUNES.success, instrument),
    "notification.warning": createSoundFromTune(NOTIFICATION_TUNES.warning, instrument),
    "notification.error": createSoundFromTune(NOTIFICATION_TUNES.error, instrument),

    // Overlay sounds
    "overlay.open": createSoundFromTune(OVERLAY_TUNES.open, instrument),
    "overlay.close": createSoundFromTune(OVERLAY_TUNES.close, instrument),
    "overlay.expand": createSoundFromTune(OVERLAY_TUNES.expand, instrument),
    "overlay.collapse": createSoundFromTune(OVERLAY_TUNES.collapse, instrument),

    // Hero sounds
    "hero.complete": createSoundFromTune(HERO_TUNES.complete, instrument),
    "hero.milestone": createSoundFromTune(HERO_TUNES.milestone, instrument),
  };
}

/**
 * Create a custom sound pack with instrument and/or tune modifications for specific roles.
 *
 * This allows fine-tuning individual sounds while keeping the base instrument
 * character consistent across the pack.
 *
 * @param baseInstrument - The base instrument for the pack
 * @param instrumentOverrides - Partial instrument configs keyed by sound role
 * @param tuneOverrides - Partial tune overrides keyed by sound role (replaces the base tune)
 */
export function generateCustomSoundPack(
  baseInstrument: InstrumentConfig,
  instrumentOverrides?: Partial<Record<SoundRole, Partial<InstrumentConfig>>>,
  tuneOverrides?: Partial<Record<SoundRole, Partial<BaseTune>>>
): Record<SoundRole, SoundSynthesizer> {
  const basePack = generateSoundPack(baseInstrument);

  // Collect all roles that need regeneration
  const rolesToRegenerate = new Set<string>();
  if (instrumentOverrides) {
    for (const role of Object.keys(instrumentOverrides)) rolesToRegenerate.add(role);
  }
  if (tuneOverrides) {
    for (const role of Object.keys(tuneOverrides)) rolesToRegenerate.add(role);
  }

  if (rolesToRegenerate.size === 0) return basePack;

  // Apply overrides
  for (const role of rolesToRegenerate) {
    const soundRole = role as SoundRole;
    const instrumentOverride = instrumentOverrides?.[soundRole] ?? {};
    const mergedInstrument = { ...baseInstrument, ...instrumentOverride };

    // Determine which tune category this role belongs to
    const [category, name] = soundRole.split(".") as [string, string];

    let tune;
    switch (category) {
      case "interaction":
        tune = INTERACTION_TUNES[name as keyof typeof INTERACTION_TUNES];
        break;
      case "navigation":
        tune = NAVIGATION_TUNES[name as keyof typeof NAVIGATION_TUNES];
        break;
      case "notification":
        tune = NOTIFICATION_TUNES[name as keyof typeof NOTIFICATION_TUNES];
        break;
      case "overlay":
        tune = OVERLAY_TUNES[name as keyof typeof OVERLAY_TUNES];
        break;
      case "hero":
        tune = HERO_TUNES[name as keyof typeof HERO_TUNES];
        break;
      default:
        continue;
    }

    if (tune) {
      // Merge tune overrides if provided
      const mergedTune = tuneOverrides?.[soundRole]
        ? { ...tune, ...tuneOverrides[soundRole] }
        : tune;
      basePack[soundRole] = createSoundFromTune(mergedTune, mergedInstrument);
    }
  }

  return basePack;
}
