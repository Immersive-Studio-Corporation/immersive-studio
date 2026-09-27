import test from 'node:test';
import assert from 'node:assert/strict';
import { audioTimeAt } from '../app/journey-audio-frame.ts';
import { tourPosition } from '../app/journey-autoplay.ts';

test('all project pictures use the same 25-second musical clock as the automatic tour', () => {
  for (const seconds of [0.1, 3, 5, 8, 11, 13, 16, 18, 24, 24.99]) {
    const progress = tourPosition(8 + seconds, 1, 1, 1) - 1;
    assert.ok(
      Math.abs(audioTimeAt(progress) - seconds) < 0.00001,
      `cue ${seconds}`,
    );
  }
  assert.ok(Math.abs(audioTimeAt(0.82) - 18) < 0.00001);
  assert.ok(Math.abs(audioTimeAt(1) - 25) < 0.00001);
});

test('intro cues follow its eight-second animation', () => {
  for (const seconds of [0.2, 2, 4, 6, 7.5]) {
    const progress = tourPosition(seconds, 1, 1, 1);
    assert.ok(Math.abs(audioTimeAt(progress, true) - seconds) < 0.00001);
  }
});
