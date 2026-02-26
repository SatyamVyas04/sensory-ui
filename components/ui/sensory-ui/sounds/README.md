# sensory-ui Sound Modules

Sounds in sensory-ui are **synthesized programmatically using the Web Audio API**. There are no
audio files to download, no `public/sounds/` directory, and no base64 blobs. Every sound is a
`SoundSynthesizer` function that runs directly in the browser.

> Credit & reference: [Generating Sounds with AI](https://www.userinterface.wiki/generating-sounds-with-ai)
> — the synthesis patterns used here are drawn directly from that guide.

---

## Built-in Sound Packs

Four packs ship out of the box. Switch between them by setting `theme` in `sensory.config.js`.

| Pack      | File                     | Character                                    |
| --------- | ------------------------ | -------------------------------------------- |
| `default` | Per-category files below | Clean, modern, minimal — general SaaS        |
| `arcade`  | `arcade.ts`              | 8-bit chiptune square-wave sounds            |
| `wind`    | `wind.ts`                | Airy, organic filtered-noise + wind chimes   |
| `retro`   | `retro.ts`               | Synthwave / analog sawtooth, slightly gritty |

---

## Default Pack Structure

The default pack is split across per-category files:

```
sounds/
  activation.ts      ← activation.* roles  (4 sounds)
  navigation.ts      ← navigation.* roles  (4 sounds)
  notifications.ts   ← notifications.* roles (4 sounds)
  system.ts          ← system.* roles      (5 sounds)
  hero.ts            ← hero.* roles        (2 sounds)
```

Each file exports a `Record<Role, SoundSynthesizer>`. A `SoundSynthesizer` is:

```ts
type SoundSynthesizer = (
	ctx: AudioContext,
	options: PlaySoundOptions,
) => SoundPlayback;
```

The synthesizer receives the shared `AudioContext` singleton and playback options, starts the
sound immediately, and returns a `{ stop() }` handle.

---

## Additional Packs

`arcade.ts`, `wind.ts`, and `retro.ts` each export a complete `Record<SoundRole, SoundSynthesizer>`
covering all 19 roles. They are imported by `config/registry.ts` and stored in `packRegistry`.

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

1. Create `sounds/my-pack.ts` exporting `const myPack: Record<SoundRole, SoundSynthesizer> = { ... }`
2. Import `myPack` in `config/registry.ts` and add it to `packRegistry`
3. Add `"my-pack"` to the `SoundPackName` union in `config/registry.ts`
4. Set `theme: "my-pack"` in `sensory.config.js`

## Module structure

```
sounds/
  activation.ts     ← activation.* role audio data
  navigation.ts     ← navigation.* role audio data
  notifications.ts  ← notifications.* role audio data
  system.ts         ← system.* role audio data
  hero.ts           ← hero.* role audio data
```

Each module looks like:

```ts
export const activation = {
	"activation.primary": "data:audio/mp3;base64,//uQx...",
	"activation.subtle": "data:audio/mp3;base64,//uQx...",
	// ...
};
```

The `registry.ts` config file imports and spreads all modules into a single
`roleRegistry` record at build time that the engine resolves at runtime.

## How to add real audio data

1. Export your MP3 file (short, quiet, 128 kbps, mono, ≤ 15 KB per file)
2. Convert to base64: `base64 -i sound.mp3` (macOS) or `certutil -encode sound.mp3 out.b64` (Windows)
3. Wrap as a data URI: `data:audio/mp3;base64,<base64-string>`
4. Paste into the corresponding field in the module file

## Custom overrides

Users can still point individual roles to traditional file URLs by setting
overrides in `sensory.config.js`. Those bypass these base64 modules entirely
and fetch from the given path (e.g. `/sounds/custom/my-click.mp3` in `public/`).

## Where to get free UI sounds

| Source                                                   | Notes                                                                  |
| -------------------------------------------------------- | ---------------------------------------------------------------------- |
| [Freesound.org](https://freesound.org)                   | Search "UI click", "interface", "notification" — filter by CC0 licence |
| [Mixkit](https://mixkit.co/free-sound-effects/ui/)       | Ready-made UI pack, free for commercial use                            |
| [Zapsplat](https://www.zapsplat.com)                     | Free with account; huge UI/UX category                                 |
| [UI Sounds by Kenney](https://kenney.nl/assets/ui-audio) | CC0, compact pack, good for defaults                                   |

## Tips

- Keep files **short**: 50–300 ms for activation/system, up to 1 s for hero sounds.
- Keep files **quiet at source**: the engine applies its own volume multiplier (0.35 by default).
- **MP3 at 128 kbps** is plenty — the files are tiny and decoded into memory.
- Total budget: ≤ 50 KB per category, ≤ 15 KB per individual sound.
- Name them exactly as shown — the registry in `components/ui/sensory-ui/config/registry.ts` maps
  every SoundRole to the corresponding base64 data URI exported from these modules.
