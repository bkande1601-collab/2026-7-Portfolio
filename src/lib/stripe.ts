import Stripe from 'stripe';
import { env } from './env';

export const productKeys = ['diagnostic', 'prompt'] as const;
export type ProductKey = (typeof productKeys)[number];
export const isProduct = (v: unknown): v is ProductKey => productKeys.includes(v as ProductKey);

let client: Stripe | undefined;
export const hasStripe = () => Boolean(env('STRIPE_SECRET_KEY'));
export const stripe = () => (client ??= new Stripe(env('STRIPE_SECRET_KEY')));

/** Prix de secours (price_...) lu dans les variables d'environnement. */
export const priceId = (p: ProductKey) => env(`STRIPE_PRICE_${p.toUpperCase()}`);

const priceCache = new Map<string, { id: string; at: number }>();

/**
 * Prix à facturer : celui du produit Stripe qui porte la métadonnée `site_key` = clé du produit (diagnostic, prompt…),
 * c'est-à-dire son « prix par défaut ». Changer un prix ou ajouter un service dans Stripe suffit donc, sans toucher au site.
 * Repli : la variable STRIPE_PRICE_<PRODUIT>.
 */
export async function resolvePrice(p: ProductKey): Promise<string> {
  const hit = priceCache.get(p);
  if (hit && Date.now() - hit.at < 5 * 60_000) return hit.id;
  try {
    const list = await stripe().products.list({ active: true, limit: 100 });
    const found = list.data.find((x) => x.metadata?.site_key === p);
    const id = typeof found?.default_price === 'string' ? found.default_price : found?.default_price?.id;
    if (id) {
      priceCache.set(p, { id, at: Date.now() });
      return id;
    }
  } catch (e) {
    console.error('stripe: lecture des produits impossible, repli sur la variable', (e as Error).message);
  }
  return priceId(p);
}
export const siteOrigin = () => env('SITE_URL').replace(/\/$/, '');
