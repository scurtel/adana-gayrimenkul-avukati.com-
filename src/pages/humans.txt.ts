import { lawFirm, site } from '../config/site';

/** @type {import('astro').APIRoute} */
export const GET = () => {
  const body = `/* TEAM */
Brand: ${lawFirm.brandName}
Site: ${site.domain}
Corporate: ${lawFirm.corporateWebsite}
Location: ${lawFirm.city}, Türkiye

/* SITE */
Standards: HTML5, CSS3
Generator: Astro
Purpose: Gayrimenkul ve taşınmaz hukuku bilgilendirme
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
