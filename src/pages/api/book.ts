import type { APIRoute } from 'astro';
import { randomUUID } from 'node:crypto';
import { availableSlots } from '../../lib/slots';
import { createEvent } from '../../lib/google';
import { ownerBookingMail, sendMail, visitorBookingMail, ownerEmail, type BookingData } from '../../lib/email';
import { clean, isEmail, json, readJson, toLang } from '../../lib/http';
import { booking, site } from '../../config/site';
import { t } from '../../content';

export const prerender = false;

const NEEDS = ['automation', 'agent', 'tool', 'marketing', 'cos', 'other'];
const BUDGETS = ['lt1500', '1500-4500', '4500-9000', 'gt9000', 'unknown', ''];

export const POST: APIRoute = async ({ request }) => {
  const body = await readJson(request);
  if (!body) return json({ error: 'bad_request' }, 400);

  // champ piège : un robot le remplit, un humain non
  if (clean(body.website, 200)) return json({ ok: true });

  const lang = toLang(body.lang);
  const name = clean(body.name, 120);
  const email = clean(body.email, 254).toLowerCase();
  const need = clean(body.need, 30);
  const budget = clean(body.budget, 20);
  const slotIso = clean(body.slot, 40);
  const tz = clean(body.tz, 60) || booking.timezone;

  if (!name || !isEmail(email) || !NEEDS.includes(need) || !BUDGETS.includes(budget)) {
    return json({ error: 'invalid' }, 400);
  }
  const startMs = Date.parse(slotIso);
  if (!Number.isFinite(startMs)) return json({ error: 'invalid_slot' }, 400);

  // Le créneau doit faire partie de ce qu'on propose réellement MAINTENANT
  // (horaires, marges, délai minimum, et pas déjà pris).
  let slots: number[];
  let preview: boolean;
  try {
    ({ slots, preview } = await availableSlots());
  } catch (e) {
    console.error('book:availability', e instanceof Error ? e.message : e);
    return json({ error: 'unavailable' }, 502);
  }
  if (!slots.includes(startMs)) return json({ error: 'slot_taken' }, 409);

  // Sans Google Agenda branché : on simule, rien n'est créé.
  if (preview) return json({ ok: true, preview: true });

  const data: BookingData = {
    name,
    email,
    company: clean(body.company, 160),
    need,
    budget,
    message: clean(body.message, 2000),
    lang,
    startMs,
    tz,
    meetLink: '',
  };

  const c = t(lang);
  const needLabel = c.book.needs.find((n) => n.v === need)?.t ?? need;
  const budgetLabel = c.book.budgets.find((n) => n.v === budget)?.t ?? '—';
  const description = [
    `${name} <${email}>`,
    data.company && `Entreprise : ${data.company}`,
    `Besoin : ${needLabel}`,
    `Budget : ${budgetLabel}`,
    `Langue : ${lang.toUpperCase()}`,
    data.message && `\nMessage :\n${data.message}`,
    `\nRéservé depuis ${site.name}`,
  ]
    .filter(Boolean)
    .join('\n');

  let eventLink = '';
  try {
    const ev = await createEvent({
      summary: `Audit — ${name}${data.company ? ` (${data.company})` : ''}`,
      description,
      startMs,
      endMs: startMs + booking.durationMin * 60_000,
      timeZone: booking.timezone,
      attendeeEmail: email,
      requestId: randomUUID(),
    });
    data.meetLink = ev.meetLink;
    eventLink = ev.htmlLink;
  } catch (e) {
    console.error('book:event', e instanceof Error ? e.message : e);
    return json({ error: 'event_failed' }, 502);
  }

  // Les e-mails ne doivent jamais faire échouer une réservation déjà créée.
  const results = await Promise.allSettled([
    sendMail(visitorBookingMail(data)),
    ownerEmail() ? sendMail(ownerBookingMail(data, eventLink)) : Promise.resolve(false),
  ]);
  results.forEach((r, i) => {
    if (r.status === 'rejected' || r.value === false) console.error(`book:mail ${i === 0 ? 'visitor' : 'owner'} not sent`);
  });

  return json({ ok: true });
};
