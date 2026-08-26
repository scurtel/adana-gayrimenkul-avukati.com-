/**
 * Additive Milliyet Gazetesi publications section for the adanaavukat.org homepage.
 * Does not alter schema, URLs, or existing homepage sections.
 */

export const PROFILE_URL = 'https://www.cerensumer.av.tr/av-ceren-sumer-cilli/';
export const SECTION_ID = 'milliyet-hukuk-yazilari';
export const SECTION_H2 = 'Av. Ceren Sümer Cilli’nin Milliyet’te Yayımlanan Hukuk Yazıları';

export const MILLIYET_ARTICLES = [
  {
    title: 'Çekişmeli Boşanma Davası',
    url: 'https://blog.milliyet.com.tr/cekismeli-bosanma-davasi/Blog/?BlogNo=636105',
    note: 'Çekişmeli boşanma yolunun ne zaman gündeme geldiğine ilişkin Milliyet Gazetesi yazısı.',
  },
  {
    title: 'Boşanma Davaları',
    url: 'https://blog.milliyet.com.tr/bosanma-davalari/Blog/?BlogNo=633766',
    note: 'Anlaşmalı ve çekişmeli boşanma süreçlerine dair genel bir çerçeve.',
  },
  {
    title: 'Evlenen Eski Eş Nafaka Alır Mı',
    url: 'https://blog.milliyet.com.tr/evlenen-eski-es-nafaka-alir-mi/Blog/?BlogNo=632603',
    note: 'Nafaka yükümlülüğünün boşanma sonrası evlilikle nasıl etkilendiği üzerine.',
  },
  {
    title: 'Çocuğun Velayeti Kime Verilir?',
    url: 'https://blog.milliyet.com.tr/cocugun-velayeti-kime-verilir-/Blog/?BlogNo=631566',
    note: 'Velayet düzenlemesinde çocuğun üstün yararı ilkesine ilişkin değerlendirme.',
  },
  {
    title: 'Miras Davası Nasıl Açılır?',
    url: 'https://blog.milliyet.com.tr/miras-davasi-nasil-acilir-/Blog/?BlogNo=627938',
    note: 'Miras uyuşmazlıklarında dava yoluna ilişkin Milliyet Gazetesi yazısı.',
  },
  {
    title: 'Whatsapp Kaydı Delil Olur Mu',
    url: 'https://blog.milliyet.com.tr/whatsapp-kaydi-delil-olur-mu/Blog/?BlogNo=626957',
    note: 'Dijital yazışmaların delil olarak değerlendirilmesine dair hukuki bakış.',
  },
];

function escapeHtml(text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildMilliyetHomepageSection() {
  const cards = MILLIYET_ARTICLES.map(
    (article) => `<div class="aa-card">
<h3>${escapeHtml(article.title)}</h3>
<p>${escapeHtml(article.note)}</p>
<a class="aa-card-link" href="${article.url}" rel="noopener">${escapeHtml(article.title)}</a>
</div>`
  ).join('\n');

  return `<section id="${SECTION_ID}">
<div class="aa-container">
<h2>${SECTION_H2}</h2>
<p class="aa-section-lead">Av. Ceren Sümer Cilli’nin Milliyet bünyesindeki Milliyet Blog platformunda yayımlanan aile hukuku ve özel hukuk alanındaki yazılarından seçmeler.</p>
<div class="aa-grid-3">
${cards}
</div>
<p class="aa-section-lead">
<a href="${PROFILE_URL}" rel="noopener">Av. Ceren Sümer Cilli’nin mesleki özgeçmişi ve yayınları</a>
</p>
</div>
</section>
`;
}

export function homepageHasMilliyetSection(html = '') {
  return (
    html.includes(`id="${SECTION_ID}"`) ||
    html.includes('Milliyet’te Yayımlanan Hukuk Yazıları') ||
    html.includes('Milliyet&#8217;te Yayımlanan Hukuk Yazıları') ||
    html.includes('Milliyet Gazetesi’ndeki Hukuk Yazıları') ||
    html.includes('Milliyet Gazetesi&#8217;ndeki Hukuk Yazıları')
  );
}

/**
 * Insert the section after the attorney entity block and before
 * "Neden Hukuki Destek Önemli?" without rewriting other homepage HTML.
 */
export function insertMilliyetSection(html) {
  if (homepageHasMilliyetSection(html)) {
    return { html, alreadyPresent: true, inserted: false };
  }

  const section = buildMilliyetHomepageSection();
  const marker = '<h2>Neden Hukuki Destek Önemli?</h2>';
  const markerIndex = html.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error(
      'Ana sayfada "Neden Hukuki Destek Önemli?" başlığı bulunamadı; mevcut yapı değişmiş olabilir.'
    );
  }

  const sectionStart = html.lastIndexOf('<section', markerIndex);
  if (sectionStart === -1) {
    throw new Error('Ekleme noktası için section açılışı bulunamadı.');
  }

  return {
    html: `${html.slice(0, sectionStart)}${section}${html.slice(sectionStart)}`,
    alreadyPresent: false,
    inserted: true,
  };
}
