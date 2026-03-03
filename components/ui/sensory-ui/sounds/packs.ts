/**
 * Generated Sound Packs
 *
 * 9 distinct sound packs generated using the instrument-based system.
 * Each pack uses a different instrument configuration to create
 * unique sonic characters from the same base tunes.
 *
 * Hero sounds are custom-crafted for each pack to match their character.
 */

import type { SoundRole } from "../config/sound-roles";
import type { SoundSynthesizer, PlaySoundOptions, SoundPlayback } from "../config/engine";
import {
  SOFT_INSTRUMENT,
  AERO_INSTRUMENT,
  ARCADE_INSTRUMENT,
  ORGANIC_INSTRUMENT,
  GLASS_INSTRUMENT,
  INDUSTRIAL_INSTRUMENT,
  MINIMAL_INSTRUMENT,
  RETRO_INSTRUMENT,
  CRISP_INSTRUMENT,
} from "./core/instruments";
import { generateSoundPack } from "./core/pack-generator";

// ---------------------------------------------------------------------------
// Sound Pack Type
// ---------------------------------------------------------------------------

export type GeneratedSoundPack = Record<SoundRole, SoundSynthesizer>;

// ---------------------------------------------------------------------------
// Note frequencies for hero sounds
// ---------------------------------------------------------------------------
const NOTES = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0, B5: 987.77,
  C6: 1046.5, D6: 1174.66, E6: 1318.51, G6: 1567.98,
};

// ---------------------------------------------------------------------------
// Soft Pack - Warm, gentle hero sounds
// ---------------------------------------------------------------------------

const softHeroComplete: SoundSynthesizer = (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.65;
  // Lullaby resolution: descend from E→C then rise to G→C5
  const notes = [NOTES.E4, NOTES.C4, NOTES.G4, NOTES.C5];
  const oscs: OscillatorNode[] = [];
  const gains: GainNode[] = [];

  notes.forEach((freq, i) => {
    const noteStart = t + i * 0.22;
    const isLast = i === notes.length - 1;
    const ringDur = isLast ? 0.8 : 0.15;
    const decay = noteStart + 0.2 + ringDur;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq * 0.8;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, noteStart);
    g.gain.linearRampToValueAtTime(vol, noteStart + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, decay);

    osc.connect(g);
    g.connect(ctx.destination);
    oscs.push(osc);
    gains.push(g);

    osc.start(noteStart);
    osc.stop(decay + 0.05);

    if (isLast) {
      osc.onended = () => {
        oscs.forEach(o => { try { o.disconnect(); } catch {} });
        gains.forEach(g => { try { g.disconnect(); } catch {} });
        opts.onEnd?.();
      };
    }
  });

  return { stop: () => oscs.forEach(o => { try { o.stop(); } catch {} }) };
};

const softHeroMilestone: SoundSynthesizer = (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.55;
  // Gentle descending major 3rd
  const notes = [NOTES.E4, NOTES.C4];
  const oscs: OscillatorNode[] = [];

  notes.forEach((freq, i) => {
    const noteStart = t + i * 0.25;
    const isLast = i === notes.length - 1;
    const decay = noteStart + (isLast ? 0.6 : 0.2);

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq * 0.8;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, noteStart);
    g.gain.linearRampToValueAtTime(vol, noteStart + 0.04);
    g.gain.exponentialRampToValueAtTime(0.001, decay);

    osc.connect(g);
    g.connect(ctx.destination);
    oscs.push(osc);

    osc.start(noteStart);
    osc.stop(decay + 0.05);

    if (isLast) {
      osc.onended = () => {
        oscs.forEach(o => { try { o.disconnect(); } catch {} });
        opts.onEnd?.();
      };
    }
  });

  return { stop: () => oscs.forEach(o => { try { o.stop(); } catch {} }) };
};

export const softPack: GeneratedSoundPack = {
  ...generateSoundPack(SOFT_INSTRUMENT),
  "hero.complete": softHeroComplete,
  "hero.milestone": softHeroMilestone,
};

// ---------------------------------------------------------------------------
// Aero Pack - Ethereal, breathy hero sounds with shimmer
// ---------------------------------------------------------------------------

