# sensory-ui Sound Modules

Sounds in sensory-ui are **synthesized programmatically using the Web Audio API**. There are no
audio files to download, no `public/sounds/` directory, and no base64 blobs. Every sound is a
`SoundSynthesizer` function that runs directly in the browser.

> Credit & reference: [Generating Sounds with AI](https://www.userinterface.wiki/generating-sounds-with-ai)
> — the synthesis patterns used here are drawn directly from that guide.

---

## Architecture: Tunes + Instruments = SoundPacks

sensory-ui uses an **instrument-based sound architecture** that separates:

1. **Tunes** — Define the musical content (frequencies, durations, patterns, contours)
2. **Instruments** — Define the synthesis technique (waveforms, filters, envelopes, timbres)
3. **Factory** — Combines a tune with an instrument to produce a playable sound

This separation allows the **same tunes to be played by different instruments**, creating
distinct soundpack characters with minimal code duplication.

```
sounds/
  core/
    tunes.ts          ← Musical definitions for all roles
    instruments.ts    ← Synthesis configurations (soft, glass, industrial, etc.)
    factory.ts        ← Combines tunes + instruments → synthesizers
    pack-generator.ts ← Generates complete packs from instruments
  packs.ts            ← All instrument-based packs
  activation.ts       ← Original hand-crafted activation sounds
  navigation.ts       ← Original hand-crafted navigation sounds
  ...
```

---

## Built-in Sound Packs

### Original Hand-Crafted Packs

| Pack      | File                     | Character                                    |
| --------- | ------------------------ | -------------------------------------------- |
| `default` | Per-category files below | Clean, modern, minimal — general SaaS        |
| `arcade`  | `arcade.ts`              | 8-bit chiptune square-wave sounds            |
| `wind`    | `wind.ts`                | Airy, organic filtered-noise + wind chimes   |
| `retro`   | `retro.ts`               | Synthwave / analog sawtooth, slightly gritty |

### Instrument-Based Packs (New)

These packs use the tune/instrument system for consistent, expandable sounds:

| Pack         | Instrument | Character                                          |
| ------------ | ---------- | -------------------------------------------------- |
| `soft`       | Soft       | Warm, rounded, gentle — like felt mallets on pads  |
| `aero`       | Aero       | Airy, breathy, ethereal — wind through chimes      |
| `arcadeGen`  | Arcade     | 8-bit chiptune (generated) — square waves          |
| `organic`    | Organic    | Natural, warm, wooden — marimba, wood blocks       |
| `glass`      | Glass      | Crystalline, bright, resonant — struck glass/bells |
| `industrial` | Industrial | Metallic, harsh, mechanical — machines and metal   |
| `minimal`    | Minimal    | Clean, sparse, understated — pure tones only       |
| `retroGen`   | Retro      | Analog synth (generated) — vintage synthesizers    |
| `crisp`      | Crisp      | Sharp, defined, precise — high-quality headphones  |

---

## Tune Types

Each sound role is defined by a tune with one of these types:

| Type       | Description                   | Example Roles                         |
| ---------- | ----------------------------- | ------------------------------------- |
| `click`    | Short percussive transient    | activation.primary, activation.subtle |
| `pop`      | Brief tonal burst with attack | Extended sounds                       |
| `toggle`   | State change indicator        | navigation.switch                     |
| `tick`     | Subtle micro-interaction      | navigation.scroll, system.focus       |
| `sweep`    | Frequency glide (up/down)     | navigation.forward/backward           |
| `chime`    | Resonant tonal with decay     | notifications.passive/important       |
| `arpeggio` | Sequence of notes             | hero.complete, hero.milestone         |
| `chord`    | Multiple simultaneous notes   | Custom                                |
| `burst`    | Noise-based texture           | Extended sounds                       |
| `pulse`    | Repeating pattern             | notifications.warning                 |
| `rise`     | Pitch ascends                 | activation.confirm, system.open       |
| `drop`     | Pitch descends                | activation.error, system.close        |
| `wobble`   | Modulated sound               | Extended sounds                       |

---

## Instrument Properties

Each instrument defines synthesis characteristics:

| Property           | Description                                       |
| ------------------ | ------------------------------------------------- |
| `waveform`         | Oscillator type: sine, square, sawtooth, triangle |
| `useNoise`         | Whether to use noise for percussive sounds        |
| `noiseType`        | white, pink, or brown noise                       |
| `filterType`       | lowpass, highpass, bandpass, etc.                 |
| `filterResonance`  | Q multiplier for filters                          |
| `detune`           | Cents of detuning for chorus effect               |
| `attackMultiplier` | Attack time scaling                               |
| `decayMultiplier`  | Decay time scaling                                |
| `harmonicStrength` | How prominent harmonics are                       |
| `volumeScale`      | Overall volume adjustment                         |
| `subOscLevel`      | Sub-oscillator mix level                          |

---

## Sound Design Rules

All synthesizers follow these rules (see skill: `generating-sounds-with-ai`):

| Rule                           | What it means                                                 |
| ------------------------------ | ------------------------------------------------------------- |
| `context-reuse-single`         | All synthesizers use the shared `getAudioContext()` singleton |
| `context-cleanup-nodes`        | Every `onended` callback disconnects all nodes                |
| `envelope-exponential-decay`   | `exponentialRampToValueAtTime`, never `linearRamp`            |
| `envelope-no-zero-target`      | Target `0.001`, never `0`                                     |
| `envelope-set-initial-value`   | `setValueAtTime` before every ramp                            |
| `design-noise-for-percussion`  | Clicks/taps use filtered noise buffers                        |
| `design-oscillator-for-tonal`  | Tonal sounds use oscillators with pitch movement              |
| `design-filter-for-character`  | Bandpass filter applied to all noise-based sounds             |
| `param-click-duration`         | Click sounds are 5–15 ms                                      |
| `param-filter-frequency-range` | Bandpass for clicks: 3 000–6 000 Hz                           |
| `param-reasonable-gain`        | Gain values never exceed 1.0                                  |
| `param-q-value-range`          | Filter Q for clicks: 2–5                                      |

---

## Custom Overrides

You can still point individual roles to a traditional file URL or base64 string via
`sensory.config.js`. These bypass the synthesizers entirely.

```js
// sensory.config.js
overrides: {
  "activation.primary": "/sounds/custom/my-click.mp3",
}
```

---

## Adding a New Pack

### Method 1: Create a New Instrument (Recommended)

The easiest way to create a new pack is to define a new instrument:

```ts
// sounds/core/instruments.ts
export const MY_INSTRUMENT: InstrumentConfig = {
	waveform: "triangle",
	attackCurve: "exponential",
	decayCurve: "exponential",
	useNoise: true,
	noiseType: "pink",
	filterType: "bandpass",
	filterResonance: 2.0,
	detune: 3,
	stereoWidth: 0.4,
	attackMultiplier: 1.0,
	decayMultiplier: 1.2,
	harmonicStrength: 0.3,
	volumeScale: 0.85,
	subOscLevel: 0.1,
	subOscOctave: -1,
};
```

Then generate the pack:

```ts
// sounds/packs.ts
import { MY_INSTRUMENT } from "./core/instruments";
import { generateSoundPack } from "./core/pack-generator";

export const myPack = generateSoundPack(MY_INSTRUMENT);
```

### Method 2: Hand-Craft Individual Sounds

For complete control, create a full pack manually:

```ts
// sounds/my-pack.ts
import type { SoundRole } from "../config/sound-roles";
import type { SoundSynthesizer } from "../config/engine";

export const myPack: Record<SoundRole, SoundSynthesizer> = {
	"activation.primary": (ctx, opts) => {
		/* ... */
	},
	// ... all 19 roles
};
```

### Method 3: Mix and Match

Use `generateCustomSoundPack` to start with an instrument but override specific sounds:

```ts
import { generateCustomSoundPack } from "./core/pack-generator";
import { GLASS_INSTRUMENT } from "./core/instruments";

export const myPack = generateCustomSoundPack(GLASS_INSTRUMENT, {
	"hero.complete": { harmonicStrength: 0.8 }, // Override just hero sounds
});
```

---

## Custom Overrides

You can still point individual roles to a traditional file URL or base64 string via
`sensory.config.js`. These bypass the synthesizers entirely.

```js
// sensory.config.js
overrides: {
  "activation.primary": "/sounds/custom/my-click.mp3",
}
```

---

## Tips

- Keep sounds **short**: 50–300 ms for activation/system, up to 1.5 s for hero sounds.
- Use **exponential envelopes**: They sound more natural than linear.
- **Test with reduced motion**: Sounds should respect `prefers-reduced-motion`.
- **Balance volume**: Use the `volumeScale` property to ensure consistency across packs.
- **MP3 at 128 kbps** is plenty — the files are tiny and decoded into memory.
- Total budget: ≤ 50 KB per category, ≤ 15 KB per individual sound.
- Name them exactly as shown — the registry in `components/ui/sensory-ui/config/registry.ts` maps
  every SoundRole to the corresponding base64 data URI exported from these modules.
