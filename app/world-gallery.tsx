'use client';

/* Native responsive media: this static export has no image server. */
/* oxlint-disable next/no-img-element */
/* Native dialog is interactive: it owns backdrop clicks and arrow navigation. */
/* oxlint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import type { JourneyProject } from './project-journey';
import type { Messages } from './messages';
import { responsiveScenery, videoScenery } from './journey-art';

/** The native modal traps focus and makes the underlying journey inert. */
export function WorldGallery({
  project,
  initialIndex,
  t,
  paused,
  onClose,
}: {
  project: JourneyProject;
  initialIndex: number;
  t: Messages;
  paused: boolean;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [index, setIndex] = useState(initialIndex);
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scenes = project.scenery || [project.backdrop];
  const poster = scenes[index];
  const sources = useMemo(() => videoScenery(poster), [poster]);
  const close = useCallback(() => {
    if (closeTimer.current) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onClose();
      return;
    }
    setClosing(true);
    closeTimer.current = setTimeout(onClose, 220);
  }, [onClose]);
  const change = (direction: number) =>
    setIndex((value) => (value + direction + scenes.length) % scenes.length);
  useEffect(() => {
    const element = dialog.current;
    const returnFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      element?.close();
      document.body.style.overflow = overflow;
      returnFocus?.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => {
    const element = video.current;
    if (!element || !sources) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.src = matchMedia('(max-width: 760px)').matches
      ? sources.mobile
      : sources.desktop;
    let resume = false;
    const visibility = () => {
      if (document.hidden) {
        resume = !element.paused;
        element.pause();
      } else if (resume) void element.play().catch(() => {});
    };
    if (!paused && !reduced && !document.hidden)
      void element.play().catch(() => {});
    document.addEventListener('visibilitychange', visibility);
    return () => {
      document.removeEventListener('visibilitychange', visibility);
      element.pause();
      element.removeAttribute('src');
      element.load();
    };
  }, [poster, paused, sources]);
  return createPortal(
    <dialog
      ref={dialog}
      className="world-gallery"
      data-closing={closing}
      aria-labelledby="world-gallery-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      onKeyDown={(event) => {
        if ((event.target as HTMLElement).tagName === 'VIDEO') return;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          change(event.key === 'ArrowLeft' ? -1 : 1);
        }
      }}
    >
      <div className="world-gallery-shell">
        <header>
          <div>
            <p>{t.galleryTitle}</p>
            <h2 id="world-gallery-title">{project.name}</h2>
          </div>
          <button
            type="button"
            className="gallery-close"
            onClick={close}
            aria-label={t.galleryClose}
            autoFocus
          >
            <X size={22} />
          </button>
        </header>
        <div className="world-gallery-media" key={poster}>
          {sources ? (
            <video
              ref={video}
              poster={poster}
              muted
              loop
              playsInline
              controls
              preload="metadata"
              aria-label={`${project.name} — ${t.galleryScene} ${index + 1}`}
            />
          ) : (
            <img
              {...responsiveScenery(poster)}
              alt={`${project.name} — ${t.galleryScene} ${index + 1}`}
            />
          )}
        </div>
        <footer>
          <button
            type="button"
            className="gallery-arrow"
            onClick={() => change(-1)}
            aria-label={t.galleryPrevious}
          >
            <ArrowLeft size={21} />
          </button>
          <div className="gallery-scene-list" aria-label={t.galleryTitle}>
            {scenes.map((src, i) => (
              <button
                key={src}
                type="button"
                aria-label={`${t.galleryScene} ${i + 1}`}
                aria-pressed={i === index}
                onClick={() => setIndex(i)}
              >
                <img
                  {...responsiveScenery(src)}
                  sizes="100px"
                  alt=""
                  width={160}
                  height={90}
                />
                <span>{String(i + 1).padStart(2, '0')}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="gallery-arrow"
            onClick={() => change(1)}
            aria-label={t.galleryNext}
          >
            <ArrowRight size={21} />
          </button>
        </footer>
        <p className="gallery-counter" aria-live="polite">
          {t.galleryScene} {index + 1} / {scenes.length}
        </p>
      </div>
    </dialog>,
    document.body,
  );
}
