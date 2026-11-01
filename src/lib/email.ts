/**
 * E-mails (Resend, via fetch). Gabarits FR/EN.
 * Tout texte venant d'un visiteur est échappé avant d'entrer dans le HTML.
 */
import { sourceText } from './source';
import { env, hasResend } from './env';
import { site, booking } from '../config/site';
import { t, type Lang } from '../content';

export const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const firstName = (full: string) => full.trim().split(/\s+/)[0] || full;

export type Mail = { to: string; subject: string; html: string; replyTo?: string; attachments?: { filename: string; content: string }[] };

export async function sendMail(m: Mail): Promise<boolean> {
  return Boolean(await sendMailId(m));
}

/** Envoie l'e-mail et renvoie l'identifiant Resend (ou null en cas d'échec). */
export async function sendMailId(m: Mail): Promise<string | null> {
  if (!hasResend()) return null;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env('RESEND_API_KEY')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env('MAIL_FROM'),
      to: [m.to],
      subject: m.subject,
      html: m.html,
      ...(m.replyTo ? { reply_to: m.replyTo } : {}),
      ...(m.attachments?.length ? { attachments: m.attachments } : {}),
    }),
  });
  if (!res.ok) return null;
  const j = (await res.json().catch(() => ({}))) as { id?: string };
  return j.id ?? 'sent';
}

export const ownerEmail = () => env('OWNER_EMAIL');

/* ---------- cadre commun ---------- */
/** Charte du site (src/styles/global.css) : ivoire, violet, violet profond, cannelle. */
const C = { bg: '#f6f0e4', card: '#fbf7ee', dark: '#3b2a63', text: '#2b1d16', muted: '#675549', violet: '#694cac', lilas: '#e4d9f1', cannelle: '#8a4b36', line: '#e2d6c3' };
const FONT = "'Archivo',Helvetica,Arial,sans-serif";

/**
 * Logo (public/email/logo.png) en image de fond : les messageries n'affichent pas le bouton « télécharger »
 * au survol d'une image de fond. Sans SITE_URL, repli sur le nom en texte.
 */
const logo = () => {
  const origin = env('SITE_URL').replace(/\/$/, '');
  return origin
    ? `<div role="img" aria-label="${esc(site.brand)}" style="width:190px;height:52px;background-image:url('${origin}/email/logo.png');background-repeat:no-repeat;background-position:left center;background-size:contain;font-size:0;line-height:0;">&nbsp;</div>`
    : `<span style="font:700 20px/1 ${FONT};color:#f6f0e4;letter-spacing:-0.02em;">${esc(site.brand)}</span>`;
};

export function shell(opts: { preheader: string; title: string; body: string; footer: string }) {
  return `<!doctype html><html><body style="margin:0;padding:0;background:${C.bg};">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(opts.preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};padding:28px 12px;">
<tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
  <tr><td style="background:${C.dark};border-radius:20px 20px 0 0;padding:26px 32px;border-bottom:4px solid ${C.violet};">
    ${logo()}
  </td></tr>
  <tr><td style="background:${C.card};padding:36px 32px 28px;border-radius:0 0 20px 20px;font:16px/1.65 ${FONT};color:${C.text};">
    <h1 style="margin:0 0 18px;font:800 28px/1.15 ${FONT};letter-spacing:-0.03em;color:${C.dark};">${opts.title}</h1>
    ${opts.body}
  </td></tr>
  <tr><td style="padding:20px 8px 4px;font:12px/1.6 ${FONT};color:${C.muted};text-align:center;">${opts.footer}<br><a href="mailto:hello@bintakande.com" style="color:${C.violet};text-decoration:none;">hello@bintakande.com</a> &middot; <a href="https://bintakande.com" style="color:${C.violet};text-decoration:none;">bintakande.com</a></td></tr>
</table></td></tr></table></body></html>`;
}

export const button = (href: string, label: string) =>
  `<p style="margin:26px 0;"><a href="${esc(href)}" style="display:inline-block;background:${C.violet};color:#fffaf4;text-decoration:none;font:700 16px/1 ${FONT};padding:15px 28px;border-radius:999px;">${esc(label)}</a></p>`;

export const row = (k: string, v: string) =>
  `<tr><td style="padding:10px 0;border-bottom:1px solid ${C.line};width:130px;color:${C.muted};font-size:14px;vertical-align:top;">${esc(k)}</td><td style="padding:10px 0;border-bottom:1px solid ${C.line};font-size:15px;">${v}</td></tr>`;

