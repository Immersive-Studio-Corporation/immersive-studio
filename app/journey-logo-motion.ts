import { ramp } from './journey-timeline.ts';

export type LogoDock = { x: number; y: number; width: number; height: number };

/** One reversible journey for the same emblem: appear, fill the stage, dock. */
export function logoPose(
  progress: number,
  width: number,
  height: number,
  dock: LogoDock,
  aspect = dock.width / dock.height,
) {
  const arrival = ramp(progress, 0.025, 0.27);
  const grow = ramp(progress, 0.025, 0.34);
  const travel = ramp(progress, 0.59, 0.8);
  const contentWidth = Math.min(dock.width, dock.height * aspect);
  const contentHeight = contentWidth / aspect;
  const large = Math.min(
    (width * 0.88) / contentWidth,
    (height * 0.82) / contentHeight,
    6,
  );
  const scale = (0.12 + (large - 0.12) * grow) * (1 - travel) + travel;
  return {
    x: width * 0.5 * (1 - travel) + dock.x * travel,
    y:
      height * 0.47 * (1 - travel) +
      dock.y * travel -
      Math.sin(travel * Math.PI) * Math.min(70, height * 0.08),
    scale,
    opacity: arrival,
  };
}
