import type { APIRoute } from 'astro';
import { hasDb } from '../../lib/db';
import { adminConfigured, verifyToken } from '../../lib/admin';
import { AUTO_SEND_VALUES, setSetting } from '../../lib/settings';
import { json, readJson } from '../../lib/http';

export const prerender = false;

/** Enregistre un réglage du tableau de bord (cookie admin requis). */
export const POST: APIRoute = async ({ request, cookies }) => {
  if (!adminConfigured() || !verifyToken(cookies.get('admin')?.value)) return json({ error: 'unauthorized' }, 401);
  if (!hasDb()) return json({ error: 'not_configured' }, 503);
  const body = await readJson(request);
  if (body?.key !== 'auto_send' || !(AUTO_SEND_VALUES as string[]).includes(String(body.value))) return json({ error: 'bad_request' }, 400);
  await setSetting('auto_send', String(body.value));
  return json({ ok: true });
};
