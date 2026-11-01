#!/usr/bin/env python3
"""Génère les workflows n8n (diagnostic.workflow.json et prompt.workflow.json) depuis les prompts .md.
Usage : python3 docs/n8n/build.py   (puis node scripts/n8n-update.mjs pour mettre n8n à jour)"""
import json, os, uuid

HERE = os.path.dirname(os.path.abspath(__file__))
rd = lambda f: open(os.path.join(HERE, f), encoding='utf-8').read().strip()

HELPERS = r"""
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const oneLine = (s) => String(s ?? '').replace(/[\r\n]+/g, ' ').slice(0, 120);
const words = (s) => (String(s ?? '').match(/\S+/g) ?? []).length;
const inline = (s) => esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
function md(src) {
  const html = [];
  let list = null;
  const close = () => { if (list) { html.push(`</${list}>`); list = null; } };
  for (const raw of String(src ?? '').split('\n')) {
    const line = raw.trimEnd();
    let m;
    if (!line.trim()) { close(); continue; }
    if ((m = line.match(/^(#{1,3})\s+(.*)$/))) {
      close();
      const lvl = m[1].length;
      const size = { 1: '24px', 2: '19px', 3: '16px' }[lvl];
      html.push(`<h${lvl} style="margin:22px 0 8px;font:700 ${size}/1.25 Helvetica,Arial,sans-serif;color:#3b2a63;">${inline(m[2])}</h${lvl}>`);
    } else if ((m = line.match(/^\s*[-*]\s+(.*)$/))) {
      if (list !== 'ul') { close(); html.push('<ul style="margin:8px 0;padding-left:22px;">'); list = 'ul'; }
      html.push(`<li style="margin:0 0 6px;">${inline(m[1])}</li>`);
    } else if ((m = line.match(/^\s*\d+[.)]\s+(.*)$/))) {
      if (list !== 'ol') { close(); html.push('<ol style="margin:8px 0;padding-left:22px;">'); list = 'ol'; }
      html.push(`<li style="margin:0 0 6px;">${inline(m[1])}</li>`);
    } else {
      close();
      html.push(`<p style="margin:0 0 12px;">${inline(line)}</p>`);
    }
  }
  close();
  return html.join('\n');
}
function alertPayload(config, title, reason, body) {
  const answers = (Array.isArray(body?.answers) ? body.answers : [])
    .map((a) => `<li><strong>${esc(a.label)}</strong><br>${esc(String(a.value ?? '').slice(0, 3000)).replace(/\n/g, '<br>')}</li>`)
    .join('');
  const html = `<!doctype html><html><body style="margin:0;padding:24px 12px;background:#f6f0e4;">
<div style="max-width:640px;margin:0 auto;font:16px/1.6 Helvetica,Arial,sans-serif;color:#2a211b;">
  <div style="background:#8a4b36;color:#fff;padding:14px 20px;border-radius:14px 14px 0 0;font-weight:700;">⚠ ${esc(title)}</div>
  <div style="background:#fbf7ee;padding:22px 26px;border-radius:0 0 14px 14px;">
    <p><strong>Raison :</strong> ${esc(reason)}</p>
    <p>Le client attend son résultat : <strong>à traiter à la main</strong>.</p>
    <p>Client : ${esc(body?.name ?? '')} (${esc(body?.email ?? '')}) · commande n° ${esc(body?.orderId ?? '?')} · produit : ${esc(body?.product ?? '?')}</p>
    <h3 style="margin:18px 0 6px;">Réponses du client</h3>
    <ul style="padding-left:20px;">${answers || '<li>(aucune réponse exploitable)</li>'}</ul>
  </div>
</div></body></html>`;
  return {
    from: config.MAIL_FROM,
    to: [config.OWNER_EMAIL],
    reply_to: body?.email || undefined,
    subject: `⚠ ${title} : ${oneLine(body?.name || body?.email || 'client')}`,
    html,
  };
}
"""

