/** Envoie une commande avec ses réponses au workflow n8n (agent IA). Silencieux en cas d'échec. */
import { env } from './env';
import type { Order } from './orders';

export const hasAgent = () => Boolean(env('N8N_WEBHOOK_URL') && env('N8N_WEBHOOK_SECRET'));

export async function sendToAgent(order: Order, answers: { id: string; label: string; value: string }[]) {
  if (!hasAgent()) return;
  // un workflow par produit : .../webhook/diagnostic, .../webhook/prompt
  if (order.product !== 'diagnostic' && order.product !== 'prompt') return;
  const url = env('N8N_WEBHOOK_URL').replace(/\/[^/]+\/?$/, `/${order.product}`);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Webhook-Secret': env('N8N_WEBHOOK_SECRET') },
      body: JSON.stringify({
        orderId: order.id,
        product: order.product,
        lang: order.lang,
        email: order.email,
        name: order.name,
        answers,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) console.error('agent: webhook answered', res.status);
  } catch {
    console.error('agent: webhook unreachable');
  }
}