export const table = (rows: string) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0;">${rows}</table>`;

/** Encadré : tone = info (lilas), key (violet foncé), warm (cannelle), ok (vert). */
export function callout(title: string, body: string, tone: 'info' | 'key' | 'warm' | 'ok' = 'info') {
  const t = {
    info: { bg: C.lilas, bar: C.violet, ink: C.dark },
    key: { bg: C.dark, bar: '#c6b8e4', ink: '#fbf7ee' },
    warm: { bg: '#f3e3d6', bar: C.cannelle, ink: '#4a2a1d' },
    ok: { bg: '#e2f1e6', bar: '#2f7d4f', ink: '#1c4a30' },
  }[tone];
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;"><tr><td style="background:${t.bg};border-left:5px solid ${t.bar};border-radius:12px;padding:16px 20px;font:15px/1.6 ${FONT};color:${t.ink};"><div style="font:800 13px/1.2 ${FONT};letter-spacing:.06em;text-transform:uppercase;margin:0 0 8px;opacity:.85;">${title}</div>${body}</td></tr></table>`;
}

/** Étapes numérotées (ce qui se passe ensuite, plan d'action). */
export function steps(items: { title: string; text?: string }[]) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0;">${items
    .map(
      (it, i) =>
        `<tr><td width="44" valign="top" style="padding:8px 0;"><div style="width:32px;height:32px;line-height:32px;border-radius:50%;background:${C.violet};color:#fffaf4;text-align:center;font:800 15px/32px ${FONT};">${i + 1}</div></td><td valign="top" style="padding:8px 0 8px 4px;border-bottom:1px solid ${C.line};font:15px/1.55 ${FONT};color:${C.text};"><strong style="color:${C.dark};">${it.title}</strong>${it.text ? `<br><span style="color:${C.muted};">${it.text}</span>` : ''}</td></tr>`,
    )
    .join('')}</table>`;
}

export const para = (s: string) => `<p style="margin:0 0 16px;">${s}</p>`;

/* ---------- conseils de préparation selon le besoin ---------- */
const prep: Record<Lang, Record<string, string[]>> = {
  fr: {
    automation: [
      'Listez 2 ou 3 tâches répétitives qui vous prennent le plus de temps chaque semaine.',
      'Notez les outils concernés (e-mail, CRM, tableur…) et qui les utilise.',
      'Si possible, apportez un exemple concret : un e-mail type, un fichier, une capture.',
    ],
    agent: [
      'Repérez les documents sur lesquels l’agent devrait s’appuyer (procédures, contrats, FAQ…).',
      'Pensez aux 5 questions que votre équipe pose le plus souvent.',
      'Identifiez ce qui est confidentiel : on définira le périmètre ensemble.',
    ],
    tool: [
      'Décrivez qui utiliserait l’outil et pour faire quoi au quotidien.',
      'Listez les outils qu’il devrait connecter (Notion, Google, HubSpot…).',
      'Ce que vous utilisez aujourd’hui (tableur, outil existant) et ce qui vous gêne.',
    ],
    content: [
      'Notez les plateformes qui comptent pour vous (Instagram, TikTok, LinkedIn).',
      'Gardez à portée vos chiffres actuels : abonnés, engagement, ce qui marche déjà.',
      'Envoyez-moi 2 ou 3 comptes que vous aimez : ils m’aident à cerner votre style.',
    ],
    site: [
      'Notez l’adresse de votre site actuel, s’il y en a un.',
      'Listez ce qui vous gêne dedans : lenteur, mobile, sécurité, contenu.',
      'Pensez aux pages et aux actions dont vous avez besoin (contact, rendez-vous, vente).',
    ],
    webinar: [
      'Notez le sujet de votre webinaire et à qui il s’adresse.',
      'Dites-moi si vous avez déjà une audience (liste e-mail, réseaux).',
      'Pensez à la date visée et à l’objectif : inscriptions, ventes, notoriété.',
    ],
    cos: [
      'Listez vos 3 priorités du trimestre et ce qui les freine.',
      'Pensez aux rituels qui manquent (points d’équipe, reporting, OKR).',
      'Dites-moi combien de jours par mois vous imaginez y consacrer.',
    ],
    other: [
      'Pas besoin de préparer grand-chose : venez avec un problème, même flou.',
      'Si vous avez un exemple concret ou une capture, c’est un plus.',
      'On cherchera ensemble la piste qui fait gagner le plus de temps.',
    ],
  },
  en: {
    automation: [
      'List 2 or 3 repetitive tasks that eat the most time each week.',
      'Note the tools involved (email, CRM, spreadsheet…) and who uses them.',
      'If you can, bring a concrete example: a typical email, a file, a screenshot.',
    ],
    agent: [
      'Spot the documents the agent should rely on (procedures, contracts, FAQ…).',
      'Think of the 5 questions your team asks most often.',
      'Identify what is confidential: we will define the scope together.',
    ],
    tool: [
      'Describe who would use the tool and for what, day to day.',
      'List the tools it should connect to (Notion, Google, HubSpot…).',
      'What you use today (spreadsheet, existing tool) and what bothers you.',
    ],
    content: [
      'Note the platforms that matter to you (Instagram, TikTok, LinkedIn).',
      'Keep your current numbers at hand: followers, engagement, what already works.',
      'Send me 2 or 3 accounts you like: they help me understand your style.',
    ],
    site: [
      'Note the address of your current website, if you have one.',
      'List what bothers you about it: speed, mobile, security, content.',
      'Think about the pages and actions you need (contact, booking, selling).',
    ],
    webinar: [
      'Note the topic of your webinar and who it is for.',
      'Tell me whether you already have an audience (email list, social media).',
      'Think of the target date and the goal: sign-ups, sales, awareness.',
    ],
    cos: [
      'List your 3 priorities for the quarter and what is slowing them down.',
      'Think of the rituals that are missing (team syncs, reporting, OKRs).',
      'Tell me how many days a month you imagine dedicating to it.',
    ],
    other: [
      'Not much to prepare: come with a problem, even a fuzzy one.',
      'A concrete example or a screenshot helps.',
      'We will look together for the lead that saves the most time.',
    ],
  },
};

/* ---------- libellés ---------- */
const L = {
  fr: {
    bookSubject: (d: string) => `C’est confirmé : on se voit ${d}`,
    bookPre: 'Votre rendez-vous est confirmé. Lien Google Meet à l’intérieur.',
    bookTitle: (n: string) => `Parfait ${esc(n)}, c’est confirmé.`,
    bookIntro: (d: string, dur: number) =>
      `Je vous retrouve <strong>${esc(d)}</strong> pour un échange de ${dur} minutes. Je lirai vos réponses avant pour qu’on aille droit au but.`,
    join: 'Rejoindre sur Google Meet',
    addCal: 'Ajouter à mon agenda',
    yours: 'Vos réponses',
    prepTitle: 'Pour bien préparer notre échange',
    outro: 'Un imprévu ? Répondez simplement à cet e-mail, on déplace sans souci.',
    sign: 'À très vite,',
    when: 'Quand',
    where: 'Où',
    meetLater: 'Le lien Google Meet est dans votre invitation.',
    fields: { name: 'Nom', phone: 'Téléphone', email: 'E-mail', company: 'Entreprise', need: 'Besoin', budget: 'Budget', message: 'Message' },
    footer: 'Vous recevez cet e-mail suite à une réservation sur mon site.',
    contactSubject: 'J’ai bien reçu votre message',
    contactPre: 'Accusé de réception de votre message.',
    contactTitle: (n: string) => `Merci ${esc(n)}, message bien reçu.`,
    contactBody: 'Je lis chaque message personnellement et je reviens vers vous sous 2 jours ouvrés.',
    contactRecap: 'Pour mémoire, voici ce que vous m’avez écrit :',
    contactBook: 'Si vous préférez en parler de vive voix, vous pouvez réserver un audit de 30 minutes :',
    labSubject: 'C’est noté : je vous préviens à la sortie',
    labPre: 'Votre inscription est bien prise en compte.',
    labTitle: 'C’est noté.',
    labBody: 'Je vous écris dès que l’un de mes chantiers « Dans le labo » sort. Pas de newsletter, uniquement l’annonce.',
    labOut: 'Se désinscrire : répondez simplement « stop » à cet e-mail.',
  },
  en: {
    bookSubject: (d: string) => `Confirmed: see you ${d}`,
    bookPre: 'Your appointment is confirmed. Google Meet link inside.',
    bookTitle: (n: string) => `Great ${esc(n)}, you're booked.`,
    bookIntro: (d: string, dur: number) =>
      `I'll see you <strong>${esc(d)}</strong> for a ${dur}-minute call. I will read your answers beforehand so we can get straight to the point.`,
    join: 'Join on Google Meet',
    addCal: 'Add to my calendar',
    yours: 'Your answers',
    prepTitle: 'How to prepare for our call',
    outro: 'Something came up? Just reply to this email and we will reschedule.',
    sign: 'Talk soon,',
    when: 'When',
    where: 'Where',
    meetLater: 'The Google Meet link is in your invitation.',
    fields: { name: 'Name', phone: 'Phone', email: 'Email', company: 'Company', need: 'Need', budget: 'Budget', message: 'Message' },
    footer: 'You are receiving this email because you booked a call on my website.',
    contactSubject: 'I received your message',
    contactPre: 'Acknowledgement of your message.',
    contactTitle: (n: string) => `Thank you ${esc(n)}, message received.`,
    contactBody: 'I read every message personally and will get back to you within 2 working days.',
    contactRecap: 'For your records, here is what you wrote:',
    contactBook: 'If you prefer to talk it through, you can book a 30-minute audit:',
    labSubject: "Noted: I'll let you know at launch",
    labPre: 'Your sign-up has been recorded.',
    labTitle: 'Noted.',
    labBody: 'I will write to you as soon as one of my "In the lab" projects ships. No newsletter, just the announcement.',
    labOut: 'To unsubscribe, simply reply "stop" to this email.',
  },
} as const;

