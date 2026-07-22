#!/usr/bin/env node
/**
 * Build sonrası dist klasörü SEO/entity denetimi.
 * Kullanım: npm run build && node scripts/audit-site.mjs
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const CONFIG_SRC = readFileSync(join(ROOT, 'src/config/site.ts'), 'utf8');

function cfgString(obj, key) {
  const re = new RegExp(`${obj}[\\s\\S]*?${key}:\\s*'([^']*)'`);
  const m = CONFIG_SRC.match(re);
  return m ? m[1] : '';
}

const DOMAIN = 'https://adana-gayrimenkul-avukati.com';
const FIRM_PHONE_DISPLAY = '0543 251 54 38';
const FIRM_PHONE_INT = '+905432515438';
const FIRM_PHONE_HREF = 'tel:+905432515438';
const ADDRESS = 'Kayalıbağ, Çolakoğlu İş Merkezi Kat 2 No: 1, 01131 Seyhan/Adana';
const ORG_ID = 'https://sumerhukuk.com/#organization';
const LEGAL_ID = 'https://sumerhukuk.com/#legalservice';
const WEBSITE_ID = 'https://adana-gayrimenkul-avukati.com/#website';
const PERSON_ID = 'https://cerensumer.av.tr/#person';
const FIRM_SITE = 'https://sumerhukuk.com/';
const ATTORNEY_SITE = 'https://cerensumer.av.tr/';

const attorneyPhoneDisplay = cfgString('attorney', 'telephoneDisplay');
const attorneyPhoneInt = cfgString('attorney', 'telephoneInternational');
const lawFirmMaps = cfgString('lawFirm', 'googleMapsUrl');
const attorneyMaps = cfgString('attorney', 'googleMapsUrl');
const lawFirmReview = cfgString('lawFirm', 'googleReviewUrl');
const attorneyReview = cfgString('attorney', 'googleReviewUrl');

const errors = [];
const warnings = [];

function assertAddress(html, rel) {
  if (html.includes(ADDRESS)) return;
  if (html.includes('Seyhan') && html.includes('Adana') && html.includes('Çolakoğlu')) {
    if (!html.includes('Kayalıbağ') || !html.includes('01131')) {
      warnings.push(`Adres varyasyonu şüpheli: ${rel}`);
    }
  }
}

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

function extract(re, html, flags = 'gi') {
  const out = [];
  const r = new RegExp(re, flags);
  let m;
  while ((m = r.exec(html))) out.push(m[1] ?? m[0]);
  return out;
}

function brandedAnchorOk(html, url, allowedAnchors, rel) {
  const re = new RegExp(`<a\\b[^>]*href=["']${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>([\\s\\S]*?)<\\/a>`, 'gi');
  let m;
  while ((m = re.exec(html))) {
    const text = m[1].replace(/<[^>]+>/g, '').trim().toLowerCase();
    const bad =
      /en iyi|adana gayrimenkul avukatı|adana tapu avukatı/.test(text) &&
      !allowedAnchors.some((a) => text.includes(a.toLowerCase()));
    if (bad) warnings.push(`Exact-match/şüpheli anchor (${url}): "${text}" @ ${rel}`);
  }
}

if (!existsSync(DIST)) {
  console.error('dist yok. Önce npm run build çalıştırın.');
  process.exit(1);
}

// Config entity karışımı
if (!attorneyPhoneDisplay && CONFIG_SRC.includes("attorney") && /attorney[\s\S]*?telephoneDisplay:\s*'0543/.test(CONFIG_SRC)) {
  errors.push('Avukat telefonu Sümer Hukuk numarasıyla doldurulmuş');
}
if (attorneyPhoneInt && attorneyPhoneInt === FIRM_PHONE_INT) {
  warnings.push('Avukat telephoneInternational, Sümer Hukuk telefonu ile aynı — bilinçli değilse ayırın');
}
if (lawFirmMaps && attorneyMaps && lawFirmMaps === attorneyMaps) {
  errors.push('lawFirm ve attorney googleMapsUrl aynı olmamalı');
}
if (lawFirmReview && attorneyReview && lawFirmReview === attorneyReview) {
  errors.push('lawFirm ve attorney googleReviewUrl aynı olmamalı');
}

const htmlFiles = walk(DIST);
const titles = new Map();
const descriptions = new Map();

const requiredPaths = [
  'index.html',
  'gayrimenkul-hukuku/index.html',
  'tapu-hukuku/index.html',
  'tapu-iptal-ve-tescil-davasi/index.html',
  'ortakligin-giderilmesi/index.html',
  'muris-muvazaasi/index.html',
  'hisseli-tapu-uyusmazliklari/index.html',
  'miras-kalan-tasinmazlar/index.html',
  'el-atmanin-onlenmesi/index.html',
  'ecrimisil/index.html',
  'on-alim-hakki/index.html',
  'tapu-kaydinin-duzeltilmesi/index.html',
  'gayrimenkul-satis-vaadi-sozlesmesi/index.html',
  'kat-karsiligi-insaat-sozlesmesi/index.html',
  'gayrimenkul-sozlesmeleri/index.html',
  'sumer-hukuk/index.html',
  'avukat-ceren-sumer-cilli/index.html',
  'makaleler/index.html',
  'iletisim/index.html',
  'gizlilik-politikasi/index.html',
  'aydinlatma-metni/index.html',
  'kullanim-kosullari/index.html',
  '404.html',
];

for (const rel of requiredPaths) {
  if (!existsSync(join(DIST, rel))) errors.push(`Eksik sayfa: ${rel}`);
}

if (!existsSync(join(DIST, 'robots.txt'))) errors.push('robots.txt eksik');
if (!existsSync(join(DIST, 'sitemap.xml'))) errors.push('sitemap.xml eksik');
if (!existsSync(join(DIST, 'rss.xml'))) warnings.push('rss.xml eksik');
if (!existsSync(join(DIST, 'llms.txt'))) warnings.push('llms.txt eksik');
if (!existsSync(join(DIST, 'humans.txt'))) warnings.push('humans.txt eksik');

let sitemap = '';
if (existsSync(join(DIST, 'sitemap.xml'))) {
  sitemap = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
  if (/<loc>[^<]*sumerhukuk\.com/.test(sitemap) || /<loc>[^<]*cerensumer\.av\.tr/.test(sitemap)) {
    errors.push('Sitemap içinde yanlış domain loc bulundu');
  }
  if (!sitemap.includes(`${DOMAIN}/avukat-ceren-sumer-cilli/`)) {
    warnings.push('Sitemap avukat profil sayfasını içermiyor olabilir');
  }
}

const internalHrefs = new Set();
const home = existsSync(join(DIST, 'index.html')) ? readFileSync(join(DIST, 'index.html'), 'utf8') : '';
const contact = existsSync(join(DIST, 'iletisim/index.html'))
  ? readFileSync(join(DIST, 'iletisim/index.html'), 'utf8')
  : '';
const attorneyPage = existsSync(join(DIST, 'avukat-ceren-sumer-cilli/index.html'))
  ? readFileSync(join(DIST, 'avukat-ceren-sumer-cilli/index.html'), 'utf8')
  : '';

// Ana CTA’larda Sümer Hukuk telefonu
for (const [label, html] of [
  ['index', home],
  ['iletisim', contact],
]) {
  if (!html) continue;
  if (!html.includes(FIRM_PHONE_HREF) && !html.includes(FIRM_PHONE_DISPLAY)) {
    errors.push(`Sümer Hukuk telefonu eksik: ${label}`);
  }
}

// Avukat sayfasında firm telefon CTA olabilir (ContactCTA) ama avukat telefonu boşken firm numarasını avukat telefonu diye etiketlememeli
if (attorneyPage && !attorneyPhoneDisplay) {
  if (/Avukat telefonu|kişisel telefon/i.test(attorneyPage) && attorneyPage.includes(FIRM_PHONE_DISPLAY)) {
    errors.push('Avukat sayfasında Sümer Hukuk telefonu avukat telefonu gibi etiketlenmiş');
  }
}

// Maps karışımı: attorney Maps URL lawFirm butonlarında olmamalı
if (attorneyMaps) {
  for (const [label, html] of [
    ['index', home],
    ['iletisim', contact],
  ]) {
    if (html.includes(attorneyMaps) && /Yol Tarifi|Sümer Hukuk ofis/i.test(html)) {
      errors.push(`attorney Maps URL’si lawFirm CTA alanında: ${label}`);
    }
  }
}
if (lawFirmMaps && attorneyPage.includes('Yol Tarifi') && attorneyPage.includes(lawFirmMaps) && /Av\. Ceren|avukat/i.test(attorneyPage)) {
  // ContactCTA on attorney page may show firm maps as primary CTA — that is intentional (primary conversion = firm)
}

for (const file of htmlFiles) {
  const rel = relative(DIST, file);
  const html = readFileSync(file, 'utf8');

  const title = (html.match(/<title>([^<]*)<\/title>/i) || [])[1];
  if (!title) errors.push(`Title eksik: ${rel}`);
  else {
    if (titles.has(title)) warnings.push(`Duplicate title: "${title}" (${rel} & ${titles.get(title)})`);
    else titles.set(title, rel);
  }

  const desc = (html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) || [])[1];
  if (!desc) errors.push(`Description eksik: ${rel}`);
  else {
    if (descriptions.has(desc)) warnings.push(`Duplicate description: ${rel}`);
    else descriptions.set(desc, rel);
  }

  const cans = [
    ...extract(/rel=["']canonical["'][^>]*href=["']([^"']+)["']/i, html),
    ...extract(/href=["']([^"']+)["'][^>]*rel=["']canonical["']/i, html),
  ];
  if (!cans.length) errors.push(`Canonical eksik: ${rel}`);
  for (const c of cans) {
    if (!c.startsWith(DOMAIN)) errors.push(`Yanlış canonical domain (${c}): ${rel}`);
    if (c.includes('sumerhukuk.com') || c.includes('cerensumer.av.tr') || c.includes('google.com/maps')) {
      errors.push(`Canonical yanlış hedefe yönlenmiş (${c}): ${rel}`);
    }
  }

  const h1s = extract(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i, html);
  if (rel !== '404.html' && h1s.length !== 1) errors.push(`H1 sayısı ${h1s.length}: ${rel}`);

  if (html.includes('src=""') || html.includes("src=''")) errors.push(`Boş img src: ${rel}`);
  if (/src=["']undefined/.test(html)) errors.push(`undefined src: ${rel}`);
  if (/href=["'][^"']*undefined/.test(html)) errors.push(`undefined href: ${rel}`);

  const imgs = extract(/<img\b[^>]*>/gi, html);
  for (const img of imgs) {
    if (!/\balt=/.test(img)) errors.push(`Alt eksik: ${rel}`);
  }

  const jsonBlocks = extract(/<script type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi, html);
  for (const block of jsonBlocks) {
    try {
      const data = JSON.parse(block);
      const str = JSON.stringify(data);
      if (/AggregateRating|"@type":"Review"/.test(str)) {
        errors.push(`Yasak schema (rating/review): ${rel}`);
      }
      if (str.includes('adana-gayrimenkul-avukati.com/#organization')) {
        errors.push(`Pillar domain Organization @id: ${rel}`);
      }

      const graphNodes = data['@graph'] || (data['@type'] ? [data] : []);
      for (const node of graphNodes) {
        if (node['@type'] === 'Organization' && node['@id'] && node['@id'] !== ORG_ID) {
          errors.push(`Organization @id beklenen değil (${node['@id']}): ${rel}`);
        }
        if (node['@type'] === 'WebSite') {
          if (node['@id'] !== WEBSITE_ID) errors.push(`WebSite @id hatalı: ${rel}`);
          const pub = node.publisher && node.publisher['@id'];
          if (pub && pub !== ORG_ID) errors.push(`WebSite publisher hatalı: ${rel}`);
        }
        if (node['@type'] === 'LegalService' && node['@id'] && node['@id'] !== LEGAL_ID) {
          errors.push(`LegalService @id hatalı: ${rel}`);
        }
        if (node['@type'] === 'Person') {
          if (node['@id'] !== PERSON_ID) errors.push(`Person @id hatalı (${node['@id']}): ${rel}`);
          if (node.telephone === FIRM_PHONE_INT && !attorneyPhoneInt) {
            errors.push(`Person schema’ya Sümer Hukuk telefonu yazılmış: ${rel}`);
          }
        }
        if (node['@type'] === 'BlogPosting') {
          const authorId = node.author && node.author['@id'];
          const reviewed = node.reviewedBy && node.reviewedBy['@id'];
          // Person author yalnızca cerensumer person id olmalı
          if (authorId === PERSON_ID) {
            // ok when attribution set — soft check via page text
            if (!html.includes('Av. Ceren Sümer Cilli') && !html.includes('hukuki açıdan incelenmiştir')) {
              warnings.push(`BlogPosting Person author ama sayfada avukat atfı zayıf: ${rel}`);
            }
          }
          if (reviewed === PERSON_ID && !/hukuki açıdan incelenmiştir|Hukuki inceleme/i.test(html)) {
            warnings.push(`reviewedBy schema var, görünür inceleme metni yok: ${rel}`);
          }
          if (authorId && authorId.includes('adana-gayrimenkul-avukati.com') && authorId.includes('person')) {
            errors.push(`Yanıltıcı Person author @id: ${rel}`);
          }
        }
      }
    } catch {
      errors.push(`Bozuk JSON-LD: ${rel}`);
    }
  }

  brandedAnchorOk(html, FIRM_SITE, ['sümer hukuk', 'sumer hukuk', 'hukuk bürosu'], rel);
  brandedAnchorOk(html, ATTORNEY_SITE, ['ceren', 'av.', 'profil', 'internet sitesi', 'mesleki'], rel);

  assertAddress(html, rel);

  const hrefs = extract(/href=["']([^"']+)["']/gi, html);
  for (const href of hrefs) {
    if (href.startsWith('/') && !href.startsWith('//')) internalHrefs.add(href.split('#')[0]);
  }
}

for (const href of internalHrefs) {
  if (!href || href === '/') continue;
  if (href.startsWith('/_astro/')) continue;
  if (/\.(xml|txt|webmanifest|svg|css|js)$/i.test(href)) {
    const filePath = join(DIST, href.replace(/^\//, ''));
    if (!existsSync(filePath)) warnings.push(`Muhtemel kırık asset: ${href}`);
    continue;
  }
  const clean = href.replace(/^\//, '').replace(/\/$/, '');
  const asIndex = join(DIST, clean, 'index.html');
  const asFile = join(DIST, `${clean}.html`);
  if (!existsSync(asIndex) && !existsSync(asFile) && clean !== '404') {
    warnings.push(`İç link hedefi bulunamadı: ${href}`);
  }
}

if (sitemap) {
  for (const rel of requiredPaths) {
    if (rel === '404.html') continue;
    const path = rel === 'index.html' ? '/' : `/${rel.replace(/index\.html$/, '')}`;
    if (!sitemap.includes(`${DOMAIN}${path}`)) warnings.push(`Sitemap kapsamı eksik olabilir: ${path}`);
  }
}

console.log(`Denetlenen HTML: ${htmlFiles.length}`);
console.log(`Hatalar: ${errors.length}`);
console.log(`Uyarılar: ${warnings.length}`);
for (const e of errors) console.log('ERROR:', e);
for (const w of warnings) console.log('WARN:', w);

if (errors.length) process.exit(1);
console.log('Audit geçti.');
