import type { APIRoute } from 'astro';
import resources from '../../content/resources.json';
import { resourceMails, sendMail, ownerEmail } from '../../lib/email';
import { env, hasResend } from '../../lib/env';
import { clean, isEmail, json, readJson, toLang } from '../../lib/http';

export const prerender = false;

/** POST { email, resource, lang, website } : envoie le PDF par e-mail. */
export const POST: APIRoute = async ({ request }) => {
  const body = await readJson(request);
  if (!body) return json({ error: 'bad_request' }, 400);
  if (clean(body.website, 200)) return json({ ok: true }); // robot

  const lang = toLang(body.lang);
  const email = clean(body.email, 254).toLowerCase();
  const slug = clean(body.resource, 80);
  const source = clean(body.source, 80).replace(/[^a-z0-9/_-]/gi, '');
  const res = resources.find((r) => r.slug === slug);
  if (!isEmail(email) || !res) return json({ error: 'invalid' }, 400);

  const origin = env('SITE_URL').replace(/\/$/, '') || new URL(request.url).origin;
  const path = `/ressources/${slug}-${lang}.pdf`;
  const title = res[lang].title;

  // Sans Resend : mode aperçu, aucun e-mail, on donne le lien direct pour tester.
  if (!hasResend() || !ownerEmail()) return json({ ok: true, preview: true, url: path });

  const { toVisitor, toOwner } = resourceMails({ email, lang, title, url: `${origin}${path}`, slug, source });
  const sent = await sendMail(toVisitor).catch(() => false);
  if (!sent) {
    console.error('resource: visitor mail failed');
    return json({ error: 'send_failed' }, 502);
  }
  await sendMail(toOwner).catch(() => false); // l'alerte pour vous ne doit pas bloquer
  return json({ ok: true });
};
