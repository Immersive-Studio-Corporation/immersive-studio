import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { projectCatalog } from '../app/journey-catalog.ts';
import { videoScenery } from '../app/journey-art.ts';
import {
  cubeVertices,
  rotateVertex,
  perspectiveScale,
} from '../app/cinema-geometry.ts';

test('the nine worlds follow the requested publication order with three playable scenes each', () => {
  assert.deepEqual(
    projectCatalog.map((p) => p.id),
    [
      'heritage',
      'licaris',
      'onepiece',
      'teen',
      'nations',
      'percy',
      'avengers',
      'walkingdead',
      'narnia',
    ],
  );
  for (const project of projectCatalog) {
    assert.ok(
      existsSync(new URL('../public' + project.image, import.meta.url)),
      project.image,
    );
    assert.equal(project.scenery.length, 3);
    for (const poster of project.scenery) {
      for (const video of Object.values(videoScenery(poster))) {
        assert.ok(
          existsSync(
            new URL('../public' + video.split('?')[0], import.meta.url),
          ),
          video,
        );
      }
    }
  }
});

test('new video exports are Full HD at 60 fps and all six supplied audio files are preserved byte for byte', () => {
  const manifest = JSON.parse(
    readFileSync(new URL('../assets/update-20260920.json', import.meta.url)),
  );
  assert.equal(manifest.length, 24);
  assert.ok(
    manifest.every(
      (m) => m.width === 1920 && m.height === 1080 && m.fps === '60/1',
    ),
  );
  for (const clip of manifest.filter((m) => m.source.endsWith('.gif'))) {
    assert.equal(clip.slowdown, 1, clip.id);
    assert.ok(
      Math.abs(Number(clip.duration) - ((clip.trim_end ?? clip.source_duration) - (clip.trim_start ?? 0)) * clip.slowdown) <
        0.04,
      clip.id,
    );
  }
  const sources = {
    intro: 'Intro immersif studios.mp3',
    avengers: 'MUSIQUE/AVENGERS.mp3',
    licaris: 'MUSIQUE/LICARIS.mp3',
    onepiece: 'MUSIQUE/ONE PIECE.mp3',
    walkingdead: 'MUSIQUE/THE WALKING DEAD.mp3',
    narnia: 'MUSIQUE/NARNIA.mp3',
  };
  const hash = (path) =>
    createHash('sha256').update(readFileSync(path)).digest('hex');
  for (const [id, src] of Object.entries(sources)) {
    assert.equal(
      hash(
        new URL(
          '../public/audio/update-20260920/' + id + '.mp3',
          import.meta.url,
        ),
      ),
      hash(new URL('../../UPDATE 20-09-2026/' + src, import.meta.url)),
    );
  }
});

test('all sixteen languages cover the new worlds and remove retired project copy', () => {
  const base = new URL('../app/locales/', import.meta.url);
  const keys = Object.keys(
    JSON.parse(readFileSync(new URL('fr.json', base))),
  ).sort();
  for (const name of readdirSync(base)) {
    const text = readFileSync(new URL(name, base), 'utf8'),
      data = JSON.parse(text);
    assert.deepEqual(Object.keys(data).sort(), keys, name);
    assert.ok(!/newgen|the last of us/i.test(text), name);
    for (const id of ['onepiece', 'walkingdead', 'narnia'])
      assert.ok(data[id + 'Text'] && data[id + 'Line'] && data[id + 'Genre']);
  }
});

test('3D rotations preserve cube geometry and nearer objects have stronger perspective', () => {
  for (const vertex of cubeVertices) {
    for (const angles of [
      [0, 0, 0],
      [0.7, 1.2, 2.9],
      [-2, 4, 0.3],
    ]) {
      const result = rotateVertex(...vertex, ...angles);
      assert.ok(Math.abs(Math.hypot(...result) - Math.sqrt(3)) < 1e-12);
    }
    assert.deepEqual(rotateVertex(...vertex, 0, 0, 0), vertex);
  }
  assert.equal(perspectiveScale(800, 400), 2);
  assert.equal(perspectiveScale(800, 1600), 0.5);
});
