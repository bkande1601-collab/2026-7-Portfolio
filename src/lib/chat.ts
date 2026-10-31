import { prices, booking } from '../config/site';
import type { Lang } from '../content';

const eur = (n: number) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n);

/** Ce que l'assistant sait. Tout vient de src/config/site.ts et du contenu du site. */
export function facts(lang: Lang): string {
  const p = prices;
  const fr = lang === 'fr';
  return [
    fr ? 'Binta Kande : Chief of Staff, MSc IA, freelance. Marketing et contenu, automatisations et agents IA, produits digitaux.' : 'Binta Kande: Chief of Staff, MSc in AI, freelancer. Marketing and content, automation and AI agents, digital products.',
    fr
      ? `Diagnostic IA du business : ${p.diagnostic.amount} €. Master prompt : ${p.prompt.amount} €. Le client paie sur Stripe, remplit un formulaire, puis reçoit son résultat par e-mail.`
      : `AI business diagnosis: €${p.diagnostic.amount}. Tailored master prompt: €${p.prompt.amount}. The client pays on Stripe, fills in a form, then receives the result by email.`,
    fr
      ? `Le premier échange de ${booking.durationMin} minutes est gratuit (bouton « Réserver un audit »).`
      : `The first ${booking.durationMin}-minute call is free (“Book an audit” button).`,
    fr
      ? `Agent IA : de ${p.agent.amount} à ${p.agent.to} €. Système complet : de ${eur(p.system.amount)} à ${eur(p.system.to)} €+.`
      : `AI agent: €${p.agent.amount} to €${p.agent.to}. Complete system: €${eur(p.system.amount)} to €${eur(p.system.to)}+.`,
    fr
      ? `Contenu pour les réseaux sociaux (Instagram, TikTok, LinkedIn) : dès ${p.marketing.amount} € par mois, avec un bilan chaque semaine. Webinaires : formule de base avec tout inclus dès ${eur(p.webinar.amount)} €, et du sur mesure sur devis.`
      : `Social media content (Instagram, TikTok, LinkedIn): from €${p.marketing.amount} per month, with a weekly report. Webinars: base formula with everything included from €${eur(p.webinar.amount)}, and custom work on quote.`,
    fr ? 'Chief of Staff externalisée : dès 2 400 € par mois.' : 'Outsourced Chief of Staff: from €2,400 per month.',
    fr ? 'Création et refonte de site : un site de base solide et un diagnostic de sécurité, sur devis, sans prix affiché.' : 'Website design and redesign: a solid base website and a security diagnosis, on quote, no displayed price.',
    fr
      ? 'Promesse : tout est mis en place pour que ça fonctionne, mais aucun nombre de participants ni de ventes n’est garanti.'
      : 'Promise: everything is set up to work, but no number of attendees or sales is guaranteed.',
    fr ? 'Le site existe en français et en anglais.' : 'The site is available in French and English.',
  ].join('\n');
}

export function systemPrompt(lang: Lang): string {
  const fr = lang === 'fr';
  return [
    fr
      ? 'Tu es l’assistant du site de Binta Kande. Tu réponds en 3 phrases maximum, en français, de façon chaleureuse et directe.'
      : 'You are the assistant on Binta Kande’s website. You answer in 3 sentences at most, in English, warmly and directly.',
    fr
      ? 'Tu n’utilises QUE les informations ci-dessous. Si tu ne sais pas, tu le dis et tu proposes de réserver un échange de 30 minutes ou d’envoyer un message.'
      : 'You use ONLY the information below. If you do not know, say so and suggest booking a 30-minute call or sending a message.',
    fr
      ? 'Tu ne promets jamais de résultat chiffré. Tu ne cites pas d’outils techniques internes. Tu n’inventes ni prix, ni délais.'
      : 'You never promise a numerical result. You do not name internal technical tools. You never invent prices or lead times.',
    fr ? 'Informations :' : 'Information:',
    facts(lang),
  ].join('\n');
}

