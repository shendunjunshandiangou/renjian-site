import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, MODULES } from '../consts';

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts', ({ data }) => !data.draft);

  const staticPaths = ['/', '/all', '/notes', '/about', ...MODULES.map((m) => `/${m.slug}`)];
  const postPaths = posts.map((p) => `/${p.data.module}/${p.id}`);

  const urls = [...staticPaths, ...postPaths]
    .map((p) => `  <url><loc>${SITE.url}${p.replace(/\/$/, '')}/</loc></url>`)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