const aeroHeroComplete: SoundSynthesizer = (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.7;
  // Open-sky ascending 4ths and 5ths
  const notes = [NOTES.D4, NOTES.G4, NOTES.A4, NOTES.D5, NOTES.G5];
  const oscs: OscillatorNode[] = [];

  notes.forEach((freq, i) => {
    const noteStart = t + i * 0.18;
    const isLast = i === notes.length - 1;
    const decay = noteStart + 0.15 + (isLast ? 0.5 : 0.08);

    // Main tone
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;

    // Shimmer octave
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = freq * 2.003;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, noteStart);
    g.gain.linearRampToValueAtTime(vol, noteStart + 0.015);
    g.gain.exponentialRampToValueAtTime(0.001, decay);

    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.001, noteStart);
    g2.gain.linearRampToValueAtTime(vol * 0.25, noteStart + 0.015);
    g2.gain.exponentialRampToValueAtTime(0.001, decay);

    osc.connect(g); g.connect(ctx.destination);
    osc2.connect(g2); g2.connect(ctx.destination);
    oscs.push(osc, osc2);

    osc.start(noteStart); osc.stop(decay + 0.05);
    osc2.start(noteStart); osc2.stop(decay + 0.05);

    if (isLast) {
      osc.onended = () => {
        oscs.forEach(o => { try { o.disconnect(); } catch {} });
        opts.onEnd?.();
      };
    }
  });

  return { stop: () => oscs.forEach(o => { try { o.stop(); } catch {} }) };
};

const aeroHeroMilestone: SoundSynthesizer = (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.6;
  // Open ascending 5ths
  const notes = [NOTES.D4, NOTES.A4, NOTES.D5];
  const oscs: OscillatorNode[] = [];

  notes.forEach((freq, i) => {
    const noteStart = t + i * 0.15;
    const isLast = i === notes.length - 1;
    const decay = noteStart + 0.12 + (isLast ? 0.35 : 0.06);

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;

    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = freq * 2.003;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, noteStart);
    g.gain.linearRampToValueAtTime(vol, noteStart + 0.012);
    g.gain.exponentialRampToValueAtTime(0.001, decay);

    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.001, noteStart);
    g2.gain.linearRampToValueAtTime(vol * 0.2, noteStart + 0.012);
    g2.gain.exponentialRampToValueAtTime(0.001, decay);

    osc.connect(g); g.connect(ctx.destination);
    osc2.connect(g2); g2.connect(ctx.destination);
    oscs.push(osc, osc2);

    osc.start(noteStart); osc.stop(decay + 0.05);
    osc2.start(noteStart); osc2.stop(decay + 0.05);

    if (isLast) {
      osc.onended = () => {
        oscs.forEach(o => { try { o.disconnect(); } catch {} });
        opts.onEnd?.();
      };
    }
  });

  return { stop: () => oscs.forEach(o => { try { o.stop(); } catch {} }) };
};

export const aeroPack: GeneratedSoundPack = {
  ...generateSoundPack(AERO_INSTRUMENT),
  "hero.complete": aeroHeroComplete,
  "hero.milestone": aeroHeroMilestone,
};

// ---------------------------------------------------------------------------
// Arcade Pack - 8-bit chiptune fanfares
// ---------------------------------------------------------------------------

const arcadeHeroComplete: SoundSynthesizer = (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.6;
  // G major ascending fanfare
  const notes = [NOTES.G4, NOTES.B4, NOTES.D5, NOTES.G5, NOTES.B5, NOTES.D6, NOTES.G6];
  const oscs: OscillatorNode[] = [];

  notes.forEach((freq, i) => {
    const noteStart = t + i * 0.07;
    const isLast = i === notes.length - 1;
    const dur = isLast ? 0.25 : 0.055;

    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.value = freq * 1.5;

    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, noteStart);
    g.gain.exponentialRampToValueAtTime(0.001, noteStart + dur);

    osc.connect(g);
    g.connect(ctx.destination);
    oscs.push(osc);

    osc.start(noteStart);
    osc.stop(noteStart + dur + 0.01);

    if (isLast) {
      osc.onended = () => {
        oscs.forEach(o => { try { o.disconnect(); } catch {} });
        opts.onEnd?.();
      };
    }
  });

  return { stop: () => oscs.forEach(o => { try { o.stop(); } catch {} }) };
};

