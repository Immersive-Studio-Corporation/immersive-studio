'use client';

import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

/** A lightweight, procedural field of faceted cubes and floating pixels. */
export function CinemaField({
  paused,
  progress,
}: {
  paused: boolean;
  progress: RefObject<number>;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const elapsed = useRef(0);
  const pointerPosition = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const context = element.getContext('2d', { alpha: true });
    if (!context) return;
    const ctx = context;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let width = 1,
      height = 1,
      frame = 0,
      time = elapsed.current,
      last = 0,
      pointerLeft = 0,
      pointerTop = 0;
    let visible = true;
    const diagnostics = process.env.NODE_ENV === 'development';
    let sampleStart = 0,
      sampleFrames = 0,
      sampleDrawMs = 0;
    const pointer = pointerPosition.current;
    const target = { ...pointer };
    // Reuse unit paths instead of allocating hundreds of polygon arrays per frame.
    const faces = [
      new Path2D('M0 -1L1 -.4L0 .2L-1 -.4Z'),
      new Path2D('M-1 -.4L0 .2L0 1.3L-1 .7Z'),
      new Path2D('M0 .2L1 -.4L1 .7L0 1.3Z'),
    ];
    const colors = [
      ['#fff0ffbb', '#c991ee88', '#7533bd99'],
      ['#efd2ff', '#a865e5', '#6521b3'],
    ];
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
    const render = () => {
      const p = reduced.matches ? 0 : progress.current;
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
          ctx.scale(size, size);
          for (let face = 0; face < faces.length; face++) {
            ctx.fillStyle = colors[dot.kind][face];
            ctx.fill(faces[face]);
          }
        } else {
          ctx.rotate(dot.phase + time * 0.1);
          ctx.fillStyle = i % 2 ? '#f9ebff' : '#7133b6';
          ctx.fillRect(-size * 0.17, -size * 0.17, size * 0.34, size * 0.34);
        }
        ctx.restore();
      }
    };
    const tick = (now: number) => {
      const dt = Math.min((now - (last || now)) / 1000, 0.05);
      last = now;
      time += dt;
      const blend = 1 - Math.exp(-dt * 18);
      pointer.x += (target.x - pointer.x) * blend;
      pointer.y += (target.y - pointer.y) * blend;
      const renderStart = diagnostics ? performance.now() : 0;
      render();
      if (diagnostics) {
        if (!sampleStart) sampleStart = now;
        sampleFrames++;
        sampleDrawMs += performance.now() - renderStart;
        if (now - sampleStart >= 1000) {
          element.dataset.fps = (
            ((sampleFrames - 1) * 1000) /
            (now - sampleStart)
          ).toFixed(1);
          element.dataset.drawMs = (sampleDrawMs / sampleFrames).toFixed(2);
          sampleStart = now;
          sampleFrames = 1;
          sampleDrawMs = 0;
        }
      }
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      sampleStart = 0;
      sampleFrames = 0;
      sampleDrawMs = 0;
      render();
      if (!paused && !reduced.matches && visible && !document.hidden)
        frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      const bounds = element.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      pointerLeft = bounds.left;
      pointerTop = bounds.top;
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      element.width = Math.round(width * dpr);
      element.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      render();
    };
    const move = (event: PointerEvent) => {
      if (
        paused ||
        reduced.matches ||
        !visible ||
        document.hidden ||
        event.pointerType !== 'mouse'
      )
        return;
      target.x = Math.max(
        -0.5,
        Math.min(0.5, (event.clientX - pointerLeft) / width - 0.5),
      );
      target.y = Math.max(
        -0.5,
        Math.min(0.5, (event.clientY - pointerTop) / height - 0.5),
      );
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        pointerLeft = entry.boundingClientRect.left;
        pointerTop = entry.boundingClientRect.top;
      }
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
  }, [paused, progress]);
  return <canvas className="cinema-field" ref={canvas} aria-hidden="true" />;
}
