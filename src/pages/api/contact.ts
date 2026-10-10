import type { APIRoute } from 'astro';
import { contactMails, sendMail, ownerEmail } from '../../lib/email';
import { hasResend } from '../../lib/env';
import { clean, isEmail, json, readJson, toLang } from '../../lib/http';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await readJson(request);
  if (!body) return json({ error: 'bad_request' }, 400);
  if (clean(body.website, 200)) return json({ ok: true }); // robot

  const lang = toLang(body.lang);
  const name = clean(body.name, 120);
  const email = clean(body.email, 254).toLowerCase();
  const subject = clean(body.subject, 160);
  const message = clean(body.message, 5000);
  if (!name || !isEmail(email) || !message) return json({ error: 'invalid' }, 400);

  // Sans Resend configuré : mode aperçu, on accepte sans rien envoyer.
  if (!hasResend() || !ownerEmail()) return json({ ok: true, preview: true });

  const { toVisitor, toOwner } = contactMails({ name, email, subject, message, lang });
  const ownerSent = await sendMail(toOwner).catch(() => false);
  if (!ownerSent) {
    console.error('contact: owner mail failed');
    return json({ error: 'send_failed' }, 502);
  }
  await sendMail(toVisitor).catch(() => false);
  return json({ ok: true });
};
