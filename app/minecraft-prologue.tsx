'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { AvatarGreeting } from './avatar-greeting';

export function MinecraftPrologue({
  title,
  detail,
  paused,
}: {
  title: string;
  detail: string;
  paused: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const stopped = useRef(paused);
  const redraw = useRef<() => void>(() => {});
  useEffect(() => {
    stopped.current = paused;
    redraw.current();
  }, [paused]);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const metadata = element.dataset;
    const journey = element.closest<HTMLElement>('.project-journey');
    const opening = element.closest<HTMLElement>('.journey-opening');
    if (!journey || !opening) return;
    let disposed = false,
      cleanup = () => {};
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    void Promise.all([import('three'), import('./minecraft-avatar')])
      .then(([T, { minecraftAvatar }]) => {
        if (disposed) return;
        let renderer: import('three').WebGLRenderer;
        try {
          renderer = new T.WebGLRenderer({
            canvas: element,
            alpha: true,
            antialias: true,
            powerPreference: 'low-power',
          });
        } catch {
          return;
        }
        renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
        renderer.outputColorSpace = T.SRGBColorSpace;
        const scene = new T.Scene();
        const camera = new T.PerspectiveCamera(33, 1, 0.1, 70);
        camera.position.set(0, 1.65, 7.4);
        camera.lookAt(0, 1, 0);
        scene.add(new T.HemisphereLight(0xf5e6ff, 0x643896, 3));
        const key = new T.DirectionalLight(0xffffff, 3.8);
        key.position.set(-3, 6, 5);
        scene.add(key);
        const rim = new T.DirectionalLight(0xb46bff, 5);
        rim.position.set(4, 3, -3);
        scene.add(rim);
        const cubeGeo = new T.BoxGeometry(1, 1, 1);
        const materials = [
          new T.MeshStandardMaterial({
            color: 0x9852dc,
            metalness: 0.25,
            roughness: 0.35,
          }),
          new T.MeshStandardMaterial({
            color: 0xcd9aff,
            metalness: 0.12,
            roughness: 0.35,
          }),
        ];
        const cubes = Array.from({ length: 18 }, (_, i) => {
          const mesh = new T.Mesh(cubeGeo, materials[i % 2]);
          const angle = i * 2.399;
          const radius = 2.2 + (i % 4) * 0.32;
          mesh.position.set(
            Math.cos(angle) * radius,
            1 + Math.sin(angle) * 2,
            -1.5 - (i % 5) * 0.65,
          );
          mesh.scale.setScalar(0.13 + (i % 5) * 0.095);
          mesh.rotation.set(i * 0.31, i * 0.49, i * 0.23);
          scene.add(mesh);
          return mesh;
        });
        const texture = new T.TextureLoader().load(
          '/images/aslan-hogan-skin.png',
          () => {
            if (!disposed) {
              element.dataset.ready = 'true';
              draw();
            }
          },
        );
        texture.colorSpace = T.SRGBColorSpace;
        texture.magFilter = T.NearestFilter;
        texture.minFilter = T.NearestFilter;
        const avatar = minecraftAvatar(texture);
        scene.add(avatar.root);
        avatar.root.rotation.y = -0.18;
        let frame = 0,
          last = 0,
          time = 0;
        const greeting = new AvatarGreeting();
        const raycaster = new T.Raycaster();
        const pointer = new T.Vector2();
        const active = () =>
          !disposed &&
          !document.hidden &&
          journey.dataset.visible !== 'false' &&
          journey.dataset.project === 'intro';
        function draw(now = performance.now()) {
          frame = 0;
          if (disposed) return;
          const dt = Math.min(0.05, Math.max(0, (now - (last || now)) / 1000));
          last = now;
          if (!stopped.current && !reduced.matches && active()) time += dt;
          const drift = Math.sin(time * 0.34);
          avatar.root.position.set(
            drift * 0.82,
            Math.sin(time * 0.9) * 0.15,
            Math.cos(time * 0.34) * 0.25,
          );
          avatar.root.rotation.set(
            Math.sin(time * 0.5) * 0.055,
            -0.18 + Math.sin(time * 0.32) * 0.32,
            Math.sin(time * 0.43) * 0.09,
          );
          const hello = greeting.pose(time);
          avatar.root.rotation.y *= 1 - hello.weight * 0.65;
          avatar.head.rotation.set(
            -0.09 + Math.sin(time * 0.61) * 0.13,
            Math.sin(time * 0.67) * 0.58,
            Math.sin(time * 0.39) * 0.075,
          );
          avatar.leftArm.rotation.set(
            0.18 + Math.sin(time * 0.8) * 0.2,
            0,
            0.3 + Math.sin(time * 0.7) * 0.12,
          );
          avatar.rightArm.rotation.set(
            -0.15 + Math.sin(time * 0.8 + 1) * 0.22,
            0,
            -0.25 - Math.sin(time * 0.65) * 0.1,
          );
          avatar.leftLeg.rotation.set(Math.sin(time * 0.65) * 0.12, 0, 0.2);
          avatar.rightLeg.rotation.set(
            Math.sin(time * 0.65 + 2) * 0.1,
            0,
            -0.2,
          );
          // Face the visitor, lift the right hand, wave, then return to drifting.
          avatar.head.rotation.x = T.MathUtils.lerp(
            avatar.head.rotation.x,
            0.035,
            hello.weight,
          );
          avatar.head.rotation.y = T.MathUtils.lerp(
            avatar.head.rotation.y,
            -avatar.root.rotation.y,
            hello.weight,
          );
          avatar.head.rotation.z *= 1 - hello.weight;
          avatar.rightArm.rotation.x = T.MathUtils.lerp(
            avatar.rightArm.rotation.x,
            -0.22,
            hello.weight,
          );
          avatar.rightArm.rotation.z = T.MathUtils.lerp(
            avatar.rightArm.rotation.z,
            -2.65 + hello.swing,
            hello.weight,
          );
          metadata.greeting = hello.active ? 'waving' : 'idle';
          metadata.greetings = String(greeting.count);
          cubes.forEach((cube, i) => {
            cube.rotation.y = i * 0.49 + time * 0.035;
            cube.rotation.x = i * 0.31 + Math.sin(time * 0.23 + i) * 0.2;
          });
          renderer.render(scene, camera);
          if (active() && !stopped.current && !reduced.matches)
            frame = requestAnimationFrame(draw);
          else last = 0;
        }
        const sync = () => {
          if (frame) cancelAnimationFrame(frame);
          frame = 0;
          last = 0;
          if (active()) draw();
        };
        const point = (event: PointerEvent) => {
          if (!active() || stopped.current || reduced.matches) return;
          if (Number(getComputedStyle(element.parentElement!).opacity) < 0.1)
            return;
          const rect = element.getBoundingClientRect();
          pointer.set(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            1 - ((event.clientY - rect.top) / rect.height) * 2,
          );
          raycaster.setFromCamera(pointer, camera);
          const hit = raycaster.intersectObject(avatar.root, true).length > 0;
          greeting.enter(hit, time);
          element.dataset.hovered = String(hit);
        };
        const leave = () => greeting.enter(false, time);
        journey.addEventListener('pointermove', point);
        journey.addEventListener('pointerdown', point);
        journey.addEventListener('pointerleave', leave);
        const resize = () => {
          const r = element.getBoundingClientRect();
          if (!r.width || !r.height) return;
          renderer.setSize(r.width, r.height, false);
          camera.aspect = r.width / r.height;
          camera.position.z = Math.max(
            7.4,
            1.8 / (Math.tan((camera.fov * Math.PI) / 360) * camera.aspect),
          );
          camera.lookAt(0, 1, 0);
          camera.updateProjectionMatrix();
          sync();
        };
        const sizes = new ResizeObserver(resize);
        sizes.observe(element);
        const observer = new MutationObserver(sync);
        observer.observe(journey, {
          attributes: true,
          attributeFilter: ['data-project', 'data-visible'],
        });
        document.addEventListener('visibilitychange', sync);
        reduced.addEventListener('change', sync);
        redraw.current = sync;
        resize();
        cleanup = () => {
          cancelAnimationFrame(frame);
          sizes.disconnect();
          observer.disconnect();
          document.removeEventListener('visibilitychange', sync);
          journey.removeEventListener('pointermove', point);
          journey.removeEventListener('pointerdown', point);
          journey.removeEventListener('pointerleave', leave);
          reduced.removeEventListener('change', sync);
          avatar.dispose();
          texture.dispose();
          cubeGeo.dispose();
          materials.forEach((m) => m.dispose());
          renderer.dispose();
        };
      })
      .catch(() => {
        element.dataset.ready = 'unavailable';
      });
    return () => {
      disposed = true;
      redraw.current = () => {};
      cleanup();
    };
  }, []);
  return (
    <>
      <div className="intro-avatar" aria-hidden="true">
        <canvas ref={canvas} />
      </div>
      <div className="minecraft-prologue">
        <p>{title}</p>
        <Image
          className="minecraft-wordmark"
          src="/images/minecraft-logo.png"
          alt="Minecraft"
          width={1200}
          height={204}
        />
        <span>{detail}</span>
      </div>
    </>
  );
}
