import { siteConfig } from '../config/site';

/** @type {import('astro').APIRoute} */
export const GET = () => {
  const body = `User-agent: *
Allow: /

Sitemap: ${siteConfig.domain}/sitemap.xml
`;
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
