import { clamp, ramp } from './journey-timeline.ts';

export const TOUR_INTRO_SECONDS = 8;
export const TOUR_CHAPTER_SECONDS = 25;
// Three image reveals followed by six seconds of readable project copy.
const cues = [
  [0, 0],
  [3, 0.18],
  [6, 0.2],
  [8, 0.4],
  [11, 0.42],
  [13, 0.62],
  [16, 0.7],
  [18, 0.82],
  [24, 0.92],
  [25, 1],
];
export const tourDuration = (count: number) =>
  TOUR_INTRO_SECONDS + count * TOUR_CHAPTER_SECONDS;

export function tourPosition(
  seconds: number,
  intro: number,
  chapter: number,
  count: number,
) {
  if (seconds < TOUR_INTRO_SECONDS)
    return ramp(seconds, 0, TOUR_INTRO_SECONDS) * intro;
  const elapsed = Math.max(0, seconds - TOUR_INTRO_SECONDS);
  const index = Math.floor(elapsed / TOUR_CHAPTER_SECONDS);
  if (index >= count) return intro + chapter * (count - 0.00001);
  const time = elapsed % TOUR_CHAPTER_SECONDS;
  const end = cues.findIndex((cue) => cue[0] > time);
  const [a, b] = [
    cues[Math.max(0, end - 1)],
    cues[end < 0 ? cues.length - 1 : end],
  ];
  const progress = a[1] + (b[1] - a[1]) * ramp(time, a[0], b[0]);
  return intro + chapter * (index + progress);
}

export function tourTimeAt(
  position: number,
  intro: number,
  chapter: number,
  count: number,
) {
  let low = 0,
    high = tourDuration(count);
  const goal =
    clamp(position / (intro + count * chapter)) * (intro + count * chapter);
  for (let i = 0; i < 32; i++) {
    const mid = (low + high) / 2;
    if (tourPosition(mid, intro, chapter, count) < goal) low = mid;
    else high = mid;
  }
  return (low + high) / 2;
}
