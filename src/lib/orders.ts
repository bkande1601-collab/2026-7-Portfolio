/** Commandes : enregistrement en base, e-mails, synchronisation avec Stripe. */
import type Stripe from 'stripe';
import { db, ensureSchema } from './db';
import { stripe, siteOrigin, isProduct, type ProductKey } from './stripe';
import { sendMail, ownerEmail, shell, button, para, table, row, esc, type Mail } from './email';
import { site } from '../config/site';
import { t, type Lang } from '../content';

export type Order = {
  id: number;
  session_id: string;
  payment_intent: string | null;
  product: string;
  lang: string;
  email: string | null;
  name: string | null;
  amount: number;
  currency: string;
  status: string;
  refunded: number;
  created_at: Date;
  paid_at: Date | null;
};

export const money = (cents: number, currency: string, lang: string = 'fr') =>
  new Intl.NumberFormat(lang === 'en' ? 'en-GB' : 'fr-FR', { style: 'currency', currency: currency.toUpperCase() }).format(cents / 100);

export const productName = (product: string, lang: Lang) =>
  t(lang).products.items.find((i) => i.key === product)?.name ?? product;

const toLang = (v: unknown): Lang => (v === 'en' ? 'en' : 'fr');

export const merciUrl = (lang: string, sessionId: string) =>
  `${siteOrigin()}/${lang}/merci?session_id=${encodeURIComponent(sessionId)}`;

export async function createPending(sessionId: string, product: ProductKey, lang: Lang) {
  await ensureSchema();
  await db().query(
    `INSERT INTO orders (session_id, product, lang) VALUES ($1, $2, $3) ON CONFLICT (session_id) DO NOTHING`,
    [sessionId, product, lang],
  );
}

export async function getOrder(sessionId: string): Promise<Order | null> {
  await ensureSchema();
  const r = await db().query<Order>('SELECT * FROM orders WHERE session_id = $1', [sessionId]);
  return r.rows[0] ?? null;
}

/** Enregistre un paiement réussi. Les e-mails ne partent que la première fois. */
export async function markPaid(session: Stripe.Checkout.Session): Promise<Order> {
  await ensureSchema();
  const prev = await getOrder(session.id);
  const wasPaid = prev?.status === 'paid' || prev?.status === 'refunded' || prev?.status === 'disputed';
  const meta = session.metadata ?? {};
  const product = isProduct(meta.product) ? meta.product : (prev?.product ?? 'other');
  const lang = toLang(meta.lang ?? prev?.lang);
  const pi = typeof session.payment_intent === 'string' ? session.payment_intent : (session.payment_intent?.id ?? null);

  const r = await db().query<Order>(
    `INSERT INTO orders (session_id, payment_intent, product, lang, email, name, amount, currency, status, paid_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'paid', now())
     ON CONFLICT (session_id) DO UPDATE SET
       payment_intent = COALESCE(EXCLUDED.payment_intent, orders.payment_intent),
       email = COALESCE(EXCLUDED.email, orders.email),
       name = COALESCE(EXCLUDED.name, orders.name),
       amount = EXCLUDED.amount,
       currency = EXCLUDED.currency,
       status = CASE WHEN orders.status IN ('refunded', 'disputed') THEN orders.status ELSE 'paid' END,
       paid_at = COALESCE(orders.paid_at, now())
     RETURNING *`,
    [
      session.id,
      pi,
      product,
      lang,
      session.customer_details?.email ?? session.customer_email ?? null,
      session.customer_details?.name ?? null,
      session.amount_total ?? 0,
      session.currency ?? 'eur',
    ],
  );
  const order = r.rows[0];
  if (!wasPaid) {
    await sendMail(clientPaidMail(order)).catch(() => false);
    await sendMail(ownerPaidMail(order)).catch(() => false);
  }
  return order;
}

export async function markStatus(sessionId: string, status: 'failed' | 'expired') {
  await ensureSchema();
  await db().query(`UPDATE orders SET status = $2 WHERE session_id = $1 AND status IN ('pending', 'failed')`, [sessionId, status]);
}

export async function markRefund(paymentIntent: string, refundedCents: number) {
  await ensureSchema();
  await db().query(
    `UPDATE orders SET refunded = $2,
       status = CASE WHEN $2 >= amount AND amount > 0 THEN 'refunded' ELSE status END
     WHERE payment_intent = $1`,
    [paymentIntent, refundedCents],
  );
}

export async function markDispute(paymentIntent: string, state: 'open' | 'won' | 'lost'): Promise<Order | null> {
  await ensureSchema();
  const status = state === 'open' ? 'disputed' : state === 'won' ? 'paid' : 'refunded';
  const r = await db().query<Order>(`UPDATE orders SET status = $2 WHERE payment_intent = $1 RETURNING *`, [paymentIntent, status]);
  return r.rows[0] ?? null;
}

/** Retrouve une commande ; si le webhook n'est pas encore arrivé, interroge Stripe directement. */
export async function syncOrder(sessionId: string): Promise<Order | null> {
  const known = await getOrder(sessionId);
  if (known && known.status !== 'pending' && known.status !== 'failed') return known;
  try {
    const session = await stripe().checkout.sessions.retrieve(sessionId);
    if (session.payment_status === 'paid') return await markPaid(session);
  } catch {
    // session inconnue ou Stripe injoignable : on renvoie ce qu'on a
  }
  return known;
}

