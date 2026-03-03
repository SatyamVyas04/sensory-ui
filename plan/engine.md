# sensory-ui - Sound Engine

> `components/ui/sensory-ui/config/engine.ts`

The sound engine is the single runtime module responsible for decoding audio data and scheduling playback via the Web Audio API. It is the lowest layer of sensory-ui and has no dependency on React.

---

## Why Web Audio API (Not `new Audio()`)

The original design considered `new Audio()` (HTMLAudioElement) for simplicity and small footprint. The Web Audio API is preferred instead for these reasons:

| Concern          | `new Audio()`                         | Web Audio API                          |
| ---------------- | ------------------------------------- | -------------------------------------- |
| Latency          | High (50–200 ms depending on browser) | Very low (< 10 ms with decoded buffer) |
| Buffer reuse     | Impossible - new decode each play     | Buffer decoded once, reused ∞          |
| Volume control   | `.volume` property only               | Gain node - precise and composable     |
| Playback rate    | Limited                               | `BufferSourceNode.playbackRate`        |
| Concurrent plays | Unreliable                            | Clean - new source node per play       |
| SSR safety       | Needs guard                           | Needs guard (same)                     |

The engine uses a **lazy singleton AudioContext** and an **in-memory decoded buffer cache**. This means the first play of a sound pays the decode cost; every subsequent play is near-instant.

---

## Engine Architecture

```
playSound(role, options)
       │
       ▼
resolveRole(role)          ← reads packRegistry[theme] + config overrides
       │
       ├── SoundSynthesizer? ──▶ call synthesizer(ctx, options) directly
       │                         returns SoundPlayback immediately
       │
       └── string (URL)?  ──▶ getAudioContext()
                                    │
                                    ▼
                               decodeAudioData(source)    ← base64 decode or fetch + cache
                                    │
                                    ▼
                               createBufferSource()
                               createGain()
                                 source → gain → destination
                                 source.start(0)
       │
       ▼
return SoundPlayback { stop() }
```

### SoundSynthesizer - Programmatic Audio Generation

The preferred audio source in sensory-ui is a **`SoundSynthesizer`** function:

```ts
export type SoundSynthesizer = (
	ctx: AudioContext,
	options: PlaySoundOptions,
) => SoundPlayback;
export type SoundSource = SoundSynthesizer | string;
```

Synthesizers generate sound at call time using the Web Audio API - no decode step,
no cache hit needed, near-zero latency. This approach:

- Eliminates base64 blobs from the codebase
- Enables rich pack-to-pack variation (noise, oscillator, FM, etc.)
- Is fully SSR-safe (synthesizers only run in the browser, gated by the provider)
- Follows the rules in the `generating-sounds-with-ai` skill

String sources (URLs, base64 data URIs) are still supported via `decodeAudioData`
for custom user overrides.

---

## Full Engine Implementation Spec

