/**
 * Sound Factory - Combines tunes with instruments to produce synthesizers.
 *
 * This is the core of the soundpack system. It takes a tune (musical definition)
 * and an instrument (synthesis parameters) and produces a SoundSynthesizer.
 *
 * Based on the FeelParams system from userinterface.wiki
 */

import type { SoundSynthesizer, PlaySoundOptions, SoundPlayback } from "../../config/engine";
import type { BaseTune } from "./tunes";
import type { InstrumentConfig } from "./instruments";
import { createNoiseBuffer, applyDecayToBuffer } from "./instruments";

// ---------------------------------------------------------------------------
// Factory Functions for Each Tune Type
// ---------------------------------------------------------------------------

/**
 * Create a click sound (short percussive transient)
 */
function createClickSound(
  tune: BaseTune,
  instrument: InstrumentConfig
): SoundSynthesizer {
  return (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * (tune.volume ?? 1) * instrument.gainMult;
    const duration = tune.duration * instrument.decayMult;

    // Use noise for clicks - filtered noise transient
    const bufLen = Math.floor(ctx.sampleRate * Math.max(0.008, duration * 0.5));
    const buffer = createNoiseBuffer(ctx, bufLen / ctx.sampleRate, "white");
    applyDecayToBuffer(buffer, 0.3);

    const src = ctx.createBufferSource();
    src.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = (tune.filterFreq ?? 3500) * instrument.pitchMult;
    filter.Q.value = (tune.filterQ ?? 2) * instrument.q;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    src.onended = () => {
      src.disconnect();
      filter.disconnect();
      gain.disconnect();
      opts.onEnd?.();
    };

    src.start(t);

    return {
      stop: () => { try { src.stop(); } catch { /* ok */ } }
    };
  };
}

/**
 * Create a pop sound (brief tonal burst with pitch bend)
 */
function createPopSound(
  tune: BaseTune,
  instrument: InstrumentConfig
): SoundSynthesizer {
  return (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * (tune.volume ?? 1) * instrument.gainMult;
    const duration = tune.duration * instrument.decayMult;
    const freq = (tune.frequency ?? 800) * instrument.pitchMult;
    const endFreq = (tune.endFrequency ?? freq * 1.2);

    const osc = ctx.createOscillator();
    osc.type = instrument.oscType;
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + duration * 0.3);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
      opts.onEnd?.();
    };

    osc.start(t);
    osc.stop(t + duration + 0.02);

    return {
      stop: () => { try { osc.stop(); } catch { /* ok */ } }
    };
  };
}

/**
 * Create a toggle sound (state change - click + tonal tail)
 */
