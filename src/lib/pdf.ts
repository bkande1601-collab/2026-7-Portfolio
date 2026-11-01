/**
 * PDF du diagnostic (2 à 5 pages A4), généré avec pdfkit. Charte du site : ivoire, violet, cannelle.
 * Module pur : aucune dépendance au serveur, pour pouvoir le tester seul.
 */
import PDFDocument from 'pdfkit';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export type DiagResult = {
  resume: string;
  score_global: number;
  scores: { axe: string; score: number; commentaire: string }[];
  forces: string[];
  freins: { titre: string; constat: string; cause: string; impact: string; preuve?: string }[];
  pistes: { titre: string; probleme: string; solution: string; effet: string; effort: string; premier_pas: string; pourquoi_vous?: string; delai?: string; impact?: number; confiance?: number; facilite?: number }[];
  outils: { besoin: string; outil: string; pourquoi: string; cout: string }[];
  plan: { periode: string; actions: string[]; temps?: string; livrable?: string }[];
  indicateurs: { indicateur: string; cible: string; depart?: string }[];
  a_eviter: string[];
  questions?: string[];
  analyse_expert?: { verdict: string; goulot: string; lecture: string; angle_mort: string; opportunite: string; risque: string };
  offre?: { resultat: number; probabilite: number; rapidite: number; facilite: number; commentaire: string; amelioration: string };
  entonnoir?: { etape: string; etat: string; constat: string }[];
  swot?: { forces: string[]; faiblesses: string[]; opportunites: string[]; menaces: string[] };
  potentiel?: { heures_par_mois: number; revenu_mensuel: number; hypotheses: string; calcul?: string };
  suite_90_jours?: string[];
  mot_de_binta?: string;
  conseils?: { titre: string; idee: string; comment: string; qui: string; cout: string; budget: string }[];
  deleguer?: { tache: string; option: string; cout: string; gain: string; quand: string }[];
  avec_binta?: { service: string; constat: string; je_ferais: string; resultat: string }[];
};

export type PdfMeta = { name: string; date: Date; lang: 'fr' | 'en' };

const C = { ivory: '#f6f0e4', card: '#fbf7ee', violet: '#694cac', deep: '#3b2a63', lilas: '#e4d9f1', lilasStrong: '#c6b8e4', cannelle: '#8a4b36', warm: '#f3e3d6', text: '#2b1d16', muted: '#675549', line: '#e2d6c3', ok: '#2f7d4f', okBg: '#e2f1e6' };
const PAGE = { w: 595.28, h: 841.89, m: 40 };

