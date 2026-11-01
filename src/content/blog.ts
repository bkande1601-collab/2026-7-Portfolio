/**
 * BLOG : conseils. Pour ajouter un article, copiez un bloc de `posts`, changez le `slug`
 * et les textes en français et en anglais.
 *
 * Une section peut avoir : un titre (`h`), des paragraphes (`p`), une liste (`list`),
 * un encadré de service (`service`, voir les clés dans `blog.services` de fr.ts et en.ts).
 * `resource` : le slug d'une ressource gratuite de src/content/resources.json (PDF envoyé par e-mail).
 */
export type Prompt = { title: string; use: string; text: string; tip?: string };
export type Section = {
  h?: string;
  p?: string[];
  list?: string[];
  service?: string;
  /** étapes numérotées */
  steps?: { t: string; d: string }[];
  /** prompts à copier, présentés comme dans un terminal */
  prompts?: Prompt[];
  /** encadré mis en avant */
  note?: { title: string; text: string };
};
export type Faq = { q: string; a: string };
export type Source = { label: string; url: string };
export type PostText = {
  tag: string;
  title: string;
  excerpt: string;
  sections: Section[];
  callTitle: string;
  callText: string;
  sources?: Source[];
  /** balise <title> si elle doit différer du titre de l'article (60 caractères environ) */
  seoTitle?: string;
  /** meta description (150 caractères environ) ; sinon l'extrait */
  description?: string;
  /** « En bref » : l'essentiel en 3 ou 4 lignes, en haut de l'article */
  takeaways?: string[];
  /** questions fréquentes (affichées et balisées pour Google) */
  faq?: Faq[];
};
export type Post = {
  slug: string;
  date: string;
  minutes: number;
  /** photo de couverture : un détourage sur fond de couleur, ou une photo entière */
  /** `src` absent : couverture typographique (aucune photo) */
  cover: { src?: string; tone: 'rouille' | 'violet' | 'marine' | 'lilas'; cutout: boolean; credit?: { label: string; url: string } };
  /** date de dernière mise à jour (sinon `date`) */
  updated?: string;
  /** image de partage (réseaux sociaux, Google) */
  ogImage?: string;
  resource: string;
  fr: PostText;
  en: PostText;
};

import { promptsPost } from './blog-prompts';

