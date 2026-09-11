/**
 * Generated Sound Packs
 *
 * 9 distinct sound packs generated using the instrument-based system.
 * Each pack uses a different instrument configuration to create
 * unique sonic characters from the same base tunes.
 *
 * Hero sounds are custom-crafted for each pack to match their character.
 * Packs that benefit from spatial/timbral processing include effects chains
 * (reverb, delay, chorus, distortion) inspired by @web-kits/audio.
 */

import type { SoundRole } from "../config/sound-roles";
import type { SoundSynthesizer, PlaySoundOptions, SoundPlayback } from "../config/engine";
import type { InstrumentConfig } from "./core/instruments";
import type { BaseTune } from "./core/tunes";
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
import { generateCustomSoundPack } from "./core/pack-generator";
import { buildEffectsChain } from "./core/effects";
import type { EffectDefinition } from "./core/effects";

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
// Helper — apply effects chain to a hero synthesizer's output
// ---------------------------------------------------------------------------

/**
 * Create a hero synthesizer that routes through an effects chain.
 * The inner function draws to a GainNode; the outer wrapper chains effects.
 */
function heroWithEffects(
  inner: (ctx: AudioContext, opts: PlaySoundOptions, dest: AudioNode) => SoundPlayback,
  effects: EffectDefinition[]
): SoundSynthesizer {
  return (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
    const chain = buildEffectsChain(ctx, effects);
    chain.output.connect(ctx.destination);

    const playback = inner(ctx, opts, chain.input);

    const origStop = playback.stop;
    return {
      stop: () => {
        origStop();
        try { chain.input.disconnect(); } catch { /* ok */ }
        try { chain.output.disconnect(); } catch { /* ok */ }
      },
    };
  };
}

// ---------------------------------------------------------------------------
// Soft Pack — Warm, gentle hero sounds with warm reverb
// ---------------------------------------------------------------------------

const softEffects: EffectDefinition[] = [
  { type: "reverb", options: { duration: 0.8, decay: 2.5, mix: 0.2 } },
];

const softHeroComplete: SoundSynthesizer = heroWithEffects((ctx, opts, dest) => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.45;
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

    // FM modulator for warmth
    const fmMod = ctx.createOscillator();
    fmMod.type = "sine";
    fmMod.frequency.value = freq * 0.8 * 0.5;
    const fmGain = ctx.createGain();
    fmGain.gain.value = 60;
    fmMod.connect(fmGain);
    fmGain.connect(osc.frequency);
    fmMod.start(noteStart);
    fmMod.stop(decay + 0.05);
    oscs.push(fmMod);
    gains.push(fmGain);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, noteStart);
    g.gain.linearRampToValueAtTime(vol, noteStart + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, decay);

    osc.connect(g);
    g.connect(dest);
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
}, softEffects);

const softHeroMilestone: SoundSynthesizer = heroWithEffects((ctx, opts, dest) => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.40;
  const notes = [NOTES.E4, NOTES.C4];
  const oscs: OscillatorNode[] = [];
  const gains: GainNode[] = [];

  notes.forEach((freq, i) => {
    const noteStart = t + i * 0.25;
    const isLast = i === notes.length - 1;
    const decay = noteStart + (isLast ? 0.6 : 0.2);

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq * 0.8;

    // FM modulator
    const fmMod = ctx.createOscillator();
    fmMod.type = "sine";
    fmMod.frequency.value = freq * 0.8 * 0.5;
    const fmGain = ctx.createGain();
    fmGain.gain.value = 50;
    fmMod.connect(fmGain);
    fmGain.connect(osc.frequency);
    fmMod.start(noteStart);
    fmMod.stop(decay + 0.05);
    oscs.push(fmMod);
    gains.push(fmGain);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, noteStart);
    g.gain.linearRampToValueAtTime(vol, noteStart + 0.04);
    g.gain.exponentialRampToValueAtTime(0.001, decay);

    osc.connect(g);
    g.connect(dest);
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
}, softEffects);

export const softPack: GeneratedSoundPack = {
  ...generateCustomSoundPack(
    { ...SOFT_INSTRUMENT, effects: softEffects },
    {},
    { "notification.error": { frequency: 200, endFrequency: 80, filterFreq: 600, filterQ: 1, duration: 0.25, meta: { endFilterFreq: 200, tonalGain: 0.5 } } }
  ),
  "hero.complete": softHeroComplete,
  "hero.milestone": softHeroMilestone,
};

