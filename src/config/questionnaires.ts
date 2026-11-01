/**
 * QUESTIONNAIRES envoyés après le paiement (page /merci).
 * Modifiez les questions ici : elles s'affichent et sont enregistrées telles quelles.
 *  - section : titre du groupe (affiché quand il change)
 *  - example : exemple de réponse, affiché dans le champ avant que la personne écrive
 *  - min     : nombre de caractères en dessous duquel on invite à détailler
 */
import type { ProductKey } from '../lib/stripe';
import { promptTypes } from './masterPrompts';

type L = { fr: string; en: string };
export type Question = {
  id: string;
  type: 'text' | 'textarea' | 'url' | 'choice';
  required?: boolean;
  section?: L;
  label: L;
  hint?: L;
  example?: L;
  min?: number;
  /** question posée seulement si ce type de master prompt est choisi */
  when?: string;
};

const S = {
  business: { fr: '1. Votre activité', en: '1. Your business' } as L,
  clients: { fr: '2. Vos clients', en: '2. Your customers' } as L,
  offer: { fr: '3. Votre offre et vos prix', en: '3. Your offer and pricing' } as L,
  sales: { fr: '4. Trouver des clients et vendre', en: '4. Finding customers and selling' } as L,
  numbers: { fr: '5. Vos chiffres', en: '5. Your numbers' } as L,
  ops: { fr: '6. Organisation, outils et temps', en: '6. Organisation, tools and time' } as L,
  goals: { fr: '7. Objectifs et contraintes', en: '7. Goals and constraints' } as L,
};

