/**
 * RÉGLAGES DU SITE, tout ce qui se règle sans toucher au design.
 * Les textes (FR/EN) sont dans src/content/fr.ts et src/content/en.ts.
 */

export const site = {
  name: 'Binta Kande',
  brand: 'Binta Kande',
  /** Votre e-mail public. Laissez '' pour ne pas l'afficher. */
  publicEmail: '',

  /**
   * VIDÉO MOTION DESIGN (accueil, à droite de l'accroche).
   * Pour l'activer : mettez le chemin ou l'URL d'un .mp4 / .webm
   * (ex. '/video/reel.mp4' après l'avoir déposée dans public/video/).
   * Laissez '' : un schéma animé la remplace en attendant.
   */
  heroVideo: '',
  /** Image d'attente de la vidéo (optionnel), ex. '/video/poster.jpg' */
  heroVideoPoster: '',
  /** Photo de l'accueil, affichée tant qu'il n'y a pas de vidéo. */
  heroPhoto: '/photos/binta-accueil-violet.webp',
  heroPhotoAlt: 'Portrait de Binta Kande en haut violet, les bras croisés',

  /**
   * PHOTO (page Parcours). Déposez l'image dans public/ (ex. public/binta.jpg)
   * puis mettez '/binta.jpg'. Laissez '' pour garder l'emplacement vide.
   */
  photo: '/photos/binta-parcours.webp',

  /**
   * VIDÉO MOTION DESIGN DE LA PLATEFORME INTERNE (pages Automatisations et Systèmes).
   * Elle est dans public/video/plateforme.mp4. Pour la remplacer, déposez votre
   * propre .mp4 au même endroit, ou changez le chemin ici. Laissez '' pour la retirer.
   */
  automationsVideo: '/video/plateforme.mp4',
  automationsVideoPoster: '/video/plateforme-poster.webp',

  /**
   * VIDÉO « C'EST QUOI UN AGENT IA ? » (début de la page Agents IA), une par langue.
   * Fichiers dans public/video/. Laissez '' pour retirer la vidéo de la page.
   */
  agentVideo: { fr: '/video/agent-ia-fr.mp4', en: '/video/agent-ia-en.mp4' } as Record<'fr' | 'en', string>,
  agentVideoPoster: { fr: '/video/agent-ia-fr.webp', en: '/video/agent-ia-en.webp' } as Record<'fr' | 'en', string>,

  /**
   * LES AUTRES VIDÉOS (30 secondes chacune, une par langue, dans public/video/) :
   *   contenu-fr.mp4 / contenu-en.mp4      page Contenu pour les réseaux
   *   webinaire-fr.mp4 / webinaire-en.mp4  page Webinaires
   *   preuves-fr.mp4 / preuves-en.mp4      accueil, section « Ce que j'ai déjà fait »
   * Mettez false pour retirer une vidéo de sa page.
   */
  videos: { content: true, webinar: true, proof: true },

  /**
   * BANDE-ANNONCE DE 7 SECONDES à l'arrivée sur l'accueil (une fois par visite).
   * Fichiers : trailer-fr.mp4, trailer-en.mp4 (paysage), trailer-portrait-fr.mp4,
   * trailer-portrait-en.mp4 (mobile). Mettez false pour la retirer.
   */
  trailer: false,

  /** Publication LinkedIn du hackathon Mirakl x Eugenia School. */
  hackathonLink: 'https://lnkd.in/p/eW7JqGUB',

  /** Liens du pied de page. Un lien vide ('') est masqué. */
  links: {
    github: 'https://github.com/bkande1601-collab',
    linkedin: '',
  },

  /**
   * Codes de vérification des moteurs de recherche. Collez la valeur « content » de la balise
   * que Google Search Console (méthode « Balise HTML ») ou Bing Webmaster Tools vous donne.
   */
  verification: { google: '', bing: '' },

  /** Ajoutez un fichier si besoin, sinon laissez comme ça. */
  analytics: '',
} as const;

