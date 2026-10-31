import { t, type Lang } from '../content';

/** Page d'origine (paramètre ?from=) vers le besoin à pré-remplir dans le formulaire. */
export const sourceNeed: Record<string, string> = {
  marketing: 'content',
  'marketing/content': 'content',
  'marketing/webinars': 'webinar',
  'marketing/sites': 'site',
  automations: 'automation',
  'automations/agents': 'agent',
  'automations/systems': 'tool',
  products: 'other',
  'products/diagnostic': 'other',
  'products/prompt': 'other',
  offers: 'other',
};

/** Nom lisible de chaque page d'origine. */
export function sourceLabels(lang: Lang): Record<string, string> {
  const n = t(lang).nav;
  return {
    marketing: n.marketing,
    'marketing/content': n.sub.content,
    'marketing/webinars': n.sub.webinars,
    'marketing/sites': n.sub.sites,
    automations: n.automations,
    'automations/agents': n.sub.agents,
    'automations/systems': n.sub.systems,
    products: n.products,
    'products/diagnostic': n.sub.diagnostic,
    'products/prompt': n.sub.prompt,
    offers: n.offers,
    journey: n.journey,
    blog: n.blog,
  };
}

/** Texte propre pour les e-mails : « Contenu pour les réseaux (marketing/content) ». */
export function sourceText(slug: string): string {
  if (!slug) return '';
  const label = sourceLabels('fr')[slug];
  return label ? `${label} (${slug})` : slug;
}
