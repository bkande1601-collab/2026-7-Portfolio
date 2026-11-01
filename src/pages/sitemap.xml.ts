import type { APIRoute } from 'astro';
import { langs, pages, href } from '../content';
import { posts } from '../content/blog';

export const prerender = true;

/** Plan du site pour Google : chaque page en français et en anglais, avec ses versions alternées. */
export const GET: APIRoute = ({ site }) => {
  const origin = (site?.origin ?? '').replace(/\/$/, '');
  const dates = new Map(posts.map((p) => [`blog/${p.slug}`, p.updated ?? p.date]));
  const urls = pages.flatMap((page) =>
    langs.map((lang) => {
      const alts = langs.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${origin}${href(l, page)}"/>`).join('');
      const last = dates.get(page);
      return `<url><loc>${origin}${href(lang, page)}</loc>${last ? `<lastmod>${last}</lastmod>` : ''}${alts}</url>`;
    }),
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.join('')}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
