/* Tableau de bord (client). Les données arrivent déjà chargées dans #boot ; les détails se chargent à la demande. */
(() => {
  const boot = JSON.parse(document.getElementById('boot').textContent);
  const TZ = 'Europe/Paris';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const NAMES = { diagnostic: 'Diagnostic', prompt: 'Master prompt' };
  const STATUS = { pending: ['En attente', 'gray'], paid: ['Payé', 'ok'], failed: ['Échoué', 'bad'], expired: ['Abandonné', 'gray'], refunded: ['Remboursé', 'bad'], disputed: ['Litige', 'bad'] };
  const nf = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
  const eur = (c) => nf.format((c || 0) / 100);
  const dfmt = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeZone: TZ });
  const dtfmt = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short', timeZone: TZ });
  const tfmt = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: TZ });
  const pfmt = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23', weekday: 'short' });
  const parts = (ts) => { const o = {}; pfmt.formatToParts(new Date(ts)).forEach((p) => { o[p.type] = p.value; }); return { y: +o.year, m: +o.month, d: +o.day, h: +o.hour % 24, dow: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(o.weekday) }; };
  const ago = (ts) => { const s = Math.max(0, (Date.now() - ts) / 1000); if (s < 90) return 'à l’instant'; if (s < 3600) return `il y a ${Math.round(s / 60)} min`; if (s < 86400) return `il y a ${Math.round(s / 3600)} h`; return `il y a ${Math.round(s / 86400)} j`; };
  const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  const DAYS = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'];
  const DAY = 86400000;

  const orders = (boot.orders || []).map((o) => ({
    ...o,
    amount: +o.amount, refunded: +o.refunded,
    createdT: new Date(o.created_at).getTime(),
    paidT: o.paid_at ? new Date(o.paid_at).getTime() : null,
    submittedT: o.submitted_at ? new Date(o.submitted_at).getTime() : null,
    doneT: o.agent_done_at ? new Date(o.agent_done_at).getTime() : null,
    agentT: o.agent_at ? new Date(o.agent_at).getTime() : null,
    sentT: o.client_sent_at ? new Date(o.client_sent_at).getTime() : null,
  }));
  const byId = new Map(orders.map((o) => [o.id, o]));
  const isPaid = (o) => o.paidT != null && o.status !== 'failed' && o.status !== 'expired';
  const net = (o) => (isPaid(o) && (o.currency || 'eur') === 'eur' ? o.amount - o.refunded : 0);
  const shippable = (o) => isPaid(o) && (o.product === 'diagnostic' || o.product === 'prompt');

  function delivery(o) {
    if (!shippable(o)) return null;
    if (!o.has_answers) return { key: 'todo', label: 'Questionnaire à remplir', tone: 'gray' };
    if (o.sentT) return { key: 'sent', label: 'Envoyé au client', tone: 'ok' };
    if (o.agent_status === 'done') return { key: 'review', label: o.product === 'diagnostic' ? 'À relire et envoyer' : 'Résultat prêt', tone: '' };
    if ((o.agent_status || '').startsWith('failed')) return { key: 'run', label: 'Échec : à relancer', tone: 'bad' };
    return { key: 'run', label: 'Agent en cours', tone: 'warn' };
  }

  /* ---------- état ---------- */
  const state = { cview: 'overview', view: 'overview', period: 30, q: '', status: 'all', product: 'all', sort: 'date', dir: -1, page: 1, cq: '' };
  const range = () => {
    const now = Date.now();
    if (!state.period) return { from: 0, to: now, pf: null, pt: null };
    return { from: now - state.period * DAY, to: now, pf: now - 2 * state.period * DAY, pt: now - state.period * DAY };
  };
  const inR = (t, a, b) => t != null && t >= a && t <= b;

  /* ---------- petits composants ---------- */
  const tag = (label, tone = '') => `<span class="tag ${tone}">${esc(label)}</span>`;
  const delta = (cur, prev, fmt = (v) => v) => {
    if (prev == null) return '<span class="delta">—</span>';
    if (!prev && !cur) return '<span class="delta">=</span>';
    if (!prev) return '<span class="delta up">nouveau</span>';
    const p = Math.round(((cur - prev) / prev) * 100);
    return `<span class="delta ${p > 0 ? 'up' : p < 0 ? 'down' : ''}">${p > 0 ? '▲' : p < 0 ? '▼' : '='} ${Math.abs(p)} %</span>`;
  };
  const spark = (vals) => {
    if (vals.length < 2) return '<svg class="spark"></svg>';
    const max = Math.max(...vals, 1), W = 90, H = 30;
    const pts = vals.map((v, i) => [(i / (vals.length - 1)) * W, H - 3 - (v / max) * (H - 8)]);
    const l = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('');
    return `<svg class="spark" viewBox="0 0 ${W} ${H}" aria-hidden="true"><path class="a" d="${l}L${W},${H}L0,${H}Z"/><path class="l" d="${l}"/></svg>`;
  };
  const kpi = (label, value, d, sp = '') => `<div class="card kpi"><span class="lbl">${esc(label)}</span><span class="val">${value}</span><div class="row">${d}${sp}</div></div>`;

  function bars(items, { fmt = (v) => v, every = 1, labelAll = false } = {}) {
    if (!items.length || items.every((i) => !i.value)) return '<div class="empty">Pas encore de données sur cette période.</div>';
    const W = 640, H = 210, pb = 28, pt = 24, pl = 6;
    const max = Math.max(...items.map((i) => i.value), 1);
    const slot = (W - pl * 2) / items.length;
    const bw = Math.max(3, Math.min(44, slot * 0.7));
    const top = Math.max(...items.map((i) => i.value));
    const out = items.map((it, i) => {
      const h = (it.value / max) * (H - pb - pt);
      const x = pl + i * slot + (slot - bw) / 2, y = H - pb - h;
      const hot = it.value === top && top > 0 && items.findIndex((z) => z.value === top) === i;
      return `<g><title>${esc(it.tip || it.label)}</title><rect class="b${hot ? ' hot' : ''}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(h, it.value ? 2 : 0).toFixed(1)}" rx="${Math.min(5, bw / 3).toFixed(1)}"/>${(hot || (labelAll && it.value)) ? `<text class="v" x="${(x + bw / 2).toFixed(1)}" y="${(y - 6).toFixed(1)}" text-anchor="middle">${esc(fmt(it.value))}</text>` : ''}${i % every === 0 ? `<text x="${(x + bw / 2).toFixed(1)}" y="${H - 9}" text-anchor="middle">${esc(it.label)}</text>` : ''}</g>`;
    }).join('');
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img"><line x1="${pl}" x2="${W - pl}" y1="${H - pb}" y2="${H - pb}"/>${out}</svg>`;
  }

  /* ---------- séries ---------- */
  function series(from, to) {
    const paid = orders.filter((o) => isPaid(o) && inR(o.paidT, from, to));
    const days = state.period && state.period <= 90;
    const map = new Map();
    const key = (t) => { const p = parts(t); return days ? `${p.y}-${p.m}-${p.d}` : `${p.y}-${p.m}`; };
    paid.forEach((o) => { const k = key(o.paidT); const v = map.get(k) || { n: 0, rev: 0 }; v.n += 1; v.rev += net(o); map.set(k, v); });
    const out = [];
    if (days) {
      for (let t = to - state.period * DAY + DAY; t <= to + 1; t += DAY) { const p = parts(t); const v = map.get(`${p.y}-${p.m}-${p.d}`) || { n: 0, rev: 0 }; out.push({ label: `${p.d}/${p.m}`, n: v.n, rev: v.rev }); }
    } else {
      const start = state.period ? from : (paid.length ? Math.min(...paid.map((o) => o.paidT)) : to);
      const a = parts(start), b = parts(to);
      for (let y = a.y, m = a.m; y < b.y || (y === b.y && m <= b.m); m++) { if (m > 12) { m = 1; y++; } const v = map.get(`${y}-${m}`) || { n: 0, rev: 0 }; out.push({ label: `${MONTHS[m - 1]} ${String(y).slice(2)}`, n: v.n, rev: v.rev }); if (out.length > 60) break; }
    }
    return out;
  }

  /* ---------- vue d'ensemble ---------- */
  function renderOverview() {
    const { from, to, pf, pt } = range();
    const cur = orders.filter((o) => isPaid(o) && inR(o.paidT, from, to));
    const prev = pf == null ? null : orders.filter((o) => isPaid(o) && inR(o.paidT, pf, pt));
    const rev = cur.reduce((n, o) => n + net(o), 0), prevRev = prev ? prev.reduce((n, o) => n + net(o), 0) : null;
    const basket = cur.length ? Math.round(rev / cur.length) : 0, prevBasket = prev && prev.length ? Math.round(prevRev / prev.length) : null;
    const started = orders.filter((o) => inR(o.createdT, from, to)), prevStarted = pf == null ? null : orders.filter((o) => inR(o.createdT, pf, pt));
    const conv = started.length ? Math.round((started.filter(isPaid).length / started.length) * 100) : 0;
    const prevConv = prevStarted && prevStarted.length ? Math.round((prevStarted.filter(isPaid).length / prevStarted.length) * 100) : null;
    const refunded = orders.filter((o) => inR(o.paidT, from, to)).reduce((n, o) => n + (o.refunded || 0), 0);
    const answered = cur.filter((o) => o.has_answers).length;
    const sent = cur.filter((o) => o.sentT).length;
    const todo = alerts().length;
    const sr = series(from, to);
    const sp = (k) => spark(sr.map((x) => x[k]));

    const hour = Array.from({ length: 24 }, (_, h) => ({ label: `${h}h`, value: 0, tip: '' }));
    const dow = DAYS.map((d) => ({ label: d, value: 0, tip: '' }));
    cur.forEach((o) => { const p = parts(o.paidT); hour[p.h].value++; dow[p.dow].value++; });
    hour.forEach((x) => { x.tip = `${x.label} : ${x.value} commande${x.value > 1 ? 's' : ''}`; });
    dow.forEach((x) => { x.tip = `${x.label} : ${x.value} commande${x.value > 1 ? 's' : ''}`; });
    const bestM = sr.reduce((a, x) => (x.rev > (a?.rev || 0) ? x : a), null);
    const bestH = hour.reduce((a, x) => (x.value > (a?.value || 0) ? x : a), null);
    const bestD = dow.reduce((a, x) => (x.value > (a?.value || 0) ? x : a), null);
    const FULL = { 'lun.': 'lundi', 'mar.': 'mardi', 'mer.': 'mercredi', 'jeu.': 'jeudi', 'ven.': 'vendredi', 'sam.': 'samedi', 'dim.': 'dimanche' };

    const prod = ['diagnostic', 'prompt'].map((k) => { const l = cur.filter((o) => o.product === k); return { k, n: l.length, rev: l.reduce((n, o) => n + net(o), 0) }; });
    const steps = [
      ['Commandes lancées', started.length],
      ['Payées', started.filter(isPaid).length],
      ['Questionnaire rempli', started.filter((o) => isPaid(o) && o.has_answers).length],
      ['Résultat prêt', started.filter((o) => isPaid(o) && (o.has_result || o.agent_status === 'done')).length],
      ['Envoyé au client', started.filter((o) => o.sentT).length],
    ];
    const f0 = Math.max(steps[0][1], 1);
    const al = alerts();

    $('#view-overview').innerHTML = `
      <div class="grid g4">
        ${kpi('Chiffre d’affaires net', eur(rev), delta(rev, prevRev), sp('rev'))}
        ${kpi('Commandes payées', cur.length, delta(cur.length, prev ? prev.length : null), sp('n'))}
        ${kpi('Panier moyen', eur(basket), delta(basket, prevBasket))}
        ${kpi('Taux de paiement', `${conv} %`, delta(conv, prevConv), '')}
      </div>
      <div class="grid g4" style="margin-top:16px">
        ${kpi('Questionnaires remplis', `${answered}<small class="muted" style="font-size:.9rem;font-weight:600"> / ${cur.length}</small>`, '<span class="delta">sur les payées</span>')}
        ${kpi('Envoyés au client', sent, '<span class="delta">PDF livrés</span>')}
        ${kpi('Remboursé', eur(refunded), '<span class="delta">période</span>')}
        ${kpi('À traiter', todo, `<span class="delta ${todo ? 'down' : 'up'}">${todo ? 'voir ci-dessous' : 'tout est à jour'}</span>`)}
      </div>

      <div class="grid g21" style="margin-top:16px">
        <div class="card"><h3>${state.period && state.period <= 90 ? 'Chiffre d’affaires par jour' : 'Chiffre d’affaires par mois'}</h3>
          <p class="sub">${bestM && bestM.rev ? `Meilleur ${state.period && state.period <= 90 ? 'jour' : 'mois'} : <b>${esc(bestM.label)}</b> (${eur(bestM.rev)}).` : 'Aucune vente sur la période.'}</p>
          ${bars(sr.map((x) => ({ label: x.label, value: x.rev, tip: `${x.label} : ${eur(x.rev)} · ${x.n} commande${x.n > 1 ? 's' : ''}` })), { fmt: (v) => eur(v).replace(/,00/, ''), every: Math.ceil(sr.length / 10) })}
        </div>
        <div class="card"><h3>À traiter</h3><p class="sub">Ce qui demande une action de votre part.</p>
          <div class="alerts">${al.length ? al.slice(0, 6).map(alertHtml).join('') : '<div class="alert ok"><i class="dot"></i><div><b>Tout est à jour</b><span>Aucune action en attente.</span></div></div>'}</div>
        </div>
      </div>

      <div class="grid g3" style="margin-top:16px">
        <div class="card"><h3>Entonnoir</h3><p class="sub">De la commande au PDF livré.</p>
          <div class="funnel">${steps.map(([l, n], i) => `<div class="fstep"><div class="top"><span>${l}</span><b>${n}</b></div><div class="fbar"><i style="width:${Math.max(n ? 3 : 0, Math.round((n / f0) * 100))}%"></i></div><span class="pct">${i ? (steps[i - 1][1] ? Math.round((n / steps[i - 1][1]) * 100) + ' % de l’étape précédente' : '—') : 'point de départ'}</span></div>`).join('')}</div>
        </div>
        <div class="card"><h3>Heure de la journée</h3><p class="sub">${bestH && bestH.value ? `Pic à <b>${esc(bestH.label)}</b> (heure de Paris).` : 'Pas encore de vente.'}</p>${bars(hour, { every: 3 })}</div>
        <div class="card"><h3>Jour de la semaine</h3><p class="sub">${bestD && bestD.value ? `Meilleur jour : <b>${FULL[bestD.label]}</b>.` : 'Pas encore de vente.'}</p>${bars(dow, { labelAll: true })}</div>
      </div>

      <div class="grid g2" style="margin-top:16px">
        <div class="card"><h3>Par produit</h3><p class="sub">Sur la période.</p>
          <div class="tscroll"><table class="t"><thead><tr><th>Produit</th><th class="num">Commandes</th><th class="num">CA net</th></tr></thead><tbody>${prod.map((p) => `<tr style="cursor:default"><td>${NAMES[p.k]}</td><td class="num">${p.n}</td><td class="num">${eur(p.rev)}</td></tr>`).join('')}</tbody></table></div>
        </div>
        <div class="card"><h3>Dernières commandes</h3><p class="sub">Cliquez pour ouvrir la fiche.</p>
          <div class="tscroll"><table class="t"><tbody>${orders.slice(0, 5).map((o) => `<tr data-open="${o.id}"><td class="name"><b>${esc(o.name || o.email || '—')}</b><span>${esc(NAMES[o.product] || o.product)} · ${dfmt.format(o.paidT || o.createdT)}</span></td><td class="num nw">${o.amount ? eur(o.amount) : ''}</td><td>${statusTag(o)}</td></tr>`).join('') || '<tr style="cursor:default"><td class="muted">Aucune commande.</td></tr>'}</tbody></table></div>
        </div>
      </div>`;
  }

  function statusTag(o) { const [l, tone] = STATUS[o.status] || [o.status, 'gray']; return tag(l, tone); }

  /* ---------- alertes ---------- */
  function alerts() {
    const out = [];
    const now = Date.now();
    orders.filter(shippable).forEach((o) => {
      const who = o.name || o.email || `commande ${o.id}`;
      if (!o.has_answers && o.paidT && now - o.paidT > DAY) out.push({ id: o.id, tone: 'warn', t: 'Questionnaire non rempli', d: `${who} a payé ${ago(o.paidT)} et n’a pas répondu. Renvoyez-lui le lien.` });
      else if (o.has_answers && (o.agent_status || '').startsWith('failed')) out.push({ id: o.id, tone: 'bad', t: 'L’agent a échoué', d: `${who} : relance automatique en cours, vous pouvez aussi relancer.` });
      else if (o.has_answers && o.agent_status !== 'done' && o.submittedT && now - o.submittedT > 30 * 60000) out.push({ id: o.id, tone: 'warn', t: 'Résultat en retard', d: `${who} : réponses reçues ${ago(o.submittedT)}, pas encore de résultat.` });
      else if (o.product === 'diagnostic' && o.has_result && !o.sentT && o.agent_status === 'done') out.push({ id: o.id, tone: '', t: 'Diagnostic à relire et envoyer', d: `${who} : PDF prêt ${o.doneT ? ago(o.doneT) : ''}.` });
    });
    orders.filter((o) => o.status === 'disputed').forEach((o) => out.push({ id: o.id, tone: 'bad', t: 'Litige Stripe', d: `${o.email || o.id} conteste un paiement.` }));
    return out;
  }
  const alertHtml = (a) => `<button class="alert ${a.tone === 'bad' ? 'bad' : ''}" data-open="${a.id}"><i class="dot"></i><div><b>${esc(a.t)}</b><span>${esc(a.d)}</span></div></button>`;

  /* ---------- commandes ---------- */
  function filtered() {
    const q = state.q.trim().toLowerCase();
    let l = orders.filter((o) => {
      if (state.status === 'paid' && !isPaid(o)) return false;
      if (['pending', 'refunded', 'expired', 'failed', 'disputed'].includes(state.status) && o.status !== state.status) return false;
      if (state.product !== 'all' && o.product !== state.product) return false;
      if (q && !`${o.name || ''} ${o.email || ''} ${o.id} ${NAMES[o.product] || ''}`.toLowerCase().includes(q)) return false;
      return true;
    });
    l = l.slice().sort((a, b) => state.dir * (state.sort === 'amount' ? a.amount - b.amount : (a.paidT || a.createdT) - (b.paidT || b.createdT)));
    return l;
  }
  const searchIcon = '<svg viewBox="0 0 24 24"><path d="M15.5 14h-.8l-.3-.3A6.5 6.5 0 1 0 14 15.5l.3.3v.8l5 5 1.5-1.5-5-5Zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Z"/></svg>';
  function renderOrders() {
    const all = orders;
    const counts = { all: all.length, paid: all.filter(isPaid).length, pending: all.filter((o) => o.status === 'pending').length, refunded: all.filter((o) => o.status === 'refunded').length, expired: all.filter((o) => o.status === 'expired').length };
    const list = filtered();
    const pages = Math.max(1, Math.ceil(list.length / 20));
    state.page = Math.min(state.page, pages);
    const rows = list.slice((state.page - 1) * 20, state.page * 20);
    const chip = (k, l) => `<button class="chip ${state.status === k ? 'on' : ''}" data-status="${k}">${l}<em>${counts[k]}</em></button>`;
    $('#view-orders').innerHTML = `
      <div class="toolbar">
        <div class="search">${searchIcon}<input id="q" type="search" placeholder="Rechercher un nom, un e-mail, un n°…  ( / )" value="${esc(state.q)}" /></div>
        <div class="chips">${chip('all', 'Toutes')}${chip('paid', 'Payées')}${chip('pending', 'En attente')}${chip('refunded', 'Remboursées')}${chip('expired', 'Abandonnées')}</div>
        <select id="prod" aria-label="Produit"><option value="all">Tous les produits</option><option value="diagnostic" ${state.product === 'diagnostic' ? 'selected' : ''}>Diagnostic</option><option value="prompt" ${state.product === 'prompt' ? 'selected' : ''}>Master prompt</option></select>
        <span class="spacer"></span>
        <button class="btn" id="csv">Exporter (CSV)</button>
      </div>
      <div class="tablewrap"><div class="tscroll"><table class="t">
        <thead><tr><th class="s" data-sort="date">Date ${state.sort === 'date' ? (state.dir < 0 ? '↓' : '↑') : ''}</th><th>Client</th><th>Produit</th><th class="s num" data-sort="amount">Montant ${state.sort === 'amount' ? (state.dir < 0 ? '↓' : '↑') : ''}</th><th>Statut</th><th>Livraison</th></tr></thead>
        <tbody>${rows.map((o) => { const d = delivery(o); return `<tr data-open="${o.id}"><td class="nw">${dtfmt.format(o.paidT || o.createdT)}</td><td class="name"><b>${esc(o.name || '—')}</b><span>${esc(o.email || '')}</span></td><td class="nw">${esc(NAMES[o.product] || o.product)}</td><td class="num nw">${o.amount ? eur(o.amount) : ''}${o.refunded ? `<br><span class="muted">−${eur(o.refunded)}</span>` : ''}</td><td>${statusTag(o)}</td><td>${d ? tag(d.label, d.tone) : '<span class="muted">—</span>'}</td></tr>`; }).join('') || '<tr style="cursor:default"><td colspan="6" class="empty">Aucune commande ne correspond.</td></tr>'}</tbody>
      </table></div>
      <div class="pager"><span>${list.length} résultat${list.length > 1 ? 's' : ''}</span><span><button class="btn sm" data-page="-1" ${state.page <= 1 ? 'disabled' : ''}>Précédent</button> &nbsp;Page ${state.page} / ${pages}&nbsp; <button class="btn sm" data-page="1" ${state.page >= pages ? 'disabled' : ''}>Suivant</button></span></div></div>`;
    const q = $('#q'); if (state.focusQ) { q.focus(); q.setSelectionRange(q.value.length, q.value.length); state.focusQ = false; }
  }

  /* ---------- livraisons ---------- */
  function renderDelivery() {
    const cols = [['todo', 'Questionnaire à remplir'], ['run', 'Agent en cours'], ['review', 'À relire et envoyer'], ['sent', 'Envoyés']];
    const items = orders.filter(shippable).map((o) => ({ o, d: delivery(o) }));
    $('#view-delivery').innerHTML = `<div class="board">${cols.map(([k, l]) => { const l2 = items.filter((x) => x.d.key === k); return `<div class="col"><h3><span>${l}</span><span>${l2.length}</span></h3><div class="stack">${l2.map(({ o, d }) => `<button class="tile" data-open="${o.id}"><b>${esc(o.name || o.email || '—')}</b><span>${esc(NAMES[o.product])} · ${ago(o.sentT || o.doneT || o.submittedT || o.paidT)}</span>${d.tone === 'bad' ? tag(d.label, 'bad') : ''}</button>`).join('') || '<div class="empty" style="padding:14px">Rien ici.</div>'}</div></div>`; }).join('')}</div>`;
  }

  /* ---------- clients ---------- */
  const splitName = (n) => { const t = String(n || '').trim().split(/\s+/); return { first: t[0] || '', last: t.slice(1).join(' ') }; };
  const link = (u) => { const v = String(u || '').trim(); if (!v) return '<span class="muted">—</span>'; const h = /^https?:\/\//i.test(v) ? v : `https://${v}`; return `<a href="${esc(h)}" target="_blank" rel="noopener noreferrer">${esc(v.replace(/^https?:\/\/(www\.)?/i, '').slice(0, 42))}</a>`; };
  let clientsData = null;
  async function loadClients() {
    if (clientsData) return clientsData;
    const r = await fetch('/admin/clients'); const j = await r.json(); clientsData = j.rows || []; return clientsData;
  }
  function buildClients(rows) {
    const map = new Map();
    rows.forEach((x) => {
      const key = (x.email || '').toLowerCase() || `id${x.id}`;
      const c = map.get(key) || { key, email: x.email || '', name: '', phone: '', country: '', lang: '', website: '', linkedin: '', socials: '', activity: '', problem: '', revenue: '', products: new Set(), ids: [], n: 0, total: 0, firstT: Infinity, lastT: 0 };
      ['name', 'phone', 'country', 'lang', 'website', 'linkedin', 'socials', 'activity', 'problem', 'revenue'].forEach((f) => { if (!c[f] && x[f]) c[f] = x[f]; });
      const o = byId.get(x.id);
      c.products.add(NAMES[x.product] || x.product); c.ids.push(x.id); c.n++;
      if (o) c.total += net(o);
      const t = new Date(x.paid_at).getTime(); c.lastT = Math.max(c.lastT, t); c.firstT = Math.min(c.firstT, t);
      map.set(key, c);
    });
    return [...map.values()].sort((a, b) => b.lastT - a.lastT);
  }
  const tableOf = (rows) => rows.map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(';')).join('\n');
  const DBCOLS = ['Prénom', 'Nom', 'E-mail', 'Téléphone', 'Pays', 'Langue', 'Site web', 'LinkedIn', 'Autres présences', 'Activité', 'Produits', 'Commandes', 'Total net (EUR)', 'Première commande', 'Dernière commande'];
  const dbRow = (c) => { const n = splitName(c.name); return [n.first, n.last, c.email, c.phone, c.country, (c.lang || '').toUpperCase(), c.website, c.linkedin, c.socials, c.activity, [...c.products].join(', '), c.n, (c.total / 100).toFixed(2), new Date(c.firstT).toISOString().slice(0, 10), new Date(c.lastT).toISOString().slice(0, 10)]; };
  async function exportClients(kind) {
    const list = buildClients(await loadClients());
    const rows = [DBCOLS, ...list.map(dbRow)];
    if (kind === 'copy') {
      const tsv = rows.map((r) => r.map((c) => String(c ?? '').replace(/[\t\r\n]+/g, ' ')).join('\t')).join('\n');
      try { await navigator.clipboard.writeText(tsv); toast('✓ Base clients copiée : collez-la dans Google Sheets (Ctrl+V ou Cmd+V).', 'ok'); } catch { toast('Copie impossible : utilisez « Exporter (CSV) ».', 'bad'); }
      return;
    }
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + tableOf(rows)], { type: 'text/csv;charset=utf-8' })); a.download = `clients-${new Date().toISOString().slice(0, 10)}.csv`; a.click(); URL.revokeObjectURL(a.href);
  }
  function renderCustomers() {
    const tabs = `<div class="seg" style="margin-bottom:16px"><button data-cview="overview" class="${state.cview === 'overview' ? 'on' : ''}">Vue d’ensemble</button><button data-cview="db" class="${state.cview === 'db' ? 'on' : ''}">Base de données clients</button></div>`;
    const q = state.cq.trim().toLowerCase();
    if (state.cview === 'db') {
      $('#view-customers').innerHTML = `${tabs}<div class="toolbar"><div class="search">${searchIcon}<input id="cq" type="search" placeholder="Rechercher un client…" value="${esc(state.cq)}" /></div><span class="spacer"></span><button class="btn" data-cexport="copy">Copier pour Google Sheets</button><button class="btn primary" data-cexport="csv">Exporter (CSV)</button></div><div id="cdb"><div class="card"><div class="skeleton"></div></div></div>`;
      const q2 = $('#cq'); if (state.focusC) { q2.focus(); q2.setSelectionRange(q2.value.length, q2.value.length); state.focusC = false; }
      loadClients().then((rows) => {
        const list = buildClients(rows).filter((c) => !q || `${c.name} ${c.email} ${c.phone} ${c.website} ${c.linkedin}`.toLowerCase().includes(q));
        const box = $('#cdb'); if (!box) return;
        box.innerHTML = `<div class="tablewrap"><div class="tscroll"><table class="t db"><thead><tr>${DBCOLS.map((h, i) => `<th class="${i === 11 || i === 12 ? 'num' : ''}">${esc(h)}</th>`).join('')}</tr></thead><tbody>${list.map((c) => { const n = splitName(c.name); return `<tr data-client="${esc(c.key)}"><td>${esc(n.first) || '—'}</td><td>${esc(n.last) || '—'}</td><td class="ellip">${esc(c.email)}</td><td class="nw">${esc(c.phone) || '<span class="muted">—</span>'}</td><td>${esc(c.country) || '—'}</td><td>${esc((c.lang || '').toUpperCase())}</td><td class="ellip">${link(c.website)}</td><td class="ellip">${link(c.linkedin)}</td><td class="ellip">${esc(c.socials) || '—'}</td><td class="long">${esc(c.activity) || '—'}</td><td>${esc([...c.products].join(', '))}</td><td class="num">${c.n}</td><td class="num nw">${eur(c.total)}</td><td class="nw">${dfmt.format(c.firstT)}</td><td class="nw">${dfmt.format(c.lastT)}</td></tr>`; }).join('') || `<tr style="cursor:default"><td colspan="${DBCOLS.length}" class="empty">Aucun client.</td></tr>`}</tbody></table></div><div class="pager"><span>${list.length} client${list.length > 1 ? 's' : ''} · cliquez sur une ligne pour ouvrir la fiche</span></div></div>`;
      }).catch(() => { const box = $('#cdb'); if (box) box.innerHTML = '<div class="card"><p class="err">Impossible de charger la base clients.</p></div>'; });
      return;
    }
    const map = new Map();
    orders.filter(isPaid).forEach((o) => {
      const k = (o.email || '').toLowerCase() || `id${o.id}`;
      const c = map.get(k) || { key: k, email: o.email, name: o.name, n: 0, total: 0, last: 0, products: new Set() };
      c.n++; c.total += net(o); if (o.paidT > c.last) { c.last = o.paidT; c.name = o.name || c.name; } c.products.add(NAMES[o.product] || o.product); map.set(k, c);
    });
    const list = [...map.values()].filter((c) => !q || `${c.name} ${c.email}`.toLowerCase().includes(q)).sort((a, b) => b.last - a.last);
    $('#view-customers').innerHTML = `${tabs}
      <div class="toolbar"><div class="search">${searchIcon}<input id="cq" type="search" placeholder="Rechercher un client…" value="${esc(state.cq)}" /></div><span class="spacer"></span><span class="muted">${list.length} client${list.length > 1 ? 's' : ''}</span></div>
      <div class="tablewrap"><div class="tscroll"><table class="t"><thead><tr><th>Client</th><th>Produits</th><th class="num">Commandes</th><th class="num">Total net</th><th>Dernier achat</th></tr></thead>
      <tbody>${list.map((c) => `<tr data-client="${esc(c.key)}"><td class="name"><b>${esc(c.name || '—')}</b><span>${esc(c.email || '')}</span></td><td>${esc([...c.products].join(', '))}</td><td class="num">${c.n}</td><td class="num nw">${eur(c.total)}</td><td class="nw">${dfmt.format(c.last)}</td></tr>`).join('') || '<tr style="cursor:default"><td colspan="5" class="empty">Aucun client pour l’instant.</td></tr>'}</tbody></table></div></div>`;
    const q2 = $('#cq'); if (state.focusC) { q2.focus(); q2.setSelectionRange(q2.value.length, q2.value.length); state.focusC = false; }
  }

  /* ---------- espace client ---------- */
  async function openClient(key) {
    const dr = $('#drawer'); current = null;
    dr.innerHTML = '<div class="dr-head"><div><h2>Espace client</h2><div class="sub">Chargement…</div></div><button class="dr-x" id="dr-close" aria-label="Fermer">×</button></div><div class="dr-body"><div class="skeleton"></div><div class="skeleton"></div></div>';
    dr.classList.add('open'); dr.setAttribute('aria-hidden', 'false'); $('#scrim').hidden = false;
    let c;
    try { c = buildClients(await loadClients()).find((x) => x.key === key); } catch { /* repli ci-dessous */ }
    if (!c) { const o = orders.find((x) => (x.email || '').toLowerCase() === key || `id${x.id}` === key); c = { key, email: o?.email || '', name: o?.name || '', phone: o?.phone || '', country: o?.country || '', lang: o?.lang || '', website: '', linkedin: '', socials: '', activity: '', problem: '', revenue: '', products: new Set(), ids: orders.filter((x) => (x.email || '').toLowerCase() === key && isPaid(x)).map((x) => x.id), n: 0, total: 0, firstT: 0, lastT: 0 }; }
    const n = splitName(c.name);
    const mine = c.ids.map((id) => byId.get(id)).filter(Boolean).sort((a, b) => (b.paidT || 0) - (a.paidT || 0));
    const total = mine.reduce((t, o) => t + net(o), 0);
    const row = (k, v) => `<dt>${k}</dt><dd>${v || '<span class="muted">—</span>'}</dd>`;
    dr.innerHTML = `
      <div class="dr-head"><div><h2>${esc(c.name || c.email || 'Client')}</h2><div class="sub">Espace client · ${mine.length} commande${mine.length > 1 ? 's' : ''} · ${eur(total)} net</div></div><button class="dr-x" id="dr-close" aria-label="Fermer">×</button></div>
      <div class="dr-body">
        <div><div class="group-title">Coordonnées</div><dl class="kv">${row('Prénom', esc(n.first))}${row('Nom', esc(n.last))}${row('E-mail', c.email ? `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : '')}${row('Téléphone', c.phone ? `<a href="tel:${esc(c.phone)}">${esc(c.phone)}</a>` : '')}${row('Pays', esc(c.country))}${row('Langue', esc((c.lang || '').toUpperCase()))}</dl></div>
        <div><div class="group-title">Son activité</div><dl class="kv">${row('Site web', c.website ? link(c.website) : '')}${row('LinkedIn', c.linkedin ? link(c.linkedin) : '')}${row('Autres liens', esc(c.socials))}${row('Chiffre d’affaires', esc(c.revenue))}</dl>
        ${c.activity ? `<div class="quote" style="margin-top:10px"><b>Activité :</b> ${esc(c.activity)}</div>` : ''}${c.problem ? `<div class="noteb" style="margin-top:8px"><b>Son problème :</b> ${esc(c.problem)}</div>` : ''}</div>
        <div><div class="group-title">Commandes</div><div class="alerts">${mine.map((o) => `<button class="alert" data-open="${o.id}"><i class="dot" style="background:var(--${o.status === 'paid' ? 'ok' : 'bad'})"></i><div><b>${esc(NAMES[o.product] || o.product)} · ${eur(o.amount)}</b><span>${dtfmt.format(o.paidT || o.createdT)}${delivery(o) ? ` · ${esc(delivery(o).label)}` : ''}</span></div></button>`).join('') || '<span class="muted">Aucune.</span>'}</div></div>
        ${c.email ? `<div class="actions"><a class="btn primary" href="mailto:${esc(c.email)}">Écrire au client</a></div>` : ''}
      </div>`;
  }

  /* ---------- automatisations ---------- */
  const AUTO = [['off', 'Jamais (je l’envoie moi-même)', 'Le PDF ne part que si vous cliquez sur « Envoyer au client ».'], ['now', 'Tout de suite', 'Le client reçoit le PDF dès qu’il est prêt, sans relecture.'], ['1', 'Dans l’heure (recommandé)', 'Environ 45 minutes pour relire et corriger. Le client est prévenu : « dans l’heure ».'], ['4', 'Après 4 heures', '4 heures pour relire et corriger, puis il part tout seul.'], ['12', 'Après 12 heures', 'Un peu plus de temps pour relire.'], ['24', 'Après 24 heures', 'Un jour entier pour relire.']];
  const AUTOMS = [
    { name: 'Livraison du diagnostic', wf: 'Diagnostic IA du business', desc: 'Analyse les réponses du questionnaire, fabrique le PDF et vous l’envoie pour relecture, puis l’envoie au client.', setting: 'autosend' },
    { name: 'Livraison du master prompt', wf: 'Master prompt', desc: 'Génère le prompt maître à partir du questionnaire et vous l’envoie pour relecture.' },
    { name: 'Suivi des livraisons', wf: 'Surveillance des livraisons', desc: 'Toutes les 10 minutes : relance l’agent si un résultat manque, et vous écrit à 4 h, 6 h et 12 h de retard.' },
  ];
  function renderAutomations() {
    const n = boot.n8n;
    const base = (boot.n8nOpen || '').replace(/\/$/, '');
    const wfUrl = (id) => (base ? (id ? `${base}/workflow/${encodeURIComponent(id)}` : `${base}/home/workflows`) : '');
    const exec = (n?.executions || []);
    const wf = (id) => n?.workflows.find((w) => w.id === id)?.name || id;
    const st = (x) => x.status || (x.finished ? 'success' : 'running');
    const label = { success: ['réussie', 'ok'], error: ['en erreur', 'bad'], crashed: ['plantée', 'bad'], running: ['en cours', 'warn'], waiting: ['en attente', 'warn'], canceled: ['annulée', 'gray'], new: ['en file', 'gray'] };
    const ext = (u, t) => (u ? `<a class="btn sm" href="${esc(u)}" target="_blank" rel="noopener noreferrer">${t} ↗</a>` : '');
    const items = AUTOMS.map((a) => {
      const w = n?.workflows.find((x) => x.name === a.wf);
      const last = w ? exec.find((x) => x.workflowId === w.id) : null;
      const [ll, lt] = last ? (label[st(last)] || [st(last), 'gray']) : ['', ''];
      const stat = w ? tag(w.active ? 'actif' : 'inactif', w.active ? 'ok' : 'bad') : tag(boot.n8nConfigured ? 'introuvable' : 'n8n non relié', 'gray');
      const sel = a.setting === 'autosend' ? `<div class="setting"><label for="autosel"><b>Envoi du PDF au client</b></label><select id="autosel">${AUTO.map(([v, t]) => `<option value="${v}" ${boot.autoSend === v ? 'selected' : ''}>${t}</option>`).join('')}</select><p class="sub" id="autohint">${esc(AUTO.find((x) => x[0] === boot.autoSend)?.[2] || '')} Jamais automatique si l’agent a signalé un point à vérifier.</p></div>` : '';
      return `<details class="auto"><summary><span class="an">${esc(a.name)}</span>${stat}${last ? `<span class="muted" style="font-size:.8rem">dernière exécution : ${tag(ll, lt)}</span>` : ''}<i class="chev" aria-hidden="true">⌄</i></summary><div class="auto-body"><p class="sub">${esc(a.desc)}</p>${sel}<div class="actions">${ext(wfUrl(w?.id), 'Ouvrir ce workflow dans n8n')}</div></div></details>`;
    }).join('');
    $('#view-automations').innerHTML = `
      <div class="health-bar"><span class="muted" style="font-weight:700;font-size:.8rem;text-transform:uppercase;letter-spacing:.06em">Système</span><div id="health" class="chips-row"><span class="skeleton" style="width:200px"></span></div><span class="spacer"></span>${ext(base ? `${base}/home/workflows` : '', 'Ouvrir n8n')}</div>
      <p class="section-title">Mes automatisations</p>
      <div class="autos">${items}</div>
      <p class="section-title">Workflows n8n</p>
      ${!boot.n8nConfigured ? `<div class="card"><p class="muted">Pour voir ici vos workflows et leurs exécutions, ajoutez <code>N8N_URL</code> et <code>N8N_API_KEY</code> (n8n, Settings puis n8n API) dans Coolify, puis redéployez.${base ? '' : ''}</p></div>` : boot.n8nError ? `<div class="card"><p class="err">Impossible de joindre n8n (${esc(boot.n8nError)}).</p></div>` : `
      <div class="grid g2"><div class="card"><h3>Workflows</h3><p class="sub">Cliquez sur un nom pour ouvrir le workflow dans n8n.</p><div class="tscroll"><table class="t"><tbody>${(n?.workflows || []).map((w) => `<tr style="cursor:default"><td class="name"><b>${base ? `<a href="${esc(wfUrl(w.id))}" target="_blank" rel="noopener noreferrer">${esc(w.name)} ↗</a>` : esc(w.name)}</b></td><td class="num">${tag(w.active ? 'actif' : 'inactif', w.active ? 'ok' : 'gray')}</td></tr>`).join('') || '<tr style="cursor:default"><td class="muted">Aucun workflow.</td></tr>'}</tbody></table></div></div>
      <div class="card"><h3>Dernières exécutions</h3><p class="sub">${exec.filter((x) => ['error', 'crashed'].includes(st(x))).length} erreur(s) sur les ${exec.length} dernières. Cliquez pour ouvrir le détail.</p><div class="tscroll"><table class="t"><tbody>${exec.slice(0, 10).map((x) => { const [l, tn] = label[st(x)] || [st(x), 'gray']; const u = base ? `${base}/workflow/${encodeURIComponent(x.workflowId)}/executions/${encodeURIComponent(x.id)}` : ''; return `<tr style="cursor:default"><td class="name"><b>${u ? `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(wf(x.workflowId))} ↗</a>` : esc(wf(x.workflowId))}</b><span>${x.startedAt ? dtfmt.format(new Date(x.startedAt)) : ''}</span></td><td class="num">${tag(l, tn)}</td></tr>`; }).join('') || '<tr style="cursor:default"><td class="muted">Aucune exécution.</td></tr>'}</tbody></table></div></div></div>`}`;
    fetch('/api/health').then((r) => r.json()).then((h) => {
      const chip = (l, ok) => `<span class="tag ${ok ? 'ok' : 'bad'}">${ok ? '✓' : '!'} ${l}</span>`;
      const el = $('#health'); if (el) el.innerHTML = chip('Stripe', h.stripe) + chip('Webhook', h.webhookSecret) + chip('E-mails', h.resend) + chip('Agent IA', h.agent) + chip('Base de données', h.db === 'ok');
    }).catch(() => { const el = $('#health'); if (el) el.innerHTML = '<span class="muted">Vérification impossible.</span>'; });
  }

  /* ---------- fiche ---------- */
  let current = null;
  const cooling = new Set();
  function timeline(o) {
    const L = [];
    L.push({ s: 'done', t: 'Commande créée', d: dtfmt.format(o.createdT) });
    L.push(isPaid(o) ? { s: 'done', t: 'Paiement reçu', d: `${dtfmt.format(o.paidT)} · ${eur(o.amount)}` } : { s: o.status === 'pending' ? 'now' : 'fail', t: o.status === 'pending' ? 'Paiement en attente' : (STATUS[o.status] || [o.status])[0], d: '' });
    if (!shippable(o)) return L;
    L.push(o.has_answers ? { s: 'done', t: 'Questionnaire rempli', d: dtfmt.format(o.submittedT) } : { s: 'now', t: 'Questionnaire en attente', d: o.paidT ? `Payé ${ago(o.paidT)}` : '' });
    if (o.has_answers) {
      const failed = (o.agent_status || '').startsWith('failed');
      L.push(o.agent_status === 'done' || o.has_result ? { s: 'done', t: o.product === 'diagnostic' ? 'Diagnostic généré et envoyé à votre adresse' : 'Résultat généré', d: `${o.doneT ? dtfmt.format(o.doneT) : ''}${o.agent_mail_to ? ` · ${o.agent_mail_to}` : ''}` } : { s: failed ? 'fail' : 'now', t: failed ? `Échec de l’agent (${(o.agent_status || '').slice(7)})` : 'Agent au travail', d: `${o.agent_attempts || 0} essai(s)${o.agentT ? ` · dernier ${ago(o.agentT)}` : ''}. Relance automatique toutes les 10 min.` });
      if (o.product === 'diagnostic') L.push(o.sentT ? { s: 'done', t: 'PDF envoyé au client', d: `${dtfmt.format(o.sentT)}${o.client_sent_to ? ` · ${o.client_sent_to}` : ''}` } : { s: o.agent_status === 'done' ? 'now' : '', t: 'Envoi au client', d: o.agent_status === 'done' ? (boot.autoSend === 'off' ? 'À faire par vous (envoi automatique désactivé).' : boot.autoSend === 'now' ? 'Envoi automatique.' : (boot.autoSend === '1' ? 'Envoi automatique environ 45 minutes après le résultat si rien n’est fait.' : `Envoi automatique ${boot.autoSend} h après le résultat si rien n’est fait.`)) : 'Après le résultat' });
    }
    return L;
  }
  function drawerHtml(o, detail) {
    const d = delivery(o);
    const link = o.payment_intent ? `<a href="https://dashboard.stripe.com/payments/${esc(o.payment_intent)}" target="_blank" rel="noopener">Ouvrir dans Stripe ↗</a>` : '—';
    const diag = o.product === 'diagnostic' && o.has_answers;
    const ans = detail?.answers || [];
    const res = detail?.result;
    return `
      <div class="dr-head"><div><h2>${esc(o.name || o.email || `Commande ${o.id}`)}</h2><div class="sub">${esc(o.email || '')} · n° ${o.id}</div></div><button class="dr-x" id="dr-close" aria-label="Fermer">×</button></div>
      <div class="dr-body">
        <div style="display:flex;gap:8px;flex-wrap:wrap">${statusTag(o)}${d ? tag(d.label, d.tone) : ''}${tag(NAMES[o.product] || o.product)}</div>
        <dl class="kv"><dt>Montant</dt><dd><b>${o.amount ? eur(o.amount) : '—'}</b>${o.refunded ? ` (remboursé ${eur(o.refunded)})` : ''}</dd><dt>Date</dt><dd>${dtfmt.format(o.paidT || o.createdT)}</dd><dt>Langue</dt><dd>${esc((o.lang || 'fr').toUpperCase())}</dd><dt>Paiement</dt><dd>${link}</dd></dl>
        ${shippable(o) ? `<div><div class="group-title">Parcours</div><ul class="timeline">${timeline(o).map((x) => `<li class="${x.s}">${esc(x.t)}${x.d ? `<span>${esc(x.d)}</span>` : ''}</li>`).join('')}</ul></div>` : ''}
        ${o.has_answers ? `<div><div class="group-title">Actions</div><div class="actions">
          <button class="btn primary act" data-act="relance">Relancer l’agent</button>
          ${diag ? `<a class="btn" href="/admin/pdf?order_id=${o.id}" target="_blank" rel="noopener" ${o.has_result ? '' : 'aria-disabled="true" style="opacity:.5;pointer-events:none"'}>Voir le PDF</a>
          <button class="btn act" data-act="pdf_me" ${o.has_result ? '' : 'disabled'}>M’envoyer le PDF (test)</button>
          <button class="btn primary act" data-act="pdf_client" data-confirm="Envoyer le PDF à ${esc(o.email || 'ce client')} ?" ${o.has_result ? '' : 'disabled'}>Envoyer le PDF au client</button>` : ''}
          <button class="btn act" data-act="questionnaire_me">Me renvoyer le questionnaire (test)</button>
          <button class="btn act" data-act="questionnaire_client" data-confirm="Renvoyer le lien du questionnaire à ${esc(o.email || 'ce client')} ?">Le renvoyer au client</button></div>
          <p class="sub muted" id="dr-note" style="margin-top:8px;font-size:.82rem">Chaque bouton se bloque 10 secondes après un clic.</p></div>` : (shippable(o) ? `<div><div class="group-title">Actions</div><div class="actions"><button class="btn act" data-act="questionnaire_client" data-confirm="Renvoyer le lien du questionnaire à ${esc(o.email || 'ce client')} ?">Renvoyer le questionnaire au client</button><button class="btn act" data-act="questionnaire_me">Me l’envoyer (test)</button></div></div>` : '')}
        ${res?.analyse_expert?.verdict ? `<div><div class="group-title">Verdict de l’expert</div><div class="quote">${esc(res.analyse_expert.verdict)}</div></div>` : ''}
        ${detail?.warnings?.length ? `<div><div class="group-title">À vérifier</div><div class="noteb">${esc(detail.warnings.join('\n'))}</div></div>` : ''}
        ${detail?.note ? `<div><div class="group-title">Note interne</div><div class="noteb">${esc(detail.note)}</div></div>` : ''}
        ${o.has_answers ? `<details class="outer"><summary>Réponses du client${ans.length ? ` (${ans.length})` : ''} <span class="muted">· masquées, cliquez pour afficher</span></summary><div class="qa" id="qa">${detail ? ans.map((a) => `<details><summary>${esc(a.label)}</summary><div class="ans">${esc(a.value)}</div></details>`).join('') : '<div class="skeleton"></div>'}</div></details>` : ''}
        <div><div class="group-title">Gérer la commande</div><div class="actions">${o.email ? `<button class="btn" data-client="${esc((o.email || '').toLowerCase())}">Ouvrir l’espace client</button>` : ''}<button class="btn" data-manage="edit">Modifier</button><button class="btn danger" data-manage="delete">Supprimer</button></div></div>
      </div>`;
  }
  async function openOrder(id) {
    const o = byId.get(id); if (!o) return;
    current = o;
    const dr = $('#drawer');
    dr.innerHTML = drawerHtml(o, null);
    dr.classList.add('open'); dr.setAttribute('aria-hidden', 'false'); $('#scrim').hidden = false;
    history.replaceState(null, '', `#order-${id}`);
    if (o.has_answers || o.has_result) {
      try {
        const r = await fetch(`/admin/order?order_id=${id}`); const j = await r.json();
        if (current === o) dr.innerHTML = drawerHtml(o, { answers: j.answers || [], result: j.result, note: j.note, warnings: j.warnings || [] });
      } catch { /* on garde la fiche sans détail */ }
    }
  }
  function closeDrawer() { $('#drawer').classList.remove('open'); $('#drawer').setAttribute('aria-hidden', 'true'); $('#scrim').hidden = true; current = null; history.replaceState(null, '', `#${state.view}`); }

  /* ---------- toasts, fenêtre de confirmation ---------- */
  function toast(msg, kind = '') { const t = document.createElement('div'); t.className = `toast ${kind}`; t.textContent = msg; $('#toasts').appendChild(t); setTimeout(() => t.remove(), 9000); }
  function confirmDialog(message) {
    return new Promise((res) => {
      const m = $('#modal'); $('#modal-card').innerHTML = `<p style="font-weight:600">${esc(message)}</p><div class="actions"><button class="btn" id="m-no">Annuler</button><button class="btn primary" id="m-yes">Confirmer</button></div>`;
      m.hidden = false; $('#m-yes').focus();
      const done = (v) => { m.hidden = true; res(v); };
      $('#m-yes').onclick = () => done(true); $('#m-no').onclick = () => done(false);
    });
  }

  /* ---------- modifier / supprimer une commande ---------- */
  function editDialog(o) {
    const m = $('#modal'); const val = (v) => esc(v || '');
    $('#modal-card').innerHTML = `<h3 style="font-size:1.05rem">Modifier la commande n° ${o.id}</h3>
      <label class="fld">Nom complet<input id="e-name" value="${val(o.name)}" /></label>
      <label class="fld">E-mail<input id="e-email" type="email" value="${val(o.email)}" /></label>
      <label class="fld">Téléphone<input id="e-phone" value="${val(o.phone)}" /></label>
      <div class="two"><label class="fld">Produit<select id="e-product"><option value="diagnostic" ${o.product === 'diagnostic' ? 'selected' : ''}>Diagnostic</option><option value="prompt" ${o.product === 'prompt' ? 'selected' : ''}>Master prompt</option></select></label>
      <label class="fld">Langue<select id="e-lang"><option value="fr" ${o.lang !== 'en' ? 'selected' : ''}>Français</option><option value="en" ${o.lang === 'en' ? 'selected' : ''}>Anglais</option></select></label></div>
      <p class="err" id="e-err"></p>
      <div class="actions"><button class="btn" id="m-no">Annuler</button><button class="btn primary" id="m-yes">Enregistrer</button></div>`;
    m.hidden = false; $('#e-name').focus();
    $('#m-no').onclick = () => { m.hidden = true; };
    $('#m-yes').onclick = async () => {
      const body = { order_id: o.id, name: $('#e-name').value, email: $('#e-email').value, phone: $('#e-phone').value, product: $('#e-product').value, lang: $('#e-lang').value };
      const res = await fetch('/admin/order-edit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) { $('#e-err').textContent = j.error === 'bad_email' ? 'Adresse e-mail invalide.' : 'Enregistrement impossible.'; return; }
      Object.assign(o, j.order); clientsData = null; m.hidden = true; toast('✓ Commande modifiée.', 'ok'); renderCurrent();
    };
  }
  function deleteDialog(o) {
    const m = $('#modal');
    $('#modal-card').innerHTML = `<h3 style="font-size:1.05rem">Supprimer cette commande ?</h3><p>Commande n° ${o.id} · <b>${esc(o.name || o.email || '')}</b> · ${esc(NAMES[o.product] || o.product)}${o.amount ? ` · ${eur(o.amount)}` : ''}.</p><p class="muted" style="font-size:.88rem">Ses réponses et son diagnostic seront effacés. C’est définitif.${isPaid(o) ? ' <b>Cette commande est payée : la supprimer ne rembourse pas le client</b> (le remboursement se fait dans Stripe).' : ''}</p><div class="actions"><button class="btn primary" id="m-no">Non, ne pas supprimer</button><button class="btn danger" id="m-yes">Oui, je suis sûr de supprimer</button></div>`;
    m.hidden = false; $('#m-no').focus();
    $('#m-no').onclick = () => { m.hidden = true; };
    $('#m-yes').onclick = async () => {
      const res = await fetch('/admin/order-delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order_id: o.id, confirm: true }) });
      m.hidden = true;
      if (!res.ok) { toast('Suppression impossible.', 'bad'); return; }
      const i = orders.findIndex((x) => x.id === o.id); if (i >= 0) orders.splice(i, 1); byId.delete(o.id); clientsData = null;
      closeDrawer(); render(); toast('Commande supprimée.', 'ok');
    };
  }

  /* ---------- actions de la fiche ---------- */
  const DONE = { pdf_me: 'PDF envoyé à votre adresse', pdf_client: 'PDF envoyé au client', questionnaire_me: 'Lien du questionnaire envoyé à votre adresse', questionnaire_client: 'Lien du questionnaire envoyé au client' };
  const ERR = { no_result: 'Le PDF n’est pas encore généré.', mail_failed: 'L’e-mail n’a pas pu partir.', no_client_email: 'Pas d’adresse e-mail pour ce client.', no_owner_email: 'OWNER_EMAIL n’est pas configuré.' };
  async function runAction(btn) {
    const o = current; if (!o) return;
    const act = btn.dataset.act;
    if (btn.dataset.confirm && !(await confirmDialog(btn.dataset.confirm))) return;
    const all = $$('.act', $('#drawer')); const label = btn.textContent;
    all.forEach((b) => { b.dataset.was = b.disabled ? '1' : ''; b.disabled = true; });
    btn.textContent = 'Envoi…';
    const note = $('#dr-note');
    try {
      if (act === 'relance') {
        const res = await fetch('/admin/relance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order_id: o.id }) });
        const j = await res.json().catch(() => ({}));
        if (res.ok && j.status === 'sent') {
          Object.assign(o, { agent_status: 'sent', agent_attempts: j.attempts, agentT: Date.now() });
          toast(`Envoyé à l’agent à ${tfmt.format(new Date(j.sentAt))}. L’e-mail arrive dans 2 à 3 minutes.`, 'ok');
          if (note) { note.textContent = `✓ Bien parti vers l’agent à ${tfmt.format(new Date(j.sentAt))}. Le statut se met à jour tout seul.`; note.style.color = 'var(--ok)'; }
          if (current === o) { const dr = $('#drawer'); const y = dr.querySelector('.dr-body').scrollTop; dr.innerHTML = drawerHtml(o, null); dr.querySelector('.dr-body').scrollTop = y; }
          poll(o);
        } else toast(`Échec de l’envoi à l’agent (${j.status || j.error || res.status}). Réessai automatique dans 10 minutes.`, 'bad');
      } else {
        const res = await fetch('/admin/action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order_id: o.id, action: act }) });
        const j = await res.json().catch(() => ({}));
        if (res.ok) {
          toast(`✓ ${DONE[act]} (${j.to}) à ${tfmt.format(new Date(j.at))}.`, 'ok');
          if (act === 'pdf_client') { o.sentT = Date.now(); o.client_sent_to = j.to; }
        } else toast(ERR[j.error] || `Échec (${j.error || res.status}).`, 'bad');
      }
    } catch { toast('Connexion impossible.', 'bad'); }
    cooldown(btn, label, all);
    renderCurrent();
  }
  function cooldown(btn, label, all) {
    let left = 10; btn.textContent = `${label} (${left} s)`;
    const iv = setInterval(() => { left -= 1; if (left <= 0) { clearInterval(iv); all.forEach((b) => { if (b.isConnected) b.disabled = b.dataset.was === '1'; }); if (btn.isConnected) btn.textContent = label; } else if (btn.isConnected) btn.textContent = `${label} (${left} s)`; }, 1000);
  }
  async function poll(o) {
    for (let i = 0; i < 40; i++) {
      await new Promise((r) => setTimeout(r, 5000));
      const r = await fetch(`/admin/relance?order_id=${o.id}`).catch(() => null);
      if (!r || !r.ok) continue;
      const s = await r.json();
      Object.assign(o, { agent_status: s.status, agent_attempts: s.attempts, agentT: s.at ? new Date(s.at).getTime() : o.agentT, doneT: s.done_at ? new Date(s.done_at).getTime() : o.doneT, agent_mail_to: s.mail_to });
      renderCurrent(true);
      if (s.status === 'done') { o.has_result = true; toast(`Résultat prêt et envoyé${s.mail_to ? ` à ${s.mail_to}` : ''}.`, 'ok'); renderCurrent(); return; }
      if ((s.status || '').startsWith('failed')) return;
    }
  }
  function renderCurrent(keepScroll) { if (!current) { render(); return; } const dr = $('#drawer'); if (!dr.classList.contains('open')) return; const body = dr.querySelector('.dr-body'); const y = body ? body.scrollTop : 0; const qa = $('#qa'); const keepQa = qa && qa.children.length && !qa.querySelector('.skeleton') ? qa.innerHTML : null; dr.innerHTML = drawerHtml(current, null); if (keepQa && $('#qa')) $('#qa').innerHTML = keepQa; dr.querySelector('.dr-body').scrollTop = y; render(); }

  /* ---------- navigation ---------- */
  const TITLES = { overview: 'Vue d’ensemble', orders: 'Commandes', delivery: 'Livraisons', customers: 'Clients', automations: 'Automatisations' };
  function render() {
    $$('.view').forEach((v) => { v.hidden = v.id !== `view-${state.view}`; });
    $$('#nav a').forEach((a) => a.classList.toggle('on', a.dataset.view === state.view));
    $('#view-title').textContent = TITLES[state.view];
    $('#period').style.display = state.view === 'overview' ? '' : 'none';
    ({ overview: renderOverview, orders: renderOrders, delivery: renderDelivery, customers: renderCustomers, automations: renderAutomations })[state.view]();
    const nd = orders.filter((o) => { const d = delivery(o); return d && (d.key === 'review' || (d.key === 'run' && d.tone === 'bad')); }).length;
    $('#n-orders').textContent = orders.length || '';
    $('#n-delivery').textContent = nd || '';
    $('#n-auto').textContent = boot.n8nError || (boot.n8n && boot.n8n.executions.some((x) => ['error', 'crashed'].includes(x.status))) ? '!' : '';
  }
  function go(view, push = true) { state.view = TITLES[view] ? view : 'overview'; if (push) history.replaceState(null, '', `#${state.view}`); $('#side').classList.remove('open'); $('#scrim').hidden = true; render(); window.scrollTo(0, 0); }

  /* ---------- événements ---------- */
  document.addEventListener('click', (e) => {
    const t = e.target;
    const cli = t.closest('[data-client]'); if (cli) { openClient(cli.dataset.client); return; }
    const man = t.closest('[data-manage]'); if (man && current) { man.dataset.manage === 'edit' ? editDialog(current) : deleteDialog(current); return; }
    const cv = t.closest('[data-cview]'); if (cv) { state.cview = cv.dataset.cview; renderCustomers(); return; }
    const ce = t.closest('[data-cexport]'); if (ce) { exportClients(ce.dataset.cexport); return; }
    const open = t.closest('[data-open]'); if (open) { openOrder(+open.dataset.open); return; }
    const nav = t.closest('#nav a'); if (nav) { e.preventDefault(); go(nav.dataset.view); return; }
    if (t.closest('#dr-close') || t.id === 'scrim') { if ($('#side').classList.contains('open')) { $('#side').classList.remove('open'); $('#scrim').hidden = true; } else closeDrawer(); return; }
    if (t.closest('#burger')) { $('#side').classList.add('open'); $('#scrim').hidden = false; return; }
    const per = t.closest('#period button'); if (per) { state.period = +per.dataset.p; $$('#period button').forEach((b) => b.classList.toggle('on', b === per)); render(); return; }
    const st = t.closest('[data-status]'); if (st) { state.status = st.dataset.status; state.page = 1; render(); return; }
    const so = t.closest('th[data-sort]'); if (so) { const k = so.dataset.sort; if (state.sort === k) state.dir *= -1; else { state.sort = k; state.dir = -1; } render(); return; }
    const pg = t.closest('[data-page]'); if (pg) { state.page += +pg.dataset.page; render(); return; }
    if (t.closest('#csv')) { exportCsv(); return; }
    const act = t.closest('.act'); if (act && !act.disabled) { runAction(act); return; }
  });
  document.addEventListener('input', (e) => {
    if (e.target.id === 'q') { state.q = e.target.value; state.page = 1; state.focusQ = true; renderOrders(); }
    if (e.target.id === 'cq') { state.cq = e.target.value; state.focusC = true; renderCustomers(); }
  });
  document.addEventListener('change', async (e) => {
    if (e.target.id === 'prod') { state.product = e.target.value; state.page = 1; render(); }
    if (e.target.id === 'autosel') {
      const v = e.target.value;
      const res = await fetch('/admin/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'auto_send', value: v }) });
      if (res.ok) { boot.autoSend = v; toast('Réglage enregistré.', 'ok'); const hint = $('#autohint'); if (hint) hint.textContent = `${AUTO.find((x) => x[0] === v)?.[2] || ''} Jamais automatique si l’agent a signalé un point à vérifier.`; } else { toast('Impossible d’enregistrer le réglage.', 'bad'); renderAutomations(); }
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { if (!$('#modal').hidden) $('#m-no').click(); else if ($('#drawer').classList.contains('open')) closeDrawer(); }
    if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); go('orders'); setTimeout(() => $('#q')?.focus(), 0); }
  });
  function exportCsv() {
    const rows = [['Date', 'Nom', 'E-mail', 'Produit', 'Montant EUR', 'Rembourse EUR', 'Statut', 'Livraison']];
    filtered().forEach((o) => rows.push([new Date(o.paidT || o.createdT).toISOString(), o.name || '', o.email || '', NAMES[o.product] || o.product, (o.amount / 100).toFixed(2), (o.refunded / 100).toFixed(2), (STATUS[o.status] || [o.status])[0], delivery(o)?.label || '']));
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })); a.download = `commandes-${new Date().toISOString().slice(0, 10)}.csv`; a.click(); URL.revokeObjectURL(a.href);
  }

  const h = location.hash.replace('#', '');
  if (h.startsWith('order-')) { state.view = 'orders'; render(); openOrder(+h.slice(6)); } else go(TITLES[h] ? h : 'overview', false);
  setInterval(() => { if (!$('#drawer').classList.contains('open') && document.visibilityState === 'visible' && !/input|textarea|select/i.test(document.activeElement.tagName)) location.reload(); }, 5 * 60000);
})();
