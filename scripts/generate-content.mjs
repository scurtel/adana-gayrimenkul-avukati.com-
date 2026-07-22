#!/usr/bin/env node
/**
 * Gemini ile özgün topic ve makale içerikleri üretir.
 * Kullanım: node scripts/generate-content.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function loadEnv() {
  const envPath = join(root, '.env');
  if (!existsSync(envPath)) throw new Error('.env bulunamadı');
  const raw = readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  }
  return env;
}

const env = loadEnv();
const API_KEY = env.GEMINI_API_KEY;
if (!API_KEY) throw new Error('GEMINI_API_KEY eksik');

const MODEL = 'gemini-2.5-flash';
const TOPICS_DIR = join(root, 'src/content/topics');
const ARTICLES_DIR = join(root, 'src/content/articles');

mkdirSync(TOPICS_DIR, { recursive: true });
mkdirSync(ARTICLES_DIR, { recursive: true });

const topics = [
  {
    slug: 'gayrimenkul-hukuku',
    title: 'Gayrimenkul Hukuku',
    seoTitle: 'Adana Gayrimenkul Hukuku | Sümer Hukuk',
    description:
      'Tapu, mülkiyet, ortaklık, miras ve gayrimenkul sözleşmelerini kapsayan taşınmaz hukuku bilgilendirme sayfası.',
    wordMin: 1800,
    wordMax: 2500,
    isPillar: true,
    related: [
      'tapu-hukuku',
      'tapu-iptal-ve-tescil-davasi',
      'ortakligin-giderilmesi',
      'muris-muvazaasi',
      'hisseli-tapu-uyusmazliklari',
      'miras-kalan-tasinmazlar',
      'el-atmanin-onlenmesi',
      'ecrimisil',
      'on-alim-hakki',
      'tapu-kaydinin-duzeltilmesi',
      'gayrimenkul-satis-vaadi-sozlesmesi',
      'kat-karsiligi-insaat-sozlesmesi',
      'gayrimenkul-sozlesmeleri',
    ],
    faqs: [
      'Gayrimenkul hukuku hangi konuları kapsar?',
      'Tapu kaydı neden önemlidir?',
      'Hisseli taşınmazda ne yapılabilir?',
      'Gayrimenkul uyuşmazlığında hangi belgeler incelenir?',
    ],
  },
  {
    slug: 'tapu-hukuku',
    title: 'Tapu Hukuku',
    seoTitle: 'Adana Tapu Hukuku | Sümer Hukuk',
    description:
      'Tapu sicili, tescil ve taşınmaz kayıtlarından doğan uyuşmazlıklara ilişkin bilgilendirme.',
    wordMin: 1000,
    wordMax: 1600,
    related: ['tapu-iptal-ve-tescil-davasi', 'tapu-kaydinin-duzeltilmesi', 'gayrimenkul-hukuku', 'hisseli-tapu-uyusmazliklari'],
    faqs: [
      'Tapu sicilinin hukuki işlevi nedir?',
      'Yolsuz tescil ne anlama gelir?',
      'Tapu işlemi öncesi hangi belgeler kontrol edilmelidir?',
    ],
  },
  {
    slug: 'tapu-iptal-ve-tescil-davasi',
    title: 'Tapu İptal ve Tescil Davası',
    seoTitle: 'Tapu İptal ve Tescil Davası | Sümer Hukuk',
    description:
      'Yolsuz tescil, irade sakatlığı ve muvazaa gibi durumlarda tapu iptal ve tescil sürecine ilişkin bilgiler.',
    wordMin: 1000,
    wordMax: 1600,
    related: ['tapu-hukuku', 'muris-muvazaasi', 'tapu-kaydinin-duzeltilmesi', 'gayrimenkul-hukuku'],
    faqs: [
      'Tapu iptal ve tescil davası hangi durumlarda açılır?',
      'Dava açmadan önce hangi belgeler toplanmalıdır?',
      'İyi niyetli üçüncü kişi kavramı neden önemlidir?',
    ],
  },
  {
    slug: 'ortakligin-giderilmesi',
    title: 'Ortaklığın Giderilmesi',
    seoTitle: 'Ortaklığın Giderilmesi Davası | Sümer Hukuk',
    description:
      'Hisseli taşınmazlarda aynen taksim veya satış yoluyla ortaklığın giderilmesi sürecine ilişkin bilgilendirme.',
    wordMin: 1000,
    wordMax: 1600,
    related: ['hisseli-tapu-uyusmazliklari', 'miras-kalan-tasinmazlar', 'on-alim-hakki', 'gayrimenkul-hukuku'],
    faqs: [
      'Ortaklığın giderilmesi davası nasıl ilerler?',
      'Aynen taksim her zaman mümkün müdür?',
      'Satış yoluyla giderilmede süreç nasıl işler?',
    ],
  },
  {
    slug: 'muris-muvazaasi',
    title: 'Muris Muvazaası',
    seoTitle: 'Muris Muvazaası | Sümer Hukuk',
    description:
      'Miras bırakanın taşınmaz devrinde muvazaa iddiası, ispat ve tapu iptal süreçlerine ilişkin bilgiler.',
    wordMin: 1000,
    wordMax: 1600,
    related: ['tapu-iptal-ve-tescil-davasi', 'miras-kalan-tasinmazlar', 'ortakligin-giderilmesi', 'gayrimenkul-hukuku'],
    faqs: [
      'Muris muvazaası ne anlama gelir?',
      'Muris muvazaasında ispat nasıl değerlendirilir?',
      'Hangi mirasçılar dava açabilir?',
    ],
  },
  {
    slug: 'hisseli-tapu-uyusmazliklari',
    title: 'Hisseli Tapu Uyuşmazlıkları',
    seoTitle: 'Hisseli Tapu Uyuşmazlıkları | Sümer Hukuk',
    description:
      'Paylı mülkiyette kullanım, yönetim, satış ve paydaşlar arası uyuşmazlıklara ilişkin bilgilendirme.',
    wordMin: 1000,
    wordMax: 1600,
    related: ['ortakligin-giderilmesi', 'on-alim-hakki', 'el-atmanin-onlenmesi', 'gayrimenkul-hukuku'],
    faqs: [
      'Hisseli tapuda paydaşların hakları nelerdir?',
      'Bir paydaş taşınmazı tek başına kullanabilir mi?',
      'Pay satışı diğer paydaşları nasıl etkiler?',
    ],
  },
  {
    slug: 'miras-kalan-tasinmazlar',
    title: 'Miras Kalan Taşınmazlar',
    seoTitle: 'Miras Kalan Taşınmazlar | Sümer Hukuk',
    description:
      'Miras yoluyla intikal eden taşınmazların paylaşımı, intikal ve uyuşmazlık süreçlerine ilişkin bilgiler.',
    wordMin: 1000,
    wordMax: 1600,
    related: ['muris-muvazaasi', 'ortakligin-giderilmesi', 'hisseli-tapu-uyusmazliklari', 'gayrimenkul-hukuku'],
    faqs: [
      'Miras kalan taşınmaz nasıl paylaşılır?',
      'İntikal işlemi neden önemlidir?',
      'Mirasçılar anlaşamazsa hangi yollar değerlendirilir?',
    ],
  },
  {
    slug: 'el-atmanin-onlenmesi',
    title: 'El Atmanın Önlenmesi',
    seoTitle: 'El Atmanın Önlenmesi Davası | Sümer Hukuk',
    description:
      'Taşınmaza izinsiz müdahalenin önlenmesi ve mülkiyetin korunmasına ilişkin hukuki bilgilendirme.',
    wordMin: 1000,
    wordMax: 1600,
    related: ['ecrimisil', 'hisseli-tapu-uyusmazliklari', 'gayrimenkul-hukuku', 'tapu-hukuku'],
    faqs: [
      'El atmanın önlenmesi davası nedir?',
      'Hangi müdahaleler dava konusu olabilir?',
      'Ecrimisil ile birlikte talep edilebilir mi?',
    ],
  },
  {
    slug: 'ecrimisil',
    title: 'Ecrimisil',
    seoTitle: 'Ecrimisil Talebi | Sümer Hukuk',
    description:
      'Taşınmazın izinsiz kullanımından doğan ecrimisil taleplerinin şartları ve değerlendirme unsurları.',
    wordMin: 1000,
    wordMax: 1600,
    related: ['el-atmanin-onlenmesi', 'hisseli-tapu-uyusmazliklari', 'gayrimenkul-hukuku'],
    faqs: [
      'Ecrimisil talebi hangi şartlarda ileri sürülebilir?',
      'Ecrimisil tutarı nasıl değerlendirilir?',
      'Zamanaşımı neden önemlidir?',
    ],
  },
  {
    slug: 'on-alim-hakki',
    title: 'Önalım Hakkı',
    seoTitle: 'Önalım Hakkı | Sümer Hukuk',
    description:
      'Paylı mülkiyette önalım hakkının kullanılması, süre ve şartlara ilişkin bilgilendirme.',
    wordMin: 1000,
    wordMax: 1600,
    related: ['hisseli-tapu-uyusmazliklari', 'ortakligin-giderilmesi', 'gayrimenkul-hukuku'],
    faqs: [
      'Önalım hakkı hangi durumlarda kullanılabilir?',
      'Önalım hakkının süresi nedir?',
      'Satışın öğrenilmesi neden kritiktir?',
    ],
  },
  {
    slug: 'tapu-kaydinin-duzeltilmesi',
    title: 'Tapu Kaydının Düzeltilmesi',
    seoTitle: 'Tapu Kaydının Düzeltilmesi | Sümer Hukuk',
    description:
      'Tapu sicilindeki hataların idari veya yargısal yollarla düzeltilmesine ilişkin bilgiler.',
    wordMin: 1000,
    wordMax: 1600,
    related: ['tapu-hukuku', 'tapu-iptal-ve-tescil-davasi', 'gayrimenkul-hukuku'],
    faqs: [
      'Tapu kaydındaki hatalar nasıl düzeltilir?',
      'Her hata için dava gerekir mi?',
      'Düzeltme ile iptal-tescil farkı nedir?',
    ],
  },
  {
    slug: 'gayrimenkul-satis-vaadi-sozlesmesi',
    title: 'Gayrimenkul Satış Vaadi Sözleşmesi',
    seoTitle: 'Gayrimenkul Satış Vaadi Sözleşmesi | Sümer Hukuk',
    description:
      'Satış vaadi sözleşmesinin şekli, ifası ve uyuşmazlıklarına ilişkin hukuki bilgilendirme.',
    wordMin: 1000,
    wordMax: 1600,
    related: ['gayrimenkul-sozlesmeleri', 'kat-karsiligi-insaat-sozlesmesi', 'tapu-iptal-ve-tescil-davasi', 'gayrimenkul-hukuku'],
    faqs: [
      'Satış vaadi sözleşmesinde nelere dikkat edilmelidir?',
      'Şekle aykırılık ne gibi sonuçlar doğurabilir?',
      'İfa edilmeyen vaat karşısında hangi yollar değerlendirilir?',
    ],
  },
  {
    slug: 'kat-karsiligi-insaat-sozlesmesi',
    title: 'Kat Karşılığı İnşaat Sözleşmesi',
    seoTitle: 'Kat Karşılığı İnşaat Sözleşmesi | Sümer Hukuk',
    description:
      'Arsa sahibi ile yüklenici arasındaki kat karşılığı inşaat ilişkilerinde ortaya çıkan uyuşmazlıklar.',
    wordMin: 1000,
    wordMax: 1600,
    related: ['gayrimenkul-sozlesmeleri', 'gayrimenkul-satis-vaadi-sozlesmesi', 'tapu-iptal-ve-tescil-davasi', 'gayrimenkul-hukuku'],
    faqs: [
      'Kat karşılığı inşaat sözleşmesinde sık görülen uyuşmazlıklar nelerdir?',
      'Arsa payı devri neden kritiktir?',
      'Eksik veya ayıplı ifa durumunda ne değerlendirilir?',
    ],
  },
  {
    slug: 'gayrimenkul-sozlesmeleri',
    title: 'Gayrimenkul Sözleşmeleri',
    seoTitle: 'Gayrimenkul Sözleşmeleri | Sümer Hukuk',
    description:
      'Taşınmaz satış, satış vaadi, kat karşılığı ve benzeri gayrimenkul sözleşmelerine ilişkin genel çerçeve.',
    wordMin: 1000,
    wordMax: 1600,
    related: ['gayrimenkul-satis-vaadi-sozlesmesi', 'kat-karsiligi-insaat-sozlesmesi', 'gayrimenkul-hukuku', 'tapu-hukuku'],
    faqs: [
      'Gayrimenkul sözleşmelerinde şekil şartı neden önemlidir?',
      'Sözleşme incelemesinde hangi maddeler öne çıkar?',
      'Uyuşmazlık halinde hangi belgeler korunmalıdır?',
    ],
  },
];

const articles = [
  {
    title: 'Tapu İptal ve Tescil Davası Hangi Durumlarda Açılır?',
    slug: 'tapu-iptal-ve-tescil-davasi-hangi-durumlarda-acilir',
    description:
      'Tapu iptal ve tescil davasının gündeme gelebileceği tipik durumlar, incelenecek belgeler ve süreç değerlendirmesi.',
    category: 'Tapu Hukuku',
    relatedPages: ['/tapu-iptal-ve-tescil-davasi/', '/tapu-hukuku/', '/muris-muvazaasi/'],
    keywords: ['tapu iptal ve tescil', 'yolsuz tescil', 'tapu davası'],
    publishedDate: '2026-03-10',
  },
  {
    title: 'Ortaklığın Giderilmesi Davasında Satış Süreci',
    slug: 'ortakligin-giderilmesi-davasinda-satis-sureci',
    description:
      'Ortaklığın giderilmesi davasında satış yoluyla sona erdirme sürecinin genel aşamaları ve dikkat edilecek noktalar.',
    category: 'Ortaklığın Giderilmesi',
    relatedPages: ['/ortakligin-giderilmesi/', '/hisseli-tapu-uyusmazliklari/', '/miras-kalan-tasinmazlar/'],
    keywords: ['ortaklığın giderilmesi', 'izale-i şuyu', 'satış yoluyla giderilme'],
    publishedDate: '2026-03-18',
  },
  {
    title: 'Hisseli Tapuda Paydaşların Hakları Nelerdir?',
    slug: 'hisseli-tapuda-paydaslarin-haklari-nelerdir',
    description:
      'Paylı mülkiyette kullanım, yönetim, pay satışı ve önalım ilişkileri çerçevesinde paydaş haklarına genel bakış.',
    category: 'Hisseli Tapu',
    relatedPages: ['/hisseli-tapu-uyusmazliklari/', '/on-alim-hakki/', '/ortakligin-giderilmesi/'],
    keywords: ['hisseli tapu', 'paydaş hakları', 'paylı mülkiyet'],
    publishedDate: '2026-03-25',
  },
  {
    title: 'Muris Muvazaası Davasında İspat Nasıl Değerlendirilir?',
    slug: 'muris-muvazaasi-davasinda-ispat-nasil-degerlendirilir',
    description:
      'Muris muvazaası iddiasında ispat araçları, hayatın olağan akışı ve dava stratejisine ilişkin bilgilendirme.',
    category: 'Muris Muvazaası',
    relatedPages: ['/muris-muvazaasi/', '/tapu-iptal-ve-tescil-davasi/', '/miras-kalan-tasinmazlar/'],
    keywords: ['muris muvazaası', 'ispat', 'miras bırakan'],
    publishedDate: '2026-04-02',
  },
  {
    title: 'Miras Kalan Taşınmaz Nasıl Paylaşılır?',
    slug: 'miras-kalan-tasinmaz-nasil-paylasilir',
    description:
      'Miras kalan taşınmazlarda anlaşmalı paylaşım, intikal ve anlaşmazlık halinde değerlendirilebilecek yollar.',
    category: 'Miras',
    relatedPages: ['/miras-kalan-tasinmazlar/', '/ortakligin-giderilmesi/', '/muris-muvazaasi/'],
    keywords: ['miras kalan taşınmaz', 'miras paylaşımı', 'intikal'],
    publishedDate: '2026-04-10',
  },
  {
    title: 'Ecrimisil Talebi Hangi Şartlarda İleri Sürülebilir?',
    slug: 'ecrimisil-talebi-hangi-sartlarda-ileri-surulebilir',
    description:
      'İzinsiz kullanım karşılığı ecrimisil talebinin şartları, hesaplama yaklaşımı ve zamanaşımı notları.',
    category: 'Ecrimisil',
    relatedPages: ['/ecrimisil/', '/el-atmanin-onlenmesi/', '/hisseli-tapu-uyusmazliklari/'],
    keywords: ['ecrimisil', 'izinsiz kullanım', 'taşınmaz tazminatı'],
    publishedDate: '2026-04-18',
  },
  {
    title: 'El Atmanın Önlenmesi Davası Nedir?',
    slug: 'el-atmanin-onlenmesi-davasi-nedir',
    description:
      'Mülkiyete veya zilyetliğe yönelik müdahalelerin önlenmesi davasının konusu, şartları ve ilişkili talepler.',
    category: 'El Atmanın Önlenmesi',
    relatedPages: ['/el-atmanin-onlenmesi/', '/ecrimisil/', '/gayrimenkul-hukuku/'],
    keywords: ['el atmanın önlenmesi', 'müdahalenin men’i', 'mülkiyet koruması'],
    publishedDate: '2026-04-26',
  },
  {
    title: 'Önalım Hakkı Hangi Durumlarda Kullanılabilir?',
    slug: 'onalim-hakki-hangi-durumlarda-kullanilabilir',
    description:
      'Paylı mülkiyette önalım hakkının doğumu, kullanma süresi ve uygulamada sık görülen sorunlar.',
    category: 'Önalım Hakkı',
    relatedPages: ['/on-alim-hakki/', '/hisseli-tapu-uyusmazliklari/', '/ortakligin-giderilmesi/'],
    keywords: ['önalım hakkı', 'şufa', 'pay satışı'],
    publishedDate: '2026-05-04',
  },
  {
    title: 'Gayrimenkul Satış Vaadi Sözleşmesinde Dikkat Edilecekler',
    slug: 'gayrimenkul-satis-vaadi-sozlesmesinde-dikkat-edilecekler',
    description:
      'Satış vaadi sözleşmelerinde şekil, tarafların yükümlülükleri ve uyuşmazlık risklerine ilişkin kontrol listesi.',
    category: 'Sözleşmeler',
    relatedPages: ['/gayrimenkul-satis-vaadi-sozlesmesi/', '/gayrimenkul-sozlesmeleri/', '/tapu-hukuku/'],
    keywords: ['satış vaadi', 'gayrimenkul sözleşmesi', 'noter'],
    publishedDate: '2026-05-12',
  },
  {
    title: 'Tapu Kaydındaki Hatalar Nasıl Düzeltilir?',
    slug: 'tapu-kaydindaki-hatalar-nasil-duzeltilir',
    description:
      'Tapu sicilindeki maddi hataların düzeltilmesi yolları ve iptal-tescil ile farkına ilişkin açıklama.',
    category: 'Tapu Hukuku',
    relatedPages: ['/tapu-kaydinin-duzeltilmesi/', '/tapu-hukuku/', '/tapu-iptal-ve-tescil-davasi/'],
    keywords: ['tapu kaydı düzeltme', 'tapu sicili', 'maddi hata'],
    publishedDate: '2026-05-20',
  },
  {
    title: 'Kat Karşılığı İnşaat Sözleşmesi Uyuşmazlıkları',
    slug: 'kat-karsiligi-insaat-sozlesmesi-uyusmazliklari',
    description:
      'Kat karşılığı inşaat ilişkilerinde gecikme, ayıp, pay dağılımı ve tapu işlemlerinden doğan uyuşmazlıklar.',
    category: 'Sözleşmeler',
    relatedPages: ['/kat-karsiligi-insaat-sozlesmesi/', '/gayrimenkul-sozlesmeleri/', '/gayrimenkul-satis-vaadi-sozlesmesi/'],
    keywords: ['kat karşılığı inşaat', 'arsa payı', 'yüklenici'],
    publishedDate: '2026-05-28',
  },
  {
    title: 'Ortaklığın Giderilmesinde Aynen Taksim Mümkün müdür?',
    slug: 'ortakligin-giderilmesinde-aynen-taksim-mumkun-mudur',
    description:
      'Aynen taksimin şartları, taşınmazın niteliği ve satış yoluna geçişin değerlendirilmesi.',
    category: 'Ortaklığın Giderilmesi',
    relatedPages: ['/ortakligin-giderilmesi/', '/hisseli-tapu-uyusmazliklari/', '/miras-kalan-tasinmazlar/'],
    keywords: ['aynen taksim', 'ortaklığın giderilmesi', 'hisseli taşınmaz'],
    publishedDate: '2026-06-05',
  },
];

async function generate(prompt, retries = 3) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.55,
            maxOutputTokens: 8192,
          },
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`HTTP ${res.status}: ${err.slice(0, 300)}`);
      }
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '';
      if (!text.trim()) throw new Error('Boş yanıt');
      return text.trim();
    } catch (e) {
      console.warn(`Deneme ${i + 1} başarısız:`, e.message);
      if (i === retries - 1) throw e;
      await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
    }
  }
}

function stripFences(text) {
  return text.replace(/^```(?:markdown|md|html)?\s*/i, '').replace(/\s*```$/i, '').trim();
}

function topicPrompt(t) {
  return `Sen Türkçe yazan deneyimli bir hukuk içerik editörüsün. Sümer Hukuk (Adana) için bilgilendirme sitesine özgün içerik yazıyorsun.

KURALLAR:
- Türkçe yaz.
- Markdown kullan (## ve ### başlıklar). H1 yazma (H1 sayfada ayrı).
- ${t.wordMin}-${t.wordMax} kelime arası yaz.
- Anahtar kelime doldurma yapma; "Adana gayrimenkul avukatı" ifadesini en fazla 1 kez kullan veya hiç kullanma.
- Sonuç garantisi, kesin süre, uydurma kanun maddesi numarası veya uydurma Yargıtay kararı yazma.
- sumerhukuk.com metinlerini kopyalama; özgün anlat.
- Agresif satış dili kullanma.
- İçeriğin sonunda şu notu aynen ekle:

> Bu içerik genel bilgilendirme amacı taşır. Somut olayın özelliklerine göre hukuki değerlendirme değişebilir.

Yapı:
## Kısa giriş
## Konunun hukuki çerçevesi
## Hangi durumlarda gündeme gelir?
## İncelenebilecek belgeler
## Sürecin genel aşamaları
## İspat ve değerlendirme
## Sık yapılan hatalar
## Sık sorulan sorular
(Her FAQ için ### soru ve altında cevap; şu soruları kullan: ${t.faqs.join(' | ')})
## İlgili konular
(Metin içinde şu slug'lara doğal markdown link ver: ${t.related.map((s) => `/${s}/`).join(', ')})

Konu başlığı: ${t.title}
Açıklama: ${t.description}
${t.isPillar ? 'Bu ana pillar sayfasıdır; tüm alt konuları kapsayıcı ve derin anlat.' : 'Bu bir cluster hizmet sayfasıdır; odaklı ve pratik anlat.'}

Yalnızca markdown gövde döndür.`;
}

function articlePrompt(a) {
  return `Sen Türkçe yazan deneyimli bir hukuk içerik editörüsün. Sümer Hukuk (Adana) bilgilendirme sitesi için özgün makale yazıyorsun.

KURALLAR:
- Türkçe, Markdown (## / ###). H1 yazma.
- 900-1500 kelime.
- Anahtar kelime spamı yapma.
- Sonuç garantisi, uydurma mevzuat/içtihat numarası verme.
- sumerhukuk.com metinlerini kopyalama.
- Makale sonunda şu notu aynen ekle:

> Bu içerik genel bilgilendirme amacı taşır. Somut olayın özelliklerine göre hukuki değerlendirme değişebilir.

Yapı önerisi:
## Giriş
## Hukuki çerçeve
## Pratikte sık görülen durumlar
## İncelenecek belgeler ve ispat
## Süreçte dikkat edilecekler
## Sık yapılan hatalar
## Sonuç

İlgili sayfalara doğal link ver: ${a.relatedPages.join(', ')}

Makale başlığı: ${a.title}
Kısa açıklama: ${a.description}

Yalnızca markdown gövde döndür.`;
}

function yamlList(arr) {
  return arr.map((x) => `  - ${JSON.stringify(x)}`).join('\n');
}

async function writeTopic(t) {
  const out = join(TOPICS_DIR, `${t.slug}.md`);
  if (existsSync(out) && !process.argv.includes('--force')) {
    console.log('Atlandı (var):', t.slug);
    return;
  }
  console.log('Üretiliyor topic:', t.slug);
  const body = stripFences(await generate(topicPrompt(t)));
  const fm = `---
title: ${JSON.stringify(t.title)}
seoTitle: ${JSON.stringify(t.seoTitle)}
description: ${JSON.stringify(t.description)}
slug: ${JSON.stringify(t.slug)}
isPillar: ${Boolean(t.isPillar)}
related:
${yamlList(t.related)}
draft: false
---

${body}
`;
  writeFileSync(out, fm, 'utf8');
}

async function writeArticle(a) {
  const out = join(ARTICLES_DIR, `${a.slug}.md`);
  if (existsSync(out) && !process.argv.includes('--force')) {
    console.log('Atlandı (var):', a.slug);
    return;
  }
  console.log('Üretiliyor makale:', a.slug);
  const body = stripFences(await generate(articlePrompt(a)));
  const canonical = `https://adana-gayrimenkul-avukati.com/makaleler/${a.slug}/`;
  const fm = `---
title: ${JSON.stringify(a.title)}
description: ${JSON.stringify(a.description)}
slug: ${JSON.stringify(a.slug)}
publishedDate: ${JSON.stringify(a.publishedDate)}
updatedDate: ${JSON.stringify(a.publishedDate)}
author: ""
category: ${JSON.stringify(a.category)}
image: ""
imageAlt: ""
canonical: ${JSON.stringify(canonical)}
draft: false
relatedPages:
${yamlList(a.relatedPages)}
keywords:
${yamlList(a.keywords)}
---

${body}
`;
  writeFileSync(out, fm, 'utf8');
}

async function runPool(items, worker, concurrency = 2) {
  const queue = [...items];
  const runners = Array.from({ length: concurrency }, async () => {
    while (queue.length) {
      const item = queue.shift();
      await worker(item);
      await new Promise((r) => setTimeout(r, 800));
    }
  });
  await Promise.all(runners);
}

const only = process.argv.find((a) => a.startsWith('--only='))?.split('=')[1];

async function main() {
  console.log('Gemini model:', MODEL);
  if (!only || only === 'topics') await runPool(topics, writeTopic, 2);
  if (!only || only === 'articles') await runPool(articles, writeArticle, 2);
  console.log('Tamamlandı.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
