import type { NavigationRole } from "../config/sound-roles";
import type { SoundSynthesizer } from "../config/engine";

/**
 * Default pack — navigation sounds.
 *
 * Design intent: low-volume directional sweeps. forward/backward are tonal
 * inversions — same harmonic content, opposite pitch arc (plan: sound-roles.md).
 * navigation.switch is a crisp bandpass "tck" — far more appropriate for
 * tab/toggle switching than a long sweep.
 * navigation.scroll is near-subliminal (~50% of others).
 */
export const navigation: Record<NavigationRole, SoundSynthesizer> = {
  /**
   * navigation.forward — rightward / upward sweep.
   * 280 → 440 Hz sine over 160 ms with a high-frequency shimmer partial (×4)
   * at very low volume for an airy, upward-moving quality.
   */
  "navigation.forward": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.52;
    const dur = 0.16;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(440, t + dur);

    // High shimmer partial — 4× main frequency at 12% volume
    const shimmer = ctx.createOscillator();
    shimmer.type = "sine";
    shimmer.frequency.setValueAtTime(1120, t);
    shimmer.frequency.exponentialRampToValueAtTime(1760, t + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.04);

    const shimmerGain = ctx.createGain();
    shimmerGain.gain.setValueAtTime(vol * 0.12, t);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.03);

    osc.connect(gain); gain.connect(ctx.destination);
    shimmer.connect(shimmerGain); shimmerGain.connect(ctx.destination);

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      osc.disconnect(); gain.disconnect();
      shimmer.disconnect(); shimmerGain.disconnect();
      opts.onEnd?.();
    };
    osc.onended = cleanup;

    osc.start(t); osc.stop(t + dur + 0.05);
    shimmer.start(t); shimmer.stop(t + dur + 0.05);
    return {
      stop: () => {
        try { osc.stop(); shimmer.stop(); } catch { /* already stopped */ }
      },
    };
  },

  /**
   * navigation.backward — leftward / downward sweep.
   * Tonal mirror of forward: 440 → 280 Hz with shimmer at 1760 → 1120 Hz.
   */
  "navigation.backward": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.52;
    const dur = 0.16;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(280, t + dur);

    const shimmer = ctx.createOscillator();
    shimmer.type = "sine";
    shimmer.frequency.setValueAtTime(1760, t);
    shimmer.frequency.exponentialRampToValueAtTime(1120, t + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.04);

    const shimmerGain = ctx.createGain();
    shimmerGain.gain.setValueAtTime(vol * 0.12, t);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.03);

    osc.connect(gain); gain.connect(ctx.destination);
    shimmer.connect(shimmerGain); shimmerGain.connect(ctx.destination);

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      osc.disconnect(); gain.disconnect();
      shimmer.disconnect(); shimmerGain.disconnect();
      opts.onEnd?.();
    };
    osc.onended = cleanup;

    osc.start(t); osc.stop(t + dur + 0.05);
    shimmer.start(t); shimmer.stop(t + dur + 0.05);
    return {
      stop: () => {
        try { osc.stop(); shimmer.stop(); } catch { /* already stopped */ }
      },
    };
  },

  /**
   * navigation.switch — tab / segment / toggle selection.
   * Crisp bandpass noise "tck" (5 ms) layered with a short 700 → 540 Hz
   * triangle tail (30 ms) — far more fitting for discrete selection than a
   * long sweep. Snappy and satisfying without being loud.
   */
  "navigation.switch": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.52;

    // Noise burst — the click transient
    const bufLen = Math.floor(ctx.sampleRate * 0.005);
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufLen * 0.28));
    }

    const src = ctx.createBufferSource();
    src.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2400;
    filter.Q.value = 4.5;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(vol, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.022);

    // Short pitch tail — adds a tonal "click" identity
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(700, t);
    osc.frequency.exponentialRampToValueAtTime(540, t + 0.03);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(vol * 0.38, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.032);

    src.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      src.disconnect(); filter.disconnect(); noiseGain.disconnect();
      osc.disconnect(); oscGain.disconnect();
      opts.onEnd?.();
    };
    src.onended = cleanup;

    src.start(t);
    osc.start(t);
    osc.stop(t + 0.04);
    return {
      stop: () => {
        try { src.stop(); osc.stop(); } catch { /* already stopped */ }
      },
    };
  },

  /**
   * navigation.scroll — almost subliminal scroll-snap tick.
   * Tiny filtered noise burst, 7 ms. Volume ~50% of switch.
   */
  "navigation.scroll": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.22;

    const bufLen = Math.floor(ctx.sampleRate * 0.007);
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufLen * 0.3));
    }

    const src = ctx.createBufferSource();
    src.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2800;
    filter.Q.value = 2;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    src.onended = () => {
      src.disconnect(); filter.disconnect(); gain.disconnect();
      opts.onEnd?.();
    };
    src.start(t);
    return { stop: () => { try { src.stop(); } catch { /* already stopped */ } } };
  },
};
