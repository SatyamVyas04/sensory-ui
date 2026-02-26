import type { SoundRole } from "../config/sound-roles";
import type { SoundSynthesizer } from "../config/engine";

/**
 * Arcade pack — chiptune-inspired synthesized sounds.
 *
 * Design intent: classic 8-bit videogame audio. Square-wave oscillators,
 * stepped (non-interpolated) pitch changes, short punchy envelopes.
 * Perfect for playful, gamified, or retro-aesthetic UIs.
 *
 * Vibe reference: NES/Game Boy era sound chips.
 */

// ---------------------------------------------------------------------------
// Note table (Hz)
// ---------------------------------------------------------------------------
const C4 = 261.63;
const E4 = 329.63;
const G4 = 392.0;
const C5 = 523.25;
const E5 = 659.25;
const G5 = 783.99;
const A5 = 880.0;
const C6 = 1046.5;

// ---------------------------------------------------------------------------
// Helper: square-wave click
// ---------------------------------------------------------------------------
function sqClick(
  ctx: AudioContext,
  freq: number,
  dur: number,
  vol: number,
  onEnd?: () => void
): OscillatorNode {
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = "square";
  osc.frequency.setValueAtTime(freq, t);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.onended = () => { osc.disconnect(); gain.disconnect(); onEnd?.(); };
  osc.start(t);
  osc.stop(t + dur + 0.005);
  return osc;
}

