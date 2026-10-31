/**
 * Suivi des livraisons : relance l'agent tant que le résultat n'est pas parti (confirmation de n8n) et prévient
 * Binta par e-mail si le retard atteint 4 h, 6 h puis 12 h. Appelé toutes les 10 min par n8n (/api/watchdog)
 * et, en secours, par le serveur lui-même.
 */
import { db, ensureSchema, hasDb } from './db';
import { hasAgent, sendToAgent } from './agent';
import { esc, ownerEmail, para, row, sendMail, shell, table } from './email';
import { productName } from './orders';
import type { Order } from './orders';

const ALERT_HOURS = [4, 6, 12];
const MAX_DAYS = 7;
let running = false;
let lastRun = 0;

type Row = Order & { data: { id: string; label: string; value: string }[]; agent_status: string | null; agent_at: Date | null; agent_attempts: number; agent_alerts: number; submitted_at: Date };

export async function runWatchdog(): Promise<{ checked: number; retried: number; alerted: number }> {
  const out = { checked: 0, retried: 0, alerted: 0 };
  if (running || !hasDb() || !hasAgent()) return out;
  running = true;
  lastRun = Date.now();
  try {
    await ensureSchema();
    const r = await db().query<Row>(
      `SELECT o.*, a.data, a.agent_status, a.agent_at, a.agent_attempts, a.agent_alerts, a.submitted_at
         FROM answers a JOIN orders o ON o.id = a.order_id
        WHERE a.agent_status IS DISTINCT FROM 'done' AND o.status IN ('paid', 'refunded', 'disputed')
          AND a.submitted_at > now() - interval '${MAX_DAYS} days' AND o.product IN ('diagnostic', 'prompt')`,
    );
    for (const o of r.rows) {
      out.checked++;
      const ageH = (Date.now() - new Date(o.submitted_at).getTime()) / 3_600_000;
      const sinceMin = o.agent_at ? (Date.now() - new Date(o.agent_at).getTime()) / 60_000 : Infinity;
      // après un envoi accepté, on laisse le temps à l'agent (Gemini + e-mail) avant de conclure qu'il manque
      const gap = (o.agent_status === 'sent' ? 20 : 10) * (o.agent_attempts >= 6 ? 6 : 1);
      if (ageH >= ALERT_HOURS[o.agent_alerts]) {
        const hours = ALERT_HOURS[o.agent_alerts];
        await sendMail({
          to: ownerEmail(),
          subject: `⚠ Résultat toujours pas envoyé depuis ${hours} h (${o.email ?? ''})`,
          html: shell({
            preheader: 'Je continue d’essayer automatiquement.',
            title: `Toujours pas livré après ${hours} h`,
            body:
              para(`Le résultat « ${esc(productName(o.product, 'fr'))} » n’est pas encore parti. Je réessaie automatiquement toutes les 10 minutes, puis toutes les heures, jusqu’à ce que ça passe. Si vous préférez, traitez-le à la main :`) +
              table(row('Client', esc(`${o.name ?? ''} ${o.email ?? ''}`.trim())) + row('État', esc(o.agent_status ?? 'jamais envoyé')) + o.data.map((a) => row(a.label, esc(a.value).replace(/\n/g, '<br>'))).join('')),
            footer: 'Alerte automatique.',
          }),
          replyTo: o.email ?? undefined,
        }).then(async (ok) => {
          if (ok) {
            await db().query('UPDATE answers SET agent_alerts = agent_alerts + 1 WHERE order_id = $1', [o.id]);
            out.alerted++;
          }
        }).catch(() => {});
      }
      if (sinceMin >= gap) {
        await sendToAgent(o, o.data, { retry: true, silent: true });
        out.retried++;
      }
    }
  } finally {
    running = false;
  }
  return out;
}

/** Secours : déclenche le suivi au plus toutes les 10 min depuis les requêtes que reçoit le serveur. */
export function maybeRunWatchdog() {
  if (Date.now() - lastRun < 10 * 60_000) return;
  lastRun = Date.now();
  void runWatchdog().catch((e) => console.error('watchdog', (e as Error).message));
}
