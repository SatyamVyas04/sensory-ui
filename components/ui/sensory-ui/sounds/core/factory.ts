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
 * Reference: playConcept("click") — noise with exponential decay, bandpass filter.
 */
function createClickSound(
  tune: BaseTune,
  instrument: InstrumentConfig
): SoundSynthesizer {
  return (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * (tune.volume ?? 1) * instrument.gainMult;
    const duration = Math.max(0.008, tune.duration) * instrument.decayMult;
    const meta = tune.meta as { decayConstant?: number } | undefined;
    const decayConstant = meta?.decayConstant ?? 50;

    // Generate noise buffer with exponential decay (reference pattern)
    const bufLen = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (decayConstant * instrument.decayMult));
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = (tune.filterFreq ?? 4000) * instrument.pitchMult;
    filter.Q.value = (tune.filterQ ?? 3) * instrument.q;

    const gain = ctx.createGain();
    gain.gain.value = vol;

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
 * Create a toggle sound (state change - noise click + tonal tail)
 * Reference: playConcept("toggle") — 12ms noise bandpass 2500Hz + sine 800→400Hz
 */
function createToggleSound(
  tune: BaseTune,
  instrument: InstrumentConfig
): SoundSynthesizer {
  return (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * (tune.volume ?? 1) * instrument.gainMult;
    const duration = tune.duration * instrument.decayMult;
    const meta = tune.meta as {
      noiseGain?: number; toneGain?: number;
      noiseDuration?: number; decayConstant?: number;
    } | undefined;

    const nodes: AudioNode[] = [];
    const sources: AudioScheduledSourceNode[] = [];

    // Noise click transient (reference: 12ms, exp decay -i/80)
    const noiseDur = (meta?.noiseDuration ?? 0.012) * instrument.decayMult;
    const decayConstant = meta?.decayConstant ?? 80;
    const bufLen = Math.floor(ctx.sampleRate * noiseDur);
    const buffer = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (decayConstant * instrument.decayMult));
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = (tune.filterFreq ?? 2500) * instrument.pitchMult;
    filter.Q.value = (tune.filterQ ?? 3) * instrument.q;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = (meta?.noiseGain ?? 0.4) * instrument.gainMult * (opts.volume ?? 1);

    src.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    nodes.push(filter, noiseGain);
    sources.push(src);
    src.start(t);

    // Tonal tail (reference: sine 800→400Hz, gain 0.15→0.001 over 40ms)
    if (tune.frequency) {
      const osc = ctx.createOscillator();
      osc.type = instrument.oscType;
      osc.frequency.setValueAtTime(tune.frequency * instrument.pitchMult, t);
      if (tune.endFrequency) {
        osc.frequency.exponentialRampToValueAtTime(
          tune.endFrequency * instrument.pitchMult,
          t + 0.03 * instrument.decayMult
        );
      }

      const oscGain = ctx.createGain();
      const toneVol = (meta?.toneGain ?? 0.15) * instrument.gainMult * (opts.volume ?? 1);
      oscGain.gain.setValueAtTime(toneVol, t);
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
 * Reference: playConcept("tick") — 4ms noise with exp decay (-i/20),
 * highpass 3000Hz, gain 0.3.
 */
function createTickSound(
  tune: BaseTune,
  instrument: InstrumentConfig
): SoundSynthesizer {
  return (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * (tune.volume ?? 1) * instrument.gainMult;
    const duration = Math.max(0.004, tune.duration) * instrument.decayMult;
    const meta = tune.meta as { decayConstant?: number } | undefined;
    const decayConstant = meta?.decayConstant ?? 20;

    // Generate noise buffer with exponential decay (reference pattern)
    const bufLen = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (decayConstant * instrument.decayMult));
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = (tune.filterFreq ?? 3000) * instrument.pitchMult;

    const gain = ctx.createGain();
    gain.gain.value = vol;

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
  };
}

/**
 * Create a sweep sound (frequency glide).
 * Supports an optional harmonic overtone when tune.harmonics is set,
 * and an optional click transient layer when tune.meta.clickLayer is true
 * (used by overlay open/close/expand/collapse sounds for tactility).
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

    const oscs: OscillatorNode[] = [];
    const gainNodes: GainNode[] = [];
    const extraNodes: AudioNode[] = [];

    const osc = ctx.createOscillator();
    osc.type = instrument.oscType;
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);
    oscs.push(osc);
    gainNodes.push(gain);

    // Parse meta for overlay enhancements
    const meta = tune.meta as {
      clickLayer?: boolean; clickGain?: number;
      thirdPartial?: boolean; thirdRatio?: number; thirdVolume?: number;
    } | undefined;

    // Harmonic layer for richer overlay open/close/expand/collapse sounds
    if (tune.harmonics && tune.harmonicRatio) {
      const harmRatio = tune.harmonicRatio;
      const harmVol = vol * (tune.harmonicVolume ?? 0.15);
      const harmOsc = ctx.createOscillator();
      harmOsc.type = "sine";
      harmOsc.frequency.setValueAtTime(startFreq * harmRatio, t);
      harmOsc.frequency.exponentialRampToValueAtTime(endFreq * harmRatio, t + duration);
      const harmGain = ctx.createGain();
      harmGain.gain.setValueAtTime(harmVol, t);
      harmGain.gain.exponentialRampToValueAtTime(0.001, t + duration + 0.03);
      harmOsc.connect(harmGain);
      harmGain.connect(ctx.destination);
      oscs.push(harmOsc);
      gainNodes.push(harmGain);
    }

    // Third partial for richer timbre (adds bell-like quality to overlay sounds)
    if (meta?.thirdPartial) {
      const thirdRatio = meta.thirdRatio ?? 3;
      const thirdVol = vol * (meta.thirdVolume ?? 0.06);
      const thirdOsc = ctx.createOscillator();
      thirdOsc.type = "sine";
      thirdOsc.frequency.setValueAtTime(startFreq * thirdRatio, t);
      thirdOsc.frequency.exponentialRampToValueAtTime(endFreq * thirdRatio, t + duration);
      const thirdGain = ctx.createGain();
      thirdGain.gain.setValueAtTime(thirdVol, t);
      thirdGain.gain.exponentialRampToValueAtTime(0.001, t + duration * 0.6);
      thirdOsc.connect(thirdGain);
      thirdGain.connect(ctx.destination);
      oscs.push(thirdOsc);
      gainNodes.push(thirdGain);
    }

    // Click transient layer for overlay sounds (subtle tactile click at the start)
    if (meta?.clickLayer) {
      const clickDur = 0.005;
      const clickBufLen = Math.floor(ctx.sampleRate * clickDur);
      const clickBuffer = ctx.createBuffer(1, clickBufLen, ctx.sampleRate);
      const clickData = clickBuffer.getChannelData(0);
      for (let i = 0; i < clickBufLen; i++) {
        clickData[i] = (Math.random() * 2 - 1) * Math.exp(-i / 25);
      }
      const clickSrc = ctx.createBufferSource();
      clickSrc.buffer = clickBuffer;
      const clickFilter = ctx.createBiquadFilter();
      clickFilter.type = "bandpass";
      clickFilter.frequency.value = 3500 * instrument.pitchMult;
      clickFilter.Q.value = 2;
      const clickGainNode = ctx.createGain();
      clickGainNode.gain.value = vol * (meta.clickGain ?? 0.25);
      clickSrc.connect(clickFilter);
      clickFilter.connect(clickGainNode);
      clickGainNode.connect(ctx.destination);
      extraNodes.push(clickSrc, clickFilter, clickGainNode);
      clickSrc.start(t);
    }

    const cleanup = () => {
      oscs.forEach(o => { try { o.disconnect(); } catch { /* ok */ } });
      gainNodes.forEach(g => { try { g.disconnect(); } catch { /* ok */ } });
      extraNodes.forEach(n => { try { n.disconnect(); } catch { /* ok */ } });
      opts.onEnd?.();
    };
    osc.onended = cleanup;

    oscs.forEach(o => { o.start(t); o.stop(t + duration + 0.05); });

    return {
      stop: () => { oscs.forEach(o => { try { o.stop(); } catch { /* ok */ } }); }
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
 * Create an arpeggio sound (sequence of notes).
 * Supports meta.shimmerCents: adds a slightly detuned oscillator on the
 * final note for a subtle chorus shimmer (used by hero sounds).
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
    const meta = tune.meta as { finalRing?: number; shimmerCents?: number } | undefined;
    const finalRing = meta?.finalRing ?? 0.4;
    const shimmerCents = meta?.shimmerCents;

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

      // Shimmer: detuned copy on the final note (hero sounds only)
      if (isLast && shimmerCents) {
        const shimOsc = ctx.createOscillator();
        shimOsc.type = instrument.oscType;
        shimOsc.frequency.value = freq;
        shimOsc.detune.value = shimmerCents;
        const shimGain = ctx.createGain();
        shimGain.gain.setValueAtTime(0.001, noteStart);
        shimGain.gain.linearRampToValueAtTime(vol * 0.35, noteStart + 0.015);
        shimGain.gain.exponentialRampToValueAtTime(0.001, decay);
        shimOsc.connect(shimGain);
        shimGain.connect(ctx.destination);
        oscillators.push(shimOsc);
        gains.push(shimGain);
        shimOsc.start(noteStart);
        shimOsc.stop(decay + 0.05);
      }

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
 * Create a burst sound (noise texture).
 * Also handles whoosh-style sounds when meta.sineEnvelope is true
 * (used by navigation.tab).
 * Reference: playConcept("whoosh") — sine-envelope noise, bandpass sweep.
 */
function createBurstSound(
  tune: BaseTune,
  instrument: InstrumentConfig
): SoundSynthesizer {
  return (ctx: AudioContext, opts: PlaySoundOptions): SoundPlayback => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * (tune.volume ?? 1) * instrument.gainMult;
    const duration = tune.duration * instrument.decayMult;
    const meta = tune.meta as { endFilterFreq?: number; sineEnvelope?: boolean } | undefined;

    // Generate noise buffer
    const bufLen = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (meta?.sineEnvelope) {
      // Whoosh: sine-envelope noise (reference pattern)
      for (let i = 0; i < bufLen; i++) {
        const env = Math.sin((i / bufLen) * Math.PI);
        data[i] = (Math.random() * 2 - 1) * env;
      }
    } else {
      // Standard burst: noise with decay
      for (let i = 0; i < bufLen; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      applyDecayToBuffer(buffer, 0.4);
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    const startFilterFreq = (tune.filterFreq ?? instrument.filterFreq) * instrument.pitchMult;
    filter.frequency.setValueAtTime(startFilterFreq, t);
    // Sweep filter frequency for whoosh effect
    if (meta?.endFilterFreq) {
      filter.frequency.exponentialRampToValueAtTime(
        meta.endFilterFreq * instrument.pitchMult, t + duration
      );
    }
    filter.Q.value = (tune.filterQ ?? instrument.q);

    const gain = ctx.createGain();
    gain.gain.value = vol;

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
