import type { SoundRole } from "../config/sound-roles";
import type { SoundSynthesizer } from "../config/engine";

/**
 * Wind pack — airy, organic, nature-inspired synthesized sounds.
 *
 * Design intent: every sound feels like air, breath, or light percussion.
 * White-noise filtered through sweeping bandpass filters for activation/navigation.
 * Wind-chime hybrids (sine + noise tap) for notifications/hero.
 * Subtle, calm, meditative — perfect for wellness, creative, or minimal UIs.
 *
 * Vibe reference: bamboo wind chimes, mountain air, breath-work apps.
 */

// ---------------------------------------------------------------------------
// Helper: white-noise buffer
// ---------------------------------------------------------------------------
function makeNoiseBuffer(ctx: AudioContext, durationSecs: number): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * durationSecs);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buf;
}

// ---------------------------------------------------------------------------
// Helper: air-puff click (filtered noise burst)
// ---------------------------------------------------------------------------
function airPuff(
  ctx: AudioContext,
  filterFreq: number,
  filterQ: number,
  durationSecs: number,
  vol: number,
  onEnd?: () => void
): AudioBufferSourceNode {
  const t = ctx.currentTime;
  const buf = makeNoiseBuffer(ctx, durationSecs + 0.02);
  const src = ctx.createBufferSource();
  src.buffer = buf;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(filterFreq, t);
  filter.Q.setValueAtTime(filterQ, t);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + durationSecs);

  src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
  src.onended = () => { src.disconnect(); filter.disconnect(); gain.disconnect(); onEnd?.(); };
  src.start(t);
  return src;
}

// ---------------------------------------------------------------------------
// Helper: wind-chime note (sine tone + noise tap)
// ---------------------------------------------------------------------------
function chimeNote(
  ctx: AudioContext,
  freq: number,
  toneVol: number,
  toneDur: number,
  tapVol: number,
  offset: number,
  cb?: () => void
): { osc: OscillatorNode; tap: AudioBufferSourceNode } {
  const t = ctx.currentTime + offset;

  // Tonal part — sine with slow exponential decay (the sustain of a chime)
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, t);

  const toneGain = ctx.createGain();
  toneGain.gain.setValueAtTime(toneVol, t);
  toneGain.gain.exponentialRampToValueAtTime(0.001, t + toneDur);

  osc.connect(toneGain); toneGain.connect(ctx.destination);
  osc.onended = () => { osc.disconnect(); toneGain.disconnect(); cb?.(); };
  osc.start(t); osc.stop(t + toneDur + 0.02);

  // Tap transient — brief noise burst at the moment of strike
  const tapBuf = makeNoiseBuffer(ctx, 0.015);
  const tapSrc = ctx.createBufferSource();
  tapSrc.buffer = tapBuf;

  const tapFilter = ctx.createBiquadFilter();
  tapFilter.type = "highpass";
  tapFilter.frequency.setValueAtTime(freq * 2, t);

  const tapGain = ctx.createGain();
  tapGain.gain.setValueAtTime(tapVol, t);
  tapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.015);

  tapSrc.connect(tapFilter); tapFilter.connect(tapGain); tapGain.connect(ctx.destination);
  tapSrc.onended = () => { tapSrc.disconnect(); tapFilter.disconnect(); tapGain.disconnect(); };
  tapSrc.start(t);

  return { osc, tap: tapSrc };
}