/** Helvetica (WinAnsi) : on remplace les caractères hors jeu et on supprime les marqueurs Markdown résiduels. */
export function clean(s: unknown): string {
  return String(s ?? '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/(^|\s)\*([^*\n]+)\*/g, '$1$2')
    .replace(/[   ]/g, ' ')
    .replace(/[→⟶➜➔]/g, '->')
    .replace(/[≈≃]/g, '~')
    .replace(/[✓✔☑]/g, '-')
    .replace(/€ /g, '€  ') // Helvetica : le signe euro déborde sur le caractère suivant
    .replace(/€(?=[^\s])/g, '€ ')
    .replace(/[≥]/g, '>=')
    .replace(/[≤]/g, '<=')
    .replace(/[‐‑‒]/g, '-')
    .replace(/[^ -~¡-ÿ‘’“”–—•…€™\n]/g, '')
    .trim();
}

const L = {
  fr: { title: 'Diagnostic de votre business', for: 'Préparé pour', brief: 'En bref', score: 'Score de maturité', forces: 'Vos points forts', freins: 'Ce qui vous freine', pistes: 'Vos 3 priorités', problem: 'Le problème', solution: 'La solution', effect: 'L’effet attendu', first: 'Votre premier pas', effort: 'Effort', tools: 'Les outils recommandés', need: 'Besoin', tool: 'Outil', why: 'Pourquoi', cost: 'Coût', plan: 'Votre plan d’action sur 30 jours', kpi: 'Les chiffres à suivre', target: 'Cible', avoid: 'À éviter', clarify: 'Points à clarifier', next: 'Et maintenant ?', nextText: 'Choisissez l’action de la semaine 1 et faites-la aujourd’hui. Si vous voulez que je la mette en place avec vous, répondez simplement à l’e-mail du diagnostic.', est: 'Les chiffres donnés sont des estimations, à confirmer sur votre terrain.', expert: 'Analyse business experte', expertTitle: 'Le regard de l’expert', goulot: 'Le goulot d’étranglement', lecture: 'Lecture de fond', blind: 'Votre angle mort', opp: 'L’opportunité cachée', risk: 'Le risque si vous ne faites rien', funnel: 'Votre entonnoir de clients', offer: 'Votre offre passée au crible', swot: 'Forces, faiblesses, opportunités, menaces', matrix: 'Quelle piste en premier ?', potential: 'Le potentiel estimé', hours: 'heures récupérables par mois', revenue: 'de chiffre d’affaires en plus par mois', after: 'Et après : les mois 2 et 3', states: { fort: 'Fort', moyen: 'Moyen', faible: 'Faible' } as Record<string, string>, ov: ['Résultat espéré', 'Probabilité d’y arriver', 'Rapidité du résultat', 'Facilité pour le client'], sw: ['Forces', 'Faiblesses', 'Opportunités', 'Menaces'], do1: 'À faire d’abord', est2: 'Estimation', page: 'Page', of: 'sur', cause: 'Cause', impact: 'Conséquence', diag: 'Conséquence', proof: 'Vous avez écrit', whyYou: 'Pourquoi vous', calc: 'Le calcul', start: 'Aujourd’hui', kpi0: 'Indicateur', book: 'Réserver un échange de 30 minutes', letter: 'Mon regard sur votre business', ideas: 'Pour aller plus loin : idées et axes d’amélioration', how: 'Comment', who: 'Qui', budgets: { zero: 'Sans budget', petit: 'Petit budget', grand: 'À investir' } as Record<string, string>, deleg: 'Déléguer ou recruter', task: 'Tâche', option: 'Option', gain: 'Ce que ça change', when: 'Quand', withme: 'Où je peux vous aider', constat: 'Ce que j’ai vu', ido: 'Ce que je ferais', result: 'Le résultat visé', deliver: 'À la fin de la semaine' },
  en: { title: 'Your business diagnostic', for: 'Prepared for', brief: 'In brief', score: 'Maturity score', forces: 'Your strengths', freins: 'What is holding you back', pistes: 'Your 3 priorities', problem: 'The problem', solution: 'The solution', effect: 'Expected effect', first: 'Your first step', effort: 'Effort', tools: 'Recommended tools', need: 'Need', tool: 'Tool', why: 'Why', cost: 'Cost', plan: 'Your 30-day action plan', kpi: 'Numbers to track', target: 'Target', avoid: 'Pitfalls to avoid', clarify: 'Points to clarify', next: 'What now?', nextText: 'Pick the week-1 action and do it today. If you would like me to implement it with you, just reply to the diagnostic email.', est: 'Figures given are estimates, to be confirmed in your own context.', expert: 'Expert business analysis', expertTitle: 'The expert’s view', goulot: 'The bottleneck', lecture: 'The deeper reading', blind: 'Your blind spot', opp: 'The hidden opportunity', risk: 'The risk if you do nothing', funnel: 'Your customer funnel', offer: 'Your offer under the microscope', swot: 'Strengths, weaknesses, opportunities, threats', matrix: 'Which lever first?', potential: 'Estimated potential', hours: 'hours recoverable per month', revenue: 'extra revenue per month', after: 'What next: months 2 and 3', states: { fort: 'Strong', moyen: 'Medium', faible: 'Weak' } as Record<string, string>, ov: ['Desired outcome', 'Likelihood of success', 'Speed of results', 'Ease for the customer'], sw: ['Strengths', 'Weaknesses', 'Opportunities', 'Threats'], do1: 'Do first', est2: 'Estimate', page: 'Page', of: 'of', cause: 'Cause', impact: 'Consequence', diag: 'Consequence', proof: 'You wrote', whyYou: 'Why you', calc: 'The maths', start: 'Today', kpi0: 'Metric', book: 'Book a 30-minute call', letter: 'My view of your business', ideas: 'Going further: ideas and improvement areas', how: 'How', who: 'Who', budgets: { zero: 'No budget', petit: 'Small budget', grand: 'To invest' } as Record<string, string>, deleg: 'Delegate or hire', task: 'Task', option: 'Option', gain: 'What it changes', when: 'When', withme: 'Where I can help', constat: 'What I saw', ido: 'What I would do', result: 'Target result', deliver: 'By the end of the week' },
};

const logoPath = () => [join(process.cwd(), 'public', 'email', 'logo.png'), join(process.cwd(), 'dist', 'client', 'email', 'logo.png')].find((p) => existsSync(p));

function render(res: DiagResult, meta: PdfMeta, k: number): Promise<{ buf: Buffer; pages: number }> {
  const t = L[meta.lang];
  const doc = new PDFDocument({ size: 'A4', margin: PAGE.m, bufferPages: true, info: { Title: `${t.title} - ${clean(meta.name)}`, Author: 'Binta Kande' } });
  const chunks: Buffer[] = [];
  doc.on('data', (c: Buffer) => chunks.push(c));
  const paper = () => doc.rect(0, 0, PAGE.w, PAGE.h).fill('#fbf8f1');
  paper();
  const W = PAGE.w - PAGE.m * 2;
  const bottom = PAGE.h - 56;
  let y = PAGE.m;

  const fs = (n: number) => n * k;
  const font = (name: 'r' | 'b' | 'i') => doc.font({ r: 'Helvetica', b: 'Helvetica-Bold', i: 'Helvetica-Oblique' }[name]);
  const h = (txt: string, size: number, width: number, name: 'r' | 'b' | 'i' = 'r', gap = 2) => {
    font(name).fontSize(fs(size));
    return doc.heightOfString(clean(txt), { width, lineGap: gap });
  };
  const text = (txt: string, x: number, yy: number, width: number, size: number, color: string, name: 'r' | 'b' | 'i' = 'r', gap = 2, opts: PDFKit.Mixins.TextOptions = {}) => {
    font(name).fontSize(fs(size)).fillColor(color).text(clean(txt), x, yy, { width, lineGap: gap, ...opts });
  };
  const newPage = () => {
    doc.addPage();
    paper();
    doc.rect(0, 0, PAGE.w, 8).fill(C.violet);
    y = 30;
  };
  const ensure = (need: number) => { if (y + need > bottom) newPage(); };
  const heading = (label: string, minBody = 110) => {
    ensure(34 + minBody); // un titre ne reste jamais seul en bas de page
    doc.rect(PAGE.m, y + 3, 5, fs(17)).fill(C.violet);
    text(label, PAGE.m + 14, y, W - 14, 16, C.deep, 'b');
    y += fs(16) + 12;
  };
  const tagWidth = (label: string) => { font('b').fontSize(fs(8)); return doc.widthOfString(clean(label)) + 14; };
  const tag = (label: string, x: number, yy: number, bg: string, fg: string) => {
    font('b').fontSize(fs(8));
    const w = doc.widthOfString(clean(label)) + 14;
    doc.roundedRect(x, yy, w, fs(8) + 8, 8).fill(bg);
    doc.fillColor(fg).text(clean(label), x + 7, yy + 4, { lineBreak: false });
    return w;
  };

  /* ----- en-tête de couverture ----- */
  doc.rect(0, 0, PAGE.w, 132).fill(C.deep);
  doc.rect(0, 132, PAGE.w, 5).fill(C.violet);
  const lp = logoPath();
  if (lp) {
    try { doc.image(readFileSync(lp), PAGE.m, 26, { width: 130 }); } catch { /* logo facultatif */ }
  } else {
    text('Binta Kande', PAGE.m, 30, 300, 18, '#fbf7ee', 'b');
  }
  text(t.title, PAGE.m, 72, W, 24, '#fbf7ee', 'b');
  const dateStr = new Intl.DateTimeFormat(meta.lang === 'fr' ? 'fr-FR' : 'en-GB', { dateStyle: 'long', timeZone: 'Europe/Paris' }).format(meta.date);
  text(`${t.for} ${meta.name || ''}  ·  ${dateStr}`, PAGE.m, 104, W, 10, C.lilasStrong);
  y = 156;

  /* ----- en bref + score ----- */
  const sc = Math.max(0, Math.min(100, Math.round(res.score_global)));
  const boxW = W - 150;
  const briefH = h(res.resume, 10.5, boxW - 36, 'r', 3) + 44;
  ensure(Math.max(briefH, 112));
  const top = y;
  const blockH = Math.max(briefH, 112);
  doc.roundedRect(PAGE.m, top, boxW, blockH, 12).fill(C.lilas);
  doc.rect(PAGE.m, top + 14, 4, blockH - 28).fill(C.violet);
  text(t.brief.toUpperCase(), PAGE.m + 20, top + 14, boxW - 36, 8.5, C.violet, 'b', 2, { characterSpacing: 1 });
  text(res.resume, PAGE.m + 20, top + 30, boxW - 36, 10.5, C.text, 'r', 3);
  const gx = PAGE.m + boxW + 14;
  const gw = W - boxW - 14;
  doc.roundedRect(gx, top, gw, blockH, 12).fill(C.deep);
  text(t.score.toUpperCase(), gx + 8, top + 14, gw - 16, 7.5, C.lilasStrong, 'b', 2, { align: 'center', characterSpacing: 0.6 });
  text(String(sc), gx, top + blockH / 2 - 22, gw, 40, '#fbf7ee', 'b', 0, { align: 'center' });
  text('/ 100', gx, top + blockH / 2 + 22, gw, 10, C.lilasStrong, 'r', 0, { align: 'center' });
  y = top + blockH + 16;

  /* ----- scores par axe ----- */
  if (res.scores?.length) {
    const cols = 2;
    const cw = (W - 16) / cols;
    const rows = Math.ceil(res.scores.length / cols);
    const rowH = (i: number) => {
      const a = res.scores[i], b = res.scores[i + 1];
      return Math.max(h(a.commentaire, 8.5, cw - 6, 'r', 1.5), b ? h(b.commentaire, 8.5, cw - 6, 'r', 1.5) : 0) + 30;
    };
    let total = 0;
    for (let r = 0; r < rows; r++) total += rowH(r * cols);
    ensure(total + 8);
    for (let r = 0; r < rows; r++) {
      const rh = rowH(r * cols);
      for (let c = 0; c < cols; c++) {
        const it = res.scores[r * cols + c];
        if (!it) continue;
        const x = PAGE.m + c * (cw + 16);
        const s10 = Math.max(0, Math.min(10, Math.round(it.score)));
        text(it.axe, x, y, cw - 40, 9.5, C.deep, 'b');
        text(`${s10}/10`, x + cw - 40, y, 40, 9.5, s10 >= 7 ? C.ok : s10 >= 4 ? C.violet : C.cannelle, 'b', 2, { align: 'right' });
        doc.roundedRect(x, y + fs(9.5) + 5, cw - 6, 5, 2.5).fill(C.line);
        doc.roundedRect(x, y + fs(9.5) + 5, Math.max(6, ((cw - 6) * s10) / 10), 5, 2.5).fill(s10 >= 7 ? C.ok : s10 >= 4 ? C.violet : C.cannelle);
        text(it.commentaire, x, y + fs(9.5) + 15, cw - 6, 8.5, C.muted, 'r', 1.5);
      }
      y += rh;
    }
    y += 6;
  }

  /* ----- points forts ----- */
  if (res.forces?.length) {
    const inner = W - 40;
    const hh = res.forces.reduce((n, f) => n + h(f, 10, inner - 16, 'r', 2) + 6, 0) + 38;
    ensure(hh);
    doc.roundedRect(PAGE.m, y, W, hh, 12).fill(C.okBg);
    doc.rect(PAGE.m, y + 14, 4, hh - 28).fill(C.ok);
    text(t.forces.toUpperCase(), PAGE.m + 20, y + 14, inner, 8.5, C.ok, 'b', 2, { characterSpacing: 1 });
    let yy = y + 32;
    for (const f of res.forces) {
      doc.circle(PAGE.m + 25, yy + fs(10) / 2 + 1, 2.5).fill(C.ok);
      text(f, PAGE.m + 36, yy, inner - 16, 10, C.text, 'r', 2);
      yy += h(f, 10, inner - 16, 'r', 2) + 6;
    }
    y += hh + 14;
  }


  /* ----- entonnoir ----- */
  if (res.entonnoir?.length) {
    heading(t.funnel);
    const n = res.entonnoir.length;
    const gap = 8;
    const cw = (W - gap * (n - 1)) / n;
    const col = (e: string) => (e === 'fort' ? { bg: C.okBg, fg: C.ok } : e === 'faible' ? { bg: C.warm, fg: C.cannelle } : { bg: C.lilas, fg: C.violet });
    ensure(60);
    res.entonnoir.forEach((e, i) => {
      const c = col(e.etat);
      const x = PAGE.m + i * (cw + gap);
      doc.roundedRect(x, y, cw, 52, 10).fill(c.bg);
      text(e.etape, x + 6, y + 10, cw - 12, 8.5, C.deep, 'b', 1, { align: 'center' });
      text((t.states[e.etat] ?? e.etat).toUpperCase(), x + 6, y + 30, cw - 12, 8, c.fg, 'b', 1, { align: 'center', characterSpacing: 0.8 });
    });
    y += 62;
    res.entonnoir.forEach((e) => {
      const c = col(e.etat);
      const line = `${e.etape} : ${e.constat}`;
      const lh = h(line, 9, W - 18, 'r', 2) + 4;
      ensure(lh);
      doc.circle(PAGE.m + 4, y + 5, 3).fill(c.fg);
      text(line, PAGE.m + 16, y, W - 18, 9, C.text, 'r', 2);
      y += lh;
    });
    y += 10;
  }

  /* ----- l'encadré de l'expert ----- */
  const ex = res.analyse_expert;
  if (ex?.verdict) {
    const iw = W - 48;
    const parts: [string, string][] = ([[t.goulot, ex.goulot], [t.lecture, ex.lecture], [t.blind, ex.angle_mort], [t.opp, ex.opportunite], [t.risk, ex.risque]] as [string, string][]).filter(([, v]) => v);
    const verdictH = h(ex.verdict, 12, iw, 'b', 3);
    const partsH = parts.reduce((n, [, v]) => n + 14 + h(v, 9.5, iw, 'r', 2.5) + 8, 0);
    const hh = 70 + verdictH + 22 + partsH;
    ensure(Math.min(hh, 330));
    if (y + hh > bottom) {
      // carte trop haute pour la page restante : on la découpe en deux
      newPage();
    }
    const top2 = y;
    doc.roundedRect(PAGE.m, top2, W, hh, 14).fill(C.deep);
    doc.roundedRect(PAGE.m, top2, W, 6, 3).fill(C.violet);
    const tw = tag(t.expert.toUpperCase(), PAGE.m + 24, top2 + 22, C.violet, '#fbf7ee');
    void tw;
    text(t.expertTitle, PAGE.m + 24, top2 + 44, iw, 17, '#fbf7ee', 'b');
    text(ex.verdict, PAGE.m + 24, top2 + 70, iw, 12, '#e4d9f1', 'b', 3);
    let yy = top2 + 70 + verdictH + 14;
    doc.moveTo(PAGE.m + 24, yy).lineTo(PAGE.m + W - 24, yy).lineWidth(0.8).stroke('#6a56a0');
    yy += 10;
    for (const [lbl, v] of parts) {
      text(lbl.toUpperCase(), PAGE.m + 24, yy, iw, 7.5, C.lilasStrong, 'b', 2, { characterSpacing: 0.8 });
      yy += 12;
      text(v, PAGE.m + 24, yy, iw, 9.5, '#f1ebfa', 'r', 2.5);
      yy += h(v, 9.5, iw, 'r', 2.5) + 8;
    }
    y = top2 + hh + 16;
  }

  /* ----- le mot de Binta ----- */
  if (res.mot_de_binta) {
    const iw = W - 56;
    const letter = clean(res.mot_de_binta).replace(/\s*Binta\.?$/, '');
    const hh = 52 + h(letter, 10.5, iw, 'i', 3.5) + 14 + fs(11) + 14;
    ensure(Math.min(hh, 260));
    if (y + hh > bottom) newPage();
    doc.roundedRect(PAGE.m, y, W, hh, 14).fill(C.lilas);
    doc.rect(PAGE.m, y + 16, 4, hh - 32).fill(C.violet);
    text(t.letter.toUpperCase(), PAGE.m + 28, y + 18, iw, 8.5, C.violet, 'b', 2, { characterSpacing: 1 });
    text(letter, PAGE.m + 28, y + 38, iw, 10.5, C.deep, 'i', 3.5);
    text('Binta', PAGE.m + 28, y + 38 + h(letter, 10.5, iw, 'i', 3.5) + 10, iw, 11, C.violet, 'b');
    y += hh + 16;
  }

  /* ----- offre (équation de valeur) ----- */
  if (res.offre?.commentaire) {
    heading(t.offer);
    const o = res.offre;
    const vals = [o.resultat, o.probabilite, o.rapidite, o.facilite];
    const bw = (W - 40) / 2;
    const textH = h(o.commentaire, 9.5, W - 36, 'r', 2) + (o.amelioration ? h(o.amelioration, 9.5, W - 52, 'b', 2) + 20 : 0);
    const hh = 24 + 2 * 34 + textH + 18;
    ensure(hh);
    doc.roundedRect(PAGE.m, y, W, hh, 12).fill(C.card);
    vals.forEach((v, i) => {
      const x = PAGE.m + 18 + (i % 2) * (bw + 4);
      const yy = y + 16 + Math.floor(i / 2) * 34;
      text(t.ov[i], x, yy, bw - 40, 9, C.deep, 'b');
      text(`${v}/10`, x + bw - 40, yy, 36, 9, C.violet, 'b', 2, { align: 'right' });
      doc.roundedRect(x, yy + 14, bw - 4, 5, 2.5).fill(C.line);
      doc.roundedRect(x, yy + 14, Math.max(5, ((bw - 4) * Math.max(0, Math.min(10, v))) / 10), 5, 2.5).fill(v >= 7 ? C.ok : v >= 4 ? C.violet : C.cannelle);
    });
    let yy = y + 16 + 2 * 34 + 2;
    text(o.commentaire, PAGE.m + 18, yy, W - 36, 9.5, C.text, 'r', 2);
    yy += h(o.commentaire, 9.5, W - 36, 'r', 2) + 8;
    if (o.amelioration) {
      const ah = h(o.amelioration, 9.5, W - 52, 'b', 2) + 12;
      doc.roundedRect(PAGE.m + 14, yy, W - 28, ah, 8).fill(C.okBg);
      text(o.amelioration, PAGE.m + 22, yy + 6, W - 52, 9.5, '#1c4a30', 'b', 2);
    }
    y += hh + 12;
  }

  /* ----- freins ----- */
  heading(t.freins);
  res.freins?.forEach((f, i) => {
    const w = W - 36;
    const lines: [string, 'r' | 'i', string][] = [[f.constat, 'r', C.text], [`${t.cause} : ${f.cause}`, 'i', C.muted], [`${t.impact} : ${f.impact}`, 'i', C.muted]];
    if (f.preuve) lines.unshift([`${t.proof} : « ${f.preuve} »`, 'i', C.cannelle]);
    const titleH = h(f.titre, 11, w - 18, 'b');
    const hh = 14 + titleH + lines.reduce((n, [v, nm]) => n + h(v, 9.5, w - 18, nm, 2) + 3, 0) + 12;
    ensure(hh);
    doc.roundedRect(PAGE.m, y, W, hh, 12).fill(C.warm);
    doc.rect(PAGE.m, y + 14, 4, hh - 28).fill(C.cannelle);
    text(`${i + 1}. ${f.titre}`, PAGE.m + 18, y + 12, w - 18, 11, C.cannelle, 'b');
    let yy = y + 14 + titleH;
    for (const [v, nm, col] of lines) {
      text(v, PAGE.m + 18, yy, w - 18, 9.5, col, nm, 2);
      yy += h(v, 9.5, w - 18, nm, 2) + 3;
    }
    y += hh + 8;
  });
  y += 4;


  /* ----- SWOT ----- */
  const sw = res.swot;
  if (sw && (sw.forces.length || sw.faiblesses.length || sw.opportunites.length || sw.menaces.length)) {
    heading(t.swot);
    const cells: [string, string[], string, string][] = [[t.sw[0], sw.forces, C.okBg, C.ok], [t.sw[1], sw.faiblesses, C.warm, C.cannelle], [t.sw[2], sw.opportunites, C.lilas, C.violet], [t.sw[3], sw.menaces, '#e9e4f2', C.deep]];
    const cw = (W - 10) / 2;
    for (let r = 0; r < 2; r++) {
      const pair = cells.slice(r * 2, r * 2 + 2);
      const rh = Math.max(...pair.map(([, items]) => items.reduce((n, it) => n + h(it, 9, cw - 34, 'r', 1.5) + 4, 0) + 32));
      ensure(rh);
      pair.forEach(([lbl, items, bg, fg], c) => {
        const x = PAGE.m + c * (cw + 10);
        doc.roundedRect(x, y, cw, rh, 12).fill(bg);
        text(lbl.toUpperCase(), x + 16, y + 12, cw - 32, 8, fg, 'b', 2, { characterSpacing: 1 });
        let yy = y + 28;
        for (const it of items) {
          doc.circle(x + 20, yy + 5, 2).fill(fg);
          text(it, x + 30, yy, cw - 34, 9, C.text, 'r', 1.5);
          yy += h(it, 9, cw - 34, 'r', 1.5) + 4;
        }
      });
      y += rh + 10;
    }
    y += 4;
  }

  /* ----- pistes ----- */
  heading(t.pistes);
  res.pistes?.forEach((p, i) => {
    const x0 = PAGE.m + 50; // colonne de texte, à droite du numéro
    const w = W - 50 - 18;
    const rows: [string, string][] = [[t.problem, p.probleme], [t.solution, p.solution], [t.effect, p.effet]];
    if (p.pourquoi_vous) rows.splice(1, 0, [t.whyYou, p.pourquoi_vous]);
    const tagTxt = `${t.effort} : ${p.effort}${p.delai ? ` · ${p.delai}` : ''}`.slice(0, 40);
    const iceTxt = p.impact ? `ICE ${(((p.impact ?? 0) + (p.confiance ?? 0) + (p.facilite ?? 0)) / 3).toFixed(1)}` : '';
    const tagsW = Math.max(tagWidth(tagTxt), iceTxt ? tagWidth(iceTxt) : 0);
    const tagH = fs(8) + 8;
    const titleW = w - tagsW - 12;
    const header = Math.max(h(p.titre, 12, titleW, 'b'), iceTxt ? tagH * 2 + 6 : tagH) + 8;
    const body = rows.reduce((n, [lbl, v]) => n + h(`${lbl} : ${v}`, 9.5, w, 'r', 2) + 4, 0);
    const stepTxt = `${t.first} : ${p.premier_pas}`;
    const stepH = h(stepTxt, 9.5, w - 20, 'b', 2) + 16;
    const hh = 16 + header + body + 6 + stepH + 16;
    ensure(hh);
    doc.roundedRect(PAGE.m, y, W, hh, 12).lineWidth(1).fillAndStroke(C.card, C.line);
    doc.circle(PAGE.m + 24, y + 28, 14).fill(C.violet);
    text(String(i + 1), PAGE.m + 10, y + 21, 28, 14, '#fbf7ee', 'b', 0, { align: 'center' });
    text(p.titre, x0, y + 16, titleW, 12, C.deep, 'b');
    const tx = PAGE.m + W - 18 - tagsW; // pastilles alignées à droite, même largeur
    const tw1 = tagWidth(tagTxt);
    tag(tagTxt, tx + tagsW - tw1, y + 16, C.lilas, C.violet);
    if (iceTxt) tag(iceTxt, tx + tagsW - tagWidth(iceTxt), y + 16 + tagH + 6, C.okBg, C.ok);
    let yy = y + 16 + header;
    for (const [lbl, v] of rows) {
      font('b').fontSize(fs(9.5)).fillColor(C.violet).text(`${clean(lbl)} : `, x0, yy, { width: w, continued: true, lineGap: 2 });
      font('r').fillColor(C.text).text(clean(v), { lineGap: 2 });
      yy += h(`${lbl} : ${v}`, 9.5, w, 'r', 2) + 4;
    }
    yy += 6;
    doc.roundedRect(x0, yy, w, stepH, 8).fill(C.okBg);
    text(stepTxt, x0 + 10, yy + 8, w - 20, 9.5, '#1c4a30', 'b', 2);
    y += hh + 8;
  });
  y += 4;


  /* ----- matrice impact / facilité ----- */
  if (res.pistes?.some((p) => p.impact)) {
    heading(t.matrix);
    const mh = 190;
    ensure(mh);
    doc.roundedRect(PAGE.m, y, W, mh, 12).fill(C.card);
    const px = PAGE.m + 40, py = y + 16, pw = 250, ph = 140;
    doc.rect(px, py, pw, ph).fill('#ffffff');
    doc.rect(px + pw / 2, py, pw / 2, ph / 2).fill(C.lilas);
    doc.rect(px, py, pw / 2, ph / 2).fill('#efe8f8');
    doc.rect(px + pw / 2, py + ph / 2, pw / 2, ph / 2).fill('#f6f1fb');
    doc.rect(px, py, pw, ph).lineWidth(1).stroke(C.line);
    text(t.do1.toUpperCase(), px + pw / 2 + 6, py + 6, pw / 2 - 12, 7, C.violet, 'b', 1, { characterSpacing: 0.6, align: 'right' });
    text('IMPACT', PAGE.m + 6, py + ph / 2 - 6, 30, 7, C.muted, 'b', 0, { align: 'center' });
    text(meta.lang === 'fr' ? 'Difficile  ->  Facile' : 'Hard  ->  Easy', px, py + ph + 6, pw, 7.5, C.muted, 'r', 0, { align: 'center' });
    res.pistes.forEach((p, i) => {
      if (!p.impact) return;
      const cx = px + ((Math.max(1, Math.min(10, p.facilite ?? 5)) - 0.5) / 10) * pw;
      const cy = py + ph - ((Math.max(1, Math.min(10, p.impact)) - 0.5) / 10) * ph;
      doc.circle(cx, cy, 11).fill(C.violet);
      text(String(i + 1), cx - 11, cy - 5, 22, 10, '#fbf7ee', 'b', 0, { align: 'center' });
    });
    let ly = py + 4;
    const lx = px + pw + 24;
    res.pistes.forEach((p, i) => {
      const ice = (((p.impact ?? 0) + (p.confiance ?? 0) + (p.facilite ?? 0)) / 3).toFixed(1);
      doc.circle(lx + 8, ly + 8, 8).fill(C.violet);
      text(String(i + 1), lx, ly + 4, 16, 8, '#fbf7ee', 'b', 0, { align: 'center' });
      text(p.titre, lx + 24, ly, PAGE.m + W - lx - 34, 9, C.deep, 'b', 1.5);
      const th = h(p.titre, 9, PAGE.m + W - lx - 34, 'b', 1.5);
      text(`ICE ${ice}/10  ·  ${p.effort}`, lx + 24, ly + th + 1, PAGE.m + W - lx - 34, 8, C.muted, 'r');
      ly += th + 26;
    });
    y += mh + 12;
  }

  /* ----- idées et axes d'amélioration ----- */
  if (res.conseils?.length) {
    heading(t.ideas, 140);
    const bcol = (b: string) => (b === 'zero' ? { bg: C.okBg, fg: C.ok } : b === 'grand' ? { bg: C.warm, fg: C.cannelle } : { bg: C.lilas, fg: C.violet });
    res.conseils.forEach((c, i) => {
      const x0 = PAGE.m + 40;
      const w = W - 40 - 18;
      const label = (t.budgets[c.budget] ?? c.budget ?? '').slice(0, 24);
      const tw = label ? tagWidth(label) : 0;
      const titleW = w - tw - 12;
      const head = Math.max(h(c.titre, 11, titleW, 'b'), label ? fs(8) + 8 : 0) + 6;
      const meta = `${t.who} : ${c.qui}   ·   ${c.cout}`;
      const hh = 14 + head + h(c.idee, 9.5, w, 'r', 2) + 4 + h(`${t.how} : ${c.comment}`, 9.5, w, 'r', 2) + 4 + h(meta, 8.5, w, 'b', 1.5) + 14;
      ensure(hh);
      doc.roundedRect(PAGE.m, y, W, hh, 12).lineWidth(1).fillAndStroke(C.card, C.line);
      doc.circle(PAGE.m + 22, y + 26, 11).fill(C.deep);
      text(String(i + 1), PAGE.m + 11, y + 21, 22, 10.5, '#fbf7ee', 'b', 0, { align: 'center' });
      text(c.titre, x0, y + 14, titleW, 11, C.deep, 'b');
      if (label) { const bc = bcol(c.budget); tag(label, PAGE.m + W - 18 - tw, y + 14, bc.bg, bc.fg); }
      let yy = y + 14 + head;
      text(c.idee, x0, yy, w, 9.5, C.text, 'r', 2);
      yy += h(c.idee, 9.5, w, 'r', 2) + 4;
      font('b').fontSize(fs(9.5)).fillColor(C.violet).text(`${clean(t.how)} : `, x0, yy, { width: w, continued: true, lineGap: 2 });
      font('r').fillColor(C.text).text(clean(c.comment), { lineGap: 2 });
      yy += h(`${t.how} : ${c.comment}`, 9.5, w, 'r', 2) + 4;
      text(meta, x0, yy, w, 8.5, C.muted, 'b', 1.5);
      y += hh + 8;
    });
    y += 6;
  }

  /* ----- déléguer ou recruter ----- */
  if (res.deleguer?.length) {
    heading(t.deleg, 120);
    const cw = [W * 0.22, W * 0.17, W * 0.15, W * 0.26, W * 0.2];
    const heads = [t.task, t.option, t.cost, t.gain, t.when];
    ensure(30);
    doc.roundedRect(PAGE.m, y, W, 22, 6).fill(C.deep);
    let hx = PAGE.m;
    heads.forEach((hd, i) => { text(hd.toUpperCase(), hx + 8, y + 7, cw[i] - 12, 7.5, '#fbf7ee', 'b', 0, { characterSpacing: 0.6 }); hx += cw[i]; });
    y += 22;
    res.deleguer.forEach((d, ri) => {
      const cells = [d.tache, d.option, d.cout, d.gain, d.quand];
      const rh = Math.max(...cells.map((c, i) => h(c, 8.8, cw[i] - 14, i === 1 ? 'b' : 'r', 1.5))) + 14;
      ensure(rh);
      if (ri % 2 === 0) doc.rect(PAGE.m, y, W, rh).fill(C.card);
      let cx = PAGE.m;
      cells.forEach((c, i) => { text(c, cx + 8, y + 7, cw[i] - 14, 8.8, i === 1 ? C.violet : C.text, i === 1 ? 'b' : 'r', 1.5); cx += cw[i]; });
      y += rh;
    });
    doc.moveTo(PAGE.m, y).lineTo(PAGE.m + W, y).lineWidth(1).stroke(C.line);
    y += 16;
  }

  /* ----- potentiel ----- */
  const pot = res.potentiel;
  if (pot && (pot.heures_par_mois > 0 || pot.revenu_mensuel > 0)) {
    heading(t.potential);
    const tiles: [string, string][] = [];
    if (pot.heures_par_mois > 0) tiles.push([`${pot.heures_par_mois} h`, t.hours]);
    if (pot.revenu_mensuel > 0) tiles.push([`+${new Intl.NumberFormat(meta.lang === 'fr' ? 'fr-FR' : 'en-GB').format(pot.revenu_mensuel).replace(/\s/g, ' ')} EUR`, t.revenue]);
    const cw = (W - 12 * (tiles.length - 1)) / tiles.length;
    const note = [pot.calcul ? `${t.calc} : ${pot.calcul}` : '', pot.hypotheses ? `${t.est2} : ${pot.hypotheses}` : ''].filter(Boolean).join('\n');
    const hh = 72 + (note ? h(note, 8.5, W, 'i', 1.5) + 8 : 0);
    ensure(hh);
    tiles.forEach(([big, lbl], i) => {
      const x = PAGE.m + i * (cw + 12);
      doc.roundedRect(x, y, cw, 64, 12).fill(C.deep);
      text(big, x, y + 10, cw, 24, '#fbf7ee', 'b', 0, { align: 'center' });
      text(lbl, x + 8, y + 42, cw - 16, 8.5, C.lilasStrong, 'r', 1, { align: 'center' });
    });
    if (note) text(note, PAGE.m, y + 70, W, 8.5, C.muted, 'i', 1.5);
    y += hh + 10;
  }

  /* ----- outils ----- */
  if (res.outils?.length) {
    heading(t.tools);
    const cw = [W * 0.2, W * 0.2, W * 0.44, W * 0.16];
    const heads = [t.need, t.tool, t.why, t.cost];
    ensure(30);
    doc.roundedRect(PAGE.m, y, W, 22, 6).fill(C.deep);
    let x = PAGE.m;
    heads.forEach((hd, i) => { text(hd.toUpperCase(), x + 8, y + 7, cw[i] - 12, 7.5, '#fbf7ee', 'b', 0, { characterSpacing: 0.6 }); x += cw[i]; });
    y += 22;
    res.outils.forEach((o, ri) => {
      const cells = [o.besoin, o.outil, o.pourquoi, o.cout];
      const rh = Math.max(...cells.map((c, i) => h(c, 9, cw[i] - 14, i === 1 ? 'b' : 'r', 1.5))) + 14;
      ensure(rh);
      if (ri % 2 === 0) doc.rect(PAGE.m, y, W, rh).fill(C.card);
      let cx = PAGE.m;
      cells.forEach((c, i) => { text(c, cx + 8, y + 7, cw[i] - 14, 9, i === 1 ? C.violet : C.text, i === 1 ? 'b' : 'r', 1.5); cx += cw[i]; });
      y += rh;
    });
    doc.moveTo(PAGE.m, y).lineTo(PAGE.m + W, y).lineWidth(1).stroke(C.line);
    y += 16;
  }

  /* ----- plan d'action ----- */
  heading(t.plan);
  const pl = res.plan ?? [];
  const per = 2;
  for (let i = 0; i < pl.length; i += per) {
    const row = pl.slice(i, i + per);
    const cw = (W - 12) / per;
    const liv = (p: (typeof pl)[number]) => (p.livrable ? `${t.deliver} : ${p.livrable}` : '');
    const hs = row.map((p) => 36 + p.actions.reduce((n, a) => n + h(a, 9.5, cw - 42, 'r', 2) + 6, 0) + (liv(p) ? h(liv(p), 9, cw - 40, 'b', 1.5) + 22 : 8));
    const rh = Math.max(...hs);
    ensure(rh);
    row.forEach((p, c) => {
      const x = PAGE.m + c * (cw + 12);
      doc.roundedRect(x, y, cw, rh, 12).fill(C.lilas);
      doc.roundedRect(x, y, cw, 26, 12).fill(C.violet);
      doc.rect(x, y + 14, cw, 12).fill(C.violet);
      text(p.periode, x + 12, y + 8, cw - 24 - (p.temps ? 80 : 0), 10.5, '#fbf7ee', 'b');
      if (p.temps) text(p.temps, x + cw - 92, y + 9, 80, 8.5, C.lilas, 'b', 0, { align: 'right' });
      let yy = y + 36;
      for (const a of p.actions) {
        doc.roundedRect(x + 12, yy + 1, 9, 9, 2).lineWidth(1.2).stroke(C.violet);
        text(a, x + 28, yy, cw - 42, 9.5, C.text, 'r', 2);
        yy += h(a, 9.5, cw - 42, 'r', 2) + 6;
      }
      if (liv(p)) {
        const lh = h(liv(p), 9, cw - 40, 'b', 1.5) + 12;
        doc.roundedRect(x + 12, y + rh - lh - 10, cw - 24, lh, 7).fill('#fbf7ee');
        text(liv(p), x + 20, y + rh - lh - 4, cw - 40, 9, C.deep, 'b', 1.5);
      }
    });
    y += rh + 12;
  }


  if (res.suite_90_jours?.length) {
    const iw = W - 44;
    const hh = res.suite_90_jours.reduce((n, a) => n + h(a, 9.5, iw - 16, 'r', 2) + 5, 0) + 40;
    ensure(hh);
    doc.roundedRect(PAGE.m, y, W, hh, 12).fill(C.card).lineWidth(1).stroke(C.line);
    text(t.after.toUpperCase(), PAGE.m + 20, y + 14, iw, 8.5, C.violet, 'b', 2, { characterSpacing: 1 });
    let yy = y + 32;
    for (const a of res.suite_90_jours) {
      doc.circle(PAGE.m + 24, yy + 5, 2.5).fill(C.violet);
      text(a, PAGE.m + 36, yy, iw - 16, 9.5, C.text, 'r', 2);
      yy += h(a, 9.5, iw - 16, 'r', 2) + 5;
    }
    y += hh + 12;
  }

  /* ----- indicateurs ----- */
  if (res.indicateurs?.length) {
    heading(t.kpi);
    const hasStart = res.indicateurs.some((it) => it.depart);
    const cw = hasStart ? [W * 0.46, W * 0.24, W * 0.3] : [W * 0.6, 0, W * 0.4];
    ensure(60);
    doc.roundedRect(PAGE.m, y, W, 22, 6).fill(C.deep);
    [t.kpi0, hasStart ? t.start : '', t.target].forEach((hd, i) => {
      if (hd) text(hd.toUpperCase(), PAGE.m + [0, cw[0], cw[0] + cw[1]][i] + 8, y + 7, cw[i] - 12, 7.5, '#fbf7ee', 'b', 0, { characterSpacing: 0.6 });
    });
    y += 22;
    res.indicateurs.forEach((it, ri) => {
      const rh = Math.max(h(it.indicateur, 9.5, cw[0] - 14, 'r', 1.5), h(it.cible, 9.5, cw[2] - 14, 'b', 1.5), hasStart ? h(it.depart ?? '', 9.5, cw[1] - 14, 'r', 1.5) : 0) + 12;
      ensure(rh);
      if (ri % 2 === 0) doc.rect(PAGE.m, y, W, rh).fill(C.card);
      text(it.indicateur, PAGE.m + 8, y + 6, cw[0] - 14, 9.5, C.text, 'r', 1.5);
      if (hasStart) text(it.depart ?? '', PAGE.m + cw[0] + 8, y + 6, cw[1] - 14, 9.5, C.muted, 'r', 1.5);
      text(it.cible, PAGE.m + cw[0] + cw[1] + 8, y + 6, cw[2] - 14, 9.5, C.violet, 'b', 1.5);
      y += rh;
    });
    y += 14;
  }

  /* ----- à éviter + à clarifier ----- */
  if (res.a_eviter?.length) {
    const inner = W - 40;
    const hh = res.a_eviter.reduce((n, f) => n + h(f, 9.5, inner - 16, 'r', 2) + 5, 0) + 38;
    ensure(hh);
    doc.roundedRect(PAGE.m, y, W, hh, 12).fill(C.warm);
    doc.rect(PAGE.m, y + 14, 4, hh - 28).fill(C.cannelle);
    text(t.avoid.toUpperCase(), PAGE.m + 20, y + 14, inner, 8.5, C.cannelle, 'b', 2, { characterSpacing: 1 });
    let yy = y + 32;
    for (const f of res.a_eviter) {
      text('x', PAGE.m + 21, yy, 10, 9.5, C.cannelle, 'b');
      text(f, PAGE.m + 36, yy, inner - 16, 9.5, C.text, 'r', 2);
      yy += h(f, 9.5, inner - 16, 'r', 2) + 5;
    }
    y += hh + 14;
  }
  if (res.questions?.length) {
    const inner = W - 40;
    const hh = res.questions.reduce((n, f) => n + h(f, 9.5, inner - 16, 'r', 2) + 5, 0) + 38;
    ensure(hh);
    doc.roundedRect(PAGE.m, y, W, hh, 12).fill(C.card).lineWidth(1).stroke(C.line);
    text(t.clarify.toUpperCase(), PAGE.m + 20, y + 14, inner, 8.5, C.violet, 'b', 2, { characterSpacing: 1 });
    let yy = y + 32;
    for (const f of res.questions) {
      text('?', PAGE.m + 21, yy, 10, 9.5, C.violet, 'b');
      text(f, PAGE.m + 36, yy, inner - 16, 9.5, C.text, 'r', 2);
      yy += h(f, 9.5, inner - 16, 'r', 2) + 5;
    }
    y += hh + 14;
  }

  /* ----- où Binta peut aider ----- */
  if (res.avec_binta?.length) {
    heading(t.withme, 150);
    res.avec_binta.forEach((b) => {
      const w = W - 48;
      const rows: [string, string][] = [[t.constat, b.constat], [t.ido, b.je_ferais], [t.result, b.resultat]];
      const hh = 16 + h(b.service, 11.5, w, 'b') + 6 + rows.reduce((n, [l, v]) => n + h(`${l} : ${v}`, 9.5, w, 'r', 2) + 4, 0) + 12;
      ensure(hh);
      doc.roundedRect(PAGE.m, y, W, hh, 12).fill(C.lilas);
      doc.rect(PAGE.m, y + 14, 4, hh - 28).fill(C.violet);
      text(b.service, PAGE.m + 24, y + 14, w, 11.5, C.deep, 'b');
      let yy = y + 14 + h(b.service, 11.5, w, 'b') + 6;
      for (const [l, v] of rows) {
        font('b').fontSize(fs(9.5)).fillColor(C.violet).text(`${clean(l)} : `, PAGE.m + 24, yy, { width: w, continued: true, lineGap: 2 });
        font('r').fillColor(C.text).text(clean(v), { lineGap: 2 });
        yy += h(`${l} : ${v}`, 9.5, w, 'r', 2) + 4;
      }
      y += hh + 8;
    });
    y += 6;
  }

  /* ----- conclusion ----- */
  const nh = h(t.nextText, 10, W - 48, 'r', 3) + 56 + 46;
  ensure(nh);
  doc.roundedRect(PAGE.m, y, W, nh, 14).fill(C.deep);
  text(t.next, PAGE.m + 24, y + 16, W - 48, 15, '#fbf7ee', 'b');
  text(t.nextText, PAGE.m + 24, y + 40, W - 48, 10, C.lilasStrong, 'r', 3);
  const bookUrl = `https://bintakande.com/${meta.lang}/book`;
  font('b').fontSize(fs(10));
  const bw = doc.widthOfString(clean(t.book)) + 40;
  const by = y + nh - 56;
  doc.roundedRect(PAGE.m + 24, by, bw, 30, 15).fill('#fbf7ee');
  font('b').fontSize(fs(10)).fillColor(C.deep).text(clean(t.book), PAGE.m + 24, by + 10, { width: bw, align: 'center', lineBreak: false });
  doc.link(PAGE.m + 24, by, bw, 30, bookUrl);
  y += nh + 8;
  text(t.est, PAGE.m, y, W, 8, C.muted, 'i');

  /* ----- pieds de page ----- */
  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(i);
    doc.page.margins.bottom = 0;
    doc.moveTo(PAGE.m, PAGE.h - 38).lineTo(PAGE.w - PAGE.m, PAGE.h - 38).lineWidth(0.7).stroke(C.line);
    font('r').fontSize(8).fillColor(C.muted).text('Binta Kande  ·  bintakande.com', PAGE.m, PAGE.h - 30, { width: W / 1.4, lineBreak: false });
    font('r').fontSize(8).fillColor(C.muted).text(`${t.page} ${i + 1} ${t.of} ${range.count}`, PAGE.w - PAGE.m - 100, PAGE.h - 30, { width: 100, align: 'right', lineBreak: false });
  }

  return new Promise((resolve) => {
    doc.on('end', () => resolve({ buf: Buffer.concat(chunks), pages: range.count }));
    doc.end();
  });
}