function createToggleSound(
  tune: BaseTune,
  instrument: InstrumentConfig
): SoundSynthesizer {
  return (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * (tune.volume ?? 1) * instrument.gainMult;
    const duration = tune.duration * instrument.decayMult;

    const nodes: AudioNode[] = [];
    const sources: AudioScheduledSourceNode[] = [];

    // Noise click transient
    const bufLen = Math.floor(ctx.sampleRate * 0.006);
    const buffer = createNoiseBuffer(ctx, bufLen / ctx.sampleRate, "white");
    applyDecayToBuffer(buffer, 0.28);

    const src = ctx.createBufferSource();
    src.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = (tune.filterFreq ?? instrument.filterFreq);
    filter.Q.value = (tune.filterQ ?? instrument.q) * 2;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(vol, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.022);

    src.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    nodes.push(filter, noiseGain);
    sources.push(src);
    src.start(t);

    // Tonal tail
    if (tune.frequency) {
      const osc = ctx.createOscillator();
      osc.type = instrument.oscType;
      osc.frequency.setValueAtTime(tune.frequency * instrument.pitchMult, t);
      if (tune.endFrequency) {
        osc.frequency.exponentialRampToValueAtTime(
          tune.endFrequency * instrument.pitchMult,
          t + duration
        );
      }

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(vol * 0.5, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      nodes.push(oscGain);
      sources.push(osc);

      osc.start(t);
      osc.stop(t + duration + 0.01);
    }

    const cleanup = () => {
      sources.forEach(s => { try { s.disconnect(); } catch { /* ok */ } });
      nodes.forEach(n => { try { n.disconnect(); } catch { /* ok */ } });
      opts.onEnd?.();
    };

    if (sources.length > 1) {
      (sources[1] as OscillatorNode).onended = cleanup;
    } else {
      src.onended = cleanup;
    }

    return {
      stop: () => {
        sources.forEach(s => { try { s.stop(); } catch { /* ok */ } });
      }
    };
  };
}

/**
 * Create a tick sound (subtle micro-interaction).
 * Uses filtered noise when `tune.filterFreq` is set (e.g., scroll/focus),
 * otherwise falls back to a pure tone oscillator.
 */
function createTickSound(
  tune: BaseTune,
  instrument: InstrumentConfig
): SoundSynthesizer {
  return (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * (tune.volume ?? 1) * instrument.gainMult;
    const duration = tune.duration * instrument.decayMult;

    // Filtered-noise tick - used for scroll/focus where filterFreq is defined
    if (tune.filterFreq) {
      const bufLen = Math.floor(ctx.sampleRate * Math.max(0.004, duration * 0.5));
      const buffer = createNoiseBuffer(ctx, bufLen / ctx.sampleRate, "white");
      applyDecayToBuffer(buffer, 0.25);

      const src = ctx.createBufferSource();
      src.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = tune.filterFreq * instrument.pitchMult;
      filter.Q.value = (tune.filterQ ?? 2) * instrument.q;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      src.onended = () => {
        src.disconnect();
        filter.disconnect();
        gain.disconnect();
        opts.onEnd?.();
      };

      src.start(t);
      return { stop: () => { try { src.stop(); } catch { /* ok */ } } };
    }

    // Pure tone tick - used when only frequency is defined (e.g., system.focus)
    const osc = ctx.createOscillator();
    osc.type = instrument.oscType;
    osc.frequency.value = (tune.frequency ?? 750) * instrument.pitchMult;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
      opts.onEnd?.();
    };

    osc.start(t);
    osc.stop(t + duration + 0.01);

    return {
      stop: () => { try { osc.stop(); } catch { /* ok */ } }
    };
  };
}

/**
 * Create a sweep sound (frequency glide)
 */
function createSweepSound(
  tune: BaseTune,
  instrument: InstrumentConfig
): SoundSynthesizer {
  return (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * (tune.volume ?? 1) * instrument.gainMult;
    const duration = tune.duration * instrument.decayMult;
    const startFreq = (tune.frequency ?? 300) * instrument.pitchMult;
    const endFreq = (tune.endFrequency ?? 500) * instrument.pitchMult;

    const osc = ctx.createOscillator();
    osc.type = instrument.oscType;
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
      opts.onEnd?.();
    };

    osc.start(t);
    osc.stop(t + duration + 0.05);

    return {
      stop: () => { try { osc.stop(); } catch { /* ok */ } }
    };
  };
}

/**
 * Create a rise sound (pitch ascends) - alias for sweep
 */
function createRiseSound(
  tune: BaseTune,
  instrument: InstrumentConfig
): SoundSynthesizer {
  return createSweepSound(tune, instrument);
}

/**
 * Create a drop sound (pitch descends) - alias for sweep
 */
function createDropSound(
  tune: BaseTune,
  instrument: InstrumentConfig
): SoundSynthesizer {
  return createSweepSound(tune, instrument);
}

/**
 * Create a chime sound (resonant tonal with decay)
 */
function createChimeSound(
  tune: BaseTune,
  instrument: InstrumentConfig
): SoundSynthesizer {
  return (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * (tune.volume ?? 1) * instrument.gainMult;
    const duration = tune.duration * instrument.decayMult;
    const freq = (tune.frequency ?? 520) * instrument.pitchMult;

    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    // Main tone
    const osc = ctx.createOscillator();
    osc.type = instrument.oscType;
    osc.frequency.setValueAtTime(freq, t);
    if (tune.endFrequency) {
      osc.frequency.exponentialRampToValueAtTime(
        tune.endFrequency * instrument.pitchMult,
        t + duration * 0.5
      );
    }

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    oscillators.push(osc);
    gains.push(gain);

    // Harmonic overtone for richness
    if (tune.harmonics) {
      const harmonic = ctx.createOscillator();
      harmonic.type = "sine";
      harmonic.frequency.value = freq * (tune.harmonicRatio ?? 2);

      const harmonicGain = ctx.createGain();
      const harmonicVol = vol * (tune.harmonicVolume ?? 0.2);
      harmonicGain.gain.setValueAtTime(0.001, t);
      harmonicGain.gain.linearRampToValueAtTime(harmonicVol, t + 0.01);
      harmonicGain.gain.exponentialRampToValueAtTime(0.001, t + duration * 0.8);

      harmonic.connect(harmonicGain);
      harmonicGain.connect(ctx.destination);
      oscillators.push(harmonic);
      gains.push(harmonicGain);
    }

    const cleanup = () => {
      oscillators.forEach(o => { try { o.disconnect(); } catch { /* ok */ } });
      gains.forEach(g => { try { g.disconnect(); } catch { /* ok */ } });
      opts.onEnd?.();
    };

    osc.onended = cleanup;

    oscillators.forEach(o => {
      o.start(t);
      o.stop(t + duration + 0.05);
    });

    return {
      stop: () => {
        oscillators.forEach(o => { try { o.stop(); } catch { /* ok */ } });
      }
    };
  };
}