const arcadeHeroMilestone: SoundSynthesizer = (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.5;
  // G major ascending arpeggio
  const notes = [NOTES.G4, NOTES.B4, NOTES.D5, NOTES.G5];
  const oscs: OscillatorNode[] = [];

  notes.forEach((freq, i) => {
    const noteStart = t + i * 0.065;
    const isLast = i === notes.length - 1;
    const dur = isLast ? 0.18 : 0.05;

    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.value = freq * 1.5;

    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, noteStart);
    g.gain.exponentialRampToValueAtTime(0.001, noteStart + dur);

    osc.connect(g);
    g.connect(ctx.destination);
    oscs.push(osc);

    osc.start(noteStart);
    osc.stop(noteStart + dur + 0.01);

    if (isLast) {
      osc.onended = () => {
        oscs.forEach(o => { try { o.disconnect(); } catch {} });
        opts.onEnd?.();
      };
    }
  });

  return { stop: () => oscs.forEach(o => { try { o.stop(); } catch {} }) };
};

// ---------------------------------------------------------------------------
// Arcade Pack export
// ---------------------------------------------------------------------------
export const arcadePack: GeneratedSoundPack = {
  ...generateSoundPack(ARCADE_INSTRUMENT),
  "hero.complete": arcadeHeroComplete,
  "hero.milestone": arcadeHeroMilestone,
};

// ---------------------------------------------------------------------------
// Organic Pack - Marimba-like wooden tones
// ---------------------------------------------------------------------------

const organicHeroComplete: SoundSynthesizer = (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.7;
  // Bouncing pattern: up-down-up for organic/xylophone feel
  const notes = [NOTES.C4, NOTES.G4, NOTES.E4, NOTES.A4, NOTES.C5];
  const oscs: OscillatorNode[] = [];

  notes.forEach((freq, i) => {
    const noteStart = t + i * 0.14;
    const isLast = i === notes.length - 1;
    const decay = noteStart + 0.15 + (isLast ? 0.45 : 0.1);

    // Triangle wave for wooden character
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = freq * 0.9;

    // Add subtle harmonic for body
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = freq * 2.8;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, noteStart);
    g.gain.linearRampToValueAtTime(vol, noteStart + 0.008);
    g.gain.exponentialRampToValueAtTime(0.001, decay);

    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.001, noteStart);
    g2.gain.linearRampToValueAtTime(vol * 0.15, noteStart + 0.005);
    g2.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.08);

    osc.connect(g); g.connect(ctx.destination);
    osc2.connect(g2); g2.connect(ctx.destination);
    oscs.push(osc, osc2);

    osc.start(noteStart); osc.stop(decay + 0.05);
    osc2.start(noteStart); osc2.stop(noteStart + 0.1);

    if (isLast) {
      osc.onended = () => {
        oscs.forEach(o => { try { o.disconnect(); } catch {} });
        opts.onEnd?.();
      };
    }
  });

  return { stop: () => oscs.forEach(o => { try { o.stop(); } catch {} }) };
};

const organicHeroMilestone: SoundSynthesizer = (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.6;
  // Ascending 5ths bounce
  const notes = [NOTES.C4, NOTES.G4, NOTES.C5];
  const oscs: OscillatorNode[] = [];

  notes.forEach((freq, i) => {
    const noteStart = t + i * 0.12;
    const isLast = i === notes.length - 1;
    const decay = noteStart + 0.12 + (isLast ? 0.35 : 0.08);

    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = freq * 0.9;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, noteStart);
    g.gain.linearRampToValueAtTime(vol, noteStart + 0.006);
    g.gain.exponentialRampToValueAtTime(0.001, decay);

    osc.connect(g);
    g.connect(ctx.destination);
    oscs.push(osc);

    osc.start(noteStart);
    osc.stop(decay + 0.05);

    if (isLast) {
      osc.onended = () => {
        oscs.forEach(o => { try { o.disconnect(); } catch {} });
        opts.onEnd?.();
      };
    }
  });

  return { stop: () => oscs.forEach(o => { try { o.stop(); } catch {} }) };
};

