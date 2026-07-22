// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://adana-gayrimenkul-avukati.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  compressHTML: true,
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
