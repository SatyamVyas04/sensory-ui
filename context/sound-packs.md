# sensory-ui - Sound Packs

> `components/ui/sensory-ui/sounds/`

Sound packs are sets of `SoundSynthesizer` functions that cover all 17 sound roles. Each pack has a
distinct character - swap between them by changing `theme` in `sensory.config.js`.

All built-in packs generate audio **programmatically via the Web Audio API** - no audio files,
no base64 blobs, no network requests for built-in audio. Custom role overrides (`config.overrides`)
may instead load audio from URLs or base64 data URIs at runtime.

> Credit: synthesis patterns adapted from
> [Generating Sounds with AI - userinterface.wiki](https://www.userinterface.wiki/generating-sounds-with-ai)
>
> Effects system inspired by
> [@web-kits/audio](https://audio.raphaelsalaja.com) by Raphael Salaja

---

## Architecture: Tunes + Instruments + Effects

sensory-ui uses an **instrument-based architecture** that separates:

1. **Tunes** (`sounds/core/tunes.ts`) - Define the musical content:
    - Frequencies, durations, pitch contours
    - Note sequences for arpeggios
    - Filter settings for noise-based sounds
    - Volume levels and decay times

2. **Instruments** (`sounds/core/instruments.ts`) - Define the synthesis technique:
    - Waveform type (sine, square, sawtooth, triangle)
    - Noise characteristics (white, pink, brown)
    - Filter settings and resonance
    - Envelope shapes (attack/decay curves)
    - Harmonic content and detuning
    - **Effects chain** (reverb, delay, chorus, distortion)

3. **Effects** (`sounds/core/effects.ts`) - Spatial/timbral processing:
    - Reverb via generated impulse responses (no external files)
    - Feedback delay with filter
    - Chorus via modulated delay
    - Waveshaper distortion
    - Chains of effects daisy-chained automatically

4. **Factory** (`sounds/core/factory.ts`) - Combines tunes with instruments:
    - Takes a tune definition and an instrument config
    - If the instrument has effects, routes output through the chain
    - Produces a `SoundSynthesizer` function

This separation allows the **same tunes to be played by different instruments**,
creating distinct soundpack characters with minimal code duplication.

---

## Effects System

Each `InstrumentConfig` can include an optional `effects` array. When present, the factory
routes every sound through the effects chain before reaching `ctx.destination`.

```ts
interface InstrumentConfig {
  filterFreq: number;
  q: number;
  oscType: OscillatorWaveform;
  decayMult: number;
  gainMult: number;
  pitchMult: number;
  effects?: EffectDefinition[];  // <-- new
}
```

### Available Effects

| Effect      | Options                                                                 | Description |
| ----------- | ----------------------------------------------------------------------- | ----------- |
| `reverb`    | `{ duration, decay, mix }`                                              | Algorithmic reverb via noise-buffer impulse response |
| `delay`     | `{ time, feedback, filterFreq, mix }`                                   | Feedback delay with low-pass filter in loop |
| `chorus`    | `{ rate, depth, detune, mix }`                                          | Delay-based chorus with LFO modulation |
| `distortion`| `{ amount, filterFreq, mix }`                                           | Waveshaper saturation with post-filter |

All effects support a `mix` parameter (0–1) for wet/dry balance.

### Pack Effects Mapping

| Pack       | Effects                                              | Character rationale |
| ---------- | ---------------------------------------------------- | ------------------- |
| aero       | reverb (long tail, 2s)                               | Airy, ethereal — needs space |
| glass      | reverb (1.5s) + chorus                               | Crystalline shimmer — chorus adds sparkle |
| retro      | chorus + delay                                       | Analog warmth — chorus widens, delay echoes |
| industrial | distortion                                           | Metallic grit — distortion adds bite |
| organic    | reverb (short room, 0.4s)                            | Natural warmth — subtle room ambience |
| soft       | reverb (medium warm, 0.8s)                           | Gentle presence — warm reverb body |
| arcade     | (dry)                                                | Chiptune — dry is authentic |
| minimal    | (dry)                                                | Pure — no processing |
| crisp      | (dry)                                                | Precise — dry keeps transients sharp |

### Hero Sounds with Effects

Hero sounds (`hero.complete`, `hero.milestone`) are hand-crafted per pack. Packs with effects
route their hero synthesizers through the same effects chain via the `heroWithEffects()` helper,
which creates the chain per-playback and cleans up on stop.

---

## Built-in Sound Packs (9 total)

| Pack       | Character                                                 |
| ---------- | --------------------------------------------------------- |
| soft       | Warm, rounded, gentle - felt mallets on soft pads         |
| aero       | Airy, breathy, ethereal - wind through chimes _(default)_ |
| arcade     | 8-bit chiptune - square waves, punchy                     |
| organic    | Natural, warm, wooden - marimba, wood blocks              |
| glass      | Crystalline, bright - struck glass or bells               |
| industrial | Metallic, harsh, mechanical - machines and metal          |
| minimal    | Clean, sparse, understated - pure tones only              |
| retro      | Analog synth - vintage synthesizers                       |
| crisp      | Sharp, defined, precise - high-quality headphones         |

---

## Tune Types

| Type     | Description                   | Example Roles                                                                                 |
| -------- | ----------------------------- | --------------------------------------------------------------------------------------------- |
| click    | Short percussive transient    | interaction.tap, interaction.subtle, interaction.confirm                                      |
| pop      | Brief tonal burst with attack | navigation.tab                                                                                |
| toggle   | Noise click + tonal tail      | interaction.toggle                                                                            |
| tick     | Ultra-short soft transient    | Extended sounds (micro-interactions)                                                          |
| sweep    | Frequency glide (up/down)     | navigation.forward, navigation.backward                                                       |
| chime    | Resonant tonal with decay     | notification.info                                                                             |
| arpeggio | Sequence of notes             | notification.success, notification.warning, notification.error, hero.complete, hero.milestone |
| chord    | Multiple simultaneous notes   | Custom                                                                                        |
| burst    | Noise-based texture           | Extended sounds                                                                               |
| pulse    | Repeating pattern             | Extended sounds                                                                               |
| rise     | Pitch ascends                 | overlay.open, overlay.expand                                                                  |
| drop     | Pitch descends                | overlay.close, overlay.collapse                                                               |
| wobble   | Modulated sound               | Extended sounds                                                                               |

---

## Instrument Properties (FeelParams)

```ts
interface InstrumentConfig {
	filterFreq: number; // Filter cutoff frequency (1500-6000 Hz)
	q: number; // Filter resonance (1-12)
	oscType: OscillatorType; // "sine" | "square" | "sawtooth" | "triangle"
	decayMult: number; // Decay time multiplier (0.5-1.5)
	gainMult: number; // Volume multiplier (0.4-1.2)
	pitchMult: number; // Pitch multiplier (0.7-1.8)
	effects?: EffectDefinition[]; // Optional effects chain
}
```

### Example Instrument Settings

| Pack       | filterFreq | q   | oscType  | decayMult | gainMult | pitchMult | effects                  |
| ---------- | ---------- | --- | -------- | --------- | -------- | --------- | ------------------------ |
| soft       | 2000       | 1   | sine     | 1.5       | 0.7      | 0.8       | reverb (warm)            |
| aero       | 3500       | 2   | sine     | 1.0       | 0.9      | 1.0       | reverb (long)            |
| arcade     | 4000       | 8   | square   | 0.5       | 1.0      | 1.5       | (none)                   |
| organic    | 2500       | 3   | triangle | 1.3       | 0.85     | 0.9       | reverb (room)            |
| glass      | 6000       | 10  | sine     | 1.2       | 0.75     | 1.8       | reverb + chorus          |
| industrial | 3000       | 12  | sawtooth | 0.6       | 1.2      | 0.7       | distortion               |
| minimal    | 2000       | 1   | sine     | 0.8       | 0.4      | 1.0       | (none)                   |
| retro      | 1500       | 2   | square   | 1.1       | 0.8      | 0.85      | chorus + delay           |
| crisp      | 5500       | 4   | triangle | 0.6       | 1.0      | 1.1       | (none)                   |

---

## Sound Design Principles Applied

All packs comply with the rules in the `generating-sounds-with-ai` skill:

- **`context-reuse-single`** - all packs use the shared `getAudioContext()` singleton
- **`context-resume-suspended`** - engine checks `ctx.state` before each play
- **`context-cleanup-nodes`** - `onended` disconnects every node, including effects chain nodes
- **`envelope-exponential-decay`** - `exponentialRampToValueAtTime` throughout
- **`envelope-no-zero-target`** - all ramps target `0.001`, never `0`
- **`envelope-set-initial-value`** - `setValueAtTime` before every ramp
- **`design-noise-for-percussion`** - all click/tap sounds use white noise + filter
- **`design-oscillator-for-tonal`** - all tonal sounds use oscillators with moving pitch
- **`design-filter-for-character`** - bandpass applied to all noise sources
- **`param-click-duration`** - click sounds are 5–15 ms
- **`param-filter-frequency-range`** - bandpass clicks use 2.8–4 kHz
- **`param-reasonable-gain`** - no gain exceeds 1.0
- **`param-q-value-range`** - click filter Q is 1.2–4

---

## Switching Packs

```js
// sensory.config.js
module.exports = {
	theme: "aero", // See available packs below
	// ...
};
```

Available pack names: `"soft"`, `"aero"`, `"arcade"`, `"organic"`, `"glass"`, `"industrial"`, `"minimal"`, `"retro"`, `"crisp"`

Or at runtime via the provider:

```tsx
<SensoryUIProvider config={{ theme: "organic" }}>{children}</SensoryUIProvider>
```

---

## Creating a Custom Pack

### Option 1: Define a New Instrument

```ts
// sounds/core/instruments.ts
const MY_CUSTOM_INSTRUMENT: InstrumentConfig = {
	filterFreq: 4000,
	q: 5,
	oscType: "triangle",
	decayMult: 1.0,
	gainMult: 0.85,
	pitchMult: 1.1,
	effects: [
		{ type: "reverb", options: { duration: 1.0, decay: 2.0, mix: 0.2 } },
	],
};
```

Then generate the pack:

```ts
import { generateSoundPack } from "./core/factory";
import { INSTRUMENTS } from "./core/instruments";

// Add to INSTRUMENTS map, then:
export const myPack = generateSoundPack(MY_CUSTOM_INSTRUMENT);
// myPack covers all 17 roles: interaction.*, overlay.*, navigation.*, notification.*, hero.*
```

### Option 2: Modify Existing Pack

Create a variant by adjusting key parameters:

```ts
import { INSTRUMENTS } from "./core/instruments";
import { generateSoundPack } from "./core/factory";

const myInstrument = {
	...INSTRUMENTS.glass,
	gainMult: 0.6, // Quieter
	pitchMult: 2.0, // Higher pitched
	effects: [
		{ type: "reverb", options: { duration: 2.0, mix: 0.4 } },
	],
};

export const myPack = generateSoundPack(myInstrument);
```

See `sounds/README.md` for more details.
