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
      label: { fr: 'Votre activité et vos clients', en: 'Your business and your customers' },
    },
    {
      id: 'tone',
      type: 'textarea',
      required: true,
      label: { fr: 'Votre ton et vos mots', en: 'Your tone and your words' },
      hint: {
        fr: 'Comment vous parlez à vos clients. Collez un texte que vous avez écrit si vous en avez un.',
        en: 'How you talk to your customers. Paste a text you wrote if you have one.',
      },
    },
    {
      id: 'wants',
      type: 'textarea',
      required: true,
      label: { fr: 'Ce que vous voulez que l’IA fasse pour vous', en: 'What you want the AI to do for you' },
    },
    {
      id: 'never',
      type: 'textarea',
      label: { fr: 'Ce qu’elle ne doit jamais faire', en: 'What it must never do' },
    },
  ],
};
