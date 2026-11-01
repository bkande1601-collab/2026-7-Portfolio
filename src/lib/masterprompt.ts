/** Master prompt : validation du résultat de l'agent, 2 PDF (+ copie .txt), e-mail de relecture et e-mail client. */
import { env } from './env';
import { renderPromptPdf, clean, codeSafe, type PromptDoc } from './pdf';
import { button, callout, esc, ownerEmail, para, sendMail, sendMailId, shell, steps } from './email';
import type { Order } from './orders';
import { toLang } from './http';
import { getAutoSend } from './settings';

export type PromptResult = { kind: 'prompt'; resume: string; prompts: PromptDoc[] };
export const isPromptResult = (r: unknown): r is PromptResult => Boolean(r && typeof r === 'object' && (r as { kind?: string }).kind === 'prompt');

/** Sous ce nombre de caractères, un master prompt n'est pas assez développé : l'envoi automatique est suspendu. */
export const MIN_PROMPT_CHARS = 12_000;

const arr = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
const str = (v: unknown, max: number) => clean(v).slice(0, max);
const pairs = (v: unknown, n: number, dMax: number) =>
  arr<Record<string, unknown>>(v).filter((x) => x && typeof x === 'object').slice(0, n).map((x) => ({ t: str(x.t, 80), d: str(x.d, dMax) })).filter((x) => x.t && x.d);

export function normalizePromptResult(raw: unknown): PromptResult {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const prompts = arr<Record<string, unknown>>(r.prompts).filter((x) => x && typeof x === 'object').slice(0, 2).map((x) => ({
    id: str(x.id, 30).toLowerCase(),
    nom: str(x.nom, 60),
    titre: str(x.titre, 120),
    intro: str(x.intro, 600),
    fiche: pairs(x.fiche, 10, 600),
    texte: codeSafe(x.texte).slice(0, 80_000).trim(), // conserve titres et listes : pas de nettoyage Markdown
    recommandations: pairs(x.recommandations, 6, 700), // bonus offert
  }));
  return { kind: 'prompt', resume: str(r.resume, 600), prompts };
}

export const promptWarnings = (r: PromptResult, expected = 2): string[] => {
  const w: string[] = [];
  if (r.prompts.length !== expected) w.push(`${r.prompts.length} master prompt(s) reçu(s) au lieu de ${expected}.`);
  r.prompts.forEach((p, i) => { if (p.texte.length < MIN_PROMPT_CHARS) w.push(`Master prompt ${i + 1} (${p.nom}) trop court : ${p.texte.length} caractères, ${MIN_PROMPT_CHARS} attendus au minimum.`); });
  return w;
};

