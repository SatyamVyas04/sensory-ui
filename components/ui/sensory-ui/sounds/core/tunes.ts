/**
 * Base tune definitions for all sound roles.
 *
 * These define the MUSICAL CONTENT of each sound - frequencies, durations,
 * pitch contours, rhythms - independent of the INSTRUMENT that plays them.
 *
 * This separation allows the same tune to be played by different instruments
 * (sine, square, noise, sawtooth, etc.) creating distinct soundpack characters.
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
  /** Whether to add harmonics */
  harmonics?: boolean;
  /** Harmonic ratio (e.g., 2 for octave) */
  harmonicRatio?: number;
  /** Harmonic volume relative to fundamental */
  harmonicVolume?: number;
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
// ---------------------------------------------------------------------------

export const INTERACTION_TUNES: Record<string, BaseTune> = {
  /** Tap - primary bold click. Short percussive noise transient.
   *  Reference: playConcept("click") — 8ms noise, bandpass 4000Hz Q=3, gain 0.5 */
  tap: {
    type: "click",
    duration: 0.008,
    filterFreq: 4000,
    filterQ: 3,
    volume: 0.50,
    meta: { decayConstant: 50 }
  },

  /** Subtle - secondary softer click. Shorter, higher filtered, quieter.
   *  Reference: playConcept("tick") — 4ms noise, highpass 3000Hz, gain 0.3 */
  subtle: {
    type: "tick",
    duration: 0.004,
    filterFreq: 3000,
    filterQ: 2,
    volume: 0.30,
    meta: { decayConstant: 20 }
  },

  /** Toggle - tick-tock state change indicator. Noise click + tonal tail.
   *  Reference: playConcept("toggle") — 12ms noise bandpass 2500Hz Q=3 gain 0.4
   *  + sine 800→400Hz over 30ms, gain 0.15 */
  toggle: {
    type: "toggle",
    duration: 0.04,
    frequency: 800,
    endFrequency: 400,
    filterFreq: 2500,
    filterQ: 3,
    volume: 0.40,
    meta: { noiseGain: 0.4, toneGain: 0.15, noiseDuration: 0.012, decayConstant: 80 }
  },

  /** Confirm - clean positive click. Slightly brighter/crisper than tap.
   *  A short percussive transient with a subtle tonal warmth. */
  confirm: {
    type: "click",
    duration: 0.010,
    filterFreq: 5000,
    filterQ: 3,
    volume: 0.50,
    meta: { decayConstant: 50 }
  },
};

// ---------------------------------------------------------------------------
// Navigation Tunes
// ---------------------------------------------------------------------------

export const NAVIGATION_TUNES: Record<string, BaseTune> = {
  /** Forward - rightward/upward motion (ascending pitch = positive direction) */
  forward: {
    type: "sweep",
    duration: 0.16,
    frequency: 280,
    endFrequency: 440,
    volume: 0.50,
    harmonics: true,
    harmonicRatio: 4,
    harmonicVolume: 0.12
  },

  /** Backward - mirror of forward (descending pitch = reverse direction) */
  backward: {
    type: "sweep",
    duration: 0.16,
    frequency: 440,
    endFrequency: 280,
    volume: 0.50,
    harmonics: true,
    harmonicRatio: 4,
    harmonicVolume: 0.12
  },

  /** Tab - quick whoosh for tab/segment switching.
   *  Reference: playConcept("whoosh") — 80ms noise with sine envelope,
   *  bandpass sweep 4000→1500Hz, gain 0.15 */
  tab: {
    type: "burst",
    duration: 0.08,
    filterFreq: 4000,
    filterQ: 1,
    volume: 0.15,
    meta: { endFilterFreq: 1500, sineEnvelope: true }
  },
};

// ---------------------------------------------------------------------------
// Notification Tunes
// ---------------------------------------------------------------------------

export const NOTIFICATION_TUNES: Record<string, BaseTune> = {
  /** Info - neutral chime, calm single tone (was "passive") */
  info: {
    type: "chime",
    duration: 0.22,
    frequency: 587.33,  // D5
    volume: 0.45,
    decay: 0.18,
    harmonics: true,
    harmonicRatio: 2,
    harmonicVolume: 0.15
  },

  /** Success - positive, two ascending notes (upward = positivity per Material) */
  success: {
    type: "arpeggio",
    duration: 0.4,
    notes: [523.25, 659.25],  // C5 → E5 (major third up = happy)
    noteDuration: 0.1,
    noteGap: 0.12,
    volume: 0.55,
    meta: { finalRing: 0.25 }
  },

  /** Warning - semitone descent = tense/unsettled, draws attention without alarm */
  warning: {
    type: "arpeggio",
    duration: 0.4,
    notes: [440, 440],  // A4 → Ab4 (semitone down = caution/tension)
    noteDuration: 0.08,
    noteGap: 0.1,
    volume: 0.60,
    meta: { finalRing: 0.18 }
  },

  /** Error - tritone descent = maximum tension, unmistakably negative */
  error: {
    type: "arpeggio",
    duration: 0.4,
    notes: [493.88, 349.23],  // B4 → F4 (tritone = alarm)
    noteDuration: 0.1,
    noteGap: 0.12,
    volume: 0.62,
    meta: { finalRing: 0.22 }
  },
};

// ---------------------------------------------------------------------------
// Overlay Tunes (Secondary UX sounds — overlay lifecycle events)
// Upward motion = opening/openness; Downward = ending/closedness (per Material)
// ---------------------------------------------------------------------------

