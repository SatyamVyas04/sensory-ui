import type { HeroRole } from "../config/sound-roles";
import type { SoundSynthesizer } from "../config/engine";

// Note frequencies — C major pentatonic
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
 * Both are ascending C-major arpeggios. Each note gets a slightly detuned
 * octave partial (+3 cents) for a warm, chorus-like shimmer — similar to the
 * "spread" technique in synth pads. The final note rings out longer with a
 * decay that gives a sense of resolution and completion.
 */
export const hero: Record<HeroRole, SoundSynthesizer> = {
  /**
   * hero.complete — ascending arpeggio C4→E4→G4→C5→E5 over ~1.1 s.
   * Each note has a paired octave partial detuned +3 cents for shimmer.
   * Final note sustains 0.55 s for a clear sense of resolution.
   */
  "hero.complete": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.88;
    const noteDur = 0.18;
    const gap = 0.145;
    const notes = [C4, E4, G4, C5, E5];
    const oscs: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    // Detune offset in Hz for +3 cents at each note
    const centsOffset = (freq: number) => freq * (2 ** (3 / 1200) - 1);

    notes.forEach((freq, i) => {
      const noteStart = t + i * gap;
      const noteEnd = noteStart + noteDur + 0.08;
      const isLast = i === notes.length - 1;
      const ringDur = isLast ? 0.55 : 0.06;
      const decay = noteEnd + ringDur;

      // Primary sine at exact pitch
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, noteStart);

      // Octave partial slightly detuned for shimmer-chorus effect
      const osc2 = ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(freq * 2 + centsOffset(freq * 2), noteStart);

      // Subtle fifth partial for added richness on last note
      const osc3 = ctx.createOscillator();
      osc3.type = "sine";
      osc3.frequency.setValueAtTime(freq * 3, noteStart);

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.001, noteStart);
      g.gain.linearRampToValueAtTime(vol, noteStart + 0.012);
      g.gain.exponentialRampToValueAtTime(0.001, decay);

      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.001, noteStart);
      g2.gain.linearRampToValueAtTime(vol * 0.28, noteStart + 0.012);
      g2.gain.exponentialRampToValueAtTime(0.001, decay);

      const g3 = ctx.createGain();
      g3.gain.setValueAtTime(0.001, noteStart);
      g3.gain.linearRampToValueAtTime(isLast ? vol * 0.12 : 0.001, noteStart + 0.014);
      g3.gain.exponentialRampToValueAtTime(0.001, decay);

      osc.connect(g);   g.connect(ctx.destination);
      osc2.connect(g2); g2.connect(ctx.destination);
      osc3.connect(g3); g3.connect(ctx.destination);

      osc.start(noteStart);  osc.stop(decay + 0.05);
      osc2.start(noteStart); osc2.stop(decay + 0.05);
      osc3.start(noteStart); osc3.stop(decay + 0.05);

      oscs.push(osc, osc2, osc3);
      gains.push(g, g2, g3);

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
   * hero.milestone — lighter sibling. C4→E4→G4, 3 notes, ~650 ms.
   * Same shimmer technique but at reduced scale.
   * Final note rings out 0.3 s.
   */
  "hero.milestone": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.78;
    const noteDur = 0.16;
    const gap = 0.132;
    const notes = [C4, E4, G4];
    const oscs: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    const centsOffset = (freq: number) => freq * (2 ** (3 / 1200) - 1);

    notes.forEach((freq, i) => {
      const noteStart = t + i * gap;
      const isLast = i === notes.length - 1;
      const ringDur = isLast ? 0.3 : 0.05;
      const decay = noteStart + noteDur + ringDur;

      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, noteStart);

      const osc2 = ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(freq * 2 + centsOffset(freq * 2), noteStart);

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.001, noteStart);
      g.gain.linearRampToValueAtTime(vol, noteStart + 0.011);
      g.gain.exponentialRampToValueAtTime(0.001, decay);

      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.001, noteStart);
      g2.gain.linearRampToValueAtTime(vol * 0.22, noteStart + 0.011);
      g2.gain.exponentialRampToValueAtTime(0.001, decay);

      osc.connect(g);   g.connect(ctx.destination);
      osc2.connect(g2); g2.connect(ctx.destination);

      osc.start(noteStart);  osc.stop(decay + 0.05);
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
};

