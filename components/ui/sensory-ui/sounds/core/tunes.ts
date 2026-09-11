/**
 * Base tune definitions for all sound roles.
 *
 * These define the MUSICAL CONTENT of each sound - frequencies, durations,
 * pitch contours, rhythms - independent of the INSTRUMENT that plays them.
 *
 * This separation allows the same tune to be played by different instruments
 * (sine, square, noise, sawtooth, etc.) creating distinct soundpack characters.
 *
 * Sound design inspired by @web-kits/audio by Raphael Salaja — FM synthesis,
 * layered tones, and subtle gain levels for a polished, non-harsh feel.
 */

// ---------------------------------------------------------------------------
// Musical Constants
// ---------------------------------------------------------------------------

// Note frequencies (Hz)
export const NOTES = {
  // Octave 3
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
  // Octave 4
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  // Octave 5
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0, B5: 987.77,
  // Octave 6
  C6: 1046.5, D6: 1174.66, E6: 1318.51
} as const;

// ---------------------------------------------------------------------------
// Tune Types
// ---------------------------------------------------------------------------

export type TuneType =
  | "click"        // Short percussive transient
  | "pop"          // Brief tonal burst with attack
  | "toggle"       // State change indicator
  | "tick"         // Subtle micro-interaction
  | "sweep"        // Frequency glide (up/down)
  | "chime"        // Resonant tonal with decay
  | "arpeggio"     // Sequence of notes
  | "chord"        // Multiple simultaneous notes
  | "burst"        // Noise-based texture
  | "pulse"        // Repeating pattern
  | "drop"         // Pitch descends
  | "rise"         // Pitch ascends
  | "wobble"       // Modulated sound
  | "boop"         // Soft rounded tone with FM (like a gentle notification)
  | "bounce"       // Descending pitch with弹性 feel
  | "spring"       // Rising pitch with FM shimmer