/** Rend le PDF ; si le contenu dépasse 5 pages, on réduit progressivement la taille du texte. */
export async function renderDiagnosticPdf(res: DiagResult, meta: PdfMeta): Promise<{ buf: Buffer; pages: number }> {
  let out = await render(res, meta, 1);
  // visé : 5 à 8 pages. Trop court : texte un peu plus grand ; trop long : texte resserré.
  for (const k of [1.07, 1.14]) {
    if (out.pages >= 5) break;
    out = await render(res, meta, k);
  }
  for (const k of [0.94, 0.88, 0.83, 0.78, 0.74]) {
    if (out.pages <= 8) break;
    out = await render(res, meta, k);
  }
  return out;
}

/* ===================== Master prompt (PDF livré au client, un par master prompt) ===================== */

export type PromptDoc = {
  id: string;
  nom: string;
  titre: string;
  intro: string;
  fiche: { t: string; d: string }[];
  texte: string;
  recommandations: { t: string; d: string }[];
};

/** Courier (WinAnsi) : on garde le texte tel quel (titres, tirets, crochets) et on retire seulement ce que la police ne sait pas écrire. */
export function codeSafe(s: unknown): string {
  return String(s ?? '')
    .replace(/\r/g, '')
    .replace(/[   ]/g, ' ')
    .replace(/[→⟶➜➔]/g, '->')
    .replace(/[≈≃]/g, '~')
    .replace(/[✓✔☑]/g, '-')
    .replace(/[≥]/g, '>=')
    .replace(/[≤]/g, '<=')
    .replace(/[‐‑‒]/g, '-')
    .replace(/\t/g, '  ')
    .replace(/[^\n -~¡-ÿ‘’“”–—•…€™]/g, '');
}

