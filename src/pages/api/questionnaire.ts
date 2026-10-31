import type { APIRoute } from 'astro';
import { db, ensureSchema, hasDb } from '../../lib/db';
import { hasStripe, isProduct } from '../../lib/stripe';
import { syncOrder, notifyAnswers } from '../../lib/orders';
import { sendToAgent } from '../../lib/agent';
import { questionnaires } from '../../config/questionnaires';
import { clean, json, readJson, toLang } from '../../lib/http';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!hasDb() || !hasStripe()) return json({ error: 'not_configured' }, 503);
  const body = await readJson(request);
  if (!body) return json({ error: 'bad_request' }, 400);

  const sessionId = clean(body.session_id, 200);
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return json({ error: 'bad_request' }, 400);

  const order = await syncOrder(sessionId);
  if (!order) return json({ error: 'unknown_order' }, 404);
  if (order.status === 'pending' || order.status === 'failed' || order.status === 'expired') return json({ error: 'not_paid' }, 402);
  if (!isProduct(order.product)) return json({ error: 'bad_product' }, 400);

  const lang = toLang(order.lang);
  const raw = (body.answers && typeof body.answers === 'object' ? body.answers : {}) as Record<string, unknown>;
  const answers: { id: string; label: string; value: string }[] = [];
  for (const q of questionnaires[order.product]) {
    const value = clean(raw[q.id], 3000);
    if (q.required && !value) return json({ error: 'invalid', field: q.id }, 400);
    if (value) answers.push({ id: q.id, label: q.label.fr, value });
  }

  await ensureSchema();
  await db().query(
    `INSERT INTO answers (order_id, data) VALUES ($1, $2)
     ON CONFLICT (order_id) DO UPDATE SET data = EXCLUDED.data, submitted_at = now()`,
    [order.id, JSON.stringify(answers)],
  );
  await notifyAnswers(order, answers);
  void sendToAgent(order, answers);
  return json({ ok: true, lang });
};
