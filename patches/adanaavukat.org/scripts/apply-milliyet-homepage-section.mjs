#!/usr/bin/env node
/**
 * Ana sayfaya Milliyet Gazetesi hukuk yazıları bölümünü ekler.
 *
 * Varsayılan: DRY-RUN (canlı WordPress'e yazılmaz).
 * Canlı uygulama için: node scripts/apply-milliyet-homepage-section.mjs --execute
 *
 * Additive: mevcut bölümleri silmez, schema'yı değiştirmez, tam yeniden yazmaz.
 */
import { mkdirSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { wpFetch } from './lib/wp-client.mjs';
import { getWpConfig, getAuthHeader } from './lib/env.mjs';
import {
  insertMilliyetSection,
  homepageHasMilliyetSection,
  SECTION_H2,
} from './lib/milliyet-homepage-section.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const HOMEPAGE_ID = 7;
const EXECUTE = process.argv.includes('--execute');

async function fetchPublicHomepageHtml() {
  const res = await fetch('https://adanaavukat.org/', {
    headers: { Accept: 'text/html', 'User-Agent': 'adanaavukat-milliyet-section-preview' },
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

  mkdirSync(resolve(rootDir, 'generated'), { recursive: true });
  mkdirSync(resolve(rootDir, 'reports'), { recursive: true });

  let raw = '';
  let source = 'public-html';

  const { username, appPassword } = getWpConfig();
  if (username && appPassword) {
    try {
      const page = await wpFetch(`/wp-json/wp/v2/pages/${HOMEPAGE_ID}?context=edit`);
      raw = page.content?.raw || '';
      if (raw) {
        source = 'wp-rest-edit';
        console.log(`WordPress sayfa ID ${HOMEPAGE_ID} alındı (${raw.length} karakter).`);
      } else {
        console.log(`WordPress sayfa ID ${HOMEPAGE_ID}: content.raw boş.`);
      }
    } catch (err) {
      console.log(`WP REST alınamadı (${err.message}); genel HTML kullanılacak.`);
    }
  } else {
    console.log('WP kimlik bilgisi yok; genel HTML ile önizleme hazırlanacak.');
  }

  if (!raw) {
    if (EXECUTE) {
      throw new Error(
        '--execute için WordPress REST content.raw gerekli; genel HTML veya content.rendered yazılamaz.'
      );
    }
    raw = await fetchPublicHomepageHtml();
  }

  if (homepageHasMilliyetSection(raw)) {
    console.log('Milliyet bölümü zaten mevcut; değişiklik yapılmadı.');
    return;
  }

  const result = insertMilliyetSection(raw);
  const previewPath = resolve(rootDir, 'generated/homepage-milliyet-section-preview.html');
  writeFileSync(previewPath, result.html, 'utf8');
  console.log(`Önizleme yazıldı: ${previewPath}`);
  console.log(`Eklenen H2: ${SECTION_H2}`);

  if (!EXECUTE) {
    const reportPath = resolve(rootDir, 'reports/milliyet-homepage-section-dry-run.md');
    writeFileSync(
      reportPath,
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

  const { baseUrl, username: user, appPassword: pass } = getWpConfig();
  if (!user || !pass) {
    throw new Error('--execute için WordPress kimlik bilgileri gerekli.');
  }

  const backupDir = resolve(rootDir, 'data/backups');
  mkdirSync(backupDir, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupFile = resolve(backupDir, `homepage-7-pre-milliyet-${ts}.html`);
  writeFileSync(backupFile, raw, 'utf8');

  const url = `${baseUrl}/wp-json/wp/v2/pages/${HOMEPAGE_ID}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: getAuthHeader(user, pass),
    },
    body: JSON.stringify({ content: result.html }),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Page update failed: ${response.status} — ${body.slice(0, 500)}`);
  }
  const updated = await response.json();
  console.log(`Ana sayfa güncellendi — ID: ${updated.id}, modified: ${updated.modified}`);
  console.log(`Yedek: ${backupFile}`);
}

main().catch((err) => {
  console.error('HATA:', err.message);
  process.exit(1);
});