export interface BaseTune {
  type: TuneType;
  /** Base duration in seconds */
  duration: number;
  /** Primary frequency or starting frequency */
  frequency?: number;
  /** End frequency for sweeps */
  endFrequency?: number;
  /** Array of frequencies for arpeggios/chords */
  notes?: number[];
  /** Note duration for arpeggios */
  noteDuration?: number;
  /** Gap between notes */
  noteGap?: number;
  /** Filter center frequency for noise-based sounds */
  filterFreq?: number;
  /** Filter Q value */
  filterQ?: number;
  /** Volume multiplier (0-1) */
  volume?: number;
  /** Attack time in seconds */
  attack?: number;
  /** Decay time in seconds */
  decay?: number;
  /** Sustain level (0-1). How much volume is held after decay. */
  sustain?: number;
  /** Release time in seconds */
  release?: number;
  /** Whether to add harmonics */
  harmonics?: boolean;
  /** Harmonic ratio (e.g., 2 for octave) */
  harmonicRatio?: number;
  /** Harmonic volume relative to fundamental */
  harmonicVolume?: number;
  /** FM modulation ratio (carrier:modulator frequency ratio) */
  fmRatio?: number;
  /** FM modulation depth (how much the modulator affects the carrier frequency in Hz) */
  fmDepth?: number;
  /** Modulation frequency for wobbles */
  modFreq?: number;
  /** Modulation depth */
  modDepth?: number;
  /** Number of pulses for pulse type */
  pulseCount?: number;
  /** Custom metadata */
  meta?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Interaction Tunes (Primary UX sounds — frequent, subtle, understated)
// Volumes follow a tiered hierarchy: subtle (0.15) → standard (0.25-0.30) → noticeable (0.35) → celebratory (0.45)
// FM added to tonal sounds for richness without complexity.
// ---------------------------------------------------------------------------

export const INTERACTION_TUNES: Record<string, BaseTune> = {
  /** Tap - standard UI click. Clean, neutral, moderate presence.
   *  Bandpass-filtered noise transient — the baseline click sound. */
  tap: {
    type: "click",
    duration: 0.008,
    filterFreq: 3800,
    filterQ: 2.5,
    volume: 0.28,
    meta: { decayConstant: 35 }
  },

  /** Subtle - keyboard click. A crisp, focused mechanical tick.
   *  Higher bandpass center + tighter Q for a defined "clack" transient. */
  subtle: {
    type: "click",
    duration: 0.008,
    filterFreq: 3600,
    filterQ: 3.5,
    volume: 0.25,
    meta: { decayConstant: 25 }
  },

  /** Toggle - smooth state-change. FM sine with pitch glide for silky feel.
   *  Raphael-style: low gain, FM warmth, smooth envelope. */
  toggle: {
    type: "pop",
    duration: 0.035,
    frequency: 700,
    endFrequency: 480,
    volume: 0.28,
    fmRatio: 0.5,
    fmDepth: 60,
    attack: 0.001,
    decay: 0.03,
  },

  /** Confirm - crispy affirmative click. Brighter, more resonant, snappier.
   *  Higher filter freq + Q gives a defined, satisfying "crunch". */
  confirm: {
    type: "click",
    duration: 0.012,
    filterFreq: 5500,
    filterQ: 4,
    volume: 0.30,
    meta: { decayConstant: 55 }
  },
};

// ---------------------------------------------------------------------------
// Navigation Tunes
// ---------------------------------------------------------------------------

export const NAVIGATION_TUNES: Record<string, BaseTune> = {
  /** Forward - rightward/upward motion (ascending pitch = positive direction) */
  forward: {
    type: "sweep",
    duration: 0.14,
    frequency: 280,
    endFrequency: 440,
    volume: 0.28,
    harmonics: true,
    harmonicRatio: 4,
    harmonicVolume: 0.08
  },

  /** Backward - mirror of forward (descending pitch = reverse direction) */
  backward: {
    type: "sweep",
    duration: 0.14,
    frequency: 440,
    endFrequency: 280,
    volume: 0.28,
    harmonics: true,
    harmonicRatio: 4,
    harmonicVolume: 0.08
  },

  /** Tab - quick tonal pop for tab/segment switching.
   *  FM sine with pitch rise — clean, defined, Raphael-style. */
  tab: {
    type: "pop",
    duration: 0.04,
    frequency: 1100,
    endFrequency: 1500,
    volume: 0.28,
    fmRatio: 0.5,
    fmDepth: 50,
    attack: 0.001,
    decay: 0.035
  },
};

// ---------------------------------------------------------------------------
// Notification Tunes
// Noticeable tier (0.35–0.40) — should stand out from interaction/nav sounds.
// FM adds bell-like richness. Sustain on chimes for longer ring.
// ---------------------------------------------------------------------------

export const NOTIFICATION_TUNES: Record<string, BaseTune> = {
  /** Info - neutral chime, calm single tone with FM richness.
   *  Raphael-style: FM ratio 2 for bell partial, moderate sustain. */
  info: {
    type: "chime",
    duration: 0.22,
    frequency: 880,
    volume: 0.35,
    sustain: 0.04,
    release: 0.12,
    fmRatio: 2,
    fmDepth: 120,
    harmonics: true,
    harmonicRatio: 2,
    harmonicVolume: 0.08
  },

  /** Success - positive, three ascending notes (like Raphael's success).
   *  C5 → E5 → G5 (major chord arpeggio = happy). */
  success: {
    type: "arpeggio",
    duration: 0.45,
    notes: [523.25, 659.25, 783.99],
    noteDuration: 0.08,
    noteGap: 0.07,
    volume: 0.35,
    fmRatio: 0.5,
    fmDepth: 60,
    meta: { finalRing: 0.3 }
  },

  /** Warning - semitone descent = tense/unsettled.
   *  Raphael-style: triangle wave, tight timing, low gain. */
  warning: {
    type: "arpeggio",
    duration: 0.35,
    notes: [440, 466],
    noteDuration: 0.06,
    noteGap: 0.01,
    volume: 0.35,
    meta: { finalRing: 0.12 }
  },

  /** Error - dark descending sweep with filter (like Raphael's error).
   *  Lowpass-filtered sawtooth + square for dark, mechanical feel. */
  error: {
    type: "burst",
    duration: 0.2,
    frequency: 320,
    endFrequency: 140,
    filterFreq: 1200,
    filterQ: 1.5,
    volume: 0.40,
    meta: { endFilterFreq: 400 }
  },
};

// ---------------------------------------------------------------------------
// Overlay Tunes (Secondary UX sounds — overlay lifecycle events)
// Upward motion = opening/openness; Downward = ending/closedness (per Material)
// ---------------------------------------------------------------------------

export const OVERLAY_TUNES: Record<string, BaseTune> = {
  /** Open - dialog/sheet/dropdown/popover opens (rise = openness)
   *  FM sine sweep with subtle click transient for tactility. */
  open: {
    type: "rise",
    duration: 0.18,
    frequency: 350,
    endFrequency: 1000,
    volume: 0.28,
    fmRatio: 0.5,
    fmDepth: 40,
    meta: { clickLayer: true, clickGain: 0.20 }
  },

  /** Close - tonal inverse of open (drop = closedness)
   *  Descending FM sine sweep with click transient. */
  close: {
    type: "drop",
    duration: 0.18,
    frequency: 800,
    endFrequency: 350,
    volume: 0.28,
    fmRatio: 0.5,
    fmDepth: 40,
    meta: { clickLayer: true, clickGain: 0.20 }
  },

  /** Expand - lighter than open, for accordion/collapsible content reveal.
   *  Short FM sine rise. */
  expand: {
    type: "rise",
    duration: 0.12,
    frequency: 500,
    endFrequency: 700,
    volume: 0.25,
    fmRatio: 0.5,
    fmDepth: 30,
    meta: { clickLayer: true, clickGain: 0.15 }
  },

  /** Collapse - paired with expand (mirrors expand direction).
   *  Short FM sine drop. */
  collapse: {
    type: "drop",
    duration: 0.12,
    frequency: 700,
    endFrequency: 500,
    volume: 0.25,
    fmRatio: 0.5,
    fmDepth: 30,
    meta: { clickLayer: true, clickGain: 0.15 }
  },
};

// ---------------------------------------------------------------------------
// Hero Tunes
// ---------------------------------------------------------------------------

export const HERO_TUNES: Record<string, BaseTune> = {
  /** Complete - task completion fanfare.
   *  Raphael-style: 4-note ascending arpeggio with FM + shimmer. */
  complete: {
    type: "arpeggio",
    duration: 0.9,
    notes: [523.25, 659.25, 783.99, 1046.5],
    noteDuration: 0.06,
    noteGap: 0.015,
    volume: 0.45,
    fmRatio: 0.5,
    fmDepth: 80,
    meta: { finalRing: 0.4, shimmerCents: 7 }
  },

  /** Milestone - lighter celebration.
   *  3-note ascending with FM. */
  milestone: {
    type: "arpeggio",
    duration: 0.5,
    notes: [523.25, 659.25, 783.99],
    noteDuration: 0.06,
    noteGap: 0.07,
    volume: 0.40,
    fmRatio: 0.5,
    fmDepth: 60,
    meta: { finalRing: 0.25, shimmerCents: 7 }
  }
};

// ---------------------------------------------------------------------------
// Extended Sound Tunes (Additional UI sounds)
// Raphael-inspired: FM on tonal sounds, lower gains, new types.
// ---------------------------------------------------------------------------

export const EXTENDED_TUNES: Record<string, BaseTune> = {
  /** Pop - brief attention-getter with FM */
  pop: {
    type: "pop",
    duration: 0.06,
    frequency: 400,
    endFrequency: 150,
    volume: 0.25,
    fmRatio: 0.5,
    fmDepth: 40,
    attack: 0.001,
    decay: 0.05
  },

  /** Boop - soft rounded notification with FM */
  boop: {
    type: "boop",
    duration: 0.1,
    frequency: 600,
    endFrequency: 250,
    volume: 0.22,
    fmRatio: 0.5,
    fmDepth: 40,
  },

  /** Bounce - elastic descending tone */
  bounce: {
    type: "bounce",
    duration: 0.12,
    frequency: 350,
    endFrequency: 180,
    volume: 0.25,
  },

  /** Spring - rising pitch with FM shimmer */
  spring: {
    type: "spring",
    duration: 0.15,
    frequency: 400,
    endFrequency: 900,
    volume: 0.22,
    fmRatio: 0.5,
    fmDepth: 50,
  },

  /** Tick - micro-confirmation (noise transient) */
  tick: {
    type: "tick",
    duration: 0.025,
    filterFreq: 3500,
    filterQ: 5,
    volume: 0.20
  },

  /** Drop - item dropped/placed */
  drop: {
    type: "drop",
    duration: 0.1,
    frequency: 600,
    endFrequency: 300,
    volume: 0.25,
    harmonics: true,
    harmonicRatio: 0.5,
    harmonicVolume: 0.2
  },

  /** Hover - subtle hover feedback (optional) */
  hover: {
    type: "tick",
    duration: 0.02,
    filterFreq: 4000,
    filterQ: 3,
    volume: 0.15
  },

  /** Select - item selection with FM */
  select: {
    type: "pop",
    duration: 0.05,
    frequency: 1400,
    volume: 0.25,
    fmRatio: 0.5,
    fmDepth: 60,
    attack: 0.002,
    decay: 0.04
  },

  /** Deselect - item deselection with FM */
  deselect: {
    type: "pop",
    duration: 0.04,
    frequency: 1200,
    volume: 0.22,
    fmRatio: 0.5,
    fmDepth: 60,
    attack: 0.001,
    decay: 0.03
  },

  /** Lock - security feedback (descending) */
  lock: {
    type: "drop",
    duration: 0.08,
    frequency: 500,
    endFrequency: 350,
    volume: 0.25,
    harmonics: true,
    harmonicRatio: 2,
    harmonicVolume: 0.10
  },

  /** Unlock - security feedback (ascending) */
  unlock: {
    type: "rise",
    duration: 0.08,
    frequency: 350,
    endFrequency: 500,
    volume: 0.25,
    harmonics: true,
    harmonicRatio: 2,
    harmonicVolume: 0.10
  },

  /** Copy - clipboard copy (two-tone click) */
  copy: {
    type: "pop",
    duration: 0.04,
    frequency: 1200,
    endFrequency: 1400,
    volume: 0.25,
    fmRatio: 0.5,
    fmDepth: 50,
  },

  /** Undo - revert action (descending sweep) */
  undo: {
    type: "sweep",
    duration: 0.12,
    frequency: 900,
    endFrequency: 600,
    volume: 0.25,
  },

  /** Redo - re-apply action (ascending sweep) */
  redo: {
    type: "sweep",
    duration: 0.12,
    frequency: 600,
    endFrequency: 900,
    volume: 0.25,
  },

  /** Delete - destructive action (dark descending) */
  delete: {
    type: "burst",
    duration: 0.15,
    frequency: 300,
    endFrequency: 100,
    filterFreq: 800,
    filterQ: 1.5,
    volume: 0.30,
    meta: { endFilterFreq: 300 }
  },

  /** Refresh - reload/update (wobble) */
  refresh: {
    type: "wobble",
    duration: 0.15,
    frequency: 523,
    modFreq: 8,
    modDepth: 40,
    volume: 0.25
  },

  /** Sparkle - shimmer effect with FM */
  sparkle: {
    type: "chime",
    duration: 0.3,
    frequency: 1047,
    volume: 0.22,
    sustain: 0.04,
    release: 0.15,
    fmRatio: 3.5,
    fmDepth: 200,
    harmonics: true,
    harmonicRatio: 2,
    harmonicVolume: 0.10,
    meta: { shimmerCents: 7 }
  },

  /** Heart - warm two-tone with FM */
  heart: {
    type: "arpeggio",
    duration: 0.25,
    notes: [500, 523],
    noteDuration: 0.06,
    noteGap: 0.08,
    volume: 0.25,
    fmRatio: 2.5,
    fmDepth: 100,
    meta: { finalRing: 0.15 }
  },
};

// ---------------------------------------------------------------------------
// All Tunes Combined
// ---------------------------------------------------------------------------

export const ALL_TUNES = {
  interaction: INTERACTION_TUNES,
  overlay: OVERLAY_TUNES,
  navigation: NAVIGATION_TUNES,
  notification: NOTIFICATION_TUNES,
  hero: HERO_TUNES,
  extended: EXTENDED_TUNES
} as const;

export type TuneCategory = keyof typeof ALL_TUNES;
