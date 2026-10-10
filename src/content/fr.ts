/**
 * TEXTES — FRANÇAIS.
 * Astuce : un mot entre *astérisques* s'affiche en italique serif (accent).
 * Les prix et horaires ne sont PAS ici : voir src/config/site.ts.
 * La version anglaise est dans en.ts (mêmes clés).
 */
export const fr = {
  lang: 'fr' as 'fr' | 'en',
  htmlLang: 'fr',
  locale: 'fr_FR',

  meta: {
    title: 'Binta Kande — Automatisations & agents IA qui tournent en production',
    description:
      'Chief of Staff, MSc IA & Data. Je conçois des automatisations et des agents IA pour les entreprises, chiffrés et en production. Audit, sprint, agent IA, outil interne.',
  },

  nav: {
    home: 'Accueil',
    automations: 'Automatisations & IA',
    offers: 'Offres & tarifs',
    journey: 'Parcours',
    faq: 'FAQ',
    menu: 'Menu',
    close: 'Fermer',
    skip: 'Aller au contenu',
  },

  cta: {
    book: 'Réserver un audit',
    message: 'Envoyer un message',
  },

  switchLang: { label: 'EN', title: 'Read in English' },

  home: {
    hero: {
      eyebrow: 'Chief of Staff · Automatisations & agents IA',
      title: 'Des systèmes qui *tournent* vraiment, pas des démos.',
      sub: "J'automatise le travail répétitif des entreprises et je construis les agents IA qui connaissent leurs données. Chiffré, en production, en français et en anglais.",
      videoLabel: 'Vidéo motion design',
      videoPending: 'Ma vidéo arrive ici',
    },
    facts: [
      { k: 'AES-256-GCM', v: 'Plateforme chiffrée, construite seule' },
      { k: 'MSc IA & Data', v: 'Le socle technique' },
      { k: 'WLFG', v: 'Chief of Staff du groupe' },
      { k: 'FR · EN', v: 'Livré dans les deux langues' },
    ],
    toolsTitle: 'Ce que j’utilise tous les jours',

    beforeAfter: {
      kicker: 'Ce qui change',
      title: 'Le même lundi matin, *avant* et après.',
      beforeLabel: 'Avant',
      afterLabel: 'Après',
      before: [
        'Une demande arrive par e-mail',
        'On la recopie dans trois outils',
        'On relance, on oublie, on retrouve',
        'Le reporting part le jeudi, à la main',
      ],
      after: [
        'Une demande arrive',
        'n8n la route et la classe',
        "L'agent IA lit, rédige, décide",
        'Notion, HubSpot, Agenda à jour — rapport automatique',
      ],
      caption: 'Moins de copier-coller, plus de temps pour ce qui demande vraiment quelqu’un.',
    },

    platform: {
      kicker: 'La preuve, en production',
      title: "J'ai construit *ma propre* plateforme. Elle tourne tous les jours.",
      text: "Projets, messagerie, to-do synchronisée avec Notion, OKR, arrivées et départs, Google Agenda, et un assistant IA qui connaît les documents de l'entreprise. Conçue et développée seule, chiffrée, bilingue.",
      stack: 'n8n · Gemini · Hetzner via Coolify',
      modules: ['Projets', 'Messagerie', 'To-do · Notion', 'OKR', 'Onboarding & départs', 'Agenda', 'Assistant IA'],
      chat: {
        title: 'Assistant IA',
        q: 'Quelle est la procédure quand un collaborateur quitte l’entreprise ?',
        a: 'Trois étapes : retirer les accès le dernier jour, récupérer le matériel, puis lancer l’entretien de départ. Je peux créer les tâches dans la to-do tout de suite.',
        src: 'Sources : Procédure départs v3 · Charte IT',
        lock: 'Chiffré AES-256-GCM',
      },
    },

    role: {
      kicker: 'Qui parle',
      title: 'Chief of Staff le jour, *builder* le reste du temps.',
      text: "Je pilote les opérations du groupe WLFG (WLFG Consulting et Proplyd Productions) : priorités, OKR, reporting, coordination. Mon MSc en IA & Data et mes années à construire des outils font que je ne me contente pas de les spécifier : je les livre. En freelance, j'apporte la même rigueur aux entreprises qui veulent automatiser sérieusement.",
      link: 'Lire mon parcours',
    },

    offersTitle: 'Une échelle simple, du premier pas au système complet',
    offersLink: 'Voir le détail des offres',

    lab: {
      kicker: 'Dans le labo',
      title: 'Trois chantiers *en cours*.',
      sub: 'Je les construis en parallèle. Laissez votre e-mail, je vous préviens à la sortie. Pas de newsletter, juste l’annonce.',
      items: [
        { name: "Un SaaS d'automatisation", state: 'Construction', progress: 62 },
        { name: 'Automatisations prêtes à installer', state: 'Packaging', progress: 40 },
        { name: 'Création de contenu', state: 'Production', progress: 25 },
      ],
      inProgress: 'En cours',
      placeholder: 'votre@email.com',
      submit: 'Me prévenir',
      label: 'Votre e-mail',
      ok: 'C’est noté. Un e-mail de confirmation vous attend.',
      err: 'Impossible d’enregistrer pour l’instant. Réessayez dans un instant.',
      invalid: 'Cette adresse e-mail semble incorrecte.',
      sending: 'Envoi…',
    },

    finalTitle: 'Vous avez un process qui vous coûte *trop* de temps ?',
    finalText: 'Trente minutes pour le mettre à plat. Vous repartez avec une première piste, même si on ne travaille pas ensemble.',
  },

  automations: {
    hero: {
      kicker: 'Automatisations & IA',
      title: 'Je retire le travail *répétitif* de votre équipe.',
      sub: "Des automatisations n8n, des agents IA branchés sur vos outils et vos documents, des outils internes sur mesure. C'est mon cœur de métier.",
    },
    flow: {
      kicker: 'Un exemple concret',
      title: 'Un lead arrive. Personne n’a rien touché.',
      steps: [
        { t: 'Formulaire', d: 'Le contact arrive' },
        { t: 'Qualification IA', d: 'Gemini lit et note' },
        { t: 'CRM', d: 'Fiche HubSpot créée' },
        { t: 'Réponse', d: 'E-mail + créneau proposé' },
      ],
      note: 'Chaque étape journalise ce qu’elle fait. Si quelque chose échoue, vous êtes alerté, pas surpris.',
    },
    agent: {
      kicker: 'Agent IA sur vos données',
      title: 'Un assistant qui *connaît* vos documents et cite ses sources.',
      text: "Recherche hybride (sémantique et mots-clés) sur vos procédures, contrats et notes. Il répond, montre d'où vient la réponse, et reste dans le périmètre que vous lui donnez.",
      q: 'Quel est notre délai de paiement standard chez les clients grands comptes ?',
      a: '45 jours fin de mois, sauf accord écrit. Deux clients ont une clause à 60 jours.',
      src: 'Conditions générales v4 · Contrat Atlas §6',
    },
    tool: {
      kicker: 'Outil interne',
      title: 'Quand un tableur ne suffit plus, on construit *le vôtre*.',
      text: "Une plateforme à vos couleurs, chiffrée, qui parle à vos outils (Notion, Google, HubSpot). C'est ce que j'ai fait pour WLFG : elle sert tous les jours.",
    },
    process: {
      kicker: 'Comment ça se passe',
      title: 'On avance par étapes, vous gardez la main.',
      steps: [
        { t: 'Audit', d: 'On cartographie, on chiffre le gain.' },
        { t: 'Sprint', d: 'Les premières automatisations en production.' },
        { t: 'Agent / outil', d: 'On passe à plus grand si ça vaut le coup.' },
        { t: 'Run', d: 'Je surveille et fais évoluer chaque mois.' },
      ],
    },
    stackTitle: 'Les outils derrière',
    finalTitle: 'Commençons par *l’audit*.',
    finalText: 'Une demi-heure, un process, une première piste chiffrée.',
  },

  offers: {
    hero: {
      kicker: 'Offres & tarifs',
      title: 'Une échelle claire. *Vous* choisissez la marche.',
      sub: 'Du diagnostic au système complet. Chaque marche est utile seule, et prépare la suivante.',
    },
    ladderLabel: 'Échelle',
    ladder: [
      {
        key: 'audit',
        name: 'Audit',
        line: 'Je trouve où part votre temps et ce qu’on peut automatiser.',
        out: 'Cartographie des process et 3 pistes classées par gain.',
      },
      {
        key: 'sprint',
        name: 'Sprint automatisation',
        line: 'Les premières automatisations tournent en production.',
        out: 'Une à trois automatisations livrées, testées, documentées.',
      },
      {
        key: 'agent',
        name: 'Agent IA sur vos données',
        line: 'Un assistant qui connaît vos documents et cite ses sources.',
        out: 'Agent déployé, branché à vos outils, avec périmètre et garde-fous.',
      },
      {
        key: 'tool',
        name: 'Outil interne ou plateforme',
        line: 'Votre propre plateforme, chiffrée, comme celle de WLFG.',
        out: 'Plateforme sur mesure, hébergée et maintenable.',
      },
    ],
    from: 'à partir de',
    flat: 'forfait',
    perMonth: '/ mois',
    quote: 'Prix de départ : le devis précis suit l’audit.',
    runKicker: 'Puis, pour que ça dure',
    runTitle: 'Un abonnement mensuel, *Run*.',
    runText: 'Une automatisation non surveillée finit par casser. Je m’en occupe.',
    runPlans: [
      { key: 'run', name: 'Run', line: 'Surveillance, corrections et petits ajustements.' },
      { key: 'runPlus', name: 'Run+', line: 'Tout Run, plus des évolutions chaque mois et un reporting data.' },
    ],
    otherKicker: 'Et aussi',
    other: [
      {
        key: 'marketing',
        name: 'Marketing digital',
        line: 'Stratégie, contenu et acquisition, avec le même réflexe : automatiser ce qui se répète.',
      },
      {
        key: 'cos',
        name: 'Chief of Staff externalisée',
        line: 'Pilotage, OKR, priorités et reporting pour votre direction, à temps partagé.',
      },
      {
        key: null,
        name: 'Reporting data',
        line: 'Tableaux de bord et reportings automatisés, branchés sur vos sources.',
        custom: 'Sur devis',
      },
    ],
    finalTitle: 'Pas sûr de la marche ? *Commencez* par l’audit.',
    finalText: 'C’est le point d’entrée, et il se déduit d’un sprint si on continue ensemble.',
  },

  book: {
    hero: {
      kicker: 'Réserver un audit',
      title: 'Trente minutes pour *mettre à plat* votre besoin.',
      sub: 'Trois petites étapes. Vous recevez l’invitation avec le lien Google Meet par e-mail.',
    },
    steps: ['Votre besoin', 'Jour et heure', 'Confirmation'],
    fields: {
      name: 'Nom',
      email: 'E-mail',
      company: 'Entreprise',
      need: 'Votre besoin',
      budget: 'Budget envisagé',
      message: 'En quelques mots',
      messagePlaceholder: 'Quel process voulez-vous alléger, ou quel projet avez-vous en tête ?',
      optional: 'facultatif',
    },
    needs: [
      { v: 'automation', t: 'Automatiser un process' },
      { v: 'agent', t: 'Un agent IA sur mes données' },
      { v: 'tool', t: 'Un outil interne / une plateforme' },
      { v: 'marketing', t: 'Marketing digital' },
      { v: 'cos', t: 'Chief of Staff externalisée' },
      { v: 'other', t: 'Je ne sais pas encore' },
    ],
    budgets: [
      { v: 'lt1500', t: 'Moins de 1 500 €' },
      { v: '1500-4500', t: '1 500 – 4 500 €' },
      { v: '4500-9000', t: '4 500 – 9 000 €' },
      { v: 'gt9000', t: 'Plus de 9 000 €' },
      { v: 'unknown', t: 'À définir ensemble' },
    ],
    next: 'Choisir un créneau',
    back: 'Retour',
    pickDay: 'Choisissez un jour',
    pickTime: 'Puis une heure',
    noSlotsDay: 'Aucun créneau ce jour-là.',
    noSlotsAll: 'Aucune disponibilité dans les prochaines semaines. Écrivez-moi, on s’arrange.',
    loading: 'Chargement des disponibilités…',
    tz: 'Heures affichées dans votre fuseau :',
    preview:
      'Mode aperçu : ces créneaux sont des exemples. Rien ne sera réservé tant que Google Agenda n’est pas branché.',
    recap: 'Récapitulatif',
    confirm: 'Confirmer le rendez-vous',
    sending: 'Réservation…',
    successTitle: 'C’est réservé.',
    successText: 'Un e-mail de confirmation avec le lien Google Meet vient de partir.',
    successPreview: 'Mode aperçu : aucun rendez-vous réel n’a été créé.',
    error: 'La réservation a échoué. Le créneau vient peut-être d’être pris : choisissez-en un autre.',
    errorFields: 'Merci de compléter nom, e-mail et besoin.',
    weekdays: ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'],
    privacy: 'Vos réponses ne servent qu’à préparer notre échange.',
  },

  contact: {
    hero: {
      kicker: 'Envoyer un message',
      title: 'Une question, une idée ? *Écrivez-moi.*',
      sub: 'Je réponds en général sous deux jours ouvrés. Vous recevez un accusé de réception tout de suite.',
    },
    fields: {
      name: 'Nom',
      email: 'E-mail',
      subject: 'Sujet',
      message: 'Message',
      messagePlaceholder: 'Dites-moi ce dont vous avez besoin.',
    },
    send: 'Envoyer le message',
    sending: 'Envoi…',
    okTitle: 'Message bien reçu.',
    okText: 'Un accusé de réception vient d’être envoyé à votre adresse. Je reviens vers vous vite.',
    err: 'L’envoi a échoué. Réessayez ou prenez rendez-vous directement.',
    invalid: 'Merci de renseigner nom, e-mail valide et message.',
    or: 'Vous préférez en parler de vive voix ?',
  },

  journey: {
    hero: {
      kicker: 'Parcours',
      title: 'D’où je viens, et *ce que j’ai bâti*.',
      sub: 'Le détail des dates et des écoles arrive. L’essentiel, lui, est déjà là.',
    },
    photoAlt: 'Portrait de Binta Kande',
    photoNote: 'Photo à ajouter : déposez public/binta.jpg',
    todo: 'À compléter',
    items: [
      {
        when: "Aujourd'hui",
        title: 'Freelance — automatisations & agents IA',
        text: 'J’accompagne des entreprises : audit, sprints, agents IA, outils internes, abonnements Run.',
        todo: false,
      },
      {
        when: 'En cours',
        title: 'Chief of Staff — groupe WLFG',
        text: 'WLFG Consulting et Proplyd Productions. Pilotage, OKR, reporting, et la plateforme interne que j’ai conçue et développée.',
        todo: false,
      },
      {
        when: '[année]',
        title: 'MSc en IA & Data',
        text: 'Établissement : [à compléter].',
        todo: true,
      },
      {
        when: '[année]',
        title: 'Formation et premières expériences',
        text: '[École, diplôme, entreprise — à compléter].',
        todo: true,
      },
    ],
    stackTitle: 'La boîte à outils',
  },

  faq: {
    hero: {
      kicker: 'FAQ',
      title: 'Les *questions* qu’on me pose le plus.',
    },
    items: [
      {
        q: 'Quels sont les délais ?',
        a: 'Un audit se planifie sous quelques jours. Un sprint d’automatisation se compte en semaines, un agent IA ou un outil interne en quelques semaines à quelques mois selon le périmètre. Le calendrier précis est fixé dans le devis.',
      },
      {
        q: 'Mes données sont-elles en sécurité ?',
        a: 'La sécurité fait partie du cahier des charges, pas d’une option. J’applique le même niveau que sur ma propre plateforme : chiffrement AES-256-GCM, accès limités au strict nécessaire, hébergement en Europe (Hetzner). Je travaille sous accord de confidentialité si vous le souhaitez.',
      },
      {
        q: 'Comment se passe la facturation ?',
        a: 'Audit : forfait. Sprint, agent et outil : devis avec acompte au démarrage, solde à la livraison. Run et Run+ : abonnement mensuel, sans engagement long. Les prix affichés sont des prix de départ ; le devis exact suit l’audit.',
      },
      {
        q: 'Travaillez-vous en anglais ?',
        a: 'Oui. Le site, les échanges, la documentation et les outils que je livre existent en français et en anglais.',
      },
      {
        q: 'Et si une automatisation casse ?',
        a: 'Chaque automatisation journalise ce qu’elle fait et vous alerte en cas d’échec. Avec Run, je la surveille et je corrige avant que vous ne le voyiez.',
      },
    ],
    finalTitle: 'Une autre question ? *Posez-la.*',
  },

  footer: {
    tagline: 'Automatisations & agents IA qui tournent en production.',
    rights: 'Tous droits réservés.',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    sitemap: 'Plan',
  },

  notFound: {
    title: 'Cette page n’existe pas.',
    text: 'Elle a peut-être été déplacée.',
    back: 'Retour à l’accueil',
  },
};

export type Content = typeof fr;
