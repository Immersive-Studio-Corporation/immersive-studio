'use client';
import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { createPortal } from 'react-dom';
import { Headphones, Volume2, VolumeX, X, ChevronDown } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { JourneyAudio, DEFAULT_MUSIC_VOLUME } from './journey-music';
import type { JourneyAudioFrame } from './journey-audio-frame';
import { JourneyPlayback } from './journey-playback';
import type { AudioStatus } from './journey-music';
import { nativeTrackFor } from './journey-tracks';
import type { Messages } from './messages';
import './journey-sound.css';

export function JourneySound({
  projectName,
  t,
  frame,
}: {
  projectName: string;
  t: Messages;
  frame: RefObject<JourneyAudioFrame>;
}) {
  const audio = useRef<JourneyAudio | null>(null);
  const playback = useRef<JourneyPlayback | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const activate = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [status, setStatus] = useState<AudioStatus>('off');
  const [volume, setVolume] = useState(DEFAULT_MUSIC_VOLUME * 100);
  const [scene, setScene] = useState<string | null>(null);
  const track = nativeTrackFor(scene || '');

  useEffect(() => {
    const player = new JourneyAudio(setStatus);
    const controller = new JourneyPlayback(player, setStatus);
    audio.current = player;
    playback.current = controller;
    const sample = () => {
      controller.setFrame(frame.current);
      setScene((previous) =>
        previous === frame.current.id ? previous : frame.current.id,
      );
    };
    const visibility = () => {
      controller.setHidden(document.hidden);
    };
    const interact = (event: Event) => {
      if (!event.isTrusted) return;
      const element = event.target instanceof Element ? event.target : null;
      if (element?.closest('.music-controls, #journey-music-panel')) return;
      if (
        event instanceof KeyboardEvent &&
        (event.repeat || event.key === 'Escape')
      )
        return;
      sample();
      controller.interact();
    };
    const gestures = ['pointerdown', 'pointerup', 'click', 'keydown'] as const;
    gestures.forEach((name) => document.addEventListener(name, interact, true));
    visibility();
    sample();
    const sampler = window.setInterval(sample, 80);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      clearInterval(sampler);
      gestures.forEach((name) =>
        document.removeEventListener(name, interact, true),
      );
      document.removeEventListener('visibilitychange', visibility);
      controller.dispose();
      audio.current = null;
      playback.current = null;
    };
  }, [frame]);

  function close() {
    setOpen(false);
    trigger.current?.focus();
  }
  useEffect(() => {
    if (!open) return;
    activate.current?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [open]);

  function toggle() {
    const next = !enabled;
    playback.current?.setFrame(frame.current);
    playback.current?.setEnabled(next);
    setEnabled(next);
  }

  return (
    <>
      <div className="music-controls">
        <button
          ref={trigger}
          type="button"
          className="music-trigger"
          aria-label={
            enabled && status !== 'blocked' ? t.musicDisable : t.musicEnable
          }
          title={
            status === 'blocked'
              ? t.musicAutoplayWaiting
              : enabled
                ? t.musicDisable
                : t.musicEnable
          }
          aria-pressed={enabled}
          data-playing={status === 'playing'}
          data-scene={scene || ''}
          onClick={() =>
            enabled && status === 'blocked'
              ? playback.current?.interact()
              : toggle()
          }
        >
          {enabled ? <Volume2 size={18} /> : <Headphones size={18} />}
        </button>
        <button
          type="button"
          className="music-settings"
          aria-label={t.musicSettings}
          title={t.musicSettings}
          aria-expanded={open}
          aria-controls="journey-music-panel"
          onClick={() => (open ? close() : setOpen(true))}
        >
          <ChevronDown size={13} />
        </button>
      </div>
      {open &&
        createPortal(
          <section
            id="journey-music-panel"
            className="music-popover"
            aria-labelledby="journey-music-title"
          >
            <div className="music-panel-heading">
              <h2 id="journey-music-title">{t.musicAmbience}</h2>
              <button
                type="button"
                className="music-close"
                aria-label={t.musicClose}
                onClick={close}
              >
                <X size={18} />
              </button>
            </div>
            <p className="music-description">{t.musicFollows}</p>
            <div className="music-project">
              <span>
                {scene === 'intro'
                  ? 'Immersive Studio'
                  : projectName || 'Immersive Studio'}
              </span>
              {track && (
                <small>
                  {track.title}
                  {track.artist !== track.title && ` · ${track.artist}`}
                </small>
              )}
            </div>
            <button
              ref={activate}
              type="button"
              className="music-enable"
              onClick={toggle}
              aria-pressed={enabled}
            >
              {enabled ? <VolumeX size={18} /> : <Volume2 size={18} />}
              {enabled ? t.musicDisable : t.musicEnable}
            </button>
            <output className="music-status">
              {!enabled
                ? t.musicOff
                : !track
                  ? t.musicWaiting
                  : !track.src
                    ? t.musicMissing
                    : status === 'ended'
                      ? t.musicEnded
                      : status === 'blocked'
                        ? t.musicAutoplayWaiting
                        : status === 'error'
                          ? t.musicError
                          : status === 'loading'
                            ? t.musicLoading
                            : t.musicPlaying}
            </output>
            {
              <>
                <div className="music-volume-label">
                  <span id="music-volume-label">{t.musicVolume}</span>
                  <span>{volume}%</span>
                </div>
                <Slider
                  className="music-volume"
                  aria-labelledby="music-volume-label"
                  value={[volume]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => {
                    const next = Array.isArray(value) ? value[0] : value;
                    setVolume(next);
                    audio.current?.setVolume(next / 100);
                  }}
                />
              </>
            }
            <a
              className="music-credits"
              href="/credits-musiques.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.musicCredits} ↗
            </a>
          </section>,
          document.body,
        )}
    </>
  );
}
