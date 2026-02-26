import type { ActivationRole } from "../config/sound-roles";
import type { SoundSynthesizer } from "../config/engine";

/**
 * Default pack — activation sounds.
 *
 * Design intent: soft, modern, minimal. These are the everyday taps and
 * confirmations of a polished SaaS UI. Nothing alarming, nothing decorative.
 *
 * All click/tap sounds use filtered noise bursts (rule: design-noise-for-percussion).
 * All tonal sounds use oscillators with pitch movement (rule: design-oscillator-for-tonal).
 * All envelopes use exponential ramps, never linear (rule: envelope-exponential-decay).
 */
export const activation: Record<ActivationRole, SoundSynthesizer> = {
  /**
   * activation.primary — the default click.
   * Filtered noise burst at 4.5 kHz with a subtle 65 Hz sub-thump layered in
   * for physical "click" weight. Total duration ≈ 40 ms.
   */
  "activation.primary": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.9;

    // High-frequency noise burst (the crisp click body)
    const bufLen = Math.floor(ctx.sampleRate * 0.008);
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufLen * 0.4));
    }

    const src = ctx.createBufferSource();
    src.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 4500; // slightly brighter than before
    filter.Q.value = 3;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    // Sub-thump — 65 Hz sine, 18 ms, very quiet — adds physical weight
    const thump = ctx.createOscillator();
    thump.type = "sine";
    thump.frequency.setValueAtTime(65, t);

    const thumpGain = ctx.createGain();
    thumpGain.gain.setValueAtTime(vol * 0.14, t);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, t + 0.018);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    thump.connect(thumpGain);
    thumpGain.connect(ctx.destination);

    src.onended = () => {
      src.disconnect();
      filter.disconnect();
      gain.disconnect();
      thump.disconnect();
      thumpGain.disconnect();
      opts.onEnd?.();
    };

    src.start(t);
    thump.start(t);
    thump.stop(t + 0.02);
    return {
      stop: () => {
        try { src.stop(); } catch { /* already stopped */ }
        try { thump.stop(); } catch { /* already stopped */ }
      },
    };
  },

  /**
   * activation.subtle — secondary / icon button / switch click.
   * Lighter noise burst (narrower, quieter) with a gentler 50 Hz sub.
   */
  "activation.subtle": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.55;

    const bufLen = Math.floor(ctx.sampleRate * 0.006);
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufLen * 0.35));
    }

    const src = ctx.createBufferSource();
    src.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 3200;
    filter.Q.value = 2.5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

    const thump = ctx.createOscillator();
    thump.type = "sine";
    thump.frequency.setValueAtTime(50, t);

    const thumpGain = ctx.createGain();
    thumpGain.gain.setValueAtTime(vol * 0.08, t);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, t + 0.014);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    thump.connect(thumpGain);
    thumpGain.connect(ctx.destination);

    src.onended = () => {
      src.disconnect();
      filter.disconnect();
      gain.disconnect();
      thump.disconnect();
      thumpGain.disconnect();
      opts.onEnd?.();
    };

    src.start(t);
    thump.start(t);
    thump.stop(t + 0.015);
    return {
      stop: () => {
        try { src.stop(); } catch { /* already stopped */ }
        try { thump.stop(); } catch { /* already stopped */ }
      },
    };
  },

  /**
   * activation.confirm — form submit / save / checkbox check.
   * Rising perfect-fifth sweep 440 → 660 Hz (A4→E5) over 70 ms.
   * A second partial at 660 → 990 Hz at 28% volume adds warmth and resolve.
   * Musical interval makes it feel unambiguously positive.
   */
  "activation.confirm": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.72;
    const dur = 0.07;

    // Primary tone — A4 → E5
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(660, t + dur);

    // Second partial — E5 → B5 (fifth above primary) for harmonic warmth
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(660, t);
    osc2.frequency.exponentialRampToValueAtTime(990, t + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.025);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(vol * 0.28, t);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.022);

    osc.connect(gain); gain.connect(ctx.destination);
    osc2.connect(gain2); gain2.connect(ctx.destination);

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      osc.disconnect(); gain.disconnect();
      osc2.disconnect(); gain2.disconnect();
      opts.onEnd?.();
    };
    osc.onended = cleanup;

    osc.start(t); osc.stop(t + dur + 0.03);
    osc2.start(t); osc2.stop(t + dur + 0.03);
    return {
      stop: () => {
        try { osc.stop(); osc2.stop(); } catch { /* already stopped */ }
      },
    };
  },

  /**
   * activation.error — validation failure / error state.
   * Descending dissonant sweep 340 → 200 Hz (tritone descent) over 70 ms.
   * Second partial at 170 → 110 Hz adds a low warning rumble.
   * Informative but not harsh — rule: appropriate-no-punishing.
   */
  "activation.error": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.7;
    const dur = 0.07;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(340, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + dur);

    const osc2 = ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(170, t);
    osc2.frequency.exponentialRampToValueAtTime(110, t + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.025);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(vol * 0.42, t);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.022);

    osc.connect(gain); gain.connect(ctx.destination);
    osc2.connect(gain2); gain2.connect(ctx.destination);

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      osc.disconnect(); gain.disconnect();
      osc2.disconnect(); gain2.disconnect();
      opts.onEnd?.();
    };
    osc.onended = cleanup;

    osc.start(t); osc.stop(t + dur + 0.03);
    osc2.start(t); osc2.stop(t + dur + 0.03);
    return {
      stop: () => {
        try { osc.stop(); osc2.stop(); } catch { /* already stopped */ }
      },
    };
  },
};