// ---------------------------------------------------------------------------
// Pack definition
// ---------------------------------------------------------------------------
export const windPack: Record<SoundRole, SoundSynthesizer> = {
  // ── Activation ─────────────────────────────────────────────────────────

  /** Primary — soft air puff. Bandpass noise 900 Hz, Q=1.2, 80 ms. */
  "activation.primary": (ctx, opts) => {
    const vol = (opts.volume ?? 1) * 0.75;
    const src = airPuff(ctx, 900, 1.2, 0.08, vol, opts.onEnd);
    return { stop: () => { try { src.stop(); } catch { /* already stopped */ } } };
  },

  /** Subtle — gentler puff. 700 Hz, Q=1.0, 55 ms. */
  "activation.subtle": (ctx, opts) => {
    const vol = (opts.volume ?? 1) * 0.5;
    const src = airPuff(ctx, 700, 1.0, 0.055, vol, opts.onEnd);
    return { stop: () => { try { src.stop(); } catch { /* already stopped */ } } };
  },

  /** Confirm — rising airy sweep. Filter sweeps 400 → 1200 Hz over 180 ms. */
  "activation.confirm": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.65;
    const dur = 0.18;

    const buf = makeNoiseBuffer(ctx, dur + 0.02);
    const src = ctx.createBufferSource();
    src.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(400, t);
    filter.frequency.exponentialRampToValueAtTime(1200, t + dur);
    filter.Q.setValueAtTime(1.5, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    src.onended = () => { src.disconnect(); filter.disconnect(); gain.disconnect(); opts.onEnd?.(); };
    src.start(t);
    return { stop: () => { try { src.stop(); } catch { /* already stopped */ } } };
  },

  /** Error — flutter burst. Noise with rapidly amplitude-modulated gain. */
  "activation.error": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.65;
    const dur = 0.12;

    const buf = makeNoiseBuffer(ctx, dur + 0.02);
    const src = ctx.createBufferSource();
    src.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1600, t);
    filter.Q.setValueAtTime(2, t);

    const gain = ctx.createGain();
    // Flutter pattern: two quick pulses
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    gain.gain.setValueAtTime(vol * 0.7, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    src.onended = () => { src.disconnect(); filter.disconnect(); gain.disconnect(); opts.onEnd?.(); };
    src.start(t);
    return { stop: () => { try { src.stop(); } catch { /* already stopped */ } } };
  },

  // ── Navigation ───────────────────────────────────────────────────────────

  /** Forward — noise whoosh with filter sweeping 200 → 900 Hz, 200 ms. */
  "navigation.forward": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.55;
    const dur = 0.2;

    const buf = makeNoiseBuffer(ctx, dur + 0.02);
    const src = ctx.createBufferSource();
    src.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(200, t);
    filter.frequency.exponentialRampToValueAtTime(900, t + dur);
    filter.Q.setValueAtTime(1.2, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    src.onended = () => { src.disconnect(); filter.disconnect(); gain.disconnect(); opts.onEnd?.(); };
    src.start(t);
    return { stop: () => { try { src.stop(); } catch { /* already stopped */ } } };
  },

  /** Backward — mirror whoosh, 900 → 200 Hz. */
  "navigation.backward": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.55;
    const dur = 0.2;

    const buf = makeNoiseBuffer(ctx, dur + 0.02);
    const src = ctx.createBufferSource();
    src.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(900, t);
    filter.frequency.exponentialRampToValueAtTime(200, t + dur);
    filter.Q.setValueAtTime(1.2, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    src.onended = () => { src.disconnect(); filter.disconnect(); gain.disconnect(); opts.onEnd?.(); };
    src.start(t);
    return { stop: () => { try { src.stop(); } catch { /* already stopped */ } } };
  },

  /** Switch — soft swoosh. Static bandpass at 500 Hz, 140 ms. */
  "navigation.switch": (ctx, opts) => {
    const vol = (opts.volume ?? 1) * 0.4;
    const src = airPuff(ctx, 500, 1.4, 0.14, vol, opts.onEnd);
    return { stop: () => { try { src.stop(); } catch { /* already stopped */ } } };
  },

  /** Scroll — tiny tick. High-pass noise burst, 45 ms, very quiet. */
  "navigation.scroll": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.2;
    const dur = 0.045;

    const buf = makeNoiseBuffer(ctx, 0.05);
    const src = ctx.createBufferSource();
    src.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(3000, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    src.onended = () => { src.disconnect(); filter.disconnect(); gain.disconnect(); opts.onEnd?.(); };
    src.start(t);
    return { stop: () => { try { src.stop(); } catch { /* already stopped */ } } };
  },

  // ── Notifications ────────────────────────────────────────────────────────

  /** Passive — gentle wind chime. Single 800 Hz note, 300 ms. */
  "notifications.passive": (ctx, opts) => {
    const vol = (opts.volume ?? 1) * 0.55;
    const { osc, tap } = chimeNote(ctx, 800, vol * 0.9, 0.3, vol * 0.3, 0, opts.onEnd);
    return {
      stop: () => { try { osc.stop(); } catch { /* ok */ } try { tap.stop(); } catch { /* ok */ } },
    };
  },

  /** Important — higher chime struck harder. 1000 Hz, louder tap. */
  "notifications.important": (ctx, opts) => {
    const vol = (opts.volume ?? 1) * 0.65;
    const { osc, tap } = chimeNote(ctx, 1000, vol, 0.4, vol * 0.5, 0, opts.onEnd);
    return {
      stop: () => { try { osc.stop(); } catch { /* ok */ } try { tap.stop(); } catch { /* ok */ } },
    };
  },

  /** Success — two wind chimes in harmony, ascending. G4 then C5. */
  "notifications.success": (ctx, opts) => {
    const vol = (opts.volume ?? 1) * 0.65;
    const nodes: Array<OscillatorNode | AudioBufferSourceNode> = [];

    const n1 = chimeNote(ctx, 392.0, vol * 0.8, 0.35, vol * 0.3, 0);
    const n2 = chimeNote(ctx, 523.25, vol, 0.4, vol * 0.4, 0.12, opts.onEnd);
    nodes.push(n1.osc, n1.tap, n2.osc, n2.tap);

    return {
      stop: () => nodes.forEach(n => { try { (n as OscillatorNode).stop(); } catch { /* ok */ } }),
    };
  },

  /** Warning — discordant chime duo. Sharp, not calming. */
  "notifications.warning": (ctx, opts) => {
    const vol = (opts.volume ?? 1) * 0.7;
    const nodes: Array<OscillatorNode | AudioBufferSourceNode> = [];

    // Two close-but-dissonant frequencies for tension
    const n1 = chimeNote(ctx, 440, vol * 0.85, 0.45, vol * 0.45, 0);
    const n2 = chimeNote(ctx, 466.16, vol * 0.75, 0.45, vol * 0.4, 0.04, opts.onEnd);
    nodes.push(n1.osc, n1.tap, n2.osc, n2.tap);

    return {
      stop: () => nodes.forEach(n => { try { (n as OscillatorNode).stop(); } catch { /* ok */ } }),
    };
  },

  // ── System ───────────────────────────────────────────────────────────────

  /** Open — expanding air: wide noise burst + rising filter, 200 ms. */
  "system.open": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.55;
    const dur = 0.2;

    const buf = makeNoiseBuffer(ctx, dur + 0.02);
    const src = ctx.createBufferSource();
    src.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(300, t);
    filter.frequency.exponentialRampToValueAtTime(800, t + dur * 0.7);
    filter.Q.setValueAtTime(1.0, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    src.onended = () => { src.disconnect(); filter.disconnect(); gain.disconnect(); opts.onEnd?.(); };
    src.start(t);
    return { stop: () => { try { src.stop(); } catch { /* already stopped */ } } };
  },

  /** Close — contracting air: falling filter 800 → 300 Hz, 200 ms. */
  "system.close": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.55;
    const dur = 0.2;

    const buf = makeNoiseBuffer(ctx, dur + 0.02);
    const src = ctx.createBufferSource();
    src.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.exponentialRampToValueAtTime(300, t + dur * 0.7);
    filter.Q.setValueAtTime(1.0, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    src.onended = () => { src.disconnect(); filter.disconnect(); gain.disconnect(); opts.onEnd?.(); };
    src.start(t);
    return { stop: () => { try { src.stop(); } catch { /* already stopped */ } } };
  },

  /** Expand — soft puff upward. 600 Hz bandpass, 130 ms. */
  "system.expand": (ctx, opts) => {
    const vol = (opts.volume ?? 1) * 0.45;
    const src = airPuff(ctx, 600, 1.3, 0.13, vol, opts.onEnd);
    return { stop: () => { try { src.stop(); } catch { /* already stopped */ } } };
  },

  /** Collapse — soft puff downward. 400 Hz bandpass, 130 ms. */
  "system.collapse": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.45;
    const dur = 0.13;

    const buf = makeNoiseBuffer(ctx, dur + 0.02);
    const src = ctx.createBufferSource();
    src.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(600, t);
    filter.frequency.exponentialRampToValueAtTime(400, t + dur * 0.6);
    filter.Q.setValueAtTime(1.3, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    src.onended = () => { src.disconnect(); filter.disconnect(); gain.disconnect(); opts.onEnd?.(); };
    src.start(t);
    return { stop: () => { try { src.stop(); } catch { /* already stopped */ } } };
  },

  /** Focus — gentle breath. Very quiet highpass noise, 80 ms. */
  "system.focus": (ctx, opts) => {
    const t = ctx.currentTime;
    const vol = (opts.volume ?? 1) * 0.22;

    const buf = makeNoiseBuffer(ctx, 0.1);
    const src = ctx.createBufferSource();
    src.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(2200, t);
    filter.Q.setValueAtTime(2, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    src.onended = () => { src.disconnect(); filter.disconnect(); gain.disconnect(); opts.onEnd?.(); };
    src.start(t);
    return { stop: () => { try { src.stop(); } catch { /* already stopped */ } } };
  },

  // ── Hero ─────────────────────────────────────────────────────────────────

  /**
   * hero.complete — wind chime sequence: 5 ascending notes with noise taps.
   * C4, E4, G4, C5, E5 — total ~1100 ms.
   */
  "hero.complete": (ctx, opts) => {
    const notes = [261.63, 329.63, 392.0, 523.25, 659.25];
    const vol = (opts.volume ?? 1) * 0.65;
    const allNodes: Array<OscillatorNode | AudioBufferSourceNode> = [];

    notes.forEach((freq, i) => {
      const isLast = i === notes.length - 1;
      const toneDur = isLast ? 0.65 : 0.38;
      const { osc, tap } = chimeNote(
        ctx, freq, vol * 0.85, toneDur, vol * 0.35,
        i * 0.16,
        isLast ? opts.onEnd : undefined
      );
      allNodes.push(osc, tap);
    });

    return {
      stop: () => allNodes.forEach(n => { try { (n as OscillatorNode).stop(); } catch { /* ok */ } }),
    };
  },

  /**
   * hero.milestone — two-note wind chime resolve. G4 then C5, ~700 ms.
   */
  "hero.milestone": (ctx, opts) => {
    const vol = (opts.volume ?? 1) * 0.6;
    const allNodes: Array<OscillatorNode | AudioBufferSourceNode> = [];

    const n1 = chimeNote(ctx, 392.0, vol * 0.8, 0.45, vol * 0.3, 0);
    const n2 = chimeNote(ctx, 523.25, vol, 0.55, vol * 0.4, 0.2, opts.onEnd);

    allNodes.push(n1.osc, n1.tap, n2.osc, n2.tap);

    return {
      stop: () => allNodes.forEach(n => { try { (n as OscillatorNode).stop(); } catch { /* ok */ } }),
    };
  },
};
