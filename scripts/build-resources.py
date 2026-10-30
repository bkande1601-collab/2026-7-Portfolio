#!/usr/bin/env python3
"""
Génère les PDF des ressources gratuites à partir de src/content/resources.json.
Usage : python3 scripts/build-resources.py
Nécessite Google Chrome (impression en PDF en ligne de commande).
Les fichiers sont écrits dans public/ressources/<slug>-<fr|en>.pdf
"""
import html, json, os, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOMAIN = 'bintakande.com'
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
e = html.escape

CSS = '''
@page { size: A4; margin: 0 }
* { box-sizing: border-box }
body { margin: 0; font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; color: #2b1d16; font-size: 12.5px; line-height: 1.5 }
.head { background: radial-gradient(120% 120% at 90% 0%, #a3430f 0%, #5e2208 60%, #3b1405 100%); color: #f6f0e4; padding: 30px 46px 24px }
.brand { font-size: 12px; letter-spacing: .14em; text-transform: uppercase; opacity: .85 }
h1 { margin: 14px 0 8px; font-size: 27px; line-height: 1.1; color: #f6f0e4 }
.sub { margin: 0; color: #c6b8e4; font-size: 14px }
.body { padding: 18px 46px 4px }
.intro { font-size: 13px; margin: 0 0 12px }
h2 { color: #3b2a63; font-size: 15px; margin: 14px 0 6px }
table { width: 100%; border-collapse: collapse; margin: 6px 0 4px }
th { background: #3b2a63; color: #fff; text-align: left; padding: 7px 8px; font-size: 11px }
td { border: 1px solid #d9d0bd; padding: 7px 8px; vertical-align: top }
tr:nth-child(even) td { background: #f6f0e4 }
ul { list-style: none; padding: 0; margin: 4px 0 }
li { position: relative; padding: 4px 0 4px 26px }
li::before { content: ''; position: absolute; left: 0; top: 5px; width: 13px; height: 13px; border: 2px solid #694cac; border-radius: 3px }
.step { display: flex; gap: 12px; margin: 8px 0 }
.step b { flex: none; width: 24px; height: 24px; border-radius: 50%; background: #694cac; color: #fff; display: grid; place-items: center; font-size: 12px }
.step span { padding-top: 2px }
.box { margin: 14px 46px 0; page-break-inside: avoid; padding: 18px 22px; border-radius: 14px; background: #c6b8e4; color: #3b2a63 }
.box b { display: block; font-size: 15px; margin-bottom: 4px }
.box a { color: #3b2a63; font-weight: 700 }
.foot { margin: 10px 46px 0; padding-bottom: 6px; font-size: 10.5px; color: #675549 }
'''

def block(b):
    t = b['type']
    h = f"<h2>{e(b['title'])}</h2>" if b.get('title') else ''
    if t == 'text':
        return h + f"<p>{e(b['text'])}</p>"
    if t == 'checklist':
        return h + '<ul>' + ''.join(f'<li>{e(x)}</li>' for x in b['items']) + '</ul>'
    if t == 'steps':
        return h + ''.join(f"<div class='step'><b>{e(s['label'])}</b><span>{e(s['text'])}</span></div>" for s in b['items'])
    if t == 'table':
        head = ''.join(f'<th>{e(x)}</th>' for x in b['headers'])
        rows = ''.join('<tr>' + ''.join(f'<td>{e(c)}</td>' for c in r) + '</tr>' for r in b['rows'])
        return h + f'<table><tr>{head}</tr>{rows}</table>'
    return ''

def page(res, lang):
    d = res[lang]
    book = f'{DOMAIN}/{lang}/book'
    contact_label = 'Réserver un échange gratuit de 30 minutes' if lang == 'fr' else 'Book a free 30-minute call'
    foot = 'Ressource offerte par Binta Kande.' if lang == 'fr' else 'Free resource by Binta Kande.'
    return f'''<!doctype html><html lang="{lang}"><head><meta charset="utf-8"><title>{e(d['title'])}</title><style>{CSS}</style></head><body>
<div class="head"><div class="brand">Binta Kande</div><h1>{e(d['title'])}</h1><p class="sub">{e(d['subtitle'])}</p></div>
<div class="body"><p class="intro">{e(d['intro'])}</p>{''.join(block(b) for b in d['blocks'])}</div>
<div class="box"><b>{e(d['cta'])}</b>{contact_label} : <a href="https://{book}">{book}</a></div>
<div class="foot">{foot} {DOMAIN}</div></body></html>'''

def main():
    if not os.path.exists(CHROME):
        sys.exit('Google Chrome est introuvable : ' + CHROME)
    data = json.load(open(os.path.join(ROOT, 'src/content/resources.json'), encoding='utf-8'))
    out = os.path.join(ROOT, 'public/ressources')
    os.makedirs(out, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        for res in data:
            for lang in ('fr', 'en'):
                src = os.path.join(tmp, f"{res['slug']}-{lang}.html")
                open(src, 'w', encoding='utf-8').write(page(res, lang))
                dst = os.path.join(out, f"{res['slug']}-{lang}.pdf")
                subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-pdf-header-footer', f'--print-to-pdf={dst}', 'file://' + src],
                               check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=60)
                print('ok', dst)

main()