VALIDATE = r"""// Réglages à adapter : modèle, adresse qui reçoit les résultats, expéditeur Resend
const CONFIG = {
  MODEL: 'gemini-3.5-flash-lite', // ou 'gemini-flash-lite-latest'
  OWNER_EMAIL: '__OWNER__',
  MAIL_FROM: 'Binta Kande <hello@bintakande.com>',
};
const EXPECTED = '__PRODUCT__';
const MIN_ANSWERS = __MIN_ANSWERS__;
const MIN_CHARS = __MIN_CHARS__;

const body = $input.first().json.body ?? {};
// L'adresse qui reçoit les résultats vient du site (variable OWNER_EMAIL de Coolify), pour n'avoir qu'une seule source
if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.owner ?? ''))) CONFIG.OWNER_EMAIL = String(body.owner).trim();
const answers = (Array.isArray(body.answers) ? body.answers : [])
  .filter((a) => a && typeof a.value === 'string' && a.value.trim())
  .map((a) => ({ id: String(a.id ?? '').slice(0, 40), label: String(a.label ?? '').slice(0, 200), value: a.value.slice(0, 3000) }));
const chars = answers.reduce((n, a) => n + a.value.length, 0);

const problems = [];
if (body.product !== EXPECTED) problems.push(`Produit inattendu : ${String(body.product).slice(0, 40)}`);
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.email ?? ''))) problems.push('E-mail du client absent ou invalide');
if (answers.length < MIN_ANSWERS) problems.push(`Moins de ${MIN_ANSWERS} réponses exploitables`);
if (chars < MIN_CHARS) problems.push(`Réponses trop courtes (${chars} caractères)`);

// Dédoublonnage : un même envoi (même commande, mêmes réponses) ne déclenche qu'un seul traitement
let h = 5381;
for (const ch of JSON.stringify(answers)) h = ((h << 5) + h + ch.charCodeAt(0)) | 0;
const key = `${body.orderId}:${h}`;
const store = $getWorkflowStaticData('global');
store.seen = Array.isArray(store.seen) ? store.seen : [];
if (!body.retry && store.seen.includes(key)) return [];
if (!problems.length) store.seen = [...store.seen, key].slice(-500);

return [{ json: { ok: problems.length === 0, problems, config: CONFIG, body: { orderId: body.orderId, product: body.product, lang: body.lang === 'en' ? 'en' : 'fr', email: String(body.email ?? '').slice(0, 254), name: String(body.name ?? '').slice(0, 120), answers } } }];
"""

REQUEST = r"""const { body, config } = $input.first().json;
const SYSTEM_PROMPT = __SYSTEM_PROMPT__;
const clean = (s) => String(s ?? '').replace(/<\/?reponses_client>/gi, '');
const lines = body.answers.map((a) => `- ${clean(a.label)} : ${clean(a.value)}`).join('\n');
const user = `Produit : __PRODUCT__\nlangue : ${body.lang}\nNom du client : ${clean(body.name) || 'inconnu'}\n\n<reponses_client>\n${lines}\n</reponses_client>`;

const requestBody = {
  systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
  contents: [{ role: 'user', parts: [{ text: user }] }],
  generationConfig: {
    temperature: __TEMP__,
    maxOutputTokens: __MAXTOK__,
    responseMimeType: 'application/json',
    responseSchema: {
      type: 'OBJECT',
      properties: __PROPS__,
      required: __REQUIRED__,
    },
  },
};
return [{ json: { requestBody, config } }];
"""

ALERT = r"""const v = $('Valider et dédoublonner').first().json;
const inp = $input.first().json;
const reason = Array.isArray(inp.problems) && inp.problems.length
  ? inp.problems.join(' ; ')
  : String(inp.error?.message ?? inp.error?.description ?? JSON.stringify(inp.error ?? inp)).slice(0, 400);
return [{ json: { payload: alertPayload(v.config, 'Agent en échec', reason, v.body) } }];
"""

