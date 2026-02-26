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
   * Filtered white-noise burst, 8 ms, bandpass at 4 kHz.
   * rule: param-click-duration, param-filter-frequency-range, param-q-value-range
   */
  "activation.primary": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.9;

    const bufLen = Math.floor(ctx.sampleRate * 0.008); // 8 ms — rule: param-click-duration
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufLen * 0.4));
    }

    const src = ctx.createBufferSource();
    src.buffer = buf;

    const filter = ctx.createBiquadFilter(); // rule: design-filter-for-character
    filter.type = "bandpass";
    filter.frequency.value = 4000; // rule: param-filter-frequency-range (3–6 kHz)
    filter.Q.value = 3; // rule: param-q-value-range (2–5)

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t); // rule: envelope-set-initial-value
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04); // rule: envelope-exponential-decay, envelope-no-zero-target

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    src.onended = () => { // rule: context-cleanup-nodes
      src.disconnect();
      filter.disconnect();
      gain.disconnect();
      opts.onEnd?.();
    };

    src.start(t);
    return { stop: () => { try { src.stop(); } catch { /* already stopped */ } } };
  },

  /**
   * activation.subtle — secondary / icon button click.
   * Same as primary but narrower filter and lower gain (~60% perceived loudness).
   */
  "activation.subtle": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.55;

    const bufLen = Math.floor(ctx.sampleRate * 0.006); // 6 ms
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
    return { stop: () => { try { src.stop(); } catch { /* already stopped */ } } };
  },

  /**
   * activation.confirm — form submit / save confirm.
   * Rising sine sweep: 400 → 600 Hz over 80 ms. Slightly elevated, positive.
   */
  "activation.confirm": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.75;
    const dur = 0.08;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(400, t); // rule: envelope-set-initial-value
    osc.frequency.exponentialRampToValueAtTime(600, t + dur); // rule: design-oscillator-for-tonal

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.02);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
      opts.onEnd?.();
    };

    osc.start(t);
    osc.stop(t + dur + 0.03);
    return { stop: () => { try { osc.stop(); } catch { /* already stopped */ } } };
  },

  /**
   * activation.error — validation failure / error state.
   * Descending sine sweep: 320 → 220 Hz over 60 ms.
   * Distinct from others via downward pitch arc; not alarming.
   */
  "activation.error": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.7;
    const dur = 0.06;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(220, t + dur);

    // Add a subtle second partial for harmonic distinction
    const osc2 = ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(160, t);
    osc2.frequency.exponentialRampToValueAtTime(110, t + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.02);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(vol * 0.4, t);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.02);

    osc.connect(gain);
    osc2.connect(gain2);
    gain.connect(ctx.destination);
    gain2.connect(ctx.destination);

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
    return { stop: () => { try { osc.stop(); osc2.stop(); } catch { /* already stopped */ } } };
  },
};
