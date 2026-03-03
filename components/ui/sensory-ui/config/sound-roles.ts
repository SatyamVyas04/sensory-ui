/**
 * sensory-ui Sound Roles
 *
 * Defines the 19 semantic sound roles organised into 5 categories.
 * These types are the public contract — every component's `sound` prop
 * accepts a value of type `SoundRole`.
 *
 * Material Design alignment:
 *   interaction.*  → Primary UX sounds   (frequent, subtle, understated)
 *   overlay.*      → Secondary UX sounds  (state changes, less frequent)
 *   navigation.*   → Primary UX sounds   (navigation feedback)
 *   notification.* → Notifications        (attention-directing)
 *   hero.*         → Hero sounds          (celebration, disabled by default)
 */

export type SoundCategory =
  | "interaction"
  | "overlay"
  | "navigation"
  | "notification"
  | "hero";

export type InteractionRole =
  | "interaction.tap"
  | "interaction.toggle"
  | "interaction.toggleUp"
  | "interaction.toggleDown"
  | "interaction.confirm"
  | "interaction.disabled";

export type OverlayRole =
  | "overlay.open"
  | "overlay.close"
  | "overlay.expand"
  | "overlay.collapse";

export type NavigationRole =
  | "navigation.forward"
  | "navigation.backward"
  | "navigation.tab";

export type NotificationRole =
  | "notification.info"
  | "notification.success"
  | "notification.warning"
  | "notification.error";

export type HeroRole = "hero.complete" | "hero.milestone";

export type SoundRole =
  | InteractionRole
  | OverlayRole
  | NavigationRole
  | NotificationRole
  | HeroRole;

export const ALL_SOUND_ROLES: SoundRole[] = [
  "interaction.tap",
  "interaction.toggle",
  "interaction.toggleUp",
  "interaction.toggleDown",
  "interaction.confirm",
  "interaction.disabled",
  "overlay.open",
  "overlay.close",
  "overlay.expand",
  "overlay.collapse",
  "navigation.forward",
  "navigation.backward",
  "navigation.tab",
  "notification.info",
  "notification.success",
  "notification.warning",
  "notification.error",
  "hero.complete",
  "hero.milestone",
];

export function parseRole(role: SoundRole): {
  category: SoundCategory;
  name: string;
} {
  const [category, name] = role.split(".") as [SoundCategory, string];
  return { category, name };
}
