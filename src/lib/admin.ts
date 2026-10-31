/** Accès au tableau de bord : mot de passe unique (ADMIN_PASSWORD) et cookie signé. */
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { env } from './env';

export const adminConfigured = () => env('ADMIN_PASSWORD').length >= 12;

const sha = (s: string) => createHash('sha256').update(s).digest();
const sign = (payload: string) => createHmac('sha256', `admin-session:${env('ADMIN_PASSWORD')}`).update(payload).digest('hex');

export function checkPassword(input: string): boolean {
  if (!adminConfigured()) return false;
  return timingSafeEqual(sha(input), sha(env('ADMIN_PASSWORD')));
}

export const SESSION_DAYS = 7;

export function makeToken(): string {
  const exp = String(Date.now() + SESSION_DAYS * 86_400_000);
  return `${exp}.${sign(exp)}`;
}

export function verifyToken(token: string | undefined): boolean {
  if (!token || !adminConfigured()) return false;
  const [exp, sig] = token.split('.');
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const good = sign(exp);
  return sig.length === good.length && timingSafeEqual(Buffer.from(sig), Buffer.from(good));
}

/** Freine les essais de mot de passe : 5 échecs par quart d'heure et par adresse. */
const fails = new Map<string, { n: number; until: number }>();
export function tooMany(ip: string) {
  const f = fails.get(ip);
  return Boolean(f && f.until > Date.now() && f.n >= 5);
}
export function recordFail(ip: string) {
  const f = fails.get(ip);
  if (f && f.until > Date.now()) f.n += 1;
  else fails.set(ip, { n: 1, until: Date.now() + 15 * 60_000 });
}
