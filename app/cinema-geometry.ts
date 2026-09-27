/** Perspective geometry shared by the decorative 3D field and its checks. */
export const cubeVertices = [
  [-1, -1, -1],
  [1, -1, -1],
  [1, 1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
  [1, -1, 1],
  [1, 1, 1],
  [-1, 1, 1],
];
export const cubeFaces = [
  [0, 3, 2, 1],
  [4, 5, 6, 7],
  [0, 4, 7, 3],
  [1, 2, 6, 5],
  [0, 1, 5, 4],
  [3, 7, 6, 2],
];

export function rotateVertex(
  x: number,
  y: number,
  z: number,
  ax: number,
  ay: number,
  az: number,
) {
  const y1 = y * Math.cos(ax) - z * Math.sin(ax);
  const z1 = y * Math.sin(ax) + z * Math.cos(ax);
  const x2 = x * Math.cos(ay) + z1 * Math.sin(ay);
  const z2 = -x * Math.sin(ay) + z1 * Math.cos(ay);
  return [
    x2 * Math.cos(az) - y1 * Math.sin(az),
    x2 * Math.sin(az) + y1 * Math.cos(az),
    z2,
  ];
}

export function perspectiveScale(focal: number, distance: number) {
  return focal / Math.max(1, distance);
}