// ---------------------------------------------------------------------------
// Pack definition
// ---------------------------------------------------------------------------
export const arcadePack: Record<SoundRole, SoundSynthesizer> = {
  // ── Activation ─────────────────────────────────────────────────────────

  /** 8-bit primary click. Single square burst at 880 Hz, 40 ms. */
  "activation.primary": (ctx, opts) => {
    const vol = (opts.volume ?? 1) * 0.65;
    const osc = sqClick(ctx, A5, 0.04, vol, opts.onEnd);
    return { stop: () => { try { osc.stop(); } catch { /* already stopped */ } } };
  },

  /** Softer secondary click. 660 Hz, 30 ms. */
  "activation.subtle": (ctx, opts) => {
    const vol = (opts.volume ?? 1) * 0.4;
    const osc = sqClick(ctx, G5 * 0.75, 0.03, vol, opts.onEnd);
    return { stop: () => { try { osc.stop(); } catch { /* already stopped */ } } };
  },

  /** Confirm — 3-step arpeggio: C5 → E5 → G5, 80 ms total. */
  "activation.confirm": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.6;
    const notes = [C5, E5, G5];
    const step = 0.025;
    const oscs: OscillatorNode[] = [];

    notes.forEach((freq, i) => {
      const ns = t + i * step;
      const osc = ctx.createOscillator();
      osc.type = "square";
      osc.frequency.setValueAtTime(freq, ns);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(vol, ns);
      gain.gain.exponentialRampToValueAtTime(0.001, ns + 0.022);

      osc.connect(gain); gain.connect(ctx.destination);
      const isLast = i === notes.length - 1;
      osc.onended = () => {
        osc.disconnect(); gain.disconnect();
        if (isLast) opts.onEnd?.();
      };
      osc.start(ns); osc.stop(ns + 0.028);
      oscs.push(osc);
    });

    return { stop: () => oscs.forEach(o => { try { o.stop(); } catch { /* ok */ } }) };
  },

  /** Error — descending buzz: 440 → 220 Hz square wave, 70 ms. */
  "activation.error": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.6;
    const dur = 0.07;

    const osc = ctx.createOscillator();
    osc.type = "square";
    // Stepped descent — digital feel
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.setValueAtTime(330, t + 0.02);
    osc.frequency.setValueAtTime(220, t + 0.04);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(gain); gain.connect(ctx.destination);
    osc.onended = () => { osc.disconnect(); gain.disconnect(); opts.onEnd?.(); };
    osc.start(t); osc.stop(t + dur + 0.005);
    return { stop: () => { try { osc.stop(); } catch { /* already stopped */ } } };
  },

  // ── Navigation ───────────────────────────────────────────────────────────

  /** Forward — chirp up: 440 → 880 Hz square, 150 ms. */
  "navigation.forward": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.45;
    const dur = 0.15;

    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.setValueAtTime(660, t + 0.05);
    osc.frequency.setValueAtTime(880, t + 0.10);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(gain); gain.connect(ctx.destination);
    osc.onended = () => { osc.disconnect(); gain.disconnect(); opts.onEnd?.(); };
    osc.start(t); osc.stop(t + dur + 0.005);
    return { stop: () => { try { osc.stop(); } catch { /* already stopped */ } } };
  },

  /** Backward — chirp down: 880 → 440 Hz (mirror of forward). */
  "navigation.backward": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.45;
    const dur = 0.15;

    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.setValueAtTime(660, t + 0.05);
    osc.frequency.setValueAtTime(440, t + 0.10);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(gain); gain.connect(ctx.destination);
    osc.onended = () => { osc.disconnect(); gain.disconnect(); opts.onEnd?.(); };
    osc.start(t); osc.stop(t + dur + 0.005);
    return { stop: () => { try { osc.stop(); } catch { /* already stopped */ } } };
  },

  /** Switch — neutral blip. 660 Hz square, 90 ms. */
  "navigation.switch": (ctx, opts) => {
    const vol = (opts.volume ?? 1) * 0.4;
    const osc = sqClick(ctx, E5 + 30, 0.09, vol, opts.onEnd);
    return { stop: () => { try { osc.stop(); } catch { /* already stopped */ } } };
  },

  /** Scroll — micro blip. Very quiet A5, 45 ms. */
  "navigation.scroll": (ctx, opts) => {
    const vol = (opts.volume ?? 1) * 0.18;
    const osc = sqClick(ctx, A5, 0.045, vol, opts.onEnd);
    return { stop: () => { try { osc.stop(); } catch { /* already stopped */ } } };
  },

  // ── Notifications ────────────────────────────────────────────────────────

  /** Passive — single square tone 660 Hz, 200 ms. */
  "notifications.passive": (ctx, opts) => {
    const vol = (opts.volume ?? 1) * 0.45;
    const osc = sqClick(ctx, G5 * 0.75, 0.2, vol, opts.onEnd);
    return { stop: () => { try { osc.stop(); } catch { /* already stopped */ } } };
  },

  /** Important — double beep: two 880 Hz pulses, 40 ms each. */
  "notifications.important": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.55;
    const oscs: OscillatorNode[] = [];

    [0, 0.1].forEach((offset, i) => {
      const ns = t + offset;
      const osc = ctx.createOscillator();
      osc.type = "square";
      osc.frequency.setValueAtTime(A5, ns);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(vol, ns);
      gain.gain.exponentialRampToValueAtTime(0.001, ns + 0.04);

      osc.connect(gain); gain.connect(ctx.destination);
      osc.onended = () => {
        osc.disconnect(); gain.disconnect();
        if (i === 1) opts.onEnd?.();
      };
      osc.start(ns); osc.stop(ns + 0.045);
      oscs.push(osc);
    });

    return { stop: () => oscs.forEach(o => { try { o.stop(); } catch { /* ok */ } }) };
  },

  /** Success — classic 5-note ascending: C5→E5→G5→A5→C6. */
  "notifications.success": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.55;
    const notes = [C5, E5, G5, A5, C6];
    const step = 0.07;
    const oscs: OscillatorNode[] = [];

    notes.forEach((freq, i) => {
      const ns = t + i * step;
      const isLast = i === notes.length - 1;
      const dur = isLast ? 0.15 : 0.06;

      const osc = ctx.createOscillator();
      osc.type = "square";
      osc.frequency.setValueAtTime(freq, ns);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(vol, ns);
      gain.gain.exponentialRampToValueAtTime(0.001, ns + dur);

      osc.connect(gain); gain.connect(ctx.destination);
      osc.onended = () => {
        osc.disconnect(); gain.disconnect();
        if (isLast) opts.onEnd?.();
      };
      osc.start(ns); osc.stop(ns + dur + 0.005);
      oscs.push(osc);
    });

    return { stop: () => oscs.forEach(o => { try { o.stop(); } catch { /* ok */ } }) };
  },

  /** Warning — descending alarm pattern: A5→G5→E5, twice. */
  "notifications.warning": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.55;
    const pattern = [A5, G5, E5, A5, G5, E5];
    const step = 0.07;
    const oscs: OscillatorNode[] = [];

    pattern.forEach((freq, i) => {
      const ns = t + i * step;
      const isLast = i === pattern.length - 1;

      const osc = ctx.createOscillator();
      osc.type = "square";
      osc.frequency.setValueAtTime(freq, ns);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(vol, ns);
      gain.gain.exponentialRampToValueAtTime(0.001, ns + 0.055);

      osc.connect(gain); gain.connect(ctx.destination);
      osc.onended = () => {
        osc.disconnect(); gain.disconnect();
        if (isLast) opts.onEnd?.();
      };
      osc.start(ns); osc.stop(ns + 0.06);
      oscs.push(osc);
    });

    return { stop: () => oscs.forEach(o => { try { o.stop(); } catch { /* ok */ } }) };
  },

  // ── System ───────────────────────────────────────────────────────────────

  /** Open — ascending step sweep: 4 steps from 330→990 Hz, 200 ms. */
  "system.open": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.45;
    const freqs = [330, 495, 660, 990];
    const step = 0.045;
    const oscs: OscillatorNode[] = [];

    freqs.forEach((freq, i) => {
      const ns = t + i * step;
      const isLast = i === freqs.length - 1;

      const osc = ctx.createOscillator();
      osc.type = "square";
      osc.frequency.setValueAtTime(freq, ns);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(vol, ns);
      gain.gain.exponentialRampToValueAtTime(0.001, ns + 0.04);

      osc.connect(gain); gain.connect(ctx.destination);
      osc.onended = () => {
        osc.disconnect(); gain.disconnect();
        if (isLast) opts.onEnd?.();
      };
      osc.start(ns); osc.stop(ns + 0.045);
      oscs.push(osc);
    });

    return { stop: () => oscs.forEach(o => { try { o.stop(); } catch { /* ok */ } }) };
  },

  /** Close — mirror of open, descending: 990→330 Hz. */
  "system.close": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.45;
    const freqs = [990, 660, 495, 330];
    const step = 0.045;
    const oscs: OscillatorNode[] = [];

    freqs.forEach((freq, i) => {
      const ns = t + i * step;
      const isLast = i === freqs.length - 1;

      const osc = ctx.createOscillator();
      osc.type = "square";
      osc.frequency.setValueAtTime(freq, ns);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(vol, ns);
      gain.gain.exponentialRampToValueAtTime(0.001, ns + 0.04);

      osc.connect(gain); gain.connect(ctx.destination);
      osc.onended = () => {
        osc.disconnect(); gain.disconnect();
        if (isLast) opts.onEnd?.();
      };
      osc.start(ns); osc.stop(ns + 0.045);
      oscs.push(osc);
    });

    return { stop: () => oscs.forEach(o => { try { o.stop(); } catch { /* ok */ } }) };
  },

  /** Expand — quick upward blip: 440 → 660 Hz, 2 steps, 100 ms. */
  "system.expand": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.4;

    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.setValueAtTime(660, t + 0.05);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(gain); gain.connect(ctx.destination);
    osc.onended = () => { osc.disconnect(); gain.disconnect(); opts.onEnd?.(); };
    osc.start(t); osc.stop(t + 0.105);
    return { stop: () => { try { osc.stop(); } catch { /* already stopped */ } } };
  },

  /** Collapse — downward blip: 660 → 440 Hz, 2 steps, 100 ms. */
  "system.collapse": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.4;

    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.setValueAtTime(660, t);
    osc.frequency.setValueAtTime(440, t + 0.05);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(gain); gain.connect(ctx.destination);
    osc.onended = () => { osc.disconnect(); gain.disconnect(); opts.onEnd?.(); };
    osc.start(t); osc.stop(t + 0.105);
    return { stop: () => { try { osc.stop(); } catch { /* already stopped */ } } };
  },

  /** Focus — brief high blip at A5, 60 ms. */
  "system.focus": (ctx, opts) => {
    const vol = (opts.volume ?? 1) * 0.25;
    const osc = sqClick(ctx, A5, 0.06, vol, opts.onEnd);
    return { stop: () => { try { osc.stop(); } catch { /* already stopped */ } } };
  },

  // ── Hero ─────────────────────────────────────────────────────────────────

  /**
   * hero.complete — classic "level up" 8-note ascending square fanfare.
   * C5→E5→G5→A5→C6, each spaced 80 ms. Total ~700 ms.
   */
  "hero.complete": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.65;
    const notes = [C4 * 2, E4 * 2, G4 * 2, C5, E5, G5, A5, C6];
    const step = 0.075;
    const oscs: OscillatorNode[] = [];

    notes.forEach((freq, i) => {
      const ns = t + i * step;
      const isLast = i === notes.length - 1;
      const dur = isLast ? 0.25 : 0.065;

      const osc = ctx.createOscillator();
      osc.type = "square";
      osc.frequency.setValueAtTime(freq, ns);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(vol, ns);
      gain.gain.exponentialRampToValueAtTime(0.001, ns + dur);

      osc.connect(gain); gain.connect(ctx.destination);
      osc.onended = () => {
        osc.disconnect(); gain.disconnect();
        if (isLast) opts.onEnd?.();
      };
      osc.start(ns); osc.stop(ns + dur + 0.01);
      oscs.push(osc);
    });

    return { stop: () => oscs.forEach(o => { try { o.stop(); } catch { /* ok */ } }) };
  },

  /**
   * hero.milestone — 4-note mini fanfare: C5→E5→G5→C6, ~400 ms.
   */
  "hero.milestone": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.55;
    const notes = [C5, E5, G5, C6];
    const step = 0.075;
    const oscs: OscillatorNode[] = [];

    notes.forEach((freq, i) => {
      const ns = t + i * step;
      const isLast = i === notes.length - 1;
      const dur = isLast ? 0.18 : 0.06;

      const osc = ctx.createOscillator();
      osc.type = "square";
      osc.frequency.setValueAtTime(freq, ns);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(vol, ns);
      gain.gain.exponentialRampToValueAtTime(0.001, ns + dur);

      osc.connect(gain); gain.connect(ctx.destination);
      osc.onended = () => {
        osc.disconnect(); gain.disconnect();
        if (isLast) opts.onEnd?.();
      };
      osc.start(ns); osc.stop(ns + dur + 0.01);
      oscs.push(osc);
    });

    return { stop: () => oscs.forEach(o => { try { o.stop(); } catch { /* ok */ } }) };
  },
};
