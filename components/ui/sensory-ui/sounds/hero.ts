import type { HeroRole } from "../config/sound-roles";
import type { SoundSynthesizer } from "../config/engine";

// Note frequencies used in hero arpeggios
const C4 = 261.63;
const E4 = 329.63;
const G4 = 392.0;
const C5 = 523.25;
const E5 = 659.25;

/**
 * Default pack — hero sounds (disabled by default in sensory.config.js).
 *
 * Design intent: celebratory but not garish. These are longer-form sounds
 * for moments of real significance — completing an onboarding, a first purchase,
 * hitting a milestone. Weight-match rule: only use these for truly significant events.
 *
 * Both are ascending arpeggios, but hero.complete is longer and more complete;
 * hero.milestone is its lighter sibling.
 */
export const hero: Record<HeroRole, SoundSynthesizer> = {
  /**
   * hero.complete — ascending arpeggio C4→E4→G4→C5→E5 over ~1 second.
   * Rich with harmonics, warm sine blend. Celebratory resolve.
   */
  "hero.complete": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.85;
    const noteDur = 0.18; // each note
    const gap = 0.14; // spacing between note starts
    const notes = [C4, E4, G4, C5, E5];
    const oscs: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    notes.forEach((freq, i) => {
      const noteStart = t + i * gap;
      const noteEnd = noteStart + noteDur + 0.08;
      const isLast = i === notes.length - 1;

      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, noteStart);

      // Blend in a subtle octave partial
      const osc2 = ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(freq * 2, noteStart);

      const g = ctx.createGain();
      const g2 = ctx.createGain();

      // Last note sustains longer
      const decay = isLast ? noteEnd + 0.35 : noteEnd;
      g.gain.setValueAtTime(0.001, noteStart);
      g.gain.linearRampToValueAtTime(vol, noteStart + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, decay);

      g2.gain.setValueAtTime(0.001, noteStart);
      g2.gain.linearRampToValueAtTime(vol * 0.25, noteStart + 0.01);
      g2.gain.exponentialRampToValueAtTime(0.001, decay);

      osc.connect(g); g.connect(ctx.destination);
      osc2.connect(g2); g2.connect(ctx.destination);

      osc.start(noteStart); osc.stop(decay + 0.05);
      osc2.start(noteStart); osc2.stop(decay + 0.05);

      oscs.push(osc, osc2);
      gains.push(g, g2);

      if (isLast) {
        osc.onended = () => {
          oscs.forEach(o => { try { o.disconnect(); } catch { /* ok */ } });
          gains.forEach(g => { try { g.disconnect(); } catch { /* ok */ } });
          opts.onEnd?.();
        };
      }
    });

    return {
      stop: () => {
        oscs.forEach(o => { try { o.stop(); } catch { /* already stopped */ } });
      },
    };
  },

  /**
   * hero.milestone — lighter sibling. C4→E4→G4, 3 notes, ~600 ms.
   */
  "hero.milestone": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.75;
    const noteDur = 0.16;
    const gap = 0.13;
    const notes = [C4, E4, G4];
    const oscs: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    notes.forEach((freq, i) => {
      const noteStart = t + i * gap;
      const isLast = i === notes.length - 1;
      const decay = isLast ? noteStart + noteDur + 0.22 : noteStart + noteDur + 0.06;

      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, noteStart);

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.001, noteStart);
      g.gain.linearRampToValueAtTime(vol, noteStart + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, decay);

      osc.connect(g); g.connect(ctx.destination);
      osc.start(noteStart); osc.stop(decay + 0.05);

      oscs.push(osc); gains.push(g);

      if (isLast) {
        osc.onended = () => {
          oscs.forEach(o => { try { o.disconnect(); } catch { /* ok */ } });
          gains.forEach(g => { try { g.disconnect(); } catch { /* ok */ } });
          opts.onEnd?.();
        };
      }
    });

    return {
      stop: () => {
        oscs.forEach(o => { try { o.stop(); } catch { /* already stopped */ } });
      },
    };
  },
};
