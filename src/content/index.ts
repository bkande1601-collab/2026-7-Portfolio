import { fr, type Content } from './fr';
import { en } from './en';

export type Lang = 'fr' | 'en';
export const langs: Lang[] = ['fr', 'en'];
export const defaultLang: Lang = 'fr';

const dict: Record<Lang, Content> = { fr, en };

export function t(lang: Lang): Content {
  return dict[lang] ?? fr;
}

/** Convertit « mot *accent* » en HTML avec <em>. Le texte vient de nos fichiers, pas d'un visiteur. */
export function em(s: string): string {
  const safe = s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return safe.replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

/** Outils affichés dans la bande défilante. */
export const tools = [
  'n8n', 'Claude', 'Claude Code', 'Gemini', 'Notion', 'HubSpot', 'Node.js', 'React',
  'Docker', 'Coolify', 'Hetzner', 'Google Calendar', 'Google Workspace', 'GitHub',
];

/** Pages (slug identique en FR et EN). */
export const pages = ['', 'automations', 'offers', 'book', 'contact', 'journey', 'faq'] as const;

export function href(lang: Lang, page: string = '') {
  return page ? `/${lang}/${page}` : `/${lang}`;
}
