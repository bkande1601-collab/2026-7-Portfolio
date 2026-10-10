/**
 * E-mails (Resend, via fetch). Gabarits FR/EN.
 * Tout texte venant d'un visiteur est échappé avant d'entrer dans le HTML.
 */
import { env, hasResend } from './env';
import { site, booking } from '../config/site';
import { t, type Lang } from '../content';

export const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const firstName = (full: string) => full.trim().split(/\s+/)[0] || full;

type Mail = { to: string; subject: string; html: string; replyTo?: string };

export async function sendMail(m: Mail): Promise<boolean> {
  if (!hasResend()) return false;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env('RESEND_API_KEY')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env('MAIL_FROM'),
      to: [m.to],
      subject: m.subject,
      html: m.html,
      ...(m.replyTo ? { reply_to: m.replyTo } : {}),
    }),
  });
  return res.ok;
}

export const ownerEmail = () => env('OWNER_EMAIL');

/* ---------- cadre commun ---------- */
const C = { bg: '#f4ece2', card: '#fffaf4', dark: '#1a1410', text: '#2a211b', muted: '#7a6a5c', apricot: '#f4a77c', honey: '#e8b75a', line: '#eadccc' };

function shell(opts: { preheader: string; title: string; body: string; footer: string }) {
  return `<!doctype html><html><body style="margin:0;padding:0;background:${C.bg};">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(opts.preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};padding:28px 12px;">
<tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
  <tr><td style="background:${C.dark};border-radius:20px 20px 0 0;padding:26px 32px;">
    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${C.apricot};margin-right:10px;"></span><span style="font:700 18px/1 Helvetica,Arial,sans-serif;color:#f1e8de;letter-spacing:-0.02em;">${esc(site.brand)}</span>
  </td></tr>
  <tr><td style="background:${C.card};padding:36px 32px 28px;border-radius:0 0 20px 20px;font:16px/1.65 Helvetica,Arial,sans-serif;color:${C.text};">
    <h1 style="margin:0 0 18px;font:700 28px/1.15 Helvetica,Arial,sans-serif;letter-spacing:-0.03em;color:${C.dark};">${opts.title}</h1>
    ${opts.body}
  </td></tr>
  <tr><td style="padding:18px 8px;font:12px/1.5 Helvetica,Arial,sans-serif;color:${C.muted};text-align:center;">${opts.footer}</td></tr>
</table></td></tr></table></body></html>`;
}

const button = (href: string, label: string) =>
  `<p style="margin:26px 0;"><a href="${esc(href)}" style="display:inline-block;background:${C.apricot};color:#1a120c;text-decoration:none;font:700 16px/1 Helvetica,Arial,sans-serif;padding:15px 26px;border-radius:999px;">${esc(label)}</a></p>`;

const row = (k: string, v: string) =>
  `<tr><td style="padding:10px 0;border-bottom:1px solid ${C.line};width:130px;color:${C.muted};font-size:14px;vertical-align:top;">${esc(k)}</td><td style="padding:10px 0;border-bottom:1px solid ${C.line};font-size:15px;">${v}</td></tr>`;

const table = (rows: string) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0;">${rows}</table>`;

