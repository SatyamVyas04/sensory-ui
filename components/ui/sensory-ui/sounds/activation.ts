import type { ActivationRole } from "../config/sound-roles";

/**
 * Activation sound data — base64-encoded audio.
 *
 * Each key is a SoundRole, each value is a `data:audio/mp3;base64,...` URI
 * that the engine decodes directly — no fetch to public/ needed.
 *
 * Replace the placeholder strings below with real base64-encoded MP3 data.
 * Use short (40–90 ms), soft transient sounds. Keep each under 15 KB.
 */
export const activation: Record<ActivationRole, string> = {
	"activation.primary": "",
	"activation.subtle": "",
	"activation.confirm": "",
	"activation.error": "",
};
