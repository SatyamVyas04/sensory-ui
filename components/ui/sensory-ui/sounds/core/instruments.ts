/**
 * Instrument definitions for sensory-ui.
 *
 * An "instrument" defines HOW a sound is synthesized - the oscillator type,
 * filter characteristics, envelope shape, and timbral qualities.
 *
 * The same tune (musical content) can be played by different instruments
 * to create distinct soundpack characters.
 *
 * Based on the FeelParams system from userinterface.wiki
 */

// ---------------------------------------------------------------------------
// Instrument Types
// ---------------------------------------------------------------------------

export type OscillatorWaveform = "sine" | "square" | "sawtooth" | "triangle";

/**
 * Simplified instrument config based on FeelParams.
 * These 6 parameters are sufficient to create distinctly different sounds.
 */
export interface InstrumentConfig {
  /** Filter cutoff frequency in Hz */
  filterFreq: number;
  /** Filter Q (resonance) value */
  q: number;
  /** Primary oscillator waveform */
  oscType: OscillatorWaveform;
  /** Decay time multiplier (affects how long sounds ring) */
  decayMult: number;
  /** Gain/volume multiplier */
  gainMult: number;
  /** Pitch multiplier (affects base frequency) */
  pitchMult: number;
}

// ---------------------------------------------------------------------------
// Preset Instruments - 9 distinct feels
// ---------------------------------------------------------------------------

/** Soft: Warm, rounded, gentle - like felt mallets on soft pads */
export const SOFT_INSTRUMENT: InstrumentConfig = {
  filterFreq: 2000,
  q: 1,
  oscType: "sine",
  decayMult: 1.5,
  gainMult: 0.7,
  pitchMult: 0.8,
};

/** Aero: Airy, breathy, ethereal - like wind through chimes */
export const AERO_INSTRUMENT: InstrumentConfig = {
  filterFreq: 3500,
  q: 2,
  oscType: "sine",
  decayMult: 1.0,
  gainMult: 0.9,
  pitchMult: 1.0,
};

/** Arcade: 8-bit chiptune - square waves, stepped pitch, punchy */
export const ARCADE_INSTRUMENT: InstrumentConfig = {
  filterFreq: 4000,
  q: 8,
  oscType: "square",
  decayMult: 0.5,
  gainMult: 1.0,
  pitchMult: 1.5,
};

/** Organic: Natural, warm, wooden - like marimba or wood blocks */
export const ORGANIC_INSTRUMENT: InstrumentConfig = {
  filterFreq: 2500,
  q: 3,
  oscType: "triangle",
  decayMult: 1.3,
  gainMult: 0.85,
  pitchMult: 0.9,
};

/** Glass: Crystalline, bright, resonant - like struck glass or bells */
export const GLASS_INSTRUMENT: InstrumentConfig = {
  filterFreq: 6000,
  q: 10,
  oscType: "sine",
  decayMult: 1.2,
  gainMult: 0.75,
  pitchMult: 1.8,
};

/** Industrial: Metallic, harsh, mechanical - like machines and metal */
export const INDUSTRIAL_INSTRUMENT: InstrumentConfig = {
  filterFreq: 3000,
  q: 12,
  oscType: "sawtooth",
  decayMult: 0.6,
  gainMult: 1.2,
  pitchMult: 0.7,
};

/** Minimal: Clean, sparse, understated - pure tones, no embellishment */
export const MINIMAL_INSTRUMENT: InstrumentConfig = {
  filterFreq: 2000,
  q: 1,
  oscType: "sine",
  decayMult: 0.8,
  gainMult: 0.4,
  pitchMult: 1.0,
};

/** Retro: Analog synth, warm square waves - like vintage synthesizers */
export const RETRO_INSTRUMENT: InstrumentConfig = {
  filterFreq: 1500,
  q: 2,
  oscType: "square",
  decayMult: 1.1,
  gainMult: 0.8,
  pitchMult: 0.85,
};

/** Crisp: Sharp, defined, precise - like high-quality headphones */
export const CRISP_INSTRUMENT: InstrumentConfig = {
  filterFreq: 5500,
  q: 4,
  oscType: "triangle",
  decayMult: 0.6,
  gainMult: 1.0,
  pitchMult: 1.1,
};

// ---------------------------------------------------------------------------
// Instrument Presets Map
// ---------------------------------------------------------------------------

export const INSTRUMENTS = {
  soft: SOFT_INSTRUMENT,
  aero: AERO_INSTRUMENT,
  arcade: ARCADE_INSTRUMENT,
  organic: ORGANIC_INSTRUMENT,
  glass: GLASS_INSTRUMENT,
  industrial: INDUSTRIAL_INSTRUMENT,
  minimal: MINIMAL_INSTRUMENT,
  retro: RETRO_INSTRUMENT,
  crisp: CRISP_INSTRUMENT,
} as const;

export type InstrumentName = keyof typeof INSTRUMENTS;

// ---------------------------------------------------------------------------
// Synthesis Helpers
// ---------------------------------------------------------------------------

/**
 * Create white/pink/brown noise buffer
 */
export function createNoiseBuffer(
  ctx: AudioContext,
  duration: number,
  type: "white" | "pink" | "brown" = "white"
): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  if (type === "white") {
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  } else if (type === "pink") {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
  } else {
    let lastOut = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + (0.02 * white)) / 1.02;
      data[i] = lastOut * 3.5;
    }
  }

  return buffer;
}

/**
 * Apply exponential decay to a noise buffer
 */
export function applyDecayToBuffer(
  buffer: AudioBuffer,
  decayRate: number = 0.3
): void {
  const data = buffer.getChannelData(0);
  const length = data.length;
  for (let i = 0; i < length; i++) {
    data[i] *= Math.exp(-i / (length * decayRate));
  }
}

/**
 * Create oscillator with instrument settings
 */
export function createOscillator(
  ctx: AudioContext,
  freq: number,
  instrument: InstrumentConfig
): OscillatorNode {
  const osc = ctx.createOscillator();
  osc.type = instrument.oscType;
  osc.frequency.value = freq * instrument.pitchMult;
  return osc;
}

/**
 * Create gain with envelope
 */
export function createEnvelopedGain(
  ctx: AudioContext,
  time: number,
  volume: number,
  duration: number,
  instrument: InstrumentConfig
): GainNode {
  const gain = ctx.createGain();
  const attackTime = 0.005;
  const decayTime = duration * instrument.decayMult;

  gain.gain.setValueAtTime(0.001, time);
  gain.gain.linearRampToValueAtTime(volume * instrument.gainMult, time + attackTime);
  gain.gain.exponentialRampToValueAtTime(0.001, time + attackTime + decayTime);

  return gain;
}

/**
 * Create filter for noise-based sounds
 */
export function createFilter(
  ctx: AudioContext,
  freq: number,
  q: number,
  type: BiquadFilterType = "bandpass"
): BiquadFilterNode {
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  filter.Q.value = q;
  return filter;
}