export const organicPack: GeneratedSoundPack = {
  ...generateSoundPack(ORGANIC_INSTRUMENT),
  "hero.complete": organicHeroComplete,
  "hero.milestone": organicHeroMilestone,
};

// ---------------------------------------------------------------------------
// Glass Pack - Crystalline bell-like tones
// ---------------------------------------------------------------------------

const glassHeroComplete: SoundSynthesizer = (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.45;
  // Ascending run with major-7th shimmer
  const notes = [NOTES.E5, NOTES.G5, NOTES.B5, NOTES.C6, NOTES.E6];
  const oscs: OscillatorNode[] = [];

  notes.forEach((freq, i) => {
    const noteStart = t + i * 0.18;
    const isLast = i === notes.length - 1;
    const ringTime = isLast ? 1.2 : 0.4;

    // Fundamental - pure sine
    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.value = freq;

    // Octave harmonic - soft shimmer
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = freq * 2;

    // Bell partial at 2.4x for glassy character (not harsh 3.2x)
    const osc3 = ctx.createOscillator();
    osc3.type = "sine";
    osc3.frequency.value = freq * 2.4;

    // Gentle attack, long decay for glass resonance
    const g1 = ctx.createGain();
    g1.gain.setValueAtTime(0.001, noteStart);
    g1.gain.linearRampToValueAtTime(vol, noteStart + 0.015);
    g1.gain.exponentialRampToValueAtTime(0.001, noteStart + ringTime);

    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.001, noteStart);
    g2.gain.linearRampToValueAtTime(vol * 0.3, noteStart + 0.01);
    g2.gain.exponentialRampToValueAtTime(0.001, noteStart + ringTime * 0.8);

    const g3 = ctx.createGain();
    g3.gain.setValueAtTime(0.001, noteStart);
    g3.gain.linearRampToValueAtTime(vol * 0.12, noteStart + 0.008);
    g3.gain.exponentialRampToValueAtTime(0.001, noteStart + ringTime * 0.5);

    osc1.connect(g1); g1.connect(ctx.destination);
    osc2.connect(g2); g2.connect(ctx.destination);
    osc3.connect(g3); g3.connect(ctx.destination);
    oscs.push(osc1, osc2, osc3);

    osc1.start(noteStart); osc1.stop(noteStart + ringTime + 0.1);
    osc2.start(noteStart); osc2.stop(noteStart + ringTime + 0.1);
    osc3.start(noteStart); osc3.stop(noteStart + ringTime + 0.1);

    if (isLast) {
      osc1.onended = () => {
        oscs.forEach(o => { try { o.disconnect(); } catch {} });
        opts.onEnd?.();
      };
    }
  });

  return { stop: () => oscs.forEach(o => { try { o.stop(); } catch {} }) };
};

const glassHeroMilestone: SoundSynthesizer = (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.4;
  // Ascending with open voicing
  const notes = [NOTES.G4, NOTES.B4, NOTES.E5];
  const oscs: OscillatorNode[] = [];

  notes.forEach((freq, i) => {
    const noteStart = t + i * 0.15;
    const isLast = i === notes.length - 1;
    const ringTime = isLast ? 0.8 : 0.35;

    // Fundamental
    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.value = freq;

    // Octave shimmer
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = freq * 2;

    const g1 = ctx.createGain();
    g1.gain.setValueAtTime(0.001, noteStart);
    g1.gain.linearRampToValueAtTime(vol, noteStart + 0.012);
    g1.gain.exponentialRampToValueAtTime(0.001, noteStart + ringTime);

    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.001, noteStart);
    g2.gain.linearRampToValueAtTime(vol * 0.25, noteStart + 0.01);
    g2.gain.exponentialRampToValueAtTime(0.001, noteStart + ringTime * 0.7);

    osc1.connect(g1); g1.connect(ctx.destination);
    osc2.connect(g2); g2.connect(ctx.destination);
    oscs.push(osc1, osc2);

    osc1.start(noteStart); osc1.stop(noteStart + ringTime + 0.1);
    osc2.start(noteStart); osc2.stop(noteStart + ringTime + 0.1);

    if (isLast) {
      osc1.onended = () => {
        oscs.forEach(o => { try { o.disconnect(); } catch {} });
        opts.onEnd?.();
      };
    }
  });

  return { stop: () => oscs.forEach(o => { try { o.stop(); } catch {} }) };
};

