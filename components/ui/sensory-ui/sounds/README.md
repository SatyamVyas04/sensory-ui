# sensory-ui Sound Modules

Sounds in sensory-ui are **synthesized programmatically using the Web Audio API**. There are no
audio files to download, no `public/sounds/` directory, and no base64 blobs. Every sound is a
`SoundSynthesizer` function that runs directly in the browser.

> Credit & reference: [Generating Sounds with AI](https://www.userinterface.wiki/generating-sounds-with-ai)
>
> - the synthesis patterns used here are drawn directly from that guide.

---

## Architecture: Tunes + Instruments = SoundPacks

sensory-ui uses an **instrument-based sound architecture** that separates:

1. **Tunes** - Define the musical content (frequencies, durations, patterns, contours)
2. **Instruments** - Define the synthesis technique (waveforms, filters, envelopes, timbres)
3. **Factory** - Combines a tune with an instrument to produce a playable sound

This separation allows the **same tunes to be played by different instruments**, creating
distinct soundpack characters with minimal code duplication.

```
sounds/
  core/
    tunes.ts          ← Musical definitions for all roles
    instruments.ts    ← Synthesis configurations (soft, glass, industrial, etc.)
    factory.ts        ← Combines tunes + instruments → synthesizers
    pack-generator.ts ← Generates complete packs from instruments
    index.ts          ← Re-exports core modules
  packs.ts            ← All 9 instrument-based packs
  index.ts            ← Main entry point
  README.md           ← This file
```

---

## Built-in Sound Packs

All 9 packs use the instrument-based system for consistent, expandable sounds:

| Pack         | Character                                          | Default |
| ------------ | -------------------------------------------------- | ------- |
| `soft`       | Warm, rounded, gentle - like felt mallets on pads  |         |
| `aero`       | Airy, breathy, ethereal - wind through chimes      | ✓       |
| `arcade`     | 8-bit chiptune - square waves, punchy              |         |
| `organic`    | Natural, warm, wooden - marimba, wood blocks       |         |
| `glass`      | Crystalline, bright, resonant - struck glass/bells |         |
| `industrial` | Metallic, harsh, mechanical - machines and metal   |         |
| `minimal`    | Clean, sparse, understated - pure tones only       |         |
| `retro`      | Analog synth - warm square waves, vintage          |         |
| `crisp`      | Sharp, defined, precise - high-quality headphones  |         |

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
| `chime`    | Resonant tonal with decay     | notifications.passive/info            |
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

| Property     | Description                                                       |
| ------------ | ----------------------------------------------------------------- |
| `oscType`    | Oscillator type: `'sine'`, `'square'`, `'sawtooth'`, `'triangle'` |
| `filterFreq` | Base filter cutoff frequency in Hz                                |
| `q`          | Filter Q / resonance factor                                       |
| `decayMult`  | Multiplier applied to the base decay time from the tune           |
| `gainMult`   | Overall gain (loudness) multiplier for this instrument            |
| `pitchMult`  | Multiplies the base pitch (for transposition / octave shifting)   |

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

## Adding a New Pack

### Method 1: Create a New Instrument (Recommended)

The easiest way to create a new pack is to define a new instrument:

```ts
// sounds/core/instruments.ts
export const MY_INSTRUMENT: InstrumentConfig = {
	oscType: "triangle",
	filterFreq: 3000,
	q: 2,
	decayMult: 1.2,
	gainMult: 0.85,
	pitchMult: 1.0,
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
	"hero.complete": { gainMult: 1.2 }, // Override just hero sounds
});
```

---

## Custom Overrides

You can point individual roles to a traditional file URL or base64 string via
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
- All sounds are synthesized at runtime - zero network requests, zero audio files needed.
