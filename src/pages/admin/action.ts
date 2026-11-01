import type { APIRoute } from 'astro';
import { db, ensureSchema, hasDb } from '../../lib/db';
import { adminConfigured, verifyToken } from '../../lib/admin';
import { ownerEmail } from '../../lib/email';
import { loadResult, sendQuestionnaireLink, sendToClient } from '../../lib/diagnostic';
import type { Order } from '../../lib/orders';
import { json, readJson } from '../../lib/http';

export const prerender = false;

/** Actions du tableau de bord sur une commande : PDF ou lien du questionnaire, au client ou à Binta (test). */
export const POST: APIRoute = async ({ request, cookies }) => {
  if (!adminConfigured() || !verifyToken(cookies.get('admin')?.value)) return json({ error: 'unauthorized' }, 401);
  if (!hasDb()) return json({ error: 'not_configured' }, 503);
  const body = await readJson(request);
  const id = Number(body?.order_id);
  const action = String(body?.action ?? '');
  if (!Number.isInteger(id) || !['pdf_client', 'pdf_me', 'questionnaire_client', 'questionnaire_me'].includes(action)) return json({ error: 'bad_request' }, 400);
  await ensureSchema();
  const o = (await db().query<Order>('SELECT * FROM orders WHERE id = $1', [id])).rows[0];
  if (!o) return json({ error: 'not_found' }, 404);
  const me = ownerEmail();
  const toClient = action.endsWith('_client');
  const to = toClient ? o.email : me;
  if (!to) return json({ error: toClient ? 'no_client_email' : 'no_owner_email' }, 422);

  let ok = false;
  if (action.startsWith('pdf_')) {
    const { result } = await loadResult(id);
    if (!result) return json({ error: 'no_result' }, 409);
    ok = await sendToClient(o, result, to, !toClient);
    if (ok && toClient) await db().query('UPDATE answers SET client_sent_at = now(), client_sent_to = $2 WHERE order_id = $1', [id, to]);
  } else {
    ok = await sendQuestionnaireLink(o, to, !toClient);
  }
  return ok ? json({ ok: true, to, at: new Date().toISOString() }) : json({ error: 'mail_failed' }, 502);
};
