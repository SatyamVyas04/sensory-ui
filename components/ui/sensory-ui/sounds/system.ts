import type { SystemRole } from "../config/sound-roles";

/**
 * System sound data — base64-encoded audio.
 *
 * Each key is a SoundRole, each value is a `data:audio/mp3;base64,...` URI
 * that the engine decodes directly — no fetch to public/ needed.
 *
 * Replace the placeholder strings below with real base64-encoded MP3 data.
 * Use tonal pairs (open ↔ close), 120–400 ms. Keep each under 15 KB.
 */
export const system: Record<SystemRole, string> = {
	"system.open": "",
	"system.close": "",
	"system.expand": "",
	"system.collapse": "",
	"system.focus": "",
};
