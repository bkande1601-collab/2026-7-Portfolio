import type { APIRoute } from 'astro';
import { checkPassword, makeToken, recordFail, tooMany, SESSION_DAYS } from '../../lib/admin';
import { clean, json, readJson } from '../../lib/http';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
  if (tooMany(ip)) return json({ error: 'too_many' }, 429);
  const body = await readJson(request);
  if (!body || !checkPassword(clean(body.password, 200))) {
    recordFail(ip);
    return json({ error: 'invalid' }, 401);
  }
  cookies.set('admin', makeToken(), {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'strict',
    path: '/admin',
    maxAge: SESSION_DAYS * 86_400,
  });
  return json({ ok: true });
};
