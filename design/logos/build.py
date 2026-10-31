"""Génère les 3 propositions de logo en SVG (texte converti en tracés, aucune police requise).
Usage : python3 design/logos/build.py   (il faut fonttools : pip3 install fonttools brotli)"""
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import os

HERE = os.path.dirname(__file__)
FONT = os.path.join(HERE, '../../node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2')

VIOLET, DEEP, ROUILLE, BEIGE, LILAS, MARINE = '#694cac', '#3b2a63', '#a3430f', '#f6f0e4', '#c6b8e4', '#1f1d3f'

def font(wght, wdth):
    f = TTFont(FONT)
    return instancer.instantiateVariableFont(f, {'wght': wght, 'wdth': wdth})

def text_path(f, s, size, x, y, tracking=0.0):
    """tracés SVG du texte s, ligne de base en (x, y). Renvoie (d, largeur)."""
    gs, cmap = f.getGlyphSet(), f.getBestCmap()
    upm = f['head'].unitsPerEm
    k = size / upm
    d, cx = [], x
    for ch in s:
        n = cmap[ord(ch)]
        pen = SVGPathPen(gs)
        gs[n].draw(TransformPen(pen, (k, 0, 0, -k, cx, y)))
        d.append(pen.getCommands())
        cx += gs[n].width * k + tracking * size
    return ' '.join(d), cx - x - tracking * size

def svg(w, h, body, bg=None):
    r = f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" aria-label="Binta Kande">{r}{body}</svg>\n'

def write(name, w, h, body, bg=None):
    open(os.path.join(HERE, name), 'w').write(svg(w, h, body, bg))

bold = font(800, 100)
semi = font(600, 100)
cond = font(700, 75)

# ---------- A : le point cuivre (le logo actuel, en plus soigné)
def logo_a(fg, dot, bg, name, tag):
    d, w = text_path(bold, 'Binta Kande', 120, 130, 150, -0.035)
    t, tw = text_path(semi, 'AUTOMATISATION · AGENTS IA · MARKETING', 20, 132, 192, 0.14)
    W = max(130 + w, 132 + tw) + 40
    body = f'<circle cx="68" cy="112" r="26" fill="{dot}"/><path d="{d}" fill="{fg}"/><path d="{t}" fill="{fg}" opacity=".7"/>'
    write(name, round(W), 230, body, bg)

# ---------- B : monogramme BK
def logo_b(sq, ltr, dot, bg, name, with_word=True):
    size, r = 108, 12
    _, bw = text_path(bold, 'B', size, 0, 0, -0.03)
    _, kw = text_path(bold, 'K', size, 0, 0, -0.03)
    total = bw + kw - 0.03 * size + 8 + 2 * r        # B + K + espace + point
    x0 = (230 - total) / 2
    bd, _ = text_path(bold, 'B', size, x0, 150, 0)
    kd, kwid = text_path(bold, 'K', size, x0 + bw - 0.03 * size, 150, 0)
    dx = x0 + bw - 0.03 * size + kwid + 8 + r
    body = f'<rect x="0" y="0" width="230" height="230" rx="46" fill="{sq}"/><path d="{bd}" fill="{ltr}"/><path d="{kd}" fill="{ltr}"/><circle cx="{dx:.1f}" cy="{150 - r:.1f}" r="{r}" fill="{dot}"/>'
    W = 230
    if with_word:
        wd, ww = text_path(bold, 'Binta Kande', 74, 268, 118, -0.03)
        td, tw = text_path(semi, 'AUTOMATISATION · IA · MARKETING', 17, 270, 158, 0.14)
        body += f'<path d="{wd}" fill="{sq if bg == BEIGE else ltr}"/><path d="{td}" fill="{sq if bg == BEIGE else ltr}" opacity=".7"/>'
        W = round(max(268 + ww, 270 + tw) + 40)
    write(name, W, 230, body, bg)

# ---------- C : l'orbite (reprend le visuel du hero)
def orbit(cx, cy, r, c1, c2, c3):
    e = f'rx="{r}" ry="{r*0.42}"'
    return (f'<g fill="none" stroke-width="7" stroke-linecap="round">'
            f'<ellipse cx="{cx}" cy="{cy}" {e} stroke="{c1}" transform="rotate(-28 {cx} {cy})"/>'
            f'<ellipse cx="{cx}" cy="{cy}" {e} stroke="{c1}" opacity=".55" transform="rotate(32 {cx} {cy})"/></g>'
            f'<circle cx="{cx}" cy="{cy}" r="17" fill="{c2}"/>'
            f'<circle cx="{cx + r*0.88:.1f}" cy="{cy - r*0.28:.1f}" r="9" fill="{c3}"/>')

def logo_c(fg, c1, c2, c3, bg, name):
    wd, ww = text_path(cond, 'BINTA KANDE', 78, 262, 108, 0.06)
    td, tw = text_path(semi, 'AUTOMATISATION · IA · MARKETING', 17, 264, 150, 0.14)
    body = orbit(115, 115, 98, c1, c2, c3) + f'<path d="{wd}" fill="{fg}"/><path d="{td}" fill="{fg}" opacity=".7"/>'
    write(name, round(max(262 + ww, 264 + tw) + 40), 230, body, bg)

logo_a(DEEP, ROUILLE, BEIGE, 'logo-a-point-cuivre.svg', 1)
logo_a(BEIGE, ROUILLE, DEEP, 'logo-a-point-cuivre-fonce.svg', 1)
logo_b(DEEP, BEIGE, ROUILLE, BEIGE, 'logo-b-monogramme.svg')
logo_b(ROUILLE, BEIGE, DEEP, DEEP, 'logo-b-monogramme-cuivre.svg')
logo_b(DEEP, BEIGE, ROUILLE, None, 'logo-b-icone.svg', with_word=False)
logo_c(DEEP, VIOLET, ROUILLE, ROUILLE, BEIGE, 'logo-c-orbite.svg')
logo_c(BEIGE, LILAS, ROUILLE, BEIGE, DEEP, 'logo-c-orbite-fonce.svg')
print('ok')
