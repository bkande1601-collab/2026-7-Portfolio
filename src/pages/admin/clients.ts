import type { APIRoute } from 'astro';
import { db, ensureSchema, hasDb } from '../../lib/db';
import { adminConfigured, verifyToken } from '../../lib/admin';
import { json } from '../../lib/http';

export const prerender = false;

const pick = (id: string, max = 0) =>
  `(SELECT ${max ? `left(x->>'value', ${max})` : `x->>'value'`} FROM jsonb_array_elements(a.data) x WHERE x->>'id' = '${id}' LIMIT 1)`;

/** Base clients : une ligne par commande payée, avec les coordonnées et les liens donnés dans le questionnaire. */
export const GET: APIRoute = async ({ cookies }) => {
  if (!adminConfigured() || !verifyToken(cookies.get('admin')?.value)) return json({ error: 'unauthorized' }, 401);
  if (!hasDb()) return json({ error: 'not_configured' }, 503);
  await ensureSchema();
  const r = await db().query(
    `SELECT o.id, o.email, o.name, o.phone, o.country, o.lang, o.product, o.paid_at,
            ${pick('website')} AS website, ${pick('linkedin')} AS linkedin, ${pick('socials')} AS socials,
            ${pick('activity', 400)} AS activity, ${pick('problem', 400)} AS problem, ${pick('revenue', 120)} AS revenue
       FROM orders o LEFT JOIN answers a ON a.order_id = o.id
      WHERE o.paid_at IS NOT NULL ORDER BY o.paid_at DESC LIMIT 3000`,
  );
  return json({ rows: r.rows });
};
