import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { JourneyAudio } from '../app/journey-music.ts';

class Param {
  value = 0;
  cancelAndHoldAtTime() {}
  setValueAtTime(value) {
    this.value = value;
  }
  linearRampToValueAtTime(value) {
    this.value = value;
  }
}
class Context {
  static created = [];
  sources = [];
  gains = [];
  currentTime = 10;
  destination = {};
  constructor() {
    Context.created.push(this);
  }
  async resume() {}
  async suspend() {}
  async close() {
    this.closed = true;
  }
  createGain() {
    const gain = { gain: new Param(), connect() {}, disconnect() {} };
    this.gains.push(gain);
    return gain;
  }
  createBufferSource() {
    const source = {
      connect() {},
      disconnect() {},
      start(when, offset) {
        this.started = true;
        this.offset = offset;
      },
      stop() {
        this.stopped = true;
      },
    };
    this.sources.push(source);
    return source;
  }
  async decodeAudioData(bytes) {
    const id = new Uint8Array(bytes)[0];
    return { id, duration: id === 9 ? 8 : 120 };
  }
}
function harness(t) {
  const requests = [];
  t.mock.method(
    globalThis,
    'fetch',
    (url, { signal }) =>
      new Promise((resolve) => requests.push({ url, signal, resolve })),
  );
  const previousContext = globalThis.AudioContext;
  globalThis.AudioContext = Context;
  t.after(() => {
    if (previousContext) globalThis.AudioContext = previousContext;
    else delete globalThis.AudioContext;
  });
  const statuses = [];
  const player = new JourneyAudio(
    (s) => statuses.push(s),
    (id) => `/test-audio/${id}.mp3`,
  );
  t.after(() => player.dispose());
  return {
    player,
    requests,
    statuses,
    resolve: (index, id) =>
      requests[index].resolve({
        ok: true,
        arrayBuffer: async () => new Uint8Array([id]).buffer,
      }),
  };
}

test('the low-level player cannot fetch recordings before its context is unlocked', async (t) => {
  const h = harness(t),
    before = Context.created.length;
  await h.player.select('heritage');
  assert.equal(Context.created.length, before);
  assert.equal(h.requests.length, 0);
});
test('every soundtrack starts behind a 15 percent master gain; user adjustments remain available', async (t) => {
  const h = harness(t);
  await h.player.unlock();
  const master = Context.created.at(-1).gains[0];
  assert.equal(master.gain.value, 0.15);
  const first = h.player.select('heritage');
  h.resolve(0, 1);
  await first;
  const second = h.player.select('licaris');
  h.resolve(1, 2);
  await second;
  assert.equal(master.gain.value, 0.15);
  h.player.setVolume(0.25);
  assert.equal(master.gain.value, 0.25);
});
test('late downloads cannot replace the latest universe after fast navigation', async (t) => {
  const h = harness(t);
  await h.player.unlock();
  const a = h.player.select('percy'),
    b = h.player.select('teen');
  assert.equal(h.requests[0].signal.aborted, true);
  h.resolve(1, 2);
  await b;
  h.resolve(0, 1);
  await a;
  const sources = Context.created.at(-1).sources;
  assert.equal(sources.length, 1);
  assert.equal(sources[0].buffer.id, 2);
  assert.equal(h.statuses.at(-1), 'playing');
  await h.player.select('teen');
  assert.equal(
    sources.length,
    1,
    'scrolling inside a project does not restart its track',
  );
});
test('mute invalidates in-flight loading; retry recovers after a failed download', async (t) => {
  const h = harness(t);
  await h.player.unlock();
  const loading = h.player.select('heritage');
  await h.player.select(null);
  h.resolve(0, 1);
  await loading;
  assert.equal(Context.created.at(-1).sources.length, 0);
  assert.equal(h.statuses.at(-1), 'off');
  const failed = h.player.select('walkingdead');
  h.requests[1].resolve({ ok: false, status: 404 });
  await failed;
  assert.equal(h.statuses.at(-1), 'error');
  const retry = h.player.select('walkingdead');
  h.resolve(2, 6);
  await retry;
  assert.equal(h.statuses.at(-1), 'playing');
  await h.player.select(null);
  assert.equal(Context.created.at(-1).sources[0].stopped, true);
});
test('unavailable tracks stay silent and never fetch an unrelated fallback', async (t) => {
  const h = harness(t);
  const statuses = [];
  const player = new JourneyAudio(
    (status) => statuses.push(status),
    () => null,
  );
  t.after(() => player.dispose());
  await player.unlock();
  await player.select('heritage');
  assert.equal(h.requests.length, 0);
  assert.equal(statuses.at(-1), 'unavailable');
});
test('all nine supplied recordings exist and are credited by title and artist', async () => {
  const { nativeTracks, nativeTrackFor } =
    await import('../app/journey-tracks.ts');
  const credits = readFileSync(
    new URL('../public/credits-musiques.html', import.meta.url),
    'utf8',
  );
  assert.equal(Object.keys(nativeTracks).length, 9);
  for (const [id, track] of Object.entries(nativeTracks)) {
    assert.ok(track.title && track.artist);
    assert.ok(track.src, `recording required for ${id}`);
    assert.ok(existsSync(new URL('../public' + track.src, import.meta.url)));
    assert.ok(track.src.startsWith('/audio/'));
    assert.ok(credits.includes(track.title), `missing title credit for ${id}`);
    assert.ok(
      credits.includes(track.artist),
      `missing artist credit for ${id}`,
    );
  }
  assert.equal(nativeTrackFor('__proto__'), null);
  const { journeyArt } = await import('../app/journey-art.ts');
  const { isMusicProject } = await import('../app/journey-music.ts');
  assert.deepEqual(Object.keys(nativeTracks), Object.keys(journeyArt));
  assert.ok(isMusicProject('licaris'));
  assert.equal(
    nativeTracks.licaris.src,
    '/audio/balanced-20260921/licaris.mp3',
  );
  assert.ok(!isMusicProject('newgen'));
  assert.ok(!isMusicProject('last'));
  assert.ok(isMusicProject('onepiece') && isMusicProject('narnia'));
});

