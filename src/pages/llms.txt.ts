import { site, lawFirm, attorney } from '../config/site';
import { topicPages } from '../data/navigation';

/** @type {import('astro').APIRoute} */
export const GET = () => {
  const topicList = topicPages.map((t) => `- ${site.domain}/${t.slug}/ — ${t.title}`).join('\n');

  const body = `# ${site.name}

> ${site.relationshipNote}

## Entity hiyerarşisi
1. Web sitesi: ${site.domain}
2. Yayıncı / ana işletme: ${lawFirm.brandName} (${lawFirm.corporateWebsite})
3. Ana hizmet: gayrimenkul ve tapu hukuku (LegalService)
4. Uzman kişi: ${attorney.name} (${attorney.personalWebsite})

## Ana kurumsal site
- Marka: ${lawFirm.brandName}
- Google Business Profile: ${lawFirm.businessProfileName}
- Resmî site: ${lawFirm.corporateWebsite}
- Bu site ayrı bir hukuk bürosu değildir.

## Uzman avukat
- ${attorney.name}
- Kişisel site: ${attorney.personalWebsite}
- Pillar profil: ${site.domain}${attorney.profilePage}

## Konu alanları
- Gayrimenkul hukuku, tapu hukuku, ortaklığın giderilmesi, muris muvazaası
- Hisseli tapu, miras kalan taşınmazlar, ecrimisil, önalım, gayrimenkul sözleşmeleri

## Önemli sayfalar
- ${site.domain}/
- ${site.domain}/gayrimenkul-hukuku/
- ${site.domain}/sumer-hukuk/
- ${site.domain}${attorney.profilePage}
- ${site.domain}/makaleler/
- ${site.domain}/iletisim/

## Pillar ve cluster URL’leri
${topicList}

## İletişim (Sümer Hukuk)
- Telefon: ${lawFirm.telephoneDisplay}
- Uluslararası: ${lawFirm.telephoneInternational}
- WhatsApp: ${lawFirm.whatsappUrl}
- Adres: ${lawFirm.fullAddress}

## Not
İçerikler genel bilgilendirme amaçlıdır. Somut olay için hukuki değerlendirme değişebilir.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
