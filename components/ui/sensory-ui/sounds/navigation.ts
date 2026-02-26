import type { NavigationRole } from "../config/sound-roles";
import type { SoundSynthesizer } from "../config/engine";

/**
 * Default pack — navigation sounds.
 *
 * Design intent: low-volume directional sweeps. forward/backward are tonal
 * inversions — same harmonic content, opposite pitch arc (plan: sound-roles.md).
 * navigation.scroll is near-subliminal (~50% of others).
 */
export const navigation: Record<NavigationRole, SoundSynthesizer> = {
  /**
   * navigation.forward — rightward / upward sweep. 280 → 420 Hz sine, 180 ms.
   */
  "navigation.forward": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.55;
    const dur = 0.18;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(420, t + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.onended = () => { osc.disconnect(); gain.disconnect(); opts.onEnd?.(); };
    osc.start(t);
    osc.stop(t + dur + 0.05);
    return { stop: () => { try { osc.stop(); } catch { /* already stopped */ } } };
  },

  /**
   * navigation.backward — leftward / downward sweep. Tonal mirror of forward.
   * 420 → 280 Hz sine, 180 ms.
   */
  "navigation.backward": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.55;
    const dur = 0.18;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(420, t);
    osc.frequency.exponentialRampToValueAtTime(280, t + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.onended = () => { osc.disconnect(); gain.disconnect(); opts.onEnd?.(); };
    osc.start(t);
    osc.stop(t + dur + 0.05);
    return { stop: () => { try { osc.stop(); } catch { /* already stopped */ } } };
  },

  /**
   * navigation.switch — neutral lateral movement. Tab / segment switch.
   * Short triangle sweep 360 → 400 Hz, 130 ms. Whoosh-like, not a click.
   */
  "navigation.switch": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.45;
    const dur = 0.13;

    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(340, t);
    osc.frequency.exponentialRampToValueAtTime(390, t + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.onended = () => { osc.disconnect(); gain.disconnect(); opts.onEnd?.(); };
    osc.start(t);
    osc.stop(t + dur + 0.04);
    return { stop: () => { try { osc.stop(); } catch { /* already stopped */ } } };
  },

  /**
   * navigation.scroll — almost subliminal scroll snap tick.
   * Tiny filtered noise burst, 35 ms. Volume ~50% of switch.
   */
  "navigation.scroll": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.22; // rule: weight-match-action (very quiet for scroll)

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

    src.onended = () => { src.disconnect(); filter.disconnect(); gain.disconnect(); opts.onEnd?.(); };
    src.start(t);
    return { stop: () => { try { src.stop(); } catch { /* already stopped */ } } };
  },
};