/**
 * PRIX (en euros). Modifiez ici : ils se mettent à jour partout.
 * `from: true` affiche « dès ». `to` ajoute une fourchette (« de 200 à 800 € »).
 * `plus: true` ajoute un « + » après le montant haut. `per: 'month'` = par mois.
 */
export const prices = {
  diagnostic: { amount: 19, from: false, per: 'once' },
  prompt: { amount: 9.99, from: false, per: 'once' },
  agent: { amount: 200, to: 800, from: false, per: 'once' },
  system: { amount: 2000, to: 5000, plus: true, from: false, per: 'once' },
  marketing: { amount: 900, from: true, per: 'month' },
  // formule de base du webinaire (à ajuster à votre goût)
  webinar: { amount: 1490, from: true, per: 'once' },
  cos: { amount: 2400, from: true, per: 'month' },
} as const satisfies Record<string, Price>;

type Price = {
  amount: number;
  to?: number;
  plus?: boolean;
  from: boolean;
  per: 'once' | 'month';
};

/**
 * LIENS DE PAIEMENT STRIPE. Créez un « Payment Link » par produit dans Stripe,
 * puis collez l'adresse ici (https://buy.stripe.com/...). Laissé vide, le bouton
 * affiche « Bientôt disponible ». Dans Stripe, réglez la page de confirmation
 * pour qu'elle renvoie vers votre formulaire de questions.
 */
export const stripeLinks: Record<'diagnostic' | 'prompt', string> = {
  diagnostic: '',
  prompt: '',
};

export type PriceKey = keyof typeof prices;

/**
 * RÉSERVATION, horaires, durée, marges, délai : un seul endroit.
 * Les jours/heures sont en heure locale du fuseau `timezone`.
 */
export const booking = {
  timezone: 'Europe/Paris',
  /** Durée d'un rendez-vous, en minutes */
  durationMin: 30,
  /** Marge libre avant ET après chaque rendez-vous existant, en minutes */
  bufferMin: 15,
  /** Délai minimum avant un rendez-vous, en heures */
  minNoticeHours: 24,
  /** Jusqu'à combien de jours à l'avance on peut réserver */
  horizonDays: 30,
  /** Pas entre deux créneaux proposés, en minutes */
  stepMin: 30,
  /**
   * Plages de disponibilité par jour (0 = dimanche … 6 = samedi).
   * Format 'HH:MM'. Un jour absent ou vide = indisponible, aucun créneau proposé.
   */
  hours: {
    0: [],
    1: [['09:30', '12:30'], ['14:00', '18:00']],
    2: [['09:30', '12:30'], ['14:00', '18:00']],
    3: [['09:30', '12:30'], ['14:00', '18:00']],
    4: [['09:30', '12:30'], ['14:00', '18:00']],
    5: [['09:30', '12:30']],
    6: [],
  } as Record<number, [string, string][]>,
} as const;

/**
 * Nom de l'événement créé dans Google Agenda.
 * Résultat : « Meeting Prénom x Binta | Services »
 */
export const eventTitle = (firstName: string) => `Meeting ${firstName} x Binta | Services`;

/** Formate un prix selon la langue. */
export function formatPrice(key: PriceKey, lang: 'fr' | 'en') {
  const p: Price = prices[key];
  const nf = new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', {
    maximumFractionDigits: 2,
    useGrouping: 'always',
  });
  const low = nf.format(p.amount);
  const hasRange = typeof p.to === 'number';
  const sep = lang === 'fr' ? ' à ' : ' to ';
  const amount = hasRange
    ? `${low}${sep}${nf.format(p.to!)} €${p.plus ? '+' : ''}`
    : `${low} €`;
  return { amount, n: low, from: p.from, range: hasRange, per: p.per };
}

/** Chemin d'une vidéo : /video/<nom>-<langue>.mp4 et son image d'attente .webp */
export const videoPath = (name: string, lang: 'fr' | 'en') => ({
  src: `/video/${name}-${lang}.mp4`,
  poster: `/video/${name}-${lang}.webp`,
});
