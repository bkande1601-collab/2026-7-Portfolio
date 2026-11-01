/** Réglages modifiables depuis le tableau de bord (table settings). */
import { db, ensureSchema } from './db';

export type AutoSend = 'off' | 'now' | '4' | '12' | '24';
export const AUTO_SEND_VALUES: AutoSend[] = ['off', 'now', '4', '12', '24'];
const DEFAULTS: Record<string, string> = { auto_send: '4' };

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
  return (AUTO_SEND_VALUES as string[]).includes(v) ? (v as AutoSend) : '4';
};
