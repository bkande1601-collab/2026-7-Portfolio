import type { APIRoute } from 'astro';
import { env } from '../../lib/env';
import { runWatchdog } from '../../lib/watchdog';
import { json } from '../../lib/http';

export const prerender = false;

/** Appelé toutes les 10 min par n8n (même secret que le webhook de l'agent). */
export const POST: APIRoute = async ({ request }) => {
  const secret = env('N8N_WEBHOOK_SECRET');
  if (!secret || request.headers.get('x-webhook-secret') !== secret) return json({ error: 'unauthorized' }, 401);
  return json({ ok: true, ...(await runWatchdog()) });
};