EMAIL_DIAG = r"""const v = $('Valider et dédoublonner').first().json;
const { config } = v;
const body = v.body;
const res = $input.first().json;
const cand = res.candidates?.[0];
const text = (cand?.content?.parts ?? []).map((p) => p.text ?? '').join('');
const fail = (reason) => [{ json: { payload: alertPayload(config, 'Agent en échec', reason, body) } }];
if (!text) return fail(res.promptFeedback?.blockReason ? `Bloqué par le modèle : ${res.promptFeedback.blockReason}` : 'Réponse vide du modèle');

const warnings = [];
let out;
try {
  out = JSON.parse(text);
} catch {
  out = { diagnostic_markdown: text, note_interne: 'Réponse non structurée : relire attentivement avant envoi.' };
  warnings.push('Réponse non structurée (JSON invalide)');
}
const diag = String(out.diagnostic_markdown ?? '');
if (!diag.trim()) return fail('Diagnostic vide');
if (cand?.finishReason === 'MAX_TOKENS') warnings.push('Réponse tronquée (limite de longueur atteinte)');
const nWords = words(diag);
if (nWords < 600) warnings.push(`Diagnostic court (${nWords} mots, visé : 900 à 1 300)`);
const sections = (diag.match(/^## /gm) ?? []).length;
if (sections < 5) warnings.push(`Structure incomplète (${sections} sections sur 6 attendues)`);
if (body.lang === 'fr' && /\b(the|your|and)\b/i.test(diag.slice(0, 400))) warnings.push('Langue à vérifier (le début ressemble à de l\'anglais)');

const warn = warnings.length
  ? `<div style="background:#f3e3d6;border:1px solid #8a4b36;padding:12px 20px;font-size:14px;"><strong>À vérifier avant envoi :</strong><ul style="margin:6px 0 0;padding-left:20px;">${warnings.map((w) => `<li>${esc(w)}</li>`).join('')}</ul></div>`
  : '';
const note = esc(out.note_interne || '').replace(/\n/g, '<br>');
const html = `<!doctype html><html><body style="margin:0;padding:24px 12px;background:#f6f0e4;">
<div style="max-width:640px;margin:0 auto;font:16px/1.6 Helvetica,Arial,sans-serif;color:#2a211b;">
  <div style="background:#3b2a63;color:#fbf7ee;padding:14px 20px;border-radius:14px 14px 0 0;font-weight:700;border-bottom:4px solid #694cac;">À relire avant envoi : ${esc(body.name || 'client')} (${esc(body.email)}) · ${body.lang.toUpperCase()}</div>
  ${warn}
  <div style="background:#e4d9f1;border:1px solid #694cac;padding:14px 20px;font-size:14px;"><strong>Note interne (ne pas transmettre)</strong><br>${note}</div>
  <div style="background:#fbf7ee;padding:24px 28px;border-radius:0 0 14px 14px;">${md(diag)}</div>
  <p style="font-size:12px;color:#7a6a5c;text-align:center;">Répondez à cet e-mail pour écrire directement au client. Commande n° ${esc(body.orderId)}.</p>
</div></body></html>`;

return [{ json: { payload: { from: config.MAIL_FROM, to: [config.OWNER_EMAIL], reply_to: body.email, subject: `${warnings.length ? '⚠ ' : ''}Diagnostic à relire : ${oneLine(body.name || body.email)}`, html } } }];
"""

