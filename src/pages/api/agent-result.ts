import type { APIRoute } from 'astro';
import { env } from '../../lib/env';
import { ownerEmail } from '../../lib/email';
import { db, ensureSchema, hasDb } from '../../lib/db';
import { alertOwner, setAgentOutcome } from '../../lib/agent';
import { deliverToClient, normalizeResult, sendReview } from '../../lib/diagnostic';
import { getAutoSend } from '../../lib/settings';
import { clean, json, readJson } from '../../lib/http';
import type { Order } from '../../lib/orders';

export const prerender = false;

/**
 * Le workflow n8n « diagnostic » envoie ici le résultat structuré (ok: true) ou la raison de l'échec (ok: false).
 * Le site fabrique le PDF, vous envoie l'e-mail de relecture et note la livraison.
 */
export const POST: APIRoute = async ({ request }) => {
  const secret = env('N8N_WEBHOOK_SECRET');
  if (!secret || request.headers.get('x-webhook-secret') !== secret) return json({ error: 'unauthorized' }, 401);
  if (!hasDb()) return json({ error: 'not_configured' }, 503);
  const body = await readJson(request, 400_000);
  const id = Number(body?.orderId);
  if (!body || !Number.isInteger(id)) return json({ error: 'bad_request' }, 400);

  await ensureSchema();
  const r = await db().query<Order & { data: { id: string; label: string; value: string }[] }>(
    'SELECT o.*, a.data FROM orders o JOIN answers a ON a.order_id = o.id WHERE o.id = $1',
    [id],
  );
  const order = r.rows[0];
  if (!order) return json({ error: 'not_found' }, 404);

  if (body.ok !== true) {
    const reason = clean(body.reason, 400) || 'échec inconnu';
    await setAgentOutcome(id, false);
    await alertOwner(order, order.data, reason);
    return json({ ok: true });
  }

  const result = normalizeResult(body.result);
  if (!result.resume || result.pistes.length === 0) {
    await setAgentOutcome(id, false);
    await alertOwner(order, order.data, 'Résultat incomplet reçu de l’agent');
    return json({ error: 'incomplete' }, 422);
  }
  const warnings = (Array.isArray(body.warnings) ? body.warnings : []).map((w) => clean(w, 200)).filter(Boolean).slice(0, 8);
  const note = clean(body.note, 2500);
  await db().query('UPDATE answers SET result = $2, result_note = $3, result_warnings = $4 WHERE order_id = $1', [id, JSON.stringify(result), note, JSON.stringify(warnings)]);
  try {
    const mailId = await sendReview(order, result, note, warnings);
    if (!mailId) throw new Error('mail');
    await setAgentOutcome(id, true, { to: ownerEmail(), id: mailId });
    if (!warnings.length && (await getAutoSend()) === 'now') await deliverToClient(order, result, false);
  } catch (e) {
    console.error('agent-result: envoi impossible', (e as Error).message);
    await setAgentOutcome(id, false);
    return json({ error: 'mail_failed' }, 502);
  }
  return json({ ok: true });
};
