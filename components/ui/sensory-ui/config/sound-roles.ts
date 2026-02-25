export type SoundCategory =
  | "activation"
  | "navigation"
  | "notifications"
  | "system"
  | "hero";

export type ActivationRole =
  | "activation.primary"
  | "activation.subtle"
  | "activation.confirm"
  | "activation.error";

export type NavigationRole =
  | "navigation.forward"
  | "navigation.backward"
  | "navigation.switch"
  | "navigation.scroll";

export type NotificationsRole =
  | "notifications.passive"
  | "notifications.important"
  | "notifications.success"
  | "notifications.warning";

export type SystemRole =
  | "system.open"
  | "system.close"
  | "system.expand"
  | "system.collapse"
  | "system.focus";

export type HeroRole = "hero.complete" | "hero.milestone";

export type SoundRole =
  | ActivationRole
  | NavigationRole
  | NotificationsRole
  | SystemRole
  | HeroRole;

export const ALL_SOUND_ROLES: SoundRole[] = [
  "activation.primary",
  "activation.subtle",
  "activation.confirm",
  "activation.error",
  "navigation.forward",
  "navigation.backward",
  "navigation.switch",
  "navigation.scroll",
  "notifications.passive",
  "notifications.important",
  "notifications.success",
  "notifications.warning",
  "system.open",
  "system.close",
  "system.expand",
  "system.collapse",
  "system.focus",
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
