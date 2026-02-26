# sensory-ui — Sound Packs

> `components/ui/sensory-ui/sounds/`

Sound packs are sets of `SoundSynthesizer` functions that cover all 19 sound roles. Each pack has a
distinct character — swap between them by changing `theme` in `sensory.config.js`.

All packs generate audio **programmatically via the Web Audio API** — no audio files,
no base64 blobs, no network requests.

> Credit: synthesis patterns adapted from
> [Generating Sounds with AI — userinterface.wiki](https://www.userinterface.wiki/generating-sounds-with-ai)

---

## Architecture

```ts
// config/engine.ts
export type SoundSynthesizer = (ctx: AudioContext, options: PlaySoundOptions) => SoundPlayback;
export type SoundSource = SoundSynthesizer | string;

// config/registry.ts
export type SoundPackName = "default" | "arcade" | "wind" | "retro";
export type SoundPack = Record<SoundRole, SoundSource>;
export const packRegistry: Record<SoundPackName, SoundPack> = { ... };
```

When `playSound(role)` is called, the engine:

1. Calls `resolveRole(role, config)` which looks up `packRegistry[config.theme][role]`
2. If the result is a `SoundSynthesizer` → calls it directly with the AudioContext
3. If the result is a `string` (URL or base64) → decodes it via `decodeAudioData`

---

## Pack: `default`

**Character:** Clean, modern, minimal. The sounds a polished SaaS product would use.
Soft filtered-noise clicks for activation; gentle sine sweeps for navigation and system;
warm tonal chimes for notifications; ascending arpeggios for hero moments.

**Primary techniques:** filtered white noise (clicks), sine oscillator sweeps (tonal)

| Role                      | Design                                     | Duration |
| ------------------------- | ------------------------------------------ | -------- |
| `activation.primary`      | Bandpass filtered noise burst (4 kHz, Q=3) | 8 ms     |
| `activation.subtle`       | Same but softer (3.2 kHz, Q=2.5, 60% gain) | 6 ms     |
| `activation.confirm`      | Rising sine 400→600 Hz                     | 80 ms    |
| `activation.error`        | Descending sine 320→220 Hz + sub-harmonic  | 60 ms    |
| `navigation.forward`      | Sine sweep 280→420 Hz                      | 180 ms   |
| `navigation.backward`     | Sine sweep 420→280 Hz (mirror)             | 180 ms   |
| `navigation.switch`       | Triangle sweep 340→390 Hz                  | 130 ms   |
| `navigation.scroll`       | Tiny bandpass noise (2.8 kHz)              | 35 ms    |
| `notifications.passive`   | Soft sine 520 Hz                           | 260 ms   |
| `notifications.important` | Step-pitch sine 400→550 Hz                 | 360 ms   |
| `notifications.success`   | Rising sine + harmonic 480→720 Hz          | 300 ms   |
| `notifications.warning`   | Triangle 330 Hz with sustain swell         | 450 ms   |
| `system.open`             | Sine 300→450 Hz + octave partial           | 200 ms   |
| `system.close`            | Sine 450→300 Hz (tonal inverse)            | 200 ms   |
| `system.expand`           | Triangle 370→470 Hz                        | 150 ms   |
| `system.collapse`         | Triangle 470→370 Hz (mirror)               | 150 ms   |
| `system.focus`            | Pure sine 750 Hz, very quiet               | 90 ms    |
| `hero.complete`           | Ascending arpeggio C4→E4→G4→C5→E5          | ~1000 ms |
| `hero.milestone`          | Ascending arpeggio C4→E4→G4                | ~600 ms  |

---

## Pack: `arcade`

**Character:** Classic 8-bit chiptune. Square-wave oscillators, stepped pitch (no interpolation),
short punchy envelopes. Think NES, Game Boy, early arcade cabinets.

**Primary techniques:** square wave oscillators, `setValueAtTime` step modulation (no ramps)

| Role                      | Design                                  | Duration |
| ------------------------- | --------------------------------------- | -------- |
| `activation.primary`      | Square burst A5 (880 Hz)                | 40 ms    |
| `activation.subtle`       | Square burst 495 Hz, quieter            | 30 ms    |
| `activation.confirm`      | 3-step arpeggio C5→E5→G5                | 80 ms    |
| `activation.error`        | Step descent 440→330→220 Hz             | 70 ms    |
| `navigation.forward`      | Step chirp up 440→660→880 Hz            | 150 ms   |
| `navigation.backward`     | Step chirp down 880→660→440 Hz (mirror) | 150 ms   |
| `navigation.switch`       | Single square blip E5+offset            | 90 ms    |
| `navigation.scroll`       | Micro A5 blip, very quiet               | 45 ms    |
| `notifications.passive`   | Square tone 495 Hz                      | 200 ms   |
| `notifications.important` | Double beep A5 × 2                      | 300 ms   |
| `notifications.success`   | 5-step arpeggio C5→E5→G5→A5→C6          | 450 ms   |
| `notifications.warning`   | Descending alarm A5→G5→E5, ×2           | 500 ms   |
| `system.open`             | 4-step sweep up 330→495→660→990 Hz      | 200 ms   |
| `system.close`            | 4-step sweep down (mirror)              | 200 ms   |
| `system.expand`           | 2-step up 440→660 Hz                    | 100 ms   |
| `system.collapse`         | 2-step down 660→440 Hz                  | 100 ms   |
| `system.focus`            | Brief high blip A5                      | 60 ms    |
| `hero.complete`           | 8-note ascending fanfare C4→...→C6      | ~700 ms  |
| `hero.milestone`          | 4-note mini fanfare C5→E5→G5→C6         | ~400 ms  |

---

## Pack: `wind`

**Character:** Airy, organic, meditative. Every sound feels like air, breath, or a light tap on a
wind chime. Bandpass-filtered white noise with dynamic filter sweeps for activation/navigation;
wind-chime hybrids (sine tone + noise tap transient) for notifications and hero.

**Primary techniques:** bandpass filtered noise (sweeping & static), sine + noise chime hybrid

| Role                      | Design                                 | Duration |
| ------------------------- | -------------------------------------- | -------- |
| `activation.primary`      | Air puff: bandpass noise 900 Hz, Q=1.2 | 80 ms    |
| `activation.subtle`       | Smaller puff 700 Hz, Q=1.0             | 55 ms    |
| `activation.confirm`      | Rising filter sweep 400→1200 Hz        | 180 ms   |
| `activation.error`        | Double flutter burst 1600 Hz           | 120 ms   |
| `navigation.forward`      | Whoosh: filter 200→900 Hz              | 200 ms   |
| `navigation.backward`     | Whoosh: 900→200 Hz (mirror)            | 200 ms   |
| `navigation.switch`       | Soft swoosh static 500 Hz              | 140 ms   |
| `navigation.scroll`       | Tick: highpass burst 3 kHz             | 45 ms    |
| `notifications.passive`   | Single wind chime 800 Hz               | 300 ms   |
| `notifications.important` | Struck chime 1000 Hz, louder tap       | 400 ms   |
| `notifications.success`   | Two chimes in 5th: G4 + C5             | 380 ms   |
| `notifications.warning`   | Dissonant chime pair A4 + A#4          | 450 ms   |
| `system.open`             | Expanding noise + rising filter        | 200 ms   |
| `system.close`            | Contracting noise + falling filter     | 200 ms   |
| `system.expand`           | Puff 600 Hz static                     | 130 ms   |
| `system.collapse`         | Puff 600→400 Hz                        | 130 ms   |
| `system.focus`            | Breath: soft bandpass noise 2.2 kHz    | 80 ms    |
| `hero.complete`           | Wind chime sequence C4→E4→G4→C5→E5     | ~1100 ms |
| `hero.milestone`          | Two-chime resolve G4 + C5              | ~700 ms  |

---

## Pack: `retro`

**Character:** Synthwave / analog synthesizer. Warm sawtooth waves with slight detuning,
stacked oscillators for thickness, frequency glides, dissonant chords for warnings.
Think Moog, Oberheim, Kavinsky, CRT monitors.

**Primary techniques:** dual detuned sawtooth (±5–7 cents chorus), portamento glides,
minor/tritone chords for tension

| Role                      | Design                                     | Duration |
| ------------------------- | ------------------------------------------ | -------- |
| `activation.primary`      | Dual detuned saw 250 Hz                    | 45 ms    |
| `activation.subtle`       | Triangle 200 Hz, softer                    | 35 ms    |
| `activation.confirm`      | Dual saw glide 300→500 Hz                  | 90 ms    |
| `activation.error`        | Two-saw drop 400→200 Hz + 380→190 Hz       | 65 ms    |
| `navigation.forward`      | Dual saw 150→300 Hz                        | 180 ms   |
| `navigation.backward`     | Dual saw 300→150 Hz (mirror)               | 180 ms   |
| `navigation.switch`       | Triangle with vibrato 440→460→440 Hz       | 120 ms   |
| `navigation.scroll`       | Soft saw high 880 Hz                       | 50 ms    |
| `notifications.passive`   | C4+G4 triangle chord pad                   | 300 ms   |
| `notifications.important` | A minor chord A4+C5+E5 sawtooth            | 400 ms   |
| `notifications.success`   | Arpeggio C4→E4→G4→C5 sawtooth              | 400 ms   |
| `notifications.warning`   | Tritone chord F4+B4 sawtooth               | 500 ms   |
| `system.open`             | Portal open: dual saw 200→350 Hz           | 200 ms   |
| `system.close`            | Portal close: dual saw 350→200 Hz          | 200 ms   |
| `system.expand`           | Extend: dual saw 280→380 Hz                | 150 ms   |
| `system.collapse`         | Retract: dual saw 380→280 Hz               | 150 ms   |
| `system.focus`            | Neon ping: triangle 1000 Hz with FM wobble | 100 ms   |
| `hero.complete`           | 80s fanfare C4→...→G5, dual saw, 6 notes   | ~1100 ms |
| `hero.milestone`          | C major chord stab + C5→E5 tail            | ~700 ms  |

---

## Sound Design Principles Applied

All packs comply with the rules in the `generating-sounds-with-ai` skill:

- **`context-reuse-single`** — all packs use the shared `getAudioContext()` singleton
- **`context-resume-suspended`** — engine checks `ctx.state` before each play
- **`context-cleanup-nodes`** — `onended` disconnects every node
- **`envelope-exponential-decay`** — `exponentialRampToValueAtTime` throughout
- **`envelope-no-zero-target`** — all ramps target `0.001`, never `0`
- **`envelope-set-initial-value`** — `setValueAtTime` before every ramp
- **`design-noise-for-percussion`** — all click/tap sounds use white noise + filter
- **`design-oscillator-for-tonal`** — all tonal sounds use oscillators with moving pitch
- **`design-filter-for-character`** — bandpass applied to all noise sources
- **`param-click-duration`** — click sounds are 5–15 ms
- **`param-filter-frequency-range`** — bandpass clicks use 2.8–4 kHz
- **`param-reasonable-gain`** — no gain exceeds 1.0
- **`param-q-value-range`** — click filter Q is 1.2–3

---

## Switching Packs

```js
// sensory.config.js
module.exports = {
	theme: "arcade", // "default" | "arcade" | "wind" | "retro"
	// ...
};
```

Or at runtime via the provider:

```tsx
<SensoryUIProvider config={{ theme: "wind" }}>{children}</SensoryUIProvider>
```

---

## Adding a Custom Pack

See `sounds/README.md` for the step-by-step process.
