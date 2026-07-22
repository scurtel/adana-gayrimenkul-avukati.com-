export const mainNav = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/gayrimenkul-hukuku/', label: 'Gayrimenkul Hukuku' },
  { href: '/tapu-davalar/', label: 'Tapu Davaları', aliasOf: '/tapu-iptal-ve-tescil-davasi/' },
  { href: '/ortakligin-giderilmesi/', label: 'Ortaklığın Giderilmesi' },
  { href: '/miras-kalan-tasinmazlar/', label: 'Miras Kaynaklı Taşınmazlar' },
  { href: '/makaleler/', label: 'Makaleler' },
  { href: '/sumer-hukuk/', label: 'Sümer Hukuk' },
  { href: '/iletisim/', label: 'İletişim' },
] as const;

/** Header menüsünde “Tapu Davaları” için kullanılan gerçek hedef */
export const headerNav = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/gayrimenkul-hukuku/', label: 'Gayrimenkul Hukuku' },
  { href: '/tapu-iptal-ve-tescil-davasi/', label: 'Tapu Davaları' },
  { href: '/ortakligin-giderilmesi/', label: 'Ortaklığın Giderilmesi' },
  { href: '/miras-kalan-tasinmazlar/', label: 'Miras Kaynaklı Taşınmazlar' },
  { href: '/makaleler/', label: 'Makaleler' },
  { href: '/sumer-hukuk/', label: 'Sümer Hukuk' },
  { href: '/iletisim/', label: 'İletişim' },
] as const;

