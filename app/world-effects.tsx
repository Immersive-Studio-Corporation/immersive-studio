'use client';

import { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  age: number;
  life: number;
  angle: number;
  tone: number;
};

/** Pointer trails use each world's visual vocabulary; the canvas never captures input. */
export function WorldEffects({
  theme,
  paused,
}: {
  theme: string;
  paused: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = canvas.current;
    const panel = element?.closest<HTMLElement>('.project-panorama');
    const context = element?.getContext('2d');
    if (!element || !panel || !context) return;
    const ctx = context;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const leaf = theme === 'last' ? new window.Image() : null;
    if (leaf) leaf.src = '/images/leaf-sprite.webp';
    let width = 1,
      height = 1,
      frame = 0,
      previous = 0,
      lastEmission = 0;
    let visible = false;
    let lastPoint: { x: number; y: number } | null = null;
    let particles: Particle[] = [];
    const clear = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      particles = [];
      lastPoint = null;
      ctx.clearRect(0, 0, width, height);
    };
    const draw = (particle: Particle) => {
      const { x, y, size, age, life, tone, angle } = particle;
      const fade = Math.pow(Math.max(0, 1 - age / life), 1.25);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = fade;
      if (theme === 'heritage') {
        ctx.fillStyle = '#ffe8a6';
        ctx.shadowColor = '#ffc45a';
        ctx.shadowBlur = 9;
        if (tone === 0) {
          ctx.beginPath();
          ctx.moveTo(0, -size * 1.8);
          ctx.lineTo(size * 0.22, -size * 0.22);
          ctx.lineTo(size * 1.5, 0);
          ctx.lineTo(size * 0.22, size * 0.22);
          ctx.lineTo(0, size * 1.8);
          ctx.lineTo(-size * 0.22, size * 0.22);
          ctx.lineTo(-size * 1.5, 0);
          ctx.lineTo(-size * 0.22, -size * 0.22);
          ctx.closePath();
          ctx.fill();
        } else ctx.fillRect(-size / 2, -size / 2, size, size);
      } else if (theme === 'percy') {
        // Bubbles are intentionally exclusive to the ocean project.
        const r = size * (1 + (age / life) * 0.35);
        const glass = ctx.createRadialGradient(-r * 0.3, -r * 0.35, 0, 0, 0, r);
        glass.addColorStop(0, '#d7fcff28');
        glass.addColorStop(0.7, '#5cceff0a');
        glass.addColorStop(1, '#9eeaff55');
        ctx.fillStyle = glass;
        ctx.strokeStyle = '#c2f5ffe6';
        ctx.lineWidth = 1.15;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.73, Math.PI * 1.03, Math.PI * 1.48);
        ctx.stroke();
      } else if (theme === 'teen') {
        // Tapered, fractured cuts with a dark core instead of rounded neon bars.
        ctx.rotate(-0.24);
        for (let claw = 0; claw < 3; claw++) {
          const offset = (claw - 1) * size * 0.43;
          const length = size * [2.25, 2.8, 2.45][claw];
          const cut = ctx.createLinearGradient(offset - 5, 0, offset + 6, 0);
          cut.addColorStop(0, '#ffd7b7');
          cut.addColorStop(0.2, '#e45748');
          cut.addColorStop(0.42, '#380914');
          cut.addColorStop(0.72, '#6b1124');
          cut.addColorStop(1, '#ed8570');
          ctx.beginPath();
          ctx.moveTo(offset + 8, -length * 0.54);
          ctx.lineTo(offset + 2, -length * 0.2);
          ctx.lineTo(offset - 3, -length * 0.06);
          ctx.lineTo(offset - 4, length * 0.2);
          ctx.lineTo(offset - 12, length * 0.57);
          ctx.lineTo(offset - 5, length * 0.25);
          ctx.lineTo(offset + 2, length * 0.07);
          ctx.lineTo(offset + 3, -length * 0.09);
          ctx.lineTo(offset + 8, -length * 0.3);
          ctx.closePath();
          ctx.fillStyle = cut;
          ctx.fill();
        }
      } else if (theme === 'nations') {
        if (tone === 0) {
          // Liquid drops: a bright rim, a transparent blue body and a falling tail.
          const water = ctx.createLinearGradient(-size, -size, size, size);
          water.addColorStop(0, '#e4ffff');
          water.addColorStop(0.3, '#89eaffd9');
          water.addColorStop(1, '#179be8a0');
          ctx.fillStyle = water;
          ctx.strokeStyle = '#b8f5ff';
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(0, -size * 1.45);
          ctx.bezierCurveTo(
            -size * 0.2,
            -size * 0.65,
            -size * 0.8,
            -size * 0.1,
            -size * 0.7,
            size * 0.35,
          );
          ctx.bezierCurveTo(
            -size * 0.55,
            size * 1.1,
            size * 0.7,
            size * 1.1,
            size * 0.7,
            size * 0.25,
          );
          ctx.bezierCurveTo(
            size * 0.65,
            -size * 0.25,
            size * 0.15,
            -size * 0.8,
            0,
            -size * 1.45,
          );
          ctx.fill();
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(-size * 0.25, 0);
          ctx.lineTo(-size * 0.3, size * 0.4);
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 1.3;
          ctx.stroke();
        } else if (tone === 1) {
          // Overlapping, rising hot particles form a flickering flame plume.
          ctx.translate(Math.sin(age * 13 + angle) * size * 0.4, 0);
          ctx.scale(0.62, 1.6);
          const flame = ctx.createRadialGradient(0, size * 0.3, 0, 0, 0, size);
          flame.addColorStop(0, '#fff8b0');
          flame.addColorStop(0.25, '#ffd346');
          flame.addColorStop(0.55, '#ff8b13ee');
          flame.addColorStop(0.82, '#e6400b90');
          flame.addColorStop(1, '#bb220000');
          ctx.fillStyle = flame;
          ctx.beginPath();
          ctx.arc(0, 0, size, 0, Math.PI * 2);
          ctx.fill();
        } else if (tone === 2) {
          // Solid earthen fragments, with three ochre faces and a falling weight.
          const face = (points: number[][], fill: string) => {
            ctx.beginPath();
            points.forEach(([px, py], i) =>
              i ? ctx.lineTo(px, py) : ctx.moveTo(px, py),
            );
            ctx.closePath();
            ctx.fillStyle = fill;
            ctx.fill();
          };
          face(
            [
              [0, -size],
              [size, -size * 0.4],
              [size * 0.3, size * 0.15],
              [-size, -size * 0.25],
            ],
            '#c7a77b',
          );
          face(
            [
              [-size, -size * 0.25],
              [size * 0.3, size * 0.15],
              [size * 0.15, size],
              [-size * 0.85, size * 0.5],
            ],
            '#826649',
          );
          face(
            [
              [size * 0.3, size * 0.15],
              [size, -size * 0.4],
              [size * 0.9, size * 0.6],
              [size * 0.15, size],
            ],
            '#574938',
          );
        } else {
          // Long, pale air currents curl away from the cursor without a halo.
          ctx.strokeStyle = '#f2fdff';
          ctx.shadowColor = '#d8f9ff';
          ctx.shadowBlur = 4;
          for (let ribbon = 0; ribbon < 3; ribbon++) {
            const yOffset = (ribbon - 1) * size * 0.38;
            ctx.lineWidth = (1.4 - ribbon * 0.25) * fade;
            ctx.beginPath();
            ctx.moveTo(-size * 2.5, yOffset);
            ctx.bezierCurveTo(
              -size * 0.2,
              yOffset - size * 0.9,
              size * 1.7,
              yOffset + size * 0.8,
              size * 2.6,
              yOffset - size * 0.2,
            );
            ctx.stroke();
          }
        }
      } else if (theme === 'avengers') {
        ctx.strokeStyle = '#baffb4';
        ctx.shadowColor = '#52ff97';
        ctx.shadowBlur = 10;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-size * 2, -size);
        ctx.lineTo(-size * 0.3, -size * 0.15);
        ctx.lineTo(-size * 0.7, size * 0.7);
        ctx.lineTo(size * 1.8, size * 0.3);
        ctx.stroke();
      } else if (theme === 'newgen') {
        // Tiny faceted blocks echo the Minecraft minigame playground.
        const s = size * 1.8;
        ctx.fillStyle = ['#95e8f6', '#eed3a4', '#b9a2ee', '#9fdcca'][tone];
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(s, -s * 0.45);
        ctx.lineTo(0, s * 0.1);
        ctx.lineTo(-s, -s * 0.45);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#397b9d';
        ctx.beginPath();
        ctx.moveTo(-s, -s * 0.45);
        ctx.lineTo(0, s * 0.1);
        ctx.lineTo(0, s * 1.15);
        ctx.lineTo(-s, s * 0.6);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#76bcd3';
        ctx.beginPath();
        ctx.moveTo(s, -s * 0.45);
        ctx.lineTo(0, s * 0.1);
        ctx.lineTo(0, s * 1.15);
        ctx.lineTo(s, s * 0.6);
        ctx.closePath();
        ctx.fill();
      } else if (leaf?.complete && leaf.naturalWidth) {
        const flutter = 0.68 + Math.sin(age * 2.7 + angle) * 0.27;
        ctx.rotate(Math.sin(age * 2.3 + angle) * 0.4);
        ctx.scale(flutter, 1);
        ctx.globalAlpha = Math.min(1, Math.max(0, (life - age) / 0.8));
        const leafWidth = (size * leaf.naturalWidth) / leaf.naturalHeight;
        ctx.drawImage(leaf, -leafWidth / 2, -size / 2, leafWidth, size);
      }
      ctx.restore();
    };
    const tick = (now: number) => {
      if (!previous) previous = now;
      const dt = Math.min((now - previous) / 1000, 0.04);
      previous = now;
      ctx.clearRect(0, 0, width, height);
      particles = particles.filter((particle) => particle.age < particle.life);
      for (const particle of particles) {
        particle.age += dt;
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        particle.vx *= Math.pow(0.78, dt);
        if (theme === 'heritage') particle.vy += 16 * dt;
        if (theme === 'nations')
          particle.vy += [55, -65, 82, 0][particle.tone] * dt;
        if (theme === 'last')
          particle.x += Math.sin(particle.age * 3 + particle.angle) * 7 * dt;
        draw(particle);
      }
      frame = particles.length ? requestAnimationFrame(tick) : 0;
      if (!frame) previous = 0;
    };
    const emit = (event: PointerEvent) => {
      if (
        paused ||
        reduced.matches ||
        !visible ||
        document.hidden ||
        event.pointerType !== 'mouse'
      )
        return;
      const now = performance.now();
      if (
        now - lastEmission <
        (theme === 'teen' ? 105 : theme === 'last' ? 70 : 28)
      )
        return;
      if (theme === 'last' && !leaf?.complete) return;
      lastEmission = now;
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left,
        y = event.clientY - rect.top;
      const dx = lastPoint ? Math.max(-30, Math.min(30, x - lastPoint.x)) : 0;
      const dy = lastPoint ? Math.max(-30, Math.min(30, y - lastPoint.y)) : 0;
      lastPoint = { x, y };
      let nationTone = 0;
      if (theme === 'nations') {
        const emblem = panel
          .querySelector('.panorama-emblem')
          ?.getBoundingClientRect();
        const nx = emblem
          ? (event.clientX - emblem.left - emblem.width / 2) /
            (emblem.width / 2)
          : x / width - 0.5;
        const ny = emblem
          ? (event.clientY - emblem.top - emblem.height / 2) /
            (emblem.height / 2)
          : y / height - 0.5;
        nationTone =
          Math.abs(nx) > Math.abs(ny) ? (nx < 0 ? 0 : 3) : ny < 0 ? 1 : 2;
      }
      const count =
        theme === 'nations'
          ? [3, 5, 3, 2][nationTone]
          : theme === 'teen' || theme === 'last'
            ? 1
            : theme === 'percy'
              ? 2
              : 4;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const tone =
          theme === 'nations' ? nationTone : Math.floor(Math.random() * 4);
        particles.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          vx:
            theme === 'nations'
              ? tone === 3
                ? 55 + Math.random() * 30
                : (Math.random() - 0.5) * 45
              : theme === 'teen'
                ? 0
                : theme === 'last'
                  ? -12 + Math.random() * 24 + dx * 0.4
                  : Math.cos(angle) * 22 + dx * 0.4,
          vy:
            theme === 'nations'
              ? [25, -45, 20, 0][tone] + (Math.random() - 0.5) * 15
              : theme === 'percy'
                ? -25 - Math.random() * 27
                : theme === 'teen'
                  ? 0
                  : theme === 'last'
                    ? 20 + Math.random() * 20
                    : Math.sin(angle) * 25 + dy * 0.25,
          size:
            theme === 'nations'
              ? [7, 12, 5, 9][tone] + Math.random() * [6, 10, 4, 7][tone]
              : theme === 'percy'
                ? 5 + Math.random() * 11
                : theme === 'teen'
                  ? 24 + Math.random() * 13
                  : theme === 'last'
                    ? 38 + Math.random() * 32
                    : 1.5 + Math.random() * 4,
          age: 0,
          life:
            theme === 'nations'
              ? [1.2, 0.8, 1.4, 0.95][tone]
              : theme === 'teen'
                ? 1.3
                : theme === 'last'
                  ? 2.8 + Math.random()
                  : 1 + Math.random() * 0.8,
          angle:
            theme === 'teen'
              ? -0.12
              : theme === 'nations' && tone !== 2
                ? 0
                : angle,
          tone,
        });
      }
      const limit = theme === 'last' ? 32 : theme === 'teen' ? 14 : 150;
      if (particles.length > limit)
        particles.splice(0, particles.length - limit);
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      const rect = element.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      element.width = Math.round(width * ratio);
      element.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const resetPointer = () => {
      lastPoint = null;
    };
    const visibility = () => {
      if (document.hidden) clear();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) clear();
    });
    const sizes = new ResizeObserver(resize);
    observer.observe(element);
    sizes.observe(element);
    resize();
    panel.addEventListener('pointermove', emit, { passive: true });
    panel.addEventListener('pointerleave', resetPointer);
    reduced.addEventListener('change', clear);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      clear();
      observer.disconnect();
      sizes.disconnect();
      panel.removeEventListener('pointermove', emit);
      panel.removeEventListener('pointerleave', resetPointer);
      reduced.removeEventListener('change', clear);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [theme, paused]);
  return <canvas className="world-effects" ref={canvas} aria-hidden="true" />;
}
