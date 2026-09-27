'use client';

import { useEffect, useRef } from 'react';
import { videoScenery } from './journey-art';

/** Load and decode only shots that actually participate in the visible scene. */
export function JourneyVideo({
  poster,
  paused,
}: {
  poster: string;
  paused: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const motionPaused = useRef(paused);
  const syncPlayback = useRef<() => void>(() => {});
  useEffect(() => {
    motionPaused.current = paused;
    syncPlayback.current();
  }, [paused]);
  useEffect(() => {
    const video = ref.current;
    const sources = videoScenery(poster);
    if (!video || !sources) return;
    const root = video.closest<HTMLElement>('.project-journey');
    const dimension = video.closest<HTMLElement>('.journey-dimension');
    const shot = video.closest<HTMLElement>('.dimension-shot');
    if (!root || !dimension || !shot) return;
    let disposed = false;
    let pending = false;
    video.loop = true;
    const active = () =>
      !disposed &&
      !motionPaused.current &&
      !document.hidden &&
      root.dataset.enhanced === 'true' &&
      root.dataset.visible === 'true' &&
      dimension.dataset.visible === 'true' &&
      shot.dataset.visible === 'true';
    const sync = () => {
      const nearby =
        !disposed &&
        !motionPaused.current &&
        !document.hidden &&
        root.dataset.enhanced === 'true' &&
        root.dataset.visible === 'true' &&
        shot.dataset.near === 'true';
      if ((active() || nearby) && !video.getAttribute('src')) {
        video.preload = 'auto';
        video.src = window.matchMedia('(max-width: 760px)').matches
          ? sources.mobile
          : sources.desktop;
        video.load();
      }
      if (!active()) {
        video.pause();
        return;
      }
      if (!video.paused || pending) return;
      pending = true;
      video
        .play()
        .then(() => {
          if (!active()) video.pause();
        })
        .catch(() => {
          // Keep the poster visible when playback is unavailable.
        })
        .finally(() => {
          pending = false;
        });
    };
    syncPlayback.current = sync;
    const observer = new MutationObserver(sync);
    for (const target of [root, dimension, shot]) {
      observer.observe(target, {
        attributes: true,
        attributeFilter: ['data-visible', 'data-enhanced', 'data-near'],
      });
    }
    document.addEventListener('visibilitychange', sync);
    document.addEventListener('pointerdown', sync);
    sync();
    return () => {
      disposed = true;
      syncPlayback.current = () => {};
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      document.removeEventListener('pointerdown', sync);
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [poster]);
  return (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
    />
  );
}
