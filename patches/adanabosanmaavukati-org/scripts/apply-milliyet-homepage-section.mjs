#!/usr/bin/env node
/**
 * Ana sayfaya Milliyet Gazetesi hukuk yazıları bölümünü additive ekler (aile hukuku).
 *
 * Varsayılan: DRY-RUN
 * Kimlik testi: node scripts/apply-milliyet-homepage-section.mjs --auth-test
 * Canlı uygulama: node scripts/apply-milliyet-homepage-section.mjs --execute
 *
 * Gizli değerler loglanmaz. Schema / Rank Math / canonical / H1 / mevcut H2 dokunulmaz.
 */
import { createHash } from 'crypto';
import { mkdirSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getWpConfig, wpAuthHeader } from './lib/env.mjs';
import {
  insertMilliyetSection,
  homepageHasMilliyetSection,
  SECTION_H2,
  PROFILE_URL,
  MILLIYET_ARTICLES,
  INTERNAL_LINKS,
} from './lib/milliyet-homepage-section.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const HOMEPAGE_ID = 19;
const PUBLIC_URL = 'https://adanabosanmaavukati.org/';
const AUTH_TEST = process.argv.includes('--auth-test');
const EXECUTE = process.argv.includes('--execute');
const EXPECTED_INTRO =
  'Av. Ceren Sümer Cilli’nin Milliyet Gazetesi’nde yayımlanan aile hukuku alanındaki yazılarından seçmeler. Bu seçkide çekişmeli boşanma, velayet ve nafaka konuları öne çıkar.';
const EXPECTED_MILLIYET_URLS = MILLIYET_ARTICLES.map((a) => a.url);
const PRE_H2 = [
  'Adana’da Boşanma Davaları Nasıl Yürütülür?',
  'Adana Nafaka Davaları ve Nafakanın Belirlenmesi',
  'Adana Velayet Davaları ve Çocuğun Üstün Yararı',
  'Adana Boşanmada Mal Paylaşımı Davaları',
  'Adana Boşanma Avukatı Seçerken Nelere Dikkat Edilmelidir?',
  'Adana Boşanma Davalarında Hukuki Destek',
  'Avukat Ceren Sümer Cilli ile Adana’da Boşanma Süreci',
];

function credStatus() {
  const { username, appPassword, baseUrl } = getWpConfig();
  return {
    baseUrl,
    usernamePresent: Boolean(username && String(username).trim()),
    appPasswordPresent: Boolean(appPassword && String(appPassword).trim()),
    username,
    appPassword,
  };
}

async function wpRequest(path, { method = 'GET', body } = {}) {
  const { username, appPassword, baseUrl } = credStatus();
  const url = path.startsWith('http') ? path : `${baseUrl}${path}`;
  const headers = {
    Accept: 'application/json',
    Authorization: wpAuthHeader(username, appPassword),
  };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const response = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  return { status: response.status, ok: response.ok, json, text };
}

function normalizeText(value = '') {
  return String(value)
    .replace(/&#8217;|&rsquo;|’/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function headingTexts(html, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'gi');
  const out = [];
  let match;
  while ((match = re.exec(html))) {
    out.push(normalizeText(match[1].replace(/<[^>]+>/g, '')));
  }
  return out;
}

function canonicalHref(html) {
  const tag = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i);
  if (!tag) return null;
  const href = tag[0].match(/href=["']([^"']+)["']/i);
  return href ? href[1] : null;
}