EMAIL_PROMPT = r"""const v = $('Valider et dédoublonner').first().json;
const { config } = v;
const body = v.body;
const res = $input.first().json;
const cand = res.candidates?.[0];
const text = (cand?.content?.parts ?? []).map((p) => p.text ?? '').join('');
const fail = (reason) => [{ json: { payload: alertPayload(config, 'Agent en échec', reason, body) } }];
if (!text) return fail(res.promptFeedback?.blockReason ? `Bloqué par le modèle : ${res.promptFeedback.blockReason}` : 'Réponse vide du modèle');

const warnings = [];
let out;
try {
  out = JSON.parse(text);
} catch {
  out = { master_prompt: text, mode_emploi: '', note_interne: 'Réponse non structurée : relire attentivement avant envoi.' };
  warnings.push('Réponse non structurée (JSON invalide)');
}
const prompt = String(out.master_prompt ?? '').trim();
if (!prompt) return fail('Master prompt vide');
if (cand?.finishReason === 'MAX_TOKENS') warnings.push('Réponse tronquée (limite de longueur atteinte)');
const nWords = words(prompt);
if (nWords < 450) warnings.push(`Master prompt trop court (${nWords} mots, visé : 600 à 1 100)`);
const sections = (prompt.match(/^## /gm) ?? []).length;
if (sections < 9) warnings.push(`Structure incomplète (${sections} sections sur 11 attendues)`);
const todo = (prompt.match(/\[À COMPLÉTER|\[TO COMPLETE|\[TO BE COMPLETED/gi) ?? []).length;
if (todo > 8) warnings.push(`Beaucoup de marqueurs à compléter (${todo}) : réponses du client peu détaillées`);

const warn = warnings.length
  ? `<div style="background:#f3e3d6;border:1px solid #8a4b36;padding:12px 20px;font-size:14px;"><strong>À vérifier avant envoi :</strong><ul style="margin:6px 0 0;padding-left:20px;">${warnings.map((w) => `<li>${esc(w)}</li>`).join('')}</ul></div>`
  : '';
const note = esc(out.note_interne || '').replace(/\n/g, '<br>');
const html = `<!doctype html><html><body style="margin:0;padding:24px 12px;background:#f6f0e4;">
<div style="max-width:680px;margin:0 auto;font:16px/1.6 Helvetica,Arial,sans-serif;color:#2a211b;">
  <div style="background:#3b2a63;color:#fbf7ee;padding:14px 20px;border-radius:14px 14px 0 0;font-weight:700;">Master prompt à relire : ${esc(body.name || 'client')} (${esc(body.email)}) · ${body.lang.toUpperCase()} · ${nWords} mots</div>
  ${warn}
  <div style="background:#e4d9f1;border:1px solid #694cac;padding:14px 20px;font-size:14px;"><strong>Note interne (ne pas transmettre)</strong><br>${note}</div>
  <div style="background:#fbf7ee;padding:22px 26px;">
    <h2 style="margin:0 0 10px;font:700 18px/1.2 Helvetica,Arial,sans-serif;">Mode d'emploi</h2>
    ${md(out.mode_emploi)}
  </div>
  <div style="background:#fbf7ee;padding:4px 26px 24px;border-radius:0 0 14px 14px;">
    <h2 style="margin:0 0 10px;font:700 18px/1.2 Helvetica,Arial,sans-serif;">Le master prompt (également en pièce jointe)</h2>
    <div style="white-space:pre-wrap;font:14px/1.55 Menlo,Consolas,monospace;background:#fff;border:1px solid #eadccc;border-radius:10px;padding:16px;">${esc(prompt)}</div>
  </div>
  <p style="font-size:12px;color:#7a6a5c;text-align:center;">Répondez à cet e-mail pour écrire directement au client. Commande n° ${esc(body.orderId)}.</p>
</div></body></html>`;

return [{ json: { payload: {
  from: config.MAIL_FROM,
  to: [config.OWNER_EMAIL],
  reply_to: body.email,
  subject: `${warnings.length ? '⚠ ' : ''}Master prompt à relire : ${oneLine(body.name || body.email)}`,
  html,
  attachments: [{ filename: 'master-prompt.txt', content: Buffer.from(prompt, 'utf8').toString('base64') }],
} } }];
"""

