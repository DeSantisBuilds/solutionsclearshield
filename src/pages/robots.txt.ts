import type { APIRoute } from 'astro';
import { SITE_LIVE, SITE_URL } from '../data/site';

// Until launch, ask every crawler to stay away. At launch (SITE_LIVE = true) the site opens up.
export const GET: APIRoute = () => {
  const body = SITE_LIVE
    ? `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
    : `User-agent: *\nDisallow: /\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
