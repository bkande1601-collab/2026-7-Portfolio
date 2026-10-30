import type { APIRoute } from 'astro';
import { env } from '../../lib/env';
import { clean, json, readJson, toLang } from '../../lib/http';
import { previewAnswer, systemPrompt } from '../../lib/chat';

export const prerender = false;

/* Limite simple par adresse IP (meilleur effort : la mémoire est propre à chaque instance). */
const hits = new Map<string, number[]>();
function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 20;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const body = await readJson(request);
  if (!body) return json({ error: 'bad_request' }, 400);
  if (clean(body.website, 200)) return json({ reply: '' }); // robot

  const lang = toLang(body.lang);
  const message = clean(body.message, 500);
  if (!message) return json({ error: 'empty' }, 400);
  if (limited(clientAddress || request.headers.get('x-forwarded-for') || 'x')) return json({ error: 'rate' }, 429);

  const key = env('ANTHROPIC_API_KEY');
  if (!key) return json({ reply: previewAnswer(message, lang), preview: true });

  // historique court fourni par le navigateur, nettoyé
  const history = Array.isArray(body.history) ? body.history.slice(-6) : [];
  const messages = history
    .map((h) => {
      const o = h as Record<string, unknown>;
      return { role: o.role === 'assistant' ? 'assistant' : 'user', content: clean(o.content, 500) };
    })
    .filter((m) => m.content);
  messages.push({ role: 'user', content: message });
  // l'API exige que le premier message soit « user »
  while (messages.length && messages[0].role !== 'user') messages.shift();

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: env('CHAT_MODEL') || 'claude-haiku-5-5',
        max_tokens: 300,
        system: systemPrompt(lang),
        messages,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) throw new Error(`api ${res.status}`);
    const data = (await res.json()) as { content?: { type: string; text?: string }[] };
    const reply = (data.content ?? []).filter((c) => c.type === 'text').map((c) => c.text).join('').trim();
    if (!reply) throw new Error('empty reply');
    return json({ reply });
  } catch (e) {
    console.error('chat failed', e instanceof Error ? e.message : e);
    // on retombe sur la réponse simple plutôt que d'afficher une erreur
    return json({ reply: previewAnswer(message, lang), preview: true });
  }
};
