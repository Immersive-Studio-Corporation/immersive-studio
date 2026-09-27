'use client';

import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import {
  cubeVertices,
  cubeFaces,
  rotateVertex,
  perspectiveScale,
} from './cinema-geometry';

/** Lit cube meshes projected through a moving camera, with atmospheric depth. */
export function CinemaField({
  paused,
  progress,
  energy,
}: {
  paused: boolean;
  progress: RefObject<number>;
  energy?: RefObject<number>;
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
    const diagnostics =
      process.env.NODE_ENV === 'development' ||
      new URLSearchParams(location.search).has('diagnostics');
    let sampleStart = 0,
      sampleFrames = 0,
      sampleDrawMs = 0;
    const pointer = pointerPosition.current;
    const target = { ...pointer };
    let seed = 287;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const particles = Array.from({ length: 84 }, (_, i) => ({
      u: random(),
      v: random(),
      z: 280 + random() * 2600,
      size: i % 9 === 0 ? 55 + random() * 28 : 12 + random() * 27,
      phase: random() * Math.PI * 2,
      speed: 13 + random() * 16,
      spin: (random() - 0.5) * 0.22,
      hue: 260 + random() * 18,
      distance: 0,
    }));
    const drawOrder = [...particles];
    const soft = (value: number) => {
      const n = Math.max(0, Math.min(1, value));
      return n * n * (3 - 2 * n);
    };
    const render = () => {
      const p = reduced.matches ? 0 : progress.current;
      const surge = energy?.current || 0;
      ctx.clearRect(0, 0, width, height);
      if (width < 1 || height < 1) return;
      const focal = Math.min(width, height) * 0.95;
      const centerX = width * (0.57 + Math.sin(time * 0.08) * 0.012);
      const centerY = height * 0.47;
      const cameraX = pointer.x * 150;
      const cameraY = pointer.y * 110;
      const cameraTravel = p * 530 + surge * 26;
      for (const cube of particles) {
        cube.distance =
          220 +
          ((((cube.z - time * cube.speed - cameraTravel) % 2800) + 2800) %
            2800);
      }
      // Painter order gives correct occlusion between cubes. Each mesh also
      // culls its back faces, so the silhouette changes as it rotates in 3D.
      drawOrder.sort((a, b) => b.distance - a.distance);
      const count = width < 650 ? 48 : particles.length;
      for (const cube of drawOrder) {
        if (particles.indexOf(cube) >= count) continue;
        const z = cube.distance;
        const x = (((cube.u - 0.5) * width * cube.z) / focal) * 1.35 - cameraX;
        const y =
          (((cube.v - 0.5) * height * cube.z) / focal) * 1.35 -
          cameraY +
          Math.sin(time * 0.3 + cube.phase) * 30;
        const scale = perspectiveScale(focal, z);
        const screenX = centerX + x * scale,
          screenY = centerY + y * scale;
        const radius = cube.size * scale * 1.8;
        if (
          screenX < -radius ||
          screenX > width + radius ||
          screenY < -radius ||
          screenY > height + radius
        )
          continue;
        const nearFade = soft((z - 220) / 330);
        const farFade = soft((3020 - z) / 650);
        const fog = Math.min(0.88, Math.max(0, (z - 450) / 2800));
        const quiet =
          (1 - soft(p / 0.2)) *
          (1 - soft((screenX / width - 0.48) / 0.2)) *
          soft((screenY / height - 0.08) / 0.14) *
          (1 - soft((screenY / height - 0.8) / 0.14));
        const entrance = reduced.matches
          ? 1
          : soft((time - cube.phase * 0.12) / 2.4);
        const alpha = nearFade * farFade * (0.88 - quiet * 0.56) * entrance;
        if (alpha < 0.015) continue;
        const ax = cube.phase + time * cube.spin * 0.65 + p * 0.7;
        const ay = cube.phase * 1.6 + time * cube.spin + pointer.x * 0.15;
        const az = Math.sin(time * 0.13 + cube.phase) * 0.3;
        const vertices = cubeVertices.map(([vx, vy, vz]) => {
          const r = rotateVertex(vx, vy, vz, ax, ay, az);
          return [
            r[0] * cube.size + x,
            r[1] * cube.size + y,
            r[2] * cube.size + z,
          ];
        });
        const projected = vertices.map(([vx, vy, vz]) => [
          centerX + vx * perspectiveScale(focal, vz),
          centerY + vy * perspectiveScale(focal, vz),
        ]);
        ctx.globalAlpha = alpha;
        for (const face of cubeFaces) {
          const [a, b, c] = face.map((index) => vertices[index]);
          const ux = b[0] - a[0],
            uy = b[1] - a[1],
            uz = b[2] - a[2];
          const vx = c[0] - a[0],
            vy = c[1] - a[1],
            vz = c[2] - a[2];
          let nx = uy * vz - uz * vy,
            ny = uz * vx - ux * vz,
            nz = ux * vy - uy * vx;
          if (nx * a[0] + ny * a[1] + nz * a[2] >= 0) continue;
          const length = Math.hypot(nx, ny, nz);
          nx /= length;
          ny /= length;
          nz /= length;
          const diffuse = Math.max(0, nx * -0.43 + ny * -0.68 + nz * -0.59);
          const light = 28 + diffuse * 49;
          const saturation = 65 - fog * 40;
          const luminosity = light + (80 - light) * fog;
          const points = face.map((index) => projected[index]);
          ctx.beginPath();
          ctx.moveTo(points[0][0], points[0][1]);
          for (let i = 1; i < 4; i++) ctx.lineTo(points[i][0], points[i][1]);
          ctx.closePath();
          if (z < 1250) {
            const sheen = ctx.createLinearGradient(
              points[0][0],
              points[0][1],
              points[2][0],
              points[2][1],
            );
            sheen.addColorStop(
              0,
              `hsl(${cube.hue} ${saturation}% ${Math.min(94, luminosity + 12)}%)`,
            );
            sheen.addColorStop(
              0.48,
              `hsl(${cube.hue} ${saturation}% ${luminosity}%)`,
            );
            sheen.addColorStop(
              1,
              `hsl(${cube.hue} ${saturation}% ${Math.max(18, luminosity - 7)}%)`,
            );
            ctx.fillStyle = sheen;
          } else
            ctx.fillStyle = `hsl(${cube.hue} ${saturation}% ${luminosity}%)`;
          ctx.fill();
          ctx.lineWidth = Math.min(1.2, Math.max(0.4, scale));
          ctx.strokeStyle = `rgba(250,235,255,${0.12 + diffuse * 0.22})`;
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    };
    const tick = (now: number) => {
      const dt = Math.min((now - (last || now)) / 1000, 0.05);
      last = now;
      time += dt;
      const blend = 1 - Math.exp(-dt * 5);
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
      // Keep the particle layer inexpensive even on a large 4K monitor. The
      // backgrounds and main vector cube keep their own full-resolution layers.
      const dpr = Math.min(
        devicePixelRatio || 1,
        1.5,
        Math.sqrt(3_200_000 / Math.max(1, width * height)),
      );
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
  }, [paused, progress, energy]);
  return <canvas className="cinema-field" ref={canvas} aria-hidden="true" />;
}
