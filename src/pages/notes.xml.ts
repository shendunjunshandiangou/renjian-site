import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../consts';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async () => {
  const notes = (await getCollection('notes', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );

  const items = notes
    .map(
      (n) => `    <item>
      <title>${esc(n.data.specimen)}</title>
      <link>${SITE.url}/notes/</link>
      <guid isPermaLink="false">${esc(n.data.specimen)}</guid>
      <pubDate>${n.data.date.toUTCString()}</pubDate>
      <description>${esc((n.body ?? '').trim())}</description>
    </item>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE.name)} · 随想</title>
    <link>${SITE.url}/notes/</link>
    <description>散落在各处的只言片语，按时间流不断生长。</description>
    <language>zh-cn</language>
    <atom:link href="${SITE.url}/notes.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
