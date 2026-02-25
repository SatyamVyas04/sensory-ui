import type { NotificationsRole } from "../config/sound-roles";

/**
 * Notification sound data — base64-encoded audio.
 *
 * Each key is a SoundRole, each value is a `data:audio/mp3;base64,...` URI
 * that the engine decodes directly — no fetch to public/ needed.
 *
 * Replace the placeholder strings below with real base64-encoded MP3 data.
 * Use two-tier intensity sounds, 200–600 ms. Keep each under 15 KB.
 */
export const notifications: Record<NotificationsRole, string> = {
	"notifications.passive": "",
	"notifications.important": "",
	"notifications.success": "",
	"notifications.warning": "",
};