const PL = {
  fr: { kicker: 'MASTER PROMPT', of: 'sur', for: 'Préparé pour', how: 'Comment l’utiliser', steps: [['Copiez tout en une seule fois', 'Le plus simple : ouvrez le fichier .txt joint à l’e-mail, sélectionnez tout (Ctrl + A, ou Cmd + A sur Mac) puis copiez. C’est exactement le même texte que le bloc noir de ce PDF.'], ['Collez', 'Au début d’une nouvelle conversation ChatGPT, Claude ou Gemini, ou dans les instructions d’un assistant ou d’un projet.'], ['Complétez ce qui est surligné', 'Tout ce qui est entre [crochets] est surligné en jaune : c’est à vous de le remplacer ou de le compléter. Si une réponse sonne faux, dites-le : l’IA relit la section « Identité de marque et voix ».']], fiche: 'Votre marque en un coup d’œil', block: 'Votre master prompt, à copier-coller', blockHint: 'Tout ce qui est dans le bloc noir est destiné à l’IA. Le texte est volontairement long : c’est lui qui fait la différence.', legend: 'surligné en jaune = à remplacer ou à compléter par vous', reco: 'Bonus pour vous', recoHint: 'Un petit bonus que je vous offre : une courte analyse de votre site et de votre LinkedIn, et quelques recommandations.', end: 'Une question, un ajustement à demander ? Répondez simplement à l’e-mail qui accompagne ce document.', page: 'Page' },
  en: { kicker: 'MASTER PROMPT', of: 'of', for: 'Prepared for', how: 'How to use it', steps: [['Copy everything at once', 'Simplest way: open the .txt file attached to the email, select all (Ctrl + A, or Cmd + A on Mac) then copy. It is exactly the same text as the black block in this PDF.'], ['Paste', 'At the start of a new ChatGPT, Claude or Gemini conversation, or in the instructions of an assistant or project.'], ['Fill in what is highlighted', 'Anything in [brackets] is highlighted in yellow: it is for you to replace or complete. If an answer sounds off, say so: the AI rereads the “Brand identity and voice” section.']], fiche: 'Your brand at a glance', block: 'Your master prompt, ready to copy and paste', blockHint: 'Everything in the black block is addressed to the AI. The text is deliberately long: that is what makes the difference.', legend: 'highlighted in yellow = for you to replace or complete', reco: 'A bonus for you', recoHint: 'A small bonus I am offering you: a short analysis of your website and your LinkedIn, and a few recommendations.', end: 'A question, an adjustment to ask for? Simply reply to the email that came with this document.', page: 'Page' },
};

