#!/usr/bin/env node
/**
 * Installe l'agent « Diagnostic » dans n8n via son API REST :
 * crée les 3 identifiants (Webhook Secret, Gemini, Resend), importe le workflow,
 * le relie aux identifiants, l'active et copie le secret du webhook dans le presse-papiers.
 * Les clés se tapent dans le terminal (saisie masquée) : elles ne sont ni affichées ni écrites sur disque.
 *
 * Usage : node scripts/n8n-setup.mjs
 * Variables facultatives (évitent la question) : N8N_URL, N8N_API_KEY, GEMINI_API_KEY, RESEND_API_KEY, OWNER_EMAIL
 */
import { readFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import readline from 'node:readline';

const WORKFLOW = new URL('../docs/n8n/diagnostic.workflow.json', import.meta.url);

function ask(question, { secret = false } = {}) {
  return new Promise((resolve) => {
    if (!secret || !process.stdin.isTTY) {
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      rl.question(question, (a) => { rl.close(); resolve(a.trim()); });
      return;
    }
    process.stdout.write(question);
    let value = '';
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    const onData = (ch) => {
      for (const c of ch) {
        if (c === '\u0003') { process.stdout.write('\n'); process.exit(130); }
        if (c === '\r' || c === '\n') {
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdin.off('data', onData);
          process.stdout.write('\n');
          return resolve(value.trim());
        }
        if (c === '\u007f' || c === '\b') value = value.slice(0, -1);
        else value += c;
      }
    };
    process.stdin.on('data', onData);
  });
}

const base = ((process.env.N8N_URL || (await ask('Adresse de votre n8n [https://n8n.bintakande.com] : '))) || 'https://n8n.bintakande.com').replace(/\/$/, '');
const apiKey = process.env.N8N_API_KEY || (await ask('Clé API n8n (Settings > n8n API) : ', { secret: true }));
const geminiKey = process.env.GEMINI_API_KEY || (await ask('Clé API Gemini : ', { secret: true }));
const resendKey = process.env.RESEND_API_KEY || (await ask('Clé API Resend : ', { secret: true }));
const owner = process.env.OWNER_EMAIL || (await ask('Adresse e-mail qui reçoit les diagnostics : '));
if (!apiKey || !geminiKey || !resendKey || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(owner)) {
  console.error('Information manquante ou invalide, rien n\'a été créé.');
  process.exit(1);
}

async function api(method, path, body) {
  const res = await fetch(`${base}/api/v1${path}`, {
    method,
    headers: { 'X-N8N-API-KEY': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text.slice(0, 200) }; }
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status} ${data.message ?? data.raw ?? ''}`);
  return data;
}

const webhookSecret = randomBytes(32).toString('base64url');

try {
  await api('GET', '/workflows?limit=1'); // vérifie l'adresse et la clé API
  const mk = (name, headerName, value) =>
    api('POST', '/credentials', { name, type: 'httpHeaderAuth', data: { name: headerName, value } });

  const cWebhook = await mk('Webhook Secret', 'X-Webhook-Secret', webhookSecret);
  const cGemini = await mk('Gemini API key', 'x-goog-api-key', geminiKey);
  const cResend = await mk('Resend API key', 'Authorization', `Bearer ${resendKey}`);
  console.log('Identifiants créés.');

  const byName = { 'Webhook Secret': cWebhook, 'Gemini API key': cGemini, 'Resend API key': cResend };
  const wf = JSON.parse(readFileSync(WORKFLOW, 'utf8'));
  for (const node of wf.nodes) {
    const c = node.credentials?.httpHeaderAuth;
    if (c) node.credentials.httpHeaderAuth = { id: byName[c.name].id, name: c.name };
    if (node.name === 'Préparer la requête') node.parameters.jsCode = node.parameters.jsCode.replace('CHANGEZ-MOI@exemple.com', owner);
  }

  const created = await api('POST', '/workflows', { name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: wf.settings });
  await api('POST', `/workflows/${created.id}/activate`);
  console.log(`Workflow « ${wf.name} » importé et activé (id ${created.id}).`);

  const url = `${base}/webhook/diagnostic`;
  const copied = spawnSync('pbcopy', { input: webhookSecret }).status === 0;
  console.log('\nÀ ajouter dans Coolify (application du portfolio, Environment Variables) :');
  console.log(`  N8N_WEBHOOK_URL=${url}`);
  console.log(`  N8N_WEBHOOK_SECRET=${copied ? '(copié dans votre presse-papiers : collez-le)' : webhookSecret}`);
} catch (e) {
  console.error('\nÉchec :', e.message);
  console.error('Vérifiez l\'adresse de n8n, la clé API, et que l\'API publique est activée.');
  process.exit(1);
}
