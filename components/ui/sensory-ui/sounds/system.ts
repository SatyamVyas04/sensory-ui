import type { SystemRole } from "../config/sound-roles";
import type { SoundSynthesizer } from "../config/engine";

/**
 * Default pack — system sounds.
 *
 * Design intent: open/close are tonal inversion pairs; expand/collapse are
 * lighter versions of the same idea. system.focus is the most subtle sound
 * in the whole set — barely audible, pure sine ring.
 */
export const system: Record<SystemRole, SoundSynthesizer> = {
  /**
   * system.open — dialog / sheet / dropdown open. Rising gentle expansion.
   * 300 → 450 Hz sine, 200 ms.
   */
  "system.open": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.6;
    const dur = 0.2;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(450, t + dur);

    // Blend in a faint second partial (one octave up) for richness
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(600, t);
    osc2.frequency.exponentialRampToValueAtTime(900, t + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.05);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(vol * 0.2, t);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.05);

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

    osc.start(t); osc.stop(t + dur + 0.06);
    osc2.start(t); osc2.stop(t + dur + 0.06);
    return { stop: () => { try { osc.stop(); osc2.stop(); } catch { /* already stopped */ } } };
  },

  /**
   * system.close — tonal inverse of open. 450 → 300 Hz, 200 ms.
   */
  "system.close": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.6;
    const dur = 0.2;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(450, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + dur);

    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(900, t);
    osc2.frequency.exponentialRampToValueAtTime(600, t + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.05);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(vol * 0.2, t);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.05);

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

    osc.start(t); osc.stop(t + dur + 0.06);
    osc2.start(t); osc2.stop(t + dur + 0.06);
    return { stop: () => { try { osc.stop(); osc2.stop(); } catch { /* already stopped */ } } };
  },

  /**
   * system.expand — accordion expand / collapsible open.
   * Lighter than open. 370 → 470 Hz triangle, 150 ms.
   */
  "system.expand": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.5;
    const dur = 0.15;

    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(370, t);
    osc.frequency.exponentialRampToValueAtTime(470, t + dur);

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
   * system.collapse — paired with expand. 470 → 370 Hz, 150 ms.
   */
  "system.collapse": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.5;
    const dur = 0.15;

    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(470, t);
    osc.frequency.exponentialRampToValueAtTime(370, t + dur);

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
   * system.focus — focus trap entry / modal focus gain.
   * The most subtle sound in the set. Pure sine 750 Hz ring, 90 ms, very quiet.
   */
  "system.focus": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.3; // rule: weight-match-action (least important)
    const dur = 0.09;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(750, t);

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
};
