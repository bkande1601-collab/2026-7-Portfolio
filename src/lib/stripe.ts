import Stripe from 'stripe';
import { env } from './env';

export const productKeys = ['diagnostic', 'prompt'] as const;
export type ProductKey = (typeof productKeys)[number];
export const isProduct = (v: unknown): v is ProductKey => productKeys.includes(v as ProductKey);

let client: Stripe | undefined;
export const hasStripe = () => Boolean(env('STRIPE_SECRET_KEY'));
export const stripe = () => (client ??= new Stripe(env('STRIPE_SECRET_KEY')));

/** Identifiant de prix Stripe (price_...) lu dans les variables d'environnement. */
export const priceId = (p: ProductKey) => env(`STRIPE_PRICE_${p.toUpperCase()}`);
export const siteOrigin = () => env('SITE_URL').replace(/\/$/, '');
