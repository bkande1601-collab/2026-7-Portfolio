import type { APIRoute } from 'astro';
import { db, ensureSchema, hasDb } from '../../lib/db';
import { adminConfigured, verifyToken } from '../../lib/admin';
import { loadResult, pdfFor } from '../../lib/diagnostic';
import type { Order } from '../../lib/orders';
import { json } from '../../lib/http';

export const prerender = false;

/** Télécharge le PDF d'une commande (cookie admin requis). */
export const GET: APIRoute = async ({ url, cookies }) => {
  if (!adminConfigured() || !verifyToken(cookies.get('admin')?.value)) return json({ error: 'unauthorized' }, 401);
  if (!hasDb()) return json({ error: 'not_configured' }, 503);
  const id = Number(url.searchParams.get('order_id'));
  if (!Number.isInteger(id)) return json({ error: 'bad_request' }, 400);
  await ensureSchema();
  const o = await db().query<Order>('SELECT * FROM orders WHERE id = $1', [id]);
  const { result } = await loadResult(id);
  if (!o.rows[0] || !result) return json({ error: 'no_result' }, 404);
  const pdf = await pdfFor(o.rows[0], result, Number(url.searchParams.get('n')) || 1); // n = 1 ou 2 pour un master prompt
  return new Response(new Uint8Array(pdf.buf), {
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `inline; filename="${pdf.filename}"`, 'Cache-Control': 'no-store' },
  });
};