export const glassPack: GeneratedSoundPack = {
  ...generateSoundPack(GLASS_INSTRUMENT),
  "hero.complete": glassHeroComplete,
  "hero.milestone": glassHeroMilestone,
};

// ---------------------------------------------------------------------------
// Industrial Pack - Metallic, powerful stabs
// ---------------------------------------------------------------------------

const industrialHeroComplete: SoundSynthesizer = (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.7;
  const oscs: OscillatorNode[] = [];

  // E power chord hit
  const chordFreqs = [NOTES.E3, NOTES.B3, NOTES.E4];
  chordFreqs.forEach((freq) => {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = freq * 0.7;

    const g = ctx.createGain();
    g.gain.setValueAtTime(vol * 0.4, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    osc.connect(g);
    g.connect(ctx.destination);
    oscs.push(osc);

    osc.start(t);
    osc.stop(t + 0.55);
  });

  // Rising E minor arpeggio
  const arpeggioNotes = [NOTES.E4, NOTES.G4, NOTES.B4, NOTES.E5];
  arpeggioNotes.forEach((freq, i) => {
    const noteStart = t + 0.35 + i * 0.1;
    const isLast = i === arpeggioNotes.length - 1;

    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = freq * 0.7;

    const g = ctx.createGain();
    g.gain.setValueAtTime(vol * 0.5, noteStart);
    g.gain.exponentialRampToValueAtTime(0.001, noteStart + (isLast ? 0.35 : 0.08));

    osc.connect(g);
    g.connect(ctx.destination);
    oscs.push(osc);

    osc.start(noteStart);
    osc.stop(noteStart + (isLast ? 0.4 : 0.1));

    if (isLast) {
      osc.onended = () => {
        oscs.forEach(o => { try { o.disconnect(); } catch {} });
        opts.onEnd?.();
      };
    }
  });

  return { stop: () => oscs.forEach(o => { try { o.stop(); } catch {} }) };
};

const industrialHeroMilestone: SoundSynthesizer = (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.6;
  const oscs: OscillatorNode[] = [];

  // E power fifth hit
  [NOTES.E3, NOTES.B3].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = freq * 0.7;

    const g = ctx.createGain();
    g.gain.setValueAtTime(vol * 0.5, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    osc.connect(g);
    g.connect(ctx.destination);
    oscs.push(osc);

    osc.start(t);
    osc.stop(t + 0.45);
  });

  // E octave stab
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.value = NOTES.E4 * 0.7;

  const g = ctx.createGain();
  g.gain.setValueAtTime(vol * 0.6, t + 0.25);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

  osc.connect(g);
  g.connect(ctx.destination);
  oscs.push(osc);

  osc.start(t + 0.25);
  osc.stop(t + 0.6);

  osc.onended = () => {
    oscs.forEach(o => { try { o.disconnect(); } catch {} });
    opts.onEnd?.();
  };

  return { stop: () => oscs.forEach(o => { try { o.stop(); } catch {} }) };
};

export const industrialPack: GeneratedSoundPack = {
  ...generateSoundPack(INDUSTRIAL_INSTRUMENT),
  "hero.complete": industrialHeroComplete,
  "hero.milestone": industrialHeroMilestone,
};

// ---------------------------------------------------------------------------
// Minimal Pack - Clean, understated resolution
// ---------------------------------------------------------------------------