export const posts: Post[] = [
  promptsPost,
  /* ------------------------------------------------------------------ 1 */
  {
    slug: 'premieres-automatisations',
    date: '2026-10-31',
    minutes: 5,
    cover: { src: '/photos/binta-sourire-detouree.webp', tone: 'rouille', cutout: true },
    resource: 'taches-a-automatiser',
    fr: {
      tag: 'Automatisation',
      title: 'Les 5 tâches que tout entrepreneur devrait automatiser en premier',
      excerpt: 'Manque de temps, e-mails, clients, contenu : par où commencer quand on fait tout soi-même.',
      callTitle: 'Vous passez vos journées à tout faire vous-même ?',
      callText: 'Réservez un échange gratuit de 30 minutes. On regarde ensemble ce qui peut être automatisé en premier dans votre activité.',
      sections: [
        { p: ['Quand on est entrepreneur, il n’y a pas de service dédié : vous êtes à la fois commercial, communicant, comptable et assistant. Le manque de temps vient presque toujours des mêmes endroits.', 'Selon une enquête Slack et Talker Research auprès d’environ 2 000 propriétaires de petites entreprises aux États-Unis, les répondants perdent autour de 96 minutes par jour sur des tâches peu productives, soit environ 3 semaines par an. C’est un repère américain, pas une vérité pour tout le monde, mais il parle à beaucoup d’entre nous. Voici les 5 zones où je commence avec mes clients.'] },
        {
          h: 'Les 5 tâches',
          list: [
            'La boîte mail : trier, classer, répondre aux questions qui reviennent.',
            'Trouver des clients : suivre les prospects, relancer ceux qui n’ont pas répondu.',
            'Le contenu : trouver des idées, rédiger des brouillons, programmer les publications.',
            'Les factures et les relances de paiement.',
            'La prise de rendez-vous et le premier tri des demandes.',
          ],
        },
        { h: 'Et le branding ?', p: ['Le branding ne s’automatise pas, mais c’est lui qui rend le reste utile. Un message flou, automatisé, reste flou. Avant d’automatiser votre contenu ou votre prospection, prenez une heure pour écrire en 3 phrases : à qui vous parlez, ce que vous faites pour eux, ce qui vous distingue.'] },
        { h: 'Comment choisir la première', p: ['Posez-vous 3 questions. Combien de fois par semaine ? Combien de minutes à chaque fois ? Que se passe-t-il si je l’oublie ? La tâche qui vous coûte le plus de temps au total, et que vous oubliez le plus souvent, passe en premier.', 'La checklist gratuite en bas de page vous donne une grille prête à remplir, pensée pour les entrepreneurs.'] },
        { service: 'automations/agents' },
        { h: 'Un exemple concret', p: ['Une demande arrive par votre formulaire. Sans automatisation, vous la recopiez dans un tableau, vous répondez à la main et vous oubliez parfois de relancer. Avec une automatisation, la demande crée une fiche dans votre CRM, envoie un accusé de réception, vous prévient et programme une relance. Vous ne touchez à rien.'] },
        { h: 'Les erreurs que je vois le plus', list: ['Automatiser avant d’avoir clarifié son message.', 'Ne prévoir aucune alerte quand quelque chose échoue.', 'Vouloir tout faire d’un coup au lieu d’une chose à la fois.', 'Supprimer toute présence humaine là où il faut du jugement.'] },
        { h: 'Et ensuite', p: ['Mesurez le temps gagné pendant quelques semaines avant de passer à la suivante. Une automatisation qui marche vaut mieux que cinq à moitié finies.'] },
        { service: 'products/diagnostic' },
      ],
      sources: [{ label: 'Talker Research : enquête sur les pertes de temps des propriétaires de petites entreprises', url: 'https://talkerresearch.com/survey-reveals-top-time-wasters-for-entrepreneurs/' }],
    },
    en: {
      tag: 'Automation',
      title: 'The 5 tasks every entrepreneur should automate first',
      excerpt: 'Lack of time, emails, clients, content: where to start when you do everything yourself.',
      callTitle: 'Do you spend your days doing everything yourself?',
      callText: 'Book a free 30-minute call. We look together at what can be automated first in your business.',
      sections: [
        { p: ['When you are an entrepreneur, there is no dedicated department: you are the salesperson, the communicator, the accountant and the assistant. The lack of time almost always comes from the same places.', 'According to a Slack and Talker Research survey of about 2,000 small business owners in the United States, respondents lose around 96 minutes a day on unproductive tasks, about 3 weeks a year. It is an American benchmark, not a truth for everyone, but it speaks to many of us. Here are the 5 areas where I start with my clients.'] },
        {
          h: 'The 5 tasks',
          list: [
            'The inbox: sorting, filing, answering the questions that keep coming back.',
            'Finding clients: tracking prospects, following up those who have not replied.',
            'Content: finding ideas, writing drafts, scheduling posts.',
            'Invoices and payment reminders.',
            'Scheduling appointments and a first sort of requests.',
          ],
        },
        { h: 'What about branding?', p: ['Branding cannot be automated, but it is what makes the rest useful. A blurry message, automated, stays blurry. Before automating your content or your prospecting, take an hour to write in 3 sentences: who you talk to, what you do for them, what sets you apart.'] },
        { h: 'How to choose the first one', p: ['Ask yourself 3 questions. How many times a week? How many minutes each time? What happens if I forget it? The task that costs you the most time overall, and that you forget the most often, goes first.', 'The free checklist at the bottom of the page gives you a grid ready to fill in, designed for entrepreneurs.'] },
        { service: 'automations/agents' },
        { h: 'A concrete example', p: ['A request arrives through your form. Without automation, you copy it into a spreadsheet, reply by hand and sometimes forget to follow up. With automation, the request creates a record in your CRM, sends an acknowledgement, alerts you and schedules a follow-up. You touch nothing.'] },
        { h: 'The mistakes I see most often', list: ['Automating before clarifying your message.', 'Planning no alert when something fails.', 'Trying to do everything at once instead of one thing at a time.', 'Removing every human from where judgement is needed.'] },
        { h: 'What next', p: ['Measure the time saved for a few weeks before moving on to the next one. One automation that works beats five half-finished ones.'] },
        { service: 'products/diagnostic' },
      ],
      sources: [{ label: 'Talker Research: survey on small business owners’ time wasters', url: 'https://talkerresearch.com/survey-reveals-top-time-wasters-for-entrepreneurs/' }],
    },
  },

  /* ------------------------------------------------------------------ 2 */
  {
    slug: 'contenu-reseaux-regularite',
    date: '2026-10-31',
    minutes: 5,
    cover: { src: '/photos/binta-porte-detouree.webp', tone: 'violet', cutout: true },
    resource: 'calendrier-contenu',
    fr: {
      tag: 'Réseaux sociaux',
      title: 'Publier tous les jours ne suffit pas',
      excerpt: 'Ce qui fait vraiment avancer un compte : une ligne claire et un bilan chaque semaine.',
      callTitle: 'Envie que quelqu’un s’occupe de vos réseaux ?',
      callText: 'Réservez un échange gratuit de 30 minutes. On définit votre ligne, vos plateformes et le bon rythme.',
      sections: [
        { p: ['Beaucoup d’entrepreneurs publient beaucoup et voient peu de résultats. Le problème n’est presque jamais le volume. C’est le manque de ligne et de suivi. Voici les 5 points que je mets en place pour un compte, de la stratégie au bilan.'] },
        { h: '1. Une ligne éditoriale claire', p: ['Choisissez 3 thèmes au maximum, ceux sur lesquels vous voulez être reconnu. Tout ce que vous publiez doit se rattacher à l’un d’eux. Une veille sur vos concurrents aide à trouver ce qui manque sur votre marché.'] },
        { h: '2. Un rythme que vous pouvez tenir', p: ['Mieux vaut 3 bons contenus par semaine, tenus pendant des mois, que 7 contenus par semaine abandonnés au bout d’un mois. Le calendrier gratuit en bas de page vous aide à planifier 4 semaines d’un coup.'] },
        { h: '3. Plusieurs formats', list: ['La vidéo courte pour être découvert.', 'Le carrousel pour expliquer.', 'Le texte pour montrer votre expertise, surtout sur LinkedIn.', 'Les coulisses pour créer de la proximité.'] },
        { service: 'marketing/content' },
        { h: '4. Un bilan chaque semaine', p: ['Regardez la portée, l’engagement et ce que chaque contenu a fait venir. Ce qui marche, refaites-le sous un autre angle. Ce qui ne marche pas, arrêtez. C’est ce suivi, bien plus que le volume, qui fait progresser un compte.'] },
        { h: '5. Un appel à l’action', p: ['Chaque contenu doit mener quelque part : un message, une inscription, une page. Sinon il reste un joli contenu sans suite.'] },
        { h: 'Ce que je vois le plus souvent', list: ['Publier sans savoir à qui l’on parle.', 'Copier ce qui marche chez les autres sans l’adapter.', 'Ne jamais regarder les chiffres.', 'S’arrêter après 3 semaines faute de rythme réaliste.'] },
      ],
    },
    en: {
      tag: 'Social media',
      title: 'Posting every day is not enough',
      excerpt: 'What really moves an account forward: a clear line and a weekly review.',
      callTitle: 'Want someone to take care of your social media?',
      callText: 'Book a free 30-minute call. We define your line, your platforms and the right rhythm.',
      sections: [
        { p: ['Many entrepreneurs post a lot and see few results. The problem is almost never volume. It is the lack of a line and of follow-up. Here are the 5 points I set up for an account, from strategy to review.'] },
        { h: '1. A clear editorial line', p: ['Choose 3 topics at most, the ones you want to be known for. Everything you publish should connect to one of them. Watching your competitors helps you find what is missing in your market.'] },
        { h: '2. A rhythm you can keep', p: ['It is better to have 3 good pieces of content a week, kept up for months, than 7 a week given up after a month. The free calendar at the bottom of the page helps you plan 4 weeks at once.'] },
        { h: '3. Several formats', list: ['Short video to be discovered.', 'Carousels to explain.', 'Text to show your expertise, especially on LinkedIn.', 'Behind the scenes to create closeness.'] },
        { service: 'marketing/content' },
        { h: '4. A weekly review', p: ['Look at reach, engagement and what each piece brought in. What works, do again from another angle. What does not, stop. It is this follow-up, much more than volume, that makes an account grow.'] },
        { h: '5. A call to action', p: ['Every piece of content should lead somewhere: a message, a sign-up, a page. Otherwise it stays a nice piece of content with no follow-up.'] },
        { h: 'What I see most often', list: ['Posting without knowing who you are talking to.', 'Copying what works for others without adapting it.', 'Never looking at the numbers.', 'Stopping after 3 weeks for lack of a realistic rhythm.'] },
      ],
    },
  },

  /* ------------------------------------------------------------------ 3 */
  {
    slug: 'webinaire-checklist',
    date: '2026-10-31',
    minutes: 6,
    cover: { src: '/photos/binta-accueil-violet.webp', tone: 'marine', cutout: true },
    resource: 'retroplanning-webinaire',
    fr: {
      tag: 'Webinaires',
      title: 'Réussir son webinaire : ce que disent les chiffres, et la checklist',
      excerpt: 'Avant, pendant, après : ce qu’il faut avoir en place, avec des repères tirés d’études.',
      callTitle: 'Réservez un call avec moi pour bien planifier votre webinaire.',
      callText: 'Un échange gratuit de 30 minutes pour fixer l’objectif, le bon jour, la page d’inscription, les rappels et la relance. Je mets ensuite tout en place avec vous.',
      sections: [
        { p: ['Un webinaire ne se joue pas le jour J. Il se joue dans tout ce qui l’entoure. Voici d’abord ce que disent les études, puis la checklist que je vérifie à chaque fois.'] },
        {
          h: 'Ce que disent les chiffres',
          p: [
            'Selon Univid (2026), le taux moyen de présence en direct tourne autour de 49 %, et il monte avec le replay. Contrast, qui a analysé des webinaires B2B sur plusieurs plateformes, observe une médiane d’environ 41,6 %.',
            'Plusieurs études, dont celles d’Univid et de Contrast, citent le mercredi comme un jour où la présence est souvent meilleure, et la fin de matinée ou l’après-midi comme créneaux fréquents. À tester auprès de votre propre audience.',
            'Ce sont des repères, pas des promesses : ces études viennent surtout du monde anglophone et de l’éditeur de logiciels, et vos résultats dépendront de votre audience.',
          ],
        },
        { h: 'Avant', list: ['Une page d’inscription claire : un seul message, un seul bouton.', 'Des rappels automatiques par e-mail et par WhatsApp, pour que les inscrits n’oublient pas.', 'Des slides simples, une idée par slide, et un temps prévu pour les questions.'] },
        { service: 'marketing/webinars' },
        { h: 'Pendant', p: ['Annoncez le plan dès le début, tenez l’horaire, et proposez une action claire à la fin : un rendez-vous, un document, une offre.'] },
        { h: 'Après', p: ['Envoyez le replay et une relance le lendemain, avec une seule action à faire. C’est souvent là que se joue l’essentiel. Relancez aussi les inscrits qui n’étaient pas là.'] },
        { h: 'Une précision honnête', p: ['Personne ne peut garantir un nombre de participants. Le but est de réunir tout ce qui augmente vos chances, et de le mettre en place avec soin. C’est exactement ce que je fais pour mes clients.'] },
      ],
      sources: [
        { label: 'Univid : Webinar Insights 2026', url: 'https://univid.io/webinar-statistics/' },
        { label: 'Contrast : Webinar benchmarks', url: 'https://blog.getcontrast.io/webinar-benchmarks' },
      ],
    },
    en: {
      tag: 'Webinars',
      title: 'Running a good webinar: what the numbers say, and the checklist',
      excerpt: 'Before, during, after: what needs to be in place, with benchmarks from studies.',
      callTitle: 'Book a call with me to plan your webinar properly.',
      callText: 'A free 30-minute call to set the goal, the right day, the sign-up page, the reminders and the follow-up. Then I set everything up with you.',
      sections: [
        { p: ['A webinar is not decided on the day. It is decided in everything around it. First, what studies say, then the checklist I check every time.'] },
        {
          h: 'What the numbers say',
          p: [
            'According to Univid (2026), average live attendance is around 49%, and it rises with the replay. Contrast, which analysed B2B webinars across several platforms, observes a median of about 41.6%.',
            'Several studies, including those from Univid and Contrast, name Wednesday as a day when attendance is often better, and late morning or afternoon as frequent slots. Test it with your own audience.',
            'These are benchmarks, not promises: these studies come mostly from the English-speaking world and from software vendors, and your results will depend on your audience.',
          ],
        },
        { h: 'Before', list: ['A clear sign-up page: one message, one button.', 'Automatic reminders by email and WhatsApp, so that people who signed up do not forget.', 'Simple slides, one idea per slide, and time set aside for questions.'] },
        { service: 'marketing/webinars' },
        { h: 'During', p: ['Announce the plan at the start, keep to the schedule, and offer one clear action at the end: a call, a document, an offer.'] },
        { h: 'After', p: ['Send the replay and a follow-up the next day, with a single action to take. That is often where most of the result is decided. Follow up the people who signed up but were not there too.'] },
        { h: 'An honest note', p: ['No one can guarantee a number of attendees. The goal is to bring together everything that improves your chances, and to set it up with care. That is exactly what I do for my clients.'] },
      ],
      sources: [
        { label: 'Univid: Webinar Insights 2026', url: 'https://univid.io/webinar-statistics/' },
        { label: 'Contrast: Webinar benchmarks', url: 'https://blog.getcontrast.io/webinar-benchmarks' },
      ],
    },
  },

  /* ------------------------------------------------------------------ 4 */
  {
    slug: 'choisir-un-llm',
    date: '2026-10-31',
    minutes: 5,
    cover: {
      src: '/photos/llm-unsplash-milad-fakurian.webp',
      tone: 'marine',
      cutout: false,
      // photo libre de droits (licence Unsplash) : on cite l'auteur
      credit: { label: 'Photo : Milad Fakurian, Unsplash', url: 'https://unsplash.com/photos/sin5WZzF1U0' },
    },
    resource: 'choisir-un-llm',
    fr: {
      tag: 'Intelligence artificielle',
      title: 'Quel LLM choisir pour votre entreprise ?',
      excerpt: 'Les classements changent tout le temps. Voici comment décider sans vous y perdre.',
      callTitle: 'On teste ensemble sur votre cas ?',
      callText: 'Réservez un échange gratuit de 30 minutes. On choisit les bons modèles pour vos tâches, vos données et votre budget.',
      sections: [
        { p: ['Chaque semaine, un nouveau modèle prétend être le meilleur. Pour une entreprise, la vraie question est ailleurs : lequel fait le mieux mes tâches, avec mes données, à un prix raisonnable ?'] },
        {
          h: 'Les classements ne s’accordent pas',
          p: ['À la date de rédaction, plusieurs classements publics ne mettent pas le même modèle en tête. C’est normal : ils ne mesurent pas la même chose. LMArena s’appuie sur les votes d’utilisateurs. Artificial Analysis compare la qualité, la vitesse et le prix. Utilisez-les pour présélectionner 2 ou 3 modèles, pas pour trancher.'],
        },
        { h: 'Les 6 critères qui comptent vraiment', list: ['La qualité dans votre langue.', 'La justesse sur vos tâches réelles.', 'La protection de vos données.', 'Le prix pour votre usage.', 'La taille des documents que le modèle peut lire.', 'Les outils auxquels il peut se connecter.'] },
        { h: 'Le test en 4 étapes', list: ['Choisissez 5 tâches réelles : un e-mail, un résumé, une question de votre métier, une idée de contenu, un tableau à analyser.', 'Donnez exactement le même texte à 2 ou 3 modèles.', 'Notez chaque réponse de 1 à 5.', 'Ajoutez le prix, la confidentialité et les connexions, puis décidez.'] },
        { service: 'automations/agents' },
        { h: 'Un modèle, ou plusieurs ?', p: ['Beaucoup d’entreprises utilisent plusieurs modèles selon la tâche : un modèle rapide et peu cher pour trier, un modèle plus puissant pour analyser. Un agent bien conçu peut choisir le bon modèle au bon moment.'] },
        { service: 'products/prompt' },
      ],
      sources: [
        { label: 'LMArena : classement ouvert fondé sur les votes d’utilisateurs', url: 'https://lmarena.ai' },
        { label: 'Artificial Analysis : comparaison de modèles (qualité, vitesse, prix)', url: 'https://artificialanalysis.ai' },
      ],
    },
    en: {
      tag: 'Artificial intelligence',
      title: 'Which LLM should your business choose?',
      excerpt: 'Rankings keep changing. Here is how to decide without getting lost.',
      callTitle: 'Shall we test together on your case?',
      callText: 'Book a free 30-minute call. We choose the right models for your tasks, your data and your budget.',
      sections: [
        { p: ['Every week, a new model claims to be the best. For a business, the real question is elsewhere: which one does my tasks best, with my data, at a reasonable price?'] },
        {
          h: 'Rankings do not agree',
          p: ['At the time of writing, several public rankings do not put the same model first. That is normal: they do not measure the same thing. LMArena relies on user votes. Artificial Analysis compares quality, speed and price. Use them to shortlist 2 or 3 models, not to decide.'],
        },
        { h: 'The 6 criteria that really matter', list: ['Quality in your language.', 'Accuracy on your real tasks.', 'Protection of your data.', 'Price for your usage.', 'The size of the documents the model can read.', 'The tools it can connect to.'] },
        { h: 'The 4-step test', list: ['Pick 5 real tasks: an email, a summary, a question from your field, a content idea, a table to analyse.', 'Give exactly the same text to 2 or 3 models.', 'Score each answer from 1 to 5.', 'Add price, privacy and connections, then decide.'] },
        { service: 'automations/agents' },
        { h: 'One model, or several?', p: ['Many businesses use several models depending on the task: a fast, cheap model for sorting, a more powerful one for analysis. A well-designed agent can pick the right model at the right time.'] },
        { service: 'products/prompt' },
      ],
      sources: [
        { label: 'LMArena: open ranking based on user votes', url: 'https://lmarena.ai' },
        { label: 'Artificial Analysis: model comparison (quality, speed, price)', url: 'https://artificialanalysis.ai' },
      ],
    },
  },

  /* ------------------------------------------------------------------ 5 */
  {
    slug: 'prompt-maitre',
    date: '2026-10-31',
    minutes: 4,
    cover: {
      src: '/photos/prompt-unsplash-kelly-sikkema.webp',
      tone: 'lilas',
      cutout: false,
      credit: { label: 'Photo : Kelly Sikkema, Unsplash', url: 'https://unsplash.com/photos/iiaUVel-cJE' },
    },
    resource: 'modele-prompt-maitre',
    fr: {
      tag: 'Intelligence artificielle',
      title: 'Pourquoi votre assistant IA répond de façon trop générale',
      excerpt: 'La solution tient en une page : le master prompt.',
      callTitle: 'Envie d’un master prompt écrit pour vous ?',
      callText: 'Vous répondez à quelques questions, et vous recevez un prompt prêt à coller, adapté à votre activité.',
      sections: [
        { p: ['Vous posez une question à un assistant IA et la réponse est correcte, mais plate. Elle pourrait servir à n’importe qui. Ce n’est pas un défaut du modèle : il ne sait rien de vous.'] },
        { h: 'Un master prompt, c’est quoi ?', p: ['C’est la fiche de poste de votre assistant. Vous l’écrivez une fois, vous le collez au début de la conversation, et l’assistant répond ensuite comme quelqu’un qui connaît votre métier.'] },
        { h: 'Les 7 lignes à écrire', list: ['Le rôle : qui est l’assistant ?', 'Le public : à qui parle-t-il ?', 'Le ton : comment parle-t-il ?', 'La mission : que doit-il faire ?', 'Les règles : ce qu’il ne doit jamais faire.', 'Le format : comment doit-il répondre ?', 'Les exemples : 1 ou 2 réponses que vous aimez.'] },
        { h: 'Un exemple', p: ['« Tu es l’assistante de Camille, coach sportive. Tu écris à sa place sur Instagram et tu réponds aux messages. Public : des femmes qui reprennent le sport. Ton : chaleureux, direct, jamais culpabilisant. Règles : aucun conseil médical, et pour un cas particulier, propose toujours un rendez-vous. Format : phrases courtes, une idée par message. »'] },
        { service: 'products/prompt' },
        { h: 'Les erreurs à éviter', list: ['Écrire un prompt trop court.', 'Oublier de dire ce que l’assistant ne doit pas faire.', 'Ne donner aucun exemple de bonne réponse.', 'Ne jamais le tester sur des demandes réelles.'] },
      ],
    },
    en: {
      tag: 'Artificial intelligence',
      title: 'Why your AI assistant answers too generically',
      excerpt: 'The fix fits on one page: the master prompt.',
      callTitle: 'Want a master prompt written for you?',
      callText: 'You answer a few questions, and you receive a ready-to-paste prompt, adapted to your business.',
      sections: [
        { p: ['You ask an AI assistant a question and the answer is correct, but flat. It could be for anyone. That is not a flaw in the model: it knows nothing about you.'] },
        { h: 'What is a master prompt?', p: ['It is your assistant’s job description. You write it once, paste it at the start of the conversation, and the assistant then answers like someone who knows your business.'] },
        { h: 'The 7 lines to write', list: ['The role: who is the assistant?', 'The audience: who does it talk to?', 'The tone: how does it speak?', 'The mission: what must it do?', 'The rules: what it must never do.', 'The format: how must it answer?', 'The examples: 1 or 2 answers you like.'] },
        { h: 'An example', p: ['“You are Camille’s assistant, a sports coach. You write for her on Instagram and reply to messages. Audience: women getting back into sport. Tone: warm, direct, never guilt-tripping. Rules: no medical advice, and for a specific case, always offer a call. Format: short sentences, one idea per message.”'] },
        { service: 'products/prompt' },
        { h: 'Mistakes to avoid', list: ['Writing a prompt that is too short.', 'Forgetting to say what the assistant must not do.', 'Giving no example of a good answer.', 'Never testing it on real requests.'] },
      ],
    },
  },

  /* ------------------------------------------------------------------ 6 */
  {
    slug: 'securite-site',
    date: '2026-10-31',
    minutes: 4,
    cover: { src: '/photos/binta-qui-je-suis.webp', tone: 'rouille', cutout: true },
    resource: 'securite-site',
    fr: {
      tag: 'Site web',
      title: 'Votre site est-il sécurisé ? 7 points à vérifier',
      excerpt: 'Pas besoin d’être technicien pour repérer les risques les plus courants.',
      callTitle: 'Envie d’un diagnostic de sécurité de votre site ?',
      callText: 'Réservez un échange gratuit de 30 minutes. Je regarde votre site avec vous et je vous dis par où commencer.',
      sections: [
        { p: ['Beaucoup d’entrepreneurs pensent à la sécurité de leur site seulement après un problème. Or les risques les plus fréquents sont simples à repérer. Voici 7 points que je vérifie en premier.'] },
        { h: 'Les 7 points', list: ['La connexion sécurisée : le cadenas (https) doit apparaître sur toutes les pages, et le certificat ne doit pas être expiré.', 'Les mises à jour : un site ou une extension oubliée est la porte d’entrée la plus courante.', 'Les accès : un mot de passe long et unique, une double vérification, et un accès par personne.', 'Les formulaires : les données des visiteurs doivent partir de façon sécurisée.', 'Les sauvegardes : une copie récente, stockée ailleurs, et déjà testée.', 'Les extensions inutiles : ce qui n’est pas utilisé doit être supprimé.', 'Les pages légales : mentions légales, politique de confidentialité et bandeau de cookies qui permet de refuser.'] },
        { service: 'marketing/sites' },
        { h: 'Une précision honnête', p: ['Aucun site n’est invulnérable. Le but d’un diagnostic est de réduire les risques les plus courants et de savoir quoi corriger en premier. La checklist gratuite en bas de page vous donne 12 points à cocher.'] },
        { h: 'Et si je n’ai rien coché ?', p: ['Commencez par les accès et les sauvegardes : ce sont les points où une erreur coûte le plus cher. Ensuite, mettez à jour, puis nettoyez.'] },
      ],
    },
    en: {
      tag: 'Website',
      title: 'Is your website secure? 7 points to check',
      excerpt: 'You do not need to be a technician to spot the most common risks.',
      callTitle: 'Want a security diagnosis of your website?',
      callText: 'Book a free 30-minute call. I look at your site with you and tell you where to start.',
      sections: [
        { p: ['Many entrepreneurs only think about their website’s security after a problem. Yet the most frequent risks are easy to spot. Here are 7 points I check first.'] },
        { h: 'The 7 points', list: ['The secure connection: the padlock (https) must appear on every page, and the certificate must not have expired.', 'Updates: a forgotten site or plugin is the most common way in.', 'Access: a long, unique password, a second verification, and one access per person.', 'Forms: visitors’ data must be sent securely.', 'Backups: a recent copy, stored elsewhere, and already tested.', 'Unused plugins: whatever is not used should be removed.', 'Legal pages: legal notice, privacy policy and a cookie banner that lets people refuse.'] },
        { service: 'marketing/sites' },
        { h: 'An honest note', p: ['No website is invulnerable. The goal of a diagnosis is to reduce the most common risks and to know what to fix first. The free checklist at the bottom of the page gives you 12 points to tick.'] },
        { h: 'What if I ticked nothing?', p: ['Start with access and backups: those are the points where a mistake costs the most. Then update, then clean up.'] },
      ],
    },
  },

  /* ------------------------------------------------------------------ 7 */
  {
    slug: 'branding-une-page',
    date: '2026-10-31',
    minutes: 4,
    cover: { src: '/photos/binta-sourire-detouree.webp', tone: 'lilas', cutout: true },
    resource: 'brief-branding',
    fr: {
      tag: 'Branding',
      title: 'Votre branding en une page',
      excerpt: 'Avant d’automatiser quoi que ce soit, clarifiez votre message.',
      callTitle: 'Envie qu’on clarifie votre message ensemble ?',
      callText: 'Réservez un échange gratuit de 30 minutes. On met votre positionnement à plat, puis on voit comment le faire vivre.',
      sections: [
        { p: ['Beaucoup d’entrepreneurs me disent qu’ils ne savent pas quoi publier. En général, ce n’est pas un problème de contenu : c’est un message pas encore clair. Le branding, ce n’est pas un logo, c’est une réponse nette à quelques questions.'] },
        { h: 'Les 5 questions qui comptent', list: ['À qui je parle ? Une personne précise, pas « tout le monde ».', 'Quel problème je résous pour elle ?', 'Qu’est-ce que je fais concrètement ?', 'Qu’est-ce qui me distingue des autres ?', 'Comment je parle ? Chaleureux, direct, expert ?'] },
        { h: 'Une phrase de positionnement', p: ['« J’aide [qui] à [résultat] grâce à [ce que je fais]. » Relisez-la à voix haute : si un inconnu comprend, c’est bon. Sinon, simplifiez.'] },
        { service: 'marketing/content' },
        { h: 'Pourquoi le faire avant le reste', p: ['Un message flou, publié partout, reste flou. Un message clair rend vos contenus plus faciles à écrire, votre site plus lisible, et vos prompts d’IA plus justes. La ressource gratuite en bas de page vous guide en 30 minutes.'] },
      ],
    },
    en: {
      tag: 'Branding',
      title: 'Your branding on one page',
      excerpt: 'Before automating anything, clarify your message.',
      callTitle: 'Want us to clarify your message together?',
      callText: 'Book a free 30-minute call. We lay out your positioning, then see how to bring it to life.',
      sections: [
        { p: ['Many entrepreneurs tell me they do not know what to publish. Usually it is not a content problem: it is a message that is not yet clear. Branding is not a logo, it is a sharp answer to a few questions.'] },
        { h: 'The 5 questions that matter', list: ['Who do I talk to? A specific person, not “everyone”.', 'What problem do I solve for them?', 'What do I concretely do?', 'What sets me apart from others?', 'How do I speak? Warm, direct, expert?'] },
        { h: 'A positioning sentence', p: ['“I help [who] to [result] through [what I do].” Read it aloud: if a stranger understands, it works. If not, simplify.'] },
        { service: 'marketing/content' },
        { h: 'Why do it before the rest', p: ['A blurry message, published everywhere, stays blurry. A clear message makes your content easier to write, your website easier to read, and your AI prompts more accurate. The free resource at the bottom of the page guides you in 30 minutes.'] },
      ],
    },
  },

  /* ------------------------------------------------------------------ 8 */
  {
    slug: 'prospection-relances',
    date: '2026-10-31',
    minutes: 4,
    cover: {
      src: '/photos/relances-unsplash-kate-macate.webp',
      tone: 'marine',
      cutout: false,
      credit: { label: 'Photo : Kate Macate, Unsplash', url: 'https://unsplash.com/photos/xmddEHyCisc' },
    },
    resource: 'scripts-relance',
    fr: {
      tag: 'Trouver des clients',
      title: 'Prospection et relances : 6 e-mails qui ne dérangent pas',
      excerpt: 'Courts, polis, avec une seule action. Et qui partent même quand vous êtes débordé.',
      callTitle: 'Envie que vos relances partent toutes seules ?',
      callText: 'Réservez un échange gratuit de 30 minutes. On regarde comment automatiser votre suivi de prospects.',
      sections: [
        { p: ['Trouver des clients est l’un des plus gros manques de temps des entrepreneurs. Et le plus souvent, l’argent se perd dans le suivi : on envoie un message, on oublie de relancer, et la discussion s’éteint.'] },
        { h: 'Les 4 règles que j’applique', list: ['Une seule question ou action par message.', 'Moins de 100 mots.', 'Une phrase précise sur la personne, pas un message copié-collé.', 'Un calendrier de relances, décidé à l’avance.'] },
        { h: 'Les 6 moments d’un suivi', p: ['Le premier message, la relance à 3 jours, le message après un rendez-vous, le devis resté sans réponse, la dernière relance, et la facture en retard. La ressource gratuite contient un modèle pour chacun.'] },
        { service: 'automations/agents' },
        { h: 'Ce qui peut être automatisé', p: ['Le suivi : qui a répondu, qui doit être relancé, et quand. Un agent peut préparer les messages et vous les soumettre. Vous gardez la main sur ce qui part, mais vous n’oubliez plus personne.'] },
      ],
    },
    en: {
      tag: 'Finding clients',
      title: 'Prospecting and follow-ups: 6 emails that do not bother',
      excerpt: 'Short, polite, with a single action. And they go out even when you are overwhelmed.',
      callTitle: 'Want your follow-ups to go out on their own?',
      callText: 'Book a free 30-minute call. We look at how to automate your prospect follow-up.',
      sections: [
        { p: ['Finding clients is one of entrepreneurs’ biggest time shortages. And most often, money is lost in the follow-up: you send a message, forget to follow up, and the conversation dies.'] },
        { h: 'The 4 rules I apply', list: ['A single question or action per message.', 'Under 100 words.', 'One specific sentence about the person, not a copy-pasted message.', 'A follow-up calendar, decided in advance.'] },
        { h: 'The 6 moments of a follow-up', p: ['The first message, the follow-up at 3 days, the message after a meeting, the quote with no answer, the last follow-up, and the late invoice. The free resource contains a template for each.'] },
        { service: 'automations/agents' },
        { h: 'What can be automated', p: ['The follow-up: who replied, who needs a reminder, and when. An agent can prepare the messages and submit them to you. You stay in control of what goes out, but you no longer forget anyone.'] },
      ],
    },
  },
];
