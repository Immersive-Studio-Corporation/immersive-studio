import test from 'node:test';
import assert from 'node:assert/strict';
import { JourneyPlayback } from '../app/journey-playback.ts';

function harness() {
  const attempts = [],
    selected = [],
    positions = [],
    statuses = [];
  const controller = new JourneyPlayback(
    {
      unlock: () =>
        new Promise((resolve, reject) => attempts.push({ resolve, reject })),
      select: async (id) => {
        selected.push(id);
      },
      setPosition: (...args) => positions.push(args),
      setHidden: async () => {},
      dispose: () => {},
    },
    (status) => statuses.push(status),
  );
  return { controller, attempts, selected, statuses, positions };
}
const settle = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

test('entering a project starts its soundtrack by default when autoplay is permitted', async () => {
  const h = harness();
  h.controller.setProject('heritage');
  assert.equal(h.attempts.length, 1);
  assert.deepEqual(h.selected, []);
  h.attempts[0].resolve();
  await settle();
  assert.deepEqual(h.selected, ['heritage']);
  h.controller.setProject('percy');
  assert.deepEqual(h.selected, ['heritage', 'percy']);
});

test('an interaction outside the journey unlocks audio without playing an unrelated track', async () => {
  const h = harness();
  h.controller.interact();
  h.attempts[0].resolve();
  await settle();
  assert.deepEqual(h.selected, []);
  h.controller.setProject('teen');
  assert.deepEqual(h.selected, ['teen']);
  h.controller.setProject(null);
  assert.equal(h.selected.at(-1), null);
});

test('unmuting starts the current project without scrubbing, and explicit intro replay resets', async () => {
  const h = harness();
  h.controller.setEnabled(false);
  h.controller.setFrame({
    id: 'licaris',
    seconds: 4,
    manual: true,
    revision: 0,
  });
  h.controller.setFrame({
    id: 'licaris',
    seconds: 23,
    manual: true,
    revision: 0,
  });
  assert.equal(h.attempts.length, 0);
  h.controller.setEnabled(true);
  h.attempts[0].resolve();
  await settle();
  assert.deepEqual(h.positions.at(-1), ['licaris', 0, false]);
  assert.equal(h.selected.at(-1), 'licaris');
  h.controller.setFrame({
    id: 'intro',
    seconds: 0,
    manual: false,
    revision: 1,
  });
  assert.deepEqual(h.selected.slice(-2), [null, 'intro']);
});

test('a blocked resume retries on interaction and plays the latest project, never a stale one', async () => {
  const h = harness();
  h.controller.setProject('heritage');
  h.attempts[0].reject(new DOMException('Blocked', 'NotAllowedError'));
  await settle();
  assert.equal(h.statuses.at(-1), 'blocked');
  h.controller.interact();
  h.attempts[1].resolve();
  await settle();
});

test('muting during a pending autoplay request cannot be undone by late resolution or navigation', async () => {
  const h = harness();
  h.controller.setProject('walkingdead');
  h.controller.setEnabled(false);
  h.controller.setProject('narnia');
  h.controller.interact();
  h.attempts[0].resolve();
  await settle();
  assert.equal(h.attempts.length, 1);
  assert.ok(h.selected.every((id) => id === null));
  h.controller.setEnabled(true);
  h.attempts[1].resolve();
  await settle();
  assert.equal(h.selected.at(-1), 'narnia');
});

test('a gesture can resume a pending browser lock; duplicate resolutions and disposal cannot restart playback', async () => {
  const h = harness();
  h.controller.setProject('avengers');
  h.controller.interact();
  h.attempts[1].resolve();
  h.attempts[0].resolve();
  await settle();
  assert.deepEqual(h.selected, ['avengers']);
  const stopped = harness();
  stopped.controller.setProject('heritage');
  stopped.controller.dispose();
  stopped.attempts[0].resolve();
  await settle();
  assert.deepEqual(stopped.selected, []);
});