/* ---------- e-mails ---------- */
export function clientPaidMail(o: Order): Mail {
  const lang = toLang(o.lang);
  const fr = lang === 'fr';
  const name = productName(o.product, lang);
  return {
    to: o.email ?? '',
    subject: fr ? `Paiement reçu : ${name}` : `Payment received: ${name}`,
    html: shell({
      preheader: fr ? 'Il reste une étape : répondre au questionnaire.' : 'One step left: answer the questionnaire.',
      title: fr ? 'Merci, paiement bien reçu.' : 'Thank you, payment received.',
      body:
        para(fr ? `Vous avez commandé : <strong>${esc(name)}</strong> (${esc(money(o.amount, o.currency, lang))}).` : `You ordered: <strong>${esc(name)}</strong> (${esc(money(o.amount, o.currency, lang))}).`) +
        para(
          fr
            ? 'Il reste une étape : répondre à quelques questions, pour que votre résultat parte de votre situation. Vous le recevrez ensuite par e-mail.'
            : 'One step left: answer a few questions so your result starts from your situation. You will then receive it by email.',
        ) +
        button(merciUrl(o.lang, o.session_id), fr ? 'Répondre au questionnaire' : 'Answer the questionnaire') +
        para(fr ? 'Une question ? Répondez simplement à cet e-mail.' : 'A question? Just reply to this email.') +
        `<p style="margin:24px 0 0;">${fr ? 'À très vite,' : 'Talk soon,'}<br><strong>${esc(site.name)}</strong></p>`,
      footer: fr ? 'Reçu de paiement envoyé séparément par Stripe.' : 'Payment receipt sent separately by Stripe.',
    }),
    replyTo: ownerEmail() || undefined,
  };
}

function ownerPaidMail(o: Order): Mail {
  return {
    to: ownerEmail(),
    subject: `Nouvelle commande : ${productName(o.product, 'fr')} (${money(o.amount, o.currency)})`,
    html: shell({
      preheader: `${o.email ?? ''} a payé.`,
      title: 'Nouvelle commande',
      body: table(
        row('Produit', esc(productName(o.product, 'fr'))) +
          row('Montant', esc(money(o.amount, o.currency))) +
          row('Client', esc(o.name ?? '')) +
          row('E-mail', o.email ? `<a href="mailto:${esc(o.email)}">${esc(o.email)}</a>` : '') +
          row('Langue', o.lang.toUpperCase()),
      ) + para('Le client va maintenant remplir le questionnaire : vous recevrez ses réponses par e-mail.'),
      footer: 'Alerte automatique.',
    }),
    replyTo: o.email ?? undefined,
  };
}

export async function notifyDispute(o: Order | null, state: string) {
  if (!o) return;
  await sendMail({
    to: ownerEmail(),
    subject: `Litige Stripe (${state}) : ${o.email ?? o.session_id}`,
    html: shell({
      preheader: 'Un client conteste un paiement.',
      title: 'Litige sur un paiement',
      body: table(row('Produit', esc(productName(o.product, 'fr'))) + row('Montant', esc(money(o.amount, o.currency))) + row('Client', esc(o.email ?? '')) + row('État', esc(state))) +
        para('Répondez depuis votre tableau de bord Stripe (Paiements, puis Litiges) avant la date limite.'),
      footer: 'Alerte automatique.',
    }),
  }).catch(() => false);
}

export async function notifyAnswers(o: Order, answers: { label: string; value: string }[]) {
  const lang = toLang(o.lang);
  const fr = lang === 'fr';
  const rows = answers.map((a) => row(a.label, esc(a.value).replace(/\n/g, '<br>'))).join('');
  await sendMail({
    to: ownerEmail(),
    subject: `Réponses reçues : ${productName(o.product, 'fr')} (${o.email ?? ''})`,
    html: shell({
      preheader: `${o.email ?? ''} a rempli le questionnaire.`,
      title: 'Questionnaire rempli',
      body: table(row('Produit', esc(productName(o.product, 'fr'))) + row('Client', esc(`${o.name ?? ''} ${o.email ?? ''}`.trim()))) + table(rows) +
        para('Vous pouvez maintenant préparer le résultat et l’envoyer au client.'),
      footer: 'Alerte automatique.',
    }),
    replyTo: o.email ?? undefined,
  }).catch(() => false);
  if (o.email) {
    await sendMail({
      to: o.email,
      subject: fr ? 'Vos réponses sont bien reçues' : 'Your answers have been received',
      html: shell({
        preheader: fr ? 'Je prépare votre résultat.' : 'I am preparing your result.',
        title: fr ? 'C’est reçu, merci.' : 'Received, thank you.',
        body:
          para(fr ? 'Je lis vos réponses et je prépare votre résultat. Vous le recevrez par e-mail à cette adresse.' : 'I am reading your answers and preparing your result. You will receive it by email at this address.') +
          `<p style="margin:24px 0 0;">${fr ? 'À très vite,' : 'Talk soon,'}<br><strong>${esc(site.name)}</strong></p>`,
        footer: fr ? 'Confirmation automatique.' : 'Automatic confirmation.',
      }),
      replyTo: ownerEmail() || undefined,
    }).catch(() => false);
  }
}
