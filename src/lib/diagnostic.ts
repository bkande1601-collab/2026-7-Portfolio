/** Diagnostic : validation du résultat de l'agent, PDF, e-mail de relecture, e-mail client et lien du questionnaire. */
import { db } from './db';
import { env } from './env';
import { renderDiagnosticPdf, clean, type DiagResult } from './pdf';
import { button, callout, esc, ownerEmail, para, sendMail, sendMailId, shell, steps } from './email';
import { merciUrl, type Order } from './orders';
import { toLang } from './http';
import { getAutoSend } from './settings';

const arr = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
const str = (v: unknown, max = 900) => clean(v).slice(0, max);
const strs = (v: unknown, n: number, max = 400) => arr<unknown>(v).map((x) => str(x, max)).filter(Boolean).slice(0, n);
const num = (v: unknown, lo: number, hi: number) => Math.max(lo, Math.min(hi, Math.round(Number(v) || 0)));

/** Remet le JSON du modèle dans une forme sûre : types, longueurs, nombre d'éléments. */
export function normalizeResult(raw: unknown): DiagResult {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const o = <T extends Record<string, unknown>>(v: unknown) => arr<T>(v).filter((x) => x && typeof x === 'object');
  return {
    resume: str(r.resume, 1100),
    score_global: num(r.score_global, 0, 100),
    scores: o(r.scores).slice(0, 8).map((x) => ({ axe: str(x.axe, 60), score: num(x.score, 0, 10), commentaire: str(x.commentaire, 160) })),
    forces: strs(r.forces, 4),
    freins: o(r.freins).slice(0, 4).map((x) => ({ titre: str(x.titre, 90), constat: str(x.constat, 420), cause: str(x.cause, 300), impact: str(x.impact, 300) })),
    analyse_expert: ((x) => ({ verdict: str(x.verdict, 360), goulot: str(x.goulot, 520), lecture: str(x.lecture, 1400), angle_mort: str(x.angle_mort, 520), opportunite: str(x.opportunite, 520), risque: str(x.risque, 400) }))((r.analyse_expert ?? {}) as Record<string, unknown>),
    offre: ((x) => ({ resultat: num(x.resultat, 0, 10), probabilite: num(x.probabilite, 0, 10), rapidite: num(x.rapidite, 0, 10), facilite: num(x.facilite, 0, 10), commentaire: str(x.commentaire, 420), amelioration: str(x.amelioration, 420) }))((r.offre ?? {}) as Record<string, unknown>),
    entonnoir: o(r.entonnoir).slice(0, 5).map((x) => ({ etape: str(x.etape, 30), etat: str(x.etat, 10).toLowerCase(), constat: str(x.constat, 220) })),
    swot: ((x) => ({ forces: strs(x.forces, 3, 140), faiblesses: strs(x.faiblesses, 3, 140), opportunites: strs(x.opportunites, 3, 140), menaces: strs(x.menaces, 3, 140) }))((r.swot ?? {}) as Record<string, unknown>),
    potentiel: ((x) => ({ heures_par_mois: num(x.heures_par_mois, 0, 400), revenu_mensuel: num(x.revenu_mensuel, 0, 1_000_000), hypotheses: str(x.hypotheses, 320) }))((r.potentiel ?? {}) as Record<string, unknown>),
    suite_90_jours: strs(r.suite_90_jours, 3, 260),
    pistes: o(r.pistes).slice(0, 3).map((x) => ({ titre: str(x.titre, 90), probleme: str(x.probleme, 320), solution: str(x.solution, 520), effet: str(x.effet, 320), effort: str(x.effort, 12), premier_pas: str(x.premier_pas, 280), delai: str(x.delai, 18), impact: num(x.impact, 1, 10), confiance: num(x.confiance, 1, 10), facilite: num(x.facilite, 1, 10) })),
    outils: o(r.outils).slice(0, 6).map((x) => ({ besoin: str(x.besoin, 60), outil: str(x.outil, 50), pourquoi: str(x.pourquoi, 200), cout: str(x.cout, 40) })),
    plan: o(r.plan).slice(0, 4).map((x) => ({ periode: str(x.periode, 40), actions: strs(x.actions, 4, 220) })),
    indicateurs: o(r.indicateurs).slice(0, 5).map((x) => ({ indicateur: str(x.indicateur, 140), cible: str(x.cible, 100) })),
    a_eviter: strs(r.a_eviter, 3, 300),
    questions: strs(r.questions, 3, 300),
  };
}