STATUS = r"""// Dit au site si le résultat est parti (kind: result) ou s'il s'agit d'une alerte d'échec (kind: alert)
const SITE_URL = 'https://bintakande.com';
const orderId = $('Valider et dédoublonner').first().json.body.orderId;
let payload = null;
for (const name of ["Préparer l'e-mail", "Préparer l'alerte"]) {
  try { const n = $(name); if (n.isExecuted) { payload = n.first().json.payload; break; } } catch (e) {}
}
const kind = payload && !String(payload.subject ?? '').includes('Agent en échec') ? 'result' : 'alert';
const to = Array.isArray(payload?.to) ? String(payload.to[0] ?? '') : '';
let mailId = '';
try { mailId = String($('Envoyer via Resend').first().json.id ?? ''); } catch (e) {}
return [{ json: { url: `${SITE_URL}/api/agent-done`, orderId, kind, to, mailId } }];
"""

def _schema(spec):
    """Spécification compacte -> responseSchema Gemini (JSON valide en JavaScript)."""
    if spec == 's': return {"type": "STRING"}
    if spec == 'i': return {"type": "INTEGER"}
    if isinstance(spec, list):
        return {"type": "ARRAY", "items": _schema(spec[0])}
    return {"type": "OBJECT", "properties": {k: _schema(v) for k, v in spec.items()}, "required": list(spec.keys())}

DIAG_SPEC = {
    "resume": "s", "score_global": "i",
    "scores": [{"axe": "s", "score": "i", "commentaire": "s"}],
    "forces": ["s"],
    "freins": [{"titre": "s", "constat": "s", "cause": "s", "impact": "s"}],
    "analyse_expert": {"verdict": "s", "goulot": "s", "lecture": "s", "angle_mort": "s", "opportunite": "s", "risque": "s"},
    "offre": {"resultat": "i", "probabilite": "i", "rapidite": "i", "facilite": "i", "commentaire": "s", "amelioration": "s"},
    "entonnoir": [{"etape": "s", "etat": "s", "constat": "s"}],
    "swot": {"forces": ["s"], "faiblesses": ["s"], "opportunites": ["s"], "menaces": ["s"]},
    "potentiel": {"heures_par_mois": "i", "revenu_mensuel": "i", "hypotheses": "s"},
    "pistes": [{"titre": "s", "probleme": "s", "solution": "s", "effet": "s", "effort": "s", "delai": "s", "premier_pas": "s", "impact": "i", "confiance": "i", "facilite": "i"}],
    "suite_90_jours": ["s"],
    "outils": [{"besoin": "s", "outil": "s", "pourquoi": "s", "cout": "s"}],
    "plan": [{"periode": "s", "actions": ["s"]}],
    "indicateurs": [{"indicateur": "s", "cible": "s"}],
    "a_eviter": ["s"], "questions": ["s"], "note_interne": "s",
}
DIAG_PROPS = json.dumps({k: _schema(v) for k, v in DIAG_SPEC.items()}, ensure_ascii=False)
DIAG_REQUIRED = json.dumps(list(DIAG_SPEC.keys()))

