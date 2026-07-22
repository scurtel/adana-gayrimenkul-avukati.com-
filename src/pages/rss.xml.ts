import { getCollection } from 'astro:content';
import { siteConfig } from '../config/site';

/** @type {import('astro').APIRoute} */
export const GET = async () => {
  const articles = (await getCollection('articles', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.publishedDate.valueOf() - a.data.publishedDate.valueOf(),
  );

  const items = articles
    .map((article) => {
      const link = `${siteConfig.domain}/makaleler/${article.data.slug}/`;
      return `    <item>
      <title><![CDATA[${article.data.title}]]></title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${article.data.publishedDate.toUTCString()}</pubDate>
      <description><![CDATA[${article.data.description}]]></description>
    </item>`;
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${siteConfig.brandName} — Gayrimenkul Hukuku Makaleleri</title>
    <link>${siteConfig.domain}/</link>
    <description>${siteConfig.siteDescription}</description>
    <language>tr</language>
${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
};
