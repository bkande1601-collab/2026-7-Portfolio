import type { APIRoute } from 'astro';
import { db, hasDb } from '../../lib/db';
import { hasStripe } from '../../lib/stripe';
import { hasAgent } from '../../lib/agent';
import { env, hasResend } from '../../lib/env';
import { json } from '../../lib/http';

export const prerender = false;

/** État de la configuration : jamais de valeur secrète, seulement présent/absent et un code d'erreur technique. */
export const GET: APIRoute = async () => {
  const out: Record<string, unknown> = {
    stripe: hasStripe(),
    webhookSecret: Boolean(env('STRIPE_WEBHOOK_SECRET')),
    resend: hasResend(),
    agent: hasAgent(),
    db: 'absent',
    dbCa: ((v) => (v ? (v.includes('BEGIN CERTIFICATE') ? 'pem' : 'base64') : 'absent'))(env('DATABASE_CA')),
    dbCaBlocks: (env('DATABASE_CA')?.match(/BEGIN CERTIFICATE/g) ?? []).length,
    dbSslmode: (() => { try { return new URL(env('DATABASE_URL') ?? '').searchParams.get('sslmode') ?? 'none'; } catch { return 'invalid'; } })(),
  };
  if (hasDb()) {
    try {
      await db().query('SELECT 1');
      out.db = 'ok';
    } catch (e) {
      out.db = 'error';
      out.dbCode = (e as { code?: string }).code ?? (e as Error).name;
    }
  }
  return json(out);
};
