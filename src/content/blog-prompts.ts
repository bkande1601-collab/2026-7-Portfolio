/**
 * Article « 9 prompts gratuits » : SEO, réseaux sociaux, vente.
 * Les [crochets] des prompts sont à remplacer par vos informations (ils sont colorés à l'écran).
 */
import type { Post } from './blog';

export const promptsPost: Post = {
  slug: 'prompts-gratuits-seo-reseaux-vente',
  date: '2026-11-01',
  minutes: 9,
  cover: { tone: 'violet', cutout: false },
  ogImage: '/og/prompts-gratuits.png',
  resource: 'guide-prompting-5-minutes',
  fr: {
    tag: 'Prompts gratuits',
    title: '9 prompts gratuits à copier-coller pour le SEO, les réseaux sociaux et la vente',
    seoTitle: '9 prompts gratuits : SEO, réseaux et vente',
    description: '9 prompts gratuits à copier-coller pour le SEO, les réseaux sociaux et la vente, avec la méthode pour bien prompter en 5 minutes et un guide PDF offert.',
    excerpt: 'SEO, réseaux sociaux, vente : 9 prompts prêts à coller dans ChatGPT, Claude ou Gemini, et la méthode pour écrire les vôtres en 5 minutes.',
    takeaways: [
      'Un bon prompt tient en 5 lignes : un rôle, un contexte, une tâche, un format, des contraintes.',
      '9 prompts prêts à coller : 3 pour le SEO, 3 pour les réseaux sociaux, 3 pour la vente.',
      'Remplacez les [crochets] par vos informations : plus vous donnez de contexte, meilleure est la réponse.',
      'Relisez toujours le résultat : l’IA propose, c’est vous qui décidez.',
    ],
    sections: [
      { p: ['Vous ouvrez ChatGPT, Claude ou Gemini, vous tapez une demande, et la réponse est… correcte, mais générique. Ce n’est pas l’outil : c’est la demande. Un prompt vague donne une réponse vague.', 'Voici 9 prompts que j’ai écrits pour vous, classés par usage : SEO, réseaux sociaux, vente. Ils sont gratuits, prêts à copier, et fonctionnent avec n’importe quel assistant IA. Juste après, la méthode pour écrire les vôtres en 5 minutes.'] },
      {
        h: 'Comment utiliser ces prompts',
        steps: [
          { t: 'Copiez le prompt', d: 'Le bouton « Copier » de chaque bloc copie le texte complet.' },
          { t: 'Remplacez les [crochets]', d: 'Ils sont colorés pour que vous ne les oubliiez pas. Plus vous donnez de détails (chiffres, exemples, ton), plus la réponse est utile.' },
          { t: 'Collez dans votre assistant IA', d: 'ChatGPT, Claude, Gemini ou un autre : peu importe.' },
          { t: 'Relisez et ajustez', d: 'Demandez une correction (« plus court », « plus direct », « avec un exemple ») plutôt que de tout recommencer.' },
        ],
      },
      {
        h: 'La formule en 5 lignes qui améliore n’importe quel prompt',
        p: ['Tous les prompts de cet article suivent la même structure. Retenez-la, vous pourrez écrire les vôtres :'],
        steps: [
          { t: 'Rôle', d: '« Tu es un rédacteur SEO senior. » Cela fixe le niveau d’expertise et le vocabulaire.' },
          { t: 'Contexte', d: 'Votre activité, votre cible, votre objectif. C’est ce qui rend la réponse personnelle.' },
          { t: 'Tâche', d: 'Ce que vous voulez, avec un verbe précis : analyse, écris, compare, classe.' },
          { t: 'Format', d: 'Tableau, liste numérotée, 3 versions… Sans format demandé, vous obtenez un pavé.' },
          { t: 'Contraintes', d: 'Longueur, ton, ce qu’il faut éviter. Les contraintes sont ce qui sépare un texte moyen d’un texte utilisable.' },
        ],
      },
      {
        h: 'Prompts SEO : écrire des contenus que Google comprend',
        p: ['Le SEO (référencement naturel) consiste à faire en sorte que vos pages apparaissent quand quelqu’un cherche ce que vous proposez. L’IA fait gagner du temps sur la structure et les formulations. La valeur, elle, vient de votre expérience : ajoutez toujours vos exemples et vos chiffres réels.'],
        prompts: [
          {
            title: '1. Le plan d’article optimisé',
            use: 'Avant d’écrire un article de blog ou une page : identifier ce que cherche vraiment le lecteur et construire un plan.',
            text: 'Tu es un rédacteur SEO senior francophone.\n\nContexte : je rédige un article pour [mon site], qui propose [produit ou service] à [cible].\nMot-clé principal : [mot-clé]. Mots-clés secondaires : [3 à 5 mots-clés].\n\nTâche : analyse l’intention de recherche derrière ce mot-clé (informationnelle, comparative ou transactionnelle), puis propose un plan d’article.\n\nFormat :\n1. L’intention de recherche en 2 phrases\n2. Un titre H1 de 60 caractères maximum, et 3 variantes\n3. Un plan avec 5 à 8 titres H2 et, si utile, des H3\n4. 5 questions à traiter dans une FAQ\n5. 3 idées de liens internes et 2 sources fiables à citer\n\nContraintes : ton [ton], aucun remplissage, chaque H2 répond à une vraie question du lecteur.',
            tip: 'Ajoutez à la fin : « Pose-moi d’abord 3 questions si une information te manque. » Les réponses seront plus justes.',
          },
          {
            title: '2. Les balises title et meta description',
            use: 'Pour qu’une page se démarque dans les résultats de Google et donne envie de cliquer.',
            text: 'Tu es spécialiste du référencement naturel et de la rédaction publicitaire.\n\nPage à optimiser : [URL ou description de la page].\nMot-clé principal : [mot-clé]. Cible : [cible].\n\nTâche : écris 8 balises title et 8 meta descriptions.\n\nContraintes :\n- title de 50 à 60 caractères, mot-clé au début\n- meta description de 140 à 155 caractères, avec une promesse claire et une incitation à cliquer\n- une variante avec un chiffre, une variante sous forme de question\n- aucun mot en majuscules\n\nFormat : un tableau Title | Nombre de caractères | Meta description | Nombre de caractères.\nTermine en recommandant les 2 meilleures combinaisons, avec une phrase d’explication chacune.',
            tip: 'Vérifiez le nombre de caractères : les assistants IA se trompent souvent dans leur comptage.',
          },
          {
            title: '3. L’audit d’un texte existant',
            use: 'Pour améliorer une page déjà en ligne qui ne se classe pas, sans tout réécrire.',
            text: 'Tu es un éditeur SEO exigeant.\n\nVoici le texte de ma page :\n"""\n[colle ton texte ici]\n"""\nMot-clé visé : [mot-clé]. Cible : [cible].\n\nTâche : fais un audit en 4 parties :\n(1) L’intention de recherche est-elle satisfaite ?\n(2) La structure (titres, paragraphes, lisibilité)\n(3) Ce qui manque par rapport aux contenus qui se classent bien sur ce sujet\n(4) Les 5 améliorations les plus rentables, classées par impact\n\nPour chaque amélioration, cite le passage à modifier et propose la nouvelle version.\n\nContraintes : ne réécris pas tout le texte, n’ajoute pas de mots-clés artificiellement, n’invente aucun chiffre.',
          },
        ],
      },
      {
        h: 'Prompts réseaux sociaux : publier sans partir de zéro',
        p: ['Le plus dur sur les réseaux, ce n’est pas d’écrire : c’est de savoir quoi publier, et de s’y tenir. Ces trois prompts règlent la planification, l’écriture et la réutilisation de ce que vous avez déjà.'],
        prompts: [
          {
            title: '4. Le calendrier éditorial sur 4 semaines',
            use: 'Pour savoir quoi publier chaque semaine et arrêter d’improviser.',
            text: 'Tu es mon directeur éditorial réseaux sociaux.\n\nMon activité : [activité]. Ma cible : [cible].\nMon objectif des 30 prochains jours : [objectif, par exemple obtenir 10 demandes de rendez-vous].\nPlateforme : [LinkedIn, Instagram ou TikTok]. Je peux publier [3] fois par semaine.\n\nTâche : propose un calendrier de 4 semaines construit sur 3 piliers de contenu : éduquer, prouver, vendre.\n\nFormat : un tableau Semaine | Jour | Pilier | Sujet | Accroche (1 phrase) | Format (texte, carrousel, vidéo) | Appel à l’action.\n\nContraintes : 60 % éduquer, 25 % prouver, 15 % vendre. Chaque sujet part d’un problème réel de ma cible. Ton : [ton].',
          },
          {
            title: '5. Le post LinkedIn à partir d’une idée',
            use: 'Quand vous avez une anecdote ou une idée, mais pas le temps de la transformer en post.',
            text: 'Tu es un ghostwriter LinkedIn.\n\nIdée du post : [idée ou anecdote].\nPublic : [cible]. Ce que je veux que le lecteur fasse ensuite : [action].\nUn chiffre réel que tu peux utiliser : [chiffre] (n’en invente aucun autre).\n\nTâche : écris 3 versions du post : A (récit), B (liste), C (opinion tranchée).\n\nContraintes :\n- première ligne de 12 mots maximum, qui donne envie de cliquer sur « voir plus »\n- phrases courtes, une seule idée par post\n- 120 à 180 mots\n- termine par une question ouverte\n- 3 hashtags maximum, à la fin\n- pas de formule « Dans un monde où… »',
            tip: 'Donnez un vrai chiffre ou une vraie anecdote : c’est ce qui sépare un post lu d’un post survolé.',
          },
          {
            title: '6. Un contenu transformé en 5 formats',
            use: 'Pour recycler un article, un e-mail ou une vidéo en plusieurs publications sans vous répéter.',
            text: 'Tu es stratège de contenu.\n\nVoici mon contenu d’origine :\n"""\n[article, e-mail ou transcription de vidéo]\n"""\n\nTâche : transforme-le en 5 contenus pour [plateforme(s)], sans te répéter :\n1. un post court\n2. un carrousel de 7 slides (un titre + une phrase par slide)\n3. un script de vidéo de 30 secondes\n4. une newsletter de 150 mots\n5. 3 stories avec une question à poser\n\nContraintes : garde mes idées et mes mots-clés, change l’angle à chaque format, et indique pour chaque contenu son rôle : attirer, convaincre ou fidéliser.',
          },
        ],
      },
      {
        h: 'Prompts de vente : prospecter, relancer, répondre aux objections',
        p: ['En vente, l’argent se perd rarement au premier message : il se perd dans le suivi. Ces prompts préparent les messages que l’on repousse parce qu’on ne sait pas comment les tourner.'],
        prompts: [
          {
            title: '7. Le message de prospection',
            use: 'Pour écrire un premier message court qui ne ressemble pas à du publipostage.',
            text: 'Tu es un commercial B2B expérimenté, direct mais chaleureux.\n\nMon offre : [offre en une phrase]. Ma cible : [poste] dans [secteur].\nSon problème principal : [problème]. Une preuve réelle que j’ai : [résultat client ou chiffre].\nUn détail sur cette personne : [détail].\n\nTâche : écris 3 messages de prospection pour [LinkedIn ou e-mail], de 80 mots maximum.\n\nContraintes :\n- commence par le détail sur la personne, pas par « Je me permets de vous contacter »\n- une seule proposition\n- termine par une question fermée, facile à répondre\n- aucun jargon\n\nFormat : 3 variantes, avec l’objet de l’e-mail pour chacune si besoin.',
          },
          {
            title: '8. La séquence de relance après un devis',
            use: 'Quand un devis reste sans réponse : relancer sans insister, au bon moment.',
            text: 'Tu es mon assistant commercial.\n\nContexte : j’ai envoyé un devis de [montant] pour [prestation] à [prénom], [poste], le [date]. Il n’a pas répondu. Ce qui comptait pour lui : [ses priorités].\n\nTâche : écris une séquence de 3 relances : J+2, J+5, J+10.\n\nContraintes :\n- relance 1 : utile (une information, ou la réponse à une objection probable)\n- relance 2 : preuve (un cas client ou un résultat)\n- relance 3 : clôture polie qui laisse la porte ouverte\n- 60 à 90 mots chacune, ton chaleureux, aucune pression\n- un seul appel à l’action par message',
            tip: 'Programmez les 3 messages dès l’envoi du devis : vous n’aurez plus à vous en souvenir.',
          },
          {
            title: '9. Les objections avant l’achat',
            use: 'Pour préparer votre page de vente ou vos rendez-vous : anticiper les « c’est trop cher » et « je vais réfléchir ».',
            text: 'Tu es un coach de vente qui connaît la psychologie d’achat.\n\nMon offre : [offre, prix, ce qui est inclus]. Ma cible : [cible].\n\nTâche : liste les 8 objections les plus probables avant l’achat (prix, confiance, timing, concurrence, « je vais réfléchir »…).\nPour chacune : ce que le client pense vraiment, une réponse honnête en 2 phrases, une question à poser pour creuser, et une preuve à montrer.\n\nFormat : un tableau. Termine par 3 phrases à ajouter sur ma page de vente pour répondre aux objections avant qu’elles n’apparaissent.\n\nContraintes : aucune promesse de résultat garanti, aucune fausse urgence.',
          },
        ],
      },
      {
        h: '6 réflexes pour améliorer n’importe quel prompt',
        list: [
          'Donnez un exemple de ce que vous attendez : un bon exemple vaut dix lignes d’explication.',
          'Demandez à l’IA de vous poser des questions avant de répondre, si une information manque.',
          'Imposez un format (tableau, liste, 3 versions) et une longueur.',
          'Précisez ce qu’il ne faut pas faire : « pas de jargon », « n’invente aucun chiffre ».',
          'Itérez : corrigez la réponse (« plus court », « plus concret ») au lieu de repartir de zéro.',
          'Gardez vos meilleurs prompts dans un document : vous construisez votre propre bibliothèque.',
        ],
      },
      {
        note: {
          title: 'Et si l’IA connaissait déjà votre activité ?',
          text: 'Remplacer les [crochets] à chaque fois prend du temps. Un master prompt contient une fois pour toutes votre activité, votre cible, votre ton et vos règles : vous le collez en début de conversation, et chaque réponse part de votre contexte.',
        },
      },
      { service: 'products/prompt' },
    ],
    callTitle: 'Envie d’aller plus vite ?',
    callText: 'Réservez un échange gratuit de 30 minutes : on regarde ensemble quels prompts et quelles automatisations vous feraient gagner le plus de temps.',
    faq: [
      { q: 'Quel outil d’IA utiliser avec ces prompts ?', a: 'N’importe lequel : ChatGPT, Claude, Gemini ou un autre assistant. Les prompts reposent sur une structure (rôle, contexte, tâche, format, contraintes), pas sur un outil. Testez le même prompt dans deux outils : vous verrez lequel convient le mieux à votre style.' },
      { q: 'Faut-il relire ce que l’IA écrit ?', a: 'Oui, toujours. L’IA peut se tromper, inventer un chiffre ou rester trop générale. Relisez, ajoutez vos exemples réels et vos chiffres, puis publiez. C’est ce travail de relecture qui donne de la valeur au texte final.' },
      { q: 'Peut-on utiliser ces prompts en anglais ?', a: 'Oui. Les prompts fonctionnent dans toutes les langues. Si vous voulez une réponse dans une langue précise, écrivez-le dans la tâche : « Réponds en français » ou « Reply in English ».' },
      { q: 'Combien de temps faut-il pour écrire un bon prompt ?', a: 'Environ 5 minutes avec la formule rôle, contexte, tâche, format, contraintes. Le guide PDF offert en bas de page détaille la méthode, avec des exemples avant et après.' },
      { q: 'Quelle différence entre un prompt et un master prompt ?', a: 'Un prompt répond à une demande précise, une seule fois. Un master prompt décrit une fois pour toutes votre activité, votre cible, votre ton et vos règles : vous le collez au début de la conversation et toutes les réponses suivantes en tiennent compte.' },
    ],
    sources: [
      { label: 'Anthropic : Prompt engineering overview', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview' },
      { label: 'OpenAI : Prompt engineering guide', url: 'https://platform.openai.com/docs/guides/prompt-engineering' },
      { label: 'Google Search Central : créer du contenu utile, fiable et centré sur les personnes', url: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content' },
    ],
  },
  en: {
    tag: 'Free prompts',
    title: '9 free copy-paste prompts for SEO, social media and sales',
    seoTitle: '9 free prompts: SEO, social media and sales',
    description: '9 free copy-paste prompts for SEO, social media and sales, plus the method to write a good prompt in 5 minutes and a free PDF guide.',
    excerpt: 'SEO, social media, sales: 9 prompts ready to paste into ChatGPT, Claude or Gemini, and the method to write your own in 5 minutes.',
    takeaways: [
      'A good prompt fits in 5 lines: a role, a context, a task, a format, constraints.',
      '9 ready-to-paste prompts: 3 for SEO, 3 for social media, 3 for sales.',
      'Replace the [brackets] with your own details: the more context you give, the better the answer.',
      'Always review the result: AI suggests, you decide.',
    ],
    sections: [
      { p: ['You open ChatGPT, Claude or Gemini, type a request, and the answer is… fine, but generic. It is not the tool: it is the request. A vague prompt gets a vague answer.', 'Here are 9 prompts I wrote for you, grouped by use: SEO, social media, sales. They are free, ready to copy, and work with any AI assistant. Right after, the method to write your own in 5 minutes.'] },
      {
        h: 'How to use these prompts',
        steps: [
          { t: 'Copy the prompt', d: 'The “Copy” button on each block copies the full text.' },
          { t: 'Replace the [brackets]', d: 'They are colored so you do not forget them. The more details you give (numbers, examples, tone), the more useful the answer.' },
          { t: 'Paste into your AI assistant', d: 'ChatGPT, Claude, Gemini or another: it does not matter.' },
          { t: 'Review and adjust', d: 'Ask for a fix (“shorter”, “more direct”, “with an example”) rather than starting over.' },
        ],
      },
      {
        h: 'The 5-line formula that improves any prompt',
        p: ['All the prompts in this article follow the same structure. Remember it and you can write your own:'],
        steps: [
          { t: 'Role', d: '“You are a senior SEO writer.” It sets the level of expertise and the vocabulary.' },
          { t: 'Context', d: 'Your business, your audience, your goal. This is what makes the answer personal.' },
          { t: 'Task', d: 'What you want, with a precise verb: analyze, write, compare, rank.' },
          { t: 'Format', d: 'Table, numbered list, 3 versions… Without a format, you get a wall of text.' },
          { t: 'Constraints', d: 'Length, tone, what to avoid. Constraints are what separates an average text from a usable one.' },
        ],
      },
      {
        h: 'SEO prompts: write content Google understands',
        p: ['SEO (search engine optimization) is about making your pages appear when someone searches for what you offer. AI saves time on structure and wording. The value, though, comes from your experience: always add your real examples and numbers.'],
        prompts: [
          {
            title: '1. The optimized article outline',
            use: 'Before writing a blog post or a page: work out what the reader is really looking for and build an outline.',
            text: 'You are a senior SEO writer.\n\nContext: I am writing an article for [my website], which offers [product or service] to [audience].\nMain keyword: [keyword]. Secondary keywords: [3 to 5 keywords].\n\nTask: analyze the search intent behind this keyword (informational, comparative or transactional), then propose an article outline.\n\nFormat:\n1. The search intent in 2 sentences\n2. An H1 title of 60 characters maximum, and 3 variants\n3. An outline with 5 to 8 H2 headings and, if useful, H3s\n4. 5 questions to cover in an FAQ\n5. 3 internal link ideas and 2 reliable sources to cite\n\nConstraints: [tone] tone, no filler, every H2 answers a real question from the reader.',
            tip: 'Add at the end: “Ask me 3 questions first if any information is missing.” The answers will be more accurate.',
          },
          {
            title: '2. Title tags and meta descriptions',
            use: 'So a page stands out in Google results and makes people want to click.',
            text: 'You are a specialist in SEO and advertising copywriting.\n\nPage to optimize: [URL or description of the page].\nMain keyword: [keyword]. Audience: [audience].\n\nTask: write 8 title tags and 8 meta descriptions.\n\nConstraints:\n- title of 50 to 60 characters, keyword first\n- meta description of 140 to 155 characters, with a clear promise and a reason to click\n- one variant with a number, one phrased as a question\n- no words in capital letters\n\nFormat: a table Title | Character count | Meta description | Character count.\nFinish by recommending the 2 best combinations, with one sentence of explanation each.',
            tip: 'Check the character count yourself: AI assistants often miscount.',
          },
          {
            title: '3. Audit of an existing text',
            use: 'To improve a page that is already online and not ranking, without rewriting everything.',
            text: 'You are a demanding SEO editor.\n\nHere is the text of my page:\n"""\n[paste your text here]\n"""\nTarget keyword: [keyword]. Audience: [audience].\n\nTask: run an audit in 4 parts:\n(1) Is the search intent satisfied?\n(2) Structure (headings, paragraphs, readability)\n(3) What is missing compared with content that ranks well on this topic\n(4) The 5 most profitable improvements, ranked by impact\n\nFor each improvement, quote the passage to change and propose the new version.\n\nConstraints: do not rewrite the whole text, do not stuff keywords, do not invent any figure.',
          },
        ],
      },
      {
        h: 'Social media prompts: publish without starting from zero',
        p: ['The hardest part of social media is not writing: it is knowing what to post, and sticking to it. These three prompts handle planning, writing and reusing what you already have.'],
        prompts: [
          {
            title: '4. The 4-week content calendar',
            use: 'To know what to post each week and stop improvising.',
            text: 'You are my social media editorial director.\n\nMy business: [business]. My audience: [audience].\nMy goal for the next 30 days: [goal, for example get 10 meeting requests].\nPlatform: [LinkedIn, Instagram or TikTok]. I can post [3] times a week.\n\nTask: propose a 4-week calendar built on 3 content pillars: educate, prove, sell.\n\nFormat: a table Week | Day | Pillar | Topic | Hook (1 sentence) | Format (text, carousel, video) | Call to action.\n\nConstraints: 60% educate, 25% prove, 15% sell. Every topic starts from a real problem of my audience. Tone: [tone].',
          },
          {
            title: '5. The LinkedIn post from an idea',
            use: 'When you have an anecdote or an idea but no time to turn it into a post.',
            text: 'You are a LinkedIn ghostwriter.\n\nPost idea: [idea or anecdote].\nAudience: [audience]. What I want the reader to do next: [action].\nOne real figure you can use: [figure] (do not invent any other).\n\nTask: write 3 versions of the post: A (story), B (list), C (strong opinion).\n\nConstraints:\n- first line of 12 words maximum, making people want to click “see more”\n- short sentences, one idea per post\n- 120 to 180 words\n- end with an open question\n- 3 hashtags maximum, at the end\n- no “In a world where…” openers',
            tip: 'Give a real number or a real anecdote: it is what separates a post that is read from one that is skimmed.',
          },
          {
            title: '6. One piece of content turned into 5 formats',
            use: 'To recycle an article, an email or a video into several posts without repeating yourself.',
            text: 'You are a content strategist.\n\nHere is my original content:\n"""\n[article, email or video transcript]\n"""\n\nTask: turn it into 5 pieces of content for [platform(s)], without repeating yourself:\n1. a short post\n2. a 7-slide carousel (a title + one sentence per slide)\n3. a 30-second video script\n4. a 150-word newsletter\n5. 3 stories with a question to ask\n\nConstraints: keep my ideas and my keywords, change the angle for each format, and state each piece’s role: attract, convince or retain.',
          },
        ],
      },
      {
        h: 'Sales prompts: prospect, follow up, handle objections',
        p: ['In sales, money is rarely lost at the first message: it is lost in the follow-up. These prompts prepare the messages we put off because we do not know how to word them.'],
        prompts: [
          {
            title: '7. The prospecting message',
            use: 'To write a short first message that does not read like a mass mailing.',
            text: 'You are an experienced B2B salesperson, direct but warm.\n\nMy offer: [offer in one sentence]. My target: [job title] in [industry].\nTheir main problem: [problem]. A real proof I have: [client result or figure].\nA detail about this person: [detail].\n\nTask: write 3 prospecting messages for [LinkedIn or email], 80 words maximum.\n\nConstraints:\n- start with the detail about the person, not with “I am reaching out to…”\n- a single proposal\n- end with a closed question that is easy to answer\n- no jargon\n\nFormat: 3 variants, with the email subject line for each if needed.',
          },
          {
            title: '8. The follow-up sequence after a quote',
            use: 'When a quote goes unanswered: follow up without pushing, at the right time.',
            text: 'You are my sales assistant.\n\nContext: I sent a quote of [amount] for [service] to [first name], [job title], on [date]. They have not replied. What mattered to them: [their priorities].\n\nTask: write a sequence of 3 follow-ups: day 2, day 5, day 10.\n\nConstraints:\n- follow-up 1: useful (a piece of information, or an answer to a likely objection)\n- follow-up 2: proof (a client case or a result)\n- follow-up 3: polite close that leaves the door open\n- 60 to 90 words each, warm tone, no pressure\n- a single call to action per message',
            tip: 'Schedule the 3 messages as soon as the quote goes out: you will no longer have to remember.',
          },
          {
            title: '9. Objections before the purchase',
            use: 'To prepare your sales page or your calls: anticipate “it is too expensive” and “let me think about it”.',
            text: 'You are a sales coach who understands buying psychology.\n\nMy offer: [offer, price, what is included]. My target: [audience].\n\nTask: list the 8 most likely objections before purchase (price, trust, timing, competition, “let me think about it”…).\nFor each: what the customer really thinks, an honest answer in 2 sentences, a question to dig deeper, and a proof to show.\n\nFormat: a table. Finish with 3 sentences to add to my sales page to answer objections before they appear.\n\nConstraints: no guaranteed-result promises, no fake urgency.',
          },
        ],
      },
      {
        h: '6 habits to improve any prompt',
        list: [
          'Give an example of what you expect: a good example is worth ten lines of explanation.',
          'Ask the AI to ask you questions before answering, if information is missing.',
          'Impose a format (table, list, 3 versions) and a length.',
          'Say what not to do: “no jargon”, “do not invent any figure”.',
          'Iterate: fix the answer (“shorter”, “more concrete”) instead of starting from scratch.',
          'Keep your best prompts in a document: you are building your own library.',
        ],
      },
      {
        note: {
          title: 'What if the AI already knew your business?',
          text: 'Replacing the [brackets] every time takes effort. A master prompt holds your business, audience, tone and rules once and for all: you paste it at the start of a conversation, and every answer starts from your context.',
        },
      },
      { service: 'products/prompt' },
    ],
    callTitle: 'Want to go faster?',
    callText: 'Book a free 30-minute call: we look together at which prompts and automations would save you the most time.',
    faq: [
      { q: 'Which AI tool should I use with these prompts?', a: 'Any of them: ChatGPT, Claude, Gemini or another assistant. The prompts rely on a structure (role, context, task, format, constraints), not on a tool. Try the same prompt in two tools: you will see which one suits your style best.' },
      { q: 'Do I need to review what the AI writes?', a: 'Yes, always. AI can be wrong, invent a figure or stay too generic. Review it, add your real examples and numbers, then publish. That review work is what gives the final text its value.' },
      { q: 'Can I use these prompts in French?', a: 'Yes. The prompts work in every language. If you want an answer in a specific language, say so in the task: “Reply in French” or “Réponds en anglais”.' },
      { q: 'How long does it take to write a good prompt?', a: 'About 5 minutes with the role, context, task, format, constraints formula. The free PDF guide at the bottom of the page details the method, with before and after examples.' },
      { q: 'What is the difference between a prompt and a master prompt?', a: 'A prompt answers one specific request, once. A master prompt describes your business, audience, tone and rules once and for all: you paste it at the start of the conversation and every following answer takes it into account.' },
    ],
    sources: [
      { label: 'Anthropic: Prompt engineering overview', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview' },
      { label: 'OpenAI: Prompt engineering guide', url: 'https://platform.openai.com/docs/guides/prompt-engineering' },
      { label: 'Google Search Central: creating helpful, reliable, people-first content', url: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content' },
    ],
  },
};
