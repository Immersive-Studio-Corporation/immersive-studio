import { nativeTrackFor } from './journey-tracks.ts';
import type { AudioScene } from './journey-tracks.ts';
export { isMusicProject } from './journey-tracks.ts';
export type { MusicProject } from './journey-tracks.ts';

export type AudioStatus =
  | 'off'
  | 'loading'
  | 'playing'
  | 'ended'
  | 'error'
  | 'blocked'
  | 'unavailable';
type Layer = { source: AudioBufferSourceNode; gain: GainNode };
export const DEFAULT_MUSIC_VOLUME = 0.15;

/** One browser-permitted context; recordings load only for visible projects.
 * Two decoded tracks at most, with audio-clock fades that do not compete with
 * the cube's animation. A revision protects fast forward/backward navigation.
 */
export class JourneyAudio {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private cache = new Map<AudioScene, AudioBuffer>();
  private layers = new Set<Layer>();
  private active:
    | (Layer & { id: AudioScene; offset: number; startedAt: number })
    | null = null;
  private request: AbortController | null = null;
  private revision = 0;
  private disposed = false;
  private volume = DEFAULT_MUSIC_VOLUME;
  private cue: { id: AudioScene; seconds: number } | null = null;
  private pending: AudioScene | null = null;
  private introEnded = false;
  private status: (status: AudioStatus) => void;
  private sourceFor: (id: AudioScene) => string | null;

  constructor(
    status: (status: AudioStatus) => void,
    sourceFor = (id: AudioScene) => nativeTrackFor(id)?.src ?? null,
  ) {
    this.status = status;
    this.sourceFor = sourceFor;
  }

  // Call synchronously on entry or inside a visitor gesture, before fetching.
  unlock() {
    if (this.disposed) return Promise.reject(new Error('Disposed'));
    if (!this.context) {
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = this.volume;
      this.master.connect(this.context.destination);
    }
    return this.context.resume();
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.master && this.context) {
      this.hold(this.master.gain, this.context.currentTime);
      this.master.gain.linearRampToValueAtTime(
        this.volume,
        this.context.currentTime + 0.12,
      );
    }
  }

  setPosition(id: AudioScene | null, seconds: number, _manual = true) {
    // Only seeds a newly selected track. A playing source is never recreated
    // by wheel movement, even after the visitor stops or reverses direction.
    const value = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
    this.cue = id ? { id, seconds: value } : null;
  }

  async select(id: AudioScene | null, seek = false) {
    if (this.disposed) return;
    if (id && !seek && (this.active?.id === id || this.pending === id)) return;
    if (id === 'intro' && this.introEnded && !seek) return;
    const revision = ++this.revision;
    this.request?.abort();
    this.request = null;
    this.pending = null;
    if (id !== 'intro') this.introEnded = false;
    if (!id || !this.context || !this.master) {
      this.layers.forEach((layer) => this.fadeOut(layer, 0.45));
      this.active = null;
      this.status('off');
      return;
    }
    const src = this.sourceFor(id);
    if (!src) {
      this.layers.forEach((layer) => this.fadeOut(layer, 0.45));
      this.active = null;
      this.status('unavailable');
      return;
    }
    const context = this.context;
    const controller = new AbortController();
    this.request = controller;
    this.pending = id;
    this.status('loading');
    try {
      let buffer = this.cache.get(id);
      if (!buffer) {
        const response = await fetch(src, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Audio HTTP ${response.status}`);
        buffer = await context.decodeAudioData(await response.arrayBuffer());
      }
      if (revision !== this.revision || this.disposed) return;
      this.cache.delete(id);
      this.cache.set(id, buffer);
      while (this.cache.size > 2)
        this.cache.delete(this.cache.keys().next().value!);

      this.pending = null;
      const seconds = this.cue?.id === id ? this.cue.seconds : 0;
      const offset =
        id === 'intro'
          ? Math.min(seconds, buffer.duration)
          : seconds % buffer.duration;
      if (id === 'intro' && offset >= buffer.duration - 0.04) {
        this.layers.forEach((layer) => this.fadeOut(layer, 0.12));
        this.active = null;
        this.introEnded = true;
        this.status('ended');
        return;
      }

      const source = context.createBufferSource();
      const gain = context.createGain();
      source.buffer = buffer;
      source.loop = id !== 'intro';
      source.connect(gain);
      gain.connect(this.master);
      const now = context.currentTime;
      const layer = { source, gain, id, offset, startedAt: now };
      source.onended = () => {
        source.disconnect();
        gain.disconnect();
        this.layers.delete(layer);
        if (this.active === layer) {
          this.active = null;
          if (id === 'intro') this.introEnded = true;
          this.status('ended');
        }
      };
      const fade = seek ? 0.08 : id === 'intro' ? 0.035 : 0.65;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(1, now + fade);
      // Only the currently audible track participates in the next crossfade.
      // Older fading layers are stopped immediately on rapid navigation.
      for (const previous of this.layers) {
        if (previous !== this.active) previous.source.stop();
        else this.fadeOut(previous, fade);
      }
      this.layers.add(layer);
      this.active = layer;
      source.start(0, offset);
      this.status('playing');
    } catch {
      if (revision !== this.revision || this.disposed) return;
      this.pending = null;
      this.layers.forEach((layer) => this.fadeOut(layer, 0.35));
      this.active = null;
      this.status('error');
    }
  }

  private fadeOut(layer: Layer, seconds: number) {
    if (!this.context) return;
    const now = this.context.currentTime;
    this.hold(layer.gain.gain, now);
    layer.gain.gain.linearRampToValueAtTime(0, now + seconds);
    layer.source.stop(now + seconds + 0.02);
  }

  private hold(param: AudioParam, time: number) {
    if (typeof param.cancelAndHoldAtTime === 'function')
      param.cancelAndHoldAtTime(time);
    else {
      const value = param.value;
      param.cancelScheduledValues(time);
      param.setValueAtTime(value, time);
    }
  }

  async setHidden(hidden: boolean) {
    if (!this.context || this.disposed) return;
    try {
      if (hidden) await this.context.suspend();
      else await this.context.resume();
    } catch {
      if (!this.disposed) this.status('error');
    }
  }

  dispose() {
    this.disposed = true;
    this.revision++;
    this.request?.abort();
    this.layers.forEach((layer) => {
      layer.source.onended = null;
      layer.source.stop();
      layer.source.disconnect();
      layer.gain.disconnect();
    });
    this.layers.clear();
    this.cache.clear();
    void this.context?.close();
  }
}