/** Réponses du mode aperçu (sans clé d'API) : simples, fondées sur les mêmes faits. */
export function previewAnswer(message: string, lang: Lang): string {
  const m = message.toLowerCase();
  const p = prices;
  const fr = lang === 'fr';
  const has = (...w: string[]) => w.some((x) => m.includes(x));

  if (has('diagnostic', 'diagnosis', 'prompt', '19', '39', 'guide'))
    return fr
      ? `Le diagnostic IA coûte ${p.diagnostic.amount} € et le master prompt ${p.prompt.amount} €. Vous payez, vous répondez à un formulaire, et vous recevez votre résultat par e-mail.`
      : `The AI diagnosis costs €${p.diagnostic.amount} and the master prompt €${p.prompt.amount}. You pay, fill in a form, and receive your result by email.`;
  if (has('réseaux', 'reseaux', 'contenu', 'instagram', 'tiktok', 'linkedin', 'social', 'content'))
    return fr
      ? `Je crée et publie du contenu pour Instagram, TikTok et LinkedIn, avec un bilan chaque semaine, dès ${p.marketing.amount} € par mois.`
      : `I create and publish content for Instagram, TikTok and LinkedIn, with a weekly report, from €${p.marketing.amount} per month.`;
  if (has('site', 'website', 'sécurité', 'securite', 'security', 'refonte', 'redesign'))
    return fr
      ? 'Je crée et refais des sites : un site de base solide, et un diagnostic de sécurité. Pas de prix affiché, car cela dépend de votre besoin : le devis suit un échange gratuit.'
      : 'I design and redesign websites: a solid base website, and a security diagnosis. No price displayed because it depends on your need: the quote follows a free call.';
  if (has('webinaire', 'webinar'))
    return fr
      ? 'Pour les webinaires, il y a une formule de base avec tout inclus, et du sur mesure (par exemple les publicités Meta). Le prix est sur devis, et je ne garantis pas un nombre de participants.'
      : 'For webinars there is a base formula with everything included, and custom work (for example Meta ads). Pricing is on quote, and I do not guarantee a number of attendees.';
  if (has('agent', 'automat', 'système', 'systeme', 'system'))
    return fr
      ? `Un agent IA coûte de ${p.agent.amount} à ${p.agent.to} €, un système complet de ${eur(p.system.amount)} à ${eur(p.system.to)} €+. Le devis précis suit un échange.`
      : `An AI agent costs €${p.agent.amount} to €${p.agent.to}, a complete system €${p.system.amount} to €${p.system.to}+. The exact quote follows a conversation.`;
  if (has('prix', 'tarif', 'combien', 'price', 'cost', 'how much'))
    return fr
      ? `Mes tarifs : diagnostic ${p.diagnostic.amount} €, master prompt ${p.prompt.amount} €, agent IA de ${p.agent.amount} à ${p.agent.to} €, contenu dès ${p.marketing.amount} € par mois. Le premier échange est gratuit. Tout est détaillé sur la page Tarifs.`
      : `My pricing: diagnosis €${p.diagnostic.amount}, master prompt €${p.prompt.amount}, AI agent €${p.agent.amount} to €${p.agent.to}, content from €${p.marketing.amount} per month. The first call is free. Everything is on the Pricing page.`;
  if (has('rendez', 'réserv', 'reserv', 'call', 'book', 'audit', 'échange', 'echange'))
    return fr
      ? `Vous pouvez réserver un échange de ${booking.durationMin} minutes avec le bouton « Réserver un audit », en haut de la page.`
      : `You can book a ${booking.durationMin}-minute call with the “Book an audit” button at the top of the page.`;
  return fr
    ? `Je peux vous parler des offres, des prix, du contenu pour vos réseaux, des webinaires ou des agents IA. Pour un cas précis, réservez un échange de ${booking.durationMin} minutes.`
    : `I can tell you about offers, prices, social media content, webinars or AI agents. For a specific case, book a ${booking.durationMin}-minute call.`;
}
