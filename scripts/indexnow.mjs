#!/usr/bin/env node
/**
 * Prévient Bing, Yandex et les autres moteurs compatibles IndexNow que des pages ont changé.
 * (Google n'utilise pas IndexNow : pour Google, voir docs/referencement-google.md.)
 *
 * Usage : node scripts/indexnow.mjs            envoie toutes les pages du plan du site
 *         node scripts/indexnow.mjs <adresse>  envoie une seule adresse
 * Le fichier de clé public/c3a68134e60a0d992e1b514e09b79854.txt doit être en ligne (site déployé) avant d'envoyer.
 */
const HOST = 'bintakande.com';
const KEY = 'c3a68134e60a0d992e1b514e09b79854';
const ORIGIN = `https://${HOST}`;

let urls;
if (process.argv[2]) {
  urls = [process.argv[2]];
} else {
  const xml = await (await fetch(`${ORIGIN}/sitemap.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}
if (!urls.length) { console.error('Aucune adresse trouvée.'); process.exit(1); }

const keyCheck = await fetch(`${ORIGIN}/${KEY}.txt`);
if (!keyCheck.ok || (await keyCheck.text()).trim() !== KEY) {
  console.error(`Le fichier de clé n'est pas en ligne (${ORIGIN}/${KEY}.txt). Déployez le site d'abord.`);
  process.exit(1);
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${ORIGIN}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow : ${urls.length} adresses envoyées, réponse ${res.status} (200 ou 202 = accepté).`);
