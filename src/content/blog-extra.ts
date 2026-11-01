/**
 * Compléments de chaque article : description pour Google, « En bref », méthode, FAQ et sources.
 * Pour améliorer un article, modifiez son bloc ici : il est fusionné au texte de blog.ts.
 * Les repères chiffrés ne viennent que de sources citées ; le reste est une méthode, présentée comme telle.
 */
import type { Faq, Post, PostText, Section, Source } from './blog';

type Enrich = {
  seoTitle: string;
  description: string;
  takeaways: string[];
  faq: Faq[];
  /** blocs ajoutés à la fin du texte (avant les sources) */
  more?: Section[];
  /** sources ajoutées à celles de l'article */
  sources?: Source[];
};
type Extra = { updated: string; fr: Enrich; en: Enrich };

const UPDATED = '2026-11-01';
const PROMPTS = 'blog/prompts-gratuits-seo-reseaux-vente';

const extras: Record<string, Extra> = {
  'premieres-automatisations': {
    updated: UPDATED,
    fr: {
      seoTitle: '5 tâches à automatiser en premier',
      description: 'Boîte mail, prospection, contenu, factures, rendez-vous : les 5 tâches à automatiser en premier, comment choisir la vôtre et une checklist gratuite.',
      takeaways: [
        'Commencez par la tâche qui vous coûte le plus de temps au total et que vous oubliez le plus souvent.',
        'Les 5 zones qui font perdre du temps : boîte mail, prospection, contenu, factures, rendez-vous.',
        'Clarifiez votre message avant d’automatiser : un message flou, automatisé, reste flou.',
        'Mesurez le temps gagné pendant quelques semaines avant de passer à la suivante.',
      ],
      more: [
        {
          h: 'Votre plan en 4 étapes',
          steps: [
            { t: 'Listez', d: 'Pendant une semaine, notez chaque tâche répétitive que vous faites.' },
            { t: 'Chiffrez', d: 'Pour chacune : combien de fois par semaine, combien de minutes. Multipliez.' },
            { t: 'Choisissez', d: 'Prenez celle qui coûte le plus de temps et que vous oubliez le plus souvent.' },
            { t: 'Mesurez', d: 'Automatisez-la, puis comparez avant et après pendant 3 à 4 semaines.' },
          ],
        },
        { note: { title: 'Des prompts pour commencer tout de suite', text: 'Pas besoin d’un outil complexe pour gagner vos premières heures : un bon prompt suffit pour trier, rédiger et relancer.', href: PROMPTS, cta: 'Voir les 9 prompts gratuits' } },
      ],
      faq: [
        { q: 'Faut-il savoir coder pour automatiser ses tâches ?', a: 'Non. Beaucoup d’automatisations se construisent sans code avec des outils comme Make, Zapier ou n8n. Le code devient utile pour des besoins très spécifiques, et c’est alors à moi de m’en occuper.' },
        { q: 'Combien de temps faut-il pour mettre en place une première automatisation ?', a: 'Cela dépend de sa complexité : une automatisation simple (un formulaire qui crée une fiche et envoie un accusé de réception) se met en place en quelques heures, une plus riche demande quelques jours, tests compris.' },
        { q: 'Quelle tâche automatiser en premier ?', a: 'Celle qui vous coûte le plus de temps au total et que vous oubliez le plus souvent. Posez-vous trois questions : combien de fois par semaine, combien de minutes à chaque fois, et que se passe-t-il si je l’oublie ?' },
        { q: 'L’automatisation remplace-t-elle l’humain ?', a: 'Non. Elle prend en charge les tâches répétitives. Vous gardez la main sur tout ce qui demande du jugement, comme un message délicat, une négociation ou une décision.' },
      ],
    },
    en: {
      seoTitle: '5 tasks to automate first (entrepreneurs)',
      description: 'Inbox, prospecting, content, invoices, appointments: the 5 tasks to automate first, how to pick yours, and a free checklist.',
      takeaways: [
        'Start with the task that costs you the most time overall and that you forget most often.',
        'The 5 areas that waste time: inbox, prospecting, content, invoices, appointments.',
        'Clarify your message before automating: a blurry message, automated, stays blurry.',
        'Measure the time saved for a few weeks before moving to the next one.',
      ],
      more: [
        {
          h: 'Your plan in 4 steps',
          steps: [
            { t: 'List', d: 'For one week, note every repetitive task you do.' },
            { t: 'Quantify', d: 'For each: how many times a week, how many minutes. Multiply.' },
            { t: 'Choose', d: 'Take the one that costs the most time and that you forget most often.' },
            { t: 'Measure', d: 'Automate it, then compare before and after for 3 to 4 weeks.' },
          ],
        },
        { note: { title: 'Prompts to start right now', text: 'You do not need a complex tool to win back your first hours: a good prompt is enough to sort, write and follow up.', href: PROMPTS, cta: 'See the 9 free prompts' } },
      ],
      faq: [
        { q: 'Do I need to code to automate my tasks?', a: 'No. Many automations are built without code using tools like Make, Zapier or n8n. Code becomes useful for very specific needs, and then it is my job to handle it.' },
        { q: 'How long does a first automation take to set up?', a: 'It depends on its complexity: a simple one (a form that creates a record and sends an acknowledgement) takes a few hours, a richer one takes a few days, tests included.' },
        { q: 'Which task should I automate first?', a: 'The one that costs you the most time overall and that you forget most often. Ask yourself three questions: how many times a week, how many minutes each time, and what happens if I forget it?' },
        { q: 'Does automation replace people?', a: 'No. It takes over repetitive tasks. You stay in control of everything that needs judgement, like a delicate message, a negotiation or a decision.' },
      ],
    },
  },

  'contenu-reseaux-regularite': {
    updated: UPDATED,
    fr: {
      seoTitle: 'Publier tous les jours ne suffit pas',
      description: 'Pourquoi publier tous les jours ne fait pas grandir un compte, et les 5 points qui comptent : ligne éditoriale, rythme, formats, bilan, appel à l’action.',
      takeaways: [
        'Le volume n’est presque jamais le problème : c’est le manque de ligne éditoriale et de suivi.',
        'Choisissez 3 thèmes au maximum et rattachez-y tout ce que vous publiez.',
        'Mieux vaut 3 bons contenus par semaine tenus des mois que 7 abandonnés après un mois.',
        'Faites un bilan chaque semaine : refaites ce qui marche, arrêtez le reste.',
      ],
      more: [
        {
          h: 'Un repère pour équilibrer vos contenus',
          p: ['Pour ne pas passer votre temps à vendre, voici la répartition que j’utilise comme point de départ. C’est un repère de méthode, pas une règle prouvée : ajustez-le avec vos résultats.'],
          steps: [
            { t: '60 % pour éduquer', d: 'Des conseils, des explications, des réponses aux questions que vos clients se posent.' },
            { t: '25 % pour prouver', d: 'Des résultats, des cas clients, des coulisses qui montrent votre manière de travailler.' },
            { t: '15 % pour vendre', d: 'Une offre, un appel à l’action clair, une prise de rendez-vous.' },
          ],
        },
        { note: { title: 'Un calendrier prêt à remplir', text: 'Le prompt « calendrier de 4 semaines » construit ce tableau pour vous en deux minutes, à partir de votre activité et de votre objectif.', href: PROMPTS, cta: 'Récupérer le prompt' } },
      ],
      faq: [
        { q: 'Combien de fois par semaine faut-il publier ?', a: 'Il n’existe pas de nombre magique. Commencez par un rythme que vous pouvez tenir pendant des mois, par exemple 3 fois par semaine. Une étude de Buffer sur plus de 2 millions de publications LinkedIn observe que passer d’un post par semaine à 2 à 5 augmente la portée. C’est une observation, pas une preuve de cause, et la qualité compte toujours.' },
        { q: 'Faut-il être présent sur toutes les plateformes ?', a: 'Non. Choisissez une ou deux plateformes où se trouve votre cible et soyez-y régulier. Mieux vaut bien faire sur une plateforme que publier partout sans suite.' },
        { q: 'Comment savoir ce qui marche ?', a: 'Regardez chaque semaine la portée, l’engagement et surtout ce que chaque contenu a fait venir : messages, inscriptions, demandes. Refaites ce qui marche sous un autre angle.' },
        { q: 'L’IA peut-elle écrire mes publications ?', a: 'Elle peut préparer des brouillons, des idées et des calendriers. Relisez toujours, ajoutez vos exemples et vos chiffres, et gardez votre voix : c’est ce qui rend un compte reconnaissable.' },
      ],
      sources: [{ label: 'Buffer : combien de fois publier sur LinkedIn (plus de 2 millions de publications)', url: 'https://buffer.com/resources/how-often-to-post-on-linkedin/' }],
    },
    en: {
      seoTitle: 'Posting every day is not enough: the method',
      description: 'Why posting every day does not grow an account, and the 5 points that matter: editorial line, rhythm, formats, weekly review, call to action.',
      takeaways: [
        'Volume is almost never the problem: the lack of an editorial line and of follow-up is.',
        'Choose 3 topics at most and connect everything you publish to them.',
        'It is better to have 3 good pieces a week kept up for months than 7 given up after a month.',
        'Review every week: redo what works, stop the rest.',
      ],
      more: [
        {
          h: 'A guideline to balance your content',
          p: ['So you do not spend your time selling, here is the split I use as a starting point. It is a method guideline, not a proven rule: adjust it with your results.'],
          steps: [
            { t: '60% to educate', d: 'Advice, explanations, answers to the questions your customers ask.' },
            { t: '25% to prove', d: 'Results, client cases, behind-the-scenes that show how you work.' },
            { t: '15% to sell', d: 'An offer, a clear call to action, a booking.' },
          ],
        },
        { note: { title: 'A calendar ready to fill in', text: 'The “4-week calendar” prompt builds this table for you in two minutes, from your business and your goal.', href: PROMPTS, cta: 'Get the prompt' } },
      ],
      faq: [
        { q: 'How many times a week should I post?', a: 'There is no magic number. Start with a rhythm you can keep for months, for example 3 times a week. A Buffer study of more than 2 million LinkedIn posts observes that going from one post a week to 2 to 5 increases reach. It is an observation, not proof of cause, and quality still matters.' },
        { q: 'Do I need to be on every platform?', a: 'No. Pick one or two platforms where your audience is and be consistent there. It is better to do one platform well than to post everywhere with no follow-up.' },
        { q: 'How do I know what works?', a: 'Every week, look at reach, engagement and above all what each piece brought in: messages, sign-ups, requests. Redo what works from another angle.' },
        { q: 'Can AI write my posts?', a: 'It can prepare drafts, ideas and calendars. Always review, add your examples and numbers, and keep your voice: that is what makes an account recognizable.' },
      ],
      sources: [{ label: 'Buffer: how often to post on LinkedIn (over 2 million posts)', url: 'https://buffer.com/resources/how-often-to-post-on-linkedin/' }],
    },
  },

  'webinaire-checklist': {
    updated: UPDATED,
    fr: {
      seoTitle: 'Réussir son webinaire : chiffres et checklist',
      description: 'Taux de présence, meilleur jour, rappels, relance : ce que disent les études sur les webinaires et la checklist avant, pendant et après.',
      takeaways: [
        'Un webinaire se joue dans tout ce qui l’entoure : page d’inscription, rappels, relance.',
        'Repères d’études : environ 49 % de présence en direct (Univid), médiane d’environ 41,6 % (Contrast). Testez avec votre audience.',
        'Une seule idée par slide, le plan annoncé au début, une action claire à la fin.',
        'Le replay et la relance du lendemain, avec une seule action, font souvent la différence.',
      ],
      more: [
        {
          h: 'Un calendrier de communication à copier',
          p: ['Voici le rythme que je propose comme point de départ. C’est une méthode, à adapter à votre audience.'],
          steps: [
            { t: 'J-14 : ouverture des inscriptions', d: 'Page d’inscription claire, un message, un bouton.' },
            { t: 'J-7 et J-1 : rappels', d: 'E-mail, et WhatsApp si votre audience l’utilise, avec le lien et l’heure.' },
            { t: 'H-1 : dernier rappel', d: 'Un message court avec le lien direct.' },
            { t: 'J+1 : replay et relance', d: 'Une seule action : réserver un échange, télécharger un document ou découvrir l’offre.' },
          ],
        },
      ],
      faq: [
        { q: 'Quel est un bon taux de présence à un webinaire ?', a: 'Selon Univid (2026), la présence en direct tourne autour de 49 %. Contrast observe une médiane d’environ 41,6 % sur des webinaires B2B. Ce sont des repères : votre audience peut faire mieux ou moins bien.' },
        { q: 'Quel est le meilleur jour et le meilleur horaire ?', a: 'Plusieurs études citent le mercredi, avec la fin de matinée ou l’après-midi comme créneaux fréquents. Le meilleur horaire reste celui de votre audience : testez-en deux et comparez.' },
        { q: 'Combien de rappels envoyer avant le webinaire ?', a: 'Trois rappels suffisent en général : une semaine avant, la veille, et une heure avant. Chaque rappel redonne le lien et l’heure, sans surcharger.' },
        { q: 'Que faire après le webinaire ?', a: 'Envoyez le replay et une relance dès le lendemain, avec une seule action à faire. Relancez aussi les inscrits qui n’étaient pas là : ils sont souvent intéressés.' },
      ],
    },
    en: {
      seoTitle: 'Running a good webinar: numbers and checklist',
      description: 'Attendance rate, best day, reminders, follow-up: what studies say about webinars and the before, during and after checklist.',
      takeaways: [
        'A webinar is decided in everything around it: sign-up page, reminders, follow-up.',
        'Study benchmarks: about 49% live attendance (Univid), median of about 41.6% (Contrast). Test with your own audience.',
        'One idea per slide, the plan announced at the start, a clear action at the end.',
        'The replay and the next-day follow-up, with a single action, often make the difference.',
      ],
      more: [
        {
          h: 'A communication calendar to copy',
          p: ['Here is the rhythm I suggest as a starting point. It is a method, to adapt to your audience.'],
          steps: [
            { t: 'D-14: registration opens', d: 'Clear sign-up page, one message, one button.' },
            { t: 'D-7 and D-1: reminders', d: 'Email, and WhatsApp if your audience uses it, with the link and the time.' },
            { t: 'H-1: last reminder', d: 'A short message with the direct link.' },
            { t: 'D+1: replay and follow-up', d: 'A single action: book a call, download a document or discover the offer.' },
          ],
        },
      ],
      faq: [
        { q: 'What is a good webinar attendance rate?', a: 'According to Univid (2026), live attendance is around 49%. Contrast observes a median of about 41.6% across B2B webinars. These are benchmarks: your audience may do better or worse.' },
        { q: 'What is the best day and time?', a: 'Several studies name Wednesday, with late morning or afternoon as frequent slots. The best time is still your audience’s: test two and compare.' },
        { q: 'How many reminders should I send?', a: 'Three are usually enough: a week before, the day before, and an hour before. Each one repeats the link and the time, without overloading.' },
        { q: 'What should I do after the webinar?', a: 'Send the replay and a follow-up the next day, with a single action to take. Also follow up with registrants who did not attend: they are often interested.' },
      ],
    },
  },

  'choisir-un-llm': {
    updated: UPDATED,
    fr: {
      seoTitle: 'Quel LLM choisir pour votre entreprise ?',
      description: 'ChatGPT, Claude, Gemini : comment choisir un LLM pour votre entreprise avec 6 critères et un test en 4 étapes, sans vous perdre dans les classements.',
      takeaways: [
        'Les classements ne s’accordent pas parce qu’ils ne mesurent pas la même chose : servez-vous-en pour présélectionner 2 ou 3 modèles.',
        '6 critères comptent : langue, justesse sur vos tâches, données, prix, taille des documents, connexions.',
        'Le test en 4 étapes : 5 tâches réelles, le même texte pour chaque modèle, une note de 1 à 5, puis prix et confidentialité.',
        'Beaucoup d’entreprises combinent plusieurs modèles : un rapide et peu cher pour trier, un plus puissant pour analyser.',
      ],
      more: [
        {
          h: 'Une grille de notation à copier',
          p: ['Pour chaque modèle et chaque tâche, notez de 1 à 5 : justesse, ton, longueur adaptée, respect du format demandé. Additionnez, puis ajoutez le prix et la confidentialité. Refaites le test dans 3 mois : les modèles évoluent vite.'],
        },
        { note: { title: 'Le même prompt, deux outils', text: 'Pour comparer sérieusement, utilisez exactement le même prompt. Les 9 prompts gratuits de cet article sont faits pour ça.', href: PROMPTS, cta: 'Voir les prompts' } },
      ],
      faq: [
        { q: 'Quel est le meilleur LLM aujourd’hui ?', a: 'Cela dépend de la tâche et change souvent : les classements publics ne placent pas le même modèle en tête. Présélectionnez 2 ou 3 modèles, puis testez-les sur vos propres tâches.' },
        { q: 'Mes données sont-elles protégées avec ces outils ?', a: 'Cela dépend de l’offre choisie. Avant d’y mettre des informations clients ou confidentielles, vérifiez si vos conversations peuvent servir à entraîner le modèle et si une offre professionnelle l’interdit. En cas de doute, n’y mettez pas de données sensibles.' },
        { q: 'Faut-il utiliser un seul modèle ou plusieurs ?', a: 'Beaucoup d’entreprises en utilisent plusieurs selon la tâche. Un agent bien conçu peut choisir le bon modèle au bon moment, ce qui permet aussi de maîtriser les coûts.' },
        { q: 'Combien coûte l’utilisation d’un LLM ?', a: 'Les abonnements grand public coûtent quelques dizaines d’euros par mois, et l’usage par API se paie à la quantité de texte traité. Le bon réflexe : comparez les prix sur vos usages réels, pas sur les tarifs affichés.' },
      ],
    },
    en: {
      seoTitle: 'Which LLM should your business choose?',
      description: 'ChatGPT, Claude, Gemini: how to choose an LLM for your business with 6 criteria and a 4-step test, without getting lost in rankings.',
      takeaways: [
        'Rankings disagree because they measure different things: use them to shortlist 2 or 3 models.',
        '6 criteria matter: language, accuracy on your tasks, data, price, document size, connections.',
        'The 4-step test: 5 real tasks, the same text for each model, a 1 to 5 score, then price and privacy.',
        'Many businesses combine several models: a fast, cheap one to sort, a stronger one to analyze.',
      ],
      more: [
        {
          h: 'A scoring grid to copy',
          p: ['For each model and each task, score from 1 to 5: accuracy, tone, suitable length, respect of the requested format. Add them up, then add price and privacy. Redo the test in 3 months: models evolve fast.'],
        },
        { note: { title: 'The same prompt, two tools', text: 'To compare seriously, use exactly the same prompt. The 9 free prompts in this article are made for that.', href: PROMPTS, cta: 'See the prompts' } },
      ],
      faq: [
        { q: 'What is the best LLM today?', a: 'It depends on the task and changes often: public rankings do not put the same model first. Shortlist 2 or 3 models, then test them on your own tasks.' },
        { q: 'Is my data protected with these tools?', a: 'It depends on the plan you choose. Before putting client or confidential information in, check whether your conversations can be used to train the model and whether a business plan prevents it. When in doubt, do not enter sensitive data.' },
        { q: 'Should I use one model or several?', a: 'Many businesses use several depending on the task. A well-designed agent can pick the right model at the right time, which also helps control costs.' },
        { q: 'How much does using an LLM cost?', a: 'Consumer subscriptions cost a few tens of euros a month, and API usage is paid by the amount of text processed. The right reflex: compare prices on your real usage, not on advertised rates.' },
      ],
    },
  },

  'prompt-maitre': {
    updated: UPDATED,
    fr: {
      seoTitle: 'Pourquoi votre IA répond trop général',
      description: 'Votre assistant IA répond de façon plate ? Le master prompt, c’est la fiche de poste de votre IA : les 7 lignes à écrire, un exemple et les erreurs à éviter.',
      takeaways: [
        'Un assistant IA répond de façon générale parce qu’il ne sait rien de vous : ce n’est pas un défaut du modèle.',
        'Un master prompt est la fiche de poste de l’assistant : vous l’écrivez une fois et vous le collez en début de conversation.',
        '7 lignes suffisent : rôle, public, ton, mission, règles, format, exemples.',
        'Testez-le sur des demandes réelles et corrigez-le : il s’améliore à chaque essai.',
      ],
      more: [
        {
          h: 'Le tester en 10 minutes',
          steps: [
            { t: 'Collez-le', d: 'Au tout début d’une nouvelle conversation, dans l’assistant de votre choix.' },
            { t: 'Posez 3 demandes réelles', d: 'Celles que vous faites chaque semaine : une réponse client, un post, un résumé.' },
            { t: 'Notez ce qui manque', d: 'Ton trop formel ? Réponses trop longues ? Ajoutez une règle ou un exemple.' },
            { t: 'Sauvegardez la bonne version', d: 'Gardez-la dans un document : c’est votre base pour tout le reste.' },
          ],
        },
        { note: { title: 'Des prompts prêts à coller', text: 'Pour des demandes ponctuelles, voici 9 prompts gratuits (SEO, réseaux sociaux, vente), avec la formule en 5 lignes pour écrire les vôtres.', href: PROMPTS, cta: 'Voir les 9 prompts gratuits' } },
      ],
      faq: [
        { q: 'Qu’est-ce qu’un master prompt ?', a: 'C’est un prompt long, écrit une fois, qui décrit le rôle de l’assistant, votre public, votre ton, sa mission, ses règles, le format de ses réponses et quelques exemples. Vous le collez au début de la conversation et toutes les réponses suivantes en tiennent compte.' },
        { q: 'Quelle est la différence avec un simple prompt ?', a: 'Un prompt répond à une demande précise, une seule fois. Un master prompt pose le cadre une fois pour toutes : vous n’avez plus à redonner votre contexte à chaque demande.' },
        { q: 'Fonctionne-t-il avec ChatGPT, Claude et Gemini ?', a: 'Oui. Il repose sur du texte, donc il se colle dans n’importe quel assistant. Certains outils permettent aussi de l’enregistrer comme instructions permanentes : consultez les réglages de votre outil.' },
        { q: 'Quelle longueur doit-il avoir ?', a: 'Assez long pour contenir vos 7 lignes avec des détails, assez court pour rester clair. Pour une entreprise, comptez de 300 à 1 000 mots. Au-delà, cherchez ce qui est redondant.' },
      ],
      sources: [
        { label: 'Anthropic : Prompt engineering overview', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview' },
        { label: 'OpenAI : Prompt engineering guide', url: 'https://platform.openai.com/docs/guides/prompt-engineering' },
      ],
    },
    en: {
      seoTitle: 'Master prompt: why AI answers too generally',
      description: 'Does your AI assistant answer flatly? A master prompt is your AI’s job description: the 7 lines to write, an example and mistakes to avoid.',
      takeaways: [
        'An AI assistant answers generally because it knows nothing about you: it is not a flaw in the model.',
        'A master prompt is the assistant’s job description: you write it once and paste it at the start of the conversation.',
        '7 lines are enough: role, audience, tone, mission, rules, format, examples.',
        'Test it on real requests and fix it: it improves with every try.',
      ],
      more: [
        {
          h: 'Test it in 10 minutes',
          steps: [
            { t: 'Paste it', d: 'At the very start of a new conversation, in the assistant of your choice.' },
            { t: 'Ask 3 real requests', d: 'The ones you make every week: a client reply, a post, a summary.' },
            { t: 'Note what is missing', d: 'Tone too formal? Answers too long? Add a rule or an example.' },
            { t: 'Save the good version', d: 'Keep it in a document: it is your base for everything else.' },
          ],
        },
        { note: { title: 'Ready-to-paste prompts', text: 'For one-off requests, here are 9 free prompts (SEO, social media, sales), with the 5-line formula to write your own.', href: PROMPTS, cta: 'See the 9 free prompts' } },
      ],
      faq: [
        { q: 'What is a master prompt?', a: 'It is a long prompt, written once, that describes the assistant’s role, your audience, your tone, its mission, its rules, the format of its answers and a few examples. You paste it at the start of the conversation and every following answer takes it into account.' },
        { q: 'How is it different from a simple prompt?', a: 'A prompt answers one specific request, once. A master prompt sets the frame once and for all: you no longer have to repeat your context with every request.' },
        { q: 'Does it work with ChatGPT, Claude and Gemini?', a: 'Yes. It is plain text, so it can be pasted into any assistant. Some tools also let you save it as permanent instructions: check your tool’s settings.' },
        { q: 'How long should it be?', a: 'Long enough to hold your 7 lines with details, short enough to stay clear. For a business, aim for 300 to 1,000 words. Beyond that, look for what is redundant.' },
      ],
      sources: [
        { label: 'Anthropic: Prompt engineering overview', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview' },
        { label: 'OpenAI: Prompt engineering guide', url: 'https://platform.openai.com/docs/guides/prompt-engineering' },
      ],
    },
  },

  'securite-site': {
    updated: UPDATED,
    fr: {
      seoTitle: 'Site sécurisé ? 7 points à vérifier',
      description: 'HTTPS, mises à jour, mots de passe, sauvegardes, extensions, pages légales : les 7 points à vérifier pour sécuriser votre site, avec une checklist gratuite.',
      takeaways: [
        'Les risques les plus fréquents sont simples à repérer : connexion sécurisée, mises à jour, accès, formulaires, sauvegardes, extensions, pages légales.',
        'Commencez par les accès et les sauvegardes : c’est là qu’une erreur coûte le plus cher.',
        'Un mot de passe long et unique par service, avec une double vérification, vaut mieux qu’un mot de passe changé souvent.',
        'Aucun site n’est invulnérable : l’objectif est de réduire les risques courants et de savoir quoi corriger en premier.',
      ],
      more: [
        {
          h: 'Votre plan d’action en 30 minutes',
          steps: [
            { t: 'Accès (10 min)', d: 'Un mot de passe long et unique par service, un gestionnaire de mots de passe, la double vérification partout où elle existe.' },
            { t: 'Sauvegardes (10 min)', d: 'Vérifiez qu’une copie récente existe, stockée ailleurs que sur le site, et que vous savez la restaurer.' },
            { t: 'Mises à jour (5 min)', d: 'Mettez à jour le site et les extensions, activez les mises à jour automatiques quand c’est possible.' },
            { t: 'Ménage (5 min)', d: 'Supprimez les extensions et les comptes que vous n’utilisez plus.' },
          ],
        },
      ],
      faq: [
        { q: 'Comment savoir si mon site est en HTTPS ?', a: 'Regardez la barre d’adresse : l’adresse commence par https et un cadenas apparaît. Vérifiez-le sur plusieurs pages, et vérifiez que le certificat n’est pas expiré.' },
        { q: 'Faut-il changer régulièrement ses mots de passe ?', a: 'Les recommandations de la CNIL privilégient des mots de passe longs et uniques par service, avec une double vérification, plutôt qu’un renouvellement périodique. Un gestionnaire de mots de passe aide à les retenir.' },
        { q: 'À quelle fréquence faire une sauvegarde ?', a: 'Au minimum chaque semaine pour un site qui change peu, plus souvent s’il reçoit des commandes ou des messages. Gardez toujours une copie hors du site, et testez la restauration.' },
        { q: 'Que faire si mon site est piraté ?', a: 'Changez immédiatement les mots de passe, restaurez une sauvegarde saine, mettez tout à jour et cherchez comment l’intrus est entré. Si des données personnelles sont concernées, renseignez-vous sur vos obligations auprès de la CNIL.' },
      ],
      sources: [
        { label: 'CNIL : sécurité des sites web, les 5 problèmes les plus souvent constatés', url: 'https://cnil.fr/fr/securite-des-sites-web-les-5-problemes-les-plus-souvent-constates' },
        { label: 'CNIL : mots de passe, recommandations pour maîtriser sa sécurité', url: 'https://cnil.fr/fr/mots-de-passe-recommandations-pour-maitriser-sa-securite' },
      ],
    },
    en: {
      seoTitle: 'Is your site secure? 7 checks',
      description: 'HTTPS, updates, passwords, backups, plugins, legal pages: the 7 checks to secure your website, with a free checklist.',
      takeaways: [
        'The most common risks are easy to spot: secure connection, updates, access, forms, backups, plugins, legal pages.',
        'Start with access and backups: that is where a mistake costs the most.',
        'A long, unique password per service with two-step verification beats a password changed often.',
        'No site is invulnerable: the goal is to reduce common risks and know what to fix first.',
      ],
      more: [
        {
          h: 'Your 30-minute action plan',
          steps: [
            { t: 'Access (10 min)', d: 'A long, unique password per service, a password manager, two-step verification wherever it exists.' },
            { t: 'Backups (10 min)', d: 'Check that a recent copy exists, stored somewhere other than on the site, and that you know how to restore it.' },
            { t: 'Updates (5 min)', d: 'Update the site and plugins, turn on automatic updates when possible.' },
            { t: 'Cleanup (5 min)', d: 'Delete plugins and accounts you no longer use.' },
          ],
        },
      ],
      faq: [
        { q: 'How do I know if my site uses HTTPS?', a: 'Look at the address bar: the address starts with https and a padlock appears. Check it on several pages, and make sure the certificate has not expired.' },
        { q: 'Should I change my passwords regularly?', a: 'The French data protection authority (CNIL) recommends long, unique passwords per service with two-step verification, rather than periodic renewal. A password manager helps you remember them.' },
        { q: 'How often should I make a backup?', a: 'At least weekly for a site that rarely changes, more often if it receives orders or messages. Always keep a copy off the site, and test the restore.' },
        { q: 'What should I do if my site is hacked?', a: 'Change all passwords immediately, restore a clean backup, update everything and find out how the intruder got in. If personal data is involved, check your obligations with your data protection authority.' },
      ],
      sources: [
        { label: 'CNIL: website security, the 5 most common problems', url: 'https://cnil.fr/fr/securite-des-sites-web-les-5-problemes-les-plus-souvent-constates' },
        { label: 'CNIL: passwords, recommendations to master your security', url: 'https://cnil.fr/fr/mots-de-passe-recommandations-pour-maitriser-sa-securite' },
      ],
    },
  },

  'branding-une-page': {
    updated: UPDATED,
    fr: {
      seoTitle: 'Branding en une page : les 5 questions',
      description: 'Le branding, ce n’est pas un logo : c’est une réponse nette à 5 questions. Écrivez votre phrase de positionnement en 30 minutes, avec un modèle gratuit.',
      takeaways: [
        'Le branding n’est pas un logo : c’est une réponse nette à quelques questions.',
        '5 questions : à qui je parle, quel problème je résous, ce que je fais, ce qui me distingue, comment je parle.',
        'La phrase de positionnement : « J’aide [qui] à [résultat] grâce à [ce que je fais]. »',
        'Un message clair rend vos contenus plus faciles à écrire, votre site plus lisible et vos prompts d’IA plus justes.',
      ],
      more: [
        {
          h: 'Avant et après : une phrase de positionnement',
          p: ['Avant : « Je fais du coaching pour tout le monde. » Flou, personne ne s’y reconnaît.', 'Après : « J’aide les indépendantes qui travaillent seules à retrouver 5 heures par semaine grâce à des routines et des outils simples. » On sait pour qui, pour quel résultat, et comment.'],
        },
        { note: { title: 'Transformer votre message en prompt', text: 'Une fois votre positionnement écrit, il devient le contexte de tous vos prompts : l’IA parle alors comme vous, à la bonne personne.', href: PROMPTS, cta: 'Voir les prompts' } },
      ],
      faq: [
        { q: 'Faut-il un logo pour avoir un branding ?', a: 'Non. Le logo n’est qu’un élément visuel. Le branding, c’est d’abord votre message : à qui vous parlez, ce que vous faites pour eux et ce qui vous distingue.' },
        { q: 'Comment savoir si mon positionnement est clair ?', a: 'Lisez votre phrase à voix haute à quelqu’un qui ne vous connaît pas. S’il peut la répéter avec ses mots, elle est claire. Sinon, simplifiez-la.' },
        { q: 'Combien de temps faut-il pour écrire son branding ?', a: 'Une première version tient en 30 minutes avec les 5 questions. Affinez-la ensuite en regardant ce que vos clients répondent à vos contenus.' },
        { q: 'Faut-il parler à tout le monde pour toucher plus de clients ?', a: 'Au contraire. Un message qui s’adresse à une personne précise est mieux compris et mieux retenu qu’un message pour « tout le monde ».' },
      ],
    },
    en: {
      seoTitle: 'Your branding on one page: the 5 key questions',
      description: 'Branding is not a logo: it is a clear answer to 5 questions. Write your positioning sentence in 30 minutes, with a free template.',
      takeaways: [
        'Branding is not a logo: it is a clear answer to a few questions.',
        '5 questions: who I talk to, what problem I solve, what I do, what sets me apart, how I speak.',
        'The positioning sentence: “I help [who] to [result] with [what I do].”',
        'A clear message makes your content easier to write, your site clearer and your AI prompts more accurate.',
      ],
      more: [
        {
          h: 'Before and after: a positioning sentence',
          p: ['Before: “I do coaching for everyone.” Blurry, nobody recognizes themselves in it.', 'After: “I help solo freelancers win back 5 hours a week with simple routines and tools.” We know who for, what result, and how.'],
        },
        { note: { title: 'Turn your message into a prompt', text: 'Once your positioning is written, it becomes the context of all your prompts: the AI then speaks like you, to the right person.', href: PROMPTS, cta: 'See the prompts' } },
      ],
      faq: [
        { q: 'Do I need a logo to have a brand?', a: 'No. A logo is only a visual element. Branding is first your message: who you talk to, what you do for them and what sets you apart.' },
        { q: 'How do I know if my positioning is clear?', a: 'Read your sentence aloud to someone who does not know you. If they can repeat it in their own words, it is clear. Otherwise, simplify it.' },
        { q: 'How long does it take to write your branding?', a: 'A first version takes 30 minutes with the 5 questions. Refine it afterwards by watching how your customers respond to your content.' },
        { q: 'Should I talk to everyone to reach more customers?', a: 'On the contrary. A message aimed at one specific person is better understood and better remembered than a message for “everyone”.' },
      ],
    },
  },

  'prospection-relances': {
    updated: UPDATED,
    fr: {
      seoTitle: 'Prospection et relances : 6 e-mails',
      description: 'Prospection, relance à 3 jours, après rendez-vous, devis sans réponse, facture en retard : les 4 règles et les 6 e-mails de suivi, avec les règles de la CNIL.',
      takeaways: [
        'L’argent se perd rarement au premier message : il se perd dans le suivi.',
        '4 règles : une seule action par message, moins de 100 mots, une phrase précise sur la personne, un calendrier de relances décidé à l’avance.',
        '6 moments à couvrir : premier message, relance à 3 jours, après un rendez-vous, devis sans réponse, dernière relance, facture en retard.',
        'En France, la prospection par e-mail est encadrée par la CNIL : vérifiez les règles et proposez toujours un moyen de se désinscrire.',
      ],
      more: [
        {
          h: 'Un calendrier de relance simple',
          steps: [
            { t: 'Jour 0 : premier message', d: 'Une phrase précise sur la personne, une proposition, une question facile.' },
            { t: 'Jour 3 : relance utile', d: 'Une information ou une réponse à une objection probable, pas un « avez-vous vu mon message ? ».' },
            { t: 'Jour 7 : preuve', d: 'Un résultat ou un cas client en deux phrases.' },
            { t: 'Jour 14 : clôture polie', d: 'Un dernier message qui laisse la porte ouverte, sans pression.' },
          ],
        },
        {
          note: {
            title: 'Respectez les règles de prospection',
            text: 'En France, la prospection par courrier électronique est encadrée : selon la situation, il faut un consentement préalable, ou, en B2B, un message en lien avec la fonction du destinataire avec un moyen simple de se désinscrire. Vérifiez la fiche de la CNIL avant de lancer une campagne.',
            href: PROMPTS,
            cta: 'Voir les prompts de vente',
          },
        },
      ],
      faq: [
        { q: 'Combien de relances faut-il envoyer ?', a: 'Trois à quatre messages espacés, par exemple aux jours 3, 7 et 14, suffisent en général. Chaque relance apporte quelque chose de nouveau (une information, une preuve) plutôt que de répéter le premier message.' },
        { q: 'Quelle longueur pour un e-mail de prospection ?', a: 'Moins de 100 mots, avec une seule question ou action. Un message court se lit en entier et se répond plus facilement.' },
        { q: 'Peut-on prospecter par e-mail sans l’accord de la personne ?', a: 'Les règles dépendent de la situation : consentement préalable pour les particuliers, et pour les professionnels un message en lien avec leur fonction, avec un moyen simple de se désinscrire. Consultez les fiches de la CNIL avant d’envoyer.' },
        { q: 'Peut-on automatiser les relances ?', a: 'Oui. Un outil ou un agent peut suivre qui a répondu, préparer les messages et les envoyer au bon moment. Vous gardez la main sur ce qui part et sur le ton.' },
      ],
      sources: [
        { label: 'CNIL : la prospection commerciale par courrier électronique, SMS-MMS et automate d’appel', url: 'https://www.cnil.fr/la-prospection-commerciale-par-courrier-electronique' },
        { label: 'CNIL : les règles d’or de la prospection par courrier électronique', url: 'https://cnil.fr/fr/les-regles-dor-de-la-prospection-par-courrier-electronique-0' },
      ],
    },
    en: {
      seoTitle: 'Prospecting and follow-ups: 6 emails',
      description: 'Prospecting, 3-day follow-up, after a meeting, unanswered quote, late invoice: the 4 rules and the 6 follow-up emails, with the French CNIL rules.',
      takeaways: [
        'Money is rarely lost at the first message: it is lost in the follow-up.',
        '4 rules: a single action per message, under 100 words, one specific sentence about the person, a follow-up calendar decided in advance.',
        '6 moments to cover: first message, 3-day follow-up, after a meeting, unanswered quote, last follow-up, late invoice.',
        'In France, email prospecting is regulated by the CNIL: check the rules and always offer a way to unsubscribe.',
      ],
      more: [
        {
          h: 'A simple follow-up calendar',
          steps: [
            { t: 'Day 0: first message', d: 'One specific sentence about the person, one proposal, an easy question.' },
            { t: 'Day 3: useful follow-up', d: 'A piece of information or an answer to a likely objection, not a “did you see my message?”.' },
            { t: 'Day 7: proof', d: 'A result or a client case in two sentences.' },
            { t: 'Day 14: polite close', d: 'A last message that leaves the door open, without pressure.' },
          ],
        },
        {
          note: {
            title: 'Respect prospecting rules',
            text: 'In France, email prospecting is regulated: depending on the situation, you need prior consent, or, for B2B, a message related to the recipient’s role with a simple way to unsubscribe. Check the CNIL guidance before launching a campaign.',
            href: PROMPTS,
            cta: 'See the sales prompts',
          },
        },
      ],
      faq: [
        { q: 'How many follow-ups should I send?', a: 'Three to four spaced messages, for example on days 3, 7 and 14, are usually enough. Each follow-up brings something new (information, proof) rather than repeating the first message.' },
        { q: 'How long should a prospecting email be?', a: 'Under 100 words, with a single question or action. A short message gets read in full and is easier to answer.' },
        { q: 'Can I prospect by email without the person’s consent?', a: 'The rules depend on the situation: prior consent for individuals, and for professionals a message related to their role with a simple way to unsubscribe. Check the CNIL guidance before sending.' },
        { q: 'Can follow-ups be automated?', a: 'Yes. A tool or an agent can track who replied, prepare messages and send them at the right time. You stay in control of what goes out and of the tone.' },
      ],
      sources: [
        { label: 'CNIL: commercial prospecting by email, SMS-MMS and automated calls (French)', url: 'https://www.cnil.fr/la-prospection-commerciale-par-courrier-electronique' },
        { label: 'CNIL: golden rules of email prospecting (French)', url: 'https://cnil.fr/fr/les-regles-dor-de-la-prospection-par-courrier-electronique-0' },
      ],
    },
  },
};

/** Fusionne les compléments dans l'article. */
export function withExtra(post: Post): Post {
  const ex = extras[post.slug];
  if (!ex) return post;
  const merge = (lang: 'fr' | 'en'): PostText => {
    const base = post[lang];
    const e = ex[lang];
    const sections = [...base.sections, ...(e.more ?? [])];
    return {
      ...base,
      seoTitle: e.seoTitle,
      description: e.description,
      takeaways: e.takeaways,
      faq: e.faq,
      sections,
      sources: [...(base.sources ?? []), ...(e.sources ?? [])],
    };
  };
  return { ...post, updated: ex.updated, fr: merge('fr'), en: merge('en') };
}
