/**
 * CATALOGUE des master prompts. L'acheteur en choisit 2 sur la page /merci.
 *  - questions : posées seulement si le type est choisi (id préfixé par le type)
 *  - brief     : cadre d'expert transmis à l'agent qui rédige le master prompt (jamais affiché au client)
 */
type L = { fr: string; en: string };
export type PromptQuestion = { id: string; label: L; hint?: L; example?: L; required?: boolean; min?: number };
export type PromptType = {
  id: string;
  name: L;
  tagline: L;
  gets: L;
  questions: PromptQuestion[];
  brief: string;
};

/**
 * Cahier des charges commun, transmis à l'agent. Un master prompt n'est pas un prompt court :
 * c'est un document de référence très long (4 000 mots minimum), qu'on colle une fois au début d'une conversation
 * ou dans les instructions d'un assistant, et qui fait travailler l'IA comme un expert qui connaît déjà l'entreprise.
 */
export const commonBrief = `Rédige chaque master prompt comme un document de référence EXTRÊMEMENT LONG et détaillé : au minimum 4 000 mots (environ 25 000 caractères), idéalement 5 000 à 7 000. Ce n'est pas un prompt court : c'est le dossier complet qu'un expert lirait avant de travailler pour cette personne. Écris-le dans la langue du client, en tutoyant l'IA, en texte brut avec des titres numérotés repérables ("## 1. RÔLE"), sans emoji, prêt à coller tel quel. Chaque phrase doit être impossible à reproduire pour une autre entreprise : noms, chiffres, prix, expressions du client partout. Ne résume jamais : développe, donne des étapes, des cas, des exemples complets.

Sections obligatoires, dans cet ordre :
0. Comment lire ce document : l'IA lit tout avant de répondre, ordre de priorité (règles, voix, méthode, exemples), ce qu'elle fait quand deux consignes se contredisent, comment remplir les [CROCHETS].
1. Rôle et expertise : un expert nommé précisément (métier, années d'expérience, spécialité, manière de penser), ce qu'il fait et ne fait pas.
2. Mission et objectifs : 3 à 6 objectifs mesurables, comment on juge qu'une réponse est réussie.
3. Contexte de l'entreprise : activité, histoire, offres avec prix, chiffres, différenciation, concurrents cités, situation actuelle, ce qui marche et ce qui bloque.
4. Clients : 2 à 3 personas détaillés (situation, mots employés, peurs, déclencheurs d'achat), parcours d'achat, toutes les objections du client avec la réponse à donner à chacune.
5. Identité de marque et voix (la section la plus travaillée, 600 mots minimum) : l'IA doit comprendre qui parle avant de savoir quoi dire. Écris :
   - la personnalité en 3 adjectifs, et les 3 adjectifs que la marque n'est jamais ;
   - les valeurs et la conviction qui la fait agir ;
   - la direction artistique : univers, ambiance, références, couleurs et style visuel quand le client les donne, et ce que cela implique pour l'écriture (rythme, images, niveau de détail) ;
   - le ton et ses variations selon la situation (accueil, explication, réclamation, relance, annonce, mauvaise nouvelle) ;
   - tutoiement ou vouvoiement, longueur des phrases, ponctuation, emojis, majuscules, humour ou non ;
   - le vocabulaire : 15 mots ou expressions à employer, 15 à bannir, avec la raison ;
   - 5 paires "dit comme ça / jamais comme ça", réécrites à partir des textes du client ;
   - un portrait d'écriture : comment cette personne ouvre un message, développe, conclut ;
   - une règle de repli : si l'IA hésite sur le ton, elle relit cette section avant de répondre.
   Si le client donne peu d'éléments, déduis la voix de ses textes, de son site et de son LinkedIn, et signale-le entre crochets pour confirmation.
6. Méthode d'expert du type choisi : les cadres de référence expliqués en étapes concrètes, appliqués à cette entreprise (pas de théorie générale).
7. Bibliothèque de tâches : pour chaque tâche demandée par le client, une fiche avec déclencheur, informations à demander, étapes, format de sortie et un exemple complet.
8. Gabarits prêts à l'emploi : 8 à 12 modèles complets (messages, e-mails, scripts, plans) avec les champs variables entre crochets.
9. Exemples de réponses complètes : au moins 5, du plus simple au plus délicat, rédigés exactement dans la voix du client.
10. Règles et limites : ce que l'IA ne fait jamais, ce qu'elle ne promet pas, cas limites, quand elle s'arrête et passe la main au client, confidentialité.
11. Questions préalables : les informations à demander avant de répondre si elles manquent, par type de tâche, et comment poser ces questions sans lasser.
12. Format de sortie : structure exacte des réponses (titres, longueur, listes), version courte puis version longue, comment signaler les doutes.
13. Contrôle qualité : une liste de 10 vérifications que l'IA applique avant d'envoyer, dont une relecture de la voix de marque.
14. Mémoire et itération : comment l'IA garde le contexte dans la conversation, comment elle propose des variantes, comment le client la corrige et comment elle intègre la correction.
15. Lecture du site et de LinkedIn : si un site ou un LinkedIn est fourni, lis-le (message, structure, preuves, ton) et utilise-le pour affiner le contexte, la voix et les exemples des sections ci-dessus. Jamais d'invention : si une adresse n'est pas consultable, dis-le entre crochets. En complément, offre un petit BONUS : une courte analyse et 3 à 5 recommandations concrètes (ce que le client pourrait changer sur son site ou son LinkedIn pour mieux porter sa marque), dans le champ "recommandations". Reste bref, précis et bienveillant. Si aucune adresse n'est fournie ou consultable, base-toi sur les réponses et signale-le.

Termine chaque document par un mode d'emploi en 3 étapes (où coller, quoi remplacer entre crochets, comment affiner).`;