const safeName = (order: Order) => clean(order.name ?? 'client').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'client';
const slug = (s: string) => clean(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** 2 PDF numérotés, chacun accompagné de sa copie .txt (le copier-coller d'un PDF peut couper les lignes). */
export async function promptFiles(order: Order, r: PromptResult) {
  const lang = toLang(order.lang);
  const date = new Date();
  const files: { filename: string; content: string; pages?: number }[] = [];
  for (let i = 0; i < r.prompts.length; i++) {
    const p = r.prompts[i];
    const out = await renderPromptPdf(p, { name: order.name ?? '', date, lang, index: i + 1, total: r.prompts.length });
    const base = `Master-prompt-${i + 1}-${slug(p.nom) || 'prompt'}-${safeName(order)}`;
    files.push({ filename: `${base}.pdf`, content: out.buf.toString('base64'), pages: out.pages });
    files.push({ filename: `${base}-A-COPIER.txt`, content: Buffer.from(p.texte, 'utf8').toString('base64') });
  }
  return files;
}

const admin = () => `${env('SITE_URL').replace(/\/$/, '') || 'https://bintakande.com'}/admin`;

export async function sendPromptReview(order: Order, r: PromptResult, note: string, warnings: string[]): Promise<string | null> {
  const files = await promptFiles(order, r);
  const mode = await getAutoSend();
  const who = `${order.name ?? ''} ${order.email ?? ''}`.trim();
  const auto = warnings.length
    ? 'Envoi automatique <strong>suspendu</strong> (points à vérifier ci-dessus) : rien ne part sans votre clic sur « Envoyer au client ».'
    : mode === 'off' ? 'L’envoi automatique est désactivé : rien ne part sans votre clic sur « Envoyer au client ».'
    : mode === 'now' ? 'Les PDF viennent d’être envoyés automatiquement au client.'
    : `Sans action de votre part, les PDF seront <strong>envoyés automatiquement au client ${mode === '1' ? 'dans environ 45 minutes' : `dans ${mode} heures`}</strong>.`;
  const html = shell({
    preheader: `Les 2 master prompts de ${who} sont prêts.`,
    title: 'Master prompts à relire',
    body:
      para(`Les 2 master prompts de <strong>${esc(who)}</strong> sont en pièces jointes (PDF + copie texte) : ${r.prompts.map((p, i) => `n° ${i + 1} ${esc(p.nom)} (${files.find((f) => f.pages && f.filename.includes(`prompt-${i + 1}-`))?.pages ?? '?'} pages, ${p.texte.length.toLocaleString('fr-FR')} caractères)`).join(', ')}.`) +
      (warnings.length ? callout('À vérifier avant envoi', `<ul style="margin:0;padding-left:18px;">${warnings.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>`, 'warm') : '') +
      callout('Envoi au client', auto, warnings.length ? 'warm' : 'ok') +
      callout('Note interne (ne pas transmettre)', esc(note || 'Aucune note.').replace(/\n/g, '<br>'), 'warm') +
      button(admin(), 'Ouvrir le tableau de bord'),
    footer: `Commande n° ${order.id}. Répondre à cet e-mail écrit directement au client.`,
  });
  return sendMailId({ to: ownerEmail(), subject: `${warnings.length ? '⚠ ' : ''}Master prompts à relire : ${clean(order.name || order.email || 'client')}`, html, replyTo: order.email ?? undefined, attachments: files.map(({ filename, content }) => ({ filename, content })) });
}

export async function sendPromptToClient(order: Order, r: PromptResult, to: string, test = false): Promise<boolean> {
  const fr = toLang(order.lang) === 'fr';
  const files = await promptFiles(order, r);
  const origin = env('SITE_URL').replace(/\/$/, '') || 'https://bintakande.com';
  const first = (order.name ?? '').trim().split(/\s+/)[0];
  const lang = fr ? 'fr' : 'en';
  const html = shell({
    preheader: fr ? 'Vos 2 master prompts sont en pièces jointes.' : 'Your 2 master prompts are attached.',
    title: fr ? 'Vos 2 master prompts sont prêts' : 'Your 2 master prompts are ready',
    body:
      para(fr ? `${first ? `Bonjour ${esc(first)}, m` : 'M'}erci pour vos réponses.` : `${first ? `Hello ${esc(first)}, t` : 'T'}hank you for your answers.`) +
      para(fr ? `Vous trouverez <strong>2 PDF en pièces jointes</strong>, un par master prompt. Chacun contient votre identité de marque et le master prompt complet dans un bloc à copier-coller${r.prompts.some((p) => p.recommandations.length) ? ', et un petit bonus offert : quelques recommandations pour vous' : ''}. Pour <strong>tout copier en une seule fois</strong>, ouvrez le fichier .txt joint à chaque master prompt, sélectionnez tout (Ctrl + A, ou Cmd + A sur Mac) et copiez : c’est exactement le même texte que dans le PDF. Dans le PDF, ce que vous devez compléter est surligné en jaune.` : `You will find <strong>2 PDFs attached</strong>, one per master prompt. Each holds your brand identity and the full master prompt in a copy-paste block${r.prompts.some((p) => p.recommandations.length) ? ', plus a small free bonus: a few recommendations for you' : ''}. To <strong>copy everything in one go</strong>, open the .txt file attached to each master prompt, select all (Ctrl + A, or Cmd + A on Mac) and copy: it is exactly the same text as in the PDF. In the PDF, anything you need to complete is highlighted in yellow.`) +
      callout(fr ? 'Vos 2 master prompts' : 'Your 2 master prompts', r.prompts.map((p, i) => `<strong>${i + 1}. ${esc(p.nom)}</strong><br>${esc(p.intro)}`).join('<br><br>'), 'key') +
      para(fr ? '<strong>Comment l’utiliser</strong>' : '<strong>How to use it</strong>') +
      steps(fr
        ? [{ title: 'Ouvrez le fichier .txt et copiez tout', text: 'Ctrl + A puis Ctrl + C (Cmd sur Mac) : tout le master prompt, en une fois.' }, { title: 'Collez-le dans votre IA', text: 'Au début d’une conversation ChatGPT, Claude ou Gemini, ou dans les instructions d’un projet.' }, { title: 'Complétez ce qui est surligné en jaune, puis écrivez votre demande', text: 'Les [crochets] du PDF sont surlignés : c’est à vous de les remplir. L’IA répond ensuite dans votre voix.' }]
        : [{ title: 'Open the .txt file and copy everything', text: 'Ctrl + A then Ctrl + C (Cmd on Mac): the whole master prompt, in one go.' }, { title: 'Paste it into your AI', text: 'At the start of a ChatGPT, Claude or Gemini conversation, or in a project’s instructions.' }, { title: 'Fill in what is highlighted in yellow, then write your request', text: 'The [brackets] in the PDF are highlighted: they are for you to fill in. The AI then answers in your voice.' }]) +
      callout(fr ? 'Envie d’aller plus loin ?' : 'Want to go further?', fr ? 'Je peux transformer ces master prompts en assistant automatisé. Répondez à cet e-mail, ou réservez un échange de 30 minutes.' : 'I can turn these master prompts into an automated assistant. Reply to this email, or book a 30-minute call.', 'info') +
      button(`${origin}/${lang}/book`, fr ? 'Réserver un échange' : 'Book a call'),
    footer: fr ? 'Ces master prompts reposent sur vos réponses et sur ce que j’ai pu lire de votre site. Relisez-les et ajustez les faits.' : 'These master prompts rely on your answers and on what I could read of your website. Review them and adjust the facts.',
  });
  return sendMail({ to, subject: `${test ? '[Copie test] ' : ''}${fr ? 'Vos 2 master prompts sont prêts' : 'Your 2 master prompts are ready'}`, html, replyTo: ownerEmail() || undefined, attachments: files.map(({ filename, content }) => ({ filename, content })) });
}
