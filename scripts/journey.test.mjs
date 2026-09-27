import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import {
  journeyFrame,
  INTRO_SCREENS,
  CHAPTER_SCREENS,
  shotReveals,
} from '../app/journey-timeline.ts';
import {
  journeyArt,
  sceneryFor,
  responsiveScenery,
} from '../app/journey-art.ts';

test('all nine worlds arrive before their text, on desktop and mobile timelines', () => {
  for (const height of [660, 844, 1230]) {
    const intro = height * INTRO_SCREENS,
      chapter = height * CHAPTER_SCREENS;
    for (let index = 0; index < 9; index++) {
      const at = (fraction) =>
        journeyFrame(intro + (index + fraction) * chapter, intro, chapter, 9);
      const entry = at(0.12),
        exploration = at(0.5),
        reading = at(0.82);
      assert.equal(
        entry.index,
        index,
        'header links must arrive in the requested universe',
      );
      assert.equal(entry.copy, 0);
      assert.equal(
        exploration.copy,
        0,
        'no description over the immersive arrival',
      );
      assert.equal(exploration.scenery, 1);
      assert.equal(
        reading.copy,
        1,
        'description and CTA are fully available during reading',
      );
      if (index < 8) {
        assert.equal(at(0.99).worldReveal, 1);
        assert.equal(at(1.01).index, index + 1);
      }
    }
  }
});

test('the last world remains readable at and beyond the end', () => {
  for (const position of [36_200, 40_000, 100_000]) {
    const result = journeyFrame(position, 2600, 4200, 8);
    assert.equal(result.index, 7);
    assert.equal(result.copy, 1);
    assert.equal(result.worldReveal, 1);
  }
});

test('intro and reverse scrolling cannot escape the timeline or retain a later description', () => {
  for (const value of [-100, 0, 1000, 2600]) {
    const result = journeyFrame(value, 2600, 4200, 8);
    assert.equal(result.index, 0);
    assert.equal(result.copy, 0);
  }
  for (let value = 40_000; value >= 0; value -= 117) {
    const result = journeyFrame(value, 2600, 4200, 8);
    assert.ok(result.index >= 0 && result.index < 9);
    for (const key of [
      'copy',
      'scenery',
      'detail',
      'worldReveal',
      'arrival',
      'reveal',
    ]) {
      assert.ok(result[key] >= 0 && result[key] <= 1, key);
    }
  }
});

test('every world has local responsive scenery with honest native-width descriptors', () => {
  for (const id of Object.keys(journeyArt)) {
    const scenes = sceneryFor(id);
    assert.equal(scenes.length, 3, id);
    assert.equal(
      new Set(scenes).size,
      3,
      'three distinct pictures, not duplicate URLs',
    );
    for (const scene of scenes) {
      assert.ok(
        existsSync(new URL('../public' + scene, import.meta.url)),
        scene,
      );
      for (const variant of responsiveScenery(scene).srcSet.split(', ')) {
        const [path, descriptor] = variant.split(' ');
        assert.ok(
          existsSync(new URL('../public' + path, import.meta.url)),
          path,
        );
        assert.ok(['960w', '1600w', '1920w'].includes(descriptor));
      }
      assert.ok(
        existsSync(
          new URL('../public' + responsiveScenery(scene).src, import.meta.url),
        ),
        responsiveScenery(scene).src,
      );
    }
  }
});

// The outgoing landscape remains underneath until the incoming reveal is complete.
test('world changes preserve the preceding picture instead of fading to an empty stage', () => {
  const before = journeyFrame(2.6 + 9 - 0.0001, 2.6, 9, 8);
  const after = journeyFrame(2.6 + 9 + 0.0001, 2.6, 9, 8);
  assert.equal(before.index, 0);
  assert.equal(after.index, 1);
  assert.equal(before.worldReveal, 1);
  assert.equal(after.underlay, before.index);
  assert.ok(after.worldReveal < 0.001);
  const finished = journeyFrame(2.6 + 9 * 1.16, 2.6, 9, 8);
  assert.equal(finished.worldReveal, 1);
  assert.equal(finished.underlay, -1);
  assert.ok(CHAPTER_SCREENS / 4.2 > 2);
});