/**
 * Create an arpeggio sound (sequence of notes)
 */
function createArpeggioSound(
  tune: BaseTune,
  instrument: InstrumentConfig
): SoundSynthesizer {
  return (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * (tune.volume ?? 1) * instrument.gainMult;
    const notes = tune.notes ?? [261.63, 329.63, 392.0];
    const noteDur = (tune.noteDuration ?? 0.15) * instrument.decayMult;
    const gap = tune.noteGap ?? 0.12;
    const meta = tune.meta as { finalRing?: number } | undefined;
    const finalRing = meta?.finalRing ?? 0.4;

    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    notes.forEach((noteFreq, i) => {
      const freq = noteFreq * instrument.pitchMult;
      const noteStart = t + i * gap;
      const isLast = i === notes.length - 1;
      const ringDur = isLast ? finalRing : 0.06;
      const decay = noteStart + noteDur + ringDur;

      const osc = ctx.createOscillator();
      osc.type = instrument.oscType;
      osc.frequency.value = freq;

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.001, noteStart);
      g.gain.linearRampToValueAtTime(vol, noteStart + 0.012);
      g.gain.exponentialRampToValueAtTime(0.001, decay);

      osc.connect(g);
      g.connect(ctx.destination);

      oscillators.push(osc);
      gains.push(g);

      osc.start(noteStart);
      osc.stop(decay + 0.05);

      if (isLast) {
        osc.onended = () => {
          oscillators.forEach(o => { try { o.disconnect(); } catch { /* ok */ } });
          gains.forEach(g => { try { g.disconnect(); } catch { /* ok */ } });
          opts.onEnd?.();
        };
      }
    });

    return {
      stop: () => {
        oscillators.forEach(o => { try { o.stop(); } catch { /* ok */ } });
      }
    };
  };
}

/**
 * Create a chord sound (multiple simultaneous notes)
 */
