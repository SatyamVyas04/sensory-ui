# sensory-ui — Sound Engine

> `components/ui/sensory-ui/engine.ts`

The sound engine is the single runtime module responsible for decoding audio data and scheduling playback via the Web Audio API. It is the lowest layer of sensory-ui and has no dependency on React.

---

## Why Web Audio API (Not `new Audio()`)

The original design considered `new Audio()` (HTMLAudioElement) for simplicity and small footprint. The Web Audio API is preferred instead for these reasons:

| Concern          | `new Audio()`                         | Web Audio API                          |
| ---------------- | ------------------------------------- | -------------------------------------- |
| Latency          | High (50–200 ms depending on browser) | Very low (< 10 ms with decoded buffer) |
| Buffer reuse     | Impossible — new decode each play     | Buffer decoded once, reused ∞          |
| Volume control   | `.volume` property only               | Gain node — precise and composable     |
| Playback rate    | Limited                               | `BufferSourceNode.playbackRate`        |
| Concurrent plays | Unreliable                            | Clean — new source node per play       |
| SSR safety       | Needs guard                           | Needs guard (same)                     |

The engine uses a **lazy singleton AudioContext** and an **in-memory decoded buffer cache**. This means the first play of a sound pays the decode cost; every subsequent play is near-instant.

---

## Engine Architecture

```
playSound(role, options)
       │
       ▼
resolveRole(role)          ← reads registry + config overrides
       │
       ▼
getAudioContext()          ← lazy singleton, one per page lifetime
       │
       ▼
decodeAudioData(url)       ← fetch + decode, or return from cache
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

---

## Full Engine Implementation Spec

```ts
// components/ui/sensory-ui/engine.ts

let audioContext: AudioContext | null = null;
const bufferCache = new Map<string, AudioBuffer>();

/**
 * Lazy singleton AudioContext.
 * Never instantiated during SSR — caller must guard with typeof window check.
 */
export function getAudioContext(): AudioContext {
	if (!audioContext) {
		audioContext = new AudioContext();
	}
	return audioContext;
}

/**
 * Fetch and decode an audio file URL into an AudioBuffer.
 * Results are cached by URL so each file is decoded only once.
 */
export async function decodeAudioData(url: string): Promise<AudioBuffer> {
	const cached = bufferCache.get(url);
	if (cached) return cached;

	const ctx = getAudioContext();
	const response = await fetch(url);
	const arrayBuffer = await response.arrayBuffer();
	const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

	bufferCache.set(url, audioBuffer);
	return audioBuffer;
}

/**
 * Alternative: decode from a base64 data URI.
 * Useful if sounds are ever inlined at build time.
 */
export async function decodeAudioDataFromUri(
	dataUri: string,
): Promise<AudioBuffer> {
	const cached = bufferCache.get(dataUri);
	if (cached) return cached;

	const ctx = getAudioContext();
	const base64 = dataUri.split(",")[1];
	const binaryString = atob(base64);
	const bytes = new Uint8Array(binaryString.length);
	for (let i = 0; i < binaryString.length; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}

	const audioBuffer = await ctx.decodeAudioData(bytes.buffer.slice(0));
	bufferCache.set(dataUri, audioBuffer);
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
 * Resolves the file path for a role, decodes it (or reads from cache),
 * creates a buffer source + gain node, and starts playback.
 *
 * @param url     - Resolved file path (already looked up from registry + config)
 * @param options - Volume, playback rate, onEnd callback
 */
export async function playSound(
	url: string,
	options: PlaySoundOptions = {},
): Promise<SoundPlayback> {
	const { volume = 1, playbackRate = 1, onEnd } = options;

	const ctx = getAudioContext();

	// Resume in case the context was suspended by browser autoplay policy.
	if (ctx.state === "suspended") {
		await ctx.resume();
	}

	const buffer = await decodeAudioData(url);
	const source = ctx.createBufferSource();
	const gain = ctx.createGain();

	source.buffer = buffer;
	source.playbackRate.value = playbackRate;
	gain.gain.value = Math.max(0, Math.min(1, volume));

	source.connect(gain);
	gain.connect(ctx.destination);

	source.onended = () => {
		onEnd?.();
	};

	source.start(0);

	return {
		stop: () => {
			try {
				source.stop();
			} catch {
				// No-op if already stopped or never started.
			}
		},
	};
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
- Sounds triggered programmatically without a user gesture (e.g., on mount with `useEffect`) will be silently blocked by the browser. This is by design — sensory-ui sounds are only meant to fire from real interactions.

---

## Volume Calculation

Final playback volume is calculated as:

```
finalVolume = masterVolume (from config) × roleVolume (per-role multiplier, v1.5+) × localVolume (from sound prop)
```

In v1.0, only the master volume from `sensory.config.js` and the optional per-call `volume` option are used.

---

## Buffer Cache Behaviour

- The cache key is the resolved file URL string (e.g., `/sounds/activation/primary.mp3`).
- If a user overrides a role to a custom path in `sensory.config.js`, the custom path becomes the cache key, so the original and overridden sounds can both be cached simultaneously without collision.
- The cache is never automatically invalidated in production. `clearBufferCache()` is available for development tooling or runtime pack switches.

---

## What the Engine Does NOT Do

- Does not preload or prefetch any audio on mount
- Does not manage a global `AudioContext` exposed outside the module
- Does not create any long-lived nodes (no master gain bus, no reverb node)
- Does not trigger any React state updates
- Does not read from `sensory.config.js` directly — config resolution is handled by the caller (the provider or hook), which passes the final volume and resolved URL into the engine

---

## Engine Size Budget

The engine must stay under **3 KB minified + gzipped**. The implementation above is well within that budget. If Web Audio API wrappers or fallback paths are added, they must be tree-shakeable.

---

## Future: Offline / Inlined Audio

In a future version, a build-time step could inline the decoded audio as base64 data URIs directly into the registry entry, eliminating the fetch step entirely. The `decodeAudioDataFromUri` function above already supports this path. This is not needed in v1.0 since Next.js static asset serving is fast and sounds are short.