# Diagnostic : l'agent envoie le résultat structuré au site, qui fabrique le PDF et envoie les e-mails
RESULT_DIAG = r"""const v = $('Valider et dédoublonner').first().json;
const body = v.body;
const SITE_URL = 'https://bintakande.com';
const send = (data) => [{ json: { url: `${SITE_URL}/api/agent-result`, payload: { orderId: body.orderId, product: body.product, ...data } } }];
const res = $input.first().json;
const cand = res.candidates?.[0];
const text = (cand?.content?.parts ?? []).map((p) => p.text ?? '').join('');
if (!text) return send({ ok: false, reason: res.promptFeedback?.blockReason ? `Bloqué par le modèle : ${res.promptFeedback.blockReason}` : 'Réponse vide du modèle' });
let out;
try { out = JSON.parse(text); } catch { return send({ ok: false, reason: cand?.finishReason === 'MAX_TOKENS' ? 'Réponse tronquée (limite de longueur)' : 'Réponse du modèle illisible (JSON invalide)' }); }
const warnings = [];
if (cand?.finishReason === 'MAX_TOKENS') warnings.push('Réponse tronquée (limite de longueur atteinte)');
if (!out.resume || String(out.resume).split(/\s+/).length < 25) return send({ ok: false, reason: 'Résumé absent ou trop court' });
if ((out.pistes ?? []).length !== 3) warnings.push(`Nombre de pistes inattendu (${(out.pistes ?? []).length} au lieu de 3)`);
if ((out.plan ?? []).length < 4) warnings.push('Plan d\'action incomplet (moins de 4 semaines)');
if ((out.scores ?? []).length < 6) warnings.push('Scores par axe incomplets');
if (!out.analyse_expert?.verdict || !out.analyse_expert?.lecture) warnings.push('Analyse de l\'expert incomplète');
if ((out.entonnoir ?? []).length < 5) warnings.push('Entonnoir incomplet');
if (body.lang === 'fr' && /\b(the|your|and)\b/i.test(String(out.resume).slice(0, 300))) warnings.push('Langue à vérifier (le début ressemble à de l\'anglais)');
const note = String(out.note_interne ?? '');
delete out.note_interne;
return send({ ok: true, result: out, warnings, note });
"""

FAIL_DIAG = r"""const v = $('Valider et dédoublonner').first().json;
const inp = $input.first().json;
const reason = Array.isArray(inp.problems) && inp.problems.length
  ? inp.problems.join(' ; ')
  : String(inp.error?.message ?? inp.error?.description ?? JSON.stringify(inp.error ?? inp)).slice(0, 400);
return [{ json: { url: 'https://bintakande.com/api/agent-result', payload: { orderId: v.body.orderId, product: v.body.product, ok: false, reason } } }];
"""

def build_diag(cfg):
    base = build(cfg)
    names = {n['name']: n for n in base['nodes']}
    keep = ["Webhook", "Valider et dédoublonner", "Données valides ?", "Préparer la requête", "Gemini Flash-Lite"]
    nodes = [names[k] for k in keep]
    nodes.append(node("Préparer le résultat", "n8n-nodes-base.code", 2, [1180, -160], {"jsCode": RESULT_DIAG}))
    nodes.append(node("Préparer l'échec", "n8n-nodes-base.code", 2, [1180, 120], {"jsCode": FAIL_DIAG}))
    nodes.append(node("Envoyer au site", "n8n-nodes-base.httpRequest", 4.2, [1440, 0], {
        "method": "POST", "url": "={{ $json.url }}",
        "authentication": "genericCredentialType", "genericAuthType": "httpHeaderAuth",
        "sendBody": True, "specifyBody": "json", "jsonBody": "={{ JSON.stringify($json.payload) }}", "options": {"timeout": 120000}},
        retryOnFail=True, maxTries=5, waitBetweenTries=15000, credentials={"httpHeaderAuth": {"id": "REMPLACER", "name": "Webhook Secret"}}))
    main = lambda *targets: {"main": [[{"node": t, "type": "main", "index": 0} for t in out] for out in targets]}
    conn = {
        "Webhook": main(["Valider et dédoublonner"]),
        "Valider et dédoublonner": main(["Données valides ?"]),
        "Données valides ?": main(["Préparer la requête"], ["Préparer l'échec"]),
        "Préparer la requête": main(["Gemini Flash-Lite"]),
        "Gemini Flash-Lite": main(["Préparer le résultat"], ["Préparer l'échec"]),
        "Préparer le résultat": main(["Envoyer au site"]),
        "Préparer l'échec": main(["Envoyer au site"]),
    }
    return {"name": cfg['name'], "nodes": nodes, "connections": conn, "settings": {"executionOrder": "v1"}}

