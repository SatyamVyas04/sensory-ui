// sensory.config.js
// Optional project-root config for sensory-ui.
// Edit this file to customise sounds, volume, and category toggles.
// This file is never overwritten by sensory-ui updates.

/** @type {import('./components/ui/sensory-ui/config/config').SensoryUIConfig} */
module.exports = {
  // Global kill-switch. Set to false to silence all sounds everywhere.
  enabled: true,

  // Master volume multiplier (0–1). Applied to every sound before playback.
  // Keep this low — UI sounds are generally best at 20–40% volume.
  volume: 0.35,

  // -------------------------------------------------------------------
  // Sound pack / theme.
  //
  // Selects which built-in sound pack to use. Sounds are generated
  // programmatically via the Web Audio API — no audio files needed.
  //
  // Available packs:
  //   "soft"       → warm, rounded, gentle - felt mallets
  //   "aero"       → airy, breathy, ethereal - wind chimes (default)
  //   "arcade"     → 8-bit chiptune square-wave sounds
  //   "organic"    → natural, warm, wooden - marimba
  //   "glass"      → crystalline, bright - struck glass
  //   "industrial" → metallic, harsh, mechanical
  //   "minimal"    → clean, sparse, understated
  //   "retro"      → analog synth, warm square waves
  //   "crisp"      → sharp, defined, precise - hi-fi
  //
  // You can override any individual role via the `overrides` field below,
  // regardless of which pack is active.
  // -------------------------------------------------------------------
  theme: "aero",

  // Per-category toggles. Set any category to false to silence it entirely.
  categories: {
    activation: true,
    navigation: true,
    notifications: true,
    system: true,
    hero: false, // Hero sounds are disabled by default — enable when needed.
  },

  // Role-level overrides. Map any SoundRole to a custom audio source.
  // Values can be:
  //   - A URL path to a file in public/ (e.g. "/sounds/custom/my-click.mp3")
  //   - A base64 data URI (e.g. "data:audio/mp3;base64,//uQx...")
  // These override the active sound pack for that role only.
  // Example:
  //   "activation.primary": "/sounds/custom/my-click.mp3",
  overrides: {},

  // How to handle prefers-reduced-motion.
  //   "inherit"   → respect the OS/browser setting (recommended)
  //   "force-off" → always suppress sounds regardless of user preference
  //   "force-on"  → always play sounds, ignore prefers-reduced-motion
  reducedMotion: "inherit",
};
