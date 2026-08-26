#!/usr/bin/env node
/**
 * Ana sayfaya Milliyet Gazetesi hukuk yazıları bölümünü ekler (aile hukuku odaklı).
 *
 * Varsayılan: DRY-RUN (canlı WordPress'e yazılmaz).
 * Canlı uygulama için: node scripts/apply-milliyet-homepage-section.mjs --execute
 */
import { mkdirSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { wpFetch } from './lib/wp-fetch.mjs';
import { getWpConfig, wpAuthHeader } from './lib/env.mjs';
import {
  insertMilliyetSection,
  homepageHasMilliyetSection,
  SECTION_H2,
} from './lib/milliyet-homepage-section.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const HOMEPAGE_ID = 19;
const EXECUTE = process.argv.includes('--execute');

async function fetchPublicHomepageHtml() {
  const res = await fetch('https://adanabosanmaavukati.org/', {
    headers: { Accept: 'text/html', 'User-Agent': 'adanabosanma-milliyet-section-preview' },
  });
  if (!res.ok) throw new Error(`Public homepage fetch failed: ${res.status}`);
  return res.text();
}

async function main() {
  console.log(
    EXECUTE
      ? '=== EXECUTE — canlı ana sayfa güncellenecek ==='
      : '=== DRY-RUN — production’a yazılmayacak ==='
  );

  mkdirSync(resolve(ROOT, 'generated'), { recursive: true });
  mkdirSync(resolve(ROOT, 'reports'), { recursive: true });

  let raw = '';
  let source = 'public-html';
  const { username, appPassword, baseUrl } = getWpConfig();

  if (username && appPassword) {
    try {
      const res = await wpFetch(`/wp-json/wp/v2/pages/${HOMEPAGE_ID}?context=edit`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const page = await res.json();
      raw = page.content?.raw || page.content?.rendered || '';
      source = 'wp-rest-edit';
      console.log(`WordPress sayfa ID ${HOMEPAGE_ID} alındı (${raw.length} karakter).`);
    } catch (err) {
      console.log(`WP REST alınamadı (${err.message}); genel HTML kullanılacak.`);
    }
  } else {
    console.log('WP kimlik bilgisi yok; genel HTML ile önizleme hazırlanacak.');
  }

  if (!raw) {
    raw = await fetchPublicHomepageHtml();
  }

  if (homepageHasMilliyetSection(raw)) {
    console.log('Milliyet bölümü zaten mevcut; değişiklik yapılmadı.');
    return;
  }

  const result = insertMilliyetSection(raw);
  const previewPath = resolve(ROOT, 'generated/homepage-milliyet-section-preview.html');
  writeFileSync(previewPath, result.html, 'utf8');
  console.log(`Önizleme yazıldı: ${previewPath}`);
  console.log(`Eklenen H2: ${SECTION_H2}`);

  if (!EXECUTE) {
    writeFileSync(
      resolve(ROOT, 'reports/milliyet-homepage-section-dry-run.md'),
      `# Milliyet ana sayfa bölümü — dry-run

- Tarih: ${new Date().toISOString()}
- Kaynak: ${source}
- Canlı yazma: **hayır**
- H2: ${SECTION_H2}
- Önizleme: \`generated/homepage-milliyet-section-preview.html\`

Schema, URL ve mevcut bölümler değiştirilmedi.
Canlı uygulama için \`node scripts/apply-milliyet-homepage-section.mjs --execute\` gerekir.
`,
      'utf8'
    );
    console.log('DRY-RUN tamamlandı. Production’a yazılmadı.');
    return;
  }

  if (!username || !appPassword) {
    throw new Error('--execute için WordPress kimlik bilgileri gerekli.');
  }

  const backupDir = resolve(ROOT, 'data/backups');
  mkdirSync(backupDir, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  writeFileSync(resolve(backupDir, `homepage-19-pre-milliyet-${ts}.html`), raw, 'utf8');

  const res = await fetch(`${baseUrl}/wp-json/wp/v2/pages/${HOMEPAGE_ID}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: wpAuthHeader(username, appPassword),
    },
    body: JSON.stringify({ content: result.html }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Page update failed: ${res.status} — ${body.slice(0, 500)}`);
  }
  const updated = await res.json();
  console.log(`Ana sayfa güncellendi — ID: ${updated.id}, modified: ${updated.modified}`);
}

main().catch((err) => {
  console.error('HATA:', err.message);
  process.exit(1);
});
