import type { APIRoute } from 'astro';
import { db, ensureSchema, hasDb } from '../../lib/db';
import { adminConfigured, verifyToken } from '../../lib/admin';
import { json, readJson } from '../../lib/http';

export const prerender = false;

/** Supprime une commande et ses réponses (cookie admin requis ; `confirm: true` obligatoire). Ne rembourse rien dans Stripe. */
export const POST: APIRoute = async ({ request, cookies }) => {
  if (!adminConfigured() || !verifyToken(cookies.get('admin')?.value)) return json({ error: 'unauthorized' }, 401);
  if (!hasDb()) return json({ error: 'not_configured' }, 503);
  const body = await readJson(request);
  const id = Number(body?.order_id);
  if (!body || !Number.isInteger(id) || body.confirm !== true) return json({ error: 'bad_request' }, 400);
  await ensureSchema();
  const r = await db().query('DELETE FROM orders WHERE id = $1 RETURNING id', [id]);
  return r.rowCount ? json({ ok: true }) : json({ error: 'not_found' }, 404);
};
