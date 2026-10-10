/** Utilitaires de fuseau horaire, sans dépendance. */

/** Décalage (ms) entre l'heure murale du fuseau `tz` et UTC à l'instant `utcMs`. */
function offsetMs(utcMs: number, tz: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(utcMs));
  const g = (type: string) => Number(parts.find((p) => p.type === type)!.value);
  const asUtc = Date.UTC(g('year'), g('month') - 1, g('day'), g('hour'), g('minute'), g('second'));
  return asUtc - Math.floor(utcMs / 1000) * 1000;
}

/** Convertit « 2026-10-12 + 14:30 en Europe/Paris » en instant UTC (ms). */
export function wallToUtc(ymd: string, hm: string, tz: string): number {
  const [y, m, d] = ymd.split('-').map(Number);
  const [h, mi] = hm.split(':').map(Number);
  const guess = Date.UTC(y, m - 1, d, h, mi);
  let t = guess - offsetMs(guess, tz);
  // second passage : corrige les changements d'heure
  t = guess - offsetMs(t, tz);
  return t;
}

/** Date du jour (YYYY-MM-DD) dans le fuseau `tz`, décalée de `plusDays`. */
export function ymdInTz(nowMs: number, tz: string, plusDays = 0): { ymd: string; weekday: number } {
  const f = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(
    new Date(nowMs),
  );
  const [y, m, d] = f.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + plusDays));
  return { ymd: dt.toISOString().slice(0, 10), weekday: dt.getUTCDay() };
}
