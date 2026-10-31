#!/usr/bin/env node
/**
 * Resynchronise le secret du webhook entre le site (Coolify) et les workflows n8n :
 * génère un nouveau secret, crée l'identifiant « Webhook Secret » dans n8n, le branche sur les deux workflows,
 * l'enregistre dans Coolify (N8N_WEBHOOK_SECRET) puis redéploie le site. Le secret n'est jamais affiché.
 *
 * Usage : node scripts/fix-agent.mjs
 * Variables facultatives : N8N_URL, N8N_API_KEY, COOLIFY_URL, COOLIFY_TOKEN
 */
import { randomBytes } from 'node:crypto';
import readline from 'node:readline';

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

const n8n = ((process.env.N8N_URL || (await ask('Adresse de votre n8n [https://n8n.bintakande.com] : '))) || 'https://n8n.bintakande.com').replace(/\/$/, '');
const n8nKey = process.env.N8N_API_KEY || (await ask('Clé API n8n (Settings > n8n API) : ', { secret: true }));
const cool = ((process.env.COOLIFY_URL || (await ask('Adresse de Coolify [https://coolify.bintakande.com] : '))) || 'https://coolify.bintakande.com').replace(/\/$/, '');
const coolToken = process.env.COOLIFY_TOKEN || (await ask('Jeton API Coolify (read, write, deploy) : ', { secret: true }));
if (!n8nKey || !coolToken) { console.error('Clé ou jeton manquant.'); process.exit(1); }

async function call(label, url, headers, method, path, body) {
  const res = await fetch(`${url}${path}`, { method, headers: { ...headers, 'Content-Type': 'application/json', Accept: 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text.slice(0, 200) }; }
  if (!res.ok) throw new Error(`${label} ${method} ${path} -> ${res.status} ${data.message ?? data.raw ?? ''}`);
  return data;
}
const n8nApi = (m, p, b) => call('n8n', `${n8n}/api/v1`, { 'X-N8N-API-KEY': n8nKey }, m, p, b);
const coolApi = (m, p, b) => call('Coolify', `${cool}/api/v1`, { Authorization: `Bearer ${coolToken}` }, m, p, b);

try {
  const secret = randomBytes(32).toString('base64url');

  // 1. n8n : nouvel identifiant, branché sur les deux workflows
  const cred = await n8nApi('POST', '/credentials', { name: 'Webhook Secret', type: 'httpHeaderAuth', data: { name: 'X-Webhook-Secret', value: secret } });
  console.log('n8n : identifiant « Webhook Secret » créé');
  const list = (await n8nApi('GET', '/workflows?limit=250')).data ?? [];
  for (const name of ['Diagnostic IA du business', 'Master prompt']) {
    const w = list.find((x) => x.name === name);
    if (!w) { console.log(`n8n : workflow « ${name} » absent, ignoré`); continue; }
    const wf = await n8nApi('GET', `/workflows/${w.id}`);
    for (const n of wf.nodes) {
      if (n.credentials?.httpHeaderAuth?.name === 'Webhook Secret') n.credentials.httpHeaderAuth = { id: cred.id, name: 'Webhook Secret' };
    }
    await n8nApi('POST', `/workflows/${w.id}/deactivate`).catch(() => {});
    await n8nApi('PUT', `/workflows/${w.id}`, { name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: wf.settings });
    await n8nApi('POST', `/workflows/${w.id}/activate`);
    console.log(`n8n : « ${name} » mis à jour et activé`);
  }

  // 2. Coolify : même secret côté site, puis redéploiement
  const apps = await coolApi('GET', '/applications');
  const app = apps.find((a) => `${a.fqdn ?? ''} ${a.name ?? ''}`.toLowerCase().match(/bintakande|portfolio/));
  if (!app) throw new Error('Application du portfolio introuvable dans Coolify');
  await coolApi('PATCH', `/applications/${app.uuid}/envs/bulk`, { data: [{ key: 'N8N_WEBHOOK_SECRET', value: secret, is_build_time: false, is_preview: false, is_literal: true }] });
  console.log('Coolify : N8N_WEBHOOK_SECRET enregistré. Redéploiement…');
  await coolApi('POST', `/deploy?uuid=${app.uuid}&force=true`).catch(() => coolApi('GET', `/deploy?uuid=${app.uuid}&force=true`));
  console.log('\nTerminé. Attendez que Coolify passe au vert, puis dites-moi « fait ».');
} catch (e) {
  console.error('\nÉchec :', e.message);
  process.exit(1);
}
