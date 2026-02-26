import type { NotificationsRole } from "../config/sound-roles";
import type { SoundSynthesizer } from "../config/engine";

/**
 * Default pack — notification sounds.
 *
 * Design intent: two-tier intensity, warm but not alarming.
 * passive = whisper, success = small resolve, warning = most present.
 * All appropriate for moments that need user attention (rule: appropriate-confirmations-only,
 * appropriate-errors-warnings).
 */
export const notifications: Record<NotificationsRole, SoundSynthesizer> = {
  /**
   * notifications.passive — info toast / passive alert.
   * Soft sine at 500 Hz, 260 ms. Barely there.
   */
  "notifications.passive": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.55;
    const dur = 0.26;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(520, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.onended = () => { osc.disconnect(); gain.disconnect(); opts.onEnd?.(); };
    osc.start(t);
    osc.stop(t + dur + 0.01);
    return { stop: () => { try { osc.stop(); } catch { /* already stopped */ } } };
  },

  /**
   * notifications.important — warning alert / important banner.
   * Two-tone sine: 400 Hz → rises to 550 Hz over 360 ms. More present.
   */
  "notifications.important": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.65;
    const dur = 0.36;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.setValueAtTime(550, t + 0.16);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.setValueAtTime(vol * 0.8, t + 0.16);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.onended = () => { osc.disconnect(); gain.disconnect(); opts.onEnd?.(); };
    osc.start(t);
    osc.stop(t + dur + 0.01);
    return { stop: () => { try { osc.stop(); } catch { /* already stopped */ } } };
  },

  /**
   * notifications.success — success toast / form saved.
   * Rising resolve: 480 → 720 Hz over 300 ms. Warm, brief, positive.
   * Not a fanfare — that is hero.complete.
   */
  "notifications.success": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.7;
    const dur = 0.3;

    // Primary tone — rising
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(480, t);
    osc.frequency.exponentialRampToValueAtTime(720, t + dur);

    // Subtle harmonic — fifth above primary, shorter
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(720, t + 0.1);
    osc2.frequency.exponentialRampToValueAtTime(960, t + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.04);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(vol * 0.35, t + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.04);

    osc.connect(gain); gain.connect(ctx.destination);
    osc2.connect(gain2); gain2.connect(ctx.destination);

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return; cleaned = true;
      osc.disconnect(); gain.disconnect();
      osc2.disconnect(); gain2.disconnect();
      opts.onEnd?.();
    };
    osc.onended = cleanup;

    osc.start(t); osc.stop(t + dur + 0.05);
    osc2.start(t + 0.1); osc2.stop(t + dur + 0.05);
    return { stop: () => { try { osc.stop(); osc2.stop(); } catch { /* already stopped */ } } };
  },

  /**
   * notifications.warning — destructive action warning / quota alert.
   * Flat cautionary tone at 330 Hz, 450 ms. More presence than important.
   * rule: appropriate-no-punishing — informative but not harsh
   */
  "notifications.warning": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.7;
    const dur = 0.45;

    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(330, t);

    // Brief drop-off then sustain — creates a "concerned" quality
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.setValueAtTime(vol * 0.6, t + 0.08);
    gain.gain.setValueAtTime(vol * 0.6, t + dur - 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.onended = () => { osc.disconnect(); gain.disconnect(); opts.onEnd?.(); };
    osc.start(t);
    osc.stop(t + dur + 0.01);
    return { stop: () => { try { osc.stop(); } catch { /* already stopped */ } } };
  },
};
