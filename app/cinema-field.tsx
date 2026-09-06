'use client';

import { useEffect, useRef } from 'react';

/** A lightweight, procedural field of faceted cubes and floating pixels. */
export function CinemaField({ paused }: { paused: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const elapsed = useRef(0);
  const pointerPosition = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const context = element.getContext('2d', { alpha: true });
    if (!context) return;
    const ctx = context;
    const parent = element.closest<HTMLElement>('.intro-scroll');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let width = 1,
      height = 1,
      frame = 0,
      time = elapsed.current,
      last = 0;
    let visible = true;
    const pointer = pointerPosition.current;
    // Stable seed: particles do not jump when motion is paused or resumed.
    let seed = 287;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const particles = Array.from({ length: 132 }, (_, i) => ({
      x: random(),
      y: random(),
      size: 4 + random() * (i % 5 === 0 ? 43 : 16),
      phase: random() * Math.PI * 2,
      speed: 0.3 + random() * 0.7,
      kind: i % 3,
      depth: 0.25 + random() * 0.75,
    }));
    const polygon = (points: number[][], color: string) => {
      ctx.beginPath();
      points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    };
    const render = () => {
      const p = Number(parent?.style.getPropertyValue('--progress') || 0);
      ctx.clearRect(0, 0, width, height);
      const centerX = width * (0.78 - Math.min(1, p * 2.4) * 0.28);
      const centerY = height * 0.46;
      const focus = Math.sin(p * Math.PI);
      const count = width < 650 ? 66 : particles.length;
      for (let i = 0; i < count; i++) {
        const dot = particles[i];
        const driftY =
          ((dot.y * height - time * 9 * dot.speed + height * 100) %
            (height + 160)) -
          80;
        const orbit = dot.phase + time * 0.09 + p * Math.PI * 2.7;
        const radial = Math.min(width, height) * (0.28 + dot.x * 0.45);
        const naturalX = dot.x * width + Math.sin(time * 0.2 + dot.phase) * 22;
        const blend = focus * 0.78;
        const x =
          naturalX * (1 - blend) +
          (centerX + Math.cos(orbit) * radial) * blend +
          pointer.x * dot.depth * 20;
        const y =
          driftY * (1 - blend) +
          (centerY + Math.sin(orbit) * radial * 0.68) * blend +
          pointer.y * dot.depth * 18;
        const size = dot.size * (0.65 + dot.depth * 0.5) * (1 + focus * 0.45);
        const quiet =
          p < 0.2 && x < width * 0.62 && y > height * 0.15 && y < height * 0.88;
        ctx.save();
        ctx.translate(x, y);
        ctx.globalAlpha = quiet ? 0.12 : 0.35 + dot.depth * 0.42;
        if (dot.kind !== 2) {
          ctx.rotate(Math.sin(time * 0.15 + dot.phase) * 0.2);
          polygon(
            [
              [0, -size],
              [size, -size * 0.4],
              [0, size * 0.2],
              [-size, -size * 0.4],
            ],
            dot.kind === 0 ? '#fff0ffbb' : '#efd2ff',
          );
          polygon(
            [
              [-size, -size * 0.4],
              [0, size * 0.2],
              [0, size * 1.3],
              [-size, size * 0.7],
            ],
            dot.kind === 0 ? '#c991ee88' : '#a865e5',
          );
          polygon(
            [
              [0, size * 0.2],
              [size, -size * 0.4],
              [size, size * 0.7],
              [0, size * 1.3],
            ],
            dot.kind === 0 ? '#7533bd99' : '#6521b3',
          );
        } else {
          ctx.rotate(dot.phase + time * 0.1);
          ctx.fillStyle = i % 2 ? '#f9ebff' : '#7133b6';
          ctx.fillRect(-size * 0.17, -size * 0.17, size * 0.34, size * 0.34);
        }
        ctx.restore();
      }
    };
    const tick = (now: number) => {
      if (now - last >= 32) {
        time += Math.min((now - (last || now)) / 1000, 0.05);
        last = now;
        render();
      }
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      render();
      if (!paused && !reduced.matches && visible && !document.hidden)
        frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      const bounds = element.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      element.width = Math.round(width * dpr);
      element.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      render();
    };
    const move = (event: PointerEvent) => {
      if (paused || reduced.matches || event.pointerType !== 'mouse') return;
      const rect = element.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / width - 0.5;
      pointer.y = (event.clientY - rect.top) / height - 0.5;
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    const sizes = new ResizeObserver(resize);
    observer.observe(element);
    sizes.observe(element);
    document.addEventListener('visibilitychange', sync);
    reduced.addEventListener('change', sync);
    window.addEventListener('pointermove', move, { passive: true });
    resize();
    sync();
    return () => {
      elapsed.current = time;
      cancelAnimationFrame(frame);
      observer.disconnect();
      sizes.disconnect();
      document.removeEventListener('visibilitychange', sync);
      reduced.removeEventListener('change', sync);
      window.removeEventListener('pointermove', move);
    };
  }, [paused]);
  return <canvas className="cinema-field" ref={canvas} aria-hidden="true" />;
}