function jsonLdBlocks(html) {
  return [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(
    (m) => m[1].trim()
  );
}

function jsonLdFingerprint(html) {
  const blocks = jsonLdBlocks(html);
  const joined = blocks.join('\n---\n');
  return {
    count: blocks.length,
    lengths: blocks.map((b) => b.length),
    sha256: createHash('sha256').update(joined).digest('hex'),
  };
}

async function fetchPublicHtml() {
  const res = await fetch(`${PUBLIC_URL}?nocache=${Date.now()}`, {
    headers: {
      Accept: 'text/html',
      'Cache-Control': 'no-cache',
      'User-Agent': 'adanabosanma-milliyet-section',
    },
  });
  return { status: res.status, html: await res.text() };
}

function publicSignals(html, status) {
  const milliyetHrefs = [...html.matchAll(/https:\/\/blog\.milliyet\.com\.tr\/[^"'\\\s]*/g)].map((m) => m[0]);
  const uniqueMilliyet = [...new Set(milliyetHrefs)];
  const h2 = headingTexts(html, 'h2');
  const h1 = headingTexts(html, 'h1');
  const sectionIdCount =
    (html.match(/id="milliyet-hukuk-yazilari"/g) || []).length +
    (html.match(/id='milliyet-hukuk-yazilari'/g) || []).length;
  return {
    status,
    canonical: canonicalHref(html),
    h1,
    h1Count: h1.length,
    h2,
    jsonLd: jsonLdFingerprint(html),
    sectionIdCount,
    milliyetH2Count: h2.filter((t) => normalizeText(t) === normalizeText(SECTION_H2)).length,
    uniqueMilliyet,
    milliyetLinkCount: uniqueMilliyet.length,
    profilePresent: html.includes(PROFILE_URL),
    introPresent: html.includes(EXPECTED_INTRO) || html.includes(EXPECTED_INTRO.replace(/’/g, '&#8217;')),
    anlasmali: html.includes(INTERNAL_LINKS.anlasmali.href) || html.includes('/adanada-anlasmali-bosanma-avukati/'),
    cekismeli: html.includes(INTERNAL_LINKS.cekismeli.href) || html.includes('/adana-cekismeli-bosanma-avukati/'),
    malPaylasimi:
      html.includes(INTERNAL_LINKS.malPaylasimi.href) || html.includes('/bosanmada-mal-paylasimi-ve-katilma-alacagi/'),
    hasWpBlocks: html.includes('wp-block-heading') && html.includes('wp-block-list'),
    alreadyHasSection: homepageHasMilliyetSection(html),
  };
}

function verifyAgainstBaseline(before, after) {
  const checks = [];
  const add = (id, ok, detail) => checks.push({ id, ok, detail });
  add(1, after.alreadyHasSection || after.sectionIdCount === 1, 'Milliyet bölümü canlı HTML’de var');
  add(2, after.sectionIdCount === 1 && after.milliyetH2Count === 1, `Bölüm bir kez (id=${after.sectionIdCount}, h2=${after.milliyetH2Count})`);
  add(3, after.milliyetH2Count === 1, `H2 doğru: ${SECTION_H2}`);
  add(4, after.introPresent, 'Giriş metni doğru');
  add(5, true, 'adanaavukat.org 6 link kontrolü bu sitede uygulanmaz');
  const missingArticles = EXPECTED_MILLIYET_URLS.filter((u) => !after.uniqueMilliyet.some((h) => h.startsWith(u)));
  add(6, missingArticles.length === 0 && after.milliyetLinkCount === 5, `5 Milliyet bağlantısı (bulunan ${after.milliyetLinkCount})`);
  add(7, after.anlasmali && after.cekismeli && after.malPaylasimi, 'anlaşmalı / çekişmeli / mal paylaşımı linkleri duruyor');
  add(8, after.profilePresent, 'cerensumer.av.tr profil bağlantısı mevcut');
  add(9, after.h1Count === before.h1Count, `H1 sayısı aynı (${before.h1Count} → ${after.h1Count})`);
  const missingH2 = PRE_H2.filter((t) => !after.h2.some((h) => normalizeText(h) === normalizeText(t)));
  add(10, missingH2.length === 0, missingH2.length ? `Eksik H2: ${missingH2.join(' | ')}` : 'Önceki H2’ler duruyor');
  add(11, after.canonical === before.canonical, `canonical ${before.canonical} → ${after.canonical}`);
  add(
    12,
    after.jsonLd.sha256 === before.jsonLd.sha256 && after.jsonLd.count === before.jsonLd.count,
    `JSON-LD ${before.jsonLd.count}/${before.jsonLd.sha256.slice(0, 12)} → ${after.jsonLd.count}/${after.jsonLd.sha256.slice(0, 12)}`
  );
  add(13, after.sectionIdCount <= 1 && after.milliyetH2Count <= 1, 'Duplicate section yok');
  add(14, after.status === 200, `HTTP ${after.status}`);
  add('render', after.hasWpBlocks, 'Mevcut Gutenberg wp-block sınıfları kullanılıyor');
  return { ok: checks.every((c) => c.ok), checks };
}

function writeBackup(dir, raw, publicHtml, meta) {
  mkdirSync(dir, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const rawFile = resolve(dir, `homepage-${HOMEPAGE_ID}-pre-milliyet-${ts}.raw.html`);
  writeFileSync(rawFile, raw, 'utf8');
  writeFileSync(resolve(dir, `homepage-${HOMEPAGE_ID}-pre-milliyet-${ts}.public.html`), publicHtml, 'utf8');
  writeFileSync(resolve(dir, `homepage-${HOMEPAGE_ID}-pre-milliyet-${ts}.meta.json`), JSON.stringify(meta, null, 2), 'utf8');
  return { rawFile };
}

async function updatePageContent(content) {
  return wpRequest(`/wp-json/wp/v2/pages/${HOMEPAGE_ID}`, { method: 'POST', body: { content } });
}

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

async function authTest() {
  const creds = credStatus();
  console.log('=== AUTH TEST — adanabosanmaavukati.org page 19 ===');
  console.log(`baseUrl: ${creds.baseUrl}`);
  console.log(`ADANABOSANMA_WP_USERNAME / WP_USERNAME: ${creds.usernamePresent ? 'PRESENT' : 'MISSING'}`);
  console.log(`ADANABOSANMA_WP_APP_PASSWORD / WP_APPLICATION_PASSWORD: ${creds.appPasswordPresent ? 'PRESENT' : 'MISSING'}`);
  if (!creds.usernamePresent || !creds.appPasswordPresent) {
    console.log('SONUÇ: BAŞARISIZ — GitHub Actions / runtime secret eksik');
    process.exit(1);
  }
  const result = await wpRequest(`/wp-json/wp/v2/pages/${HOMEPAGE_ID}?context=edit`);
  const pageId = result.json?.id;
  const rawLen = result.json?.content?.raw ? String(result.json.content.raw).length : 0;
  console.log(`HTTP ${result.status}`);
  console.log(`page_id: ${pageId ?? 'n/a'}`);
  console.log(`modified: ${result.json?.modified ?? 'n/a'}`);
  console.log(`content.raw_len: ${rawLen}`);
  if (!result.ok || pageId !== HOMEPAGE_ID) {
    console.log('SONUÇ: BAŞARISIZ — authentication veya sayfa okuma başarısız');
    process.exit(1);
  }
  console.log('SONUÇ: BAŞARILI');
  return result.json;
}

async function main() {
  if (AUTH_TEST) {
    await authTest();
    return;
  }

  console.log(
    EXECUTE
      ? '=== EXECUTE — GitHub Actions secret’larıyla canlı ana sayfa güncellenecek ==='
      : '=== DRY-RUN — production’a yazılmayacak ==='
  );

  mkdirSync(resolve(ROOT, 'generated'), { recursive: true });
  mkdirSync(resolve(ROOT, 'reports'), { recursive: true });

  if (!EXECUTE) {
    const { html } = await fetchPublicHtml();
    if (homepageHasMilliyetSection(html)) {
      console.log('Milliyet bölümü genel HTML’de zaten var; dry-run değişiklik yazmadı.');
      return;
    }
    const result = insertMilliyetSection(html);
    writeFileSync(resolve(ROOT, 'generated/homepage-milliyet-section-preview.html'), result.html, 'utf8');
    console.log(`Eklenen H2: ${SECTION_H2}`);
    console.log('DRY-RUN tamamlandı.');
    return;
  }

  const page = await authTest();
  const raw = page.content?.raw;
  if (typeof raw !== 'string' || !raw.trim()) {
    throw new Error('content.raw boş. Rendered HTML tahmin edilerek yazılmayacak.');
  }

  const publicBefore = await fetchPublicHtml();
  if (publicBefore.status !== 200) {
    throw new Error(`Canlı ana sayfa GET başarısız: HTTP ${publicBefore.status}`);
  }
  const before = publicSignals(publicBefore.html, publicBefore.status);

  if (homepageHasMilliyetSection(raw) || homepageHasMilliyetSection(publicBefore.html)) {
    console.log('Milliyet bölümü zaten mevcut; duplicate ekleme yapılmadı.');
    return;
  }

  let inserted;
  try {
    inserted = insertMilliyetSection(raw);
  } catch (err) {
    console.error(`Insertion point bulunamadı: ${err.message}`);
    console.error('Otomatik tahmin yapılmadı; production’a yazılmadı.');
    process.exit(1);
  }

  if (!inserted.inserted) {
    console.log('Bölüm eklenmedi (zaten mevcut).');
    return;
  }

  const backup = writeBackup(resolve(ROOT, 'data/backups'), raw, publicBefore.html, {
    pageId: HOMEPAGE_ID,
    modified: page.modified,
    modifiedGmt: page.modified_gmt,
    rawLen: raw.length,
    publicSignals: before,
    note: 'Pre-deploy rollback copy. No secrets.',
  });
  console.log(`Yedek alındı: ${backup.rawFile}`);

  const updated = await updatePageContent(inserted.html);
  if (!updated.ok) {
    console.error(`Page update failed: HTTP ${updated.status}`);
    process.exit(1);
  }
  console.log(`Ana sayfa güncellendi — ID: ${updated.json?.id}, modified: ${updated.json?.modified}`);

  let after = null;
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    await sleep(3000);
    const live = await fetchPublicHtml();
    after = publicSignals(live.html, live.status);
    if (after.alreadyHasSection && after.status === 200) break;
    console.log(`Doğrulama denemesi ${attempt}/5: bölüm henüz görünmüyor`);
  }

  const verification = verifyAgainstBaseline(before, after);
  for (const check of verification.checks) {
    console.log(`${check.ok ? 'PASS' : 'FAIL'} ${check.id}: ${check.detail}`);
  }

  if (!verification.ok) {
    console.error('Doğrulama başarısız; pre-deploy yedekten rollback yapılıyor.');
    const restored = await updatePageContent(raw);
    if (!restored.ok) {
      console.error(`ROLLBACK BAŞARISIZ: HTTP ${restored.status}`);
      process.exit(1);
    }
    console.log(`Rollback yazıldı — modified: ${restored.json?.modified}`);
    process.exit(1);
  }

  console.log('Doğrulama başarılı. Schema / Rank Math / canonical / H1 değiştirilmedi.');
}

main().catch((err) => {
  console.error('HATA:', err.message);
  process.exit(1);
});
