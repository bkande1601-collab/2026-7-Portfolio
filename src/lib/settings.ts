/** Réglages modifiables depuis le tableau de bord (table settings). */
import { db, ensureSchema } from './db';

export type AutoSend = 'off' | 'now' | '1' | '4' | '12' | '24';
export const AUTO_SEND_VALUES: AutoSend[] = ['off', 'now', '1', '4', '12', '24'];
const DEFAULTS: Record<string, string> = { auto_send: '1' };

export async function getSetting(key: string): Promise<string> {
  await ensureSchema();
  const r = await db().query<{ value: string }>('SELECT value FROM settings WHERE key = $1', [key]);
  return r.rows[0]?.value ?? DEFAULTS[key] ?? '';
}

export async function setSetting(key: string, value: string) {
  await ensureSchema();
  await db().query('INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value', [key, value]);
}

export const getAutoSend = async (): Promise<AutoSend> => {
  const v = await getSetting('auto_send');
  return (AUTO_SEND_VALUES as string[]).includes(v) ? (v as AutoSend) : '1';
};

/** Délai de relecture avant l'envoi automatique, en minutes (« 1 » = dans l'heure : 45 min + au plus 10 min de suivi). */
export const autoSendMinutes = (m: AutoSend): number => (m === 'now' ? 0 : m === '1' ? 45 : Number(m) * 60);

/** Phrase donnée au client sur le délai de réception du résultat. */
export async function deliveryPromise(lang: 'fr' | 'en', product: string): Promise<string> {
  const m = product === 'diagnostic' ? await getAutoSend().catch(() => '1' as AutoSend) : 'off';
  if (lang === 'en') return m === 'now' ? 'within a few minutes' : m === '1' ? 'within the hour' : m === 'off' ? 'within 24 hours' : `within ${m} hours`;
  return m === 'now' ? 'dans quelques minutes' : m === '1' ? 'dans l’heure' : m === 'off' ? 'sous 24 heures' : `d’ici ${m} heures`;
}
