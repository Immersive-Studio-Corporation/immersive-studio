/** Three supplied motion scenes per world. */
export const journeyArt = {
  heritage: ['heritage-3', 'heritage-1', 'heritage-2'],
  onepiece: ['onepiece-3', 'onepiece-2', 'onepiece-1'],
  teen: ['teen-1', 'teen-2', 'teen-3'],
  nations: ['nations-1', 'nations-3', 'nations-2'],
  percy: ['percy-1', 'percy-2', 'percy-3'],
  avengers: ['avengers-1', 'avengers-2', 'avengers-3'],
  walkingdead: ['walkingdead-1', 'walkingdead-2', 'walkingdead-3'],
  narnia: ['narnia-1', 'narnia-2', 'narnia-3'],
} as const;

export function sceneryFor(id: keyof typeof journeyArt): string[] {
  const folder = 'worlds-20260920';
  return journeyArt[id].map((name) => `/images/${folder}/${name}.webp`);
}

export function responsiveScenery(src: string) {
  const small = 960;
  return {
    src: src.replace('.webp', `-${small}.webp`),
    srcSet: `${src.replace('.webp', `-${small}.webp`)} ${small}w, ${src} 1920w`,
    sizes: '100vw',
  };
}

export function videoScenery(poster: string) {
  const name = poster.split('/').pop()?.replace('.webp', '');
  if (!name) return null;
  const known = Object.values(journeyArt).some((shots) =>
    (shots as readonly string[]).includes(name),
  );
  if (!known) return null;
  const folder = 'worlds-20260920';
  const version = '?v=loop-4';
  return {
    desktop: `/videos/${folder}/${name}-1080.mp4${version}`,
    mobile: `/videos/${folder}/${name}-720.mp4${version}`,
  };
}
