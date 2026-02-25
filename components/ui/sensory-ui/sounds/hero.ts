import type { HeroRole } from "../config/sound-roles";

/**
 * Hero sound data — base64-encoded audio.
 *
 * Each key is a SoundRole, each value is a `data:audio/mp3;base64,...` URI
 * that the engine decodes directly — no fetch to public/ needed.
 *
 * Replace the placeholder strings below with real base64-encoded MP3 data.
 * These are longer, celebratory sounds (800–1800 ms). Keep each under 50 KB.
 * Hero sounds are disabled by default in sensory.config.js.
 */
export const hero: Record<HeroRole, string> = {
	"hero.complete": "",
	"hero.milestone": "",
};
