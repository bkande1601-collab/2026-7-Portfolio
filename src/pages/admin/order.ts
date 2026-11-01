import type { APIRoute } from 'astro';
import { db, ensureSchema, hasDb } from '../../lib/db';
import { adminConfigured, verifyToken } from '../../lib/admin';
import { json } from '../../lib/http';

export const prerender = false;

/** Détail d'une commande pour le panneau du tableau de bord : réponses, résultat, note interne (cookie admin requis). */
export const GET: APIRoute = async ({ url, cookies }) => {
  if (!adminConfigured() || !verifyToken(cookies.get('admin')?.value)) return json({ error: 'unauthorized' }, 401);
  if (!hasDb()) return json({ error: 'not_configured' }, 503);
  const id = Number(url.searchParams.get('order_id'));
  if (!Number.isInteger(id)) return json({ error: 'bad_request' }, 400);
  await ensureSchema();
  const r = await db().query(
    `SELECT o.id, o.payment_intent, a.data AS answers, a.result, a.result_note AS note, a.result_warnings AS warnings
       FROM orders o LEFT JOIN answers a ON a.order_id = o.id WHERE o.id = $1`,
    [id],
  );
  if (!r.rows[0]) return json({ error: 'not_found' }, 404);
  return json(r.rows[0]);
};
