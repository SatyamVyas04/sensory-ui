let audioContext: AudioContext | null = null;
const bufferCache = new Map<string, AudioBuffer>();

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
  // Handle base64 data URIs directly — no network fetch needed
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
  /** 0–1. Multiplied with master volume from config. */
  volume?: number;
  /** Default 1.0. Values > 1 speed up, < 1 slow down. */
  playbackRate?: number;
  /** Called when the sound finishes playing naturally. */
  onEnd?: () => void;
}

export interface SoundPlayback {
  stop: () => void;
}

export async function playSound(
  source: string,
  options: PlaySoundOptions = {}
): Promise<SoundPlayback> {
  const { volume = 1, playbackRate = 1, onEnd } = options;

  const ctx = getAudioContext();

  if (ctx.state === "suspended") {
    await ctx.resume();
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
    onEnd?.();
  };

  bufferSource.start(0);

  return {
    stop: () => {
      try {
        bufferSource.stop();
      } catch {
        // No-op if already stopped.
      }
    },
  };
}

export function clearBufferCache(): void {
  bufferCache.clear();
}

export async function closeAudioContext(): Promise<void> {
  if (audioContext) {
    await audioContext.close();
    audioContext = null;
  }
}
