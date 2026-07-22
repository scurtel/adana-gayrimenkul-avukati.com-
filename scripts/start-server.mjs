#!/usr/bin/env node
/**
 * Hostinger / Node.js production entry wrapper.
 * Ensures the Astro standalone server binds to 0.0.0.0 and uses process.env.PORT.
 */
process.env.HOST = process.env.HOST || '0.0.0.0';

if (!process.env.PORT) {
  process.env.PORT = '4321';
}

await import('../dist/server/entry.mjs');
