#!/usr/bin/env node
/**
 * Met à jour (ou crée) les workflows « Diagnostic IA du business » et « Master prompt » dans n8n,
 * en réutilisant les identifiants déjà créés par n8n-setup.mjs. Seule la clé API n8n est demandée.
 *
 * Usage : node scripts/n8n-update.mjs
 * Variables facultatives : N8N_URL, N8N_API_KEY
 */
import { readFileSync } from 'node:fs';
import readline from 'node:readline';

const FILES = ['diagnostic.workflow.json', 'prompt.workflow.json', 'watchdog.workflow.json'];
const dir = new URL('../docs/n8n/', import.meta.url);

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
if (!apiKey) { console.error('Clé API manquante.'); process.exit(1); }

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

try {
  const list = (await api('GET', '/workflows?limit=250')).data ?? [];
  const existingDiag = list.find((w) => w.name === 'Diagnostic IA du business');
  if (!existingDiag) throw new Error('Workflow « Diagnostic IA du business » introuvable : lancez d\'abord node scripts/n8n-setup.mjs');
  const current = await api('GET', `/workflows/${existingDiag.id}`);

  // identifiants déjà créés, retrouvés par leur nom
  const creds = {};
  for (const n of current.nodes) {
    const c = n.credentials?.httpHeaderAuth;
    if (c?.id) creds[c.name] = c;
  }
  for (const need of ['Webhook Secret', 'Gemini API key', 'Resend API key']) {
    if (!creds[need]) throw new Error(`Identifiant « ${need} » introuvable dans le workflow existant`);
  }
  const ownerMatch = current.nodes.map((n) => n.parameters?.jsCode?.match(/OWNER_EMAIL: '([^']+)'/)?.[1]).find(Boolean);
  if (!ownerMatch) throw new Error('Adresse OWNER_EMAIL introuvable dans le workflow existant');
  const oldWebhookId = current.nodes.find((n) => n.type === 'n8n-nodes-base.webhook')?.webhookId;

  for (const file of FILES) {
    const wf = JSON.parse(readFileSync(new URL(file, dir), 'utf8'));
    for (const node of wf.nodes) {
      if (node.credentials?.httpHeaderAuth) node.credentials.httpHeaderAuth = { id: creds[node.credentials.httpHeaderAuth.name].id, name: node.credentials.httpHeaderAuth.name };
      if (node.parameters?.jsCode) node.parameters.jsCode = node.parameters.jsCode.replace('CHANGEZ-MOI@exemple.com', ownerMatch);
    }
    const target = list.find((w) => w.name === wf.name);
    if (target) {
      if (wf.name === existingDiag.name && oldWebhookId) {
        const hook = wf.nodes.find((n) => n.type === 'n8n-nodes-base.webhook');
        if (hook) hook.webhookId = oldWebhookId;
      }
      await api('POST', `/workflows/${target.id}/deactivate`).catch(() => {});
      await api('PUT', `/workflows/${target.id}`, { name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: wf.settings });
      await api('POST', `/workflows/${target.id}/activate`);
      console.log(`Mis à jour et activé : « ${wf.name} »`);
    } else {
      const created = await api('POST', '/workflows', { name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: wf.settings });
      await api('POST', `/workflows/${created.id}/activate`);
      console.log(`Créé et activé : « ${wf.name} »`);
    }
  }
  console.log(`\nTerminé. Webhooks :\n  ${base}/webhook/diagnostic\n  ${base}/webhook/prompt`);
} catch (e) {
  console.error('\nÉchec :', e.message);
  process.exit(1);
}
