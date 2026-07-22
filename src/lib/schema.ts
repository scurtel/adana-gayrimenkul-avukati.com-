import { site, lawFirm, attorney, absoluteUrl } from '../config/site';

export function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': lawFirm.organizationId,
    name: lawFirm.brandName,
    url: lawFirm.corporateWebsite,
    telephone: lawFirm.telephoneInternational,
    address: {
      '@type': 'PostalAddress',
      streetAddress: lawFirm.streetAddress,
      postalCode: lawFirm.postalCode,
      addressLocality: lawFirm.district,
      addressRegion: lawFirm.city,
      addressCountry: lawFirm.country,
    },
    ...(lawFirm.socialProfiles.length ? { sameAs: [...lawFirm.socialProfiles] } : {}),
  };
}

export function legalServiceSchema() {
  return {
    '@type': 'LegalService',
    '@id': lawFirm.legalServiceId,
    name: lawFirm.brandName,
    url: lawFirm.corporateWebsite,
    telephone: lawFirm.telephoneInternational,
    parentOrganization: { '@id': lawFirm.organizationId },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Adana',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: lawFirm.streetAddress,
      postalCode: lawFirm.postalCode,
      addressLocality: lawFirm.district,
      addressRegion: lawFirm.city,
      addressCountry: lawFirm.country,
    },
  };
}

export function personSchema() {
  const sameAs = [
    attorney.personalWebsite,
    ...attorney.socialProfiles,
    ...(attorney.googleMapsUrl ? [attorney.googleMapsUrl] : []),
    ...(attorney.barAssociationProfile ? [attorney.barAssociationProfile] : []),
  ].filter(Boolean);

  return {
    '@type': 'Person',
    '@id': attorney.personId,
    name: attorney.name,
    url: attorney.personalWebsite,
    ...(attorney.worksForOrganization
      ? { worksFor: { '@id': lawFirm.organizationId } }
      : {}),
    ...(attorney.telephoneInternational
      ? { telephone: attorney.telephoneInternational }
      : {}),
    ...(attorney.email ? { email: attorney.email } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': site.websiteId,
    url: `${site.domain}/`,
    name: site.name,
    description: site.description,
    inLanguage: 'tr-TR',
    publisher: { '@id': lawFirm.organizationId },
    about: { '@id': lawFirm.legalServiceId },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function webPageSchema(opts: {
  path: string;
  name: string;
  description: string;
}) {
  return {
    '@type': 'WebPage',
    '@id': `${absoluteUrl(opts.path)}#webpage`,
    url: absoluteUrl(opts.path),
    name: opts.name,
    description: opts.description,
    isPartOf: { '@id': site.websiteId },
    about: { '@id': lawFirm.legalServiceId },
    inLanguage: 'tr-TR',
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer.replace(/<[^>]+>/g, ''),
      },
    })),
  };
}

export type ArticleAttribution = {
  author?: string;
  authorUrl?: string;
  reviewedBy?: string;
  reviewerUrl?: string;
};

/**
 * Person author yalnızca author alanı avukat adı ile doldurulmuşsa eklenir.
 * İncelenmemiş/Gemini içeriklerde Organization yayıncı yazar olarak kalır.
 */
export function blogPostingSchema(opts: {
  path: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  attribution?: ArticleAttribution;
}) {
  const attr = opts.attribution || {};
  const isAttorneyAuthor =
    Boolean(attr.author) &&
    attr.author === attorney.name;

  const isReviewed =
    Boolean(attr.reviewedBy) &&
    attr.reviewedBy === attorney.name;

  const authorNode = isAttorneyAuthor
    ? { '@id': attorney.personId }
    : { '@id': lawFirm.organizationId };

  const node: Record<string, unknown> = {
    '@type': 'BlogPosting',
    '@id': `${absoluteUrl(opts.path)}#article`,
    headline: opts.title,
    description: opts.description,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    mainEntityOfPage: absoluteUrl(opts.path),
    isPartOf: { '@id': site.websiteId },
    inLanguage: 'tr-TR',
    author: authorNode,
    publisher: {
      '@type': 'Organization',
      '@id': lawFirm.organizationId,
      name: lawFirm.brandName,
      url: lawFirm.corporateWebsite,
    },
  };

  if (isReviewed) {
    node.reviewedBy = { '@id': attorney.personId };
  }

  return node;
}

export function graph(nodes: Record<string, unknown>[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}
