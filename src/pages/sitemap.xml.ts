import type { APIRoute } from 'astro';
import { SITE_URL, routes } from '../data/site';

const skip = new Set(['thanks']);

export const GET: APIRoute = () => {
  const urls = Object.entries(routes)
    .filter(([k]) => !skip.has(k))
    .flatMap(([, r]) =>
      (['fr', 'en'] as const).map((lang) => `  <url>
    <loc>${SITE_URL}${r[lang]}</loc>
    <xhtml:link rel="alternate" hreflang="fr-CA" href="${SITE_URL}${r.fr}"/>
    <xhtml:link rel="alternate" hreflang="en-CA" href="${SITE_URL}${r.en}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${r.fr}"/>
  </url>`));
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