export const topicPages = [
  {
    slug: 'gayrimenkul-hukuku',
    title: 'Gayrimenkul Hukuku',
    menuLabel: 'Gayrimenkul Hukuku',
    description:
      'Tapu sicili, mülkiyet, ortaklık, miras ve gayrimenkul sözleşmelerini kapsayan taşınmaz hukuku bilgilendirme sayfası.',
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
  },
  {
    slug: 'tapu-hukuku',
    title: 'Tapu Hukuku',
    description:
      'Tapu sicili, tescil, yolsuz tescil ve taşınmaz kayıtlarından doğan uyuşmazlıklara ilişkin bilgilendirme.',
    isPillar: false,
    related: [
      'tapu-iptal-ve-tescil-davasi',
      'tapu-kaydinin-duzeltilmesi',
      'gayrimenkul-hukuku',
      'hisseli-tapu-uyusmazliklari',
    ],
  },
  {
    slug: 'tapu-iptal-ve-tescil-davasi',
    title: 'Tapu İptal ve Tescil Davası',
    description:
      'Yolsuz tescil, irade sakatlığı, muvazaa ve benzeri durumlarda tapu iptal ve tescil sürecine ilişkin bilgiler.',
    isPillar: false,
    related: ['tapu-hukuku', 'muris-muvazaasi', 'tapu-kaydinin-duzeltilmesi', 'gayrimenkul-hukuku'],
  },
  {
    slug: 'ortakligin-giderilmesi',
    title: 'Ortaklığın Giderilmesi',
    description:
      'Hisseli taşınmazlarda aynen taksim veya satış yoluyla ortaklığın giderilmesi sürecine ilişkin bilgilendirme.',
    isPillar: false,
    related: [
      'hisseli-tapu-uyusmazliklari',
      'miras-kalan-tasinmazlar',
      'on-alim-hakki',
      'gayrimenkul-hukuku',
    ],
  },
  {
    slug: 'muris-muvazaasi',
    title: 'Muris Muvazaası',
    description:
      'Miras bırakanın taşınmaz devrinde muvazaa iddiası, ispat ve tapu iptal süreçlerine ilişkin bilgiler.',
    isPillar: false,
    related: [
      'tapu-iptal-ve-tescil-davasi',
      'miras-kalan-tasinmazlar',
      'ortakligin-giderilmesi',
      'gayrimenkul-hukuku',
    ],
  },
  {
    slug: 'hisseli-tapu-uyusmazliklari',
    title: 'Hisseli Tapu Uyuşmazlıkları',
    description:
      'Paylı mülkiyette kullanım, yönetim, satış ve paydaşlar arası uyuşmazlıklara ilişkin bilgilendirme.',
    isPillar: false,
    related: ['ortakligin-giderilmesi', 'on-alim-hakki', 'el-atmanin-onlenmesi', 'gayrimenkul-hukuku'],
  },
  {
    slug: 'miras-kalan-tasinmazlar',
    title: 'Miras Kalan Taşınmazlar',
    description:
      'Miras yoluyla intikal eden taşınmazların paylaşımı, intikal ve uyuşmazlık süreçlerine ilişkin bilgiler.',
    isPillar: false,
    related: ['muris-muvazaasi', 'ortakligin-giderilmesi', 'hisseli-tapu-uyusmazliklari', 'gayrimenkul-hukuku'],
  },
  {
    slug: 'el-atmanin-onlenmesi',
    title: 'El Atmanın Önlenmesi',
    description:
      'Taşınmaza izinsiz müdahalenin önlenmesi ve mülkiyetin korunmasına ilişkin hukuki bilgilendirme.',
    isPillar: false,
    related: ['ecrimisil', 'hisseli-tapu-uyusmazliklari', 'gayrimenkul-hukuku', 'tapu-hukuku'],
  },
  {
    slug: 'ecrimisil',
    title: 'Ecrimisil',
    description:
      'Taşınmazın izinsiz kullanımından doğan ecrimisil taleplerinin şartları ve değerlendirme unsurları.',
    isPillar: false,
    related: ['el-atmanin-onlenmesi', 'hisseli-tapu-uyusmazliklari', 'gayrimenkul-hukuku'],
  },
  {
    slug: 'on-alim-hakki',
    title: 'Önalım Hakkı',
    description:
      'Paylı mülkiyette önalım hakkının kullanılması, süre ve şartlara ilişkin bilgilendirme.',
    isPillar: false,
    related: ['hisseli-tapu-uyusmazliklari', 'ortakligin-giderilmesi', 'gayrimenkul-hukuku'],
  },
  {
    slug: 'tapu-kaydinin-duzeltilmesi',
    title: 'Tapu Kaydının Düzeltilmesi',
    description:
      'Tapu sicilindeki hataların idari veya yargısal yollarla düzeltilmesine ilişkin bilgiler.',
    isPillar: false,
    related: ['tapu-hukuku', 'tapu-iptal-ve-tescil-davasi', 'gayrimenkul-hukuku'],
  },
  {
    slug: 'gayrimenkul-satis-vaadi-sozlesmesi',
    title: 'Gayrimenkul Satış Vaadi Sözleşmesi',
    description:
      'Satış vaadi sözleşmesinin şekli, ifası ve uyuşmazlıklarına ilişkin hukuki bilgilendirme.',
    isPillar: false,
    related: [
      'gayrimenkul-sozlesmeleri',
      'kat-karsiligi-insaat-sozlesmesi',
      'tapu-iptal-ve-tescil-davasi',
      'gayrimenkul-hukuku',
    ],
  },
  {
    slug: 'kat-karsiligi-insaat-sozlesmesi',
    title: 'Kat Karşılığı İnşaat Sözleşmesi',
    description:
      'Arsa sahibi ile yüklenici arasındaki kat karşılığı inşaat ilişkilerinde ortaya çıkan uyuşmazlıklar.',
    isPillar: false,
    related: [
      'gayrimenkul-sozlesmeleri',
      'gayrimenkul-satis-vaadi-sozlesmesi',
      'tapu-iptal-ve-tescil-davasi',
      'gayrimenkul-hukuku',
    ],
  },
  {
    slug: 'gayrimenkul-sozlesmeleri',
    title: 'Gayrimenkul Sözleşmeleri',
    description:
      'Taşınmaz satış, satış vaadi, kat karşılığı ve benzeri gayrimenkul sözleşmelerine ilişkin genel çerçeve.',
    isPillar: false,
    related: [
      'gayrimenkul-satis-vaadi-sozlesmesi',
      'kat-karsiligi-insaat-sozlesmesi',
      'gayrimenkul-hukuku',
      'tapu-hukuku',
    ],
  },
] as const;

export type TopicSlug = (typeof topicPages)[number]['slug'];

export function getTopicBySlug(slug: string) {
  return topicPages.find((page) => page.slug === slug);
}
