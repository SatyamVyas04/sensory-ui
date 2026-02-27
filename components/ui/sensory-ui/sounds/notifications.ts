import type { NotificationsRole } from "../config/sound-roles";
import type { SoundSynthesizer } from "../config/engine";

/**
 * Default pack — notification sounds.
 *
 * Design: Musical 2-note patterns for clear semantic meaning.
 * - passive = soft single chime (neutral information)
 * - success = ascending 2 notes (positive feeling)
 * - warning = same note twice (attention-getting)
 * - error = descending 2 notes (negative connotation)
 */
export const notifications: Record<NotificationsRole, SoundSynthesizer> = {
  /**
   * notifications.passive — info toast / passive alert.
   * Soft single chime at D5, subtle harmonic shimmer.
   */
  "notifications.passive": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.45;
    const dur = 0.22;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 587.33;  // D5

    // Subtle octave harmonic
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = 1174.66;  // D6

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(vol * 0.15, t);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.7);

    osc.connect(gain);
    osc2.connect(gain2);
    gain.connect(ctx.destination);
    gain2.connect(ctx.destination);

    osc.onended = () => {
      osc.disconnect(); gain.disconnect();
      osc2.disconnect(); gain2.disconnect();
      opts.onEnd?.();
    };

    osc.start(t);
    osc2.start(t);
    osc.stop(t + dur + 0.01);
    osc2.stop(t + dur * 0.7 + 0.01);

    return { stop: () => { try { osc.stop(); osc2.stop(); } catch { /* ok */ } } };
  },

  /**
   * notifications.success — success toast / form saved.
   * Two ascending notes: C5 → E5 (major third = happy/positive).
   */
  "notifications.success": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.6;
    const noteDur = 0.1;
    const gap = 0.12;
    const ringDur = 0.25;

    // First note: C5
    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.value = 523.25;  // C5

    const gain1 = ctx.createGain();
    gain1.gain.setValueAtTime(0.001, t);
    gain1.gain.linearRampToValueAtTime(vol, t + 0.012);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + noteDur + 0.06);

    // Second note: E5 (ascending)
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = 659.25;  // E5

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.001, t + gap);
    gain2.gain.linearRampToValueAtTime(vol, t + gap + 0.012);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + gap + noteDur + ringDur);

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(ctx.destination);
    gain2.connect(ctx.destination);

    osc2.onended = () => {
      osc1.disconnect(); gain1.disconnect();
      osc2.disconnect(); gain2.disconnect();
      opts.onEnd?.();
    };

    osc1.start(t);
    osc1.stop(t + noteDur + 0.08);
    osc2.start(t + gap);
    osc2.stop(t + gap + noteDur + ringDur + 0.05);

    return { stop: () => { try { osc1.stop(); osc2.stop(); } catch { /* ok */ } } };
  },

  /**
   * notifications.warning — caution alert / quota warning.
   * Same note twice: A4 → A4 (repetition = "pay attention").
   */
  "notifications.warning": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.55;
    const noteDur = 0.08;
    const gap = 0.1;
    const ringDur = 0.18;

    // First note: A4
    const osc1 = ctx.createOscillator();
    osc1.type = "triangle";
    osc1.frequency.value = 440;  // A4

    const gain1 = ctx.createGain();
    gain1.gain.setValueAtTime(0.001, t);
    gain1.gain.linearRampToValueAtTime(vol, t + 0.012);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + noteDur + 0.06);

    // Second note: A4 (same)
    const osc2 = ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.value = 440;  // A4

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.001, t + gap);
    gain2.gain.linearRampToValueAtTime(vol, t + gap + 0.012);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + gap + noteDur + ringDur);

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(ctx.destination);
    gain2.connect(ctx.destination);

    osc2.onended = () => {
      osc1.disconnect(); gain1.disconnect();
      osc2.disconnect(); gain2.disconnect();
      opts.onEnd?.();
    };

    osc1.start(t);
    osc1.stop(t + noteDur + 0.08);
    osc2.start(t + gap);
    osc2.stop(t + gap + noteDur + ringDur + 0.05);

    return { stop: () => { try { osc1.stop(); osc2.stop(); } catch { /* ok */ } } };
  },

  /**
   * notifications.error — error toast / connection failed.
   * Two descending notes: B4 → F4 (tritone = tension/negative).
   */
  "notifications.error": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.6;
    const noteDur = 0.1;
    const gap = 0.12;
    const ringDur = 0.22;

    // First note: B4
    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.value = 493.88;  // B4

    const gain1 = ctx.createGain();
    gain1.gain.setValueAtTime(0.001, t);
    gain1.gain.linearRampToValueAtTime(vol, t + 0.012);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + noteDur + 0.06);

    // Second note: F4 (descending tritone)
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = 349.23;  // F4

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.001, t + gap);
    gain2.gain.linearRampToValueAtTime(vol, t + gap + 0.012);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + gap + noteDur + ringDur);

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(ctx.destination);
    gain2.connect(ctx.destination);

    osc2.onended = () => {
      osc1.disconnect(); gain1.disconnect();
      osc2.disconnect(); gain2.disconnect();
      opts.onEnd?.();
    };

    osc1.start(t);
    osc1.stop(t + noteDur + 0.08);
    osc2.start(t + gap);
    osc2.stop(t + gap + noteDur + ringDur + 0.05);

    return { stop: () => { try { osc1.stop(); osc2.stop(); } catch { /* ok */ } } };
  },
};
