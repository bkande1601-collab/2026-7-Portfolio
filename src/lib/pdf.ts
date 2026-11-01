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
  freins: { titre: string; constat: string; cause: string; impact: string }[];
  pistes: { titre: string; probleme: string; solution: string; effet: string; effort: string; premier_pas: string; delai?: string }[];
  outils: { besoin: string; outil: string; pourquoi: string; cout: string }[];
  plan: { periode: string; actions: string[] }[];
  indicateurs: { indicateur: string; cible: string }[];
  a_eviter: string[];
  questions?: string[];
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
    .replace(/[≥]/g, '>=')
    .replace(/[≤]/g, '<=')
    .replace(/[‐‑‒]/g, '-')
    .replace(/[^ -~¡-ÿ‘’“”–—•…€™\n]/g, '')
    .trim();
}

const L = {
  fr: { title: 'Diagnostic de votre business', for: 'Préparé pour', brief: 'En bref', score: 'Score de maturité', forces: 'Vos points forts', freins: 'Ce qui vous freine', pistes: 'Vos 3 priorités', problem: 'Le problème', solution: 'La solution', effect: 'L’effet attendu', first: 'Votre premier pas', effort: 'Effort', tools: 'Les outils recommandés', need: 'Besoin', tool: 'Outil', why: 'Pourquoi', cost: 'Coût', plan: 'Votre plan d’action sur 30 jours', kpi: 'Les chiffres à suivre', target: 'Cible', avoid: 'À éviter', clarify: 'Points à clarifier', next: 'Et maintenant ?', nextText: 'Choisissez l’action de la semaine 1 et faites-la aujourd’hui. Si vous voulez que je la mette en place avec vous, répondez simplement à l’e-mail qui accompagne ce document ou écrivez à hello@bintakande.com.', est: 'Les chiffres donnés sont des estimations, à confirmer sur votre terrain.', page: 'Page', of: 'sur', cause: 'Cause', impact: 'Conséquence', diag: 'Conséquence' },
  en: { title: 'Your business diagnostic', for: 'Prepared for', brief: 'In brief', score: 'Maturity score', forces: 'Your strengths', freins: 'What is holding you back', pistes: 'Your 3 priorities', problem: 'The problem', solution: 'The solution', effect: 'Expected effect', first: 'Your first step', effort: 'Effort', tools: 'Recommended tools', need: 'Need', tool: 'Tool', why: 'Why', cost: 'Cost', plan: 'Your 30-day action plan', kpi: 'Numbers to track', target: 'Target', avoid: 'Pitfalls to avoid', clarify: 'Points to clarify', next: 'What now?', nextText: 'Pick the week-1 action and do it today. If you would like me to implement it with you, just reply to the email that came with this document or write to hello@bintakande.com.', est: 'Figures given are estimates, to be confirmed in your own context.', page: 'Page', of: 'of', cause: 'Cause', impact: 'Consequence', diag: 'Consequence' },
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
  const heading = (label: string) => {
    ensure(46);
    doc.rect(PAGE.m, y + 3, 5, fs(17)).fill(C.violet);
    text(label, PAGE.m + 14, y, W - 14, 16, C.deep, 'b');
    y += fs(16) + 12;
  };
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

  /* ----- freins ----- */
  heading(t.freins);
  res.freins?.forEach((f, i) => {
    const w = W - 36;
    const hh = h(f.titre, 11, w - 18, 'b') + h(f.constat, 9.5, w - 18, 'r', 2) + h(`${t.cause} : ${f.cause}`, 9.5, w - 18, 'r', 2) + h(`${t.impact} : ${f.impact}`, 9.5, w - 18, 'r', 2) + 36;
    ensure(hh);
    doc.roundedRect(PAGE.m, y, W, hh, 12).fill(C.warm);
    doc.rect(PAGE.m, y + 14, 4, hh - 28).fill(C.cannelle);
    text(`${i + 1}. ${f.titre}`, PAGE.m + 18, y + 12, w - 18, 11, C.cannelle, 'b');
    let yy = y + 14 + h(f.titre, 11, w - 18, 'b');
    text(f.constat, PAGE.m + 18, yy, w - 18, 9.5, C.text, 'r', 2);
    yy += h(f.constat, 9.5, w - 18, 'r', 2) + 2;
    text(`${t.cause} : ${f.cause}`, PAGE.m + 18, yy, w - 18, 9.5, C.muted, 'i', 2);
    yy += h(`${t.cause} : ${f.cause}`, 9.5, w - 18, 'i', 2) + 2;
    text(`${t.impact} : ${f.impact}`, PAGE.m + 18, yy, w - 18, 9.5, C.muted, 'i', 2);
    y += hh + 8;
  });
  y += 4;

  /* ----- pistes ----- */
  heading(t.pistes);
  res.pistes?.forEach((p, i) => {
    const w = W - 62;
    const rows: [string, string][] = [[t.problem, p.probleme], [t.solution, p.solution], [t.effect, p.effet]];
    const body = rows.reduce((n, [lbl, v]) => n + h(`${lbl} : ${v}`, 9.5, w, 'r', 2) + 4, 0);
    const first = h(p.premier_pas, 9.5, w - 16, 'b', 2);
    const hh = h(p.titre, 12, w - 90, 'b') + body + first + 56;
    ensure(hh);
    doc.roundedRect(PAGE.m, y, W, hh, 12).lineWidth(1).fillAndStroke(C.card, C.line);
    doc.circle(PAGE.m + 24, y + 26, 14).fill(C.violet);
    text(String(i + 1), PAGE.m + 10, y + 19, 28, 14, '#fbf7ee', 'b', 0, { align: 'center' });
    text(p.titre, PAGE.m + 50, y + 14, w - 90, 12, C.deep, 'b');
    tag(`${t.effort} : ${p.effort}${p.delai ? ` · ${p.delai}` : ''}`.slice(0, 40), PAGE.m + W - 150, y + 14, C.lilas, C.violet);
    let yy = y + 16 + h(p.titre, 12, w - 90, 'b') + 6;
    for (const [lbl, v] of rows) {
      font('b').fontSize(fs(9.5)).fillColor(C.violet).text(`${clean(lbl)} : `, PAGE.m + 50, yy, { width: w, continued: true, lineGap: 2 });
      font('r').fillColor(C.text).text(clean(v), { lineGap: 2 });
      yy += h(`${lbl} : ${v}`, 9.5, w, 'r', 2) + 4;
    }
    doc.roundedRect(PAGE.m + 50, yy + 2, w, first + 14, 8).fill(C.okBg);
    text(`${t.first} : ${p.premier_pas}`, PAGE.m + 58, yy + 8, w - 16, 9.5, '#1c4a30', 'b', 2);
    y += hh + 8;
  });
  y += 4;

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
    const hs = row.map((p) => h(p.periode, 10.5, cw - 24, 'b') + p.actions.reduce((n, a) => n + h(a, 9.5, cw - 42, 'r', 2) + 5, 0) + 28);
    const rh = Math.max(...hs);
    ensure(rh);
    row.forEach((p, c) => {
      const x = PAGE.m + c * (cw + 12);
      doc.roundedRect(x, y, cw, rh, 12).fill(C.lilas);
      doc.roundedRect(x, y, cw, 26, 12).fill(C.violet);
      doc.rect(x, y + 14, cw, 12).fill(C.violet);
      text(p.periode, x + 12, y + 8, cw - 24, 10.5, '#fbf7ee', 'b');
      let yy = y + 36;
      for (const a of p.actions) {
        doc.roundedRect(x + 12, yy + 1, 9, 9, 2).lineWidth(1.2).stroke(C.violet);
        text(a, x + 28, yy, cw - 42, 9.5, C.text, 'r', 2);
        yy += h(a, 9.5, cw - 42, 'r', 2) + 5;
      }
    });
    y += rh + 12;
  }

  /* ----- indicateurs ----- */
  if (res.indicateurs?.length) {
    heading(t.kpi);
    const cw = [W * 0.6, W * 0.4];
    res.indicateurs.forEach((it, ri) => {
      const rh = Math.max(h(it.indicateur, 9.5, cw[0] - 14, 'r', 1.5), h(it.cible, 9.5, cw[1] - 14, 'b', 1.5)) + 12;
      ensure(rh);
      if (ri % 2 === 0) doc.rect(PAGE.m, y, W, rh).fill(C.card);
      text(it.indicateur, PAGE.m + 8, y + 6, cw[0] - 14, 9.5, C.text, 'r', 1.5);
      text(it.cible, PAGE.m + cw[0] + 8, y + 6, cw[1] - 14, 9.5, C.violet, 'b', 1.5);
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

  /* ----- conclusion ----- */
  const nh = h(t.nextText, 10, W - 48, 'r', 3) + 56;
  ensure(nh);
  doc.roundedRect(PAGE.m, y, W, nh, 14).fill(C.deep);
  text(t.next, PAGE.m + 24, y + 16, W - 48, 15, '#fbf7ee', 'b');
  text(t.nextText, PAGE.m + 24, y + 40, W - 48, 10, C.lilasStrong, 'r', 3);
  y += nh + 8;
  text(t.est, PAGE.m, y, W, 8, C.muted, 'i');

  /* ----- pieds de page ----- */
  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(i);
    doc.page.margins.bottom = 0;
    doc.moveTo(PAGE.m, PAGE.h - 38).lineTo(PAGE.w - PAGE.m, PAGE.h - 38).lineWidth(0.7).stroke(C.line);
    font('r').fontSize(8).fillColor(C.muted).text('Binta Kande  ·  bintakande.com  ·  hello@bintakande.com', PAGE.m, PAGE.h - 30, { width: W / 1.4, lineBreak: false });
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
  for (const k of [0.93, 0.87, 0.82, 0.77]) {
    if (out.pages <= 5) break;
    out = await render(res, meta, k);
  }
  return out;
}