const minimalHeroComplete: SoundSynthesizer = (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.4;
  const notes = [NOTES.C4, NOTES.G4, NOTES.C5];
  const oscs: OscillatorNode[] = [];

  notes.forEach((freq, i) => {
    const noteStart = t + i * 0.3;
    const isLast = i === notes.length - 1;
    const decay = noteStart + (isLast ? 0.7 : 0.25);

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, noteStart);
    g.gain.linearRampToValueAtTime(vol, noteStart + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, decay);

    osc.connect(g);
    g.connect(ctx.destination);
    oscs.push(osc);

    osc.start(noteStart);
    osc.stop(decay + 0.05);

    if (isLast) {
      osc.onended = () => {
        oscs.forEach(o => { try { o.disconnect(); } catch {} });
        opts.onEnd?.();
      };
    }
  });

  return { stop: () => oscs.forEach(o => { try { o.stop(); } catch {} }) };
};

const minimalHeroMilestone: SoundSynthesizer = (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.35;
  const notes = [NOTES.G3, NOTES.C4];
  const oscs: OscillatorNode[] = [];

  notes.forEach((freq, i) => {
    const noteStart = t + i * 0.25;
    const isLast = i === notes.length - 1;
    const decay = noteStart + (isLast ? 0.5 : 0.2);

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, noteStart);
    g.gain.linearRampToValueAtTime(vol, noteStart + 0.015);
    g.gain.exponentialRampToValueAtTime(0.001, decay);

    osc.connect(g);
    g.connect(ctx.destination);
    oscs.push(osc);

    osc.start(noteStart);
    osc.stop(decay + 0.05);

    if (isLast) {
      osc.onended = () => {
        oscs.forEach(o => { try { o.disconnect(); } catch {} });
        opts.onEnd?.();
      };
    }
  });

  return { stop: () => oscs.forEach(o => { try { o.stop(); } catch {} }) };
};

export const minimalPack: GeneratedSoundPack = {
  ...generateSoundPack(MINIMAL_INSTRUMENT),
  "hero.complete": minimalHeroComplete,
  "hero.milestone": minimalHeroMilestone,
};

// ---------------------------------------------------------------------------
// Retro Pack - Synthwave chord stabs with arpeggios
// ---------------------------------------------------------------------------

