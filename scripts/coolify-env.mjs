#!/usr/bin/env node
/**
 * Configure les variables d'environnement du portfolio dans Coolify via son API, puis redéploie.
 * Les valeurs non secrètes sont connues d'avance ; les secrets se tapent ici (saisie masquée) et seulement
 * s'ils ne sont pas déjà dans Coolify. Rien n'est affiché ni écrit sur disque.
 *
 * Usage : node scripts/coolify-env.mjs [--test-price]
 *   --test-price : utilise le prix de test à 0,50 € pour le diagnostic (sinon le vrai prix à 19 €)
 * Variables facultatives : COOLIFY_URL, COOLIFY_TOKEN
 */
import { randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import readline from 'node:readline';

const TEST_PRICE = process.argv.includes('--test-price');

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

// Valeurs connues (non secrètes). Les PUBLIC_* sont lues au build.
const PRICE_DIAGNOSTIC = TEST_PRICE ? 'price_1UWgYNRwHhVZvUGBRTX56XKH' : 'price_1UWafIRwHhVZvUGBlDDYwazb';
const fixed = {
  SITE_URL: 'https://bintakande.com',
  HOST: '0.0.0.0',
  PORT: '4321',
  PUBLIC_CHECKOUT: 'on',
  STRIPE_PRICE_DIAGNOSTIC: PRICE_DIAGNOSTIC,
  STRIPE_PRICE_PROMPT: 'price_1UWahqRwHhVZvUGBLgwvgHXo',
  N8N_WEBHOOK_URL: 'https://n8n.bintakande.com/webhook/diagnostic',
  PUBLIC_UMAMI_URL: 'https://stats.bintakande.com',
};
// Demandées seulement si absentes de Coolify : [clé, texte, secret ?]
const askIfMissing = [
  ['STRIPE_SECRET_KEY', 'Clé API Stripe restreinte (rk_live_...)', true],
  ['STRIPE_WEBHOOK_SECRET', 'Secret du webhook Stripe (whsec_...)', true],
  ['DATABASE_URL', 'Adresse de la base PostgreSQL (Postgres URL internal)', true],
  ['N8N_WEBHOOK_SECRET', 'Secret du webhook n8n', true],
  ['OWNER_EMAIL', 'Adresse e-mail qui reçoit les alertes', false],
  ['PUBLIC_UMAMI_ID', 'Website ID d\'Umami', false],
];

try {
  const apps = await api('GET', '/applications');
  const candidates = apps.filter((a) => `${a.fqdn ?? ''} ${a.name ?? ''}`.toLowerCase().match(/bintakande|portfolio/));
  if (!candidates.length) throw new Error('Application du portfolio introuvable dans Coolify');
  const app = candidates[0];
  console.log(`Application : ${app.name} (${app.fqdn ?? 'sans domaine'})`);

  const envs = await api('GET', `/applications/${app.uuid}/envs`);
  const have = new Set(envs.map((e) => e.key));

  const data = [];
  const add = (key, value) => data.push({ key, value, is_build_time: key.startsWith('PUBLIC_'), is_preview: false, is_literal: true });
  for (const [k, v] of Object.entries(fixed)) add(k, v);

  for (const [key, label, secret] of askIfMissing) {
    if (have.has(key)) { console.log(`${key} : déjà présent, inchangé`); continue; }
    const v = await ask(`${label} : `, { secret });
    if (v) add(key, v);
    else console.log(`${key} : ignoré`);
  }
  if (!have.has('ADMIN_PASSWORD')) {
    const pw = randomBytes(18).toString('base64url');
    add('ADMIN_PASSWORD', pw);
    const copied = spawnSync('pbcopy', { input: pw }).status === 0;
    console.log(`ADMIN_PASSWORD : généré${copied ? ' et copié dans votre presse-papiers (mot de passe de /admin : enregistrez-le dans votre gestionnaire)' : ''}`);
  }

  console.log('\nVariables envoyées à Coolify :', data.map((d) => d.key).join(', '));
  await api('PATCH', `/applications/${app.uuid}/envs/bulk`, { data });
  console.log('Variables enregistrées. Redéploiement en cours…');
  await api('GET', `/deploy?uuid=${app.uuid}&force=true`);
  console.log('Déploiement lancé : suivez-le dans Coolify (Deployment Logs).');
  if (TEST_PRICE) console.log('\n⚠ Prix de test à 0,50 € actif. Après votre essai, relancez : node scripts/coolify-env.mjs');
} catch (e) {
  console.error('\nÉchec :', e.message);
  console.error('Vérifiez l\'adresse, le jeton (permissions write et deploy) et que l\'API est activée (Settings > Advanced).');
  process.exit(1);
}
