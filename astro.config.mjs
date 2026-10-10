// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// Pages statiques (rapides). Seules les routes /api/* tournent côté serveur
// (agenda, e-mails, formulaires) grâce à `export const prerender = false`.
export default defineConfig({
  site: process.env.SITE_URL || 'https://example.com',
  adapter: vercel(),
  trailingSlash: 'never',
  build: { format: 'file' },
});