export type StoredResult = { result: DiagResult | null; note: string | null; warnings: string[] };

export async function loadResult(orderId: number): Promise<StoredResult & { sentAt: Date | null }> {
  const r = await db().query<{ result: DiagResult | null; result_note: string | null; result_warnings: string[] | null; client_sent_at: Date | null }>(
    'SELECT result, result_note, result_warnings, client_sent_at FROM answers WHERE order_id = $1',
    [orderId],
  );
  const x = r.rows[0];
  return { result: x?.result ?? null, note: x?.result_note ?? null, warnings: x?.result_warnings ?? [], sentAt: x?.client_sent_at ?? null };
}

export async function pdfFor(order: Order, result: DiagResult) {
  const lang = toLang(order.lang);
  const out = await renderDiagnosticPdf(result, { name: order.name ?? '', date: new Date(), lang });
  const safe = clean(order.name ?? 'client').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'client';
  return { ...out, filename: `Diagnostic-${safe}.pdf`, base64: out.buf.toString('base64') };
}

const admin = () => `${env('SITE_URL').replace(/\/$/, '') || 'https://bintakande.com'}/admin`;

const prioritiesBlock = (r: DiagResult) =>
  steps(r.pistes.map((p) => ({ title: esc(p.titre), text: esc(p.premier_pas) })));

/** Mail à Binta : PDF en pièce jointe, avertissements, note interne, mode d'emploi pour envoyer au client. */
export async function sendReview(order: Order, result: DiagResult, note: string, warnings: string[]): Promise<string | null> {
  const pdf = await pdfFor(order, result);
  const mode = await getAutoSend();
  const auto = warnings.length
    ? 'Envoi automatique <strong>suspendu</strong> pour ce diagnostic (points à vérifier ci-dessus) : il ne partira que si vous cliquez sur « Envoyer le PDF au client ».'
    : mode === 'off' ? 'L’envoi automatique au client est désactivé : le PDF ne partira que si vous cliquez sur « Envoyer le PDF au client ».'
    : mode === 'now' ? 'Le PDF vient d’être envoyé automatiquement au client.'
    : `Sans action de votre part, le PDF sera <strong>envoyé automatiquement au client dans ${mode} heures</strong>. Vous pouvez l’envoyer plus tôt, ou modifier ce réglage dans le tableau de bord.`;
  const who = `${order.name ?? ''} ${order.email ?? ''}`.trim();
  const html = shell({
    preheader: `Le diagnostic de ${who} est prêt (${pdf.pages} pages).`,
    title: 'Diagnostic prêt à relire',
    body:
      para(`Le diagnostic de <strong>${esc(who)}</strong> est en pièce jointe (PDF, ${pdf.pages} pages). Relisez-le avant de l’envoyer.`) +
      (warnings.length ? callout('À vérifier avant envoi', `<ul style="margin:0;padding-left:18px;">${warnings.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>`, 'warm') : '') +
      callout('Les 3 priorités identifiées', prioritiesBlock(result), 'info') +
      callout('Envoi au client', auto, warnings.length ? 'warm' : 'ok') +
      callout('Note interne (ne pas transmettre)', esc(note || 'Aucune note.').replace(/\n/g, '<br>'), 'warm') +
      para('<strong>Pour l’envoyer au client</strong>') +
      steps([
        { title: 'Relisez le PDF joint', text: 'Si quelque chose ne vous convient pas, relancez l’agent depuis le tableau de bord.' },
        { title: 'Ouvrez le tableau de bord', text: 'Carte de la commande, puis « Envoyer le PDF au client ».' },
        { title: 'Le client reçoit le PDF avec un mot de remerciement', text: 'Vous pouvez aussi vous l’envoyer à vous-même avant, pour tester.' },
      ]) +
      button(admin(), 'Ouvrir le tableau de bord'),
    footer: `Commande n° ${order.id}. Répondre à cet e-mail écrit directement au client.`,
  });
  return sendMailId({
    to: ownerEmail(),
    subject: `${warnings.length ? '⚠ ' : ''}Diagnostic à relire : ${clean(order.name || order.email || 'client')}`,
    html,
    replyTo: order.email ?? undefined,
    attachments: [{ filename: pdf.filename, content: pdf.base64 }],
  });
}

