/**
 * sensory-ui Sounds Module
 *
 * This module provides all sound-related exports for sensory-ui:
 * - Core synthesis engine (tunes, instruments, factory)
 * - Generated sound packs (soft, aero, arcade, organic, glass, etc.)
 * - Hand-crafted sound packs (default, arcade, wind, retro)
 */

// Core sound synthesis system
export * from "./core";

// Generated instrument-based packs
export * from "./packs";

// Legacy per-category exports (for backwards compatibility)
export { activation } from "./activation";
export { navigation } from "./navigation";
export { notifications } from "./notifications";
export { system } from "./system";
export { hero } from "./hero";

// Legacy complete packs
export { arcadePack } from "./arcade";
export { windPack } from "./wind";
export { retroPack } from "./retro";