def node(name, type_, ver, pos, params, **extra):
    n = {"parameters": params, "id": str(uuid.uuid4()), "name": name, "type": type_, "typeVersion": ver, "position": pos}
    n.update(extra)
    return n

def build(cfg):
    sys_prompt = json.dumps(rd(cfg['prompt_file']), ensure_ascii=False)
    fill = lambda s: (s.replace('__OWNER__', 'CHANGEZ-MOI@exemple.com').replace('__PRODUCT__', cfg['product'])
        .replace('__MIN_ANSWERS__', str(cfg['min_answers'])).replace('__MIN_CHARS__', str(cfg['min_chars']))
        .replace('__SYSTEM_PROMPT__', sys_prompt).replace('__TEMP__', str(cfg['temp'])).replace('__MAXTOK__', str(cfg['maxtok']))
        .replace('__PROPS__', cfg['props']).replace('__REQUIRED__', cfg['required']))
    hdr = {"httpHeaderAuth": {"id": "REMPLACER", "name": ""}}
    cred = lambda n: {"httpHeaderAuth": {"id": "REMPLACER", "name": n}}
    nodes = [
        node("Webhook", "n8n-nodes-base.webhook", 2, [0, 0],
             {"httpMethod": "POST", "path": cfg['product'], "authentication": "headerAuth", "responseMode": "onReceived", "options": {}},
             webhookId=str(uuid.uuid4()), credentials=cred("Webhook Secret")),
        node("Valider et dédoublonner", "n8n-nodes-base.code", 2, [220, 0], {"jsCode": fill(VALIDATE)}),
        node("Données valides ?", "n8n-nodes-base.if", 2.2, [440, 0], {
            "conditions": {"options": {"caseSensitive": True, "leftValue": "", "typeValidation": "strict", "version": 2},
                           "conditions": [{"id": str(uuid.uuid4()), "leftValue": "={{ $json.ok }}", "rightValue": "",
                                           "operator": {"type": "boolean", "operation": "true", "singleValue": True}}],
                           "combinator": "and"}, "options": {}}),
        node("Préparer la requête", "n8n-nodes-base.code", 2, [680, -100], {"jsCode": fill(REQUEST)}),
        node("Gemini Flash-Lite", "n8n-nodes-base.httpRequest", 4.2, [920, -100], {
            "method": "POST",
            "url": "=https://generativelanguage.googleapis.com/v1beta/models/{{ $json.config.MODEL }}:generateContent",
            "authentication": "genericCredentialType", "genericAuthType": "httpHeaderAuth",
            "sendBody": True, "specifyBody": "json", "jsonBody": "={{ JSON.stringify($json.requestBody) }}",
            "options": {"timeout": 150000}},
            retryOnFail=True, maxTries=3, waitBetweenTries=8000, onError="continueErrorOutput",
            credentials=cred("Gemini API key")),
        node("Préparer l'e-mail", "n8n-nodes-base.code", 2, [1180, -160], {"jsCode": HELPERS + cfg['email_code']}),
        node("Préparer l'alerte", "n8n-nodes-base.code", 2, [1180, 120], {"jsCode": HELPERS + ALERT}),
        node("Envoyer via Resend", "n8n-nodes-base.httpRequest", 4.2, [1440, 0], {
            "method": "POST", "url": "https://api.resend.com/emails",
            "authentication": "genericCredentialType", "genericAuthType": "httpHeaderAuth",
            "sendBody": True, "specifyBody": "json", "jsonBody": "={{ JSON.stringify($json.payload) }}", "options": {}},
            retryOnFail=True, maxTries=3, waitBetweenTries=5000,
            credentials=cred("Resend API key")),
        node("Statut", "n8n-nodes-base.code", 2, [1700, 0], {"jsCode": STATUS}),
        node("Confirmer au site", "n8n-nodes-base.httpRequest", 4.2, [1960, 0], {
            "method": "POST", "url": "={{ $json.url }}",
            "authentication": "genericCredentialType", "genericAuthType": "httpHeaderAuth",
            "sendBody": True, "specifyBody": "json", "jsonBody": "={{ JSON.stringify({ orderId: $json.orderId, kind: $json.kind, to: $json.to, mailId: $json.mailId }) }}", "options": {}},
            retryOnFail=True, maxTries=5, waitBetweenTries=10000, credentials=cred("Webhook Secret")),
    ]
    main = lambda *targets: {"main": [[{"node": t, "type": "main", "index": 0} for t in out] for out in targets]}
    conn = {
        "Webhook": main(["Valider et dédoublonner"]),
        "Valider et dédoublonner": main(["Données valides ?"]),
        "Données valides ?": main(["Préparer la requête"], ["Préparer l'alerte"]),
        "Préparer la requête": main(["Gemini Flash-Lite"]),
        "Gemini Flash-Lite": main(["Préparer l'e-mail"], ["Préparer l'alerte"]),
        "Préparer l'e-mail": main(["Envoyer via Resend"]),
        "Préparer l'alerte": main(["Envoyer via Resend"]),
        "Envoyer via Resend": main(["Statut"]),
        "Statut": main(["Confirmer au site"]),
    }
    return {"name": cfg['name'], "nodes": nodes, "connections": conn, "settings": {"executionOrder": "v1"}}