/** Forme du JSON que l'agent renvoie à /api/agent-result (clé "result"). */
export const outputSchema = `{
  "kind": "prompt",
  "resume": "2 à 3 phrases : ce que contiennent les 2 master prompts",
  "prompts": [
    {
      "id": "sales",
      "nom": "Vente",
      "titre": "Master prompt Vente de <nom de l'entreprise>",
      "intro": "Ce que fait ce master prompt, en 3 phrases",
      "fiche": [{ "t": "Personnalité", "d": "..." }, { "t": "Valeurs", "d": "..." }, { "t": "Ton", "d": "..." }, { "t": "À employer", "d": "..." }, { "t": "À bannir", "d": "..." }, { "t": "Univers et direction artistique", "d": "..." }],
      "texte": "LE MASTER PROMPT COMPLET (4 000 mots minimum, texte brut)",
      "recommandations": [{ "t": "titre court", "d": "conseil issu de l'analyse du site et de LinkedIn" }]   // le bonus offert : 3 à 5 conseils courts
    }
  ]
}`;

export const promptTypes: PromptType[] = [
  {
    id: 'sales',
    name: { fr: 'Vente', en: 'Sales' },
    tagline: { fr: 'Prospecter, relancer, répondre aux objections, conclure.', en: 'Prospect, follow up, handle objections, close.' },
    gets: { fr: 'Un directeur commercial qui rédige vos messages de prospection, relances, réponses aux objections et propositions.', en: 'A sales director who writes your outreach, follow-ups, objection replies and proposals.' },
    questions: [
      { id: 'sales_process', label: { fr: 'Comment se passe une vente, du premier contact au paiement ?', en: 'How does a sale go, from first contact to payment?' }, hint: { fr: 'Les étapes, la durée moyenne, qui décide.', en: 'The steps, the average length, who decides.' }, example: { fr: 'Exemple : demande par formulaire, appel de 20 min, devis sous 48 h, relance à J+3 et J+7, signature en moyenne après 12 jours.', en: 'Example: form enquiry, 20-minute call, quote within 48 h, follow-up at day 3 and day 7, signed after 12 days on average.' }, required: true, min: 100 },
      { id: 'sales_objections', label: { fr: 'Les 3 objections que vous entendez le plus, et ce que vous répondez aujourd’hui', en: 'The 3 objections you hear most, and what you answer today' }, example: { fr: 'Exemple : « trop cher » → je montre le coût d’un chantier retardé ; « je réfléchis » → je propose un point de 10 min jeudi.', en: 'Example: “too expensive” → I show the cost of a delayed job; “I will think about it” → I offer a 10-minute check-in on Thursday.' }, required: true, min: 120 },
      { id: 'sales_proof', label: { fr: 'Vos preuves : résultats, chiffres, avis, références', en: 'Your proof: results, numbers, reviews, references' }, example: { fr: 'Exemple : 38 clients en 2 ans, 4,9/5 sur Google, un cabinet passé de 6 à 14 rendez-vous par mois.', en: 'Example: 38 clients in 2 years, 4.9/5 on Google, one firm went from 6 to 14 appointments a month.' }, min: 60 },
      { id: 'sales_goal', label: { fr: 'Votre objectif de vente et ce qui vous bloque', en: 'Your sales goal and what blocks you' }, example: { fr: 'Exemple : passer de 4 à 8 nouveaux clients par mois ; je ne relance pas assez et je baisse mes prix trop vite.', en: 'Example: go from 4 to 8 new clients a month; I do not follow up enough and I cut my prices too fast.' }, min: 60 },
    ],
    brief: `Type VENTE. Méthode : qualifier avec BANT (budget, autorité, besoin, délai) et SPIN (situation, problème, implication, bénéfice) ; traiter les objections avec LAER (écouter, reconnaître, explorer, répondre) ; relancer en 3 touches à valeur ajoutée, jamais "je me permets de relancer". Fournis des modèles de message de prospection (accroche personnalisée, 1 preuve, 1 appel à l'action unique), une grille de réponse par objection citée par le client, une proposition en 3 blocs (problème, solution, preuve et prix), et la règle de ne jamais baisser un prix sans contrepartie. Les mots et les chiffres du client remplacent tout exemple générique.`,
  },
  {
    id: 'marketing',
    name: { fr: 'Marketing', en: 'Marketing' },
    tagline: { fr: 'Positionnement, offres, campagnes, e-mails, pages de vente.', en: 'Positioning, offers, campaigns, emails, sales pages.' },
    gets: { fr: 'Un directeur marketing qui affine votre message, construit vos campagnes et écrit vos pages et e-mails.', en: 'A marketing director who sharpens your message, builds campaigns and writes your pages and emails.' },
    questions: [
      { id: 'marketing_position', label: { fr: 'Pourquoi vous plutôt qu’un concurrent ?', en: 'Why you rather than a competitor?' }, hint: { fr: 'Citez 2 ou 3 concurrents et ce qui vous distingue vraiment.', en: 'Name 2 or 3 competitors and what truly sets you apart.' }, example: { fr: 'Exemple : face à X et Y, je suis la seule à suivre les clientes 6 mois après le programme, et je ne vends pas de compléments.', en: 'Example: against X and Y, I am the only one following clients 6 months after the programme, and I do not sell supplements.' }, required: true, min: 100 },
      { id: 'marketing_channels', label: { fr: 'Vos canaux actuels et ce qu’ils rapportent', en: 'Your current channels and what they bring' }, example: { fr: 'Exemple : Instagram 3 fois par semaine (peu de demandes), newsletter de 420 abonnés (2 ventes par envoi), pas de publicité.', en: 'Example: Instagram 3 times a week (few enquiries), newsletter of 420 subscribers (2 sales per send), no ads.' }, required: true, min: 80 },
      { id: 'marketing_offer', label: { fr: 'L’offre que vous voulez mettre en avant en priorité', en: 'The offer you want to push first' }, example: { fr: 'Exemple : mon programme de 12 semaines à 450 €, pour la rentrée, 20 places.', en: 'Example: my 12-week programme at €450, for the autumn, 20 places.' }, required: true, min: 60 },
      { id: 'marketing_budget', label: { fr: 'Budget et temps disponibles par mois', en: 'Budget and time available per month' }, example: { fr: 'Exemple : 150 € de publicité, 5 heures de contenu par semaine.', en: 'Example: €150 of ads, 5 hours of content a week.' } },
    ],
    brief: `Type MARKETING. Méthode : positionnement en une phrase (pour qui, quel problème, quelle promesse, pourquoi croire), jobs-to-be-done pour comprendre pourquoi on achète, formules PAS (problème, agitation, solution) et AIDA pour les textes, promesse unique plus preuve plus appel à l'action. Fournis un calendrier de campagne sur 4 semaines avec un objectif mesurable par canal, des séquences d'e-mails (accueil en 3 messages, relance panier ou lead), la structure d'une page de vente en 9 blocs, des tests A/B à lancer et les 3 indicateurs à suivre (coût par lead, taux de conversion, valeur client). Tiens compte du budget et du temps réels indiqués.`,
  },
  {
    id: 'seo',
    name: { fr: 'SEO', en: 'SEO' },
    tagline: { fr: 'Mots-clés, articles, pages locales, fiche Google, maillage.', en: 'Keywords, articles, local pages, Google listing, internal links.' },
    gets: { fr: 'Un consultant SEO qui choisit vos sujets, rédige des articles qui se classent et optimise vos pages.', en: 'An SEO consultant who picks your topics, writes articles that rank and optimises your pages.' },
    questions: [
      { id: 'seo_site', label: { fr: 'Votre site : adresse, outil de création et pages principales', en: 'Your site: address, builder and main pages' }, example: { fr: 'Exemple : monsite.fr sur WordPress, 6 pages (accueil, 3 services, blog, contact), 4 articles publiés.', en: 'Example: mysite.com on WordPress, 6 pages (home, 3 services, blog, contact), 4 articles published.' }, required: true, min: 60 },
      { id: 'seo_searches', label: { fr: 'Les recherches Google sur lesquelles vous voulez apparaître', en: 'The Google searches you want to appear on' }, hint: { fr: 'Ce que tape un client qui a besoin de vous, y compris la ville si vous êtes local.', en: 'What a customer who needs you types, including the city if you are local.' }, example: { fr: 'Exemple : « coach nutrition Lyon », « perdre du poids sans régime », « diététicienne Lyon 6 ».', en: 'Example: “nutrition coach Lyon”, “lose weight without dieting”, “dietitian Lyon”.' }, required: true, min: 60 },
      { id: 'seo_competitors', label: { fr: 'Les 2 ou 3 sites qui sont devant vous sur Google', en: 'The 2 or 3 sites ranking ahead of you on Google' }, example: { fr: 'Exemple : cabinet-x.fr, blog-y.com.', en: 'Example: firm-x.com, blog-y.com.' } },
      { id: 'seo_expertise', label: { fr: 'Ce que vous savez que les autres ne disent pas', en: 'What you know that others do not say' }, hint: { fr: 'Votre expérience réelle, des cas, des chiffres : Google valorise l’expertise vécue.', en: 'Your real experience, cases, numbers: Google rewards lived expertise.' }, example: { fr: 'Exemple : 120 bilans réalisés, le piège le plus fréquent est de supprimer les féculents le soir.', en: 'Example: 120 assessments done, the most common trap is cutting starches in the evening.' }, min: 80 },
    ],
    brief: `Type SEO. Méthode : intention de recherche d'abord (informationnelle, commerciale, transactionnelle, locale), clusters thématiques avec une page pilier et des articles satellites reliés, critères E-E-A-T (expérience, expertise, autorité, fiabilité) injectés par le vécu du client. Fournis un plan de 10 sujets priorisés par intention et difficulté, un gabarit d'article (titre de moins de 60 caractères, méta-description de moins de 155, plan H2 et H3, réponse directe en tête, FAQ, liens internes et sources), une checklist de page (balises, images, maillage, données structurées), la marche à suivre de la fiche Google Business pour le local, et la règle de ne jamais inventer un chiffre ou une source. L'IA propose, le client valide les faits.`,
  },
  {
    id: 'content',
    name: { fr: 'Création de contenu', en: 'Content creation' },
    tagline: { fr: 'Publications, scripts vidéo, newsletters, recyclage d’un contenu.', en: 'Posts, video scripts, newsletters, repurposing.' },
    gets: { fr: 'Un rédacteur en chef qui écrit dans votre voix, de l’idée à la publication, sans ton générique d’IA.', en: 'An editor-in-chief who writes in your voice, from idea to publication, with no generic AI tone.' },
    questions: [
      { id: 'content_platforms', label: { fr: 'Où publiez-vous et à quel rythme ?', en: 'Where do you publish and how often?' }, example: { fr: 'Exemple : Instagram 3 fois par semaine, LinkedIn 1 fois, une newsletter par mois.', en: 'Example: Instagram 3 times a week, LinkedIn once, one newsletter a month.' }, required: true, min: 40 },
      { id: 'content_pillars', label: { fr: 'Les 3 sujets dont vous parlez le mieux', en: 'The 3 topics you talk about best' }, example: { fr: 'Exemple : la nutrition sans régime, les coulisses de mon cabinet, les erreurs de mes clientes.', en: 'Example: nutrition without dieting, behind the scenes of my practice, my clients’ mistakes.' }, required: true, min: 60 },
      { id: 'content_best', label: { fr: 'Votre meilleur contenu, et pourquoi il a marché', en: 'Your best content, and why it worked' }, example: { fr: 'Exemple : un carrousel « 5 erreurs du petit déjeuner » (1 200 enregistrements), parce qu’il contredisait une idée reçue.', en: 'Example: a “5 breakfast mistakes” carousel (1,200 saves), because it challenged a common belief.' }, min: 60 },
      { id: 'content_style', label: { fr: 'Formats que vous aimez ou refusez', en: 'Formats you like or refuse' }, example: { fr: 'Exemple : j’aime les carrousels et les textes longs ; je refuse les vidéos de danse et les tendances.', en: 'Example: I like carousels and long texts; I refuse dance videos and trends.' } },
    ],
    brief: `Type CRÉATION DE CONTENU. Méthode : 3 piliers éditoriaux issus du client, accroche en moins de 12 mots (curiosité, contradiction, chiffre ou histoire), structure en 3 temps (accroche, développement par un exemple concret, appel à l'action unique), recyclage d'une idée en 5 formats (carrousel, texte long, script de 30 secondes, e-mail, story). Fournis un générateur d'idées (10 sujets à partir d'une question client), des gabarits par plateforme citée, un calendrier de 4 semaines au rythme réel du client, une liste d'expressions typiques d'IA à bannir ("dans un monde où", "plongeons", "il est essentiel de") et la consigne de reproduire le rythme des textes fournis. Chaque proposition inclut 3 variantes d'accroche.`,
  },
  {
    id: 'management',
    name: { fr: 'Direction et management', en: 'Leadership and management' },
    tagline: { fr: 'Décider, prioriser, déléguer, animer une équipe, préparer ses réunions.', en: 'Decide, prioritise, delegate, lead a team, prepare meetings.' },
    gets: { fr: 'Un bras droit de dirigeant qui structure vos décisions, vos objectifs, vos entretiens et vos points d’équipe.', en: 'A right-hand to the founder who structures your decisions, goals, one-to-ones and team meetings.' },
    questions: [
      { id: 'management_team', label: { fr: 'Votre équipe et votre rôle', en: 'Your team and your role' }, example: { fr: 'Exemple : je dirige 6 personnes (2 commerciaux, 3 techniciens, 1 assistante). Je décide de tout, je voudrais déléguer le planning.', en: 'Example: I lead 6 people (2 sales, 3 technicians, 1 assistant). I decide everything and want to delegate scheduling.' }, required: true, min: 80 },
      { id: 'management_issues', label: { fr: 'Ce qui vous prend le plus d’énergie en ce moment', en: 'What drains most of your energy right now' }, example: { fr: 'Exemple : arbitrer entre urgences, relancer les retards, annoncer des décisions difficiles.', en: 'Example: arbitrating between urgencies, chasing delays, announcing hard decisions.' }, required: true, min: 80 },
      { id: 'management_rituals', label: { fr: 'Vos réunions et rituels actuels', en: 'Your current meetings and rituals' }, example: { fr: 'Exemple : point d’équipe le lundi 45 min, aucun entretien individuel, pas d’objectifs écrits.', en: 'Example: Monday team meeting 45 min, no one-to-ones, no written goals.' } },
      { id: 'management_goals', label: { fr: 'Vos 3 priorités des 6 prochains mois', en: 'Your 3 priorities for the next 6 months' }, example: { fr: 'Exemple : recruter un chef d’équipe, passer à 400 000 € de chiffre d’affaires, réduire les retards de 30 %.', en: 'Example: hire a team lead, reach €400,000 revenue, cut delays by 30%.' }, min: 60 },
    ],
    brief: `Type DIRECTION ET MANAGEMENT. Méthode : décisions par mémo (contexte, options avec avantages et risques, recommandation, ce qui ferait changer d'avis), OKR (un objectif, 3 résultats mesurables), matrice d'Eisenhower et règle des 3 priorités, délégation avec RACI et niveaux d'autonomie, retours en SBI (situation, comportement, impact), entretien individuel en 5 questions, réunion avec ordre du jour, décisions et propriétaire de chaque action. Fournis des modèles prêts à l'emploi pour chacun, adaptés à la taille réelle de l'équipe, et la règle que l'IA conseille mais ne tranche jamais seule une décision touchant une personne (recrutement, licenciement, rémunération).`,
  },
  {
    id: 'support',
    name: { fr: 'Service client', en: 'Customer support' },
    tagline: { fr: 'Répondre aux clients, gérer les réclamations, faire une FAQ.', en: 'Answer customers, handle complaints, build a FAQ.' },
    gets: { fr: 'Un responsable relation client qui répond avec votre voix, apaise les cas difficiles et sait quand vous passer la main.', en: 'A head of customer care who answers in your voice, calms difficult cases and knows when to hand over to you.' },
    questions: [
      { id: 'support_requests', label: { fr: 'Les 5 demandes que vous recevez le plus souvent', en: 'The 5 requests you receive most' }, example: { fr: 'Exemple : tarifs, disponibilités, report de rendez-vous, facture, « est-ce adapté à moi ? ».', en: 'Example: prices, availability, rescheduling, invoice, “is it right for me?”.' }, required: true, min: 80 },
      { id: 'support_policies', label: { fr: 'Vos règles : annulation, remboursement, délais, garanties', en: 'Your rules: cancellation, refund, timing, guarantees' }, example: { fr: 'Exemple : annulation gratuite jusqu’à 48 h avant, pas de remboursement après le 2e cours, réponse sous 24 h ouvrées.', en: 'Example: free cancellation up to 48 h before, no refund after the 2nd class, reply within 24 working hours.' }, required: true, min: 80 },
      { id: 'support_hard', label: { fr: 'Un cas difficile que vous avez eu, et comment vous l’avez géré', en: 'A difficult case you had, and how you handled it' }, example: { fr: 'Exemple : une cliente furieuse d’un retard ; j’ai reconnu l’erreur, proposé une séance offerte, elle est restée.', en: 'Example: a client angry about a delay; I owned the mistake, offered a free session, she stayed.' }, min: 80 },
      { id: 'support_escalate', label: { fr: 'Quand l’IA doit vous passer la main', en: 'When the AI must hand over to you' }, example: { fr: 'Exemple : toute demande de remboursement, toute menace d’avis négatif, tout sujet médical.', en: 'Example: any refund request, any threat of a bad review, any medical topic.' }, min: 60 },
    ],
    brief: `Type SERVICE CLIENT. Méthode : accueillir, reformuler le problème, répondre, proposer la suite (modèle HEARD pour les réclamations : écouter, empathiser, s'excuser si fondé, résoudre, diagnostiquer la cause). Fournis une réponse type pour chacune des demandes citées, une version courte (chat) et une version longue (e-mail), un arbre de décision pour les cas de réclamation, les règles de l'entreprise appliquées à la lettre sans jamais en inventer, une liste de situations où l'IA s'arrête et prévient le client qu'une personne reprend la main sous un délai précis, et une base de 10 questions fréquentes prêtes à publier. Aucun engagement de remboursement ou de geste commercial sans règle écrite.`,
  },
  {
    id: 'assistant',
    name: { fr: 'Assistant administratif', en: 'Executive assistant' },
    tagline: { fr: 'E-mails, comptes rendus, devis, organisation, tâches répétitives.', en: 'Emails, minutes, quotes, organisation, repetitive tasks.' },
    gets: { fr: 'Un assistant de direction qui trie, rédige et prépare tout ce qui vous fait perdre du temps chaque semaine.', en: 'An executive assistant who sorts, drafts and prepares everything that costs you time each week.' },
    questions: [
      { id: 'assistant_tasks', label: { fr: 'Les tâches qui vous prennent le plus de temps chaque semaine', en: 'The tasks that take you the most time each week' }, example: { fr: 'Exemple : répondre aux e-mails (6 h), faire les devis (3 h), les comptes rendus de rendez-vous (2 h), la facturation (2 h).', en: 'Example: answering emails (6 h), quotes (3 h), meeting minutes (2 h), invoicing (2 h).' }, required: true, min: 80 },
      { id: 'assistant_docs', label: { fr: 'Les documents que vous refaites sans cesse', en: 'The documents you keep redoing' }, example: { fr: 'Exemple : devis de 3 types, e-mail de bienvenue, compte rendu de séance, contrat simple.', en: 'Example: 3 types of quote, welcome email, session report, simple contract.' }, required: true, min: 60 },
      { id: 'assistant_tools', label: { fr: 'Les outils que vous utilisez', en: 'The tools you use' }, example: { fr: 'Exemple : Gmail, Google Agenda, Excel, un outil de facturation.', en: 'Example: Gmail, Google Calendar, Excel, an invoicing tool.' } },
      { id: 'assistant_rules', label: { fr: 'Ce qu’elle peut décider seule et ce qu’elle doit vous soumettre', en: 'What it can decide alone and what it must submit to you' }, example: { fr: 'Exemple : elle prépare les brouillons, mais je valide tout ce qui contient un prix ou un engagement.', en: 'Example: it prepares drafts, but I approve anything with a price or a commitment.' }, min: 60 },
    ],
    brief: `Type ASSISTANT ADMINISTRATIF. Méthode : tri des e-mails en 4 catégories (répondre aujourd'hui, déléguer, planifier, archiver), réponse en 3 phrases maximum quand c'est possible, comptes rendus au format décisions, actions, responsable, échéance, devis à partir d'un gabarit avec champs entre crochets, préparation d'un rendez-vous (qui, historique, objectif, 3 questions). Fournis des modèles prêts à l'emploi pour chaque tâche et document cités par le client, une routine hebdomadaire (rituel du lundi et du vendredi), des consignes de confidentialité (ne jamais redemander des données déjà fournies, ne rien envoyer sans validation) et des instructions de brouillon : l'IA prépare, le client valide et envoie.`,
  },
];

export const promptTypeIds = promptTypes.map((t) => t.id);
export const PICK = 2;
