import type { APIRoute } from 'astro';
import { env } from '../../lib/env';
import { hasDb } from '../../lib/db';
import { setAgentOutcome } from '../../lib/agent';
import { clean, json, readJson } from '../../lib/http';

export const prerender = false;

/** n8n confirme que l'e-mail du résultat est parti (kind: "result") ou que l'agent a échoué (kind: "alert"). */
export const POST: APIRoute = async ({ request }) => {
  const secret = env('N8N_WEBHOOK_SECRET');
  if (!secret || request.headers.get('x-webhook-secret') !== secret) return json({ error: 'unauthorized' }, 401);
  if (!hasDb()) return json({ error: 'not_configured' }, 503);
  const body = await readJson(request);
  const id = Number(body?.orderId);
  if (!Number.isInteger(id)) return json({ error: 'bad_request' }, 400);
  await setAgentOutcome(id, body?.kind === 'result', { to: clean(body?.to, 254), id: clean(body?.mailId, 100) });
  return json({ ok: true });
};
