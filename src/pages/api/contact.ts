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
  const firstName = clean(body.firstName, 80);
  const lastName = clean(body.lastName, 80);
  const name = `${firstName} ${lastName}`.trim() || clean(body.name, 120);
  const phone = clean(body.phone, 30);
  const source = clean(body.source, 60).replace(/[^a-z0-9/_-]/gi, '');
  const siteUrl = clean(body.siteUrl, 200);
  const company = clean(body.company, 160);
  const need = clean(body.need, 30);
  const budget = clean(body.budget, 20);
  const email = clean(body.email, 254).toLowerCase();
  const subject = clean(body.subject, 160);
  const message = clean(body.message, 5000);
  // le message peut rester vide si la personne a précisé son besoin (formulaire de réservation)
  if (!name || !isEmail(email) || (!message && !need)) return json({ error: 'invalid' }, 400);

  // Sans Resend configuré : mode aperçu, on accepte sans rien envoyer.
  if (!hasResend() || !ownerEmail()) return json({ ok: true, preview: true });

  const { toVisitor, toOwner } = contactMails({ name, email, subject, message, lang, phone, company, need, budget, source, siteUrl });
  const ownerSent = await sendMail(toOwner).catch(() => false);
  if (!ownerSent) {
    console.error('contact: owner mail failed');
    return json({ error: 'send_failed' }, 502);
  }
  await sendMail(toVisitor).catch(() => false);
  return json({ ok: true });
};