def build_watchdog():
    nodes = [
        node("Toutes les 10 minutes", "n8n-nodes-base.scheduleTrigger", 1.2, [0, 0],
             {"rule": {"interval": [{"field": "minutes", "minutesInterval": 10}]}}),
        node("Surveiller les livraisons", "n8n-nodes-base.httpRequest", 4.2, [260, 0], {
            "method": "POST", "url": "https://bintakande.com/api/watchdog",
            "authentication": "genericCredentialType", "genericAuthType": "httpHeaderAuth",
            "sendBody": True, "specifyBody": "json", "jsonBody": "={}", "options": {"timeout": 120000}},
            retryOnFail=True, maxTries=3, waitBetweenTries=30000, credentials={"httpHeaderAuth": {"id": "REMPLACER", "name": "Webhook Secret"}}),
    ]
    conn = {"Toutes les 10 minutes": {"main": [[{"node": "Surveiller les livraisons", "type": "main", "index": 0}]]}}
    return {"name": "Surveillance des livraisons", "nodes": nodes, "connections": conn, "settings": {"executionOrder": "v1"}}

CONFIGS = [
    dict(file='diagnostic.workflow.json', name='Diagnostic IA du business', product='diagnostic', prompt_file='diagnostic-prompt.md',
         min_answers=3, min_chars=120, temp=0.4, maxtok=16000, email_code=EMAIL_DIAG, site_result=True,
         props=DIAG_PROPS, required=DIAG_REQUIRED),
    dict(file='prompt.workflow.json', name='Master prompt', product='prompt', prompt_file='master-prompt-prompt.md',
         min_answers=4, min_chars=200, temp=0.5, maxtok=8192, email_code=EMAIL_PROMPT,
         props="{ master_prompt: { type: 'STRING' }, mode_emploi: { type: 'STRING' }, note_interne: { type: 'STRING' } }",
         required="['master_prompt', 'mode_emploi', 'note_interne']"),
]

if __name__ == '__main__':
    for c in CONFIGS:
        wf = build_diag(c) if c.get('site_result') else build(c)
        json.dump(wf, open(os.path.join(HERE, c['file']), 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
        print('écrit', c['file'], len(wf['nodes']), 'nœuds')
    json.dump(build_watchdog(), open(os.path.join(HERE, 'watchdog.workflow.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print('écrit watchdog.workflow.json')
