import test from 'node:test';
import assert from 'node:assert/strict';
import { dimensionLayers } from '../app/journey-layers.ts';
import { journeyArt } from '../app/journey-art.ts';

test('rapid jumps, reverse scrolling and returning to the intro clear every inactive world and shot', () => {
  for (const index of [1, 0, 6, 8, 1, 0, 4, 3, 0]) {
    for (const progress of [0, 0.01, 0.06, 0.3, 0.58, 0.94, 0.15, 0.8]) {
      const underlay = progress < 0.08 && index > 0 ? index - 1 : -1;
      const layers = dimensionLayers(
        index,
        progress,
        underlay,
        1,
        1,
        Array(9).fill(3),
      );
      layers.forEach((layer, i) => {
        if (i === index || i === underlay) return;
        assert.equal(layer.visible, false);
        assert.equal(layer.opacity, 0);
        assert.ok(
          layer.shots.every((shot) => !shot.visible && shot.opacity === 0),
        );
      });
      assert.ok(layers.filter((layer) => layer.visible).length <= 2);
    }
  }
  assert.ok(
    dimensionLayers(0, 0, -1, 0, 0, Array(9).fill(3)).every(
      (layer) =>
        !layer.visible &&
        layer.opacity === 0 &&
        layer.shots.every((shot) => !shot.visible),
    ),
  );
});

test('requested scene order does not alter Licaris', () => {
  assert.deepEqual(journeyArt.heritage, [
    'heritage-3',
    'heritage-1',
    'heritage-2',
  ]);
  assert.deepEqual(journeyArt.onepiece, [
    'onepiece-3',
    'onepiece-2',
    'onepiece-1',
  ]);
  assert.deepEqual(journeyArt.nations, ['nations-1', 'nations-3', 'nations-2']);
  assert.deepEqual(journeyArt.licaris, [
    'licaris-latios',
    'licaris-bulbasaur',
    'licaris-lucario',
  ]);
});