export async function renderPromptPdf(d: PromptDoc, meta: PdfMeta & { index: number; total: number }): Promise<{ buf: Buffer; pages: number }> {
  const t = PL[meta.lang];
  const doc = new PDFDocument({ size: 'A4', margin: PAGE.m, bufferPages: true, info: { Title: `${clean(d.titre)}`, Author: 'Binta Kande' } });
  const chunks: Buffer[] = [];
  doc.on('data', (c: Buffer) => chunks.push(c));
  const W = PAGE.w - PAGE.m * 2;
  const bottom = PAGE.h - 56;
  const marine = '#1f1d3f';
  const HL = '#ffe066'; // surlignage jaune des [crochets]
  const paper = () => doc.rect(0, 0, PAGE.w, PAGE.h).fill('#fbf8f1');
  paper();
  let y = PAGE.m;
  const newPage = () => { doc.addPage(); paper(); y = PAGE.m; };
  const ensure = (h: number) => { if (y + h > bottom) newPage(); };
  const hOf = (s: string, size: number, font: string, w = W, gap = 2) => { doc.font(font).fontSize(size); return doc.heightOfString(s, { width: w, lineGap: gap }); };
  const para = (s: string, size: number, color: string, font = 'Helvetica', after = 8, x = PAGE.m, w = W) => {
    const h = hOf(s, size, font, w);
    ensure(h);
    doc.font(font).fontSize(size).fillColor(color).text(s, x, y, { width: w, lineGap: 2 });
    y += h + after;
  };
  const heading = (s: string, size = 17) => { ensure(size + 30); para(clean(s), size, C.deep, 'Helvetica-Bold', 6); };

  /* ----- couverture ----- */
  doc.rect(0, 0, PAGE.w, 250).fill(C.deep);
  const logo = logoPath();
  if (logo) { try { doc.image(logo, PAGE.m, 34, { width: 120 }); } catch { /* logo facultatif */ } }
  doc.font('Helvetica-Bold').fontSize(9).fillColor(C.lilasStrong).text(`${t.kicker} ${meta.index} ${t.of} ${meta.total}  ·  ${clean(d.nom).toUpperCase()}`, PAGE.m, 96, { width: W, characterSpacing: 2 });
  doc.font('Helvetica-Bold').fontSize(27).fillColor('#fbf7ee').text(clean(d.titre), PAGE.m, 120, { width: W, lineGap: 3 });
  doc.font('Helvetica').fontSize(10.5).fillColor(C.lilasStrong).text(`${t.for} ${clean(meta.name) || ''}  ·  ${meta.date.toLocaleDateString(meta.lang === 'fr' ? 'fr-FR' : 'en-GB')}`, PAGE.m, 214, { width: W });
  y = 280;
  para(clean(d.intro), 12, C.text, 'Helvetica', 20);

  heading(t.how);
  t.steps.forEach(([title, body], i) => {
    const h = Math.max(hOf(body, 10, 'Helvetica', W - 64), 16) + 24;
    ensure(h + 8);
    doc.roundedRect(PAGE.m, y, W, h, 10).fill(C.lilas);
    doc.circle(PAGE.m + 24, y + h / 2, 12).fill(C.violet);
    doc.font('Helvetica-Bold').fontSize(11).fillColor('#fff').text(String(i + 1), PAGE.m + 12, y + h / 2 - 6, { width: 24, align: 'center', lineBreak: false });
    doc.font('Helvetica-Bold').fontSize(11).fillColor(C.deep).text(title, PAGE.m + 48, y + 8, { width: W - 64, lineBreak: false });
    doc.font('Helvetica').fontSize(10).fillColor(C.text).text(body, PAGE.m + 48, y + 22, { width: W - 64, lineGap: 2 });
    y += h + 8;
  });

  /* ----- fiche de marque ----- */
  if (d.fiche.length) {
    y += 14;
    heading(t.fiche);
    for (const f of d.fiche) {
      const body = clean(f.d);
      const h = hOf(body, 10, 'Helvetica', W - 28) + 40;
      ensure(h + 6);
      doc.roundedRect(PAGE.m, y, W, h, 10).fill(C.card);
      doc.roundedRect(PAGE.m, y, 4, h, 2).fill(C.violet);
      doc.font('Helvetica-Bold').fontSize(10.5).fillColor(C.deep).text(clean(f.t), PAGE.m + 16, y + 10, { width: W - 28, lineBreak: false });
      doc.font('Helvetica').fontSize(10).fillColor(C.text).text(body, PAGE.m + 16, y + 28, { width: W - 28, lineGap: 2 });
      y += h + 6;
    }
  }

  /* ----- le master prompt : bloc de code sur plusieurs pages ----- */
  if (bottom - y < 230) newPage();
  else y += 22;
  heading(t.block, 18);
  para(t.blockHint, 10, C.muted, 'Helvetica-Oblique', 12);
  // légende du surlignage
  ensure(30);
  doc.font('Courier').fontSize(9);
  const lg = '[CROCHETS]';
  const lgw = doc.widthOfString(lg) + 8;
  doc.roundedRect(PAGE.m, y - 2, lgw, 15, 3).fill(HL);
  doc.font('Courier').fontSize(9).fillColor(marine).text(lg, PAGE.m + 4, y + 1, { lineBreak: false });
  doc.font('Helvetica').fontSize(9.5).fillColor(C.muted).text(t.legend, PAGE.m + lgw + 8, y + 1, { lineBreak: false });
  y += 26;

  // texte à chasse fixe : on coupe nous-mêmes les lignes pour pouvoir surligner les [crochets]
  const SIZE = 8.4, LH = 11.6, PAD = 14, innerW = W - PAD * 2;
  const CW = SIZE * 0.6;
  const cols = Math.floor(innerW / CW);
  const isHead = (l: string) => /^#{1,4}\s/.test(l) || /^[A-ZÀ-Ý0-9][A-ZÀ-Ý0-9 '’\-:\/().,&]{7,}$/.test(l.trim());
  const wrap = (line: string): string[] => {
    if (line.length <= cols) return [line];
    const indent = (line.match(/^\s*(?:[-•*]\s+|\d+[.)]\s+)?/) ?? [''])[0].length;
    const lead = line.slice(0, indent);
    const out: string[] = [];
    let cur = lead;
    let first = true;
    for (const w of line.slice(indent).split(' ')) {
      const sep = first ? '' : ' ';
      if (!first && (cur + sep + w).length > cols) { out.push(cur); cur = ' '.repeat(indent) + w; }
      else cur += sep + w;
      first = false;
      while (cur.length > cols) { out.push(cur.slice(0, cols)); cur = ' '.repeat(indent) + cur.slice(cols); }
    }
    out.push(cur);
    return out;
  };
  type Ln = { s: string; head: boolean; open: boolean; gap: number };
  const rows: Ln[] = [];
  let open = false; // un [crochet] peut commencer sur une ligne et finir sur la suivante
  for (const raw of codeSafe(d.texte).split('\n')) {
    const head = isHead(raw);
    const parts = raw.trim() === '' ? [''] : wrap(raw.replace(/\s+$/, ''));
    parts.forEach((p, k) => {
      rows.push({ s: p, head, open, gap: p === '' ? -LH * 0.35 : head && k === 0 ? 3 : 0 });
      for (const ch of p) { if (ch === '[') open = true; else if (ch === ']') open = false; }
    });
  }
  const hOfRow = (r: Ln) => LH + r.gap;
  let i = 0;
  while (i < rows.length) {
    if (bottom - y < 80) newPage();
    const start = y;
    const page: Ln[] = [];
    let acc = PAD;
    while (i < rows.length && start + acc + hOfRow(rows[i]) + PAD <= bottom) { acc += hOfRow(rows[i]); page.push(rows[i]); i++; }
    if (!page.length) { page.push(rows[i]); acc += hOfRow(rows[i]); i++; }
    const boxH = acc + PAD;
    doc.roundedRect(PAGE.m, start, W, boxH, 10).fill(marine);
    let ty = start + PAD;
    for (const ln of page) {
      const yy = ty + (ln.head ? ln.gap : 0);
      // 1) surlignage jaune derrière les [crochets], 2) texte par-dessus (le surlignage ne passe jamais sur le texte)
      let inBr = ln.open;
      let runStart = inBr ? 0 : -1;
      const marks: [number, number][] = [];
      for (let k = 0; k < ln.s.length; k++) {
        const ch = ln.s[k];
        if (ch === '[' && !inBr) { inBr = true; runStart = k; }
        else if (ch === ']' && inBr) { marks.push([runStart, k + 1]); inBr = false; runStart = -1; }
      }
      if (inBr && runStart >= 0) marks.push([runStart, ln.s.length]);
      for (const [a, b] of marks) doc.roundedRect(PAGE.m + PAD + a * CW - 1, yy - 1, (b - a) * CW + 2, LH - 1, 2).fill(HL);
      if (ln.s !== '') {
        doc.font(ln.head ? 'Courier-Bold' : 'Courier').fontSize(SIZE);
        let col = 0;
        const hl = new Array(ln.s.length).fill(false);
        for (const [a, b] of marks) for (let k = a; k < b; k++) hl[k] = true;
        // segments de même couleur, posés à leur colonne exacte
        while (col < ln.s.length) {
          let e = col;
          while (e < ln.s.length && hl[e] === hl[col]) e++;
          doc.fillColor(hl[col] ? marine : ln.head ? C.lilasStrong : '#f6f0e4').text(ln.s.slice(col, e), PAGE.m + PAD + col * CW, yy, { lineBreak: false });
          col = e;
        }
      }
      ty += hOfRow(ln);
    }
    y = start + boxH + 10;
    if (i < rows.length) newPage();
  }

  /* ----- recommandations ----- */
  if (d.recommandations.length) {
    newPage();
    heading(t.reco, 18);
    para(t.recoHint, 10, C.muted, 'Helvetica-Oblique', 12);
    for (const r of d.recommandations) {
      const body = clean(r.d);
      const h = hOf(body, 10, 'Helvetica', W - 28) + 40;
      ensure(h + 6);
      doc.roundedRect(PAGE.m, y, W, h, 10).fill(C.warm);
      doc.roundedRect(PAGE.m, y, 4, h, 2).fill(C.cannelle);
      doc.font('Helvetica-Bold').fontSize(10.5).fillColor(C.cannelle).text(clean(r.t), PAGE.m + 16, y + 10, { width: W - 28, lineBreak: false });
      doc.font('Helvetica').fontSize(10).fillColor(C.text).text(body, PAGE.m + 16, y + 28, { width: W - 28, lineGap: 2 });
      y += h + 6;
    }
  }
  y += 12;
  para(t.end, 10, C.muted, 'Helvetica-Oblique', 0);

  /* ----- pieds de page ----- */
  const range = doc.bufferedPageRange();
  for (let p = 0; p < range.count; p++) {
    doc.switchToPage(p);
    doc.page.margins.bottom = 0;
    doc.moveTo(PAGE.m, PAGE.h - 38).lineTo(PAGE.w - PAGE.m, PAGE.h - 38).lineWidth(0.7).stroke(C.line);
    doc.font('Helvetica').fontSize(8).fillColor(C.muted).text('Binta Kande  ·  bintakande.com', PAGE.m, PAGE.h - 30, { width: W / 1.4, lineBreak: false });
    doc.font('Helvetica').fontSize(8).fillColor(C.muted).text(`${t.page} ${p + 1} ${t.of} ${range.count}`, PAGE.w - PAGE.m - 100, PAGE.h - 30, { width: 100, align: 'right', lineBreak: false });
  }
  return new Promise((resolve) => {
    doc.on('end', () => resolve({ buf: Buffer.concat(chunks), pages: range.count }));
    doc.end();
  });
}
