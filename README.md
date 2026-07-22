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

## Hostinger static deploy

Bu proje **saf statik Astro** çıktısı üretir (`output: 'static'`). Node.js runtime / Start Command gerekmez.

| Ayar | Değer |
|------|--------|
| Node.js sürümü (build) | **22.x** (`engines`: `>=22.12.0`) |
| Build command | `npm run build` |
| Output directory | `dist` |
| Entry / Start file | **Boş bırakın** (statik site) |
| Start command | **Gerekmez / boş** |

### Hostinger panel adımları

1. GitHub deposunu bağlayın.
2. Statik / Static site veya Websites yayınlama kullanın (Node.js app değil).
3. Build command: `npm run build`
4. Output / Publish directory: `dist`
5. Entry File ve Start Command alanlarını boş bırakın.
6. Domain’i bu static site’e bağlayın; `public_html` Node proxy `.htaccess` kurallarını kullanmayın.

### Environment variable isimleri

Production build için zorunlu env yoktur.

| Değişken | Zorunlu | Açıklama |
|----------|---------|----------|
| `GEMINI_API_KEY` | Hayır | Yalnızca lokal içerik üretimi |
| `GEMINI_GOOGLE_SEARCH_ENABLED` | Hayır | İçerik scripti |

### Yerel production smoke test

```bash
npm ci
npm run build
npx serve dist
```

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