export const questionnaires: Record<ProductKey, Question[]> = {
  diagnostic: [
    {
      id: 'activity', type: 'textarea', required: true, min: 160, section: S.business,
      label: { fr: 'Qui êtes-vous et que vendez-vous ?', en: 'Who are you and what do you sell?' },
      hint: { fr: 'Votre métier, ce que vous vendez, à qui, depuis quand.', en: 'Your trade, what you sell, to whom, for how long.' },
      example: {
        fr: 'Exemple : Je suis coach en nutrition à Lyon depuis 3 ans. Je vends des programmes de 12 semaines (450 €) et des consultations à 70 €, surtout à des femmes de 30 à 45 ans qui veulent perdre du poids sans régime. Je travaille seule, en visio et en cabinet.',
        en: 'Example: I have been a nutrition coach in Lyon for 3 years. I sell 12-week programmes (€450) and consultations at €70, mostly to women aged 30 to 45 who want to lose weight without dieting. I work alone, online and in person.',
      },
    },
    {
      id: 'model', type: 'textarea', min: 80,
      label: { fr: 'Comment gagnez-vous de l’argent ?', en: 'How do you make money?' },
      hint: { fr: 'Prestations, abonnements, produits, commissions, formations… et la part de chacun si vous la connaissez.', en: 'Services, subscriptions, products, commissions, training… and the share of each if you know it.' },
      example: { fr: 'Exemple : 60 % de programmes, 30 % de consultations à l’unité, 10 % d’ateliers en entreprise. Aucun revenu récurrent pour l’instant.', en: 'Example: 60% programmes, 30% one-off consultations, 10% corporate workshops. No recurring revenue so far.' },
    },
    { id: 'website', type: 'url', label: { fr: 'L’adresse de votre site', en: 'Your website address' } },
    { id: 'linkedin', type: 'url', label: { fr: 'L’adresse de votre LinkedIn', en: 'Your LinkedIn address' } },
    {
      id: 'socials', type: 'text',
      label: { fr: 'Vos autres présences en ligne', en: 'Your other online presence' },
      hint: { fr: 'Instagram, TikTok, YouTube, fiche Google, annuaires… avec les adresses si possible.', en: 'Instagram, TikTok, YouTube, Google listing, directories… with links if possible.' },
    },

    {
      id: 'audience', type: 'textarea', required: true, min: 160, section: S.clients,
      label: { fr: 'Qui est votre client idéal ?', en: 'Who is your ideal customer?' },
      hint: { fr: 'Âge ou taille d’entreprise, secteur, situation, ce qu’il cherche, ce qui le fait acheter.', en: 'Age or company size, sector, situation, what they look for, what makes them buy.' },
      example: { fr: 'Exemple : des dirigeants de PME de 5 à 30 salariés dans le bâtiment, qui perdent des devis faute de temps pour relancer, et qui veulent un outil simple sans changer leurs habitudes.', en: 'Example: owners of 5 to 30-person SMEs in construction who lose quotes for lack of time to follow up and want a simple tool without changing their habits.' },
    },
    {
      id: 'best_clients', type: 'textarea', min: 100,
      label: { fr: 'Vos 2 ou 3 meilleurs clients : pourquoi sont-ils les meilleurs ?', en: 'Your 2 or 3 best customers: why are they the best?' },
      hint: { fr: 'Ceux qui paient bien, reviennent, vous recommandent ou sont agréables à servir.', en: 'Those who pay well, come back, recommend you or are pleasant to work with.' },
      example: { fr: 'Exemple : Marie (boutique en ligne) m’a commandé 3 fois et m’a envoyé 2 clientes ; Atelier Dupont paie sans relance et décide vite.', en: 'Example: Marie (online shop) ordered 3 times and referred 2 customers; Atelier Dupont pays without reminders and decides fast.' },
    },
    {
      id: 'objections', type: 'textarea', min: 80,
      label: { fr: 'Pourquoi certains prospects ne vous choisissent pas ?', en: 'Why do some prospects not choose you?' },
      hint: { fr: 'Les objections que vous entendez : prix, timing, confiance, concurrence, « je vais réfléchir »…', en: 'The objections you hear: price, timing, trust, competition, “let me think about it”…' },
      example: { fr: 'Exemple : « c’est trop cher » (souvent), « je vais en parler à mon associé » puis plus de nouvelles, ou ils choisissent un freelance moins cher.', en: 'Example: “it is too expensive” (often), “I will talk to my partner” then silence, or they pick a cheaper freelancer.' },
    },
    {
      id: 'how_found', type: 'textarea', min: 80,
      label: { fr: 'Comment vos clients vous trouvent-ils aujourd’hui ?', en: 'How do customers find you today?' },
      example: { fr: 'Exemple : 50 % bouche-à-oreille, 30 % Instagram, 20 % Google (fiche d’établissement). Aucun client venu de LinkedIn.', en: 'Example: 50% word of mouth, 30% Instagram, 20% Google (business listing). No customers from LinkedIn.' },
    },

    {
      id: 'offers', type: 'textarea', required: true, min: 120, section: S.offer,
      label: { fr: 'Listez vos offres avec leur prix', en: 'List your offers with their prices' },
      hint: { fr: 'Une ligne par offre : ce qu’elle contient, son prix, combien elle vous rapporte.', en: 'One line per offer: what it includes, its price, how much it brings you.' },
      example: { fr: 'Exemple : Audit express 290 € (1 h + compte rendu) ; Accompagnement 3 mois 1 800 € ; Pack site vitrine 2 500 €. Mon audit se vend le mieux.', en: 'Example: Express audit €290 (1 h + report); 3-month coaching €1,800; Showcase website pack €2,500. The audit sells best.' },
    },
    {
      id: 'differentiation', type: 'textarea', min: 100,
      label: { fr: 'Pourquoi vous plutôt qu’un autre ?', en: 'Why you rather than someone else?' },
      hint: { fr: 'Votre méthode, votre expérience, votre résultat, votre manière de travailler.', en: 'Your method, your experience, your results, your way of working.' },
      example: { fr: 'Exemple : je suis la seule de ma région à proposer un suivi par WhatsApp entre les séances, et 8 clientes sur 10 atteignent leur objectif en 3 mois.', en: 'Example: I am the only one in my area offering WhatsApp follow-up between sessions, and 8 out of 10 clients reach their goal in 3 months.' },
    },
    {
      id: 'competitors', type: 'textarea', min: 60,
      label: { fr: 'Vos 3 principaux concurrents ou alternatives', en: 'Your 3 main competitors or alternatives' },
      hint: { fr: 'Noms ou adresses si possible, et ce qu’ils font mieux ou moins bien que vous.', en: 'Names or addresses if possible, and what they do better or worse than you.' },
    },
    {
      id: 'pricing_feel', type: 'textarea', min: 60,
      label: { fr: 'Votre prix : trop bas, juste, trop haut ?', en: 'Your pricing: too low, right, too high?' },
      hint: { fr: 'Comparé au marché, et selon les réactions de vos prospects. Vos marges si vous les connaissez.', en: 'Compared with the market and your prospects’ reactions. Your margins if you know them.' },
    },

    {
      id: 'channels', type: 'textarea', min: 120, section: S.sales,
      label: { fr: 'Quels canaux utilisez-vous pour trouver des clients, et lesquels marchent ?', en: 'Which channels do you use to find customers, and which work?' },
      hint: { fr: 'Réseaux sociaux, publicité, e-mailing, salons, partenaires, bouche-à-oreille, prospection directe…', en: 'Social media, ads, email, events, partners, word of mouth, direct outreach…' },
      example: { fr: 'Exemple : Instagram (3 posts/semaine, peu de messages), prospection LinkedIn (20 messages/semaine, 2 réponses), Google Ads testé 1 mois sans résultat.', en: 'Example: Instagram (3 posts/week, few messages), LinkedIn outreach (20 messages/week, 2 replies), Google Ads tried for 1 month with no result.' },
    },
    {
      id: 'leads', type: 'textarea', min: 80,
      label: { fr: 'Combien de demandes ou de contacts recevez-vous par mois, et combien deviennent clients ?', en: 'How many enquiries or contacts do you get per month, and how many become customers?' },
      example: { fr: 'Exemple : environ 25 demandes par mois, 8 rendez-vous, 4 clients. Je ne note rien : ce sont des estimations.', en: 'Example: about 25 enquiries per month, 8 meetings, 4 customers. I track nothing: these are estimates.' },
    },
    {
      id: 'sales_process', type: 'textarea', min: 100,
      label: { fr: 'Comment se passe une vente, du premier contact à la signature ?', en: 'How does a sale work, from first contact to signing?' },
      hint: { fr: 'Les étapes, qui fait quoi, la durée, où les prospects disparaissent.', en: 'The steps, who does what, how long it takes, where prospects disappear.' },
      example: { fr: 'Exemple : message Instagram, appel de 20 min, devis envoyé par e-mail sous 48 h, relance si j’y pense. Beaucoup disparaissent après le devis.', en: 'Example: Instagram message, 20-minute call, quote emailed within 48 h, follow-up if I remember. Many vanish after the quote.' },
    },
    {
      id: 'content', type: 'textarea', min: 60,
      label: { fr: 'Votre contenu et votre communication', en: 'Your content and communication' },
      hint: { fr: 'Ce que vous publiez, à quelle fréquence, ce qui marche le mieux, newsletter ou non.', en: 'What you publish, how often, what works best, newsletter or not.' },
    },
    {
      id: 'ads', type: 'text',
      label: { fr: 'Votre budget publicité ou marketing par mois, et son résultat', en: 'Your monthly advertising or marketing budget, and its result' },
      example: { fr: 'Exemple : 150 € par mois en publicité Instagram, environ 10 contacts.', en: 'Example: €150 per month on Instagram ads, around 10 leads.' },
    },

    {
      id: 'revenue', type: 'text', section: S.numbers,
      label: { fr: 'Votre chiffre d’affaires, mensuel ou annuel (approximatif)', en: 'Your revenue, monthly or yearly (approximate)' },
      example: { fr: 'Exemple : environ 4 500 € par mois, très variable (de 1 500 à 8 000 €).', en: 'Example: about €4,500 per month, very variable (from €1,500 to €8,000).' },
    },
    {
      id: 'basket', type: 'text',
      label: { fr: 'Votre panier moyen, et la part de clients qui rachètent', en: 'Your average order, and the share of repeat customers' },
      example: { fr: 'Exemple : 380 € en moyenne ; environ 1 client sur 4 revient.', en: 'Example: €380 on average; roughly 1 customer in 4 comes back.' },
    },
    {
      id: 'costs', type: 'textarea', min: 60,
      label: { fr: 'Vos principaux coûts et votre marge', en: 'Your main costs and your margin' },
      hint: { fr: 'Outils, sous-traitance, publicité, déplacements… L’ordre de grandeur suffit.', en: 'Tools, subcontracting, ads, travel… A rough order of magnitude is enough.' },
    },
    {
      id: 'traffic', type: 'text',
      label: { fr: 'Les visites de votre site par mois et ce qui s’y passe', en: 'Your monthly website visits and what happens there' },
      example: { fr: 'Exemple : 400 visites par mois, 5 demandes de contact, aucune vente directe.', en: 'Example: 400 visits per month, 5 contact requests, no direct sales.' },
    },
    {
      id: 'retention', type: 'textarea', min: 60,
      label: { fr: 'Après la vente : suivi, avis, recommandations', en: 'After the sale: follow-up, reviews, referrals' },
      hint: { fr: 'Que faites-vous pour que vos clients reviennent ou vous recommandent ?', en: 'What do you do to make customers come back or recommend you?' },
    },

    {
      id: 'tools', type: 'textarea', min: 60, section: S.ops,
      label: { fr: 'Les outils que vous utilisez déjà', en: 'Tools you already use' },
      hint: { fr: 'E-mail, agenda, facturation, CRM, tableurs, Notion, réseaux sociaux, site, paiement… Je recommande aussi des outils que vous n’utilisez pas encore, quand ils vous conviennent mieux : si vous ne savez pas, laissez vide.', en: 'Email, calendar, invoicing, CRM, spreadsheets, Notion, social media, website, payments… I also recommend tools you do not use yet when they suit you better: if you are not sure, leave it empty.' },
      example: { fr: 'Exemple : Gmail, Google Agenda, Excel pour suivre les clients, Canva, Stripe, Wix pour le site, Qonto pour la facturation.', en: 'Example: Gmail, Google Calendar, Excel to track customers, Canva, Stripe, Wix for the website, Qonto for invoicing.' },
    },
    {
      id: 'time_waste', type: 'textarea', min: 100,
      label: { fr: 'Quelles tâches répétitives vous prennent le plus de temps ?', en: 'Which repetitive tasks take the most of your time?' },
      hint: { fr: 'Et combien d’heures par semaine environ.', en: 'And roughly how many hours per week.' },
      example: { fr: 'Exemple : relances de devis (3 h/semaine), réponses aux mêmes questions par message (4 h), mise en forme des comptes rendus (2 h), facturation à la main (1 h).', en: 'Example: quote follow-ups (3 h/week), answering the same messages (4 h), formatting reports (2 h), manual invoicing (1 h).' },
    },
    {
      id: 'automation', type: 'textarea', min: 60,
      label: { fr: 'Ce que vous avez déjà automatisé ou fait avec l’IA', en: 'What you have already automated or done with AI' },
      example: { fr: 'Exemple : j’utilise ChatGPT pour écrire mes posts, rien d’automatisé pour le reste.', en: 'Example: I use ChatGPT to write my posts, nothing else is automated.' },
    },
    {
      id: 'team', type: 'textarea', min: 60,
      label: { fr: 'Qui fait quoi chez vous, et ce que vous voudriez déléguer', en: 'Who does what, and what you would like to delegate' },
      example: { fr: 'Exemple : je fais tout seule ; je voudrais déléguer la facturation et la gestion des rendez-vous.', en: 'Example: I do everything myself; I would like to delegate invoicing and appointment handling.' },
    },

    {
      id: 'problem', type: 'textarea', required: true, min: 160, section: S.goals,
      label: { fr: 'Votre principal problème en ce moment', en: 'Your main problem right now' },
      hint: { fr: 'Décrivez-le comme à un ami : ce qui se passe, depuis quand, ce que ça vous coûte.', en: 'Describe it as to a friend: what is happening, since when, what it costs you.' },
      example: { fr: 'Exemple : mes ventes stagnent depuis 6 mois autour de 4 000 €/mois. Je passe mes soirées à répondre aux messages et à relancer, je n’ai plus de temps pour prospecter et je suis épuisée.', en: 'Example: my sales have been flat for 6 months at around €4,000/month. I spend evenings replying to messages and following up, with no time left to prospect, and I am exhausted.' },
    },
    {
      id: 'goals', type: 'textarea', required: true, min: 120,
      label: { fr: 'Vos objectifs pour les 3 à 12 prochains mois', en: 'Your goals for the next 3 to 12 months' },
      hint: { fr: 'Le plus précis possible : chiffres, dates, ce que vous voulez changer dans votre quotidien.', en: 'As precise as possible: numbers, dates, what you want to change in your daily life.' },
      example: { fr: 'Exemple : passer à 7 000 €/mois d’ici 6 mois, avoir 30 % de revenus récurrents, et travailler 4 jours par semaine.', en: 'Example: reach €7,000/month within 6 months, have 30% recurring revenue, and work 4 days a week.' },
    },
    {
      id: 'past_tries', type: 'textarea', min: 80,
      label: { fr: 'Ce que vous avez déjà essayé, et ce qui n’a pas marché', en: 'What you have already tried, and what did not work' },
      example: { fr: 'Exemple : j’ai testé la publicité Facebook (500 € dépensés, 2 contacts) et une newsletter mensuelle (arrêtée faute de temps).', en: 'Example: I tried Facebook ads (€500 spent, 2 leads) and a monthly newsletter (stopped for lack of time).' },
    },
    {
      id: 'budget', type: 'text',
      label: { fr: 'Combien pouvez-vous investir pour améliorer votre activité ?', en: 'How much can you invest to improve your business?' },
      hint: { fr: 'Un montant une fois, et/ou par mois, plus le temps par semaine. Si vous ne savez pas, laissez vide : je vous proposerai des options pour trois niveaux de budget.', en: 'A one-off amount and/or per month, plus time per week. If you are not sure, leave it empty: I will suggest options for three budget levels.' },
      example: { fr: 'Exemple : 500 € une fois et jusqu’à 200 € par mois, 3 heures par semaine.', en: 'Example: €500 once and up to €200 per month, 3 hours per week.' },
    },
    {
      id: 'constraints', type: 'textarea', min: 40,
      label: { fr: 'Vos contraintes', en: 'Your constraints' },
      hint: { fr: 'Saisonnalité, règles de votre métier, outils imposés, peu de temps, peu d’aisance technique…', en: 'Seasonality, industry rules, mandatory tools, little time, low technical comfort…' },
    },
    {
      id: 'anything', type: 'textarea',
      label: { fr: 'Autre chose que je devrais savoir ?', en: 'Anything else I should know?' },
    },
  ],

  prompt: [
    {
      id: 'types', type: 'choice', required: true, section: { fr: '1. Vos 2 master prompts', en: '1. Your 2 master prompts' },
      label: { fr: 'Quels 2 master prompts voulez-vous recevoir ?', en: 'Which 2 master prompts do you want to receive?' },
      hint: { fr: 'Choisissez-en exactement 2. Chacun est écrit pour votre activité et vous pourrez le coller dans ChatGPT, Claude ou Gemini.', en: 'Choose exactly 2. Each is written for your business and can be pasted into ChatGPT, Claude or Gemini.' },
    },
    {
      id: 'activity', type: 'textarea', required: true, min: 160, section: { fr: '2. Votre activité', en: '2. Your business' },
      label: { fr: 'Votre activité et ce que vous vendez', en: 'Your business and what you sell' },
      hint: { fr: 'Votre métier, vos offres, vos prix si vous le souhaitez, ce qui vous différencie.', en: 'Your trade, your offers, your prices if you wish, what sets you apart.' },
      example: { fr: 'Exemple : je suis coach en nutrition à Lyon. Je vends des programmes de 12 semaines (450 €) et des consultations à 70 €, pour des femmes de 30 à 45 ans.', en: 'Example: I am a nutrition coach in Lyon. I sell 12-week programmes (€450) and consultations at €70, for women aged 30 to 45.' },
    },
    {
      id: 'website', type: 'url',
      label: { fr: 'L’adresse de votre site (facultatif, très recommandé)', en: 'Your website address (optional, strongly recommended)' },
      hint: { fr: 'L’IA analyse votre site pour comprendre votre message et votre style, et vous fait des recommandations.', en: 'The AI reads your website to understand your message and style, and makes recommendations.' },
    },
    {
      id: 'linkedin', type: 'url',
      label: { fr: 'L’adresse de votre LinkedIn (facultatif, très recommandé)', en: 'Your LinkedIn address (optional, strongly recommended)' },
      hint: { fr: 'Votre profil ou la page de votre entreprise : vos publications montrent comment vous parlez.', en: 'Your profile or company page: your posts show how you speak.' },
    },
    {
      id: 'audience', type: 'textarea', required: true, min: 160,
      label: { fr: 'Vos clients : qui sont-ils, que cherchent-ils, quelles objections ont-ils ?', en: 'Your customers: who are they, what do they want, what objections do they have?' },
      example: { fr: 'Exemple : des femmes actives, souvent déçues par les régimes. Elles cherchent une méthode durable ; objections : le prix, « je n’ai pas le temps ».', en: 'Example: working women, often disappointed by diets. They want a lasting method; objections: price, “I have no time”.' },
    },
    {
      id: 'tone', type: 'textarea', required: true, min: 100, section: { fr: '3. Votre marque et votre voix', en: '3. Your brand and voice' },
      label: { fr: 'Votre ton et vos mots', en: 'Your tone and your words' },
      hint: { fr: 'Tutoiement ou vouvoiement, mots que vous employez, mots que vous évitez.', en: 'Informal or formal address, words you use, words you avoid.' },
      example: { fr: 'Exemple : je vouvoie, ton chaleureux et direct, phrases courtes. J’évite « détox », « minceur », les points d’exclamation en série.', en: 'Example: formal “you”, warm and direct tone, short sentences. I avoid “detox”, “slimming”, rows of exclamation marks.' },
    },
    {
      id: 'brand', type: 'textarea', required: true, min: 100,
      label: { fr: 'Votre marque en 3 adjectifs, et 3 adjectifs qui ne vous ressemblent pas', en: 'Your brand in 3 adjectives, and 3 adjectives that are not you' },
      hint: { fr: 'Votre personnalité, vos valeurs, ce que vous voulez que les gens ressentent en vous lisant.', en: 'Your personality, your values, what you want people to feel when reading you.' },
      example: { fr: 'Exemple : chaleureuse, directe, rigoureuse. Jamais moralisatrice, tape-à-l’œil ni « gourou ». Je veux qu’on se sente compris, pas jugé.', en: 'Example: warm, direct, rigorous. Never preachy, flashy or “guru”. I want people to feel understood, not judged.' },
    },
    {
      id: 'universe', type: 'textarea', min: 60,
      label: { fr: 'Votre univers et votre style visuel', en: 'Your universe and visual style' },
      hint: { fr: 'Couleurs, ambiance, marques ou personnes dont vous vous sentez proche, ce que vous trouvez trop « corporate » ou trop « influenceur ».', en: 'Colours, mood, brands or people you feel close to, what you find too “corporate” or too “influencer”.' },
      example: { fr: 'Exemple : tons terre et crème, photos naturelles, esprit magazine plutôt que publicité. Proche de l’univers de Jacquemus, loin du ton « coach à paillettes ».', en: 'Example: earthy and cream tones, natural photos, magazine feel rather than advertising. Close to Jacquemus, far from the “glitter coach” tone.' },
    },
    {
      id: 'examples', type: 'textarea', min: 200,
      label: { fr: 'Un ou deux textes que vous avez écrits', en: 'One or two texts you have written' },
      hint: { fr: 'Un e-mail, une publication, un message client. L’IA y repère votre rythme et vos expressions pour écrire comme vous.', en: 'An email, a post, a customer message. It helps reproduce your style.' },
    },
    {
      id: 'never', type: 'textarea', min: 60,
      label: { fr: 'Ce que l’IA ne doit jamais faire', en: 'What the AI must never do' },
      example: { fr: 'Exemple : donner un avis médical, promettre un résultat chiffré, parler de prix sans me demander.', en: 'Example: give medical advice, promise measurable results, discuss prices without asking me.' },
    },
    {
      id: 'tools', type: 'text',
      label: { fr: 'Où allez-vous l’utiliser ?', en: 'Where will you use it?' },
      hint: { fr: 'ChatGPT, Claude, Gemini, e-mails, réseaux sociaux…', en: 'ChatGPT, Claude, Gemini, emails, social media…' },
    },
    ...promptTypes.flatMap((t) =>
      t.questions.map((q, i): Question => ({
        id: q.id, type: 'textarea', required: q.required, min: q.min, when: t.id,
        section: i === 0 ? { fr: `Pour votre master prompt ${t.name.fr}`, en: `For your ${t.name.en} master prompt` } : undefined,
        label: q.label, hint: q.hint, example: q.example,
      })),
    ),
  ],
};
