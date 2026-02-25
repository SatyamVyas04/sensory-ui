// sensory.config.js
// Optional project-root config for sensory-ui.
// Edit this file to customise sounds, volume, and category toggles.
// This file is never overwritten by sensory-ui updates.

/** @type {import('./components/ui/sensory-ui/config').SensoryUIConfig} */
module.exports = {
  // Global kill-switch. Set to false to silence all sounds everywhere.
  enabled: true,

  // Master volume multiplier (0–1). Applied to every sound before playback.
  // Keep this low — UI sounds are better heard at 20–40% volume.
  volume: 0.35,

  // Sound pack name. Informational in v1.0.
  theme: "default",

  // Per-category toggles. Set any category to false to silence it entirely.
  categories: {
    activation: true,
    navigation: true,
    notifications: true,
    system: true,
    hero: false, // Hero sounds are disabled by default — enable when needed.
  },

  // Role-level path overrides. Map any SoundRole to a custom file in public/.
  // Example:
  //   "activation.primary": "/sounds/custom/my-click.mp3",
  overrides: {},

  // How to handle prefers-reduced-motion.
  //   "inherit"   → respect the OS/browser setting (recommended)
  //   "force-off" → always suppress sounds regardless of user preference
  //   "force-on"  → always play sounds, ignore prefers-reduced-motion
  reducedMotion: "inherit",
};
