# sensory-ui Sound Modules

Audio data is embedded as **base64-encoded TypeScript modules** in this folder.
Each file exports an object mapping `SoundRole` keys to `data:audio/mp3;base64,...` data URIs.
This eliminates the need for files in `public/sounds/` and keeps everything co-located with the library code.

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
- Name them exactly as shown — the registry in `components/ui/sensory-ui/registry.ts` maps
  every SoundRole to these exact paths.
