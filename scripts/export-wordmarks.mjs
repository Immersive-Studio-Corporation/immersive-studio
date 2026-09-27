import fs from 'node:fs/promises';
import sharp from 'sharp';
// Export existing brand artwork through editable vector clipping geometry.
// The bitmap textures remain unchanged; the vector paths define the visible silhouette.
const items = [
  {
    name: 'percy',
    source: 'percy',
    output: 'percy-emblem',
    w: 1200,
    h: 1200,
    crop: '10 0 1180 1175',
    outW: 1200,
    outH: 1195,
  },
  {
    name: 'newgen',
    source: 'newgen-original',
    output: 'newgen-wordmark',
    w: 1774,
    h: 887,
    crop: '174 245 1460 490',
    outW: 1460,
    outH: 490,
  },
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
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${item.outW}" height="${item.outH}" viewBox="${item.crop}"><defs><clipPath id="silhouette" clip-rule="${['percy', 'newgen'].includes(item.name) ? 'nonzero' : 'evenodd'}">${mask}</clipPath></defs><image width="${item.w}" height="${item.h}" xlink:href="data:image/png;base64,${bitmap.toString('base64')}" clip-path="url(#silhouette)"/></svg>`;
  await sharp(Buffer.from(svg))
    .png()
    .toFile(`public/images/${item.output}.png`);
  await sharp(Buffer.from(svg))
    .webp({ quality: 95, alphaQuality: 100 })
    .toFile(`public/images/${item.output}.webp`);
}
console.log(
  'Exported five opaque brand silhouettes with transparent exteriors.',
);