/* ---------- RÉSERVATION : e-mail au visiteur ---------- */
export type BookingData = {
  name: string;
  phone: string;
  source?: string;
  siteUrl?: string;
  email: string;
  company: string;
  need: string;
  needOther?: string;
  budget: string;
  message: string;
  lang: Lang;
  startMs: number;
  tz: string;
  meetLink: string;
};

/** Libellé du besoin ; pour « Autre », on ajoute ce que la personne a précisé. */
export function needText(lang: Lang, need: string, other?: string) {
  const label = t(lang).book.needs.find((n) => n.v === need)?.t ?? need;
  return need === 'custom' && other ? `${label} : ${other}` : label;
}

function longDate(ms: number, lang: Lang, tz: string) {
  return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', {
    timeZone: tz,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(ms));
}

function gcalLink(d: BookingData) {
  const fmt = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const end = d.startMs + booking.durationMin * 60_000;
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${site.brand} | ${t(d.lang).cta.book}`,
    dates: `${fmt(d.startMs)}/${fmt(end)}`,
    details: d.meetLink,
    location: d.meetLink,
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

export function visitorBookingMail(d: BookingData): Mail {
  const l = L[d.lang];
  const c = t(d.lang);
  const when = longDate(d.startMs, d.lang, d.tz);
  const needLabel = needText(d.lang, d.need, d.needOther);
  const budgetLabel = c.book.budgets.find((n) => n.v === d.budget)?.t ?? '';
  const tips = (prep[d.lang][d.need] ?? prep[d.lang].other)
    .map((x) => `<li style="margin:0 0 8px;">${esc(x)}</li>`)
    .join('');

  const answers = table(
    row(l.fields.name, esc(d.name)) +
      row(l.fields.phone, esc(d.phone)) +
      row(l.fields.email, esc(d.email)) +
      (d.company ? row(l.fields.company, esc(d.company)) : '') +
      row(l.fields.need, esc(needLabel)) +
      (budgetLabel ? row(l.fields.budget, esc(budgetLabel)) : '') +
      (d.message ? row(l.fields.message, esc(d.message).replace(/\n/g, '<br>')) : ''),
  );

  const body =
    para(l.bookIntro(when, booking.durationMin)) +
    (d.meetLink ? button(d.meetLink, l.join) : para(`<em>${l.meetLater}</em>`)) +
    (d.meetLink
      ? `<p style="margin:-8px 0 24px;font-size:14px;"><a href="${esc(gcalLink(d))}" style="color:${C.muted};">${l.addCal}</a></p>`
      : '') +
    `<h2 style="margin:28px 0 6px;font:800 18px/1.2 ${FONT};color:${C.dark};">${l.prepTitle}</h2>` +
    `<ul style="margin:10px 0 24px;padding-left:20px;">${tips}</ul>` +
    `<h2 style="margin:28px 0 0;font:800 18px/1.2 ${FONT};color:${C.dark};">${l.yours}</h2>` +
    answers +
    para(l.outro) +
    `<p style="margin:24px 0 0;">${l.sign}<br><strong>${esc(site.name)}</strong></p>`;

  return {
    to: d.email,
    subject: l.bookSubject(when),
    html: shell({
      preheader: l.bookPre,
      title: l.bookTitle(firstName(d.name)),
      body,
      footer: l.footer,
    }),
    replyTo: ownerEmail() || undefined,
  };
}

/* ---------- RÉSERVATION : récapitulatif pour vous ---------- */
export function ownerBookingMail(d: BookingData, eventLink: string): Mail {
  const when = longDate(d.startMs, d.lang, booking.timezone);
  const c = t(d.lang);
  const needLabel = needText(d.lang, d.need, d.needOther);
  const budgetLabel = c.book.budgets.find((n) => n.v === d.budget)?.t ?? 'Non renseigné';
  const f = L.fr.fields;
  const body =
    para(`<strong>${esc(when)}</strong> (${esc(booking.timezone)}) · ${booking.durationMin} min · ${d.lang.toUpperCase()}`) +
    table(
      row(f.name, esc(d.name)) +
        row(f.phone, `<a href="tel:${esc(d.phone)}">${esc(d.phone)}</a>`) +
        row(f.email, `<a href="mailto:${esc(d.email)}">${esc(d.email)}</a>`) +
        row(f.company, esc(d.company || 'Non renseigné')) +
        (d.siteUrl ? row('Site web', esc(d.siteUrl)) : '') +
        (d.source ? row('Page d’origine', esc(sourceText(d.source))) : '') +
        row(f.need, esc(needLabel)) +
        row(f.budget, esc(budgetLabel)) +
        row(f.message, esc(d.message || 'Non renseigné').replace(/\n/g, '<br>')),
    ) +
    (d.meetLink ? button(d.meetLink, 'Google Meet') : '') +
    (eventLink ? `<p style="margin:0;font-size:14px;"><a href="${esc(eventLink)}" style="color:${C.muted};">Voir dans Google Agenda</a></p>` : '');
  return {
    to: ownerEmail(),
    subject: `Nouveau rendez-vous : ${d.name}, ${when}`,
    html: shell({ preheader: `${d.name} a réservé un audit.`, title: 'Nouveau rendez-vous', body, footer: 'Récapitulatif automatique.' }),
    replyTo: d.email,
  };
}

/* ---------- MESSAGE ---------- */
export function contactMails(d: { name: string; email: string; subject: string; message: string; lang: Lang; phone?: string; company?: string; need?: string; needOther?: string; budget?: string; source?: string; siteUrl?: string }) {
  const needLabel = d.need ? needText(d.lang, d.need, d.needOther) : '';
  const budgetLabel = d.budget ? t(d.lang).book.budgets.find((n) => n.v === d.budget)?.t ?? d.budget : '';
  const l = L[d.lang];
  const msgHtml = esc(d.message || (d.lang === 'fr' ? '(aucun message)' : '(no message)')).replace(/\n/g, '<br>');
  const origin = env('SITE_URL').replace(/\/$/, '');
  const bookUrl = origin ? `${origin}/${d.lang}/book` : '';

  const toVisitor: Mail = {
    to: d.email,
    subject: l.contactSubject,
    html: shell({
      preheader: l.contactPre,
      title: l.contactTitle(firstName(d.name)),
      body:
        para(l.contactBody) +
        para(l.contactRecap) +
        `<blockquote style="margin:0 0 20px;padding:12px 18px;border-left:3px solid ${C.violet};background:${C.lilas};color:${C.text};">${d.subject ? `<strong>${esc(d.subject)}</strong><br>` : ''}${msgHtml}</blockquote>` +
        (bookUrl ? para(l.contactBook) + button(bookUrl, t(d.lang).cta.book) : '') +
        `<p style="margin:24px 0 0;">${l.sign}<br><strong>${esc(site.name)}</strong></p>`,
      footer: d.lang === 'fr' ? 'Accusé de réception automatique.' : 'Automatic acknowledgement.',
    }),
    replyTo: ownerEmail() || undefined,
  };

  const toOwner: Mail = {
    to: ownerEmail(),
    subject: `Message de ${d.name}${d.subject ? ` : ${d.subject}` : ''}`,
    html: shell({
      preheader: `${d.name} vous a écrit.`,
      title: 'Nouveau message',
      body:
        table(row('Nom', esc(d.name)) + (d.phone ? row('Téléphone', `<a href="tel:${esc(d.phone)}">${esc(d.phone)}</a>`) : '') + (d.company ? row('Entreprise', esc(d.company)) : '') + (d.siteUrl ? row('Site web', esc(d.siteUrl)) : '') + (needLabel ? row('Besoin', esc(needLabel)) : '') + (budgetLabel ? row('Budget', esc(budgetLabel)) : '') + (d.source ? row('Page d’origine', esc(sourceText(d.source))) : '') + row('E-mail', `<a href="mailto:${esc(d.email)}">${esc(d.email)}</a>`) + row('Sujet', esc(d.subject || 'Non renseigné')) + row('Langue', d.lang.toUpperCase())) +
        `<blockquote style="margin:0;padding:12px 18px;border-left:3px solid ${C.violet};background:${C.lilas};">${msgHtml}</blockquote>`,
      footer: 'Répondez directement à cet e-mail pour écrire à la personne.',
    }),
    replyTo: d.email,
  };
  return { toVisitor, toOwner };
}

/* ---------- LABO ---------- */
export function labMails(d: { email: string; lang: Lang }) {
  const l = L[d.lang];
  const toVisitor: Mail = {
    to: d.email,
    subject: l.labSubject,
    html: shell({
      preheader: l.labPre,
      title: l.labTitle,
      body: para(l.labBody) + `<p style="margin:24px 0 0;">${l.sign}<br><strong>${esc(site.name)}</strong></p>`,
      footer: l.labOut,
    }),
    replyTo: ownerEmail() || undefined,
  };
  const toOwner: Mail = {
    to: ownerEmail(),
    subject: `Nouvelle inscription « Dans le labo » : ${d.email}`,
    html: shell({
      preheader: d.email,
      title: 'Nouvelle inscription',
      body: table(row('E-mail', esc(d.email)) + row('Langue', d.lang.toUpperCase())),
      footer: 'Alerte automatique.',
    }),
  };
  return { toVisitor, toOwner };
}

/* ---------- RESSOURCE GRATUITE (PDF envoyé par e-mail) ---------- */
export function resourceMails(d: { email: string; lang: Lang; title: string; url: string; slug: string; source?: string }) {
  const fr = d.lang === 'fr';
  const origin = env('SITE_URL').replace(/\/$/, '');
  const bookUrl = origin ? `${origin}/${d.lang}/book` : '';
  const toVisitor: Mail = {
    to: d.email,
    subject: fr ? `Votre ressource : ${d.title}` : `Your resource: ${d.title}`,
    html: shell({
      preheader: fr ? 'Voici votre ressource, comme promis.' : 'Here is your resource, as promised.',
      title: fr ? 'Voici votre ressource.' : 'Here is your resource.',
      body:
        para(esc(d.title)) +
        button(d.url, fr ? 'Télécharger le PDF' : 'Download the PDF') +
        para(
          fr
            ? 'Si vous voulez aller plus loin ou que je regarde votre cas, vous pouvez réserver un échange gratuit de 30 minutes :'
            : 'If you want to go further or have me look at your case, you can book a free 30-minute call:',
        ) +
        (bookUrl ? button(bookUrl, t(d.lang).cta.book) : '') +
        `<p style="margin:24px 0 0;">${fr ? 'À très vite,' : 'Talk soon,'}<br><strong>${esc(site.name)}</strong></p>`,
      footer: fr ? 'Vous recevez cet e-mail car vous avez demandé cette ressource sur mon site.' : 'You are receiving this email because you requested this resource on my website.',
    }),
    replyTo: ownerEmail() || undefined,
  };
  const toOwner: Mail = {
    to: ownerEmail(),
    subject: `Ressource téléchargée : ${d.title}`,
    html: shell({
      preheader: `${d.email} a demandé une ressource.`,
      title: 'Nouvelle demande de ressource',
      body: table(row('E-mail', `<a href="mailto:${esc(d.email)}">${esc(d.email)}</a>`) + row('Ressource', esc(d.title)) + row('Langue', d.lang.toUpperCase()) + (d.source ? row('Page d’origine', esc(d.source)) : '')),
      footer: 'Une personne intéressée par vos conseils : pensez à la recontacter.',
    }),
    replyTo: d.email,
  };
  return { toVisitor, toOwner };
}
