import type { APIRoute } from 'astro';
import { labMails, sendMail, ownerEmail } from '../../lib/email';
import { hasResend } from '../../lib/env';
import { clean, isEmail, json, readJson, toLang } from '../../lib/http';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await readJson(request);
  if (!body) return json({ error: 'bad_request' }, 400);
  if (clean(body.website, 200)) return json({ ok: true }); // robot

  const lang = toLang(body.lang);
  const email = clean(body.email, 254).toLowerCase();
  if (!isEmail(email)) return json({ error: 'invalid' }, 400);

  if (!hasResend() || !ownerEmail()) return json({ ok: true, preview: true });

  const { toVisitor, toOwner } = labMails({ email, lang });
  // L'alerte pour vous est l'essentiel : si elle échoue, on le dit.
  const ok = await sendMail(toOwner).catch(() => false);
  if (!ok) {
    console.error('lab: owner alert failed');
    return json({ error: 'send_failed' }, 502);
  }
  await sendMail(toVisitor).catch(() => false);
  return json({ ok: true });
};
