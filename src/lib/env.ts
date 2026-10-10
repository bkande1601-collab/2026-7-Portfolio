/** Lit une variable d'environnement (Astro en local, process.env sur Vercel). */
export function env(key: string): string {
  const fromAstro = (import.meta.env as Record<string, string | undefined>)[key];
  const v = fromAstro ?? (typeof process !== 'undefined' ? process.env[key] : undefined);
  return (v ?? '').trim();
}

export const hasGoogle = () =>
  Boolean(env('GOOGLE_CLIENT_ID') && env('GOOGLE_CLIENT_SECRET') && env('GOOGLE_REFRESH_TOKEN'));

export const hasResend = () => Boolean(env('RESEND_API_KEY') && env('MAIL_FROM'));
