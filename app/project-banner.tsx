'use client';

import { useRef, useEffect } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { WorldEffects } from './world-effects';

type BannerProps = {
  id: string;
  name: string;
  image: string;
  backdrop: string;
  color: string;
  genre: string;
  status: string;
  line?: string;
  text: string;
  cta: string;
  href: string;
  note?: string;
  illustration?: string;
  paused: boolean;
  title?: ReactNode;
  headingLevel?: 'h2' | 'h3';
};

export function ProjectBanner(props: BannerProps) {
  const { paused } = props;
  const panel = useRef<HTMLElement>(null);
  const Heading = props.headingLevel || 'h3';
  useEffect(() => {
    const element = panel.current;
    if (!element) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    let frame = 0,
      visible = false,
      pointerX = 0,
      pointerY = 0;
    const paint = () => {
      const rect = element.getBoundingClientRect();
      const y = (innerHeight / 2 - rect.top - rect.height / 2) / innerHeight;
      const moving = !paused && !reduced.matches;
      element.style.setProperty(
        '--pan-y',
        moving ? Math.max(-35, Math.min(35, y * 50)) + 'px' : '0px',
      );
      element.style.setProperty(
        '--pointer-x',
        moving ? pointerX * 18 + 'px' : '0px',
      );
      element.style.setProperty(
        '--pointer-y',
        moving ? pointerY * 12 + 'px' : '0px',
      );
      frame = 0;
    };
    const schedule = () => {
      if (visible && !frame) frame = requestAnimationFrame(paint);
    };
    const move = (event: PointerEvent) => {
      if (!fine.matches || paused || reduced.matches) return;
      const rect = element.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      schedule();
    };
    const reset = () => {
      pointerX = 0;
      pointerY = 0;
      schedule();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    });
    observer.observe(element);
    paint();
    element.addEventListener('pointermove', move, { passive: true });
    element.addEventListener('pointerleave', reset);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    reduced.addEventListener('change', paint);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerleave', reset);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      reduced.removeEventListener('change', paint);
    };
  }, [paused]);
  return (
    <article
      ref={panel}
      id={props.id}
      className={'project-panorama project-' + props.id}
      aria-labelledby={props.id + '-title'}
      style={{ '--world-color': props.color } as CSSProperties}
    >
      <Image
        className="panorama-background"
        src={props.backdrop}
        alt=""
        width={1920}
        height={1080}
        loading="lazy"
      />
      <div className="panorama-shade" aria-hidden="true" />
      <div className="section-wrap panorama-inner">
        <div className="panorama-copy reveal">
          <span className="status-chip">
            <i />
            {props.status}
          </span>
          <p className="panorama-genre">{props.genre}</p>
          <Heading id={props.id + '-title'}>
            {props.title || props.name}
          </Heading>
          {props.line && <p className="panorama-line">{props.line}</p>}
          <p className="panorama-text">{props.text}</p>
          <a
            className="button button-light"
            href={props.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {props.cta}
            <ArrowUpRight size={23} />
          </a>
          {props.note && <small>{props.note}</small>}
        </div>
        <div className="panorama-emblem">
          <Image
            className="panorama-logo"
            src={props.image}
            alt=""
            width={800}
            height={800}
            loading="lazy"
          />
        </div>
      </div>
      <WorldEffects theme={props.id} paused={paused} />
      {props.illustration && (
        <span className="panorama-caption">{props.illustration}</span>
      )}
    </article>
  );
}
