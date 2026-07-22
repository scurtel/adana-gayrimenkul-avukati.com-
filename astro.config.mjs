// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://adana-gayrimenkul-avukati.com',
  trailingSlash: 'always',
  output: 'static',
  adapter: node({
    mode: 'standalone',
  }),
  server: {
    // Build-time default; runtime HOST / PORT env override (Hostinger sets PORT)
    host: '0.0.0.0',
    port: 4321,
  },
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
