'use client';

/* Native responsive posters: this portable static export has no image server. */
/* oxlint-disable next/no-img-element */

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, RefObject } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowUpRight, Play, Pause } from 'lucide-react';
import { StudioMark } from './studio-mark';
import { CinemaField } from './cinema-field';
import { WorldSnapshots } from './world-snapshots';
import { dimensionLayers } from './journey-layers';
import { logoPose, type LogoDock } from './journey-logo-motion';
import { MinecraftPrologue } from './minecraft-prologue';
import type { Messages } from './messages';
import {
  clamp,
  ramp,
  journeyFrame,
  INTRO_SCREENS,
  CHAPTER_SCREENS,
  shotReveals,
} from './journey-timeline';
import { JourneyVideo } from './journey-video';
import { responsiveScenery, videoScenery } from './journey-art';
import { tourPosition, tourTimeAt, tourDuration } from './journey-autoplay';
import { audioTimeAt } from './journey-audio-frame';
import type { JourneyAudioFrame } from './journey-audio-frame';
import { isMusicProject } from './journey-tracks';
import './project-journey.css';

export type JourneyProject = {
  id: string;
  name: string;
  image: string;
  backdrop: string;
  scenery?: string[];
  color: string;
  genre: string;
  status: string;
  line?: string;
  text: string;
  cta: string;
  href: string;
  note?: string;
};

