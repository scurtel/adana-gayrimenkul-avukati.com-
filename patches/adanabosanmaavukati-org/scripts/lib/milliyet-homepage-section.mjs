/**
 * Additive Milliyet Gazetesi publications section for adanabosanmaavukati.org homepage.
 * Family-law / divorce related articles only. Does not alter schema.
 */

export const PROFILE_URL = 'https://www.cerensumer.av.tr/av-ceren-sumer-cilli/';
export const SECTION_ID = 'milliyet-hukuk-yazilari';
export const SECTION_H2 = 'Av. Ceren Sümer Cilli’nin Milliyet Gazetesi’ndeki Hukuk Yazıları';

export const INTERNAL_LINKS = {
  anlasmali: {
    href: 'https://adanabosanmaavukati.org/adanada-anlasmali-bosanma-avukati/',
    text: 'anlaşmalı boşanma',
  },
  cekismeli: {
    href: 'https://adanabosanmaavukati.org/adana-cekismeli-bosanma-avukati/',
    text: 'çekişmeli boşanma',
  },
  malPaylasimi: {
    href: 'https://adanabosanmaavukati.org/bosanmada-mal-paylasimi-ve-katilma-alacagi/',
    text: 'mal paylaşımı',
  },
};

export const MILLIYET_ARTICLES = [
  {
    title: 'Çekişmeli Boşanma Davası',
    url: 'https://blog.milliyet.com.tr/cekismeli-bosanma-davasi/Blog/?BlogNo=636105',
  },
  {
    title: 'Boşanma Davaları',
    url: 'https://blog.milliyet.com.tr/bosanma-davalari/Blog/?BlogNo=633766',
  },
  {
    title: 'Evlenen Eski Eş Nafaka Alır Mı',
    url: 'https://blog.milliyet.com.tr/evlenen-eski-es-nafaka-alir-mi/Blog/?BlogNo=632603',
  },
  {
    title: 'Çocuğun Velayeti Kime Verilir?',
    url: 'https://blog.milliyet.com.tr/cocugun-velayeti-kime-verilir-/Blog/?BlogNo=631566',
  },
  {
    title: 'Boşanma ve Sadakat Yükümlülüğü',
    url: 'https://blog.milliyet.com.tr/bosanma-ve-sadakat-yukumlulugu/Blog/?BlogNo=627448',
  },
];

function escapeHtml(text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildMilliyetHomepageSection({ gutenbergComments = true } = {}) {
  const items = MILLIYET_ARTICLES.map(
    (article) => `<li><a href="${article.url}" rel="noopener">${escapeHtml(article.title)}</a></li>`
  ).join('\n');

  const heading = `<h2 class="wp-block-heading" id="${SECTION_ID}">${SECTION_H2}</h2>`;
  const intro = `<p class="wp-block-paragraph">Av. Ceren Sümer Cilli, aile hukuku alanında <a href="${INTERNAL_LINKS.cekismeli.href}">${INTERNAL_LINKS.cekismeli.text}</a>, velayet ve nafaka konularındaki değerlendirmeleriyle Milliyet Gazetesi’nde yazılar kaleme almıştır. Aşağıdaki seçki, boşanma ve aile hukukuna doğrudan ilişkin yayınlardan oluşur.</p>`;
  const list = `<ul class="wp-block-list">\n${items}\n</ul>`;
  const closer = `<p class="wp-block-paragraph"><a href="${INTERNAL_LINKS.anlasmali.href}">Anlaşmalı boşanma</a> ve <a href="${INTERNAL_LINKS.malPaylasimi.href}">mal paylaşımı</a> süreçleri de bu yazılarla birlikte okunabilir. <a href="${PROFILE_URL}" rel="noopener">Av. Ceren Sümer Cilli’nin mesleki özgeçmişi ve yayınları</a> ana kişi profilinde yer alır.</p>`;

  if (!gutenbergComments) {
    return `${heading}\n${intro}\n${list}\n${closer}\n`;
  }

  return `<!-- wp:heading -->
${heading}
<!-- /wp:heading -->

<!-- wp:paragraph -->
${intro}
<!-- /wp:paragraph -->

<!-- wp:list -->
${list}
<!-- /wp:list -->

<!-- wp:paragraph -->
${closer}
<!-- /wp:paragraph -->
`;
}

export function homepageHasMilliyetSection(html = '') {
  return (
    html.includes(`id="${SECTION_ID}"`) ||
    html.includes('Milliyet Gazetesi’ndeki Hukuk Yazıları') ||
    html.includes('Milliyet Gazetesi&#8217;ndeki Hukuk Yazıları')
  );
}

function findInsertionIndex(html) {
  const patterns = [
    '<h3 class="wp-block-heading">Sık Sorulan 3 Soru</h3>',
    '<h3 class="wp-block-heading">Sık Sorulan 3 Soru</h3>',
    'Sık Sorulan 3 Soru',
  ];
  for (const pattern of patterns) {
    const idx = html.indexOf(pattern);
    if (idx !== -1) return idx;
  }
  return -1;
}

/**
 * Insert before the existing FAQ heading so current H2s stay intact.
 */
export function insertMilliyetSection(html) {
  if (homepageHasMilliyetSection(html)) {
    return { html, alreadyPresent: true, inserted: false };
  }

  const looksLikeGutenbergRaw = html.includes('<!-- wp:');
  const section = buildMilliyetHomepageSection({ gutenbergComments: looksLikeGutenbergRaw });
  const markerIndex = findInsertionIndex(html);
  if (markerIndex === -1) {
    throw new Error(
      'Ana sayfada "Sık Sorulan 3 Soru" başlığı bulunamadı; mevcut yapı değişmiş olabilir.'
    );
  }

  let insertAt = html.lastIndexOf('<h3', markerIndex);
  if (insertAt === -1) insertAt = markerIndex;

  if (looksLikeGutenbergRaw) {
    const commentStart = html.lastIndexOf('<!-- wp:heading', insertAt);
    if (commentStart !== -1 && commentStart < insertAt) insertAt = commentStart;
  }

  return {
    html: `${html.slice(0, insertAt)}${section}${html.slice(insertAt)}`,
    alreadyPresent: false,
    inserted: true,
  };
}
