# Milliyet Gazetesi ana sayfa bölümü (hazırlık)

Bu klasör, canlı WordPress sitelerine **henüz uygulanmamış** additive ana sayfa bölümünü içerir.

Hedef repolar:
- `scurtel/adanaavukat.org`
- `scurtel/adanabosanmaavukati-org`

Bu cloud agent yalnızca `adana-gayrimenkul-avukati.com-` reposuna yazabildiği için yamalar burada teslim edilmiştir. **Production deploy yapılmadı.**

## adanaavukat.org

Dosyaları `adanaavukat.org` repo köküne kopyalayın:

- `scripts/lib/milliyet-homepage-section.mjs`
- `scripts/apply-milliyet-homepage-section.mjs`
- `scripts/lib/homepage-content.mjs` (yalnızca Milliyet bölümü eklendi)
- `package.json` (`apply:milliyet-section` script)
- `.gitignore` (tam sayfa önizleme hariç)
- `reports/milliyet-homepage-section.md`

Dry-run:

```bash
npm run apply:milliyet-section
```

Canlı yazma (ayrı onay sonrası):

```bash
node scripts/apply-milliyet-homepage-section.mjs --execute
```

## adanabosanmaavukati.org

Dosyaları `adanabosanmaavukati-org` repo köküne kopyalayın:

- `scripts/lib/milliyet-homepage-section.mjs`
- `scripts/apply-milliyet-homepage-section.mjs`
- `package.json` (`apply:milliyet-section` script)
- `reports/milliyet-homepage-section.md`

Dry-run / execute aynı komutlar.

Schema değiştirilmez. `--execute` olmadan WordPress’e yazılmaz.