/** Mail au client : remerciement + PDF. `to` permet de l'envoyer à Binta pour un test. */
export async function sendToClient(order: Order, result: DiagResult, to: string, test = false): Promise<boolean> {
  const lang = toLang(order.lang);
  const fr = lang === 'fr';
  const pdf = await pdfFor(order, result);
  const origin = env('SITE_URL').replace(/\/$/, '') || 'https://bintakande.com';
  const first = (order.name ?? '').trim().split(/\s+/)[0];
  const html = shell({
    preheader: fr ? 'Votre diagnostic est en pièce jointe, avec un plan d’action.' : 'Your diagnostic is attached, with an action plan.',
    title: fr ? 'Votre diagnostic est prêt' : 'Your diagnostic is ready',
    body:
      para(fr ? `${first ? `Bonjour ${esc(first)}, m` : 'M'}erci pour votre retour au questionnaire.` : `${first ? `Hello ${esc(first)}, t` : 'T'}hank you for your answers.`) +
      para(fr ? 'Vous trouverez <strong>en pièce jointe le PDF de votre diagnostic</strong> : votre situation, ce qui vous freine, vos trois priorités et un plan d’action sur 30 jours.' : 'You will find <strong>your diagnostic as a PDF attached</strong>: your situation, what is holding you back, your three priorities and a 30-day action plan.') +
      callout(fr ? 'Vos 3 priorités' : 'Your 3 priorities', prioritiesBlock(result), 'key') +
      para(fr ? '<strong>Comment l’utiliser</strong>' : '<strong>How to use it</strong>') +
      steps(
        fr
          ? [{ title: 'Lisez le résumé (page 1)', text: 'Votre score et vos points forts : ce qui marche déjà.' }, { title: 'Faites la première action de la semaine 1', text: 'Une seule, aujourd’hui : c’est elle qui lance le reste.' }, { title: 'Suivez les chiffres indiqués', text: 'Ils vous diront en 30 jours si ça marche.' }]
          : [{ title: 'Read the summary (page 1)', text: 'Your score and strengths: what already works.' }, { title: 'Do the first week-1 action', text: 'Just one, today: it starts everything else.' }, { title: 'Track the listed numbers', text: 'They will tell you within 30 days whether it works.' }],
      ) +
      callout(fr ? 'Envie d’aller plus vite ?' : 'Want to go faster?', fr ? 'Je peux mettre en place ces actions avec vous. Répondez simplement à cet e-mail, ou réservez un échange de 30 minutes.' : 'I can implement these actions with you. Just reply to this email, or book a 30-minute call.', 'info') +
      button(`${origin}/${lang}/book`, fr ? 'Réserver un échange' : 'Book a call'),
    footer: fr ? 'Ce diagnostic repose uniquement sur vos réponses. Les chiffres cités sont des estimations.' : 'This diagnostic relies only on your answers. Figures quoted are estimates.',
  });
  return sendMail({
    to,
    subject: `${test ? '[Copie test] ' : ''}${fr ? 'Votre diagnostic est prêt' : 'Your diagnostic is ready'}`,
    html,
    replyTo: ownerEmail() || undefined,
    attachments: [{ filename: pdf.filename, content: pdf.base64 }],
  });
}

