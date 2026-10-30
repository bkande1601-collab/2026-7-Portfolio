/**
 * TEXTES, FRANÇAIS.
 * Astuce : un mot entre *astérisques* s'affiche en violet (accent).
 * Les prix et horaires ne sont PAS ici : voir src/config/site.ts.
 * La version anglaise est dans en.ts (mêmes clés).
 */
export const fr = {
  lang: 'fr' as 'fr' | 'en',
  htmlLang: 'fr',
  locale: 'fr_FR',

  meta: {
    title: 'Binta Kande, automatisations, agents IA et marketing digital',
    description:
      'Je conçois des automatisations et des agents IA pour les entreprises, et je mets en place leur marketing digital : publicités, webinaires, réseaux sociaux.',
  },

  nav: {
    home: 'Accueil',
    marketing: 'Marketing & contenu',
    automations: 'Automatisations & IA',
    products: 'Produits digitaux',
    offers: 'Tarifs',
    journey: 'Parcours',
    faq: 'FAQ',
    sub: {
      content: 'Contenu pour les réseaux',
      webinars: 'Webinaires',
      agents: 'Agents IA',
      systems: 'Systèmes et outils internes',
      diagnostic: 'Diagnostic IA',
      prompt: 'Prompt maître',
    },
    more: 'Voir le détail',
    back: 'Retour',
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
      eyebrow: 'Automatisations, agents IA et marketing digital',
      title: 'Des automatisations et du marketing qui *tournent* vraiment.',
      sub: "Je construis des agents IA et des automatisations pour les entreprises, et je mets en place leur marketing digital : publicités, webinaires, réseaux sociaux. Des systèmes en production, pas des démos.",
      credential: 'MSc IA & Data',
      videoLabel: 'Vidéo motion design',
      videoPending: 'Ma vidéo arrive ici',
      soundOn: 'Son activé',
      soundOff: 'Activer le son',
    },
    skills: [
      'Agents IA',
      'Automatisation de process',
      'Marketing digital',
      'Social media management',
      'Publicités Meta',
      'Webinaires',
      'Automatisations WhatsApp',
      'Landing pages',
      'Assistants IA sur vos documents',
      'Plateformes internes',
      'Reporting data',
      'Chief of Staff',
    ],
    toolsTitle: 'Ce que j’utilise tous les jours',

    beforeAfter: {
      kicker: 'Ce qui change',
      title: 'Le même lundi matin, *avant* et après.',
      beforeLabel: 'Avant',
      afterLabel: 'Après',
      before: [
        'Une demande arrive par e-mail',
        'On la recopie dans 3 outils',
        'On relance, on oublie, on retrouve',
        'Le reporting part le jeudi, à la main',
      ],
      after: [
        'Une demande arrive',
        'L’automatisation la route et la classe',
        "L'agent IA lit, rédige, décide",
        'Notion, HubSpot et Agenda à jour, rapport automatique',
      ],
      caption: 'Moins de copier-coller, plus de temps pour ce qui demande vraiment quelqu’un.',
    },

    platform: {
      kicker: 'La preuve, en production',
      title: "J'ai construit *ma propre* plateforme. Elle tourne tous les jours.",
      text: "Projets, messagerie, to-do synchronisée avec Notion, OKR, arrivées et départs, Google Agenda, et un assistant IA qui connaît les documents de l'entreprise. Conçue et développée seule, chiffrée, bilingue.",
      modules: ['Projets', 'Messagerie', 'To-do · Notion', 'OKR', 'Onboarding & départs', 'Agenda', 'Assistant IA'],
      chat: {
        title: 'Assistant IA',
        q: 'Quelle est la procédure quand un collaborateur quitte l’entreprise ?',
        a: '3 étapes : retirer les accès le dernier jour, récupérer le matériel, puis lancer l’entretien de départ. Je peux créer les tâches dans la to-do tout de suite.',
        src: 'Sources : Procédure départs v3 · Charte IT',
        lock: 'Chiffré AES-256-GCM',
      },
    },

    paths: {
      kicker: 'Que cherchez-vous ?',
      title: '3 façons de *travailler* ensemble.',
      from: 'dès',
      items: [
        {
          slug: 'marketing',
          name: 'Marketing & contenu',
          line: 'Du contenu pour vos réseaux sociaux, créé et publié pour vous. Les webinaires aussi.',
          price: 'marketing',
        },
        {
          slug: 'automations',
          name: 'Automatisations & IA',
          line: 'Moins de tâches répétitives, des agents IA qui connaissent votre business.',
          price: 'agent',
        },
        {
          slug: 'products',
          name: 'Produits digitaux',
          line: 'Un diagnostic IA de votre business et un prompt maître sur mesure, à acheter en ligne.',
          price: 'diagnostic',
        },
      ],
    },

    how: {
      kicker: 'Comment ça se passe',
      title: 'Simple, du premier clic à la livraison.',
      steps: [
        { t: 'Vous choisissez', d: 'Un produit à acheter, ou un échange de 30 minutes.' },
        { t: 'Je cadre avec vous', d: 'Un formulaire ou un call, pour bien comprendre votre besoin.' },
        { t: 'Je livre', d: 'Vous recevez le résultat, et on décide de la suite si vous le voulez.' },
      ],
    },

    who: {
      kicker: 'Qui je suis',
      title: 'Binta Kande, *Chief of Staff* et freelance.',
      text: 'Je pilote les opérations de Proplyd Productions et WLFG Consulting. Avant, j’ai été social media manager et chargée de marketing digital. Mon MSc en IA a fait le reste : je construis moi-même les outils que je vends.',
      link: 'Lire mon parcours',
      photoAlt: 'Portrait souriant de Binta Kande',
    },

    offersTitle: 'Une échelle simple, du premier pas au système complet',
    offersLink: 'Voir le détail des offres',

    lab: {
      kicker: 'Dans le labo',
      title: '3 chantiers *en cours*.',
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

    finalTitle: 'Dites-moi ce que vous *cherchez*.',
    finalText: '30 minutes pour mettre à plat votre besoin : du contenu, une automatisation ou un agent IA.',
  },

  automations: {
    hero: {
      kicker: 'Automatisations & IA',
      title: 'Je retire le travail *répétitif* de votre équipe.',
      sub: "Des automatisations sur mesure, des agents IA branchés sur vos outils et vos documents, des outils internes sur mesure. C'est mon cœur de métier.",
    },
    overview: {
      kicker: 'Deux services',
      title: 'Un agent, ou un *système* complet.',
      items: [
        {
          name: 'Agents IA',
          line: 'Un assistant qui connaît vos documents, ou un agent qui fait une tâche précise pour vous.',
          slug: 'automations/agents',
        },
        {
          name: 'Systèmes et outils internes',
          line: 'Une plateforme sur mesure qui parle à vos outils, pour passer du manuel à l’automatique.',
          slug: 'automations/systems',
        },
      ],
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
      a: '45 jours fin de mois, sauf accord écrit. 2 clients ont une clause à 60 jours.',
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
    finalText: '30 minutes, un process, une première piste chiffrée.',
  },

  marketing: {
    hero: {
      kicker: 'Marketing & contenu',
      title: 'Du contenu pour vos réseaux, *créé et publié* pour vous.',
      sub: 'Instagram, TikTok, LinkedIn : je définis votre ligne, je produis les visuels, les vidéos et les textes, et je vous envoie un bilan chaque semaine.',
    },
    intro: {
      title: 'Du marketing qui vous *ressemble*, de la stratégie à la publication.',
      sub: 'Réseaux sociaux ou webinaires : je m’occupe de tout, et vous gardez la main sur ce qui est publié.',
    },
    overview: {
      kicker: 'Deux services',
      title: 'Choisissez *votre* porte d’entrée.',
      items: [
        {
          name: 'Contenu pour les réseaux',
          line: 'Stratégie, création, publication et bilan chaque semaine sur Instagram, TikTok et LinkedIn.',
          slug: 'marketing/content',
        },
        {
          name: 'Webinaires',
          line: 'Publicités, landing page, WhatsApp, e-mails et slides : tout est mis en place pour votre webinaire.',
          slug: 'marketing/webinars',
        },
      ],
    },
    content: {
      kicker: 'Ce que je fais pour vos réseaux',
      title: 'Du plan éditorial au *bilan* de la semaine.',
      steps: [
        { t: 'Stratégie', d: 'Votre ligne éditoriale, après une veille sur vos concurrents' },
        { t: 'Création', d: 'Visuels, vidéos et textes qui vous ressemblent' },
        { t: 'Publication', d: 'Sur Instagram, TikTok et LinkedIn' },
        { t: 'Bilan', d: 'Portée, engagement et conversions, chaque semaine' },
      ],
      note: 'Vous gardez la main : vous validez, je publie, et vous voyez les chiffres.',
    },
    monthly: {
      kicker: 'La formule',
      name: 'Contenu au mois',
      text: 'Un rythme de publication régulier, des contenus produits pour vous et un bilan chaque semaine. Le contenu des réseaux est le cœur de cette offre.',
      from: 'dès',
      perMonth: 'par mois',
    },
    also: {
      kicker: 'Et aussi',
      items: [
        { t: 'E-mailing et CRM', d: 'Campagnes et automatisations pour fidéliser et relancer (Brevo, Klaviyo, HubSpot).' },
        { t: 'Sites qui convertissent', d: 'Sites Shopify ou Framer pensés pour transformer les visites en demandes.' },
        { t: 'Publicités Meta', d: 'Des campagnes créées et suivies pour toucher les bonnes personnes.' },
      ],
    },
    proof: {
      kicker: 'D’où vient cette expérience',
      title: 'Des réseaux sociaux au *marketing* complet.',
      items: [
        { who: 'MNGRS.AI', role: 'Social media manager', text: 'Stratégie sur 3 plateformes, production de contenus visuels et vidéo, reporting chaque semaine.' },
        { who: 'WeTalk Podcast', role: 'Podcast sur l’entrepreneuriat', text: 'Conception éditoriale, diffusion sur toutes les plateformes et branding.' },
        { who: 'La Squadra Paris', role: 'Chargée de marketing digital', text: 'E-commerce, publicité, CRM, réseaux sociaux et analytics : 7 fonctions réunies sur un seul poste.' },
        { who: 'Freelance', role: 'Depuis 2024', text: 'Sites Shopify et Framer, stratégie digitale et ateliers de networking.' },
      ],
    },
    webinars: {
      kicker: 'Aussi : les webinaires',
      title: 'Un webinaire *cadré*, de la publicité à la relance.',
      sub: 'Je mets en place tout ce qu’il faut pour que votre webinaire se déroule bien : publicités Meta, WhatsApp, e-mails, landing page et slides.',
      steps: [
        { t: 'Publicité Meta', d: 'Elle attire les bonnes personnes' },
        { t: 'Landing page', d: 'Une page, une inscription' },
        { t: 'Rappels', d: 'WhatsApp et e-mails automatiques' },
        { t: 'Webinaire', d: 'Des slides cadrées, une relance après' },
      ],
      setup: {
        tag: 'Sans publicité',
        name: 'Socle',
        text: 'Je construis tout le dispositif : landing page, e-mails aux participants, automatisations WhatsApp. Je vous guide aussi pour préparer vos slides.',
        who: 'Pour celles et ceux qui ont déjà une audience.',
      },
      plus: {
        tag: 'Avec publicité',
        name: 'Boost',
        text: 'Tout ce qui précède, plus la publicité : je crée et pilote vos campagnes Meta pour faire connaître votre webinaire.',
        who: 'Pour partir de zéro ou aller plus vite.',
      },
      quote: 'Sur devis',
      quoteNote: 'Le prix dépend de votre webinaire. Je vous le donne après notre échange.',
      promiseTitle: 'Ce que je promets, et ce que je ne promets pas.',
      yes: 'Je mets tout en place pour que votre webinaire fonctionne, avec le plus grand sérieux.',
      no: 'Je ne garantis pas un nombre de participants ni un nombre de ventes. Personne ne peut honnêtement le faire.',
      finalTitle: 'On cadre *votre webinaire* ensemble ?',
      finalText: '30 minutes pour définir l’objectif, l’audience et la formule.',
      promiseYes: 'Je promets',
      promiseNo: 'Je ne promets pas',
    },
    finalTitle: 'On parle de *vos réseaux* ?',
    finalText: '30 minutes pour définir votre objectif, vos plateformes et le bon rythme.',
  },

  products: {
    hero: {
      kicker: 'Produits digitaux',
      title: 'Votre diagnostic IA, *prêt à appliquer*.',
      sub: 'Vous répondez à quelques questions sur vous et votre business. Des agents IA que j’ai conçus analysent vos réponses, et vous recevez votre résultat par e-mail.',
    },
    how: {
      kicker: 'Comment ça marche',
      title: '3 étapes, sans rendez-vous.',
      steps: [
        { t: 'Vous payez', d: 'Paiement sécurisé sur Stripe. Je ne vois jamais votre carte.' },
        { t: 'Vous répondez', d: 'Un formulaire : qui vous êtes, votre site, votre LinkedIn, votre problème, vos objectifs.' },
        { t: 'Vous recevez', d: 'Votre résultat personnalisé, directement par e-mail.' },
      ],
    },
    items: [
      {
        key: 'diagnostic',
        slug: 'products/diagnostic',
        name: 'Diagnostic de votre business',
        line: 'Où en est votre business, ce qui vous freine, et ce que l’IA et le marketing peuvent changer pour vous.',
        gets: [
          { t: 'Une analyse de votre business', d: 'Votre activité, vos points de friction.' },
          { t: '3 pistes concrètes', d: 'Où gagner du temps ou de l’argent.' },
          { t: 'Un plan d’action', d: 'Des actions prêtes à appliquer dès la réception.' },
        ],
        cta: 'Acheter le diagnostic',
      },
      {
        key: 'prompt',
        slug: 'products/prompt',
        name: 'Prompt maître sur mesure',
        line: 'Un prompt long et précis, écrit pour vous : votre activité, vos clients, votre manière de parler.',
        gets: [
          { t: 'Un prompt maître', d: 'Adapté à votre business, pas un modèle générique.' },
          { t: 'Prêt à coller', d: 'Dans l’outil d’IA que vous utilisez déjà.' },
        ],
        cta: 'Acheter le prompt maître',
      },
    ],
    soon: 'Bientôt disponible',
    trust: [
      { t: 'Zéro modèle générique', d: 'Chaque résultat part de vos réponses.' },
      { t: 'Produit par des agents IA', d: 'Que j’ai conçus, et je vous le dis clairement.' },
      { t: 'Paiement sécurisé', d: 'Stripe gère le paiement, je ne vois pas votre carte.' },
    ],
    trustKicker: 'Ce que vous pouvez attendre',
    next: {
      kicker: 'Et après ?',
      title: 'Envie d’aller plus loin ? *Parlons-en.*',
      text: 'Si votre résultat vous donne envie de passer à l’action, on peut en discuter en 30 minutes, ou je construis l’agent ou le système pour vous.',
      linkCall: 'Réserver un échange',
      linkOffers: 'Voir les tarifs',
    },
    formations: {
      kicker: 'Formations',
      title: 'Les formations arrivent.',
      text: 'Je prépare des formations. Laissez votre e-mail dans la section « Dans le labo » de l’accueil, je vous préviens à la sortie.',
      link: 'Me prévenir',
    },
    finalTitle: 'Un doute sur le bon produit ? *Écrivez-moi.*',
    finalText: 'Dites-moi votre situation, je vous dis ce qui vous convient.',
  },

  offers: {
    hero: {
      kicker: 'Tarifs',
      title: 'Une échelle claire. *Vous* choisissez la marche.',
      sub: 'Du produit à 19 € au système complet. Chaque marche est utile seule, et prépare la suivante.',
    },
    ladderLabel: 'Échelle',
    ladder: [
      {
        key: 'diagnostic',
        name: 'Diagnostic IA',
        line: 'Votre business analysé par des agents IA, en remplissant un formulaire.',
        out: 'Une analyse, 3 pistes et un plan d’action, par e-mail.',
        href: 'products',
      },
      {
        key: 'prompt',
        name: 'Prompt maître',
        line: 'Un prompt long et précis, écrit pour vous et votre activité.',
        out: 'Prêt à coller dans votre outil d’IA.',
        href: 'products',
      },
      {
        key: 'clarity',
        name: 'Clarity Session',
        line: 'Un call de 30 minutes pour décider : diagnostic, pistes, feuille de route.',
        out: 'Ce que vous faites seul, ce qu’on automatise, ce que je fais pour vous.',
        href: 'book',
      },
      {
        key: 'agent',
        name: 'Agent IA',
        line: 'Un besoin précis, un agent livré. Une brique, pas un système complet.',
        out: 'Contenu, réponses clients, organisation interne ou assistant sur vos données.',
        href: 'automations',
      },
      {
        key: 'system',
        name: 'Système complet',
        line: 'On audite, on connecte, on automatise. Le business passe du manuel au semi-automatique.',
        out: 'Analyse globale, stack d’agents connectés, workflows optimisés.',
        href: 'automations',
      },
    ],
    from: 'dès',
    range: 'de',
    rangeTo: 'à',
    flat: 'prix fixe',
    perMonth: '/ mois',
    quote: 'Les prix des offres sur mesure sont des fourchettes. Le devis précis suit notre échange.',
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
        name: 'Marketing & contenu',
        line: 'Contenu pour vos réseaux sociaux, créé, publié et suivi chaque semaine.',
        href: 'marketing',
      },
      {
        key: null,
        name: 'Webinaires',
        line: 'Mise en place complète, avec ou sans publicité (formules Socle et Boost).',
        custom: 'Sur devis',
        href: 'marketing',
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
    finalTitle: 'Pas sûr de la marche ? *Commencez* petit.',
    finalText: 'Un diagnostic à 19 €, ou 30 minutes d’échange. Vous choisissez.',
  },

  book: {
    hero: {
      kicker: 'Réserver un audit',
      title: '30 minutes pour *mettre à plat* votre besoin.',
      sub: 'Dites-moi qui vous êtes et ce que vous cherchez. Puis choisissez un créneau en visio, ou envoyez simplement votre demande par e-mail.',
    },
    steps: ['Votre demande', 'Jour et heure', 'Confirmation'],
    mode: {
      label: 'Que souhaitez-vous ?',
      meet: 'Réserver un échange en visio',
      meetNote: '30 minutes, avec un lien Google Meet',
      mail: 'Juste m’envoyer ma demande',
      mailNote: 'Je vous réponds par e-mail',
    },
    sendMail: 'Envoyer ma demande',
    cal: {
      prev: 'Mois précédent',
      next: 'Mois suivant',
      noDays: 'Aucun jour disponible ce mois-ci.',
    },
    mailTitle: 'Demande bien reçue.',
    mailText: 'Un e-mail de confirmation vous attend. Je vous réponds vite.',
    errorPhone: 'Merci de renseigner un numéro de téléphone valide.',
    fields: {
      firstName: 'Prénom',
      lastName: 'Nom',
      phone: 'Numéro de téléphone',
      name: 'Nom',
      email: 'Adresse e-mail',
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
      { v: 'tool', t: 'Un outil interne ou une plateforme' },
      { v: 'content', t: 'Du contenu pour mes réseaux sociaux' },
      { v: 'webinar', t: 'Un webinaire' },
      { v: 'cos', t: 'Chief of Staff externalisée' },
      { v: 'other', t: 'Je ne sais pas encore' },
    ],
    budgets: [
      { v: '200-800', t: 'De 200 à 800 €' },
      { v: '800-2000', t: 'De 800 à 2 000 €' },
      { v: 'gt2000', t: 'Plus de 2 000 €' },
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
    errorFields: 'Merci de compléter prénom, nom, téléphone, e-mail et besoin.',
    weekdays: ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'],
    privacy: 'Vos réponses ne servent qu’à préparer notre échange.',
  },

  contact: {
    hero: {
      kicker: 'Envoyer un message',
      title: 'Une question, une idée ? *Écrivez-moi.*',
      sub: 'Je réponds en général sous 2 jours ouvrés. Vous recevez un accusé de réception tout de suite.',
    },
    fields: {
      firstName: 'Prénom',
      lastName: 'Nom',
      phone: 'Numéro de téléphone',
      name: 'Nom',
      email: 'Adresse e-mail',
      subject: 'Sujet',
      message: 'Message',
      messagePlaceholder: 'Dites-moi ce dont vous avez besoin.',
    },
    send: 'Envoyer le message',
    sending: 'Envoi…',
    okTitle: 'Message bien reçu.',
    okText: 'Un accusé de réception vient d’être envoyé à votre adresse. Je reviens vers vous vite.',
    err: 'L’envoi a échoué. Réessayez ou prenez rendez-vous directement.',
    invalid: 'Merci de renseigner prénom, nom, e-mail valide et message.',
    or: 'Vous préférez en parler de vive voix ?',
  },

  journey: {
    hero: {
      kicker: 'Parcours',
      title: 'D’où je viens, et *ce que j’ai bâti*.',
      sub: 'Du social media au pilotage d’entreprise, puis à l’IA : un parcours qui relie le message et la mécanique.',
    },
    photoAlt: 'Portrait de Binta Kande',
    photoNote: '',
    todo: 'À compléter',
    items: [
      {
        when: 'Nov. 2025 à aujourd’hui',
        title: 'Chief of Staff, Proplyd Productions et WLFG Consulting',
        text: 'Bras droit du CEO : priorités stratégiques et opérationnelles, OKR trimestriels, supports investisseurs, développement commercial. J’y ai conçu et déployé des automatisations et une plateforme interne.',
        todo: false,
      },
      {
        when: 'Juil. 2024 à aujourd’hui',
        title: 'Freelance',
        text: 'Sites Shopify et Framer pensés pour convertir, stratégie digitale, automatisations et agents IA. J’ai aussi créé WeTalk Podcast, un podcast sur l’entrepreneuriat, et organisé des ateliers de networking.',
        todo: false,
      },
      {
        when: 'Juil. à déc. 2025',
        title: 'Social media manager, MNGRS.AI',
        text: 'Stratégie et contenus visuels et vidéo sur Instagram, TikTok et LinkedIn, avec un reporting chaque semaine : engagement, portée, conversions.',
        todo: false,
      },
      {
        when: '2025',
        title: 'Chargée de marketing digital, La Squadra Paris',
        text: 'E-commerce, publicité, CRM, réseaux sociaux, analytics : 7 fonctions sur un poste. E-mailing et automatisations pour la fidélisation.',
        todo: false,
      },
      {
        when: '2025 à 2026',
        title: 'MSc IA appliquée au business, Eugenia School',
        text: 'Business analytics, data visualisation, Python, SQL, PowerBI, HubSpot, Dataiku, GA4.',
        todo: false,
      },
      {
        when: '2024 à 2025',
        title: 'Bachelor Chef de projets digitaux, Digital School of Paris',
        text: 'SEO, Suite Adobe, management d’équipe, Scrum.',
        todo: false,
      },
      {
        when: '2023 à 2024',
        title: 'Licence Commerce international, CNAM',
        text: 'Marketing digital, management, macroéconomie, comptabilité.',
        todo: false,
      },
    ],
    languages: 'Français, langue maternelle. Anglais, bilingue.',
    stackTitle: 'La boîte à outils',
  },

  faq: {
    hero: {
      kicker: 'FAQ',
      title: 'Les *questions* qu’on me pose le plus.',
    },
    items: [
      {
        q: 'Comment fonctionnent les produits à 19 € et 39 € ?',
        a: 'Vous payez en ligne, vous remplissez un formulaire sur vous et votre business, et vous recevez votre résultat par e-mail. Le résultat est produit par des agents IA que j’ai conçus, à partir de vos réponses.',
      },
      {
        q: 'Mes données sont-elles en sécurité ?',
        a: 'Oui. Le paiement passe par Stripe, je ne vois jamais votre carte. Vos réponses ne servent qu’à produire votre résultat. Pour les projets sur mesure, la sécurité fait partie du cahier des charges, et je travaille sous accord de confidentialité si vous le souhaitez.',
      },
      {
        q: 'Comment se passe la facturation des offres sur mesure ?',
        a: 'Agent IA et système complet : devis avec acompte au démarrage, solde à la livraison. Run, Run+ et le contenu au mois : abonnement mensuel. Les prix affichés sont des fourchettes ou des prix de départ, le devis exact suit notre échange.',
      },
      {
        q: 'Que promettez-vous pour les webinaires et le marketing ?',
        a: 'Je mets en place tout ce qu’il faut pour que ça fonctionne. Je ne garantis ni un nombre de participants, ni un nombre de ventes.',
      },
      {
        q: 'Travaillez-vous en anglais ?',
        a: 'Oui. Le site, les échanges et les documents que je livre existent en français et en anglais.',
      },
      {
        q: 'Et si une automatisation casse ?',
        a: 'Chaque automatisation journalise ce qu’elle fait et vous alerte en cas d’échec. Avec Run, je la surveille et je corrige avant que vous ne le voyiez.',
      },
    ],
    finalTitle: 'Une autre question ? *Posez-la.*',
  },

  chat: {
    open: 'Une question ?',
    title: 'Assistant de Binta',
    hello: 'Bonjour ! Je réponds à vos questions sur les offres, les prix et la façon de travailler ensemble.',
    placeholder: 'Écrivez votre question',
    send: 'Envoyer',
    close: 'Fermer',
    chips: ['Quels sont vos tarifs ?', 'Du contenu pour mes réseaux', 'Comment marche le diagnostic à 19 € ?'],
    note: 'Assistant IA, il peut se tromper. Pour un devis, réservez un échange.',
    preview: 'Mode aperçu',
    error: 'Je n’ai pas pu répondre. Écrivez-moi directement, je vous réponds vite.',
    thinking: 'Je réfléchis…',
  },

  footer: {
    tagline: 'Marketing, automatisations et agents IA.',
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
