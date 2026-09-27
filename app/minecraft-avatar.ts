import * as THREE from 'three';

/** Official 64x64 slim skin, including the separate coat/hair layers. */
export function minecraftAvatar(texture: THREE.Texture) {
  const root = new THREE.Group();
  const material = new THREE.MeshLambertMaterial({
    map: texture,
    alphaTest: 0.1,
  });
  const geometries: THREE.BoxGeometry[] = [];
  function box(
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    inflate = 0,
  ) {
    const geometry = new THREE.BoxGeometry(
      (w + inflate) / 16,
      (h + inflate) / 16,
      (d + inflate) / 16,
    );
    geometries.push(geometry);
    const regions = [
      [x, y + d, d, h],
      [x + d + w, y + d, d, h],
      [x + d, y, w, d],
      [x + d + w, y, w, d],
      [x + d, y + d, w, h],
      [x + 2 * d + w, y + d, w, h],
    ];
    const uv = geometry.getAttribute('uv');
    regions.forEach(([u, v, rw, rh], face) => {
      for (let i = 0; i < 4; i++) {
        const n = face * 4 + i;
        uv.setXY(
          n,
          (u + uv.getX(n) * rw) / 64,
          1 - (v + (1 - uv.getY(n)) * rh) / 64,
        );
      }
    });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  }
  function part(
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    ox: number,
    oy: number,
    px: number,
    py: number,
    center: number,
  ) {
    const group = new THREE.Group();
    group.position.set(px, py, 0);
    const inner = box(w, h, d, x, y),
      outer = box(w, h, d, ox, oy, 0.5);
    inner.position.y = outer.position.y = center;
    group.add(inner, outer);
    root.add(group);
    return group;
  }
  const head = part(8, 8, 8, 0, 0, 32, 0, 0, 1.5, 0.25);
  part(8, 12, 4, 16, 16, 16, 32, 0, 0.75, 0.375);
  const rightArm = part(3, 12, 4, 40, 16, 40, 32, -5.5 / 16, 1.5, -0.375);
  const leftArm = part(3, 12, 4, 32, 48, 48, 48, 5.5 / 16, 1.5, -0.375);
  const rightLeg = part(4, 12, 4, 0, 16, 0, 32, -0.125, 0.75, -0.375);
  const leftLeg = part(4, 12, 4, 16, 48, 0, 48, 0.125, 0.75, -0.375);
  return {
    root,
    head,
    rightArm,
    leftArm,
    rightLeg,
    leftLeg,
    dispose: () => {
      geometries.forEach((g) => g.dispose());
      material.dispose();
    },
  };
}
