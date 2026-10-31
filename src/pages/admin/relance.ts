import type { APIRoute } from 'astro';
import { db, ensureSchema, hasDb } from '../../lib/db';
import { adminConfigured, verifyToken } from '../../lib/admin';
import { sendToAgent } from '../../lib/agent';
import type { Order } from '../../lib/orders';
import { json, readJson } from '../../lib/http';

export const prerender = false;

const allowed = (cookie: string | undefined) => adminConfigured() && verifyToken(cookie);

const STATE = `SELECT agent_status AS status, agent_attempts AS attempts, agent_at AS at, agent_done_at AS done_at, agent_mail_to AS mail_to FROM answers WHERE order_id = $1`;

/** État de la livraison d'une commande (consulté toutes les quelques secondes par le tableau de bord). */
export const GET: APIRoute = async ({ url, cookies }) => {
  if (!allowed(cookies.get('admin')?.value)) return json({ error: 'unauthorized' }, 401);
  if (!hasDb()) return json({ error: 'not_configured' }, 503);
  const id = Number(url.searchParams.get('order_id'));
  if (!Number.isInteger(id)) return json({ error: 'bad_request' }, 400);
  await ensureSchema();
  const r = await db().query(STATE, [id]);
  return r.rows[0] ? json(r.rows[0]) : json({ error: 'not_found' }, 404);
};

/** Renvoie les réponses d'une commande à l'agent n8n (cookie admin requis : ce chemin est sous /admin). */
export const POST: APIRoute = async ({ request, cookies }) => {
  if (!allowed(cookies.get('admin')?.value)) return json({ error: 'unauthorized' }, 401);
  if (!hasDb()) return json({ error: 'not_configured' }, 503);
  const body = await readJson(request);
  const id = Number(body?.order_id);
  if (!Number.isInteger(id)) return json({ error: 'bad_request' }, 400);
  await ensureSchema();
  const r = await db().query<Order & { data: { id: string; label: string; value: string }[] }>(
    'SELECT o.*, a.data FROM orders o JOIN answers a ON a.order_id = o.id WHERE o.id = $1',
    [id],
  );
  const row = r.rows[0];
  if (!row) return json({ error: 'not_found' }, 404);
  await sendToAgent(row, row.data, { retry: true });
  const s = await db().query(STATE, [id]);
  return json({ ok: true, ...s.rows[0], sentAt: new Date().toISOString() });
};