export const OVERLAY_TUNES: Record<string, BaseTune> = {
  /** Open - dialog/sheet/dropdown/popover opens (rise = openness)
   *  Includes a subtle click transient at the start for tactility. */
  open: {
    type: "rise",
    duration: 0.21,
    frequency: 300,
    endFrequency: 460,
    volume: 0.55,
    harmonics: true,
    harmonicRatio: 2,
    harmonicVolume: 0.18,
    meta: { thirdPartial: true, thirdRatio: 1.2, thirdVolume: 0.1, clickLayer: true }
  },

  /** Close - tonal inverse of open (drop = closedness)
   *  Includes a subtle click transient at the start. */
  close: {
    type: "drop",
    duration: 0.21,
    frequency: 460,
    endFrequency: 300,
    volume: 0.55,
    harmonics: true,
    harmonicRatio: 2,
    harmonicVolume: 0.18,
    meta: { thirdPartial: true, thirdRatio: 1.2, thirdVolume: 0.1, clickLayer: true }
  },

  /** Expand - lighter than open, for accordion/collapsible content reveal
   *  Includes a subtle click transient at the start. */
  expand: {
    type: "rise",
    duration: 0.14,
    frequency: 370,
    endFrequency: 480,
    volume: 0.48,
    harmonics: true,
    harmonicRatio: 1.5,
    harmonicVolume: 0.16,
    meta: { clickLayer: true }
  },

  /** Collapse - paired with expand (mirrors expand direction)
   *  Includes a subtle click transient at the start. */
  collapse: {
    type: "drop",
    duration: 0.14,
    frequency: 480,
    endFrequency: 370,
    volume: 0.48,
    harmonics: true,
    harmonicRatio: 1.5,
    harmonicVolume: 0.16,
    meta: { clickLayer: true }
  },
};

// ---------------------------------------------------------------------------
// Hero Tunes
// ---------------------------------------------------------------------------

export const HERO_TUNES: Record<string, BaseTune> = {
  /** Complete - task completion fanfare */
  complete: {
    type: "arpeggio",
    duration: 1.1,
    notes: [NOTES.C4, NOTES.E4, NOTES.G4, NOTES.C5, NOTES.E5],
    noteDuration: 0.18,
    noteGap: 0.145,
    volume: 0.88,
    harmonics: true,
    harmonicRatio: 2,
    harmonicVolume: 0.28,
    meta: { finalRing: 0.55, shimmerCents: 3 }
  },

  /** Milestone - lighter celebration */
  milestone: {
    type: "arpeggio",
    duration: 0.65,
    notes: [NOTES.C4, NOTES.E4, NOTES.G4],
    noteDuration: 0.16,
    noteGap: 0.132,
    volume: 0.78,
    harmonics: true,
    harmonicRatio: 2,
    harmonicVolume: 0.22,
    meta: { finalRing: 0.3, shimmerCents: 3 }
  }
};

// ---------------------------------------------------------------------------
// Extended Sound Tunes (Additional UI sounds)
// ---------------------------------------------------------------------------

export const EXTENDED_TUNES: Record<string, BaseTune> = {
  /** Pop - brief attention-getter */
  pop: {
    type: "pop",
    duration: 0.05,
    frequency: 800,
    endFrequency: 1200,
    volume: 0.6,
    attack: 0.002,
    decay: 0.04
  },

  /** Tick - micro-confirmation */
  tick: {
    type: "tick",
    duration: 0.025,
    filterFreq: 3500,
    filterQ: 5,
    volume: 0.4
  },

  /** Drop - item dropped/placed */
  drop: {
    type: "drop",
    duration: 0.1,
    frequency: 600,
    endFrequency: 300,
    volume: 0.55,
    harmonics: true,
    harmonicRatio: 0.5,
    harmonicVolume: 0.3
  },

  /** Hover - subtle hover feedback (optional) */
  hover: {
    type: "tick",
    duration: 0.02,
    filterFreq: 4000,
    filterQ: 3,
    volume: 0.15
  },

  /** Select - item selection */
  select: {
    type: "pop",
    duration: 0.035,
    frequency: 900,
    volume: 0.45,
    attack: 0.003,
    decay: 0.03
  },

  /** Deselect - item deselection */
  deselect: {
    type: "pop",
    duration: 0.03,
    frequency: 700,
    volume: 0.35,
    attack: 0.002,
    decay: 0.025
  },

  /** Lock - security feedback */
  lock: {
    type: "drop",
    duration: 0.08,
    frequency: 500,
    endFrequency: 350,
    volume: 0.5,
    harmonics: true,
    harmonicRatio: 2,
    harmonicVolume: 0.15
  },

  /** Unlock - security feedback */
  unlock: {
    type: "rise",
    duration: 0.08,
    frequency: 350,
    endFrequency: 500,
    volume: 0.5,
    harmonics: true,
    harmonicRatio: 2,
    harmonicVolume: 0.15
  },

  /** Copy - clipboard copy */
  copy: {
    type: "toggle",
    duration: 0.04,
    frequency: 1000,
    endFrequency: 800,
    volume: 0.4
  },

  /** Undo - revert action */
  undo: {
    type: "sweep",
    duration: 0.12,
    frequency: 500,
    endFrequency: 350,
    volume: 0.45
  },

  /** Redo - re-apply action */
  redo: {
    type: "sweep",
    duration: 0.12,
    frequency: 350,
    endFrequency: 500,
    volume: 0.45
  },

  /** Delete - destructive action */
  delete: {
    type: "burst",
    duration: 0.08,
    filterFreq: 1500,
    filterQ: 1.5,
    volume: 0.5
  },

  /** Refresh - reload/update */
  refresh: {
    type: "wobble",
    duration: 0.2,
    frequency: 600,
    modFreq: 8,
    modDepth: 50,
    volume: 0.4
  }
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
