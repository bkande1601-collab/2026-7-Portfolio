import type { APIRoute } from 'astro';
import type Stripe from 'stripe';
import { stripe, hasStripe } from '../../lib/stripe';
import { db, ensureSchema, hasDb } from '../../lib/db';
import { markPaid, markStatus, markRefund, markDispute, notifyDispute } from '../../lib/orders';
import { env } from '../../lib/env';
import { json } from '../../lib/http';

export const prerender = false;

const piOf = (v: string | { id: string } | null | undefined) => (typeof v === 'string' ? v : (v?.id ?? null));

async function handle(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed': {
      const s = event.data.object;
      if (s.payment_status === 'paid') await markPaid(s);
      return;
    }
    case 'checkout.session.async_payment_succeeded':
      await markPaid(event.data.object);
      return;
    case 'checkout.session.async_payment_failed':
      await markStatus(event.data.object.id, 'failed');
      return;
    case 'checkout.session.expired':
      await markStatus(event.data.object.id, 'expired');
      return;
    case 'charge.refunded': {
      const c = event.data.object;
      const pi = piOf(c.payment_intent);
      if (pi) await markRefund(pi, c.amount_refunded);
      return;
    }
    case 'charge.dispute.created': {
      const pi = piOf(event.data.object.payment_intent);
      if (pi) await notifyDispute(await markDispute(pi, 'open'), 'ouvert');
      return;
    }
    case 'charge.dispute.closed': {
      const d = event.data.object;
      const pi = piOf(d.payment_intent);
      if (pi) await notifyDispute(await markDispute(pi, d.status === 'won' ? 'won' : 'lost'), d.status === 'won' ? 'gagné' : 'perdu');
      return;
    }
    default:
      // payment_intent.*, invoice.*, customer.subscription.* : conservés dans stripe_events
      return;
  }
}

export const POST: APIRoute = async ({ request }) => {
  const secret = env('STRIPE_WEBHOOK_SECRET');
  if (!hasStripe() || !secret || !hasDb()) return json({ error: 'not_configured' }, 503);

  const signature = request.headers.get('stripe-signature');
  if (!signature) return json({ error: 'no_signature' }, 400);
  const raw = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(raw, signature, secret);
  } catch {
    return json({ error: 'bad_signature' }, 400);
  }

  try {
    await ensureSchema();
    const seen = await db().query('SELECT 1 FROM stripe_events WHERE id = $1', [event.id]);
    if (seen.rowCount) return json({ ok: true, duplicate: true });
    await handle(event);
    const obj = event.data.object as { id?: string };
    await db().query(
      'INSERT INTO stripe_events (id, type, object_id, payload) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING',
      [event.id, event.type, obj.id ?? null, JSON.stringify(event.data.object)],
    );
    return json({ ok: true });
  } catch {
    console.error('stripe-webhook: handler failed', event.type);
    return json({ error: 'handler_failed' }, 500);
  }
};
