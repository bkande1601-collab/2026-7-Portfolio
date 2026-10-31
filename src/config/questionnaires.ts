/**
 * QUESTIONNAIRES envoyés après le paiement (page /merci).
 * Modifiez les questions ici : elles s'affichent et sont enregistrées telles quelles.
 */
import type { ProductKey } from '../lib/stripe';

export type Question = {
  id: string;
  type: 'text' | 'textarea' | 'url';
  required?: boolean;
  label: { fr: string; en: string };
  hint?: { fr: string; en: string };
};

export const questionnaires: Record<ProductKey, Question[]> = {
  diagnostic: [
    {
      id: 'activity',
      type: 'textarea',
      required: true,
      label: { fr: 'Qui êtes-vous et que vendez-vous ?', en: 'Who are you and what do you sell?' },
      hint: { fr: 'Votre activité, vos clients, depuis quand.', en: 'Your business, your customers, for how long.' },
    },
    { id: 'website', type: 'url', label: { fr: 'L’adresse de votre site', en: 'Your website address' } },
    { id: 'linkedin', type: 'url', label: { fr: 'L’adresse de votre LinkedIn', en: 'Your LinkedIn address' } },
    {
      id: 'problem',
      type: 'textarea',
      required: true,
      label: { fr: 'Votre principal problème en ce moment', en: 'Your main problem right now' },
    },
    {
      id: 'goals',
      type: 'textarea',
      required: true,
      label: { fr: 'Vos objectifs pour les prochains mois', en: 'Your goals for the coming months' },
    },
    {
      id: 'tools',
      type: 'text',
      label: { fr: 'Les outils que vous utilisez déjà', en: 'Tools you already use' },
    },
  ],
  prompt: [
    {
      id: 'activity',
      type: 'textarea',
      required: true,
      label: { fr: 'Votre activité et ce que vous vendez', en: 'Your business and what you sell' },
      hint: {
        fr: 'Votre métier, vos offres, vos prix si vous le souhaitez, ce qui vous différencie.',
        en: 'Your trade, your offers, your prices if you wish, what sets you apart.',
      },
    },
    {
      id: 'audience',
      type: 'textarea',
      required: true,
      label: { fr: 'Vos clients : qui sont-ils, que cherchent-ils, quelles objections ont-ils ?', en: 'Your customers: who are they, what do they want, what objections do they have?' },
    },
    {
      id: 'tone',
      type: 'textarea',
      required: true,
      label: { fr: 'Votre ton et vos mots', en: 'Your tone and your words' },
      hint: {
        fr: 'Tutoiement ou vouvoiement, mots que vous employez, mots que vous évitez.',
        en: 'Informal or formal address, words you use, words you avoid.',
      },
    },
    {
      id: 'examples',
      type: 'textarea',
      label: { fr: 'Un ou deux textes que vous avez écrits', en: 'One or two texts you have written' },
      hint: {
        fr: 'Un e-mail, une publication, un message client. Cela aide à reproduire votre style.',
        en: 'An email, a post, a customer message. It helps reproduce your style.',
      },
    },
    {
      id: 'wants',
      type: 'textarea',
      required: true,
      label: { fr: 'Ce que vous voulez que l’IA fasse pour vous', en: 'What you want the AI to do for you' },
      hint: {
        fr: 'Par exemple : répondre aux messages, écrire des publications, préparer des devis.',
        en: 'For example: answer messages, write posts, prepare quotes.',
      },
    },
    {
      id: 'never',
      type: 'textarea',
      label: { fr: 'Ce qu’elle ne doit jamais faire', en: 'What it must never do' },
    },
    {
      id: 'tools',
      type: 'text',
      label: { fr: 'Où allez-vous l’utiliser ?', en: 'Where will you use it?' },
      hint: { fr: 'ChatGPT, Claude, Gemini, e-mails, réseaux sociaux…', en: 'ChatGPT, Claude, Gemini, emails, social media…' },
    },
  ],
};
