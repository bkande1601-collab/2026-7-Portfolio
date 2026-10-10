/**
 * Calcule les créneaux proposables à partir des horaires (src/config/site.ts)
 * et des plages occupées de Google Agenda.
 */
import { booking } from '../config/site';
import { wallToUtc, ymdInTz } from './time';
import { freeBusy, type Busy } from './google';
import { hasGoogle } from './env';

const MIN = 60_000;

function toMin(hm: string) {
  const [h, m] = hm.split(':').map(Number);
  return h * 60 + m;
}

/** Tous les créneaux théoriques (avant retrait des occupations). */
function candidates(nowMs: number): number[] {
  const out: number[] = [];
  const earliest = nowMs + booking.minNoticeHours * 60 * MIN;
  for (let i = 0; i <= booking.horizonDays; i++) {
    const { ymd, weekday } = ymdInTz(nowMs, booking.timezone, i);
    const ranges = booking.hours[weekday] ?? [];
    for (const [from, to] of ranges) {
      for (let m = toMin(from); m + booking.durationMin <= toMin(to); m += booking.stepMin) {
        const hm = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
        const start = wallToUtc(ymd, hm, booking.timezone);
        if (start >= earliest) out.push(start);
      }
    }
  }
  return out;
}

function isFree(start: number, busy: Busy[]) {
  const end = start + booking.durationMin * MIN;
  const buf = booking.bufferMin * MIN;
  return !busy.some((b) => start < b.end + buf && end > b.start - buf);
}

export async function availableSlots(nowMs = Date.now()): Promise<{ slots: number[]; preview: boolean }> {
  const list = candidates(nowMs);
  if (!hasGoogle()) return { slots: list, preview: true };
  if (!list.length) return { slots: [], preview: false };
  const busy = await freeBusy(nowMs, list[list.length - 1] + booking.durationMin * MIN + 24 * 60 * MIN);
  return { slots: list.filter((s) => isFree(s, busy)), preview: false };
}