/** Lien pour (re)remplir le questionnaire, avec les réponses déjà données. */
export async function sendQuestionnaireLink(order: Order, to: string, test = false): Promise<boolean> {
  const lang = toLang(order.lang);
  const fr = lang === 'fr';
  const url = `${merciUrl(order.lang, order.session_id)}&refaire=1`;
  const html = shell({
    preheader: fr ? 'Reprenez le questionnaire quand vous voulez.' : 'Resume the questionnaire whenever you like.',
    title: fr ? 'Reprenez votre questionnaire' : 'Resume your questionnaire',
    body:
      para(fr ? 'Voici le lien pour remplir (ou compléter) le questionnaire de votre diagnostic. Vos réponses précédentes sont déjà dedans.' : 'Here is the link to fill in (or complete) your diagnostic questionnaire. Your previous answers are already in it.') +
      callout(fr ? 'Pour un meilleur diagnostic' : 'For a better diagnostic', fr ? 'Plus vous donnez d’informations (chiffres, exemples, outils), plus le résultat est précis.' : 'The more you share (numbers, examples, tools), the more precise the result.', 'key') +
      button(url, fr ? 'Ouvrir le questionnaire' : 'Open the questionnaire'),
    footer: fr ? 'Une question ? Répondez à cet e-mail.' : 'A question? Reply to this email.',
  });
  return sendMail({ to, subject: `${test ? '[Test] ' : ''}${fr ? 'Votre questionnaire de diagnostic' : 'Your diagnostic questionnaire'}`, html, replyTo: ownerEmail() || undefined });
}

/** Envoie le PDF au client une seule fois (réservation atomique), puis prévient Binta. Renvoie true si envoyé. */
export async function deliverToClient(order: Order, result: DiagResult, auto: boolean): Promise<boolean> {
  if (!order.email) return false;
  const claim = await db().query('UPDATE answers SET client_sent_at = now(), client_sent_to = $2 WHERE order_id = $1 AND client_sent_at IS NULL RETURNING 1', [order.id, order.email]);
  if (!claim.rowCount) return false;
  const ok = await sendToClient(order, result, order.email).catch(() => false);
  if (!ok) {
    await db().query('UPDATE answers SET client_sent_at = NULL, client_sent_to = NULL WHERE order_id = $1', [order.id]);
    return false;
  }
  if (auto) {
    await sendMail({
      to: ownerEmail(),
      subject: `Diagnostic envoyé au client : ${clean(order.name || order.email)}`,
      html: shell({
        preheader: 'Envoi automatique effectué.',
        title: 'Diagnostic envoyé',
        body: para(`Le PDF a été envoyé automatiquement à <strong>${esc(order.email)}</strong>.`) + button(admin(), 'Ouvrir le tableau de bord'),
        footer: 'Alerte automatique.',
      }),
    }).catch(() => false);
  }
  return true;
}

/** Envoi automatique : mode « tout de suite » ou une fois le délai de relecture écoulé. Jamais si le diagnostic a des avertissements. */
export async function runAutoSend(): Promise<number> {
  const mode = await getAutoSend();
  if (mode === 'off' || mode === 'now') return mode === 'now' ? runNow() : 0;
  return runDue(Number(mode));
}

type Due = Order & { result: DiagResult };
async function runDue(hours: number): Promise<number> {
  const r = await db().query<Due>(
    `SELECT o.*, a.result FROM answers a JOIN orders o ON o.id = a.order_id
      WHERE a.result IS NOT NULL AND a.client_sent_at IS NULL AND a.agent_status = 'done'
        AND coalesce(jsonb_array_length(a.result_warnings), 0) = 0 AND o.status = 'paid' AND o.email IS NOT NULL
        AND a.agent_done_at <= now() - ($1 || ' hours')::interval AND a.agent_done_at > now() - interval '14 days'`,
    [String(hours)],
  );
  let n = 0;
  for (const o of r.rows) if (await deliverToClient(o, o.result, true)) n++;
  return n;
}
async function runNow(): Promise<number> {
  return runDue(0);
}
