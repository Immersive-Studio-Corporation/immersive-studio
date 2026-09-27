import test from 'node:test';
import assert from 'node:assert/strict';
import { AvatarGreeting } from '../app/avatar-greeting.ts';

test('hover greeting completes once, ignores repeated entries, and requires a fresh entry to replay', () => {
  const wave = new AvatarGreeting();
  wave.enter(true, 10);
  assert.equal(wave.count, 1);
  assert.equal(wave.pose(11).active, true);
  assert.equal(wave.pose(11).weight, 1);
  wave.enter(false, 11);
  wave.enter(true, 11.1);
  assert.equal(wave.count, 1);
  assert.equal(wave.pose(13.5).active, false);
  assert.equal(wave.pose(13.5).weight, 0);
  wave.enter(true, 14);
  assert.equal(wave.count, 1);
  wave.enter(false, 14.1);
  wave.enter(true, 14.2);
  assert.equal(wave.count, 2);
  assert.equal(wave.pose(15).weight, 1);
});
