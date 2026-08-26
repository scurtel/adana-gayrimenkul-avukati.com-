# Milliyet Gazetesi ana sayfa bölümü

Additive bölüm. Schema / Rank Math / canonical / H1 / mevcut H2 / CSS / plugin değiştirilmez.

Canlı gönderim **GitHub Actions** üzerinden yapılır. WordPress kimlik bilgileri bu repoya, patch dosyalarına veya raporlara yazılmaz; Actions secret’larından runtime’da okunur.

Hedef repolar:
- `scurtel/adanaavukat.org` — secret’lar: `ADANAAVUKAT_WP_USERNAME`, `ADANAAVUKAT_WP_APP_PASSWORD`
- `scurtel/adanabosanmaavukati-org` — secret’lar: `WP_USERNAME`, `WP_APPLICATION_PASSWORD` (veya `ADANABOSANMA_WP_*`)

Bu cloud agent yalnızca `adana-gayrimenkul-avukati.com-` reposuna yazabildiği için yamalar burada teslim edilir.

## GitHub Actions

Her hedef repoya kopyalanacak workflow:

- `.github/workflows/apply-milliyet-homepage-section.yml`

Akış:

1. `--auth-test` (`pages/7` ve `pages/19` `context=edit`)
2. İkisi de başarılı değilse yazma yok
3. `content.raw` yedeği
4. Insertion point yoksa dur
5. `--execute` yalnızca additive Milliyet insert
6. Canlı GET + 14 maddelik doğrulama
7. Başarısızsa pre-deploy yedekten rollback

Workflow’u hedef repoda `workflow_dispatch` ile çalıştırın (veya milliyet dosyaları push edilince otomatik çalışır).

## adanaavukat.org

- `scripts/lib/milliyet-homepage-section.mjs`
- `scripts/apply-milliyet-homepage-section.mjs`
- `.github/workflows/apply-milliyet-homepage-section.yml`
- `package.json` (`apply:milliyet-section`)

H2: Av. Ceren Sümer Cilli’nin Milliyet Gazetesi’nde Yayımlanan Hukuk Yazıları  
6 Milliyet yazısı + `https://www.cerensumer.av.tr/av-ceren-sumer-cilli/`

## adanabosanmaavukati.org

- `scripts/lib/milliyet-homepage-section.mjs`
- `scripts/apply-milliyet-homepage-section.mjs`
- `scripts/lib/env.mjs` (GitHub Actions `WP_USERNAME` / `WP_APPLICATION_PASSWORD` okur)
- `.github/workflows/apply-milliyet-homepage-section.yml`

H2 aynı. 5 aile hukuku Milliyet yazısı. Anlaşmalı / çekişmeli / mal paylaşımı iç linkleri korunur.

`--execute` olmadan WordPress’e yazılmaz. Secret değerleri commit edilmez.
