import type { APIRoute } from 'astro';
import { stripe, hasStripe, priceId, isProduct, siteOrigin } from '../../lib/stripe';
import { hasDb } from '../../lib/db';
import { createPending } from '../../lib/orders';
import { json, readJson, toLang } from '../../lib/http';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await readJson(request);
  if (!body || !isProduct(body.product)) return json({ error: 'bad_request' }, 400);
  const product = body.product;
  const lang = toLang(body.lang);

  const price = hasStripe() ? priceId(product) : '';
  const origin = siteOrigin();
  if (!price || !origin) return json({ error: 'not_configured' }, 503);

  try {
    const session = await stripe().checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price, quantity: 1 }],
      customer_creation: 'always',
      phone_number_collection: { enabled: true },
      locale: lang,
      // aux couleurs du site : ivoire, bouton violet, logo en couleur
      branding_settings: {
        display_name: 'Binta Kande',
        background_color: '#f6f0e4',
        button_color: '#694cac',
        border_style: 'pill',
        font_family: 'inter',
        logo: { type: 'url', url: `${origin}/brand/logo-checkout.png` },
      },
      metadata: { product, lang },
      payment_intent_data: { metadata: { product, lang } },
      success_url: `${origin}/${lang}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${lang}/products/${product}`,
    });
    if (!session.url) return json({ error: 'no_url' }, 502);
    if (hasDb()) await createPending(session.id, product, lang).catch(() => console.error('checkout: pending order not saved'));
    return json({ url: session.url });
  } catch (e) {
    // Le message d'erreur Stripe ne contient pas de secret (la clé y apparaît masquée)
    const err = e as { type?: string; code?: string; message?: string };
    console.error('checkout: stripe session failed', err.type, err.code, err.message);
    return json({ error: 'stripe_failed' }, 502);
  }
};