const para = (s: string) => `<p style="margin:0 0 16px;">${s}</p>`;

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
    marketing: [
      'Notez vos objectifs des 3 prochains mois (leads, notoriété, ventes).',
      'Gardez à portée vos chiffres actuels : trafic, taux de conversion, budgets.',
      'Dites-moi ce qui a déjà été essayé, et ce qui a marché ou non.',
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
    marketing: [
      'Write down your goals for the next 3 months (leads, awareness, sales).',
      'Keep your current numbers at hand: traffic, conversion rate, budgets.',
      'Tell me what has been tried already, and what worked or not.',
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
    fields: { name: 'Nom', email: 'E-mail', company: 'Entreprise', need: 'Besoin', budget: 'Budget', message: 'Message' },
    footer: 'Vous recevez cet e-mail suite à une réservation sur mon site.',
    contactSubject: 'J’ai bien reçu votre message',
    contactPre: 'Accusé de réception de votre message.',
    contactTitle: (n: string) => `Merci ${esc(n)}, message bien reçu.`,
    contactBody: 'Je lis chaque message personnellement et je reviens vers vous sous deux jours ouvrés.',
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
    fields: { name: 'Name', email: 'Email', company: 'Company', need: 'Need', budget: 'Budget', message: 'Message' },
    footer: 'You are receiving this email because you booked a call on my website.',
    contactSubject: 'I received your message',
    contactPre: 'Acknowledgement of your message.',
    contactTitle: (n: string) => `Thank you ${esc(n)}, message received.`,
    contactBody: 'I read every message personally and will get back to you within two working days.',
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
  email: string;
  company: string;
  need: string;
  budget: string;
  message: string;
  lang: Lang;
  startMs: number;
  tz: string;
  meetLink: string;
};

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
    text: `${site.brand} — ${t(d.lang).cta.book}`,
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
  const needLabel = c.book.needs.find((n) => n.v === d.need)?.t ?? d.need;
  const budgetLabel = c.book.budgets.find((n) => n.v === d.budget)?.t ?? '';
  const tips = (prep[d.lang][d.need] ?? prep[d.lang].other)
    .map((x) => `<li style="margin:0 0 8px;">${esc(x)}</li>`)
    .join('');

  const answers = table(
    row(l.fields.name, esc(d.name)) +
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
    `<h2 style="margin:28px 0 6px;font:700 18px/1.2 Helvetica,Arial,sans-serif;color:${C.dark};">${l.prepTitle}</h2>` +
    `<ul style="margin:10px 0 24px;padding-left:20px;">${tips}</ul>` +
    `<h2 style="margin:28px 0 0;font:700 18px/1.2 Helvetica,Arial,sans-serif;color:${C.dark};">${l.yours}</h2>` +
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
  const needLabel = c.book.needs.find((n) => n.v === d.need)?.t ?? d.need;
  const budgetLabel = c.book.budgets.find((n) => n.v === d.budget)?.t ?? '—';
  const f = L.fr.fields;
  const body =
    para(`<strong>${esc(when)}</strong> (${esc(booking.timezone)}) · ${booking.durationMin} min · ${d.lang.toUpperCase()}`) +
    table(
      row(f.name, esc(d.name)) +
        row(f.email, `<a href="mailto:${esc(d.email)}">${esc(d.email)}</a>`) +
        row(f.company, esc(d.company || '—')) +
        row(f.need, esc(needLabel)) +
        row(f.budget, esc(budgetLabel)) +
        row(f.message, esc(d.message || '—').replace(/\n/g, '<br>')),
    ) +
    (d.meetLink ? button(d.meetLink, 'Google Meet') : '') +
    (eventLink ? `<p style="margin:0;font-size:14px;"><a href="${esc(eventLink)}" style="color:${C.muted};">Voir dans Google Agenda</a></p>` : '');
  return {
    to: ownerEmail(),
    subject: `Nouveau rendez-vous : ${d.name} — ${when}`,
    html: shell({ preheader: `${d.name} a réservé un audit.`, title: 'Nouveau rendez-vous', body, footer: 'Récapitulatif automatique.' }),
    replyTo: d.email,
  };
}

/* ---------- MESSAGE ---------- */
export function contactMails(d: { name: string; email: string; subject: string; message: string; lang: Lang }) {
  const l = L[d.lang];
  const msgHtml = esc(d.message).replace(/\n/g, '<br>');
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
        `<blockquote style="margin:0 0 20px;padding:12px 18px;border-left:3px solid ${C.apricot};background:#fbf3ea;color:${C.text};">${d.subject ? `<strong>${esc(d.subject)}</strong><br>` : ''}${msgHtml}</blockquote>` +
        (bookUrl ? para(l.contactBook) + button(bookUrl, t(d.lang).cta.book) : '') +
        `<p style="margin:24px 0 0;">${l.sign}<br><strong>${esc(site.name)}</strong></p>`,
      footer: d.lang === 'fr' ? 'Accusé de réception automatique.' : 'Automatic acknowledgement.',
    }),
    replyTo: ownerEmail() || undefined,
  };

  const toOwner: Mail = {
    to: ownerEmail(),
    subject: `Message de ${d.name}${d.subject ? ` — ${d.subject}` : ''}`,
    html: shell({
      preheader: `${d.name} vous a écrit.`,
      title: 'Nouveau message',
      body:
        table(row('Nom', esc(d.name)) + row('E-mail', `<a href="mailto:${esc(d.email)}">${esc(d.email)}</a>`) + row('Sujet', esc(d.subject || '—')) + row('Langue', d.lang.toUpperCase())) +
        `<blockquote style="margin:0;padding:12px 18px;border-left:3px solid ${C.apricot};background:#fbf3ea;">${msgHtml}</blockquote>`,
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