test('late activation uses the latest visual cue, including progress during downloading', async (t) => {
  const h = harness(t);
  h.player.setPosition('licaris', 10);
  await h.player.unlock();
  const loading = h.player.select('licaris');
  h.player.setPosition('licaris', 21.5);
  h.resolve(0, 7);
  await loading;
  const context = Context.created.at(-1);
  assert.equal(context.sources[0].offset, 21.5);
  assert.equal(context.sources[0].loop, true);
  assert.equal(
    context.gains[0].gain.value,
    0.15,
    'initial master volume is 15%',
  );
});

test('stationary frames and repeated forward/backward wheel cues never restart the same track', async (t) => {
  const h = harness(t);
  await h.player.unlock();
  h.player.setPosition('percy', 5);
  const loading = h.player.select('percy');
  h.resolve(0, 2);
  await loading;
  const context = Context.created.at(-1);
  context.currentTime += 12;
  for (let i = 0; i < 5; i++) h.player.setPosition('percy', 5);
  await new Promise((r) => setTimeout(r, 190));
  assert.equal(
    context.sources.length,
    1,
    'music is not pinned to a stationary frame',
  );
  h.player.setPosition('percy', 19);
  h.player.setPosition('percy', 22);
  await new Promise((r) => setTimeout(r, 190));
  assert.equal(context.sources.length, 1);
  assert.equal(context.sources[0].offset, 5);
  assert.ok(!context.sources[0].stopped);
  for (const second of [0, 31, 2, 18, 1, 40]) {
    h.player.setPosition('percy', second, true);
    await h.player.select('percy');
  }
  assert.equal(context.sources.length, 1);
});

test('automatic and manual movement preserve natural playback', async (t) => {
  const h = harness(t);
  await h.player.unlock();
  h.player.setPosition('teen', 4);
  const loading = h.player.select('teen');
  h.resolve(0, 3);
  await loading;
  h.player.setPosition('teen', 20, true);
  h.player.setPosition('teen', 21, false);
  await new Promise((r) => setTimeout(r, 190));
  assert.equal(Context.created.at(-1).sources.length, 1);
});

test('intro is a one-shot and can play again on a new visit without looping', async (t) => {
  const h = harness(t);
  await h.player.unlock();
  h.player.setPosition('intro', 2);
  const loading = h.player.select('intro');
  h.resolve(0, 9);
  await loading;
  const context = Context.created.at(-1);
  assert.equal(context.sources[0].offset, 2);
  assert.equal(context.sources[0].loop, false);
  context.sources[0].onended();
  await h.player.select('intro');
  assert.equal(context.sources.length, 1);
  assert.equal(h.statuses.at(-1), 'ended');
  await h.player.select(null);
  h.player.setPosition('intro', 0);
  await h.player.select('intro');
  assert.equal(context.sources[1].offset, 0);
});

test('intro recording is a local credited asset', async () => {
  const { introTrack } = await import('../app/journey-tracks.ts');
  assert.ok(existsSync(new URL('../public' + introTrack.src, import.meta.url)));
  const credits = readFileSync(
    new URL('../public/credits-musiques.html', import.meta.url),
    'utf8',
  );
  assert.ok(credits.includes(introTrack.title));
});