const retroHeroComplete: SoundSynthesizer = (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.55;
  const oscs: OscillatorNode[] = [];

  // Opening A minor chord with detuned saws
  const chordNotes = [NOTES.A3, NOTES.C4, NOTES.E4];
  chordNotes.forEach((freq) => {
    [-6, 6].forEach((cents) => {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = freq * 0.85;
      osc.detune.value = cents;

      const g = ctx.createGain();
      g.gain.setValueAtTime(vol * 0.35, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

      osc.connect(g);
      g.connect(ctx.destination);
      oscs.push(osc);

      osc.start(t);
      osc.stop(t + 0.5);
    });
  });

  // Rising A minor arpeggio tail
  const arpeggioNotes = [NOTES.A4, NOTES.C5, NOTES.E5, NOTES.A5];
  arpeggioNotes.forEach((freq, i) => {
    const noteStart = t + 0.35 + i * 0.1;
    const isLast = i === arpeggioNotes.length - 1;

    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = freq * 0.85;
    osc.detune.value = 5;

    const g = ctx.createGain();
    g.gain.setValueAtTime(vol * 0.5, noteStart);
    g.gain.exponentialRampToValueAtTime(0.001, noteStart + (isLast ? 0.3 : 0.08));

    osc.connect(g);
    g.connect(ctx.destination);
    oscs.push(osc);

    osc.start(noteStart);
    osc.stop(noteStart + (isLast ? 0.35 : 0.1));

    if (isLast) {
      osc.onended = () => {
        oscs.forEach(o => { try { o.disconnect(); } catch {} });
        opts.onEnd?.();
      };
    }
  });

  return { stop: () => oscs.forEach(o => { try { o.stop(); } catch {} }) };
};

const retroHeroMilestone: SoundSynthesizer = (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.5;
  const oscs: OscillatorNode[] = [];

  // A minor chord stab
  [NOTES.A3, NOTES.C4, NOTES.E4].forEach((freq) => {
    [-5, 5].forEach((cents) => {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = freq * 0.85;
      osc.detune.value = cents;

      const g = ctx.createGain();
      g.gain.setValueAtTime(vol * 0.35, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      osc.connect(g);
      g.connect(ctx.destination);
      oscs.push(osc);

      osc.start(t);
      osc.stop(t + 0.4);
    });
  });

  // A octave resolution
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.value = NOTES.A4 * 0.85;
  osc.detune.value = 5;

  const g = ctx.createGain();
  g.gain.setValueAtTime(vol * 0.55, t + 0.25);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

  osc.connect(g);
  g.connect(ctx.destination);
  oscs.push(osc);

  osc.start(t + 0.25);
  osc.stop(t + 0.6);

  osc.onended = () => {
    oscs.forEach(o => { try { o.disconnect(); } catch {} });
    opts.onEnd?.();
  };

  return { stop: () => oscs.forEach(o => { try { o.stop(); } catch {} }) };
};

export const retroPack: GeneratedSoundPack = {
  ...generateSoundPack(RETRO_INSTRUMENT),
  "hero.complete": retroHeroComplete,
  "hero.milestone": retroHeroMilestone,
};

// ---------------------------------------------------------------------------
// Crisp Pack - Sharp, articulated rapid arpeggios
// ---------------------------------------------------------------------------

const crispHeroComplete: SoundSynthesizer = (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.6;
  // Pentatonic scale run with crisp attack
  const notes = [NOTES.C5, NOTES.D5, NOTES.E5, NOTES.G5, NOTES.A5, NOTES.C6];
  const oscs: OscillatorNode[] = [];

  notes.forEach((freq, i) => {
    const noteStart = t + i * 0.08;
    const isLast = i === notes.length - 1;
    const dur = isLast ? 0.35 : 0.06;

    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = freq * 1.1;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, noteStart);
    g.gain.linearRampToValueAtTime(vol, noteStart + 0.003);
    g.gain.exponentialRampToValueAtTime(0.001, noteStart + dur);

    osc.connect(g);
    g.connect(ctx.destination);
    oscs.push(osc);

    osc.start(noteStart);
    osc.stop(noteStart + dur + 0.02);

    if (isLast) {
      osc.onended = () => {
        oscs.forEach(o => { try { o.disconnect(); } catch {} });
        opts.onEnd?.();
      };
    }
  });

  return { stop: () => oscs.forEach(o => { try { o.stop(); } catch {} }) };
};

const crispHeroMilestone: SoundSynthesizer = (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.55;
  // Pentatonic skip pattern
  const notes = [NOTES.C5, NOTES.D5, NOTES.G5, NOTES.C6];
  const oscs: OscillatorNode[] = [];

  notes.forEach((freq, i) => {
    const noteStart = t + i * 0.07;
    const isLast = i === notes.length - 1;
    const dur = isLast ? 0.25 : 0.05;

    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = freq * 1.1;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, noteStart);
    g.gain.linearRampToValueAtTime(vol, noteStart + 0.002);
    g.gain.exponentialRampToValueAtTime(0.001, noteStart + dur);

    osc.connect(g);
    g.connect(ctx.destination);
    oscs.push(osc);

    osc.start(noteStart);
    osc.stop(noteStart + dur + 0.02);

    if (isLast) {
      osc.onended = () => {
        oscs.forEach(o => { try { o.disconnect(); } catch {} });
        opts.onEnd?.();
      };
    }
  });

  return { stop: () => oscs.forEach(o => { try { o.stop(); } catch {} }) };
};

export const crispPack: GeneratedSoundPack = {
  ...generateSoundPack(CRISP_INSTRUMENT),
  "hero.complete": crispHeroComplete,
  "hero.milestone": crispHeroMilestone,
};

// ---------------------------------------------------------------------------
// All Sound Packs
// ---------------------------------------------------------------------------

export const soundPacks = {
  soft: softPack,
  aero: aeroPack,
  arcade: arcadePack,
  organic: organicPack,
  glass: glassPack,
  industrial: industrialPack,
  minimal: minimalPack,
  retro: retroPack,
  crisp: crispPack,
} as const;

export type SoundPackName = keyof typeof soundPacks;
