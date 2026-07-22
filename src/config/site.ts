/** Pillar site (yayın yüzeyi) — ayrı işletme değildir */
export const site = {
  name: 'Adana Gayrimenkul Avukatı | Sümer Hukuk',
  domain: 'https://adana-gayrimenkul-avukati.com',
  description:
    'Adana’da tapu, gayrimenkul, ortaklığın giderilmesi, muris muvazaası ve taşınmaz uyuşmazlıklarına ilişkin hukuki bilgilendirme ve hizmetler.',
  tagline: 'Gayrimenkul ve Taşınmaz Hukuku Bilgi Merkezi',
  relationshipNote:
    'adana-gayrimenkul-avukati.com, Sümer Hukuk tarafından hazırlanan gayrimenkul ve taşınmaz hukuku bilgilendirme sitesidir.',
  footerNote:
    'Bu site, Sümer Hukuk tarafından gayrimenkul ve taşınmaz hukuku alanında genel bilgilendirme amacıyla hazırlanmıştır.',
  logo: '',
  defaultImage: '',
  googleAnalyticsId: '',
  searchConsoleVerification: '',
  formEndpoint: '',
  websiteId: 'https://adana-gayrimenkul-avukati.com/#website',
} as const;

/** Birincil işletme varlığı: Sümer Hukuk + ilgili Google Business Profile */
export const lawFirm = {
  brandName: 'Sümer Hukuk',
  businessProfileName: 'Adana Gayrimenkul Tapu Avukatı Sümer Hukuk',
  businessType: 'Law firm',
  corporateWebsite: 'https://sumerhukuk.com/',
  telephoneDisplay: '0543 251 54 38',
  telephoneInternational: '+905432515438',
  telephoneHref: 'tel:+905432515438',
  whatsappUrl: 'https://wa.me/905432515438',
  email: '',
  fullAddress: 'Kayalıbağ, Çolakoğlu İş Merkezi Kat 2 No: 1, 01131 Seyhan/Adana',
  neighborhood: 'Kayalıbağ',
  building: 'Çolakoğlu İş Merkezi',
  floor: 'Kat 2',
  doorNumber: 'No: 1',
  postalCode: '01131',
  district: 'Seyhan',
  city: 'Adana',
  country: 'TR',
  streetAddress: 'Kayalıbağ, Çolakoğlu İş Merkezi Kat 2 No: 1',
  // TODO: Sümer Hukuk Google Maps paylaşım URL’sini ekleyin
  googleMapsUrl: '',
  // TODO: Sümer Hukuk Google Maps embed URL’sini ekleyin
  googleMapsEmbedUrl: '',
  // TODO: Sümer Hukuk Google yorum URL’sini ekleyin
  googleReviewUrl: '',
  // TODO: Doğrulanmış koordinatlar (uydurma değer kullanmayın)
  latitude: null as number | null,
  longitude: null as number | null,
  // TODO: Doğrulanmış çalışma saatleri
  openingHours: [] as string[],
  // TODO: Yalnızca Sümer Hukuk’a ait doğrulanmış sameAs URL’leri
  socialProfiles: [] as string[],
  organizationId: 'https://sumerhukuk.com/#organization',
  legalServiceId: 'https://sumerhukuk.com/#legalservice',
  googleRating: {
    ratingValue: null as number | null,
    reviewCount: null as number | null,
    lastVerified: '',
  },
} as const;

/**
 * İkincil kişi varlığı: Av. Ceren Sümer Cilli
 * Telefon/e-posta/Maps boş bırakılmıştır — Sümer Hukuk numarası buraya kopyalanmaz.
 */
export const attorney = {
  name: 'Av. Ceren Sümer Cilli',
  personalWebsite: 'https://cerensumer.av.tr/',
  profilePage: '/avukat-ceren-sumer-cilli/',
  personId: 'https://cerensumer.av.tr/#person',
  // TODO: Avukat Ceren Sümer Cilli Google Maps URL’sini ekleyin (lawFirm ile karıştırmayın)
  googleMapsUrl: '',
  // TODO: Avukat Ceren Sümer Cilli Google yorum URL’sini ekleyin
  googleReviewUrl: '',
  // Boş: Sümer Hukuk telefonunu buraya otomatik doldurmayın
  telephoneDisplay: '',
  telephoneInternational: '',
  telephoneHref: '',
  email: '',
  profileImage: '',
  barAssociationProfile: '',
  // TODO: Yalnızca avukata ait doğrulanmış sameAs URL’leri (kişisel GBP, LinkedIn, baro vb.)
  socialProfiles: [] as string[],
  googleRating: {
    ratingValue: null as number | null,
    reviewCount: null as number | null,
    lastVerified: '',
  },
  /**
   * worksFor: schema’da Organization ile ilişki.
   * TODO: Kurumsal ilişki farklı biçimde tanımlanmalıysa (ör. of counsel / bağımsız çalışma)
   * bu bayrağı false yapın veya ilişkiyi güncelleyin.
   */
  worksForOrganization: true,
} as const;

/** Geriye dönük uyumluluk: mevcut import’lar bozulmasın */
export const siteConfig = {
  siteName: site.name,
  siteDescription: site.description,
  domain: site.domain,
  mainCorporateSite: lawFirm.corporateWebsite,
  brandName: lawFirm.brandName,
  siteTagline: site.tagline,
  relationshipNote: site.relationshipNote,
  footerNote: site.footerNote,
  businessProfileName: lawFirm.businessProfileName,
  businessType: lawFirm.businessType,
  telephoneDisplay: lawFirm.telephoneDisplay,
  telephoneInternational: lawFirm.telephoneInternational,
  telephoneHref: lawFirm.telephoneHref,
  whatsappUrl: lawFirm.whatsappUrl,
  email: lawFirm.email,
  fullAddress: lawFirm.fullAddress,
  neighborhood: lawFirm.neighborhood,
  building: lawFirm.building,
  floor: lawFirm.floor,
  doorNumber: lawFirm.doorNumber,
  postalCode: lawFirm.postalCode,
  district: lawFirm.district,
  city: lawFirm.city,
  country: lawFirm.country,
  streetAddress: lawFirm.streetAddress,
  googleMapsUrl: lawFirm.googleMapsUrl,
  googleMapsEmbedUrl: lawFirm.googleMapsEmbedUrl,
  googleReviewUrl: lawFirm.googleReviewUrl,
  latitude: lawFirm.latitude ?? '',
  longitude: lawFirm.longitude ?? '',
  openingHours: lawFirm.openingHours,
  socialProfiles: lawFirm.socialProfiles,
  logo: site.logo,
  defaultImage: site.defaultImage,
  googleAnalyticsId: site.googleAnalyticsId,
  searchConsoleVerification: site.searchConsoleVerification,
  formEndpoint: site.formEndpoint,
  organizationId: lawFirm.organizationId,
  legalServiceId: lawFirm.legalServiceId,
  websiteId: site.websiteId,
  authorName: '',
  reviewRating: '',
  reviewCount: '',
  attorneyName: attorney.name,
  attorneyWebsite: attorney.personalWebsite,
  attorneyProfilePage: attorney.profilePage,
  attorneyPersonId: attorney.personId,
  attorneyMapsUrl: attorney.googleMapsUrl,
  attorneyReviewUrl: attorney.googleReviewUrl,
} as const;

export type SiteConfig = typeof siteConfig;

export function absoluteUrl(path = '/'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return new URL(normalized, `${site.domain}/`).toString();
}
