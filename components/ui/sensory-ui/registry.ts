import type { SoundRole } from "./sound-roles";

/**
 * Default role → static asset path mapping.
 * Paths are relative to Next.js public/ directory.
 *
 * This file is NOT modified by config overrides at runtime.
 * Overrides in sensory.config.js are resolved by config.ts before lookup.
 */
export const roleRegistry: Record<SoundRole, string> = {
  // Activation
  "activation.primary": "/sounds/activation/primary.mp3",
  "activation.subtle": "/sounds/activation/subtle.mp3",
  "activation.confirm": "/sounds/activation/confirm.mp3",
  "activation.error": "/sounds/activation/error.mp3",

  // Navigation
  "navigation.forward": "/sounds/navigation/forward.mp3",
  "navigation.backward": "/sounds/navigation/backward.mp3",
  "navigation.switch": "/sounds/navigation/switch.mp3",
  "navigation.scroll": "/sounds/navigation/scroll.mp3",

  // Notifications
  "notifications.passive": "/sounds/notifications/passive.mp3",
  "notifications.important": "/sounds/notifications/important.mp3",
  "notifications.success": "/sounds/notifications/success.mp3",
  "notifications.warning": "/sounds/notifications/warning.mp3",

  // System
  "system.open": "/sounds/system/open.mp3",
  "system.close": "/sounds/system/close.mp3",
  "system.expand": "/sounds/system/expand.mp3",
  "system.collapse": "/sounds/system/collapse.mp3",
  "system.focus": "/sounds/system/focus.mp3",

  // Hero
  "hero.complete": "/sounds/hero/complete.mp3",
  "hero.milestone": "/sounds/hero/milestone.mp3",
};
