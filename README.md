# Adana Gayrimenkul Avukatı | Sümer Hukuk Pillar Site

Sümer Hukuk tarafından hazırlanan gayrimenkul ve taşınmaz hukuku bilgilendirme sitesi.

> Bu site ayrı bir hukuk bürosu değildir. Ana kurumsal site: [sumerhukuk.com](https://sumerhukuk.com/)

## Kurulum

```bash
npm install
```

Node sürümü: `package.json` içindeki `engines` alanına bakın (`>=22.12.0`).

`.env` dosyası (makale üretimi için):

```bash
GEMINI_API_KEY=your_key
GEMINI_GOOGLE_SEARCH_ENABLED=true
```

## Geliştirme

```bash
npm run dev
```

## Build

```bash
npm run build
```

Çıktı: `dist/`

Kalite kontrol:

```bash
npm run check
npm run audit
```

## Hostinger Node.js deploy

Bu proje Astro + `@astrojs/node` (**standalone**) ile Hostinger **Node.js** uygulaması olarak çalışır.

| Ayar | Değer |
|------|--------|
| Node.js sürümü | **22.x** (`engines`: `>=22.12.0`) |
| Build command | `npm run build` |
| Start command | `npm run start` |
| Uygulama başlangıç dosyası | `scripts/start-server.mjs` → `dist/server/entry.mjs` |
| Dinleme | `HOST=0.0.0.0`, port = `process.env.PORT` |

### Hostinger panel adımları

1. GitHub deposunu bağlayın veya kaynakları yükleyin.
2. Node.js sürümünü **22** seçin.
3. Build command: `npm run build`
4. Start / Application start command: `npm run start`
5. Gerekirse Application root: proje kökü (`package.json`’ın olduğu klasör)

### Environment variable isimleri

| Değişken | Zorunlu | Açıklama |
|----------|---------|----------|
| `PORT` | Hostinger genelde otomatik verir | HTTP dinleme portu |
| `HOST` | Önerilir: `0.0.0.0` | Tüm arayüzlerden dinleme (start script varsayılanı) |
| `GEMINI_API_KEY` | Hayır (yalnızca içerik üretimi) | Production `start` için gerekmez |
| `GEMINI_GOOGLE_SEARCH_ENABLED` | Hayır | İçerik scripti için |

Gerçek API anahtarlarını GitHub’a veya `.env.example` dosyasına koymayın. Panelde secret olarak ekleyin.

### Yerel production smoke test

```bash
npm install
npm run build
PORT=4321 npm run start
```

### Eski statik Hostinger notu

Önceki `dist/` → `public_html` yükleme yolu bu Node.js kurulumunda geçerli değildir. Uygulama `npm run start` ile ayağa kalkar; sunucu hem SSR hem önceden üretilmiş statik varlıkları sunar.

## DNS ve SSL

- Alan adı A/CNAME kayıtlarını Hostinger’a yönlendirin
- SSL (Let’s Encrypt) etkinleştirin

## Entity yapısı

Merkezi dosya: `src/config/site.ts`

```ts
export const site      // pillar site (domain, name, form, analytics)
export const lawFirm   // Sümer Hukuk + birincil GBP
export const attorney  // Av. Ceren Sümer Cilli (ikincil kişi varlığı)
```

### Birincil varlık — Sümer Hukuk (`lawFirm`)

| Alan | Açıklama |
|------|----------|
| `businessProfileName` | Google Business Profile adı |
| `corporateWebsite` | https://sumerhukuk.com/ |
| `telephone*` / `whatsappUrl` | Ana CTA telefonları |
| `googleMapsUrl` / `googleMapsEmbedUrl` | Yol tarifi ve embed |
| `googleReviewUrl` | Yorum linki (AggregateRating schema’ya eklenmez) |
| `googleRating` | Opsiyonel görüntüleme; schema’ya dahil edilmez |
| `socialProfiles` | Yalnızca Sümer Hukuk sameAs |

### İkincil varlık — Av. Ceren Sümer Cilli (`attorney`)

| Alan | Açıklama |
|------|----------|
| `personalWebsite` | https://cerensumer.av.tr/ |
| `profilePage` | `/avukat-ceren-sumer-cilli/` |
| `googleMapsUrl` / `googleReviewUrl` | Kişisel GBP (lawFirm ile karıştırmayın) |
| `telephone*` / `email` | Boş bırakılabilir; firm numarası otomatik kopyalanmaz |
| `socialProfiles` | Yalnızca avukata ait sameAs |

İki Maps/review URL’sini veya telefonları birbirine kopyalamayın.

## Config alanları (site)

| Alan | Açıklama |
|------|----------|
| `googleAnalyticsId` | GA4 ölçüm kimliği |
| `searchConsoleVerification` | Search Console meta doğrulama |
| `formEndpoint` | Form POST adresi |
| `logo` / `defaultImage` | Marka ve OG görselleri |

Uydurma koordinat, e-posta, çalışma saati veya sosyal profil eklemeyin.

## Google Maps URL ekleme

**Sümer Hukuk:** `lawFirm.googleMapsUrl` + `lawFirm.googleMapsEmbedUrl`  
**Avukat:** `attorney.googleMapsUrl` (yalnızca kişisel profil)

URL’ler boşken bozuk buton veya boş iframe gösterilmez.

## Google yorum URL ekleme

- `lawFirm.googleReviewUrl` — Sümer Hukuk GBP  
- `attorney.googleReviewUrl` — Avukat GBP  

**AggregateRating / Review schema eklenmez.** Puan gösterilecekse hangi profile ait olduğu ve `lastVerified` yazılmalıdır.

## Makale yazar / inceleme

Frontmatter alanları:

- `author` / `authorUrl`
- `reviewedBy` / `reviewerUrl`
- `publishedDate` / `updatedDate`

Avukat gerçekten yazdıysa: `author: "Av. Ceren Sümer Cilli"`  
Avukat gerçekten incelediyse: `reviewedBy: "Av. Ceren Sümer Cilli"`  

İncelenmemiş Gemini içeriklerinde bu alanları **boş** bırakın; sistem yayıncıyı Sümer Hukuk olarak gösterir.

## Google Analytics ekleme

`googleAnalyticsId` alanına `G-XXXXXXXX` değerini yazın. Boşken analitik script yüklenmez.

## Search Console doğrulaması

`searchConsoleVerification` alanına meta doğrulama kodunu ekleyin veya HTML dosyası yöntemini kullanın.

## Sitemap gönderme

Canlıya alındıktan sonra:

`https://adana-gayrimenkul-avukati.com/sitemap.xml`

adresini Google Search Console’a ekleyin.

## Yeni cluster sayfası oluşturma

1. `src/data/navigation.ts` içine slug/meta ekleyin
2. `scripts/generate-content.mjs` topics listesine ekleyip `npm run generate:content -- --only=topics` çalıştırın  
   veya `src/content/topics/yeni-slug.md` dosyasını elle oluşturun
3. `npm run build && npm run audit`

## Yeni makale oluşturma

1. `src/content/articles/makale-slug.md` ekleyin (frontmatter alanları: title, description, slug, publishedDate, updatedDate, author, category, image, imageAlt, canonical, draft, relatedPages, keywords)
2. veya `scripts/generate-content.mjs` articles listesini güncelleyip `npm run generate:content -- --only=articles`
3. `npm run build`

## Görsel optimizasyonu

Klasörler:

- `public/images/brand/`
- `public/images/office/`
- `public/images/services/`
- `public/images/articles/`

Önerilen görseller:

- Sümer Hukuk logosu
- Ofis tabelası
- Ofis girişi
- Çolakoğlu İş Merkezi
- Görüşme alanı
- Gayrimenkul/tapu konulu özgün görseller
- Varsayılan sosyal paylaşım görseli (`defaultImage`)

WebP/AVIF tercih edin; width/height verin; hero’da lazy loading kullanmayın. Gerçek görsel yokken kırık `img` eklemeyin.

## Ana site ile bağlantı stratejisi

Pillar site → sumerhukuk.com:

- Footer’da tek branded link
- `/sumer-hukuk/` sayfasında doğal branded link(ler)
- `/iletisim/` sayfasında resmî site linki

Exact-match anahtar kelime backlink kullanmayın.

sumerhukuk.com → pillar site (manuel öneri):

- Gayrimenkul hizmet sayfasından doğal bağlamlı link
- İlgili bir makaleden kaynak/bilgi merkezi linki
- Sitewide exact-match footer link önermiyoruz

## Canonical kuralları

- Canonical’lar her zaman `https://adana-gayrimenkul-avukati.com/...` olmalı
- sumerhukuk.com’a canonical verilmez
- UTM parametreleri canonical’a eklenmez

## Google Business Profile web sitesi alanı

Tek website alanı olduğu için varsayılan öneri: ana kurumsal siteyi koruyun.

Ana kurumsal:

`https://sumerhukuk.com/?utm_source=google&utm_medium=organic&utm_campaign=google_business_profile`

Gayrimenkul odaklı alternatif:

`https://adana-gayrimenkul-avukati.com/?utm_source=google&utm_medium=organic&utm_campaign=google_business_profile&utm_content=gayrimenkul`

Pillar siteyi GBP gönderilerinde, hizmet bağlantılarında (mümkünse) ve gayrimenkul içerik paylaşımlarında kullanın. Ayrı bir Google Business Profile oluşturmayın.

## UTM kullanımı

UTM’ler kampanya URL’lerinde kullanılabilir; canonical, sitemap ve iç linklerde kullanılmaz.

## İçerik üretimi (Gemini)

```bash
npm run generate:content
npm run generate:content -- --force
npm run generate:content -- --only=articles
```

## Lisans / sorumluluk

İçerikler genel bilgilendirme amaçlıdır; hukuki tavsiye yerine geçmez.
