#!/usr/bin/env node
/**
 * Passe DATABASE_URL en sslmode=disable dans Coolify (la base reste sur le réseau Docker privé du serveur),
 * puis redéploie. Le mot de passe de la base n'est ni affiché ni écrit sur disque.
 *
 * Usage : node scripts/coolify-db-ssl.mjs
 * Variables facultatives : COOLIFY_URL, COOLIFY_TOKEN
 */
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

const base = ((process.env.COOLIFY_URL || (await ask('Adresse de Coolify [https://coolify.bintakande.com] : '))) || 'https://coolify.bintakande.com').replace(/\/$/, '');
const token = process.env.COOLIFY_TOKEN || (await ask('Jeton API Coolify (Keys & Tokens > API tokens) : ', { secret: true }));
if (!token) { console.error('Jeton manquant.'); process.exit(1); }

async function api(method, path, body) {
  const res = await fetch(`${base}/api/v1${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text.slice(0, 200) }; }
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status} ${data.message ?? data.raw ?? ''}`);
  return data;
}

try {
  const apps = await api('GET', '/applications');
  const app = apps.find((a) => `${a.fqdn ?? ''} ${a.name ?? ''}`.toLowerCase().match(/bintakande|portfolio/));
  if (!app) throw new Error('Application du portfolio introuvable dans Coolify');
  console.log(`Application : ${app.name} (${app.fqdn ?? 'sans domaine'})`);

  const envs = await api('GET', `/applications/${app.uuid}/envs`);
  const matches = envs.filter((e) => e.key === 'DATABASE_URL');
  const current = matches.find((e) => !e.is_preview && (e.real_value || e.value)) ?? matches.find((e) => e.real_value || e.value);
  const raw = current?.real_value || current?.value;
  if (!raw) {
    console.log('Variables trouvées :', envs.map((e) => `${e.key}${e.is_preview ? ' (preview)' : ''}`).join(', ') || 'aucune');
    throw new Error('DATABASE_URL introuvable ou vide dans Coolify');
  }
  const url = new URL(raw);
  if (url.searchParams.get('sslmode') === 'disable') console.log('DATABASE_URL est déjà en sslmode=disable.');
  url.searchParams.set('sslmode', 'disable');
  await api('PATCH', `/applications/${app.uuid}/envs/bulk`, {
    data: [{ key: 'DATABASE_URL', value: url.toString(), is_build_time: false, is_preview: false, is_literal: true }],
  });
  console.log(`DATABASE_URL mise à jour (hôte ${url.hostname}, sslmode=disable). Redéploiement en cours…`);
  await api('POST', `/deploy?uuid=${app.uuid}&force=true`).catch(() => api('GET', `/deploy?uuid=${app.uuid}&force=true`));
  console.log('Déploiement lancé : attendez qu\'il soit vert, puis ouvrez https://bintakande.com/api/health');
} catch (e) {
  console.error('\nÉchec :', e.message);
  process.exit(1);
}
