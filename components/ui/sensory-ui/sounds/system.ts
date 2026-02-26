import type { SystemRole } from "../config/sound-roles";
import type { SoundSynthesizer } from "../config/engine";

/**
 * Default pack — system sounds.
 *
 * Design intent: open/close are inversion pairs; expand/collapse are
 * lighter inversion pairs. system.focus is the most subtle sound in the
 * whole set — barely audible, pure sine ring.
 *
 * Improvements: open/close now carry a minor third partial at 14% volume
 * for a richer, more "spatial" quality — like a panel sweeping open in 3D.
 */
export const system: Record<SystemRole, SoundSynthesizer> = {
  /**
   * system.open — dialog / sheet / dropdown open.
   * Rising 300 → 460 Hz sine, 210 ms.
   * Two partials: an octave (600 → 920 Hz) at 18% and a minor-third
   * (360 → 550 Hz) at 10% — gives an "expanding" spatial character.
   */
  "system.open": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.58;
    const dur = 0.21;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(460, t + dur);

    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(600, t);
    osc2.frequency.exponentialRampToValueAtTime(920, t + dur);

    const osc3 = ctx.createOscillator();
    osc3.type = "sine";
    osc3.frequency.setValueAtTime(360, t);
    osc3.frequency.exponentialRampToValueAtTime(550, t + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.06);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(vol * 0.18, t);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.06);

    const gain3 = ctx.createGain();
    gain3.gain.setValueAtTime(vol * 0.10, t);
    gain3.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.04);

    osc.connect(gain);   gain.connect(ctx.destination);
    osc2.connect(gain2); gain2.connect(ctx.destination);
    osc3.connect(gain3); gain3.connect(ctx.destination);

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return; cleaned = true;
      osc.disconnect();  gain.disconnect();
      osc2.disconnect(); gain2.disconnect();
      osc3.disconnect(); gain3.disconnect();
      opts.onEnd?.();
    };
    osc.onended = cleanup;

    osc.start(t);  osc.stop(t + dur + 0.07);
    osc2.start(t); osc2.stop(t + dur + 0.07);
    osc3.start(t); osc3.stop(t + dur + 0.05);
    return {
      stop: () => {
        try { osc.stop(); osc2.stop(); osc3.stop(); } catch { /* already stopped */ }
      },
    };
  },

  /**
   * system.close — tonal inverse of open. 460 → 300 Hz, 210 ms.
   * Partials also descend: 920 → 600 Hz and 550 → 360 Hz.
   */
  "system.close": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.58;
    const dur = 0.21;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(460, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + dur);

    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(920, t);
    osc2.frequency.exponentialRampToValueAtTime(600, t + dur);

    const osc3 = ctx.createOscillator();
    osc3.type = "sine";
    osc3.frequency.setValueAtTime(550, t);
    osc3.frequency.exponentialRampToValueAtTime(360, t + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.06);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(vol * 0.18, t);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.06);

    const gain3 = ctx.createGain();
    gain3.gain.setValueAtTime(vol * 0.10, t);
    gain3.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.04);

    osc.connect(gain);   gain.connect(ctx.destination);
    osc2.connect(gain2); gain2.connect(ctx.destination);
    osc3.connect(gain3); gain3.connect(ctx.destination);

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return; cleaned = true;
      osc.disconnect();  gain.disconnect();
      osc2.disconnect(); gain2.disconnect();
      osc3.disconnect(); gain3.disconnect();
      opts.onEnd?.();
    };
    osc.onended = cleanup;

    osc.start(t);  osc.stop(t + dur + 0.07);
    osc2.start(t); osc2.stop(t + dur + 0.07);
    osc3.start(t); osc3.stop(t + dur + 0.05);
    return {
      stop: () => {
        try { osc.stop(); osc2.stop(); osc3.stop(); } catch { /* already stopped */ }
      },
    };
  },

  /**
   * system.expand — accordion / collapsible open.
   * Lighter than system.open. 370 → 480 Hz triangle, 140 ms.
   * Subtle second partial at 555 → 720 Hz at 16% for texture.
   */
  "system.expand": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.48;
    const dur = 0.14;

    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(370, t);
    osc.frequency.exponentialRampToValueAtTime(480, t + dur);

    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(555, t);
    osc2.frequency.exponentialRampToValueAtTime(720, t + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.04);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(vol * 0.16, t);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.035);

    osc.connect(gain);   gain.connect(ctx.destination);
    osc2.connect(gain2); gain2.connect(ctx.destination);

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return; cleaned = true;
      osc.disconnect();  gain.disconnect();
      osc2.disconnect(); gain2.disconnect();
      opts.onEnd?.();
    };
    osc.onended = cleanup;

    osc.start(t);  osc.stop(t + dur + 0.05);
    osc2.start(t); osc2.stop(t + dur + 0.05);
    return {
      stop: () => {
        try { osc.stop(); osc2.stop(); } catch { /* already stopped */ }
      },
    };
  },

  /**
   * system.collapse — paired with expand. 480 → 370 Hz, 140 ms.
   * Second partial also descends: 720 → 555 Hz at 16%.
   */
  "system.collapse": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.48;
    const dur = 0.14;

    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(480, t);
    osc.frequency.exponentialRampToValueAtTime(370, t + dur);

    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(720, t);
    osc2.frequency.exponentialRampToValueAtTime(555, t + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.04);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(vol * 0.16, t);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.035);

    osc.connect(gain);   gain.connect(ctx.destination);
    osc2.connect(gain2); gain2.connect(ctx.destination);

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return; cleaned = true;
      osc.disconnect();  gain.disconnect();
      osc2.disconnect(); gain2.disconnect();
      opts.onEnd?.();
    };
    osc.onended = cleanup;

    osc.start(t);  osc.stop(t + dur + 0.05);
    osc2.start(t); osc2.stop(t + dur + 0.05);
    return {
      stop: () => {
        try { osc.stop(); osc2.stop(); } catch { /* already stopped */ }
      },
    };
  },

  /**
   * system.focus — focus trap entry / modal focus gain.
   * The most subtle sound in the set. Pure sine 780 Hz ring, 85 ms, very quiet.
   * rule: weight-match-action (least important interaction in the system).
   */
  "system.focus": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.28;
    const dur = 0.085;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(780, t);

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
