import fs from 'node:fs/promises';
import sharp from 'sharp';
// Export existing brand artwork through editable vector clipping geometry.
// The bitmap textures remain unchanged; the vector paths define the visible silhouette.
const items = [
  {
    name: 'teen',
    source: 'teen-wolf',
    output: 'teen-wordmark',
    w: 1000,
    h: 563,
    crop: '190 95 640 395',
    outW: 1000,
    outH: 617,
  },
  {
    name: 'nations',
    source: 'nations',
    output: 'nations-emblem',
    w: 1100,
    h: 1100,
    crop: '0 0 1100 1100',
    outW: 1100,
    outH: 1100,
  },
  {
    name: 'avengers',
    source: 'avengers',
    output: 'avengers-wordmark',
    w: 1200,
    h: 600,
    crop: '100 110 1000 410',
    outW: 1200,
    outH: 492,
  },
];
for (const item of items) {
  const bitmap = await sharp(`public/images/${item.source}.webp`)
    .png()
    .toBuffer();
  let mask = await fs.readFile(
    `assets/wordmark-masks/${item.name}.svg`,
    'utf8',
  );
  mask = mask
    .replace(/<svg[^>]*>/, '')
    .replace('</svg>', '')
    .replace(/<(title|desc)>[\s\S]*?<\/\1>/g, '')
    .replaceAll('fill-rule', 'clip-rule')
    .replace(/<\/?g\b[^>]*>/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${item.outW}" height="${item.outH}" viewBox="${item.crop}"><defs><clipPath id="silhouette" clip-rule="${item.name === 'nations' ? 'nonzero' : 'evenodd'}">${mask}</clipPath></defs><image width="${item.w}" height="${item.h}" xlink:href="data:image/png;base64,${bitmap.toString('base64')}" clip-path="url(#silhouette)"/></svg>`;
  await sharp(Buffer.from(svg))
    .png()
    .toFile(`public/images/${item.output}.png`);
  await sharp(Buffer.from(svg))
    .webp({ quality: 95, alphaQuality: 100 })
    .toFile(`public/images/${item.output}.webp`);
}
console.log(
  'Exported three opaque brand silhouettes with transparent exteriors.',
);
