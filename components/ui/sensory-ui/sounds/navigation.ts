import type { NavigationRole } from "../config/sound-roles";

/**
 * Navigation sound data — base64-encoded audio.
 *
 * Each key is a SoundRole, each value is a `data:audio/mp3;base64,...` URI
 * that the engine decodes directly — no fetch to public/ needed.
 *
 * Replace the placeholder strings below with real base64-encoded MP3 data.
 * Use sweep/whoosh-like sounds, 100–250 ms. Keep each under 15 KB.
 */
export const navigation: Record<NavigationRole, string> = {
	"navigation.forward": "",
	"navigation.backward": "",
	"navigation.switch": "",
	"navigation.scroll": "",
};
