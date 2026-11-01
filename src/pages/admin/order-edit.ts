import type { APIRoute } from 'astro';
import { db, ensureSchema, hasDb } from '../../lib/db';
import { adminConfigured, verifyToken } from '../../lib/admin';
import { isProduct } from '../../lib/stripe';
import { clean, isEmail, json, readJson } from '../../lib/http';

export const prerender = false;

/** Modifie les informations d'une commande (cookie admin requis) : nom, e-mail, téléphone, langue, produit. */
export const POST: APIRoute = async ({ request, cookies }) => {
  if (!adminConfigured() || !verifyToken(cookies.get('admin')?.value)) return json({ error: 'unauthorized' }, 401);
  if (!hasDb()) return json({ error: 'not_configured' }, 503);
  const body = await readJson(request);
  const id = Number(body?.order_id);
  if (!body || !Number.isInteger(id)) return json({ error: 'bad_request' }, 400);
  const email = clean(body.email, 254);
  if (email && !isEmail(email)) return json({ error: 'bad_email' }, 422);
  if (body.product !== undefined && !isProduct(body.product)) return json({ error: 'bad_product' }, 422);
  const lang = body.lang === 'en' ? 'en' : 'fr';
  await ensureSchema();
  const r = await db().query(
    `UPDATE orders SET name = $2, email = $3, phone = $4, lang = $5, product = COALESCE($6, product) WHERE id = $1 RETURNING id, name, email, phone, lang, product`,
    [id, clean(body.name, 120) || null, email || null, clean(body.phone, 40) || null, lang, body.product ?? null],
  );
  return r.rows[0] ? json({ ok: true, order: r.rows[0] }) : json({ error: 'not_found' }, 404);
};
