/** Envoie une commande avec ses réponses au workflow n8n (agent IA), avec relances et alerte en cas d'échec. */
import { env } from './env';
import { db } from './db';
import { esc, ownerEmail, para, row, sendMail, shell, table } from './email';
import type { Order } from './orders';
import { commonBrief, outputSchema, promptTypes } from '../config/masterPrompts';

type Answer = { id: string; label: string; value: string };

export const hasAgent = () => Boolean(env('N8N_WEBHOOK_URL') && env('N8N_WEBHOOK_SECRET'));

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Master prompt : cadre d'expert des 2 types choisis, à suivre par l'agent qui rédige (rien n'est affiché au client). */
function promptSpecs(order: Order, answers: Answer[]) {
  if (order.product !== 'prompt') return {};
  const ids = (answers.find((a) => a.id === 'types')?.value ?? '').split(',').map((x) => x.trim());
  const masterPrompts = promptTypes.filter((t) => ids.includes(t.id)).map((t) => ({ id: t.id, name: t.name.fr, brief: t.brief }));
  return { masterPrompts, commonBrief, outputSchema };
}

async function post(order: Order, answers: Answer[], retry: boolean): Promise<string | null> {
  // un workflow par produit : .../webhook/diagnostic, .../webhook/prompt
  const url = env('N8N_WEBHOOK_URL').replace(/\/[^/]+\/?$/, `/${order.product}`);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Webhook-Secret': env('N8N_WEBHOOK_SECRET') },
      body: JSON.stringify({ orderId: order.id, product: order.product, lang: order.lang, email: order.email, name: order.name, answers, retry, owner: ownerEmail(), ...promptSpecs(order, answers) }),
      signal: AbortSignal.timeout(15_000),
    });
    return res.ok ? null : `http_${res.status}`;
  } catch {
    return 'unreachable';
  }
}

async function setStatus(orderId: number, status: string) {
  await db().query('UPDATE answers SET agent_status = $2, agent_at = now(), agent_attempts = agent_attempts + 1 WHERE order_id = $1', [orderId, status]).catch(() => {});
}

/** Confirmation de n8n une fois l'e-mail du résultat parti ('done'), ou échec côté workflow. */
export async function setAgentOutcome(orderId: number, ok: boolean, mail?: { to?: string; id?: string }) {
  await db().query(
    `UPDATE answers SET agent_status = $2, agent_at = now(),
       agent_done_at = CASE WHEN $2 = 'done' THEN now() ELSE agent_done_at END,
       agent_mail_to = coalesce($3, agent_mail_to), agent_mail_id = coalesce($4, agent_mail_id)
     WHERE order_id = $1`,
    [orderId, ok ? 'done' : 'failed:workflow', mail?.to?.slice(0, 254) || null, mail?.id?.slice(0, 100) || null],
  );
}

/** 3 essais espacés ; l'état est enregistré (visible dans /admin) et vous êtes alertée si l'agent reste injoignable. */
export async function sendToAgent(order: Order, answers: Answer[], opts: { retry?: boolean; silent?: boolean } = {}) {
  if (order.product !== 'diagnostic' && order.product !== 'prompt') return;
  let failure: string | null = hasAgent() ? 'pending' : 'not_configured';
  for (let attempt = 0; hasAgent() && attempt < 3; attempt++) {
    if (attempt) await wait(attempt * 5_000);
    failure = await post(order, answers, Boolean(opts.retry));
    if (!failure) break;
    console.error(`agent: attempt ${attempt + 1} failed (${failure})`);
  }
  if (!failure) return void (await setStatus(order.id, 'sent')); // accepté ; 'done' viendra de la confirmation de n8n
  await setStatus(order.id, `failed:${failure}`);
  if (opts.silent) return; // le suivi automatique prévient aux seuils 4 h, 6 h et 12 h
  await alertOwner(order, answers, failure);
}

/** E-mail d'alerte à Binta, avec les réponses du client pour traiter à la main. */
export async function alertOwner(order: Order, answers: Answer[], failure: string) {
  await sendMail({
    to: ownerEmail(),
    subject: `⚠ Agent IA injoignable : préparez le résultat à la main (${order.email ?? ''})`,
    html: shell({
      preheader: 'Le résultat automatique n’a pas pu être généré.',
      title: 'Agent IA injoignable',
      body:
        para(`Le client a payé et rempli le questionnaire, mais l’agent n8n n’a pas répondu (${esc(failure)}). Préparez son résultat à la main.`) +
        table(row('Client', esc(`${order.name ?? ''} ${order.email ?? ''}`.trim())) + answers.map((a) => row(a.label, esc(a.value).replace(/\n/g, '<br>'))).join('')),
      footer: 'Alerte automatique.',
    }),
    replyTo: order.email ?? undefined,
  }).catch(() => false);
}
