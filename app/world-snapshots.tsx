'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

/** Large floating photograph; no modal, no interruption to music or scrolling. */
export function WorldSnapshots({
  projectId,
  projectName,
  label,
}: {
  projectId: string;
  projectName: string;
  label: string;
}) {
  const [preview, setPreview] = useState<{
    index: number;
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const show = (index: number, button: HTMLButtonElement) => {
    const vw = document.documentElement.clientWidth,
      vh = document.documentElement.clientHeight;
    const group = button.parentElement!.getBoundingClientRect();
    const header =
      document.querySelector('header')?.getBoundingClientRect().bottom || 80;
    const width = Math.min(740, vw < 761 ? vw - 28 : vw * 0.53);
    const height = Math.min(vh - header - 42, Math.max((width * 9) / 16, 260));
    const x = vw < 761 ? 14 : Math.min(vw - width - 24, group.right + 30);
    const y = Math.max(
      header + 18,
      Math.min(vh - height - 24, group.top - height * 0.65),
    );
    setPreview({ index, x, y, width, height });
  };
  useEffect(() => {
    const close = () => setPreview(null);
    window.addEventListener('scroll', close, { passive: true });
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close);
      window.removeEventListener('resize', close);
    };
  }, []);
  const path = (i: number) =>
    `/images/snapshots-20260921/${projectId}-${i + 1}`;
  return (
    <fieldset className="world-snapshots" aria-label={label}>
      {[0, 1, 2].map((i) => (
        <button
          key={i}
          className="world-snapshot"
          type="button"
          aria-label={`${projectName} · ${label} ${i + 1}`}
          aria-expanded={preview?.index === i}
          onPointerEnter={(e) => {
            if (e.pointerType !== 'touch') show(i, e.currentTarget);
          }}
          onPointerLeave={() => setPreview(null)}
          onFocus={(e) => show(i, e.currentTarget)}
          onBlur={() => setPreview(null)}
          onClick={(e) => show(i, e.currentTarget)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.stopPropagation();
              setPreview(null);
            }
          }}
        >
          <Image
            src={`${path(i)}-thumb.webp?v=focus-2`}
            width={640}
            height={360}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </button>
      ))}
      {preview &&
        createPortal(
          <div
            className="snapshot-window"
            aria-hidden="true"
            style={{
              left: preview.x,
              top: preview.y,
              width: preview.width,
              height: preview.height,
            }}
          >
            <Image
              src={`${path(preview.index)}.webp?v=focus-2`}
              alt=""
              width={3840}
              height={2160}
              decoding="async"
            />
          </div>,
          document.body,
        )}
    </fieldset>
  );
}
