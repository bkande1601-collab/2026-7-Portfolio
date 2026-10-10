/**
 * Google Agenda via OAuth (refresh token), sans SDK.
 * - freeBusy : on lit UNIQUEMENT libre/occupé, jamais le contenu des événements.
 * - createEvent : crée l'événement avec lien Google Meet.
 */
import { env } from './env';

let cached: { token: string; exp: number } | null = null;

async function accessToken(): Promise<string> {
  if (cached && cached.exp > Date.now() + 30_000) return cached.token;
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env('GOOGLE_CLIENT_ID'),
      client_secret: env('GOOGLE_CLIENT_SECRET'),
      refresh_token: env('GOOGLE_REFRESH_TOKEN'),
      grant_type: 'refresh_token',
    }),
  });
  if (!res.ok) throw new Error(`google token ${res.status}`);
  const j = (await res.json()) as { access_token: string; expires_in: number };
  cached = { token: j.access_token, exp: Date.now() + j.expires_in * 1000 };
  return cached.token;
}

const calId = () => env('GOOGLE_CALENDAR_ID') || 'primary';

export type Busy = { start: number; end: number };

export async function freeBusy(fromMs: number, toMs: number): Promise<Busy[]> {
  const token = await accessToken();
  const res = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      timeMin: new Date(fromMs).toISOString(),
      timeMax: new Date(toMs).toISOString(),
      items: [{ id: calId() }],
    }),
  });
  if (!res.ok) throw new Error(`google freebusy ${res.status}`);
  const j = (await res.json()) as { calendars?: Record<string, { busy?: { start: string; end: string }[] }> };
  const list = j.calendars?.[calId()]?.busy ?? Object.values(j.calendars ?? {})[0]?.busy ?? [];
  return list.map((b) => ({ start: Date.parse(b.start), end: Date.parse(b.end) }));
}

export async function createEvent(args: {
  summary: string;
  description: string;
  startMs: number;
  endMs: number;
  timeZone: string;
  attendeeEmail: string;
  requestId: string;
}): Promise<{ meetLink: string; htmlLink: string; id: string }> {
  const token = await accessToken();
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calId())}/events?conferenceDataVersion=1&sendUpdates=none`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      summary: args.summary,
      description: args.description,
      start: { dateTime: new Date(args.startMs).toISOString(), timeZone: args.timeZone },
      end: { dateTime: new Date(args.endMs).toISOString(), timeZone: args.timeZone },
      attendees: [{ email: args.attendeeEmail }],
      conferenceData: {
        createRequest: { requestId: args.requestId, conferenceSolutionKey: { type: 'hangoutsMeet' } },
      },
      reminders: { useDefault: true },
    }),
  });
  if (!res.ok) throw new Error(`google event ${res.status}`);
  const j = (await res.json()) as { id: string; htmlLink: string; hangoutLink?: string };
  return { id: j.id, htmlLink: j.htmlLink, meetLink: j.hangoutLink ?? '' };
}
