import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { sites } from '@openai/sites-vite-plugin';
import { defineConfig } from 'vite';

// A portable static site: no Worker, database, or server runtime is required.
export default defineConfig({
  css: { postcss: { plugins: [tailwindcss()] } },
  plugins: [vinext(), sites()],
});
