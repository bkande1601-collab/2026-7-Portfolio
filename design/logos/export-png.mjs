// Exporte les SVG du kit en PNG transparents (et PDF vectoriel pour l'impression).
// Usage : node design/logos/export-png.mjs   (il faut puppeteer-core et Google Chrome)
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const svgDir = path.join(here, 'kit/svg');
const pngDir = path.join(here, 'kit/png');
const pdfDir = path.join(here, 'kit/pdf');
[pngDir, pdfDir].forEach((d) => fs.mkdirSync(d, { recursive: true }));

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  args: ['--disable-gpu'],
});
const page = await browser.newPage();

async function shot(file, width, out) {
  const svg = fs.readFileSync(path.join(svgDir, file), 'utf8');
  const [, w, h] = svg.match(/width="(\d+)" height="(\d+)"/);
  const H = Math.round((width * h) / w);
  await page.setViewport({ width, height: H, deviceScaleFactor: 1 });
  await page.setContent(`<html><body style="margin:0;background:transparent"><img src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}" width="${width}" height="${H}" style="display:block"></body></html>`);
  await page.screenshot({ path: path.join(pngDir, out), omitBackground: true, clip: { x: 0, y: 0, width, height: H } });
}

for (const f of fs.readdirSync(svgDir).filter((x) => x.endsWith('.svg'))) {
  const base = f.replace('.svg', '');
  if (base.startsWith('logo-')) {
    await shot(f, 3000, `${base}-3000px.png`);
    await shot(f, 1000, `${base}-1000px.png`);
  } else if (base === 'favicon') {
    for (const n of [16, 32, 48, 180, 192, 512]) await shot(f, n, `favicon-${n}.png`);
  } else {
    await shot(f, 2048, `${base}-2048px.png`);
    await shot(f, 512, `${base}-512px.png`);
    await shot(f, 128, `${base}-128px.png`);
  }
}
// PDF vectoriel des logos complets en couleur (impression)
for (const f of ['logo-complet-couleur.svg', 'logo-complet-noir.svg', 'logo-nom-couleur.svg', 'symbole-couleur.svg']) {
  const svg = fs.readFileSync(path.join(svgDir, f), 'utf8');
  const [, w, h] = svg.match(/width="(\d+)" height="(\d+)"/);
  await page.setContent(`<html><body style="margin:0"><style>@page{size:${w}px ${h}px;margin:0}</style>${svg}</body></html>`);
  await page.pdf({ path: path.join(pdfDir, f.replace('.svg', '.pdf')), width: `${w}px`, height: `${h}px`, printBackground: false });
}
await browser.close();
process.exit(0);
