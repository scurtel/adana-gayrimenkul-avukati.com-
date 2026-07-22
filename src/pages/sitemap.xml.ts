import { getCollection } from 'astro:content';
import { siteConfig } from '../config/site';
import { topicPages } from '../data/navigation';

/** @type {import('astro').APIRoute} */
export const GET = async () => {
  const articles = await getCollection('articles', ({ data }) => !data.draft);

  const staticPaths = [
    '/',
    '/sumer-hukuk/',
    '/avukat-ceren-sumer-cilli/',
    '/makaleler/',
    '/iletisim/',
    '/gizlilik-politikasi/',
    '/aydinlatma-metni/',
    '/kullanim-kosullari/',
  ];

  const urls = [
    ...staticPaths,
    ...topicPages.map((t) => `/${t.slug}/`),
    ...articles.map((a) => `/makaleler/${a.data.slug}/`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((path) => {
    const priority = path === '/' ? '1.0' : path.includes('/makaleler/') ? '0.7' : '0.8';
    return `  <url>
    <loc>${siteConfig.domain}${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
