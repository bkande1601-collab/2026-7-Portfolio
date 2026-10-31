"""Kit logo final (concept « plume ») : SVG sur fond transparent, toutes déclinaisons.
Usage : python3 design/logos/kit.py   puis  node design/logos/export-png.mjs"""
import os, math
from build import *

OUT = os.path.join(HERE, 'kit', 'svg')
os.makedirs(OUT, exist_ok=True)

def plume(ring, ring2, nuc, elec, uid='m'):
    """symbole final. L'électron est « découpé » dans l'anneau par un masque : fond transparent possible."""
    rx, ry = 106, 42
    ex, ey = pt(C, C, rx - 5, ry - 3, -30, math.radians(-50))
    def ringpath(rot, fill, op=1):
        o, i = crescent(C, C, rx, ry, rot, 20)
        return f'<path d="{o} {i}" fill="{fill}" fill-rule="evenodd" opacity="{op}" transform="rotate({rot} {C} {C})"/>'
    return (f'<defs><mask id="{uid}" maskUnits="userSpaceOnUse" x="0" y="0" width="240" height="240"><rect width="240" height="240" fill="#fff"/>'
            f'<circle cx="{ex:.1f}" cy="{ey:.1f}" r="19" fill="#000"/></mask></defs>'
            f'<g mask="url(#{uid})">{ringpath(30, ring2, .6)}{ringpath(-30, ring)}</g>'
            f'<circle cx="{C}" cy="{C}" r="23" fill="{nuc}"/><circle cx="{ex:.1f}" cy="{ey:.1f}" r="12" fill="{elec}"/>')

COLORS = {            # nom: (anneau, anneau 2, noyau, électron, texte)
    'couleur':     (DEEP, VIOLET, ROUILLE, ROUILLE, DEEP),
    'inverse':     (BEIGE, LILAS, ROUILLE, BEIGE, BEIGE),
    'violet':      (DEEP, DEEP, DEEP, DEEP, DEEP),
    'blanc':       ('#ffffff',) * 5,
    'noir':        ('#000000',) * 5,
}

def lockup2(name, c, tagline):
    sym = plume(*c[:4])
    size, s = 112, 250
    x0 = s + 14
    base = (113 if tagline else 125) + size * 0.36 - (8 if tagline else 0)
    nd, nw = text_path(800, 'Binta Kande', size, x0, base, -0.035)
    body = f'<g transform="translate(0 {125 - s / 2:.1f}) scale({s / 240:.4f})">{sym}</g><path d="{nd}" fill="{c[4]}"/>'
    W = x0 + nw
    if tagline:
        td, tw = text_path(600, 'AUTOMATISATION · AGENTS IA · MARKETING', 19.5, x0 + 4, base + 44, 0.14)
        body += f'<path d="{td}" fill="{c[4]}" opacity=".7"/>'
        W = max(W, x0 + 4 + tw)
    write2(name, round(W + 8), 250, body)

def write2(name, w, h, body):
    open(os.path.join(OUT, name), 'w').write(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" aria-label="Binta Kande">{body}</svg>\n')

for k, c in COLORS.items():
    lockup2(f'logo-complet-{k}.svg', c, True)
    lockup2(f'logo-nom-{k}.svg', c, False)
    write2(f'symbole-{k}.svg', 240, 240, plume(*c[:4]))

def icone(name, sq, c, scale=.9):
    write2(name, 240, 240, f'<rect width="240" height="240" rx="52" fill="{sq}"/><g transform="translate(120 120) scale({scale}) translate(-120 -120)">{plume(*c[:4])}</g>')
icone('icone-fonce.svg', DEEP, COLORS['inverse'])
icone('icone-cuivre.svg', ROUILLE, ('#ffffff', LILAS, DEEP, '#ffffff'))
icone('icone-beige.svg', BEIGE, COLORS['couleur'])
icone('favicon.svg', DEEP, COLORS['inverse'], 1.02)
print(len(os.listdir(OUT)), 'svg')

# ---- dossier « symboles et icônes » : sans fond / avec fond (SVG, PNG 1024)
SI = os.path.join(HERE, 'symboles-et-icones')
os.makedirs(os.path.join(SI, 'sans-fond'), exist_ok=True)
os.makedirs(os.path.join(SI, 'avec-fond'), exist_ok=True)
def put(folder, name, body):
    open(os.path.join(SI, folder, name), 'w').write(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240" role="img" aria-label="Binta Kande">{body}</svg>\n')
for k, c in COLORS.items():
    put('sans-fond', f'symbole-{k}.svg', plume(*c[:4]))
def carre(name, sq, c, scale=.9, radius=52):
    put('avec-fond', name, f'<rect width="240" height="240" rx="{radius}" fill="{sq}"/><g transform="translate(120 120) scale({scale}) translate(-120 -120)">{plume(*c[:4])}</g>')
carre('icone-arrondie-violet-fonce.svg', DEEP, COLORS['inverse'])
carre('icone-arrondie-cuivre.svg', ROUILLE, ('#ffffff', LILAS, DEEP, '#ffffff'))
carre('icone-arrondie-beige.svg', BEIGE, COLORS['couleur'])
carre('icone-carree-violet-fonce.svg', DEEP, COLORS['inverse'], .9, 0)
carre('icone-carree-cuivre.svg', ROUILLE, ('#ffffff', LILAS, DEEP, '#ffffff'), .9, 0)
carre('icone-carree-beige.svg', BEIGE, COLORS['couleur'], .9, 0)
put('avec-fond', 'icone-ronde-violet-fonce.svg', f'<circle cx="120" cy="120" r="120" fill="{DEEP}"/><g transform="translate(120 120) scale(.82) translate(-120 -120)">{plume(*COLORS["inverse"][:4])}</g>')
put('avec-fond', 'icone-ronde-cuivre.svg', f'<circle cx="120" cy="120" r="120" fill="{ROUILLE}"/><g transform="translate(120 120) scale(.82) translate(-120 -120)">{plume("#ffffff", LILAS, DEEP, "#ffffff")}</g>')
print('symboles et icônes ok')
