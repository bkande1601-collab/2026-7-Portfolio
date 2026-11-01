#!/usr/bin/env node
/**
 * Génère le livre blanc « Bien prompter en 5 minutes » (FR et EN) avec pdfkit.
 * Usage : node scripts/build-whitepaper.mjs
 * Écrit public/ressources/guide-prompting-5-minutes-<fr|en>.pdf (envoyé par e-mail depuis le blog).
 */
import PDFDocument from 'pdfkit';
import { createWriteStream, readFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const C = { paper: '#fbf8f1', card: '#fbf7ee', violet: '#694cac', deep: '#3b2a63', lilas: '#e4d9f1', lilasStrong: '#c6b8e4', cannelle: '#8a4b36', warm: '#f3e3d6', text: '#2b1d16', muted: '#675549', line: '#e2d6c3', ok: '#2f7d4f', okBg: '#e2f1e6', term: '#1b1230', termBar: '#2a1d47' };
const W0 = 595.28, H0 = 841.89, M = 44, W = W0 - M * 2;
const LOGO = join(ROOT, 'design/logos/kit/png/logo-complet-blanc-1000px.png');

const clean = (s) => String(s ?? '').replace(/[   ]/g, ' ').replace(/[→➜]/g, '->').replace(/[^ -~¡-ÿ‘’“”–—•…€\n]/g, '').replace(/€ /g, '€  ');

/* ------------------------------------------------------------------ contenu */
const CONTENT = {
  fr: {
    file: 'guide-prompting-5-minutes-fr.pdf',
    title: 'Bien prompter en 5 minutes',
    sub: 'Le guide pratique pour obtenir des réponses utiles de ChatGPT, Claude ou Gemini',
    by: 'Par Binta Kande · bintakande.com',
    pageWord: 'Page', of: 'sur',
    sections: [
      { k: 'Avant de commencer', t: 'Pourquoi vos réponses sont génériques', blocks: [
        { p: 'Vous tapez une demande dans ChatGPT, Claude ou Gemini, et la réponse est correcte, mais banale. Le problème vient presque toujours de la demande, pas de l’outil : l’IA ne lit pas dans vos pensées, elle complète ce que vous lui donnez. Un prompt vague donne une réponse vague.' },
        { h: 'Les 3 causes les plus fréquentes' },
        { steps: [
          { t: 'Pas de contexte', d: 'L’IA ne sait pas qui vous êtes, à qui vous parlez, ni ce que vous vendez. Elle répond donc pour « tout le monde ».' },
          { t: 'Une consigne floue', d: '« Parle de mon service » ne dit pas quoi faire. « Écris 3 accroches de 12 mots » le dit.' },
          { t: 'Aucun format demandé', d: 'Sans format, vous obtenez un pavé. Avec un tableau, une liste ou 3 versions, vous obtenez quelque chose d’utilisable.' },
        ] },
        { callout: { title: 'La bonne nouvelle', text: 'Cinq lignes suffisent à corriger les trois problèmes. C’est la méthode de ce guide, et elle se pratique en 5 minutes.', tone: 'key' } },
        { h: 'Au sommaire' },
        { bullets: ['La méthode en 5 lignes : rôle, contexte, tâche, format, contraintes', 'Votre routine de 5 minutes, minute par minute', '10 astuces qui changent tout', '3 avant / après : SEO, réseaux sociaux, vente', 'Les 7 erreurs les plus courantes et la checklist avant d’envoyer', 'Un modèle vierge à compléter'] },
      ] },
      { k: 'La méthode', t: 'Les 5 lignes qui améliorent n’importe quel prompt', blocks: [
        { steps: [
          { t: 'Rôle', d: '« Tu es un rédacteur SEO senior. » Le rôle fixe le niveau d’expertise, le vocabulaire et l’angle.' },
          { t: 'Contexte', d: 'Votre activité, votre cible, votre objectif, vos chiffres. C’est la ligne qui rend la réponse personnelle.' },
          { t: 'Tâche', d: 'Ce que vous voulez, avec un verbe précis : analyse, écris, compare, classe, résume.' },
          { t: 'Format', d: 'Tableau, liste numérotée, 3 versions, 150 mots. Dites exactement à quoi doit ressembler la réponse.' },
          { t: 'Contraintes', d: 'Ton, longueur, ce qu’il faut éviter. Les contraintes séparent un texte moyen d’un texte utilisable.' },
        ] },
        { h: 'Exemple : avant et après' },
        { compare: { beforeLabel: 'Avant', before: 'Écris-moi un post LinkedIn sur mon service.', afterLabel: 'Après', after: 'Tu es un ghostwriter LinkedIn.\nContexte : je suis [métier] et j’aide [cible] à [résultat].\nTâche : écris un post à partir de cette anecdote : [anecdote].\nFormat : 3 versions (récit, liste, opinion).\nContraintes : 120 à 180 mots, première ligne de 12 mots maximum, une question à la fin, pas de formule creuse.' } },
        { callout: { title: 'À retenir', text: 'Rôle, Contexte, Tâche, Format, Contraintes. Si une réponse vous déçoit, cherchez laquelle des 5 lignes manquait.', tone: 'info' } },
      ] },
      { k: 'La routine', t: 'Votre routine de 5 minutes', blocks: [
        { p: 'Un bon prompt ne demande pas de talent : il demande une routine. Chronométrez-vous une fois, ensuite elle devient un réflexe.' },
        { steps: [
          { t: 'Minute 1 : l’objectif', d: 'Finissez cette phrase : « À la fin, je veux… ». Une seule demande par prompt, un seul objectif.' },
          { t: 'Minute 2 : le contexte', d: 'Rassemblez 3 informations : votre cible, votre offre, votre ton. Ajoutez un exemple de ce que vous aimez si vous en avez un.' },
          { t: 'Minute 3 : les 5 lignes', d: 'Écrivez le rôle, le contexte, la tâche, le format, les contraintes. Remplacez tout ce qui est vague par un chiffre ou un exemple.' },
          { t: 'Minute 4 : lancer et lire', d: 'Envoyez, lisez la réponse, et notez en une phrase ce qui manque ou ce qui ne va pas.' },
          { t: 'Minute 5 : corriger et garder', d: 'Corrigez en une phrase (« plus court », « plus concret », « avec un exemple »). Quand ça marche, copiez le prompt dans votre bibliothèque.' },
        ] },
        { callout: { title: 'Règle d’or', text: 'Une demande, un objectif. Si votre prompt contient trois demandes, faites trois prompts : les réponses seront meilleures.', tone: 'warm' } },
        { h: 'Votre bibliothèque de prompts' },
        { p: 'Créez un document (Notion, Google Docs, notes) avec trois colonnes : le besoin, le prompt qui marche, la date de dernière amélioration. Au bout d’un mois, vous aurez 10 prompts qui font gagner des heures chaque semaine.' },
      ] },
      { k: 'Les astuces', t: '10 astuces qui changent tout', blocks: [
        { tips: [
          ['1. Donnez un exemple', 'Montrez ce que vous attendez : « Voici un post que j’ai aimé : [exemple]. Écris dans ce style. »'],
          ['2. Demandez des questions', '« Avant de répondre, pose-moi 3 questions si une information te manque. »'],
          ['3. Imposez un format', '« Réponds sous forme de tableau : Idée | Public | Accroche. »'],
          ['4. Fixez une longueur', '« 120 à 150 mots », « 5 puces maximum », « une phrase par slide ».'],
          ['5. Dites ce qu’il ne faut pas faire', '« Pas de jargon. N’invente aucun chiffre. Pas de formule d’introduction. »'],
          ['6. Faites raisonner pas à pas', '« Réfléchis étape par étape avant de donner ta réponse finale. »'],
          ['7. Demandez plusieurs versions', '« Propose 3 versions : sobre, directe, chaleureuse. » Vous choisissez, vous n’inventez pas.'],
          ['8. Faites critiquer', '« Relis ta réponse comme un lecteur sceptique et corrige ses faiblesses. »'],
          ['9. Découpez les tâches complexes', 'D’abord le plan, ensuite chaque partie, ensuite la relecture : trois prompts valent mieux qu’un énorme.'],
          ['10. Collez votre contexte une fois', 'Un master prompt décrit votre activité, votre cible et votre ton : vous le collez en début de conversation et chaque réponse en tient compte.'],
        ] },
      ] },
      { k: 'En pratique', t: '3 avant / après : SEO, réseaux sociaux, vente', blocks: [
        { h: 'SEO : un plan d’article' },
        { compare: { beforeLabel: 'Avant', before: 'Donne-moi des idées d’articles sur mon métier.', afterLabel: 'Après', after: 'Tu es un rédacteur SEO senior.\nContexte : mon site vend [service] à [cible]. Mot-clé : [mot-clé].\nTâche : analyse l’intention de recherche, puis propose un plan.\nFormat : titre H1 (60 caractères), 6 titres H2, 5 questions de FAQ.\nContraintes : chaque H2 répond à une vraie question du lecteur.' } },
        { h: 'Réseaux sociaux : un calendrier' },
        { compare: { beforeLabel: 'Avant', before: 'Fais-moi un calendrier de contenu.', afterLabel: 'Après', after: 'Tu es mon directeur éditorial.\nContexte : [activité], cible [cible], objectif [objectif], 3 publications par semaine sur [plateforme].\nTâche : calendrier de 4 semaines sur 3 piliers (éduquer, prouver, vendre).\nFormat : tableau Semaine | Sujet | Accroche | Format | Appel à l’action.\nContraintes : 60 % éduquer, 25 % prouver, 15 % vendre.' } },
        { h: 'Vente : une relance de devis' },
        { compare: { beforeLabel: 'Avant', before: 'Écris une relance pour un client.', afterLabel: 'Après', after: 'Tu es mon assistant commercial.\nContexte : devis de [montant] envoyé à [prénom] le [date], sans réponse. Sa priorité : [priorité].\nTâche : 3 relances (J+2, J+5, J+10).\nContraintes : utile, puis preuve, puis clôture polie ; 60 à 90 mots ; aucune pression ; un seul appel à l’action.' } },
      ] },
      { k: 'À éviter', t: 'Les 7 erreurs les plus courantes', blocks: [
        { steps: [
          { t: 'Tout demander en une fois', d: 'Trois demandes dans un prompt donnent trois réponses moyennes. Découpez.' },
          { t: 'Oublier le contexte', d: 'Sans cible ni objectif, l’IA répond pour tout le monde, donc pour personne.' },
          { t: 'Rester sur la première réponse', d: 'La première version est un brouillon. Corrigez en une phrase plutôt que de repartir de zéro.' },
          { t: 'Ne pas vérifier les chiffres', d: 'L’IA peut inventer un chiffre ou une source. Vérifiez, ou dites-lui de n’utiliser que les vôtres.' },
          { t: 'Copier-coller sans relire', d: 'Ajoutez vos exemples, votre voix, vos faits : c’est ce qui rend le texte vôtre.' },
          { t: 'Donner des informations confidentielles', d: 'Pas de mots de passe, de données clients nominatives ni de documents sensibles dans un outil public.' },
          { t: 'Ne rien sauvegarder', d: 'Un prompt qui marche se garde. Sinon vous le réécrivez chaque semaine.' },
        ] },
        { h: 'Checklist avant d’envoyer' },
        { checks: ['J’ai donné un rôle à l’IA', 'J’ai décrit mon contexte (activité, cible, objectif)', 'Ma tâche commence par un verbe précis', 'J’ai demandé un format (tableau, liste, versions)', 'J’ai fixé une longueur et un ton', 'J’ai dit ce qu’il ne faut pas faire'] },
      ] },
      { k: 'Pour finir', t: 'Votre modèle à compléter', blocks: [
        { p: 'Copiez ce modèle dans votre bibliothèque et remplacez les [crochets]. Vous pouvez le réutiliser pour presque toutes vos demandes.' },
        { code: { label: 'modele-prompt.txt', text: 'Tu es [rôle : expert, métier, niveau].\n\nContexte : [mon activité], [ma cible], [mon objectif], [ce que j’ai déjà essayé].\n\nTâche : [verbe précis] [ce que je veux].\n\nFormat : [tableau / liste numérotée / 3 versions / nombre de mots].\n\nContraintes : [ton], [longueur], [ce qu’il faut éviter].\n\nAvant de répondre, pose-moi 3 questions si une information te manque.' } },
        { h: 'Petit glossaire' },
        { bullets: ['Prompt : la demande que vous écrivez à l’IA.', 'Contexte : les informations que vous donnez pour que la réponse parte de votre situation.', 'Hallucination : une information inventée par l’IA, présentée comme vraie. D’où l’importance de vérifier.', 'Master prompt : un prompt long, écrit une fois, qui décrit votre activité, votre cible, votre ton et vos règles.'] },
        { callout: { title: 'Et maintenant ?', text: 'Vous voulez que l’IA connaisse déjà votre activité ? Mon master prompt est écrit sur mesure à partir de vos réponses, prêt à coller dans votre outil. Pour voir ce qui vous ferait gagner le plus de temps, réservez un échange gratuit de 30 minutes.', tone: 'key' } },
        { links: [['Master prompt sur mesure', 'bintakande.com/fr/products/prompt'], ['Diagnostic IA de votre business', 'bintakande.com/fr/products/diagnostic'], ['Réserver un échange gratuit', 'bintakande.com/fr/book']] },
      ] },
    ],
  },
  en: {
    file: 'guide-prompting-5-minutes-en.pdf',
    title: 'Write a good prompt in 5 minutes',
    sub: 'The practical guide to getting useful answers from ChatGPT, Claude or Gemini',
    by: 'By Binta Kande · bintakande.com',
    pageWord: 'Page', of: 'of',
    sections: [
      { k: 'Before you start', t: 'Why your answers are generic', blocks: [
        { p: 'You type a request into ChatGPT, Claude or Gemini and the answer is fine, but bland. The problem almost always comes from the request, not the tool: AI does not read your mind, it completes what you give it. A vague prompt gets a vague answer.' },
        { h: 'The 3 most common causes' },
        { steps: [
          { t: 'No context', d: 'The AI does not know who you are, who you are talking to, or what you sell. So it answers for “everyone”.' },
          { t: 'A vague instruction', d: '“Talk about my service” does not say what to do. “Write 3 hooks of 12 words” does.' },
          { t: 'No format requested', d: 'Without a format you get a wall of text. With a table, a list or 3 versions, you get something usable.' },
        ] },
        { callout: { title: 'The good news', text: 'Five lines are enough to fix all three problems. That is the method in this guide, and it takes 5 minutes to practise.', tone: 'key' } },
        { h: 'In this guide' },
        { bullets: ['The 5-line method: role, context, task, format, constraints', 'Your 5-minute routine, minute by minute', '10 tips that change everything', '3 before / after examples: SEO, social media, sales', 'The 7 most common mistakes and the pre-send checklist', 'A blank template to fill in'] },
      ] },
      { k: 'The method', t: 'The 5 lines that improve any prompt', blocks: [
        { steps: [
          { t: 'Role', d: '“You are a senior SEO writer.” The role sets the level of expertise, the vocabulary and the angle.' },
          { t: 'Context', d: 'Your business, your audience, your goal, your numbers. This is the line that makes the answer personal.' },
          { t: 'Task', d: 'What you want, with a precise verb: analyze, write, compare, rank, summarize.' },
          { t: 'Format', d: 'Table, numbered list, 3 versions, 150 words. Say exactly what the answer should look like.' },
          { t: 'Constraints', d: 'Tone, length, what to avoid. Constraints separate an average text from a usable one.' },
        ] },
        { h: 'Example: before and after' },
        { compare: { beforeLabel: 'Before', before: 'Write me a LinkedIn post about my service.', afterLabel: 'After', after: 'You are a LinkedIn ghostwriter.\nContext: I am a [job] and I help [audience] to [result].\nTask: write a post from this anecdote: [anecdote].\nFormat: 3 versions (story, list, opinion).\nConstraints: 120 to 180 words, first line of 12 words maximum, a question at the end, no empty phrases.' } },
        { callout: { title: 'Remember', text: 'Role, Context, Task, Format, Constraints. If an answer disappoints you, look for which of the 5 lines was missing.', tone: 'info' } },
      ] },
      { k: 'The routine', t: 'Your 5-minute routine', blocks: [
        { p: 'A good prompt does not take talent: it takes a routine. Time yourself once, then it becomes a reflex.' },
        { steps: [
          { t: 'Minute 1: the goal', d: 'Finish this sentence: “At the end, I want…”. One request per prompt, one goal.' },
          { t: 'Minute 2: the context', d: 'Gather 3 pieces of information: your audience, your offer, your tone. Add an example of what you like if you have one.' },
          { t: 'Minute 3: the 5 lines', d: 'Write the role, context, task, format, constraints. Replace anything vague with a number or an example.' },
          { t: 'Minute 4: run and read', d: 'Send it, read the answer, and note in one sentence what is missing or wrong.' },
          { t: 'Minute 5: fix and keep', d: 'Fix it in one sentence (“shorter”, “more concrete”, “with an example”). When it works, copy the prompt into your library.' },
        ] },
        { callout: { title: 'Golden rule', text: 'One request, one goal. If your prompt contains three requests, write three prompts: the answers will be better.', tone: 'warm' } },
        { h: 'Your prompt library' },
        { p: 'Create a document (Notion, Google Docs, notes) with three columns: the need, the prompt that works, the date of the last improvement. After a month you will have 10 prompts that save hours every week.' },
      ] },
      { k: 'The tips', t: '10 tips that change everything', blocks: [
        { tips: [
          ['1. Give an example', 'Show what you expect: “Here is a post I liked: [example]. Write in this style.”'],
          ['2. Ask for questions', '“Before answering, ask me 3 questions if any information is missing.”'],
          ['3. Impose a format', '“Answer as a table: Idea | Audience | Hook.”'],
          ['4. Set a length', '“120 to 150 words”, “5 bullet points maximum”, “one sentence per slide”.'],
          ['5. Say what not to do', '“No jargon. Do not invent any figure. No introductory phrase.”'],
          ['6. Make it reason step by step', '“Think step by step before giving your final answer.”'],
          ['7. Ask for several versions', '“Give 3 versions: restrained, direct, warm.” You choose, you do not invent.'],
          ['8. Ask for a critique', '“Reread your answer as a skeptical reader and fix its weaknesses.”'],
          ['9. Split complex tasks', 'First the outline, then each part, then the review: three prompts beat one huge one.'],
          ['10. Paste your context once', 'A master prompt describes your business, audience and tone: you paste it at the start of the conversation and every answer takes it into account.'],
        ] },
      ] },
      { k: 'In practice', t: '3 before / after examples: SEO, social media, sales', blocks: [
        { h: 'SEO: an article outline' },
        { compare: { beforeLabel: 'Before', before: 'Give me article ideas about my trade.', afterLabel: 'After', after: 'You are a senior SEO writer.\nContext: my site sells [service] to [audience]. Keyword: [keyword].\nTask: analyze the search intent, then propose an outline.\nFormat: H1 title (60 characters), 6 H2 headings, 5 FAQ questions.\nConstraints: every H2 answers a real question from the reader.' } },
        { h: 'Social media: a calendar' },
        { compare: { beforeLabel: 'Before', before: 'Make me a content calendar.', afterLabel: 'After', after: 'You are my editorial director.\nContext: [business], audience [audience], goal [goal], 3 posts a week on [platform].\nTask: 4-week calendar on 3 pillars (educate, prove, sell).\nFormat: table Week | Topic | Hook | Format | Call to action.\nConstraints: 60% educate, 25% prove, 15% sell.' } },
        { h: 'Sales: a quote follow-up' },
        { compare: { beforeLabel: 'Before', before: 'Write a follow-up for a client.', afterLabel: 'After', after: 'You are my sales assistant.\nContext: quote of [amount] sent to [first name] on [date], no reply. Their priority: [priority].\nTask: 3 follow-ups (day 2, day 5, day 10).\nConstraints: useful, then proof, then polite close; 60 to 90 words; no pressure; a single call to action.' } },
      ] },
      { k: 'Pitfalls', t: 'The 7 most common mistakes', blocks: [
        { steps: [
          { t: 'Asking everything at once', d: 'Three requests in one prompt give three average answers. Split them.' },
          { t: 'Forgetting the context', d: 'Without audience or goal, the AI answers for everyone, so for no one.' },
          { t: 'Stopping at the first answer', d: 'The first version is a draft. Fix it in one sentence instead of starting over.' },
          { t: 'Not checking the numbers', d: 'AI can invent a figure or a source. Check, or tell it to use only yours.' },
          { t: 'Copy-pasting without reading', d: 'Add your examples, your voice, your facts: that is what makes the text yours.' },
          { t: 'Sharing confidential information', d: 'No passwords, named client data or sensitive documents in a public tool.' },
          { t: 'Saving nothing', d: 'A prompt that works is worth keeping. Otherwise you rewrite it every week.' },
        ] },
        { h: 'Pre-send checklist' },
        { checks: ['I gave the AI a role', 'I described my context (business, audience, goal)', 'My task starts with a precise verb', 'I asked for a format (table, list, versions)', 'I set a length and a tone', 'I said what not to do'] },
      ] },
      { k: 'To finish', t: 'Your template to fill in', blocks: [
        { p: 'Copy this template into your library and replace the [brackets]. You can reuse it for almost every request.' },
        { code: { label: 'prompt-template.txt', text: 'You are [role: expert, job, level].\n\nContext: [my business], [my audience], [my goal], [what I have already tried].\n\nTask: [precise verb] [what I want].\n\nFormat: [table / numbered list / 3 versions / word count].\n\nConstraints: [tone], [length], [what to avoid].\n\nBefore answering, ask me 3 questions if any information is missing.' } },
        { h: 'Mini glossary' },
        { bullets: ['Prompt: the request you write to the AI.', 'Context: the information you give so the answer starts from your situation.', 'Hallucination: information invented by the AI and presented as true. Hence the need to check.', 'Master prompt: a long prompt, written once, describing your business, audience, tone and rules.'] },
        { callout: { title: 'What now?', text: 'Want the AI to already know your business? My master prompt is written for you from your answers, ready to paste into your tool. To see what would save you the most time, book a free 30-minute call.', tone: 'key' } },
        { links: [['Custom master prompt', 'bintakande.com/en/products/prompt'], ['AI diagnostic of your business', 'bintakande.com/en/products/diagnostic'], ['Book a free call', 'bintakande.com/en/book']] },
      ] },
    ],
  },
};

/* ------------------------------------------------------------------ rendu */
function build(lang) {
  const D = CONTENT[lang];
  const doc = new PDFDocument({ size: 'A4', margin: M, bufferPages: true, info: { Title: D.title, Author: 'Binta Kande' } });
  const out = join(ROOT, 'public', 'ressources', D.file);
  mkdirSync(dirname(out), { recursive: true });
  doc.pipe(createWriteStream(out));
  const bottom = H0 - 60;
  let y = M;
  const paper = () => doc.rect(0, 0, W0, H0).fill(C.paper);
  const font = (n) => doc.font({ r: 'Helvetica', b: 'Helvetica-Bold', i: 'Helvetica-Oblique', m: 'Courier' }[n]);
  const h = (t, size, w, f = 'r', gap = 2) => { font(f).fontSize(size); return doc.heightOfString(clean(t), { width: w, lineGap: gap }); };
  const text = (t, x, yy, w, size, color, f = 'r', gap = 2, o = {}) => { font(f).fontSize(size).fillColor(color).text(clean(t), x, yy, { width: w, lineGap: gap, ...o }); };
  const newPage = () => { doc.addPage(); paper(); doc.rect(0, 0, W0, 8).fill(C.violet); y = 40; };
  const ensure = (n) => { if (y + n > bottom) newPage(); };

  /* couverture */
  paper();
  doc.rect(0, 0, W0, H0).fill(C.deep);
  doc.circle(W0 - 40, 120, 190).fill('#4a3578');
  doc.circle(60, H0 - 60, 160).fill('#33245a');
  doc.rect(0, 0, W0, 10).fill(C.violet);
  try { doc.image(readFileSync(LOGO), M, 56, { width: 190 }); } catch { text('Binta Kande', M, 60, 300, 20, '#fbf7ee', 'b'); }
  const tw = 60 + (lang === 'fr' ? 94 : 112);
  doc.roundedRect(M, 250, tw + 30, 26, 13).fill(C.lilasStrong);
  text((lang === 'fr' ? 'Livre blanc' : 'White paper').toUpperCase(), M + 14, 257, 300, 9.5, C.deep, 'b', 2, { characterSpacing: 1.4 });
  text(D.title, M, 300, W - 40, 44, '#fbf7ee', 'b', 4);
  const th = h(D.title, 44, W - 40, 'b', 4);
  text(D.sub, M, 300 + th + 20, W - 80, 16, C.lilasStrong, 'r', 4);
  text(D.by, M, H0 - 90, W, 12, C.lilasStrong, 'r');
  doc.rect(M, H0 - 110, 80, 3).fill(C.violet);

  /* contenu */
  D.sections.forEach((sec, si) => {
    newPage();
    text(sec.k.toUpperCase(), M, y, W, 9.5, C.violet, 'b', 2, { characterSpacing: 1.3 }); y += 16;
    text(sec.t, M, y, W, 26, C.deep, 'b', 3); y += h(sec.t, 26, W, 'b', 3) + 16;
    doc.rect(M, y - 6, 56, 3).fill(C.violet); y += 10;
    for (const b of sec.blocks) {
      if (b.h) { ensure(60); text(b.h, M, y, W, 14, C.deep, 'b'); y += 22; }
      if (b.p) { const ph = h(b.p, 11, W, 'r', 3); ensure(ph + 8); text(b.p, M, y, W, 11, C.text, 'r', 3); y += ph + 12; }
      if (b.bullets) for (const it of b.bullets) { const ih = h(it, 10.5, W - 22, 'r', 2.5); ensure(ih + 6); doc.circle(M + 5, y + 6, 2.6).fill(C.violet); text(it, M + 18, y, W - 22, 10.5, C.text, 'r', 2.5); y += ih + 6; }
      if (b.bullets) y += 6;
      if (b.checks) for (const it of b.checks) { const ih = h(it, 10.5, W - 34, 'r', 2.5); ensure(ih + 8); doc.roundedRect(M + 1, y + 1, 12, 12, 3).lineWidth(1.3).stroke(C.violet); text(it, M + 24, y, W - 34, 10.5, C.text, 'r', 2.5); y += Math.max(ih, 14) + 7; }
      if (b.steps) for (let i = 0; i < b.steps.length; i++) {
        const s = b.steps[i]; const dh = h(s.d, 10.5, W - 66, 'r', 2.5); const sh = h(s.t, 12, W - 66, 'b') + dh + 18;
        ensure(sh + 6);
        doc.roundedRect(M, y, W, sh, 12).fill(C.card);
        doc.roundedRect(M, y, W, sh, 12).lineWidth(0.8).stroke(C.line);
        doc.circle(M + 24, y + sh / 2, 15).fill(C.violet);
        text(String(i + 1), M + 9, y + sh / 2 - 7, 30, 13, '#fbf7ee', 'b', 0, { align: 'center' });
        text(s.t, M + 52, y + 8, W - 66, 12, C.deep, 'b');
        text(s.d, M + 52, y + 10 + h(s.t, 12, W - 66, 'b'), W - 66, 10.5, C.muted, 'r', 2.5);
        y += sh + 8;
      }
      if (b.tips) for (const [t, d] of b.tips) {
        const dh = h(d, 10.5, W - 36, 'r', 2.5); const sh = h(t, 12, W - 36, 'b') + dh + 22;
        ensure(sh + 6);
        doc.roundedRect(M, y, W, sh, 12).fill(C.card); doc.roundedRect(M, y, W, sh, 12).lineWidth(0.8).stroke(C.line);
        doc.rect(M, y + 12, 4, sh - 24).fill(C.violet);
        text(t, M + 20, y + 10, W - 36, 12, C.deep, 'b');
        text(d, M + 20, y + 12 + h(t, 12, W - 36, 'b'), W - 36, 10.5, C.muted, 'i', 2.5);
        y += sh + 7;
      }
      if (b.callout) {
        const co = b.callout; const tone = { key: [C.deep, '#fbf7ee', C.lilasStrong], info: [C.lilas, C.deep, C.violet], warm: [C.warm, '#4a2a1d', C.cannelle], ok: [C.okBg, '#1c4a30', C.ok] }[co.tone];
        const ch = h(co.title, 13, W - 44, 'b') + h(co.text, 10.5, W - 44, 'r', 3) + 36;
        ensure(ch + 8);
        doc.roundedRect(M, y, W, ch, 14).fill(tone[0]); doc.rect(M, y + 14, 5, ch - 28).fill(tone[2]);
        text(co.title, M + 22, y + 14, W - 44, 13, tone[1], 'b');
        text(co.text, M + 22, y + 16 + h(co.title, 13, W - 44, 'b'), W - 44, 10.5, tone[1], 'r', 3);
        y += ch + 14;
      }
      if (b.code) {
        const cd = b.code, SZ = 9.5, LH = 13.4, CW = SZ * 0.6, inner = W - 40;
        const maxCh = Math.floor(inner / CW);
        // retour à la ligne manuel (Courier est à chasse fixe) en gardant la couleur des [crochets]
        const lines = [];
        for (const raw of clean(cd.text).split('\n')) {
          const chars = []; let hot = false;
          for (const ch of raw) { if (ch === '[') hot = true; chars.push({ ch, hot }); if (ch === ']') hot = false; }
          if (!chars.length) { lines.push([]); continue; }
          let cur = [];
          let i = 0;
          while (i < chars.length) {
            let j = i; while (j < chars.length && chars[j].ch !== ' ') j++;
            const word = chars.slice(i, j); const sp = cur.length ? 1 : 0;
            if (cur.length + sp + word.length > maxCh && cur.length) { lines.push(cur); cur = []; }
            if (cur.length) cur.push({ ch: ' ', hot: false });
            cur.push(...word); i = j + 1;
          }
          lines.push(cur);
        }
        const ch = lines.length * LH + 56;
        ensure(ch + 8);
        doc.roundedRect(M, y, W, ch, 12).fill(C.term);
        doc.roundedRect(M, y, W, 28, 12).fill(C.termBar); doc.rect(M, y + 14, W, 14).fill(C.termBar);
        ['#e5675b', '#e9b949', '#5fd19a'].forEach((c, i) => doc.circle(M + 16 + i * 14, y + 14, 4).fill(c));
        text(cd.label, M + 62, y + 9, 300, 8.5, '#b3a5d6', 'm');
        let yy = y + 42;
        font('m').fontSize(SZ);
        for (const ln of lines) {
          let k = 0;
          while (k < ln.length) {
            let e = k; while (e < ln.length && ln[e].hot === ln[k].hot) e++;
            doc.fillColor(ln[k].hot ? '#ffd98a' : '#e9e0f7').text(ln.slice(k, e).map((c) => c.ch).join(''), M + 20 + k * CW, yy, { lineBreak: false });
            k = e;
          }
          yy += LH;
        }
        y += ch + 12;
      }
      if (b.compare) {
        const cp = b.compare; const cw = (W - 12) / 2;
        const bh = h(cp.before, 10, cw - 32, 'r', 3); const ah = h(cp.after, 9, cw - 32, 'm', 3);
        const ch = Math.max(bh, ah) + 50;
        ensure(ch + 8);
        doc.roundedRect(M, y, cw, ch, 12).fill(C.warm); doc.roundedRect(M + cw + 12, y, cw, ch, 12).fill(C.okBg);
        text(cp.beforeLabel.toUpperCase(), M + 16, y + 14, cw - 32, 8, C.cannelle, 'b', 2, { characterSpacing: 1.2 });
        text(cp.before, M + 16, y + 32, cw - 32, 10, C.text, 'r', 3);
        text(cp.afterLabel.toUpperCase(), M + cw + 28, y + 14, cw - 32, 8, C.ok, 'b', 2, { characterSpacing: 1.2 });
        text(cp.after, M + cw + 28, y + 32, cw - 32, 9, '#1c4a30', 'm', 3);
        y += ch + 12;
      }
      if (b.links) {
        ensure(40 + b.links.length * 22);
        for (const [l, u] of b.links) { doc.roundedRect(M, y, W, 32, 10).fill(C.card); doc.roundedRect(M, y, W, 32, 10).lineWidth(0.8).stroke(C.line); text(l, M + 16, y + 10, W / 2, 11, C.deep, 'b'); text(u, M + W / 2, y + 10, W / 2 - 16, 10.5, C.violet, 'b', 2, { align: 'right', link: `https://${u}` }); y += 40; }
      }
    }
  });

  /* pieds de page (pas sur la couverture) */
  const range = doc.bufferedPageRange();
  for (let i = 1; i < range.count; i++) {
    doc.switchToPage(i); doc.page.margins.bottom = 0;
    doc.moveTo(M, H0 - 40).lineTo(W0 - M, H0 - 40).lineWidth(0.7).stroke(C.line);
    font('r').fontSize(8.5).fillColor(C.muted).text('Binta Kande  ·  bintakande.com', M, H0 - 31, { width: 300, lineBreak: false });
    font('r').fontSize(8.5).fillColor(C.muted).text(`${D.pageWord} ${i + 1} ${D.of} ${range.count}`, W0 - M - 100, H0 - 31, { width: 100, align: 'right', lineBreak: false });
  }
  doc.end();
  return { out, pages: range.count };
}

for (const lang of ['fr', 'en']) {
  const r = build(lang);
  console.log(`${lang}: ${r.pages} pages -> ${r.out}`);
}