/** One sticky scene, with cinematic worlds and an accessible media gallery. */
export function ProjectJourney({
  projects,
  t,
  paused,
  replayKey,
  onProjectChange,
  audioFrame,
}: {
  projects: JourneyProject[];
  t: Messages;
  paused: boolean;
  replayKey: number;
  onProjectChange: (id: string) => void;
  audioFrame: RefObject<JourneyAudioFrame>;
}) {
  const root = useRef<HTMLDivElement>(null);
  const fieldProgress = useRef(0);
  const fieldEnergy = useRef(0);
  const position = useRef(0);
  const motionPaused = useRef(paused);
  const restored = useRef(false);
  const [autoPlaying, setAutoPlaying] = useState(false);
  const [autoSpeed, setAutoSpeed] = useState(1);
  const tourRunning = useRef(false);
  const tourSpeed = useRef(1);
  const runTour = useRef<(running: boolean) => void>(() => {});
  const [loadedWorlds, setLoadedWorlds] = useState<ReadonlySet<number>>(
    () => new Set([0, 1]),
  );
  useEffect(() => {
    motionPaused.current = paused;
    if (paused) runTour.current(false);
  }, [paused]);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const stage = el.querySelector<HTMLElement>('.journey-stage')!;
    setAutoPlaying(false);
    const opening = el.querySelector<HTMLElement>('.journey-opening')!;
    const hero = el.querySelector<HTMLElement>('.hero-copy')!;
    const cards = [...el.querySelectorAll<HTMLElement>('.journey-project')];
    const markers = [...el.querySelectorAll<HTMLElement>('[data-anchor]')];
    const worlds = [...el.querySelectorAll<HTMLElement>('[data-world-layer]')];
    const dimensions = [
      ...el.querySelectorAll<HTMLElement>('[data-dimension]'),
    ];
    const shots = dimensions.map((dimension) => [
      ...dimension.querySelectorAll<HTMLElement>('.dimension-shot'),
    ]);
    const nav = [
      ...el.querySelectorAll<HTMLAnchorElement>('.journey-navigation a'),
    ];
    const counter = el.querySelector<HTMLElement>('.journey-count-current')!;
    const emblem = el.querySelector<HTMLElement>('.journey-emblems')!;
    const logoImages = [...emblem.querySelectorAll<HTMLImageElement>('img')];
    const logoReady = new Set<HTMLImageElement>();
    let disposed = false;
    let stageWidth = 1,
      stageHeight = 1;
    let logoDocks: LogoDock[] = [];
    // Rasterize at the largest display size, then scale down during arrival/dock.
    // Scaling a small filtered layer up made even the original masters look blurry.
    let logoSurfaceScale = 1;
    const logoTarget = { x: 0, y: 0, opacity: 0, scale: 0.12 };
    const logoDrawn = { ...logoTarget };
    const paintLogo = (dt: number) => {
      let moving = false;
      const ease = 1 - Math.exp(-dt / 0.22);
      for (const key of ['x', 'y', 'opacity', 'scale'] as const) {
        logoDrawn[key] += (logoTarget[key] - logoDrawn[key]) * ease;
        const epsilon = key === 'x' || key === 'y' ? 0.05 : 0.0005;
        if (Math.abs(logoDrawn[key] - logoTarget[key]) < epsilon)
          logoDrawn[key] = logoTarget[key];
        else moving = true;
      }
      emblem.style.transform = `translate3d(${logoDrawn.x.toFixed(3)}px, ${logoDrawn.y.toFixed(3)}px, 0) translate(-50%, -50%) scale(${(logoDrawn.scale / logoSurfaceScale).toFixed(5)})`;
      emblem.style.opacity = logoDrawn.opacity.toFixed(5);
      return moving;
    };
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0,
      last = 0,
      start = 0,
      intro = 1,
      chapter = 1,
      total = 1;
    let enhanced = false,
      visible = true,
      active = '',
      current = position.current;
    let reported: string | null = null;
    let tourSeconds = 0;
    const stopTour = () => {
      tourRunning.current = false;
      setAutoPlaying(false);
    };
    const report = (id: string) => {
      if (id !== reported) {
        reported = id;
        onProjectChange(id);
      }
    };
    const sound = (id: string | null, progress = 0) => {
      audioFrame.current = {
        id: id === 'intro' || (id && isMusicProject(id)) ? id : null,
        seconds: audioTimeAt(progress, id === 'intro'),
        manual: !tourRunning.current,
        revision: replayKey,
      };
    };
    const activate = (index: number) => {
      const id = index < 0 ? '' : projects[index].id;
      if (id === active && el.dataset.ready === 'true') return;
      active = id;
      if (tourRunning.current && id && location.hash !== '#' + id)
        history.replaceState(history.state, '', '#' + id);
      if (index >= 0)
        setLoadedWorlds((previous) => {
          const nearby = [index - 1, index, index + 1].filter(
            (i) => i >= 0 && i < projects.length,
          );
          if (
            previous.size === nearby.length &&
            nearby.every((i) => previous.has(i))
          )
            return previous;
          return new Set(nearby);
        });
      el.dataset.ready = 'true';
      el.dataset.project = id || 'intro';
      if (index >= 0)
        el.style.setProperty('--world-accent', projects[index].color);
      cards.forEach((card, i) => {
        card.dataset.active = String(i === index);
        card.inert = enhanced && i !== index;
        if (enhanced) card.setAttribute('aria-hidden', String(i !== index));
        else card.removeAttribute('aria-hidden');
      });
      nav.forEach((a, i) => {
        if (i === index) a.setAttribute('aria-current', 'step');
        else a.removeAttribute('aria-current');
      });
      counter.textContent = String(Math.max(0, index) + 1).padStart(2, '0');
    };
    const paint = (value: number) => {
      position.current = value;
      const p = clamp(value / intro);
      fieldProgress.current = p;
      const flight = ramp(p, 0.2, 0.78),
        bloom = Math.sin(flight * Math.PI);
      const center = ramp(p, 0.13, 0.56);
      const scene = journeyFrame(value, intro, chapter, projects.length);
      const { index, progress: fraction, reading, exit, reveal: enter } = scene;
      const reveal = scene.worldReveal;
      const currentShots = shotReveals(fraction, shots[index].length);
      const pulse = Math.max(
        Math.sin(reveal * Math.PI),
        ...currentShots.slice(1).map((r) => Math.sin(r * Math.PI)),
      );
      fieldEnergy.current = pulse;
      const displayed = enter < 0.55 ? -1 : index;
      opening.style.setProperty('--progress', String(p));
      opening.style.setProperty(
        '--minecraft-reveal',
        String(ramp(p, 0.2, 0.29) * (1 - ramp(p, 0.57, 0.69))),
      );
      opening.style.setProperty(
        '--minecraft-depth',
        String(ramp(p, 0.2, 0.67)),
      );
      opening.style.setProperty('--center', String(center));
      opening.style.setProperty('--bloom', String(bloom));
      opening.style.setProperty(
        '--finale',
        String(ramp(p, 0.74, 0.88) * (1 - enter)),
      );
      opening.style.setProperty(
        '--cube-x',
        Math.sin(flight * Math.PI * 4) * 150 * bloom + 'px',
      );
      opening.style.setProperty('--cube-y', -bloom * 75 + 'px');
      opening.style.setProperty('--cube-r', flight * 720 + 'deg');
      opening.style.setProperty('--split', bloom * 115 + 'px');
      opening.style.setProperty(
        '--letter-turn',
        Math.sin(flight * Math.PI * 2) * 8 + 'deg',
      );
      opening.dataset.phase = p > 0.22 ? 'logo' : 'intro';
      opening.dataset.chapter = p < 0.29 ? '1' : p < 0.74 ? '2' : '3';
      el.style.setProperty('--world-enter', String(enter));
      el.style.setProperty('--chapter-copy', String(enter * scene.copy));
      el.style.setProperty('--chapter-offset', (1 - reading) * 40 + 'px');
      el.style.setProperty('--reading', String(reading));
      el.style.setProperty('--scenery', String(enter));
      el.style.setProperty('--dimension-progress', String(fraction));
      el.style.setProperty('--dimension-detail', String(scene.detail));
      el.style.setProperty('--dimension-arrival', String(scene.arrival));
      el.style.setProperty('--portal', String(pulse));
      const dock = logoDocks[index];
      if (dock) {
        const pose = logoPose(
          fraction,
          stageWidth,
          stageHeight,
          dock,
          (logoImages[index].naturalWidth || dock.width) /
            (logoImages[index].naturalHeight || dock.height),
        );
        Object.assign(logoTarget, pose);
        logoTarget.opacity *=
          enter * (1 - exit) * (logoReady.has(logoImages[index]) ? 1 : 0);
        logoSurfaceScale = logoPose(
          0.4,
          stageWidth,
          stageHeight,
          dock,
          (logoImages[index].naturalWidth || dock.width) /
            (logoImages[index].naturalHeight || dock.height),
        ).scale;
        emblem.style.width = dock.width * logoSurfaceScale + 'px';
        emblem.style.height = dock.height * logoSurfaceScale + 'px';
      }
      el.dataset.reading = String(scene.copy > 0.04);
      el.dataset.phase =
        displayed < 0
          ? 'intro'
          : fraction < 0.2
            ? 'arrival'
            : reading < 0.05
              ? 'exploration'
              : 'reading';
      const layers = dimensionLayers(
        index,
        fraction,
        scene.underlay,
        reveal,
        enter,
        shots.map((list) => list.length),
      );
      dimensions.forEach((dimension, i) => {
        const layer = layers[i];
        const shown = String(layer.visible);
        if (dimension.dataset.visible !== shown)
          dimension.dataset.visible = shown;
        dimension.style.opacity = layer.opacity.toFixed(4);
        dimension.style.transform = `scale(${(1.025 - layer.opacity * 0.025).toFixed(4)})`;
        dimension.style.zIndex = String(layer.zIndex);
        shots[i].forEach((shot, j) => {
          const state = layer.shots[j];
          for (const [key, value] of Object.entries({
            visible: state.visible,
            near: state.near,
          })) {
            if (shot.dataset[key] !== String(value))
              shot.dataset[key] = String(value);
          }
          shot.style.opacity = state.opacity.toFixed(4);
          shot.style.transform = `scale(${(1.015 - state.opacity * 0.015).toFixed(4)})`;
        });
      });
      // Only world changes touch the individual layers; idle animation stays on
      // the compositor and canvas, without React renders or image-layer writes.
      if (el.dataset.texture !== String(index)) {
        el.dataset.texture = String(index);
        worlds.forEach((layer) => {
          layer.style.opacity =
            Number(layer.dataset.worldLayer) === index ? '1' : '0';
          if (layer.classList.contains('journey-emblem'))
            layer.dataset.shown = String(
              Number(layer.dataset.worldLayer) === index,
            );
        });
        // A new logo starts hidden; decoding and easing happen before its reveal.
        Object.assign(logoDrawn, logoTarget, {
          opacity: 0,
          scale: fraction < 0.35 ? 0.12 : logoTarget.scale,
        });
      }
      activate(displayed);
      cards.forEach((card, i) => {
        const hidden = enhanced && (i !== displayed || scene.copy <= 0.04);
        if (card.inert !== hidden) {
          card.inert = hidden;
          card.setAttribute('aria-hidden', String(hidden));
        }
      });
      hero.inert = enhanced && p > 0.22;
      report(scrollY > start + total + stage.clientHeight / 2 ? '' : active);
      sound(
        scrollY > start + total + stage.clientHeight / 2
          ? null
          : active || 'intro',
        active ? fraction : p,
      );
    };
    const target = () => Math.max(0, Math.min(total, scrollY - start));
    const reportFallback = () => {
      const focalPoint = document.documentElement.clientHeight * 0.5;
      const index = cards.findIndex((card) => {
        const rect = card.getBoundingClientRect();
        return rect.top <= focalPoint && rect.bottom > focalPoint;
      });
      report(index < 0 ? '' : projects[index].id);
      const rect =
        index >= 0
          ? cards[index].getBoundingClientRect()
          : opening.getBoundingClientRect();
      sound(
        index >= 0
          ? projects[index].id
          : rect.bottom > focalPoint && rect.top < focalPoint
            ? 'intro'
            : null,
        index < 0
          ? 0
          : clamp((focalPoint - rect.top) / Math.max(1, rect.height)),
      );
    };
    const tick = (now: number) => {
      frame = 0;
      if (document.hidden) return;
      if (!enhanced) {
        reportFallback();
        return;
      }
      const dt = Math.min((now - (last || now - 16.67)) / 1000, 0.05);
      last = now;
      if (tourRunning.current && visible && !motionPaused.current) {
        tourSeconds = Math.min(
          tourDuration(projects.length),
          tourSeconds + dt * tourSpeed.current,
        );
        window.scrollTo({
          top:
            start + tourPosition(tourSeconds, intro, chapter, projects.length),
          behavior: 'instant',
        });
        if (tourSeconds >= tourDuration(projects.length)) stopTour();
      }
      const goal = target();
      current =
        motionPaused.current || !visible
          ? goal
          : current + (goal - current) * (1 - Math.exp(-dt / 0.08));
      if (Math.abs(goal - current) < 0.08) current = goal;
      paint(current);
      const logoMoving = paintLogo(dt);
      if (current !== goal || tourRunning.current || logoMoving)
        frame = requestAnimationFrame(tick);
      else last = 0;
    };
    const schedule = () => {
      if (!document.hidden && !frame) frame = requestAnimationFrame(tick);
    };
    logoImages.forEach((img) => {
      void img
        .decode()
        .then(() => {
          if (!disposed) {
            logoReady.add(img);
            schedule();
          }
        })
        .catch(() => {});
    });
    const measure = () => {
      const previousIntro = intro;
      const previousChapter = chapter;
      const header =
        document.querySelector('header')?.getBoundingClientRect().height || 86;
      const viewport = document.documentElement.clientHeight;
      const height = Math.max(1, viewport - header);
      const mobile = innerWidth <= 760;
      // Always measure the cinematic typography and width, including while the
      // readable fallback is active. This avoids resize-observer mode oscillation.
      el.dataset.enhanced = 'true';
      const copyHeight = Math.max(
        ...cards.map(
          (card) =>
            card.querySelector<HTMLElement>('.journey-copy')!.scrollHeight,
        ),
      );
      const canFit = copyHeight + (mobile ? 205 : 140) <= height;
      const wasEnhanced = enhanced;
      enhanced = !reduced.matches && height >= 560 && canFit;
      el.dataset.enhanced = String(enhanced);
      start = el.getBoundingClientRect().top + scrollY;
      intro = height * INTRO_SCREENS;
      chapter = height * CHAPTER_SCREENS;
      total = intro + projects.length * chapter;
      el.style.setProperty('--journey-height', total + height + header + 'px');
      el.style.setProperty('--journey-viewport', height + 'px');
      opening.style.setProperty('--stage-width', stage.clientWidth + 'px');
      opening.style.setProperty('--stage-height', height + 'px');
      stageWidth = stage.clientWidth;
      stageHeight = height;
      const stageRect = stage.getBoundingClientRect();
      logoDocks = cards.map((card) => {
        const title = card.querySelector<HTMLElement>(
          '.journey-project-brand',
        )!;
        const rect = title.getBoundingClientRect();
        const copy = card.querySelector<HTMLElement>('.journey-copy')!;
        const offset = new DOMMatrixReadOnly(getComputedStyle(copy).transform)
          .m42;
        return {
          x: rect.left - stageRect.left + rect.width / 2,
          y: rect.top - stageRect.top - offset + rect.height / 2,
          width: rect.width,
          height: rect.height,
        };
      });
      emblem.style.left = '0';
      emblem.style.top = '0';

      markers.forEach((marker, i) => {
        marker.id = enhanced ? projects[i].id : '';
        marker.style.top = header + intro + (i + 0.12) * chapter + 'px';
        cards[i].id = enhanced ? 'scene-' + projects[i].id : projects[i].id;
      });
      const univers = el.querySelector<HTMLElement>('[data-univers]')!;
      univers.id = enhanced ? 'univers' : '';
      univers.style.top = header + intro + 1.12 * chapter + 'px';
      el.querySelector<HTMLElement>('.journey-univers-fallback')!.id = enhanced
        ? ''
        : 'univers';
      if (!enhanced) {
        stopTour();
        cancelAnimationFrame(frame);
        frame = 0;
        opening.dataset.phase = 'intro';
        opening.dataset.chapter = '1';
        for (const property of [
          '--progress',
          '--center',
          '--bloom',
          '--finale',
        ])
          opening.style.setProperty(property, '0');
        opening.style.setProperty('--split', '0px');
        opening.style.setProperty('--letter-turn', '0deg');
        cards.forEach((card) => {
          card.inert = false;
          card.removeAttribute('aria-hidden');
        });
        hero.inert = false;
        el.dataset.project = 'intro';
        fieldProgress.current = 0;
        reportFallback();
      } else {
        if (!wasEnhanced) {
          current = target();
          el.dataset.ready = 'false';
        } else if (previousChapter !== chapter) {
          // Browser bars, rotation and resized windows keep the same story frame.
          current =
            current < previousIntro
              ? (current / previousIntro) * intro
              : intro + ((current - previousIntro) / previousChapter) * chapter;
          if (visible)
            window.scrollTo({ top: start + current, behavior: 'instant' });
        }
        paint(current);
        schedule();
      }
    };
    const visibility = () => {
      if (document.hidden) stopTour();
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      if (!document.hidden) schedule();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      el.dataset.visible = String(visible);
      if (!visible) {
        report('');
        sound(null);
        stopTour();
        cancelAnimationFrame(frame);
        frame = 0;
        last = 0;
      } else schedule();
    });
    const sizes = new ResizeObserver(measure);
    sizes.observe(document.querySelector('header')!);
    cards.forEach((card) =>
      sizes.observe(card.querySelector('.journey-copy')!),
    );
    observer.observe(el);
    measure();
    runTour.current = (running) => {
      if (!running || !enhanced || motionPaused.current || document.hidden) {
        stopTour();
        return;
      }
      let value = target();
      if (value >= intro + (projects.length - 0.015) * chapter) value = 0;
      window.scrollTo({ top: start + value, behavior: 'instant' });
      tourSeconds = tourTimeAt(value, intro, chapter, projects.length);
      tourRunning.current = true;
      setAutoPlaying(true);
      last = 0;
      schedule();
    };
    const manual = (event: Event) => {
      const element = event.target instanceof Element ? event.target : null;
      if (
        element?.closest(
          '.journey-playback, .music-controls, #journey-music-panel',
        )
      )
        return;
      if (
        event instanceof KeyboardEvent &&
        ![
          'ArrowUp',
          'ArrowDown',
          'ArrowLeft',
          'ArrowRight',
          'PageUp',
          'PageDown',
          'Home',
          'End',
          ' ',
        ].includes(event.key)
      )
        return;
      if (tourRunning.current) stopTour();
    };
    window.addEventListener('wheel', manual, { passive: true });
    window.addEventListener('touchstart', manual, { passive: true });
    window.addEventListener('pointerdown', manual, { passive: true });
    window.addEventListener('keydown', manual);
    // Native hash scrolling fights the sticky scene's layout. Navigate using the
    // timeline instead, preserving real URLs and browser back/forward history.
    const navigate = (hash: string, reading = false) => {
      if (!enhanced) return false;
      const index =
        hash === 'univers' ? 1 : projects.findIndex((p) => p.id === hash);
      if (index < 0 && hash !== 'accueil') return false;
      const top =
        hash === 'accueil'
          ? start
          : start + intro + (index + (reading ? 0.8 : 0.18)) * chapter;
      window.scrollTo({ top, behavior: 'instant' });
      current = target();
      paint(current);
      if (reading && index >= 0) {
        cards[index].tabIndex = -1;
        cards[index].focus({ preventScroll: true });
      }
      return true;
    };
    const click = (event: MouseEvent) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const a = (event.target as Element).closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!a || a.target === '_blank') return;
      stopTour();
      const hash = a.hash.slice(1);
      if (
        navigate(
          hash,
          a.classList.contains('skip-link') || a.dataset.reading === 'true',
        )
      ) {
        event.preventDefault();
        if (location.hash !== a.hash) history.pushState(null, '', a.hash);
      }
    };
    const historyChange = () => {
      stopTour();
      navigate(location.hash.slice(1));
    };
    let anchorFrame = 0;
    if (!restored.current) {
      anchorFrame = requestAnimationFrame(() => {
        historyChange();
        restored.current = true;
      });
    }
    document.addEventListener('click', click, true);
    window.addEventListener('popstate', historyChange);
    window.addEventListener('hashchange', historyChange);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    document.addEventListener('visibilitychange', visibility);
    reduced.addEventListener('change', measure);
    return () => {
      disposed = true;
      sound(null);
      tourRunning.current = false;
      runTour.current = () => {};
      window.removeEventListener('wheel', manual);
      window.removeEventListener('touchstart', manual);
      window.removeEventListener('pointerdown', manual);
      window.removeEventListener('keydown', manual);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(anchorFrame);
      observer.disconnect();
      sizes.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      document.removeEventListener('visibilitychange', visibility);
      reduced.removeEventListener('change', measure);
      document.removeEventListener('click', click, true);
      window.removeEventListener('popstate', historyChange);
      window.removeEventListener('hashchange', historyChange);
    };
  }, [projects, replayKey, onProjectChange, audioFrame]);

  return (
    <div className="project-journey" id="accueil" ref={root}>
      <div className="journey-stage">
        <div className="journey-ambience" aria-hidden="true">
          {projects.map((project, i) => (
            <div
              key={project.id}
              className="journey-atmosphere"
              data-world-layer={i}
              style={{ '--atmosphere': project.color } as CSSProperties}
            />
          ))}
        </div>
        <div className="journey-dimensions" aria-hidden="true">
          {projects.map((project, projectIndex) => {
            const scenes = project.scenery || [
              project.backdrop,
              project.backdrop,
              project.backdrop,
            ];
            return (
              <div
                className={'journey-dimension dimension-' + project.id}
                data-dimension={project.id}
                key={project.id}
              >
                <div className="dimension-landscape">
                  {scenes.map((src, shotIndex) => (
                    <div
                      className="dimension-shot"
                      key={src}
                      style={{ zIndex: shotIndex }}
                    >
                      <img
                        {...responsiveScenery(src)}
                        alt=""
                        width={1920}
                        height={1080}
                        decoding="async"
                        loading="lazy"
                      />
                      {loadedWorlds.has(projectIndex) && videoScenery(src) && (
                        <JourneyVideo poster={src} paused={paused} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="dimension-vignette" />
              </div>
            );
          })}
        </div>
        <CinemaField
          paused={paused}
          progress={fieldProgress}
          energy={fieldEnergy}
        />
        <div className="journey-glimmers" aria-hidden="true">
          {Array.from({ length: 14 }, (_, i) => (
            <i
              key={i}
              style={
                {
                  left: `${7 + ((i * 37) % 89)}%`,
                  top: `${11 + ((i * 23) % 73)}%`,
                  '--glint-delay': `${i * -1.37}s`,
                  '--glint-duration': `${10 + (i % 5)}s`,
                } as CSSProperties
              }
            />
          ))}
        </div>
        <section
          className="journey-opening intro-scroll"
          aria-labelledby="hero-title"
        >
          <div className="hero-copy">
            <img
              className="hero-minecraft-logo"
              src="/images/minecraft-logo.png"
              alt="Minecraft"
              width={1200}
              height={204}
              fetchPriority="high"
            />
            <h1 id="hero-title" className="eyebrow">
              Immersive Studio · {t.heroTag}
            </h1>
            <p className="hero-slogan">
              {t.heroLine1}
              <span>{t.heroLine2}</span>
            </p>
            <p className="hero-text">{t.heroText}</p>
            <a className="button button-dark" href="#heritage">
              {t.explore}
              <ArrowDown size={22} />
            </a>
          </div>
          <MinecraftPrologue
            title={t.minecraftTitle}
            detail={t.minecraftDetail}
            paused={paused}
          />
          <div className="intro-logo" aria-hidden="true" key={replayKey}>
            <StudioMark className="logo-assembly" />
            <div className="logo-shadow" />
          </div>
          <div className="intro-chapters" aria-hidden="true">
            <span>{t.introChapter1}</span>
            <span>{t.introChapter2}</span>
            <span>{t.introChapter3}</span>
          </div>
          <div className="intro-finale" aria-hidden="true">
            <span>IMMERSIVE STUDIO</span>
            <p>
              {t.introLine1}
              <br />
              <strong>{t.introLine2}</strong>
            </p>
          </div>
          <div className="intro-bottom">
            <span className="hero-side">{t.heroSide}</span>
            <a href="#heritage" className="scroll-cue">
              <ArrowDown size={20} />
              <span>{t.scroll}</span>
            </a>
            <a href="#heritage" className="skip-animation">
              {t.skipAnimation}
              <ArrowUpRight size={18} />
            </a>
          </div>
        </section>
        <div className="journey-emblems" aria-hidden="true">
          {projects.map((project, i) => (
            <Image
              key={project.id}
              data-world-layer={i}
              className={'journey-emblem emblem-' + project.id}
              src={project.image}
              alt=""
              width={600}
              height={400}
              loading="eager"
            />
          ))}
        </div>
        <div className="journey-portal" aria-hidden="true" />
        <div className="journey-projects">
          {projects.map((project, i) => (
            <article
              id={project.id}
              className={'journey-project journey-project-' + project.id}
              key={project.id}
              aria-labelledby={project.id + '-title'}
              style={{ '--project-accent': project.color } as CSSProperties}
            >
              {i === 1 && (
                <span className="journey-univers-fallback" id="univers" />
              )}
              <div className="journey-fallback-art" aria-hidden="true">
                <img
                  {...responsiveScenery(project.backdrop)}
                  alt=""
                  width={1000}
                  height={650}
                  loading="lazy"
                />
                <Image
                  src={project.image}
                  alt=""
                  width={400}
                  height={300}
                  loading="lazy"
                />
              </div>
              <div className="journey-copy">
                <p className="journey-kicker">
                  <span>
                    {String(i + 1).padStart(2, '0')} /{' '}
                    {String(projects.length).padStart(2, '0')}
                  </span>
                  {project.genre}
                </p>
                <h2
                  id={project.id + '-title'}
                  className={'journey-project-brand brand-' + project.id}
                >
                  <Image
                    src={project.image}
                    alt={project.name}
                    width={600}
                    height={300}
                    loading="eager"
                  />
                </h2>
                {project.line && <p className="journey-line">{project.line}</p>}
                <p className="journey-description">{project.text}</p>
                <WorldSnapshots
                  projectId={project.id}
                  projectName={project.name}
                  label={t.galleryTitle}
                />
                <span className="journey-status">
                  <i />
                  {project.status}
                </span>
                <a
                  className="button journey-cta"
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {project.cta}
                  <ArrowUpRight size={21} />
                </a>
                {project.note && <small>{project.note}</small>}
              </div>
            </article>
          ))}
        </div>
        <fieldset className="journey-playback" aria-label={t.tourControls}>
          <button
            type="button"
            className="journey-autoplay"
            aria-pressed={autoPlaying}
            disabled={paused}
            onClick={() => runTour.current(!tourRunning.current)}
          >
            {autoPlaying ? <Pause size={16} /> : <Play size={16} />}
            <span>{autoPlaying ? t.tourPause : t.tourPlay}</span>
          </button>
          <select
            aria-label={t.tourSpeed}
            value={autoSpeed}
            onChange={(event) => {
              const speed = Number(event.target.value);
              tourSpeed.current = speed;
              setAutoSpeed(speed);
            }}
          >
            <option value={0.75}>0.75×</option>
            <option value={1}>1×</option>
            <option value={1.4}>1.4×</option>
          </select>
        </fieldset>
        <div className="journey-bottom">
          <div className="journey-count">
            <span className="journey-count-current">01</span>
            <span>/ {String(projects.length).padStart(2, '0')}</span>
          </div>
          <nav className="journey-navigation" aria-label={t.footerWorks}>
            {projects.map((project, i) => (
              <a
                key={project.id}
                href={'#' + project.id}
                aria-label={project.name}
                title={project.name}
              >
                <span>{String(i + 1).padStart(2, '0')}</span>
                <i />
              </a>
            ))}
          </nav>
          <a
            className="journey-caption"
            href="/credits-visuels.txt"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.visualCredits}
          </a>
        </div>
      </div>
      <div className="journey-markers" aria-hidden="true">
        <div data-univers />
        {projects.map((p) => (
          <div key={p.id} data-anchor={p.id} />
        ))}
      </div>
    </div>
  );
}
