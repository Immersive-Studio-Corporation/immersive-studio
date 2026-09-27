import { shotReveals } from './journey-timeline.ts';

/** Every frame fully describes every layer, including those being hidden.
 * Hidden parent visibility alone is insufficient: visible children can override it.
 */
export function dimensionLayers(
  index: number,
  progress: number,
  underlay: number,
  reveal: number,
  enter: number,
  sceneCounts: number[],
) {
  return sceneCounts.map((count, i) => {
    const visible = enter > 0 && (i === index || i === underlay);
    const values = visible
      ? shotReveals(i === index ? progress : 1, count)
      : (Array(count).fill(0) as number[]);
    const next = i === index ? values.findIndex((amount) => amount === 0) : -1;
    return {
      visible,
      opacity: visible ? (i === index ? reveal : 1) : 0,
      zIndex: i === index ? 1 : 0,
      shots: values.map((opacity, j) => {
        const shown =
          visible && opacity > 0 && !(j < count - 1 && values[j + 1] === 1);
        return {
          opacity: shown ? opacity : 0,
          visible: shown,
          near:
            shown ||
            (i === index && (j === next || (j === 0 && enter < 1))) ||
            (i === index + 1 && j === 0 && progress > 0.8),
        };
      }),
    };
  });
}
