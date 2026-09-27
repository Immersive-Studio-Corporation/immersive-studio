import test from 'node:test';
import assert from 'node:assert/strict';
import { logoPose } from '../app/journey-logo-motion.ts';

test('the emblem grows from tiny to a stage-sized mark before docking exactly into its title', () => {
  for (const [w, h, dock] of [
    [1440, 908, { x: 290, y: 310, width: 420, height: 190 }],
    [390, 772, { x: 180, y: 230, width: 320, height: 110 }],
  ]) {
    const first = logoPose(0, w, h, dock),
      large = logoPose(0.4, w, h, dock),
      final = logoPose(0.82, w, h, dock);
    assert.equal(first.opacity, 0);
    assert.equal(first.scale, 0.12);
    assert.equal(large.opacity, 1);
    assert.ok(large.scale > 1);
    assert.ok(large.scale * dock.width <= w * 0.88 + 0.001);
    assert.ok(large.scale * dock.height <= h * 0.82 + 0.001);
    assert.equal(final.scale, 1);
    assert.equal(final.x, dock.x);
    assert.ok(Math.abs(final.y - dock.y) < 1e-8);
    const before = logoPose(0.69999, w, h, dock),
      after = logoPose(0.70001, w, h, dock);
    assert.ok(Math.abs(before.x - after.x) < 1);
    assert.ok(Math.abs(before.y - after.y) < 1);
    assert.deepEqual(logoPose(0.65, w, h, dock), logoPose(0.65, w, h, dock));
  }
});