```ts
// components/ui/sensory-ui/config/engine.ts

let audioContext: AudioContext | null = null;
const bufferCache = new Map<string, AudioBuffer>();

/** Tracks the most recently started playback so rapid re-triggers cancel
 *  the previous sound, preventing overlapping audio when users spam-click.
 *  Cleared automatically when a sound ends naturally. */
let activePlayback: SoundPlayback | null = null;

/**
 * Lazy singleton AudioContext.
 * Never instantiated during SSR - caller must guard with typeof window check.
 */
export function getAudioContext(): AudioContext {
	if (!audioContext) {
		audioContext = new AudioContext();
	}
	return audioContext;
}

/**
 * Decode a base64 data URI into an AudioBuffer.
 * Used when sounds are embedded as base64-encoded TS modules.
 */
async function decodeBase64DataUri(dataUri: string): Promise<AudioBuffer> {
	const cached = bufferCache.get(dataUri);
	if (cached) return cached;

	const ctx = getAudioContext();
	const base64 = dataUri.split(",")[1];
	if (!base64) throw new Error("[sensory-ui] Invalid data URI");

	const binaryString = atob(base64);
	const bytes = new Uint8Array(binaryString.length);
	for (let i = 0; i < binaryString.length; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}

	const audioBuffer = await ctx.decodeAudioData(bytes.buffer.slice(0));
	bufferCache.set(dataUri, audioBuffer);
	return audioBuffer;
}

/**
 * Fetch and decode an audio source into an AudioBuffer.
 * Accepts both regular URLs and base64 data URIs.
 * Results are cached by source string so each is decoded only once.
 */
export async function decodeAudioData(source: string): Promise<AudioBuffer> {
	// Handle base64 data URIs directly - no network fetch needed
	if (source.startsWith("data:")) {
		return decodeBase64DataUri(source);
	}

	// Regular URL path (e.g. user override pointing to /sounds/custom/...)
	const cached = bufferCache.get(source);
	if (cached) return cached;

	const ctx = getAudioContext();
	const response = await fetch(source);
	const arrayBuffer = await response.arrayBuffer();
	const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

	bufferCache.set(source, audioBuffer);
	return audioBuffer;
}

export interface PlaySoundOptions {
	/** 0–1. Multiplied with the global master volume from config. */
	volume?: number;
	/** Default 1.0. Values > 1 speed up, < 1 slow down. */
	playbackRate?: number;
	/** Called when the sound finishes playing naturally. */
	onEnd?: () => void;
}

export interface SoundPlayback {
	/** Imperatively stop a playing sound before it ends. */
	stop: () => void;
}

/**
 * Core playback function.
 * Accepts either a SoundSynthesizer function (called directly with the
 * AudioContext) or a string audio source (base64 data URI or URL, decoded
 * and cached via decodeAudioData).
 *
 * @param source  - Resolved audio source - SoundSynthesizer or string
 * @param options - Volume, playback rate, onEnd callback
 */
export async function playSound(
	source: SoundSource,
	options: PlaySoundOptions = {},
): Promise<SoundPlayback> {
	const { volume = 1, playbackRate = 1, onEnd } = options;

	const ctx = getAudioContext();

	// Resume in case the context was suspended by browser autoplay policy.
	if (ctx.state === "suspended") {
		await ctx.resume();
	}

	// Cancel the previously playing sound to prevent overlapping audio.
	if (activePlayback) {
		try { activePlayback.stop(); } catch { /* ok */ }
		activePlayback = null;
	}

	// If the source is a synthesizer function, call it directly - no decode step.
	if (typeof source === "function") {
		const playback = source(ctx, {
			volume,
			playbackRate,
			onEnd: () => {
				if (activePlayback === playback) activePlayback = null;
				onEnd?.();
			},
		});
		activePlayback = playback;
		return playback;
	}

	const buffer = await decodeAudioData(source);
	const bufferSource = ctx.createBufferSource();
	const gain = ctx.createGain();

	bufferSource.buffer = buffer;
	bufferSource.playbackRate.value = playbackRate;
	gain.gain.value = Math.max(0, Math.min(1, volume));

	bufferSource.connect(gain);
	gain.connect(ctx.destination);

	bufferSource.onended = () => {
		if (activePlayback === playback) activePlayback = null;
		onEnd?.();
	};

	bufferSource.start(0);

	const playback: SoundPlayback = {
		stop: () => {
			try {
				bufferSource.stop();
			} catch {
				// No-op if already stopped or never started.
			}
		},
	};

	activePlayback = playback;
	return playback;
}

/**
 * Clear the decoded buffer cache.
 * Useful if the user switches sound packs at runtime.
 */
export function clearBufferCache(): void {
	bufferCache.clear();
}

/**
 * Soft-close the AudioContext.
 * Call only when you are certain no more sounds will be played
 * (e.g., during hot-module replacement in development).
 */
export async function closeAudioContext(): Promise<void> {
	if (audioContext) {
		await audioContext.close();
		audioContext = null;
	}
}
```

---

## SSR Safety Rules

The engine **must never** be called during server-side rendering. All entry points to the engine (the provider, primitive components, hooks) must check:

```ts
if (typeof window === "undefined") return;
```

This check is cheap and must be the **first line** in any function that could touch `AudioContext`, `fetch`, or `atob`.

---

## Browser Autoplay Policy

Modern browsers require a user gesture before an `AudioContext` can produce audio. The engine handles this by calling `ctx.resume()` before every playback attempt if `ctx.state === "suspended"`. This means:

- The very first sound will play correctly as long as it is triggered from a user interaction (click, keydown, pointer event).
- Sounds triggered programmatically without a user gesture (e.g., on mount with `useEffect`) will be silently blocked by the browser. This is by design - sensory-ui sounds are only meant to fire from real interactions.

---

## Volume Calculation

Final playback volume is calculated as:

```
finalVolume = masterVolume (from config) × roleVolume (per-role multiplier, v1.5+) × localVolume (from sound prop)
```

In v1.0, only the master volume from `sensory.config.js` and the optional per-call `volume` option are used.

---

## Buffer Cache Behaviour

- The cache key is the audio source string - either a base64 data URI or a URL.
- Built-in sounds use the full data URI as the cache key.
- If a user overrides a role to a custom URL in `sensory.config.js`, the URL becomes the cache key, so the original and overridden sounds can both be cached simultaneously without collision.
- The cache is never automatically invalidated in production. `clearBufferCache()` is available for development tooling or runtime pack switches.

---

## What the Engine Does NOT Do

- Does not preload or prefetch any audio on mount
- Does not manage a global `AudioContext` exposed outside the module
- Does not create any long-lived nodes (no master gain bus, no reverb node)
- Does not trigger any React state updates
- Does not read from `sensory.config.js` directly - config resolution is handled by the caller (the provider or hook), which passes the final volume and resolved URL into the engine

---

## Engine Size Budget

The engine must stay under **3 KB minified + gzipped**. The implementation above is well within that budget. If Web Audio API wrappers or fallback paths are added, they must be tree-shakeable.

---

## Future: Offline / Inlined Audio

As of v1.0, audio data is already embedded as base64 data URIs in TypeScript modules
(`sounds/*.ts`). The engine decodes these directly without any network fetch, so sounds
work fully offline and load near-instantly. This replaces the previously planned
`public/sounds/` fetch-based approach.
