/**
 * RÉGLAGES DU SITE — tout ce qui se règle sans toucher au design.
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

  /**
   * PHOTO (page Parcours). Déposez l'image dans public/ (ex. public/binta.jpg)
   * puis mettez '/binta.jpg'. Laissez '' pour garder l'emplacement vide.
   */
  photo: '',

  /** Liens du pied de page. Un lien vide ('') est masqué. */
  links: {
    github: 'https://github.com/bkande1601-collab',
    linkedin: '',
  },

  /** Ajoutez un fichier si besoin, sinon laissez comme ça. */
  analytics: '',
} as const;

/**
 * PRIX (en euros). Modifiez ici : ils se mettent à jour partout.
 * `from: true` affiche « à partir de ».  `per: 'month'` = par mois.
 */
export const prices = {
  audit: { amount: 490, from: false, per: 'once' },
  sprint: { amount: 1500, from: true, per: 'once' },
  agent: { amount: 4500, from: true, per: 'once' },
  tool: { amount: 9000, from: true, per: 'once' },
  run: { amount: 690, from: false, per: 'month' },
  runPlus: { amount: 1490, from: false, per: 'month' },
  marketing: { amount: 900, from: true, per: 'month' },
  cos: { amount: 2400, from: true, per: 'month' },
} as const;

export type PriceKey = keyof typeof prices;

/**
 * RÉSERVATION — horaires, durée, marges, délai : un seul endroit.
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

/** Formate un prix selon la langue. */
export function formatPrice(key: PriceKey, lang: 'fr' | 'en') {
  const p = prices[key];
  const n = new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', {
    maximumFractionDigits: 0,
    useGrouping: 'always',
  }).format(p.amount);
  return { amount: `${n} €`, n, from: p.from, per: p.per };
}
