export const clamp = (x: number) => Math.max(0, Math.min(1, x));
export const INTRO_SCREENS = 2.6;
export const CHAPTER_SCREENS = 9;
export const ramp = (x: number, a: number, b: number) => {
  const p = clamp((x - a) / (b - a));
  return p * p * (3 - 2 * p);
};

// Each world has a long silent arrival, an exploration, then its description.
// Keep the final chapter on its last frame, even after scrolling past the scene.
export function journeyFrame(
  value: number,
  intro: number,
  chapter: number,
  count: number,
) {
  const story = Math.max(
    0,
    Math.min(count - 0.00001, (value - intro) / chapter),
  );
  const index = Math.floor(story);
  const progress = story - index;
  const exit = index === count - 1 ? 0 : ramp(progress, 0.92, 1);
  const arrival = ramp(progress, 0, 0.2);
  const reading = ramp(progress, 0.7, 0.8);
  const reveal = ramp(value / intro, 0.83, 1);
  const worldReveal = ramp(
    progress,
    index === 0 ? 0.02 : 0,
    index === 0 ? 0.16 : 0.14,
  );
  return {
    story,
    index,
    progress,
    arrival,
    reading,
    exit,
    reveal,
    worldReveal,
    underlay: index > 0 && worldReveal < 1 ? index - 1 : -1,
    copy: reading * (1 - exit),
    scenery: ramp(progress, 0.08, 0.3) * (1 - exit),
    detail: ramp(progress, 0.3, 0.56),
  };
}

/** Gentle cinematic dissolves between the supplied scenes. */
export function shotReveals(progress: number, count: number): number[] {
  const gap = 0.44 / Math.max(1, count - 1);
  const duration = Math.min(0.22, gap * 0.75);
  return Array.from({ length: count }, (_, i) =>
    i === 0
      ? 1
      : ramp(progress, 0.2 + (i - 1) * gap, 0.2 + (i - 1) * gap + duration),
  );
}
