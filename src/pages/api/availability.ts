import type { APIRoute } from 'astro';
import { availableSlots } from '../../lib/slots';
import { json } from '../../lib/http';

export const prerender = false;

/** GET /api/availability → { preview, slots: ISO[] } (créneaux libres uniquement) */
export const GET: APIRoute = async () => {
  try {
    const { slots, preview } = await availableSlots();
    return json({ preview, slots: slots.map((s) => new Date(s).toISOString()) });
  } catch (e) {
    console.error('availability', e instanceof Error ? e.message : e);
    return json({ preview: false, slots: [], error: 'unavailable' }, 502);
  }
};
