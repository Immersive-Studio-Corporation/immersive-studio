import type { AudioScene } from './journey-tracks.ts';
import { tourTimeAt, TOUR_INTRO_SECONDS } from './journey-autoplay.ts';

/** The visual timeline is sampled without re-rendering React on every frame. */
export type JourneyAudioFrame = {
  id: AudioScene | null;
  seconds: number;
  manual: boolean;
  revision: number;
};

export const emptyAudioFrame = (): JourneyAudioFrame => ({
  id: null,
  seconds: 0,
  manual: true,
  revision: 0,
});

// Use the same musical clock as the 25-second automatic project presentation.
// Its deliberately uneven pacing gives each image and the copy time to breathe.
export function audioTimeAt(progress: number, intro = false) {
  const p = Math.max(0, Math.min(1, progress));
  return intro
    ? Math.min(TOUR_INTRO_SECONDS, tourTimeAt(p, 1, 1, 1))
    : Math.max(0, tourTimeAt(1 + p, 1, 1, 1) - TOUR_INTRO_SECONDS);
}
