import type { SoundRole } from "../config/sound-roles";
import type { SoundSynthesizer } from "../config/engine";

/**
 * Retro pack — synthwave / analog synthesizer sounds.
 *
 * Design intent: warm sawtooth waves, slight analog detuning, stacked oscillators.
 * Sounds feel like they came from a Moog or Oberheim rack — thick, slightly gritty,
 * unmistakably electronic. Perfect for dark mode, developer tools, or 80s-aesthetic UIs.
 *
 * Vibe reference: Kavinsky, Daft Punk (Discovery era), CRT monitors, VHS.
 *
 * Techniques:
 * - Dual detuned oscillators (±5 cents) for a natural "chorus" thickness
 * - Sawtooth portamento (exponential frequency glide) for movement
 * - Triangle AM (amplitude modulation) for tremolo on sustained tones
 * - Stacked 5ths for notification chords
 */

// ---------------------------------------------------------------------------
// Helper: dual detuned sawtooth (the "retro chorus" trick)
// ---------------------------------------------------------------------------
function dualSaw(
  ctx: AudioContext,
  freq: number,
  dur: number,
  vol: number,
  onEnd?: () => void
): { oscs: OscillatorNode[]; gains: GainNode[] } {
  const t = ctx.currentTime;
  const detuneCents = 6;
  const oscs: OscillatorNode[] = [];
  const gains: GainNode[] = [];

  [-detuneCents, detuneCents].forEach((cents, i) => {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, t);
    osc.detune.setValueAtTime(cents, t);

    const g = ctx.createGain();
    g.gain.setValueAtTime(vol * 0.55, t); // split stereo presence by halving each
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(g); g.connect(ctx.destination);

    const isLast = i === 1;
    osc.onended = () => {
      osc.disconnect(); g.disconnect();
      if (isLast) onEnd?.();
    };
    osc.start(t); osc.stop(t + dur + 0.01);
    oscs.push(osc); gains.push(g);
  });

  return { oscs, gains };
}