// ---------------------------------------------------------------------------
// Aero Pack — Ethereal, breathy hero sounds with shimmer + long reverb
// ---------------------------------------------------------------------------

const aeroEffects: EffectDefinition[] = [
  { type: "reverb", options: { duration: 2.0, decay: 1.8, mix: 0.3 } },
];

const aeroHeroComplete: SoundSynthesizer = heroWithEffects((ctx, opts, dest) => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.45;
  const notes = [NOTES.D4, NOTES.G4, NOTES.A4, NOTES.D5, NOTES.G5];
  const oscs: OscillatorNode[] = [];

  notes.forEach((freq, i) => {
    const noteStart = t + i * 0.18;
    const isLast = i === notes.length - 1;
    const decay = noteStart + 0.15 + (isLast ? 0.5 : 0.08);

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;

    // FM modulator for bell-like richness
    const fmMod = ctx.createOscillator();
    fmMod.type = "sine";
    fmMod.frequency.value = freq * 0.5;
    const fmGain = ctx.createGain();
    fmGain.gain.value = 80;
    fmMod.connect(fmGain);
    fmGain.connect(osc.frequency);
    fmMod.start(noteStart);
    fmMod.stop(decay + 0.05);
    oscs.push(fmMod);

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

    osc.connect(g); g.connect(dest);
    osc2.connect(g2); g2.connect(dest);
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
}, aeroEffects);

const aeroHeroMilestone: SoundSynthesizer = heroWithEffects((ctx, opts, dest) => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.40;
  const notes = [NOTES.D4, NOTES.A4, NOTES.D5];
  const oscs: OscillatorNode[] = [];

  notes.forEach((freq, i) => {
    const noteStart = t + i * 0.15;
    const isLast = i === notes.length - 1;
    const decay = noteStart + 0.12 + (isLast ? 0.35 : 0.06);

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;

    // FM modulator
    const fmMod = ctx.createOscillator();
    fmMod.type = "sine";
    fmMod.frequency.value = freq * 0.5;
    const fmGain = ctx.createGain();
    fmGain.gain.value = 70;
    fmMod.connect(fmGain);
    fmGain.connect(osc.frequency);
    fmMod.start(noteStart);
    fmMod.stop(decay + 0.05);
    oscs.push(fmMod);

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

    osc.connect(g); g.connect(dest);
    osc2.connect(g2); g2.connect(dest);
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
}, aeroEffects);

export const aeroPack: GeneratedSoundPack = {
  ...generateCustomSoundPack(
    { ...AERO_INSTRUMENT, effects: aeroEffects },
    {},
    { "notification.error": { frequency: 350, endFrequency: 120, filterFreq: 1000, filterQ: 1.2, duration: 0.3, meta: { endFilterFreq: 300, tonalGain: 0.4 } } }
  ),
  "hero.complete": aeroHeroComplete,
  "hero.milestone": aeroHeroMilestone,
};

// ---------------------------------------------------------------------------
// Arcade Pack — 8-bit chiptune fanfares (dry, authentic)
// ---------------------------------------------------------------------------

const arcadeHeroComplete: SoundSynthesizer = (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.45;
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
  const vol = (opts.volume ?? 1) * 0.40;
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

export const arcadePack: GeneratedSoundPack = {
  ...generateCustomSoundPack(
    ARCADE_INSTRUMENT,
    {},
    { "notification.error": { frequency: 400, endFrequency: 80, filterFreq: 2000, filterQ: 4, duration: 0.15, meta: { endFilterFreq: 600, tonalGain: 0.6 } } }
  ),
  "hero.complete": arcadeHeroComplete,
  "hero.milestone": arcadeHeroMilestone,
};

// ---------------------------------------------------------------------------
// Organic Pack — Marimba-like wooden tones with short room reverb
// ---------------------------------------------------------------------------

const organicEffects: EffectDefinition[] = [
  { type: "reverb", options: { duration: 0.4, decay: 3.0, mix: 0.15 } },
];

const organicHeroComplete: SoundSynthesizer = heroWithEffects((ctx, opts, dest) => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.45;
  const notes = [NOTES.C4, NOTES.G4, NOTES.E4, NOTES.A4, NOTES.C5];
  const oscs: OscillatorNode[] = [];

  notes.forEach((freq, i) => {
    const noteStart = t + i * 0.14;
    const isLast = i === notes.length - 1;
    const decay = noteStart + 0.15 + (isLast ? 0.45 : 0.1);

    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = freq * 0.9;

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

    osc.connect(g); g.connect(dest);
    osc2.connect(g2); g2.connect(dest);
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
}, organicEffects);

const organicHeroMilestone: SoundSynthesizer = heroWithEffects((ctx, opts, dest) => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.40;
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
    g.connect(dest);
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
}, organicEffects);

export const organicPack: GeneratedSoundPack = {
  ...generateCustomSoundPack(
    { ...ORGANIC_INSTRUMENT, effects: organicEffects },
    {},
    { "notification.error": { frequency: 250, endFrequency: 100, filterFreq: 800, filterQ: 2, duration: 0.22, meta: { endFilterFreq: 250, tonalGain: 0.45 } } }
  ),
  "hero.complete": organicHeroComplete,
  "hero.milestone": organicHeroMilestone,
};

// ---------------------------------------------------------------------------
// Glass Pack — Crystalline bell-like tones with reverb + chorus shimmer
// ---------------------------------------------------------------------------

const glassEffects: EffectDefinition[] = [
  { type: "reverb", options: { duration: 1.5, decay: 2.0, mix: 0.25 } },
  { type: "chorus", options: { rate: 1.2, depth: 1.5, detune: 12, mix: 0.2 } },
];

const glassHeroComplete: SoundSynthesizer = heroWithEffects((ctx, opts, dest) => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.40;
  const notes = [NOTES.E5, NOTES.G5, NOTES.B5, NOTES.C6, NOTES.E6];
  const oscs: OscillatorNode[] = [];

  notes.forEach((freq, i) => {
    const noteStart = t + i * 0.18;
    const isLast = i === notes.length - 1;
    const ringTime = isLast ? 1.2 : 0.4;

    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.value = freq;

    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = freq * 2;

    const osc3 = ctx.createOscillator();
    osc3.type = "sine";
    osc3.frequency.value = freq * 2.4;

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

    osc1.connect(g1); g1.connect(dest);
    osc2.connect(g2); g2.connect(dest);
    osc3.connect(g3); g3.connect(dest);
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
}, glassEffects);

const glassHeroMilestone: SoundSynthesizer = heroWithEffects((ctx, opts, dest) => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.35;
  const notes = [NOTES.G4, NOTES.B4, NOTES.E5];
  const oscs: OscillatorNode[] = [];

  notes.forEach((freq, i) => {
    const noteStart = t + i * 0.15;
    const isLast = i === notes.length - 1;
    const ringTime = isLast ? 0.8 : 0.35;

    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.value = freq;

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

    osc1.connect(g1); g1.connect(dest);
    osc2.connect(g2); g2.connect(dest);
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
}, glassEffects);

export const glassPack: GeneratedSoundPack = {
  ...generateCustomSoundPack(
    { ...GLASS_INSTRUMENT, effects: glassEffects },
    {},
    { "notification.error": { frequency: 600, endFrequency: 200, filterFreq: 2500, filterQ: 6, duration: 0.28, meta: { endFilterFreq: 500, tonalGain: 0.3 } } }
  ),
  "hero.complete": glassHeroComplete,
  "hero.milestone": glassHeroMilestone,
};

// ---------------------------------------------------------------------------
// Industrial Pack — Metallic, powerful stabs with distortion
// ---------------------------------------------------------------------------

const industrialEffects: EffectDefinition[] = [
  { type: "distortion", options: { amount: 0.35, filterFreq: 2500, mix: 0.4 } },
];

const industrialHeroComplete: SoundSynthesizer = heroWithEffects((ctx, opts, dest) => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.45;
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
    g.connect(dest);
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
    g.connect(dest);
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
}, industrialEffects);

const industrialHeroMilestone: SoundSynthesizer = heroWithEffects((ctx, opts, dest) => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.40;
  const oscs: OscillatorNode[] = [];

  // E power fifth hit
  [NOTES.E3, NOTES.B3].forEach((freq) => {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = freq * 0.7;

    const g = ctx.createGain();
    g.gain.setValueAtTime(vol * 0.5, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    osc.connect(g);
    g.connect(dest);
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
  g.connect(dest);
  oscs.push(osc);

  osc.start(t + 0.25);
  osc.stop(t + 0.6);

  osc.onended = () => {
    oscs.forEach(o => { try { o.disconnect(); } catch {} });
    opts.onEnd?.();
  };

  return { stop: () => oscs.forEach(o => { try { o.stop(); } catch {} }) };
}, industrialEffects);

export const industrialPack: GeneratedSoundPack = {
  ...generateCustomSoundPack(
    { ...INDUSTRIAL_INSTRUMENT, effects: industrialEffects },
    {},
    { "notification.error": { frequency: 180, endFrequency: 60, filterFreq: 1500, filterQ: 8, duration: 0.18, meta: { endFilterFreq: 350, tonalGain: 0.5 } } }
  ),
  "hero.complete": industrialHeroComplete,
  "hero.milestone": industrialHeroMilestone,
};

// ---------------------------------------------------------------------------
// Minimal Pack — Clean, understated resolution (dry)
// ---------------------------------------------------------------------------

const minimalHeroComplete: SoundSynthesizer = (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.35;
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
  const vol = (opts.volume ?? 1) * 0.30;
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
  ...generateCustomSoundPack(
    MINIMAL_INSTRUMENT,
    {},
    { "notification.error": { frequency: 440, endFrequency: 220, filterFreq: 1000, filterQ: 1, duration: 0.2, meta: { endFilterFreq: 400, tonalGain: 0.2 } } }
  ),
  "hero.complete": minimalHeroComplete,
  "hero.milestone": minimalHeroMilestone,
};

// ---------------------------------------------------------------------------
// Retro Pack — Synthwave chord stabs with chorus + delay
// ---------------------------------------------------------------------------

const retroEffects: EffectDefinition[] = [
  { type: "chorus", options: { rate: 1.8, depth: 2.5, detune: 18, mix: 0.25 } },
  { type: "delay", options: { time: 0.15, feedback: 0.2, filterFreq: 2500, mix: 0.2 } },
];

const retroHeroComplete: SoundSynthesizer = heroWithEffects((ctx, opts, dest) => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.45;
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
      g.connect(dest);
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
    g.connect(dest);
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
}, retroEffects);

const retroHeroMilestone: SoundSynthesizer = heroWithEffects((ctx, opts, dest) => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.40;
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
      g.connect(dest);
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
  g.connect(dest);
  oscs.push(osc);

  osc.start(t + 0.25);
  osc.stop(t + 0.6);

  osc.onended = () => {
    oscs.forEach(o => { try { o.disconnect(); } catch {} });
    opts.onEnd?.();
  };

  return { stop: () => oscs.forEach(o => { try { o.stop(); } catch {} }) };
}, retroEffects);

export const retroPack: GeneratedSoundPack = {
  ...generateCustomSoundPack(
    { ...RETRO_INSTRUMENT, effects: retroEffects },
    {},
    { "notification.error": { frequency: 300, endFrequency: 100, filterFreq: 800, filterQ: 3, duration: 0.25, meta: { endFilterFreq: 300, tonalGain: 0.45 } } }
  ),
  "hero.complete": retroHeroComplete,
  "hero.milestone": retroHeroMilestone,
};

// ---------------------------------------------------------------------------
// Crisp Pack — Sharp, articulated rapid arpeggios (dry)
// ---------------------------------------------------------------------------

const crispHeroComplete: SoundSynthesizer = (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
  const t = ctx.currentTime;
  const vol = (opts.volume ?? 1) * 0.45;
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
  const vol = (opts.volume ?? 1) * 0.40;
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
  ...generateCustomSoundPack(
    CRISP_INSTRUMENT,
    {},
    { "notification.error": { frequency: 500, endFrequency: 150, filterFreq: 2000, filterQ: 3, duration: 0.18, meta: { endFilterFreq: 500, tonalGain: 0.35 } } }
  ),
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