function createChordSound(
  tune: BaseTune,
  instrument: InstrumentConfig
): SoundSynthesizer {
  return (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * (tune.volume ?? 1) * instrument.gainMult;
    const duration = tune.duration * instrument.decayMult;
    const notes = tune.notes ?? [261.63, 329.63, 392.0];

    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    const noteVol = vol / Math.sqrt(notes.length);

    notes.forEach((noteFreq) => {
      const freq = noteFreq * instrument.pitchMult;
      const osc = ctx.createOscillator();
      osc.type = instrument.oscType;
      osc.frequency.value = freq;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(noteVol, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      oscillators.push(osc);
      gains.push(gain);
    });

    const cleanup = () => {
      oscillators.forEach(o => { try { o.disconnect(); } catch { /* ok */ } });
      gains.forEach(g => { try { g.disconnect(); } catch { /* ok */ } });
      opts.onEnd?.();
    };

    oscillators[0].onended = cleanup;

    oscillators.forEach(o => {
      o.start(t);
      o.stop(t + duration + 0.05);
    });

    return {
      stop: () => {
        oscillators.forEach(o => { try { o.stop(); } catch { /* ok */ } });
      }
    };
  };
}

/**
 * Create a burst sound (noise texture)
 */
function createBurstSound(
  tune: BaseTune,
  instrument: InstrumentConfig
): SoundSynthesizer {
  return (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * (tune.volume ?? 1) * instrument.gainMult;
    const duration = tune.duration * instrument.decayMult;

    const buffer = createNoiseBuffer(ctx, duration, "white");
    applyDecayToBuffer(buffer, 0.4);

    const src = ctx.createBufferSource();
    src.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = instrument.filterFreq;
    filter.Q.value = instrument.q;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    src.onended = () => {
      src.disconnect();
      filter.disconnect();
      gain.disconnect();
      opts.onEnd?.();
    };

    src.start(t);

    return {
      stop: () => { try { src.stop(); } catch { /* ok */ } }
    };
  };
}

/**
 * Create a pulse sound (repeating pattern)
 */
function createPulseSound(
  tune: BaseTune,
  instrument: InstrumentConfig
): SoundSynthesizer {
  return (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * (tune.volume ?? 1) * instrument.gainMult;
    const freq = (tune.frequency ?? 440) * instrument.pitchMult;
    const pulseCount = tune.pulseCount ?? 2;
    const pulseDur = (tune.noteDuration ?? 0.1) * instrument.decayMult;
    const gap = tune.noteGap ?? 0.08;

    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    for (let i = 0; i < pulseCount; i++) {
      const pulseStart = t + i * (pulseDur + gap);
      const osc = ctx.createOscillator();
      osc.type = instrument.oscType;
      osc.frequency.value = freq;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, pulseStart);
      gain.gain.linearRampToValueAtTime(vol, pulseStart + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, pulseStart + pulseDur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      oscillators.push(osc);
      gains.push(gain);

      osc.start(pulseStart);
      osc.stop(pulseStart + pulseDur + 0.01);
    }

    const cleanup = () => {
      oscillators.forEach(o => { try { o.disconnect(); } catch { /* ok */ } });
      gains.forEach(g => { try { g.disconnect(); } catch { /* ok */ } });
      opts.onEnd?.();
    };

    oscillators[oscillators.length - 1].onended = cleanup;

    return {
      stop: () => {
        oscillators.forEach(o => { try { o.stop(); } catch { /* ok */ } });
      }
    };
  };
}

/**
 * Create a wobble sound (LFO modulated)
 */
function createWobbleSound(
  tune: BaseTune,
  instrument: InstrumentConfig
): SoundSynthesizer {
  return (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * (tune.volume ?? 1) * instrument.gainMult;
    const duration = tune.duration * instrument.decayMult;
    const freq = (tune.frequency ?? 500) * instrument.pitchMult;
    const modFreq = tune.modFreq ?? 6;
    const modDepth = tune.modDepth ?? 30;

    const osc = ctx.createOscillator();
    osc.type = instrument.oscType;
    osc.frequency.value = freq;

    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = modFreq;

    const lfoGain = ctx.createGain();
    lfoGain.gain.value = modDepth;

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.onended = () => {
      osc.disconnect();
      lfo.disconnect();
      lfoGain.disconnect();
      gain.disconnect();
      opts.onEnd?.();
    };

    osc.start(t);
    lfo.start(t);
    osc.stop(t + duration + 0.01);
    lfo.stop(t + duration + 0.01);

    return {
      stop: () => {
        try { osc.stop(); lfo.stop(); } catch { /* ok */ }
      }
    };
  };
}

// ---------------------------------------------------------------------------
// Main Factory Function
// ---------------------------------------------------------------------------

/**
 * Create a SoundSynthesizer by combining a tune with an instrument.
 */
export function createSoundFromTune(
  tune: BaseTune,
  instrument: InstrumentConfig
): SoundSynthesizer {
  switch (tune.type) {
    case "click":
      return createClickSound(tune, instrument);
    case "pop":
      return createPopSound(tune, instrument);
    case "toggle":
      return createToggleSound(tune, instrument);
    case "tick":
      return createTickSound(tune, instrument);
    case "sweep":
      return createSweepSound(tune, instrument);
    case "rise":
      return createRiseSound(tune, instrument);
    case "drop":
      return createDropSound(tune, instrument);
    case "chime":
      return createChimeSound(tune, instrument);
    case "arpeggio":
      return createArpeggioSound(tune, instrument);
    case "chord":
      return createChordSound(tune, instrument);
    case "burst":
      return createBurstSound(tune, instrument);
    case "pulse":
      return createPulseSound(tune, instrument);
    case "wobble":
      return createWobbleSound(tune, instrument);
    default:
      return createChimeSound(tune, instrument);
  }
}