// ---------------------------------------------------------------------------
// Pack definition
// ---------------------------------------------------------------------------
export const retroPack: Record<SoundRole, SoundSynthesizer> = {
  // ── Activation ─────────────────────────────────────────────────────────

  /**
   * Primary — quick saw click. Dual detuned sawtooth, 250 Hz, 45 ms.
   * Short, punchy, analog transient.
   */
  "activation.primary": (ctx, opts) => {
    const vol = (opts.volume ?? 1) * 0.7;
    const { oscs } = dualSaw(ctx, 250, 0.045, vol, opts.onEnd);
    return { stop: () => oscs.forEach(o => { try { o.stop(); } catch { /* already stopped */ } }) };
  },

  /**
   * Subtle — triangle click. Softer, rounded. 200 Hz, 35 ms.
   */
  "activation.subtle": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.45;

    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(200, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

    osc.connect(gain); gain.connect(ctx.destination);
    osc.onended = () => { osc.disconnect(); gain.disconnect(); opts.onEnd?.(); };
    osc.start(t); osc.stop(t + 0.04);
    return { stop: () => { try { osc.stop(); } catch { /* already stopped */ } } };
  },

  /**
   * Confirm — rising saw glide with harmonics. 300 → 500 Hz sawtooth, 90 ms.
   * "Synth positive" feel.
   */
  "activation.confirm": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.65;
    const dur = 0.09;
    const { oscs } = (() => {
      const o: OscillatorNode[] = [];
      const g: GainNode[] = [];
      [0, 7].forEach((detuneCents, i) => {
        const osc = ctx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.exponentialRampToValueAtTime(500, t + dur);
        osc.detune.setValueAtTime(detuneCents, t);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(vol * 0.55, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.02);

        osc.connect(gain); gain.connect(ctx.destination);
        const isLast = i === 1;
        osc.onended = () => { osc.disconnect(); gain.disconnect(); if (isLast) opts.onEnd?.(); };
        osc.start(t); osc.stop(t + dur + 0.03);
        o.push(osc); g.push(gain);
      });
      return { oscs: o };
    })();
    return { stop: () => oscs.forEach(o => { try { o.stop(); } catch { /* already stopped */ } }) };
  },

  /**
   * Error — FM buzz. Sawtooth carrier with rapid pitch drop, slightly detuned.
   * 400 → 200 Hz, 65 ms. Gritty, electronic, not punishing.
   */
  "activation.error": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.65;
    const dur = 0.065;

    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + dur);

    // Second osc slightly flat for "wrong note" harmonic
    const osc2 = ctx.createOscillator();
    osc2.type = "sawtooth";
    osc2.frequency.setValueAtTime(380, t);
    osc2.frequency.exponentialRampToValueAtTime(190, t + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol * 0.55, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(vol * 0.45, t);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + dur);

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
    osc.start(t); osc.stop(t + dur + 0.01);
    osc2.start(t); osc2.stop(t + dur + 0.01);
    return { stop: () => { try { osc.stop(); osc2.stop(); } catch { /* already stopped */ } } };
  },

  // ── Navigation ───────────────────────────────────────────────────────────

  /**
   * Forward — synthwave sweep up. Dual detuned saw glide 150 → 300 Hz, 180 ms.
   */
  "navigation.forward": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.55;
    const dur = 0.18;
    const oscs: OscillatorNode[] = [];

    [-5, 5].forEach((cents, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(300, t + dur);
      osc.detune.setValueAtTime(cents, t);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(vol * 0.55, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.04);

      osc.connect(gain); gain.connect(ctx.destination);
      const isLast = i === 1;
      osc.onended = () => { osc.disconnect(); gain.disconnect(); if (isLast) opts.onEnd?.(); };
      osc.start(t); osc.stop(t + dur + 0.05);
      oscs.push(osc);
    });

    return { stop: () => oscs.forEach(o => { try { o.stop(); } catch { /* already stopped */ } }) };
  },

  /**
   * Backward — synthwave sweep down. 300 → 150 Hz, 180 ms.
   */
  "navigation.backward": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.55;
    const dur = 0.18;
    const oscs: OscillatorNode[] = [];

    [-5, 5].forEach((cents, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.exponentialRampToValueAtTime(150, t + dur);
      osc.detune.setValueAtTime(cents, t);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(vol * 0.55, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.04);

      osc.connect(gain); gain.connect(ctx.destination);
      const isLast = i === 1;
      osc.onended = () => { osc.disconnect(); gain.disconnect(); if (isLast) opts.onEnd?.(); };
      osc.start(t); osc.stop(t + dur + 0.05);
      oscs.push(osc);
    });

    return { stop: () => oscs.forEach(o => { try { o.stop(); } catch { /* already stopped */ } }) };
  },

  /**
   * Switch — neon blip. Strong triangle tone with slight harmonic, 440 Hz, 120 ms.
   */
  "navigation.switch": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.5;
    const dur = 0.12;

    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(460, t + dur * 0.5);
    osc.frequency.exponentialRampToValueAtTime(440, t + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.03);

    osc.connect(gain); gain.connect(ctx.destination);
    osc.onended = () => { osc.disconnect(); gain.disconnect(); opts.onEnd?.(); };
    osc.start(t); osc.stop(t + dur + 0.04);
    return { stop: () => { try { osc.stop(); } catch { /* already stopped */ } } };
  },

  /**
   * Scroll — pixel scroll. Soft sawtooth at 880 Hz, 50 ms, quiet.
   */
  "navigation.scroll": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.22;

    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(880, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain); gain.connect(ctx.destination);
    osc.onended = () => { osc.disconnect(); gain.disconnect(); opts.onEnd?.(); };
    osc.start(t); osc.stop(t + 0.055);
    return { stop: () => { try { osc.stop(); } catch { /* already stopped */ } } };
  },

  // ── Notifications ────────────────────────────────────────────────────────

  /**
   * Passive — synth chord pad. Stacked 5ths (C4 + G4), soft triangle, 300 ms.
   */
  "notifications.passive": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.5;
    const dur = 0.3;
    const freqs = [261.63, 392.0]; // C4 + G4
    const oscs: OscillatorNode[] = [];

    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, t);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(vol * 0.55, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      osc.connect(gain); gain.connect(ctx.destination);
      const isLast = i === freqs.length - 1;
      osc.onended = () => { osc.disconnect(); gain.disconnect(); if (isLast) opts.onEnd?.(); };
      osc.start(t); osc.stop(t + dur + 0.01);
      oscs.push(osc);
    });

    return { stop: () => oscs.forEach(o => { try { o.stop(); } catch { /* already stopped */ } }) };
  },

  /**
   * Important — minor chord stab (A minor: A4 + C5 + E5). Sawtooth, louder, 400 ms.
   */
  "notifications.important": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.6;
    const dur = 0.4;
    const freqs = [440, 523.25, 659.25]; // Am chord
    const oscs: OscillatorNode[] = [];

    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, t);
      osc.detune.setValueAtTime((i - 1) * 5, t); // slight detune spread

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(vol * 0.38, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      osc.connect(gain); gain.connect(ctx.destination);
      const isLast = i === freqs.length - 1;
      osc.onended = () => { osc.disconnect(); gain.disconnect(); if (isLast) opts.onEnd?.(); };
      osc.start(t); osc.stop(t + dur + 0.01);
      oscs.push(osc);
    });

    return { stop: () => oscs.forEach(o => { try { o.stop(); } catch { /* already stopped */ } }) };
  },

  /**
   * Success — synthwave arpeggio resolve. C4→E4→G4→C5, sawtooth, detuned, ~400 ms.
   */
  "notifications.success": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.6;
    const notes = [261.63, 329.63, 392.0, 523.25];
    const step = 0.08;
    const oscs: OscillatorNode[] = [];

    notes.forEach((freq, i) => {
      const ns = t + i * step;
      const isLast = i === notes.length - 1;
      const dur = isLast ? 0.2 : 0.07;

      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, ns);
      osc.detune.setValueAtTime(5, ns);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(vol * 0.7, ns);
      gain.gain.exponentialRampToValueAtTime(0.001, ns + dur);

      osc.connect(gain); gain.connect(ctx.destination);
      osc.onended = () => { osc.disconnect(); gain.disconnect(); if (isLast) opts.onEnd?.(); };
      osc.start(ns); osc.stop(ns + dur + 0.01);
      oscs.push(osc);
    });

    return { stop: () => oscs.forEach(o => { try { o.stop(); } catch { /* already stopped */ } }) };
  },

  /**
   * Warning — dissonant tritone. F4 + B4 (tritone = maximum tension). Sawtooth, 500 ms.
   */
  "notifications.warning": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.6;
    const dur = 0.5;
    const freqs = [349.23, 493.88]; // F4 + B4 (tritone)
    const oscs: OscillatorNode[] = [];

    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, t);
      osc.detune.setValueAtTime(i * 8, t);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(vol * 0.5, t);
      gain.gain.setValueAtTime(vol * 0.3, t + 0.1); // slightly reduce after attack
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      osc.connect(gain); gain.connect(ctx.destination);
      const isLast = i === freqs.length - 1;
      osc.onended = () => { osc.disconnect(); gain.disconnect(); if (isLast) opts.onEnd?.(); };
      osc.start(t); osc.stop(t + dur + 0.01);
      oscs.push(osc);
    });

    return { stop: () => oscs.forEach(o => { try { o.stop(); } catch { /* already stopped */ } }) };
  },

  // ── System ───────────────────────────────────────────────────────────────

  /**
   * Open — portal open. Dual detuned saw glide upward 200 → 350 Hz, 200 ms.
   */
  "system.open": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.55;
    const dur = 0.2;
    const { oscs } = dualSaw(ctx, 200, dur + 0.04, vol, opts.onEnd);
    oscs.forEach(o => {
      o.frequency.setValueAtTime(200, t);
      o.frequency.exponentialRampToValueAtTime(350, t + dur);
    });
    return { stop: () => oscs.forEach(o => { try { o.stop(); } catch { /* already stopped */ } }) };
  },

  /**
   * Close — portal close. Dual detuned saw glide downward 350 → 200 Hz, 200 ms.
   */
  "system.close": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.55;
    const dur = 0.2;
    const { oscs } = dualSaw(ctx, 350, dur + 0.04, vol, opts.onEnd);
    oscs.forEach(o => {
      o.frequency.setValueAtTime(350, t);
      o.frequency.exponentialRampToValueAtTime(200, t + dur);
    });
    return { stop: () => oscs.forEach(o => { try { o.stop(); } catch { /* already stopped */ } }) };
  },

  /**
   * Expand — extend sawtooth. 280 → 380 Hz, 150 ms.
   */
  "system.expand": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.5;
    const dur = 0.15;
    const { oscs } = dualSaw(ctx, 280, dur + 0.03, vol, opts.onEnd);
    oscs.forEach(o => {
      o.frequency.setValueAtTime(280, t);
      o.frequency.exponentialRampToValueAtTime(380, t + dur);
    });
    return { stop: () => oscs.forEach(o => { try { o.stop(); } catch { /* already stopped */ } }) };
  },

  /**
   * Collapse — retract sawtooth. 380 → 280 Hz, 150 ms.
   */
  "system.collapse": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.5;
    const dur = 0.15;
    const { oscs } = dualSaw(ctx, 380, dur + 0.03, vol, opts.onEnd);
    oscs.forEach(o => {
      o.frequency.setValueAtTime(380, t);
      o.frequency.exponentialRampToValueAtTime(280, t + dur);
    });
    return { stop: () => oscs.forEach(o => { try { o.stop(); } catch { /* already stopped */ } }) };
  },

  /**
   * Focus — neon ping. Triangle with slight frequency dip then return. 1000 Hz, 100 ms.
   * The AM wobble gives it a "neon sign flicker" quality.
   */
  "system.focus": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.3;
    const dur = 0.1;

    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(1000, t);
    osc.frequency.setValueAtTime(980, t + 0.03);
    osc.frequency.setValueAtTime(1000, t + 0.06);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(gain); gain.connect(ctx.destination);
    osc.onended = () => { osc.disconnect(); gain.disconnect(); opts.onEnd?.(); };
    osc.start(t); osc.stop(t + dur + 0.01);
    return { stop: () => { try { osc.stop(); } catch { /* already stopped */ } } };
  },

  // ── Hero ─────────────────────────────────────────────────────────────────

  /**
   * hero.complete — 80s synth fanfare. Multi-note arpeggio with dual detuned
   * sawtooth. C4→E4→G4→C5→E5→G5, total ~1100 ms. Thick, triumphant.
   */
  "hero.complete": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.65;
    const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99];
    const step = 0.13;
    const allOscs: OscillatorNode[] = [];

    notes.forEach((freq, i) => {
      const ns = t + i * step;
      const isLast = i === notes.length - 1;
      const dur = isLast ? 0.4 : 0.12;

      [-5, 5].forEach((cents, j) => {
        const osc = ctx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, ns);
        osc.detune.setValueAtTime(cents, ns);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(vol * 0.5, ns);
        gain.gain.exponentialRampToValueAtTime(0.001, ns + dur);

        osc.connect(gain); gain.connect(ctx.destination);
        const isVeryLast = isLast && j === 1;
        osc.onended = () => { osc.disconnect(); gain.disconnect(); if (isVeryLast) opts.onEnd?.(); };
        osc.start(ns); osc.stop(ns + dur + 0.01);
        allOscs.push(osc);
      });
    });

    return { stop: () => allOscs.forEach(o => { try { o.stop(); } catch { /* ok */ } }) };
  },

  /**
   * hero.milestone — synthwave chord stab. C major chord (C4+E4+G4) in
   * detuned sawtooth, sharp attack, ~700 ms total with after-arpeggio.
   */
  "hero.milestone": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.6;

    // Initial chord hit
    const chordFreqs = [261.63, 329.63, 392.0]; // C4 + E4 + G4
    const allOscs: OscillatorNode[] = [];

    chordFreqs.forEach((freq, ci) => {
      [-5, 5].forEach((cents, j) => {
        const osc = ctx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, t);
        osc.detune.setValueAtTime(cents, t);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(vol * 0.38, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

        osc.connect(gain); gain.connect(ctx.destination);
        osc.onended = () => { osc.disconnect(); gain.disconnect(); };
        osc.start(t); osc.stop(t + 0.36);
        allOscs.push(osc);
      });
    });

    // Rising tail arpeggio after the chord hit
    [523.25, 659.25].forEach((freq, i) => {
      const ns = t + 0.3 + i * 0.12;
      const isLast = i === 1;

      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, ns);
      osc.detune.setValueAtTime(5, ns);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(vol * 0.6, ns);
      gain.gain.exponentialRampToValueAtTime(0.001, ns + 0.18);

      osc.connect(gain); gain.connect(ctx.destination);
      osc.onended = () => { osc.disconnect(); gain.disconnect(); if (isLast) opts.onEnd?.(); };
      osc.start(ns); osc.stop(ns + 0.19);
      allOscs.push(osc);
    });

    return { stop: () => allOscs.forEach(o => { try { o.stop(); } catch { /* ok */ } }) };
  },
};
