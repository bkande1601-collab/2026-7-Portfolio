import type { Lang } from '../content';

export const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

export const isEmail = (s: string) => /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/.test(s) && s.length <= 254;

/** Texte propre : chaîne, sans caractères de contrôle, tronquée. */
export function clean(v: unknown, max: number): string {
  if (typeof v !== 'string') return '';
  // eslint-disable-next-line no-control-regex
  return v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);
}

export const toLang = (v: unknown): Lang => (v === 'en' ? 'en' : 'fr');

export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const len = Number(request.headers.get('content-length') || 0);
    if (len > 20_000) return null;
    const j = await request.json();
    return j && typeof j === 'object' ? (j as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}
