/**
 * Core sound synthesis module for sensory-ui.
 *
 * This module implements the instrument-based soundpack architecture where:
 * - Tunes define the musical content (frequencies, durations, patterns)
 * - Instruments define the synthesis technique (waveforms, filters, envelopes)
 * - Factory combines them to produce playable sounds
 *
 * This separation allows the same tunes to be played by different instruments,
 * creating distinct soundpack characters with minimal code duplication.
 */

export * from "./tunes";
export * from "./instruments";
export * from "./factory";
export { generateSoundPack } from "./pack-generator";
