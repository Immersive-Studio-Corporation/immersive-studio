import fs from 'node:fs/promises';
import sharp from 'sharp';

// Preserve the approved monogram geometry; adapt its contrast for tiny icons.
const original = await fs.readFile('public/images/studio-mark.svg', 'utf8');
const palette = {
  '#E4BDFF': '#F1E5FF',
  '#9B4CF2': '#BD86FF',
  '#6327B0': '#8D4EDA',
  '#873CE0': '#CEA5FF',
  '#542092': '#F5EFFF',
};
const mark = original
  .replace(/<svg[^>]*>/, '')
  .replace('</svg>', '')
  .replace(/#[0-9A-F]{6}/g, (color) => palette[color] ?? color);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512"><circle cx="256" cy="256" r="256" fill="#24103F"/><g transform="translate(106 46) scale(.62)">${mark}</g></svg>`;
await fs.writeFile('public/images/favicon.svg', svg + '\n');
for (const [file, size] of [['favicon.png', 192], ['apple-touch-icon.png', 180]]) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(`public/images/${file}`);
}
console.log('Exported square, high-contrast favicons from the approved Studio monogram.');
