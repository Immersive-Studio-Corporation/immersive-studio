import test from 'node:test';
import assert from 'node:assert/strict';
import {
  tourPosition,
  tourTimeAt,
  tourDuration,
} from '../app/journey-autoplay.ts';
import { journeyFrame, shotReveals } from '../app/journey-timeline.ts';

test('the complete tour lasts three minutes and 53 seconds at normal speed and never reverses', () => {
  assert.equal(tourDuration(9), 233);
  let previous = -1;
  for (let second = 0; second <= 240; second += 0.025) {
    const position = tourPosition(second, 2000, 7000, 9);
    assert.ok(position >= previous);
    assert.ok(position < 2000 + 9 * 7000);
    previous = position;
  }
});
test('each of the three images has viewing time before the six-second reading phase', () => {
  for (let index = 0; index < 9; index++) {
    for (const [second, shot] of [
      [5, 0],
      [10, 1],
      [15, 2],
    ]) {
      const position = tourPosition(8 + index * 25 + second, 2000, 7000, 9);
      const frame = journeyFrame(position, 2000, 7000, 9);
      assert.equal(frame.index, index);
      assert.equal(frame.copy, 0);
      assert.equal(shotReveals(frame.progress, 3)[shot], 1);
    }
    for (let second = 18; second <= 24; second += 0.25) {
      const position = tourPosition(8 + index * 25 + second, 2000, 7000, 9);
      assert.equal(journeyFrame(position, 2000, 7000, 9).copy, 1);
    }
  }
});
test('resuming from any manual position preserves the current scene', () => {
  for (const height of [642, 770, 1200]) {
    const intro = height * 2.6,
      chapter = height * 9;
    for (let time = 0.1; time < 207.9; time += 0.71) {
      const pos = tourPosition(time, intro, chapter, 8);
      const restored = tourPosition(
        tourTimeAt(pos, intro, chapter, 8),
        intro,
        chapter,
        8,
      );
      assert.ok(Math.abs(restored - pos) < 0.001);
    }
  }
});
